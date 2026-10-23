import { createClient } from '@supabase/supabase-js';

const url = 'https://muryznvaxzszcffrbxpv.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cnl6bnZheHpzemNmZnJieHB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDQ0MTE2OSwiZXhwIjoyMTAwMDE3MTY5fQ.SpYzAP5ej1jUKyIPGSowyZrG_eeox50HmKnP1r81a24';
const client = createClient(url, key);

async function run() {
  console.log('--- TESTE: PWA PUSH & FEEDBACK TURMA DAS 08H ---');

  // 1. Busca alunos ativos do studio
  const { data: students, error: sErr } = await client
    .from('students')
    .select('id, name')
    .limit(30);

  if (!students || students.length === 0) {
    console.error('Nenhum aluno encontrado:', sErr);
    return;
  }

  // 2. Sorteia 1 aluno aleatório
  const randomStudent = students[Math.floor(Math.random() * students.length)];
  console.log(`Aluno sorteado para o teste: ${randomStudent.name}`);

  // 3. Busca os admins do studio
  const { data: adminRoles } = await client
    .from('user_roles')
    .select('user_id')
    .eq('role', 'admin');

  const adminIds = adminRoles && adminRoles.length > 0
    ? [...new Set(adminRoles.map(r => r.user_id))]
    : ['3f954063-c246-4989-8f48-dc84a12f5be3'];

  // ETAPA 1: Disparo de Check-in em Tempo Real do Aluno na Turma das 8h
  console.log(`[ETAPA 1/2] Disparando check-in de ${randomStudent.name}...`);
  for (const adminId of adminIds) {
    await client.from('pt_notifications').insert({
      user_id: adminId,
      title: '🔔 Novo Check-in!',
      message: `${randomStudent.name} confirmou presença na turma "Treinamento Híbrido Endurance" às 08:00.`,
      type: 'checkin',
      metadata: {
        student_id: randomStudent.id,
        student_name: randomStudent.name,
        class_name: 'Treinamento Híbrido Endurance',
        start_time: '08:00:00',
        is_bonus: false,
      },
    });
  }
  console.log(`✅ [CHECK-IN ENVIADO] ${randomStudent.name} na turma das 08:00.`);

  // Aguarda 3 segundos
  await new Promise(r => setTimeout(r, 3000));

  // ETAPA 2: Disparo do Feedback Pré-Aula da Turma das 08h
  console.log('[ETAPA 2/2] Disparando aviso e feedback pré-aula da turma das 08:00...');
  for (const adminId of adminIds) {
    await client.from('pt_notifications').insert({
      user_id: adminId,
      title: '⏰ Aula em 20 min (08:00 - Treinamento Híbrido Endurance)',
      message: `1 aluno com check-in confirmado: ${randomStudent.name}. Prepare o espaço para o treino.`,
      type: 'class_reminder_20m',
      metadata: {
        class_name: 'Treinamento Híbrido Endurance',
        start_time: '08:00:00',
        attendee_count: 1,
        attendees: [randomStudent.name],
      },
    });
  }
  console.log('✅ [FEEDBACK 08H ENVIADO] Resumo da turma das 08:00 entregue aos treinadores.');
  console.log('--- TESTE CONCLUÍDO COM SUCESSO ---');
}

run();
