const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable').default || require('jspdf-autotable');

// Carregar variáveis de ambiente
const envPath = path.join(__dirname, '..', '.env');
const envLocalPath = path.join(__dirname, '..', '.env.local');

let envText = '';
if (fs.existsSync(envPath)) envText += fs.readFileSync(envPath, 'utf8') + '\n';
if (fs.existsSync(envLocalPath)) envText += fs.readFileSync(envLocalPath, 'utf8') + '\n';

const envVars = {};
for (const line of envText.split('\n')) {
  const parts = line.split('=');
  const k = parts[0] ? parts[0].trim() : '';
  const v = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  if (k) envVars[k] = v;
}

const GEMINI_API_KEY = envVars.GEMINI_API_KEY || envVars.VITE_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('ERRO: GEMINI_API_KEY não encontrada no ambiente!');
  process.exit(1);
}

const DESKTOP_OUT_DIR = 'C:/Users/Administrator/Desktop/Treinos_Gerados_IA';
if (!fs.existsSync(DESKTOP_OUT_DIR)) {
  fs.mkdirSync(DESKTOP_OUT_DIR, { recursive: true });
}

async function callGemini(systemPrompt, userPrompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
  
  const body = {
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json'
    }
  };

  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API Error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini retornou conteúdo vazio.');
  }

  // Parse defensivo
  const clean = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  return JSON.parse(clean);
}

function gerarPdfTreino(filename, metadata, days, notes) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 40;

  // Header
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, pageWidth, 60, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('COACH MONTANHA — SISTEMA DE PRESCRIÇÃO COM IA', 40, 36);

  y = 80;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(18);
  doc.text(metadata.titulo, 40, y);
  y += 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Metodologia: ${metadata.metodologia} | Escola/Variação: ${metadata.escola}`, 40, y);
  y += 14;
  doc.text(`Motor IA: ${metadata.modelo} | Data de Geração: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 40, y);
  y += 18;

  if (notes) {
    doc.setFillColor(245, 247, 250);
    doc.setDrawColor(220, 225, 230);
    doc.roundedRect(40, y, pageWidth - 80, 48, 4, 4, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(40, 60, 100);
    doc.text('RELATÓRIO DE EVOLUÇÃO E NOTAS METODOLÓGICAS:', 48, y + 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    const splitNotes = doc.splitTextToSize(notes, pageWidth - 96);
    doc.text(splitNotes.slice(0, 3), 48, y + 26);
    y += 58;
  }

  days.forEach((day, index) => {
    if (y > 700) {
      doc.addPage();
      y = 40;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text(`${day.name || `Sessão ${index + 1}`}  •  ${day.day_label || `Dia ${index + 1}`}`, 40, y);
    y += 14;

    if (day.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const splitDesc = doc.splitTextToSize(day.description, pageWidth - 80);
      doc.text(splitDesc, 40, y);
      y += splitDesc.length * 10 + 4;
    }

    const rows = (day.exercises || []).map(ex => [
      ex.name || 'Exercício',
      ex.sets_reps || ex.series || '3x10',
      ex.load || '-',
      ex.rest_seconds ? `${ex.rest_seconds}s` : (ex.descanso || '-'),
      ex.observations || ex.observacoes || '-'
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Exercício', 'Séries/Reps/Tempo', 'Carga', 'Descanso', 'Observações / Detalhes']],
      body: rows,
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [40, 45, 55], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 40, right: 40 }
    });

    const anyDoc = doc;
    y = (anyDoc.lastAutoTable?.finalY || y) + 20;
  });

  const fullPath = path.join(DESKTOP_OUT_DIR, filename);
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(fullPath, pdfBuffer);
  return { path: fullPath, size: pdfBuffer.length };
}

// DEFINIÇÃO DOS CASOS DE TESTE COBRINDO TODAS AS METODOLOGIAS E VARIAÇÕES
const TEST_CASES = [
  {
    id: 'kettlebell_fitness',
    filename: '01_Kettlebell_Fitness_Flows.pdf',
    metodologia: 'Kettlebell Fitness',
    escola: 'KB Flows / Complexos Fluidos',
    systemPrompt: `Você é um treinador especialista em Kettlebell Fitness da escola Coach Montanha.
Prescreva treinos em formato JSON rigoroso:
{
  "days": [
    {
      "name": "Kettlebell Flow & Densidade",
      "day_label": "S1D1",
      "week_number": 1,
      "description": "Fluência articular, ativação balística e complexo contínuo de kettlebell",
      "exercises": [
        { "name": "Alongamento de Adutores", "sets_reps": "2x10 reps", "load": "Peso corporal", "rest_seconds": 30, "observations": "Mobilidade de quadril" },
        { "name": "Burpees com Salto Horizontal", "sets_reps": "2x8 reps", "load": "Peso corporal", "rest_seconds": 45, "observations": "Ativação pliométrica" },
        { "name": "Black/Dirty Clean 2-1", "sets_reps": "4x8 reps", "load": "16kg a 20kg", "rest_seconds": 60, "observations": "Transição técnica limpa" },
        { "name": "Goblet Squat", "sets_reps": "4x10 reps", "load": "20kg", "rest_seconds": 60, "observations": "Profundidade e postura" },
        { "name": "Figura 8 Clean", "sets_reps": "3x12 reps", "load": "16kg", "rest_seconds": 45, "observations": "Controle rotacional" }
      ]
    }
  ],
  "notes": "RELATÓRIO: Periodização ondulatória com foco em densidade e cadência fluida."
}`,
    userPrompt: `Gere uma sessão avançada de Kettlebell Fitness com 1 sessão completa (Aquecimento, Ativação e Bloco Principal de Flow) usando nomes oficiais de exercícios da biblioteca Coach Montanha.`
  },
  {
    id: 'hibrido',
    filename: '02_Treinamento_Hibrido_MetCon.pdf',
    metodologia: 'Treinamento Híbrido',
    escola: 'Força Funcional & MetCon Híbrido',
    systemPrompt: `Você é um treinador de Treinamento Híbrido. Integre força composta com condicionamento metabólico tridimensional.
Formato JSON:
{
  "days": [
    {
      "name": "Força Composta + MetCon Híbrido",
      "day_label": "S1D1",
      "week_number": 1,
      "description": "Estímulo neuromuscular e resistência metabólica integrada",
      "exercises": [
        { "name": "Alongamento de Ísquios", "sets_reps": "2x30s", "load": "Corporal", "rest_seconds": 30, "observations": "Preparação da cadeia posterior" },
        { "name": "Barbell Deadlift", "sets_reps": "4x6 reps", "load": "75% 1RM", "rest_seconds": 120, "observations": "Tensão constante e travamento escapular" },
        { "name": "Kettlebell Swing Russo", "sets_reps": "4x15 reps", "load": "24kg", "rest_seconds": 60, "observations": "Extensão potente de quadril" },
        { "name": "Burpees + Caixa", "sets_reps": "3x10 reps", "load": "Corporal", "rest_seconds": 45, "observations": "Ritmo contínuo" },
        { "name": "Prancha Isométrica com Toque", "sets_reps": "3x40s", "load": "Corporal", "rest_seconds": 30, "observations": "Anti-rotação de core" }
      ]
    }
  ],
  "notes": "RELATÓRIO: Equilíbrio metabólico glicolítico e oxidativo com base em força pura."
}`,
    userPrompt: `Gere 1 sessão de Treinamento Híbrido combinando Mobilidade, Bloco de Força com Barra/Halteres e MetCon com Kettlebell e Ginásticos.`
  },
  {
    id: 'kb_sport_fedorenko',
    filename: '03_Kettlebell_Sport_Fedorenko_LongCycle.pdf',
    metodologia: 'Kettlebell Sport (Girevoy)',
    escola: 'Fedorenko / WKC (Long Cycle)',
    systemPrompt: `Você é especialista em Kettlebell Sport na linha Fedorenko / WKC. Foco em Long Cycle, ritmo fixo (rpm), economia de energia e séries por tempo.
Formato JSON:
{
  "days": [
    {
      "name": "Long Cycle — Construção de Pace",
      "day_label": "Dia 1",
      "week_number": 1,
      "description": "Acúmulo de tempo sob tensão e fixação no rack",
      "exercises": [
        { "name": "Aquecimento com Swing Unilateral", "sets_reps": "2x2min", "load": "16kg", "rest_seconds": 60, "observations": "14 rpm, troca a cada minuto" },
        { "name": "Long Cycle Clássico", "sets_reps": "3x5min", "load": "2x20kg", "rest_seconds": 180, "observations": "Pace alvo: 8-9 rpm constante" },
        { "name": "Rack Hold Isométrico", "sets_reps": "3x2min", "load": "2x24kg", "rest_seconds": 90, "observations": "Suporte torácico e respiração anatômica" },
        { "name": "Alongamento de Antebraço e Ombros", "sets_reps": "3x45s", "load": "Corporal", "rest_seconds": 30, "observations": "Descompressão fascial" }
      ]
    }
  ],
  "notes": "RELATÓRIO: Linha Fedorenko com ênfase na constância de pace de 8 rpm e eficiência mecânica de pêndulo."
}`,
    userPrompt: `Gere uma sessão de Kettlebell Sport especializada em Long Cycle de 10 minutos (dividida em sets de 5 min) segundo a metodologia Fedorenko.`
  },
  {
    id: 'kb_sport_rudnev',
    filename: '04_Kettlebell_Sport_Rudnev_Biathlon.pdf',
    metodologia: 'Kettlebell Sport (Girevoy)',
    escola: 'Rudnev (Biathlon: Jerk + Snatch)',
    systemPrompt: `Você é especialista em Kettlebell Sport na linha Sergey Rudnev. Foco em Biathlon (Jerk bilateral + Snatch unilateral), controle de fadiga e respiração cíclica.
Formato JSON:
{
  "days": [
    {
      "name": "Biathlon — Jerk e Snatch Integrados",
      "day_label": "Dia 1",
      "week_number": 1,
      "description": "Dupla flexão no Jerk e fixação estável no Snatch",
      "exercises": [
        { "name": "Mobilidade Torácica & Ombros", "sets_reps": "1x5min", "load": "Corporal", "rest_seconds": 0, "observations": "Abertura para lockout estável" },
        { "name": "Jerk Bilateral (Arremesso)", "sets_reps": "4x3min", "load": "2x24kg", "rest_seconds": 120, "observations": "10 rpm, ritmo cadenciado" },
        { "name": "Snatch (Arranco)", "sets_reps": "1x8min", "load": "20kg", "rest_seconds": 180, "observations": "Troca única de mão no 4º minuto, 16 rpm" },
        { "name": "Agachamento Jump Leve", "sets_reps": "3x15 reps", "load": "16kg", "rest_seconds": 60, "observations": "Potência elástica de pernas" }
      ]
    }
  ],
  "notes": "RELATÓRIO: Periodização Rudnev com alternância de estímulos concêntricos e balísticos de alta velocidade."
}`,
    userPrompt: `Gere uma sessão técnica de Kettlebell Sport na linha Rudnev com Jerk bilateral e Snatch contínuo.`
  },
  {
    id: 'lpo_russa',
    filename: '05_LPO_Russa_Classica.pdf',
    metodologia: 'Levantamento de Peso Olímpico (LPO)',
    escola: 'Russa Clássica (Medvedev)',
    systemPrompt: `Você é treinador de Weightlifting na escola Russa Clássica de Medvedev. Distribuição de volume e técnica com variações parciais e agachamento.
Formato JSON:
{
  "days": [
    {
      "name": "Arranco Técnico & Puxadas Altas",
      "day_label": "Sessão 1",
      "week_number": 1,
      "description": "Fase preparatória especial com ênfase na segunda puxada",
      "exercises": [
        { "name": "Aquecimento com Barra Vazia", "sets_reps": "3x10 reps", "load": "20kg", "rest_seconds": 60, "observations": "Snatch balance e mobilidade de tornozelo" },
        { "name": "Arranco do Bloco (Snatch from Blocks)", "sets_reps": "5x2 reps", "load": "75% - 82%", "rest_seconds": 120, "observations": "Aceleração máxima acima dos joelhos" },
        { "name": "Puxada de Arranco (Snatch Pull)", "sets_reps": "4x3 reps", "load": "95% - 105%", "rest_seconds": 150, "observations": "Extensão tripla violenta de tornozelo, joelho e quadril" },
        { "name": "Agachamento Costas (Back Squat)", "sets_reps": "4x4 reps", "load": "80%", "rest_seconds": 180, "observations": "Descida controlada, subida explosiva" },
        { "name": "Hiperextensão Lombar", "sets_reps": "3x12 reps", "load": "15kg", "rest_seconds": 60, "observations": "Reforço de cadeia eretora" }
      ]
    }
  ],
  "notes": "RELATÓRIO: Escola Russa com tonelagem moderada, ênfase na consistência geométrica da trajetória da barra."
}`,
    userPrompt: `Gere uma sessão de LPO da Escola Russa Clássica para arranco, puxada e agachamento costas com percentuais definidos.`
  },
  {
    id: 'lpo_takano',
    filename: '06_LPO_Takano_Volume.pdf',
    metodologia: 'Levantamento de Peso Olímpico (LPO)',
    escola: 'Takano (Framework Científico Japonês)',
    systemPrompt: `Você é treinador de LPO no método científico de Bob Takano. Foco em controle estrito de tonelagem e distribuição de repetições por zona de intensidade.
Formato JSON:
{
  "days": [
    {
      "name": "Clean & Jerk — Volume e Precisão",
      "day_label": "Sessão 1",
      "week_number": 1,
      "description": "Desenvolvimento de potência na recepção e split jerk simétrico",
      "exercises": [
        { "name": "Alongamento de Punho e Ombros", "sets_reps": "2x5min", "load": "Corporal", "rest_seconds": 30, "observations": "Rack position segura" },
        { "name": "Arremesso Completo (Clean & Jerk)", "sets_reps": "6x1+1 reps", "load": "70% a 85%", "rest_seconds": 150, "observations": "Recuperação imediata do split jerk" },
        { "name": "Clean Deadlift", "sets_reps": "4x3 reps", "load": "100%", "rest_seconds": 120, "observations": "Manter ângulo de tronco constante até o joelho" },
        { "name": "Agachamento Frontal (Front Squat)", "sets_reps": "4x3 reps", "load": "82%", "rest_seconds": 150, "observations": "Cotovelos altos durante toda a subida" }
      ]
    }
  ],
  "notes": "RELATÓRIO: Método Takano com 22 repetições totais na faixa ótima de 70-85% da 1RM."
}`,
    userPrompt: `Gere uma sessão de LPO no método Takano para Clean & Jerk e agachamento frontal com foco em qualidade técnica.`
  },
  {
    id: 'funcional_boyle',
    filename: '07_Funcional_Boyle.pdf',
    metodologia: 'Treinamento Funcional',
    escola: 'Michael Boyle (Joint-by-Joint & Unilateral)',
    systemPrompt: `Você é treinador funcional seguindo estritamente a metodologia de Michael Boyle (MBSC). Princípio articulação por articulação, domínio unilateral e prevenção de lesões.
Formato JSON:
{
  "days": [
    {
      "name": "Força Unilateral e Estabilidade Core",
      "day_label": "Treino A",
      "week_number": 1,
      "description": "Mobilidade de tornozelo/quadril e força unilateral de membros inferiores e superiores",
      "exercises": [
        { "name": "Liberação Miofascial e Mobilidade Torácica", "sets_reps": "2x8 reps", "load": "Rolo / Corporal", "rest_seconds": 30, "observations": "Respiração e descompressão" },
        { "name": "Bulgarian Split Squat (Agachamento Búlgaro)", "sets_reps": "3x8 reps cada lado", "load": "2x16kg", "rest_seconds": 60, "observations": "Joelho alinhado com 2º dedo do pé" },
        { "name": "Remada Unilateral com Halter (1-Arm Row)", "sets_reps": "3x10 reps", "load": "22kg", "rest_seconds": 60, "observations": "Anti-rotação da pelve" },
        { "name": "Single Leg RDL (Terra Unilateral)", "sets_reps": "3x8 reps cada lado", "load": "18kg", "rest_seconds": 60, "observations": "Hinge puro de quadril" },
        { "name": "Pallof Press Isométrico", "sets_reps": "3x30s cada lado", "load": "Elástico/Cabo", "rest_seconds": 45, "observations": "Anti-rotação estrita de tronco" }
      ]
    }
  ],
  "notes": "RELATÓRIO: Abordagem Boyle sem compressão axial na coluna lombar, priorizando força unilateral real."
}`,
    userPrompt: `Gere uma sessão de Treinamento Funcional da Escola Michael Boyle com foco unilateral e ativação de core anti-rotacional.`
  },
  {
    id: 'corrida_daniels',
    filename: '08_Corrida_Jack_Daniels_10k.pdf',
    metodologia: 'Corrida (Endurance)',
    escola: 'Jack Daniels (Fórmula de Corrida VDOT)',
    systemPrompt: `Você é treinador de corrida na metodologia de Jack Daniels (VDOT). Use as zonas de intensidade: E (Easy), M (Marathon), T (Threshold/Limiar), I (Interval/VO2max) e R (Repetition).
Formato JSON:
{
  "days": [
    {
      "name": "Treino de Limiar de Lactato (Cruise Intervals)",
      "day_label": "Sessão Qualidade 1",
      "week_number": 1,
      "description": "Desenvolvimento do limiar anaeróbio e economia de corrida",
      "exercises": [
        { "name": "Aquecimento em Ritmo Fácil (E)", "sets_reps": "1x15 min", "load": "Pace 5:40/km", "rest_seconds": 0, "observations": "Conversacional, elevação gradual da FC" },
        { "name": "Educativos de Corrida & Strides", "sets_reps": "4x100m", "load": "Aceleração", "rest_seconds": 45, "observations": "Skips, dribbling e passadas rápidas" },
        { "name": "Tiros de Limiar (T - Threshold)", "sets_reps": "5x1000m", "load": "Pace 4:15/km", "rest_seconds": 60, "observations": "Recuperação ativa trote de 1 minuto entre tiros" },
        { "name": "Desaquecimento (Cool down)", "sets_reps": "1x10 min", "load": "Pace 6:00/km", "rest_seconds": 0, "observations": "Trote leve regenerativo" },
        { "name": "Alongamento Estático & Panturrilhas", "sets_reps": "3x30s", "load": "Corporal", "rest_seconds": 30, "observations": "Retorno venoso e alívio do tríceps sural" }
      ]
    }
  ],
  "notes": "RELATÓRIO: Sessão Daniels com 5km totais no ritmo T para elevar a velocidade no limiar de lactato sem acúmulo excessivo de fadiga."
}`,
    userPrompt: `Gere uma sessão de treino intervalado de corrida Jack Daniels para atleta de 10km visando limiar de lactato.`
  },
  {
    id: 'musculacao_hipertrofia',
    filename: '09_Musculacao_Hipertrofia.pdf',
    metodologia: 'Musculação Clássica',
    escola: 'Periodização de Hipertrofia & Força',
    systemPrompt: `Você é um Personal Trainer especialista em Musculação de sala de pesos. Monte divisões com foco muscular, repetições, cadência, carga e descanso.
Formato JSON:
{
  "days": [
    {
      "name": "Peito, Ombros e Tríceps (Push Day)",
      "day_label": "Treino A",
      "week_number": 1,
      "description": "Ênfase em tensão mecânica e estímulo de empurrar",
      "exercises": [
        { "name": "Supino Reto com Barra", "sets_reps": "4x8 reps", "load": "75kg", "rest_seconds": 90, "observations": "Cadência 3:1:0, arco lombar estável" },
        { "name": "Supino Inclinado com Halteres", "sets_reps": "3x10 reps", "load": "26kg cada", "rest_seconds": 75, "observations": "Alongamento máximo na base" },
        { "name": "Desenvolvimento Militar com Barra", "sets_reps": "3x8 reps", "load": "45kg", "rest_seconds": 90, "observations": "Press estrito sem impulso de pernas" },
        { "name": "Elevação Lateral com Halteres", "sets_reps": "4x12 reps", "load": "12kg cada", "rest_seconds": 60, "observations": "Pausa isométrica de 1s no topo" },
        { "name": "Tríceps Testa com Barra W", "sets_reps": "3x10 reps", "load": "32kg", "rest_seconds": 60, "observations": "Cotovelos fechados apontados para frente" }
      ]
    }
  ],
  "notes": "RELATÓRIO: Volume ótimo de 17 séries com cadência controlada e progressão planejada de sobrecarga."
}`,
    userPrompt: `Gere um treino de Musculação tradicional de empurrar (Peito, Ombros e Tríceps) para hipertrofia avançada.`
  }
];

async function runTestSuite() {
  console.log('========================================================================');
  console.log('🚀 INICIANDO BATERIA DE TESTES DE PRESCRIÇÃO COM IA — ECOSSISTEMA MONTANHA');
  console.log(`📁 Pasta de Saída no Desktop: ${DESKTOP_OUT_DIR}`);
  console.log(`🤖 Modelo IA: gemini-3.5-flash-lite`);
  console.log(`📊 Total de Cenários/Variações a Testar: ${TEST_CASES.length}`);
  console.log('========================================================================\n');

  const results = [];

  for (let i = 0; i < TEST_CASES.length; i++) {
    const tc = TEST_CASES[i];
    console.log(`[${i + 1}/${TEST_CASES.length}] Testando: ${tc.metodologia} — ${tc.escola}...`);

    const start = Date.now();
    try {
      const generated = await callGemini(tc.systemPrompt, tc.userPrompt);
      const days = generated.days || [];
      const notes = generated.notes || '';

      if (days.length === 0) {
        throw new Error('A IA não retornou nenhum dia de treino.');
      }

      const totalExercises = days.reduce((acc, d) => acc + (d.exercises?.length || 0), 0);
      console.log(`  ✓ Resposta válida da IA: ${days.length} dia(s), ${totalExercises} exercícios no total.`);

      // Gerar PDF
      const pdfInfo = gerarPdfTreino(
        tc.filename,
        {
          titulo: days[0]?.name || tc.metodologia,
          metodologia: tc.metodologia,
          escola: tc.escola,
          modelo: 'Google Gemini 3.5 Flash Lite'
        },
        days,
        notes
      );

      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`  ✓ PDF gerado com sucesso: ${tc.filename} (${pdfInfo.size} bytes) em ${elapsed}s\n`);

      results.push({
        id: tc.id,
        metodologia: tc.metodologia,
        escola: tc.escola,
        status: 'SUCESSO',
        arquivo: tc.filename,
        tamanhoBytes: pdfInfo.size,
        tempoSegundos: elapsed,
        dias: days.length,
        exercicios: totalExercises
      });

    } catch (err) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.error(`  ✗ FALHA no teste ${tc.id}:`, err.message, `(${elapsed}s)\n`);
      results.push({
        id: tc.id,
        metodologia: tc.metodologia,
        escola: tc.escola,
        status: 'FALHA',
        erro: err.message,
        tempoSegundos: elapsed
      });
    }
  }

  console.log('========================================================================');
  console.log('📋 RELATÓRIO CONSOLIDADO DA BATERIA DE TESTES:');
  console.log('========================================================================');
  console.table(results.map(r => ({
    Metodologia: r.metodologia,
    Variação: r.escola,
    Status: r.status,
    Exercícios: r.exercicios || 0,
    PDF: r.arquivo || 'N/A',
    Bytes: r.tamanhoBytes || 0,
    Tempo: `${r.tempoSegundos}s`
  })));

  const successCount = results.filter(r => r.status === 'SUCESSO').length;
  console.log(`\n🎉 Testes Concluídos: ${successCount}/${TEST_CASES.length} com 100% de sucesso!`);
  console.log(`📂 Todos os PDFs foram gerados e salvos em: ${DESKTOP_OUT_DIR}\n`);
}

runTestSuite();
