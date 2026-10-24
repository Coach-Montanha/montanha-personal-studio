export type FormFieldType =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "select"
  | "radio"
  | "checkbox"
  | "scale"
  | "legal-consent";

export interface FormFieldDefinition {
  id: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: string[]; // Para select, radio, checkbox
  consentStatement?: string; // Para legal-consent
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
}

export type FormCategory = "anamnese" | "parq" | "objetivos" | "feedback" | "juridico" | "geral";

export interface StudioFormItem {
  id: string;
  slug: string;
  title: string;
  category: FormCategory;
  description: string;
  badge?: string;
  estimatedMinutes?: number;
  visibleToStudents: boolean;
  isPublicLead: boolean;
  fields: FormFieldDefinition[];
  googleFormUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string | null;
}

export const DEFAULT_STUDIO_FORMS: StudioFormItem[] = [
  {
    id: "termo-de-autorizacao-de-uso-de-imagem",
    slug: "termo-de-autorizacao-de-uso-de-imagem",
    title: "TERMO DE AUTORIZAÇÃO DE USO DE IMAGEM",
    category: "juridico",
    description:
      "AUTORIZO o uso de minha imagem para fins de divulgação em qualquer material relacionado a comunicação produzida pela empresa Núcleo de Saúde Integrada Sobral Chahara, sob nome fantasia NSI Serviços Ltda. Também conhecida como CTH 2.0 Coach Montanha, CNPJ: 28.682.591/0001-43.\n\nO material poderá ser divulgado em qualquer dos seus meios, incluindo as redes sociais (YouTube, Facebook, Instagram, Twitter, Flickr, entre outros), ciente também que minha imagem poderá também ser usada em qualquer tempo ou ocasião, em todo território nacional e no exterior sem nenhum tipo de ônus para ao Núcleo de Saúde Integrada Sobral Chahara, filiais ou parceiros.\n\nPor esta ser a expressão da minha vontade, declaro que autorizo o uso acima descrito, sem que nada haja a ser reclamado como direitos conexos à minha imagem ou qualquer outro, e assino a presente autorização.",
    badge: "Jurídico & LGPD",
    estimatedMinutes: 2,
    visibleToStudents: true,
    isPublicLead: true,
    googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf-8CuGDfNUD3mITcjl6lj6JDOq00PmviuXeiy-n3Mj_6pTMQ/viewform",
    fields: [
      {
        id: "data_assinatura",
        label: "Data da Assinatura",
        type: "text",
        required: true,
        placeholder: "DD/MM/AAAA",
        helperText: "Informe a data do preenchimento e concordância deste termo.",
      },
      {
        id: "nome",
        label: "Nome Completo",
        type: "text",
        required: true,
        placeholder: "Seu nome completo",
      },
      {
        id: "cpf",
        label: "CPF",
        type: "text",
        required: true,
        placeholder: "000.000.000-00",
        helperText: "Seu documento oficial para autenticidade jurídica do termo.",
      },
      {
        id: "declaracao_concordancia",
        label: "Declaração de Concordância e Assinatura Digital",
        type: "legal-consent",
        required: true,
        consentStatement:
          "Declaro que li, compreendi e concordo integralmente com os termos de autorização de uso de imagem descritos acima para a empresa Núcleo de Saúde Integrada Sobral Chahara (CTH 2.0 Coach Montanha / NSI Serviços Ltda, CNPJ 28.682.591/0001-43).",
      },
    ],
  },
  {
    id: "anamnese",
    slug: "anamnese",
    title: "Anamnese Geral & Histórico de Saúde",
    category: "anamnese",
    description: "Mapeamento clínico de patologias, cirurgias, dores crônicas e histórico de atividade física para treino seguro.",
    badge: "Saúde & Segurança",
    estimatedMinutes: 5,
    visibleToStudents: true,
    isPublicLead: true,
    fields: [
      {
        id: "nome_completo",
        label: "Nome Completo",
        type: "text",
        required: true,
        placeholder: "Seu nome",
      },
      {
        id: "data_nascimento",
        label: "Data de Nascimento",
        type: "text",
        required: true,
        placeholder: "DD/MM/AAAA",
      },
      {
        id: "whatsapp",
        label: "WhatsApp com DDD",
        type: "tel",
        required: true,
        placeholder: "(83) 99999-9999",
      },
      {
        id: "nivel_experiencia",
        label: "Nível Atual de Atividade Física",
        type: "radio",
        required: true,
        options: [
          "Sedentário (sem praticar exercícios há mais de 6 meses)",
          "Iniciante (pratica esporadicamente 1 a 2x por semana)",
          "Intermediário (treina musculação/funcional há mais de 1 ano)",
          "Avançado / Atleta amador",
        ],
      },
      {
        id: "dores_lesoes",
        label: "Possui dores, lesões ou cirurgias prévias?",
        type: "textarea",
        required: true,
        placeholder: "Ex: Dor na lombar, hérnia de disco, cirurgia de menisco no joelho direito...",
      },
      {
        id: "medicamentos_pressao",
        label: "Toma remédios contínuos ou possui pressão alta / diabetes?",
        type: "textarea",
        required: false,
        placeholder: "Informe se tiver qualquer condição médica relevante...",
      },
      {
        id: "meta_principal",
        label: "Qual seu principal objetivo nos próximos 90 dias?",
        type: "radio",
        required: true,
        options: [
          "Emagrecimento e queima de gordura",
          "Hipertrofia e ganho de massa magra",
          "Alívio de dores articulares e correção postural",
          "Condicionamento físico geral e mais disposição",
        ],
      },
    ],
  },
  {
    id: "par-q",
    slug: "par-q",
    title: "Questionário de Prontidão Física (PAR-Q)",
    category: "parq",
    description: "Questionário padronizado internacionalmente para identificar riscos cardiovasculares antes do início das atividades.",
    badge: "Triagem Médica",
    estimatedMinutes: 2,
    visibleToStudents: true,
    isPublicLead: true,
    fields: [
      {
        id: "nome_completo",
        label: "Nome Completo",
        type: "text",
        required: true,
        placeholder: "Seu nome",
      },
      {
        id: "whatsapp",
        label: "WhatsApp",
        type: "tel",
        required: true,
        placeholder: "(83) 99999-9999",
      },
      {
        id: "parq_dor_peito",
        label: "1. Algum médico já disse que você possui problema cardíaco e que só deve realizar atividade sob supervisão médica?",
        type: "radio",
        required: true,
        options: ["Não", "Sim"],
      },
      {
        id: "parq_dor_peito_exercicio",
        label: "2. Você sente dores no peito quando pratica atividade física?",
        type: "radio",
        required: true,
        options: ["Não", "Sim"],
      },
      {
        id: "parq_tontura",
        label: "3. No último mês, você sentiu dor no peito quando não estava praticando atividade física ou teve desmaios/perda de equilíbrio?",
        type: "radio",
        required: true,
        options: ["Não", "Sim"],
      },
      {
        id: "parq_osso_articulacao",
        label: "4. Você possui algum problema ósseo ou articular que pode ser agravado pela atividade física?",
        type: "radio",
        required: true,
        options: ["Não", "Sim"],
      },
      {
        id: "declaracao_parq",
        label: "Declaração de Veracidade",
        type: "legal-consent",
        required: true,
        consentStatement: "Declaro que respondi a todas as perguntas com total veracidade e assumo plena responsabilidade pelas informações prestadas.",
      },
    ],
  },
  {
    id: "metas",
    slug: "metas",
    title: "Alinhamento de Metas & Rotina do Aluno",
    category: "objetivos",
    description: "Diagnóstico completo da sua rotina de sono, dias disponíveis para treino, nutrição e metas.",
    badge: "Personalização",
    estimatedMinutes: 3,
    visibleToStudents: true,
    isPublicLead: true,
    fields: [
      {
        id: "nome_completo",
        label: "Nome Completo",
        type: "text",
        required: true,
        placeholder: "Seu nome",
      },
      {
        id: "dias_disponiveis",
        label: "Quantos dias por semana você consegue se dedicar aos treinos?",
        type: "radio",
        required: true,
        options: ["2 vezes por semana", "3 vezes por semana", "4 a 5 vezes por semana", "Todos os dias"],
      },
      {
        id: "tempo_treino",
        label: "Quanto tempo por sessão você tem disponível?",
        type: "radio",
        required: true,
        options: ["30 a 45 minutos (treino intenso e dinâmico)", "60 minutos (completo com aquecimento e mobilidade)", "Mais de 60 minutos"],
      },
      {
        id: "sono_disposicao",
        label: "Como você avalia a qualidade do seu sono e energia diária?",
        type: "scale",
        scaleMin: 1,
        scaleMax: 10,
        scaleMinLabel: "Péssimo / Exausto",
        scaleMaxLabel: "Excelente / Disposto",
        required: true,
      },
      {
        id: "maior_dificuldade",
        label: "Qual tem sido sua maior dificuldade para manter a constância?",
        type: "textarea",
        required: false,
        placeholder: "Falta de tempo, desmotivação, dores, dieta...",
      },
    ],
  },
  {
    id: "feedback",
    slug: "feedback",
    title: "Avaliação de Satisfação & Feedback de Aulas",
    category: "feedback",
    description: "Conte-nos o que achou dos treinos, metodologia, espaço e como podemos tornar sua experiência ainda melhor.",
    badge: "Sua Opinião",
    estimatedMinutes: 2,
    visibleToStudents: true,
    isPublicLead: false,
    fields: [
      {
        id: "nome_completo",
        label: "Seu Nome (ou digite 'Anônimo' se preferir)",
        type: "text",
        required: true,
        placeholder: "Seu nome ou Anônimo",
      },
      {
        id: "nota_treino",
        label: "De 1 a 10, como você avalia a qualidade e energia dos treinos?",
        type: "scale",
        scaleMin: 1,
        scaleMax: 10,
        scaleMinLabel: "Precisa melhorar muito",
        scaleMaxLabel: "Sensacional",
        required: true,
      },
      {
        id: "atendimento_personal",
        label: "O suporte e as correções do treinador atendem às suas expectativas?",
        type: "radio",
        required: true,
        options: [
          "Supera as expectativas (atenção total e correções precisas)",
          "Atende muito bem",
          "Poderia dar mais atenção a certos movimentos",
        ],
      },
      {
        id: "sugestoes",
        label: "O que podemos melhorar no espaço, horários ou metodologia?",
        type: "textarea",
        required: false,
        placeholder: "Deixe seu elogio, crítica ou sugestão sincera...",
      },
    ],
  },
];
