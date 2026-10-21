import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  SYSTEM_PROMPT,
  calcularDataFim,
  detectarNomenclatura,
  mensagemDeErroGateway,
  montarUserPrompt,
  normalizarPrescricao,
  type AiPrescription,
  type RotinaContexto,
} from "@/lib/prescricao-ia.server";
import {
  KB_SPORT_SYSTEM_PROMPT,
  escolherEscola,
  montarKbSportPrompt,
  type EscolaMetodologica,
} from "@/lib/kb-sport-ia.server";
import {
  WL_SYSTEM_PROMPT,
  escolherEscolaWl,
  montarWlPrompt,
  type EscolaWeightlifting,
} from "@/lib/weightlifting-ia.server";
import {
  TF_SYSTEM_PROMPT,
  escolherEscolaFuncional,
  montarFuncionalPrompt,
  type EscolaFuncional,
} from "@/lib/funcional-ia.server";
import {
  CO_SYSTEM_PROMPT,
  escolherEscolaCorrida,
  montarCorridaPrompt,
  type EscolaCorrida,
} from "@/lib/corrida-ia.server";
import {
  buscarCandidatosDoMolde,
  montarHibridoPrompt,
  normalizarPrescricaoHibrido,
  type HibridoPayload,
  type SessaoTemplate,
} from "@/lib/hibrido-ia.server";
import { BUILTIN_SET_TYPES, type SetTypePreset } from "@/lib/set-type-registry";
import { parseAthleteMemory, formatMemoryForPrompt } from "@/lib/athlete-memory";

const CARGA = z
  .object({
    pesoKettlebellKg: z.number().nullable().default(null),
    repsAtuais10min: z.number().nullable().default(null),
  })
  .optional();

const KB = z
  .object({
    escolaMetodologica: z.enum([
      "auto",
      "fedorenko",
      "rudnev",
      "vorotyntsev",
      "denisov",
      "vasilev",
      "gomonov",
    ]),
    nivelAtleta: z.enum(["iniciante", "intermediario", "avancado", "elite"]),
    disciplina: z.enum(["biathlon", "long_cycle", "ambas"]),
    pesoCorporalKg: z.number().nullable().default(null),
    cargas: z
      .object({ snatch: CARGA, jerk: CARGA, longCycle: CARGA })
      .default({}),
  })
  .nullable()
  .optional();

const WL = z
  .object({
    escolaMetodologica: z.enum([
      "auto",
      "bulgara",
      "russa_classica",
      "chinesa",
      "cubana",
      "colombiana",
      "pendlay",
      "takano",
    ]),
    nivelAtleta: z.enum(["iniciante", "intermediario", "avancado", "elite"]),
    pesoCorporalKg: z.number().nullable().default(null),
    classificacaoOficial: z.string().max(80).nullable().default(null),
    pontoFracoIdentificado: z
      .enum(["pernas", "costas", "recepcao", "mobilidade_ombro"])
      .nullable()
      .default(null),
    capacidadeRecuperacao: z.enum(["baixa", "media", "alta"]).default("media"),
    suporteTotalDeclarado: z.boolean().default(false),
    cargas: z
      .object({
        arranco: z.object({ cargaKg: z.number().nullable().default(null) }).optional(),
        arremesso: z.object({ cargaKg: z.number().nullable().default(null) }).optional(),
        agachamentoCostas: z
          .object({ cargaKg: z.number().nullable().default(null) })
          .optional(),
        agachamentoFrontal: z
          .object({ cargaKg: z.number().nullable().default(null) })
          .optional(),
      })
      .default({}),
  })
  .nullable()
  .optional();

const TF = z
  .object({
    escolaMetodologica: z.enum([
      "auto",
      "fms_sfma",
      "boyle",
      "exos",
      "dns",
      "crossfit",
      "original_strength",
    ]),
    nivelAtleta: z.enum(["iniciante", "intermediario", "avancado", "elite"]),
    objetivo: z.enum([
      "condicionamento_geral",
      "performance_esportiva",
      "reabilitacao_retorno",
      "emagrecimento",
      "hipertrofia_funcional",
    ]),
    equipamento: z.enum([
      "peso_corporal",
      "academia_completa",
      "kettlebell_halteres",
      "outdoor",
    ]),
    sedentarismoProlongado: z.boolean().default(false),
    lesoes: z
      .array(
        z.object({
          regiao: z.enum([
            "lombar",
            "joelho",
            "ombro",
            "quadril",
            "tornozelo",
            "core",
            "outro",
          ]),
          fase: z.enum(["aguda", "em_recuperacao", "cronica_controlada"]),
          observacaoLivre: z.string().max(300).nullable().default(null),
        }),
      )
      .max(6)
      .default([]),
  })
  .nullable()
  .optional();

const CO = z
  .object({
    escolaMetodologica: z.enum([
      "auto",
      "daniels",
      "lydiard",
      "canova",
      "hansons",
      "pfitzinger",
      "horwill",
      "koop",
    ]),
    nivelAtleta: z.enum(["iniciante", "intermediario", "avancado", "elite"]),
    distanciaAlvo: z.enum(["corrida_rua", "5k", "10k", "21k", "42k", "ultramaratona"]),
    volumeSemanalKm: z.number().nullable().default(null),
    frequenciaSemanalAtual: z.number().nullable().default(null),
    marcaRecenteDistancia: z
      .enum(["corrida_rua", "5k", "10k", "21k", "42k", "ultramaratona"])
      .nullable()
      .default(null),
    marcaRecenteTempo: z.string().max(20).nullable().default(null),
    dataProvaAlvo: z.string().max(20).nullable().default(null),
    terreno: z.enum(["estrada", "trilha", "montanha", "pista"]).nullable().default(null),
    preferenciaAltaFrequencia: z.boolean().default(false),
    lesoes: z
      .array(
        z.object({
          regiao: z.enum([
            "lombar",
            "joelho",
            "ombro",
            "quadril",
            "tornozelo",
            "core",
            "outro",
          ]),
          fase: z.enum(["aguda", "em_recuperacao", "cronica_controlada"]),
          observacaoLivre: z.string().max(300).nullable().default(null),
        }),
      )
      .max(6)
      .default([]),
  })
  .nullable()
  .optional();

const INPUT = z.object({
  apiKey: z.string().optional().nullable(),
  programId: z.string().nullable().optional(),
  studentId: z.string().nullable().optional(),
  prompt: z.string().max(4000).default(""),
  diasPorSemana: z.number().int().min(1).max(7).nullable().optional(),
  escopoLabel: z.string().max(80).nullable().optional(),
  semanasNovas: z.number().int().min(1).max(12).default(1),
  metodologiaOverride: z.string().nullable().optional(),
  escolaOverride: z.string().optional(),
  historicoSessoes: z.number().int().min(0).max(12).nullable().optional(),
  cooldownSessoes: z.number().int().min(0).max(8).default(3),
  kb: KB,
  wl: WL,
  tf: TF,
  co: CO,
  hibrido: z.any().optional(),
  setTypes: z.array(z.any()).optional(),
  formatRegistry: z.array(z.any()).optional(),
  planilhaBase: z.string().max(40000).optional(),
  planilhaModo: z.enum(["ajustar", "continuar"]).optional(),
  fileUrl: z.string().optional(),
  planilhaImagem: z
    .object({
      mimeType: z.string(),
      data: z.string(),
    })
    .optional(),
});

export const prescribeTrainingWithAi = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    try {
      return INPUT.parse(input);
    } catch (e: any) {
      console.error("[prescribeTrainingWithAi] Validation Error:", e);
      throw e;
    }
  })
  .handler(async ({ data, context }): Promise<AiPrescription> => {
    // Motor dedicado: NÃO consulta a tabela `exercises`. Os movimentos vêm
    // exclusivamente do modelo, evitando mistura com outras modalidades.
    const supabase = context.supabase;

    const isUUID = (str?: string | null): boolean =>
      Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str));

    let programa: any = null;
    if (data.programId && isUUID(data.programId)) {
      const { data: pData } = await supabase
        .from("programs")
        .select(
          "id, titulo, metodologia, descricao, data_inicio, duracao_semanas, program_weeks(id, numero_semana)",
        )
        .eq("id", data.programId)
        .maybeSingle();

      if (pData) {
        programa = pData;
      } else {
        const { data: ptData } = await supabase
          .from("pt_programs" as never)
          .select("id, name, training_type, goals, start_date")
          .eq("id" as never, data.programId)
          .maybeSingle();

        if (ptData) {
          programa = {
            id: (ptData as any).id,
            titulo: (ptData as any).name,
            metodologia: (ptData as any).training_type,
            descricao: (ptData as any).goals,
            data_inicio: (ptData as any).start_date,
            duracao_semanas: data.semanasNovas || 1,
            program_weeks: [],
          };
        }
      }
    }

    if (!programa) {
      programa = {
        id: data.programId || "novo-programa",
        titulo: "Nova Rotina",
        metodologia: data.metodologiaOverride || "musculacao",
        descricao: null,
        data_inicio: new Date().toISOString().slice(0, 10),
        duracao_semanas: data.semanasNovas || 1,
        program_weeks: [],
      };
    }

    const VALID_METODOLOGIAS = [
      "musculacao",
      "hibrido",
      "kettlebell_fitness",
      "kettlebell_sport",
      "levantamento_peso",
      "treinamento_funcional",
      "corrida",
    ];

    let rawMetodologia = data.metodologiaOverride || programa.metodologia || "musculacao";
    // Mapeamento de compatibilidade caso venha nomenclatura de divisao (ex: "numeric", "alphabetic") ou categoria
    if (rawMetodologia === "numeric" || rawMetodologia === "alphabetic" || rawMetodologia === "general" || rawMetodologia === "hypertrophy" || rawMetodologia === "strength") {
      rawMetodologia = "musculacao";
    } else if (rawMetodologia === "conditioning") {
      rawMetodologia = "treinamento_funcional";
    } else if (rawMetodologia === "cardio") {
      rawMetodologia = "corrida";
    }

    const metodologiaEfetiva = VALID_METODOLOGIAS.includes(rawMetodologia) ? rawMetodologia : "musculacao";
    const isKbSport = metodologiaEfetiva === "kettlebell_sport";
    const isWl = metodologiaEfetiva === "levantamento_peso";
    const isTf = metodologiaEfetiva === "treinamento_funcional";
    const isCo = metodologiaEfetiva === "corrida";
    const isHibrido = metodologiaEfetiva === "hibrido" || metodologiaEfetiva === "kettlebell_fitness";

    if (
      metodologiaEfetiva !== "musculacao" &&
      !isHibrido &&
      !isKbSport &&
      !isWl &&
      !isTf &&
      !isCo
    ) {
      throw new Error(
        "Prescrever com IA está disponível apenas para Musculação, Híbrido, Kettlebell Fitness, Kettlebell Sport, Levantamento de Peso, Treinamento Funcional e Corrida",
      );
    }
    if (isKbSport && !data.kb) {
      const escolaValida = ["auto", "fedorenko", "rudnev", "vorotyntsev", "denisov", "vasilev", "gomonov"];
      const escola = (data.escolaOverride && escolaValida.includes(data.escolaOverride)
        ? data.escolaOverride
        : "fedorenko") as EscolaMetodologica;

      data.kb = {
        escolaMetodologica: escola,
        nivelAtleta: "intermediario",
        disciplina: "long_cycle",
        pesoCorporalKg: null,
        cargas: {
          longCycle: { pesoKettlebellKg: 16, repsAtuais10min: 50 },
          snatch: { pesoKettlebellKg: 16, repsAtuais10min: 100 },
          jerk: { pesoKettlebellKg: 16, repsAtuais10min: 60 },
        },
      };
    }

    if (isWl && !data.wl) {
      const escolaValidaWl = ["auto", "bulgara", "russa_classica", "chinesa", "cubana", "colombiana", "pendlay", "takano"];
      const escola = (data.escolaOverride && escolaValidaWl.includes(data.escolaOverride)
        ? data.escolaOverride
        : "russa_classica") as EscolaWeightlifting;

      data.wl = {
        escolaMetodologica: escola,
        nivelAtleta: "intermediario",
        pesoCorporalKg: null,
        classificacaoOficial: null,
        pontoFracoIdentificado: null,
        capacidadeRecuperacao: "media",
        suporteTotalDeclarado: false,
        cargas: {},
      };
    }

    if (isTf && !data.tf) {
      data.tf = { 
        escolaMetodologica: "auto", 
        nivelAtleta: "intermediario", 
        objetivo: "condicionamento_geral", 
        equipamento: "academia_completa", 
        sedentarismoProlongado: false, 
        lesoes: [] 
      };
    }

    if (isCo && !data.co) {
      const escolaValidaCo = ["auto", "daniels", "lydiard", "canova", "hansons", "pfitzinger", "horwill", "koop"];
      const escola = (data.escolaOverride && escolaValidaCo.includes(data.escolaOverride)
        ? data.escolaOverride
        : "daniels") as EscolaCorrida;

      data.co = {
        escolaMetodologica: escola,
        nivelAtleta: "intermediario",
        distanciaAlvo: "10k",
        volumeSemanalKm: 25,
        frequenciaSemanalAtual: data.diasPorSemana || 3,
        marcaRecenteDistancia: null,
        marcaRecenteTempo: null,
        dataProvaAlvo: null,
        terreno: "estrada",
        preferenciaAltaFrequencia: false,
        lesoes: [],
      };
    }
    if (isHibrido && !data.hibrido) {
      throw new Error("Configuração do motor Híbrido/KB Fitness ausente (hibrido payload)");
    }
    
    // Fallback de segurança para molde estrutural se vier vazio na continuidade
    if (isHibrido && data.hibrido && (!data.hibrido.sessaoTemplate || data.hibrido.sessaoTemplate.length === 0)) {
      console.log("Aviso: Híbrido sem sessaoTemplate. Tentando recuperar do histórico...");
      // Forçamos a busca no continuation context abaixo
    }

    const titulos: (string | null)[] = ((programa as any).program_weeks ?? []).flatMap(
      (w: any) => (w.sessions ?? []).map((s: any) => s.titulo ?? null),
    );
    
    // Busca o histórico detalhado do programa via buildContinuationContext
    const nHistorico = data.historicoSessoes ?? 6;
    const cooldown = data.cooldownSessoes ?? 3;
    
    const { buildContinuationContext } = await import("./continuation.server");
    const continuation = await buildContinuationContext(
      supabase,
      data.programId || "novo-programa",
      nHistorico,
      cooldown
    );

    // Recuperação de Memória Persistente do Atleta (V3-Context Engine)
    let targetStudentId = data.studentId;
    if (!targetStudentId && isUUID(data.programId)) {
      const { data: asg } = await supabase
        .from("assignments")
        .select("student_id")
        .eq("program_id", data.programId)
        .limit(1)
        .maybeSingle();
      if (asg?.student_id) {
        targetStudentId = asg.student_id;
      }
    }

    let memoriaAtletaPrompt: string | null = null;
    if (targetStudentId && isUUID(targetStudentId)) {
      const { data: student } = await supabase
        .from("students" as never)
        .select("id, name, notes" as never)
        .eq("id" as never, targetStudentId)
        .maybeSingle();
      const st = student as any;
      if (st?.notes?.trim()) {
        const parsedMemory = parseAthleteMemory(st.notes);
        memoriaAtletaPrompt = formatMemoryForPrompt(st.name, parsedMemory);
      } else {
        const { data: ptStudent } = await supabase
          .from("pt_students" as never)
          .select("id, name, notes" as never)
          .eq("id" as never, targetStudentId)
          .maybeSingle();
        const pt = ptStudent as any;
        if (pt?.notes?.trim()) {
          const parsedMemory = parseAthleteMemory(pt.notes);
          memoriaAtletaPrompt = formatMemoryForPrompt(pt.name, parsedMemory);
        }
      }
    }

    const alunoInfoCombinado = [
      memoriaAtletaPrompt,
      programa.descricao ? `Objetivos declarados no programa: ${programa.descricao}` : null,
    ].filter(Boolean).join("\n\n") || null;

    const ctx: RotinaContexto = {
      titulo: programa.titulo ?? "Programa",
      metodologia: metodologiaEfetiva as string,
      duracao_semanas: data.semanasNovas,
      data_inicio: programa.data_inicio ?? null,
      data_fim: calcularDataFim(programa.data_inicio ?? null, data.semanasNovas),
      nomenclatura: "numerico" as const, // Fallback seguro
      sessoes_existentes: titulos.length,
      objetivos: programa.descricao ?? null,
      dias_por_semana: data.diasPorSemana ?? null,
      escopo_label: data.escopoLabel ?? `${data.semanasNovas} semana(s)`,
      continuation: continuation,
      aluno_info: alunoInfoCombinado,
    };

    // Catálogo de Exercícios do Coach (com vídeos cadastrados na biblioteca)
    let catalogoPrompt = "";
    try {
      const { data: exLib } = await supabase
        .from("pt_exercises_library")
        .select("name, muscle_group")
        .not("media_url", "is", null)
        .limit(250);

      if (exLib && exLib.length > 0) {
        const porGrupo = new Map<string, string[]>();
        exLib.forEach((e: any) => {
          const g = e.muscle_group || "Geral";
          const arr = porGrupo.get(g) || [];
          if (arr.length < 12) arr.push(e.name);
          porGrupo.set(g, arr);
        });

        const linhas: string[] = [];
        for (const [grupo, nomes] of porGrupo.entries()) {
          linhas.push(`- ${grupo}: ${nomes.join(", ")}`);
        }
        catalogoPrompt = `CATÁLOGO OFICIAL DE EXERCÍCIOS COM VÍDEO DO COACH MONTANHA (PRIORIZE O USO DESTES NOMES EXATOS PARA VINCULAR OS VÍDEOS AUTOMATICAMENTE):\n${linhas.join("\n")}`;
      }
    } catch (e) {
      console.warn("Falha ao carregar catálogo para prompt:", e);
    }

    const instrucoesCompletas = [data.prompt, memoriaAtletaPrompt, catalogoPrompt].filter(Boolean).join("\n\n");

    // Fallback de histórico legível para prompts que ainda não usam o objeto estruturado
    const resumoAnterior = ctx.continuation 
      ? `CONTEXTO RECENTE: Analisadas ${ctx.continuation.sourceSessionCount} sessões. ` +
        `IDs evitáveis: ${ctx.continuation.softAvoidIds.join(", ")}. ` +
        `Exercícios anteriores: ${ctx.continuation.recentSessions.flatMap(s => s.exerciseNames).slice(-10).join(", ")}`
      : null;

    const override = data.escolaOverride && data.escolaOverride !== "auto" ? data.escolaOverride : null;

    const kb = data.kb ?? null;
    const linha: Exclude<EscolaMetodologica, "auto"> | null = kb
      ? (override as any) || (kb.escolaMetodologica === "auto"
        ? escolherEscola(kb.nivelAtleta, kb.disciplina)
        : kb.escolaMetodologica)
      : (metodologiaEfetiva === "kettlebell_sport" ? (override as any) || "gomonov" : null);

    const wl = data.wl ?? null;
    const linhaWl: Exclude<EscolaWeightlifting, "auto"> | null = wl
      ? (override as any) || (wl.escolaMetodologica === "auto"
        ? escolherEscolaWl({
            nivel: wl.nivelAtleta,
            pontoFraco: wl.pontoFracoIdentificado,
            classificacao: wl.classificacaoOficial,
            recuperacao: wl.capacidadeRecuperacao,
            suporteTotal: wl.suporteTotalDeclarado,
          })
        : wl.escolaMetodologica)
      : (metodologiaEfetiva === "levantamento_peso" ? (override as any) || "takano" : null);

    const tf = data.tf ?? null;
    const linhaTf: Exclude<EscolaFuncional, "auto"> | null = tf
      ? (override as any) || (tf.escolaMetodologica === "auto"
        ? escolherEscolaFuncional({
            lesoes: tf.lesoes as any[],
            objetivo: tf.objetivo,
            nivel: tf.nivelAtleta,
            sedentarismoProlongado: tf.sedentarismoProlongado,
          })
        : tf.escolaMetodologica)
      : (metodologiaEfetiva === "treinamento_funcional" ? (override as any) || "boyle" : null);

    const co = data.co ?? null;
    const linhaCo: Exclude<EscolaCorrida, "auto"> | null = co
      ? (override as any) || (co.escolaMetodologica === "auto"
        ? escolherEscolaCorrida({
            lesoes: co.lesoes as any,
            nivel: co.nivelAtleta,
            distanciaAlvo: co.distanciaAlvo,
            volumeSemanalKm: co.volumeSemanalKm,
            preferenciaAltaFrequencia: co.preferenciaAltaFrequencia,
          })
        : co.escolaMetodologica)
      : (metodologiaEfetiva === "corrida" ? (override as any) || "daniels" : null);

    const systemPrompt = isKbSport
      ? KB_SPORT_SYSTEM_PROMPT
      : isWl
        ? WL_SYSTEM_PROMPT
        : isTf
          ? TF_SYSTEM_PROMPT
          : isCo
            ? CO_SYSTEM_PROMPT
            : SYSTEM_PROMPT;
    let resolvedHibridoTemplate: SessaoTemplate | null = null;
    let resolvedHibridoCandidatos: Awaited<ReturnType<typeof buscarCandidatosDoMolde>> | null = null;

    if (isHibrido) {
      let template: SessaoTemplate = data.hibrido.sessaoTemplate;
      const methodologyForQuery = metodologiaEfetiva === "kettlebell_fitness" ? "kettlebell_fitness" : "hibrido";

      if (!template || !Array.isArray(template) || template.length === 0) {
        const { data: coach } = await supabase.from("coaches").select("id").maybeSingle();
        if (coach) {
          const { data: pref } = await supabase
            .from("generator_preferences")
            .select("blocos")
            .eq("coach_id", coach.id)
            .eq("metodologia", methodologyForQuery)
            .maybeSingle();

          if (pref?.blocos && Array.isArray(pref.blocos) && pref.blocos.length > 0) {
            template = (pref.blocos as any[]).map((b, idx) => ({
              chave: b.chave || `bloco_${idx + 1}`,
              formato: b.formato,
              titulo: b.titulo,
              selecaoExercicios: b.selecaoExercicios || "ia",
              numeroExercicios: b.num_exercicios || 3,
              fonteExercicios: b.fonteExercicios || { metodologias: [metodologiaEfetiva] },
            })) as SessaoTemplate;
          }
        }
      }

      if (!template || !Array.isArray(template) || template.length === 0) {
        template = (continuation.lastSessionStructure ?? []).map((b: any) => ({
          chave: b.chave,
          formato: b.formato,
          titulo: b.titulo,
          selecaoExercicios: "ia",
          numeroExercicios: b.numeroExercicios || 1,
          fonteExercicios: b.fonteExercicios || { metodologias: [metodologiaEfetiva] },
        })) as SessaoTemplate;
      }

      if (!template || template.length === 0) {
        throw new Error(
          "Não foi possível identificar o molde da sessão anterior para continuar a progressão. Configure o molde manualmente ou verifique se a rotina já possui treinos cadastrados.",
        );
      }

      resolvedHibridoTemplate = template;
      resolvedHibridoCandidatos = await buscarCandidatosDoMolde(supabase, template);
    }

    const userPrompt =
      isCo && linhaCo
        ? montarCorridaPrompt({
            co: (co ?? {
              escolaMetodologica: linhaCo,
              nivelAtleta: "intermediario",
              distanciaAlvo: "corrida_rua",
              volumeSemanalKm: null,
              frequenciaSemanalAtual: null,
              marcaRecenteDistancia: null,
              marcaRecenteTempo: null,
              dataProvaAlvo: null,
              terreno: null,
              preferenciaAltaFrequencia: false,
              lesoes: [],
            }) as any,
            linha: linhaCo,
            semanas: ctx.duracao_semanas,
            diasPorSemana: ctx.dias_por_semana,
            dataInicio: ctx.data_inicio,
            escopoLabel: ctx.escopo_label,
            instrucoes: instrucoesCompletas,
            resumoAnterior: resumoAnterior,
          })
        : isTf && linhaTf
        ? montarFuncionalPrompt({
            tf: (tf ?? {
              escolaMetodologica: linhaTf,
              nivelAtleta: "intermediario",
              objetivo: "condicionamento_geral",
              equipamento: "kettlebell_halteres",
              sedentarismoProlongado: false,
              lesoes: [],
            }) as any,
            linha: linhaTf,
            semanas: ctx.duracao_semanas,
            diasPorSemana: ctx.dias_por_semana,
            dataInicio: ctx.data_inicio,
            escopoLabel: ctx.escopo_label,
            instrucoes: instrucoesCompletas,
            resumoAnterior: resumoAnterior,
          })
        : isWl && wl && linhaWl
        ? montarWlPrompt({
            wl: wl as any,
            linha: linhaWl,
            semanas: ctx.duracao_semanas,
            diasPorSemana: ctx.dias_por_semana,
            dataInicio: ctx.data_inicio,
            escopoLabel: ctx.escopo_label,
            instrucoes: instrucoesCompletas,
            resumoAnterior: resumoAnterior,
          })
        : isKbSport && kb && linha
        ? montarKbSportPrompt({
            kb: kb as any,
            linha,
            semanas: ctx.duracao_semanas,
            diasPorSemana: ctx.dias_por_semana,
            dataInicio: ctx.data_inicio,
            escopoLabel: ctx.escopo_label,
            instrucoes: instrucoesCompletas,
            resumoAnterior: resumoAnterior,
          })
        : isHibrido && resolvedHibridoTemplate && resolvedHibridoCandidatos
        ? montarHibridoPrompt({
            payload: { ...data.hibrido, sessaoTemplate: resolvedHibridoTemplate },
            candidatos: resolvedHibridoCandidatos,
            instrucoes: instrucoesCompletas,
            resumoAnterior: resumoAnterior,
            continuation: continuation,
            setTypeRegistry: data.setTypes || BUILTIN_SET_TYPES,
            customFormats: data.formatRegistry || [],
          })
        : montarUserPrompt(
            {
              ...ctx,
              set_types: data.setTypes || BUILTIN_SET_TYPES,
              planilha_base: data.planilhaBase,
              planilha_modo: data.planilhaModo,
            },
            data.prompt,
          );

    const { callLovableAiJson, AiGatewayError, resolveAiModel } = await import("@/lib/ai-gateway.server");
    const modelToUse = resolveAiModel();

    const requestId = Math.random().toString(36).substring(7);
    console.log(`[AI_REQUEST][${requestId}] Iniciando geração:`, {
      programId: data.programId,
      metodologia: metodologiaEfetiva,
      semanas: data.semanasNovas,
      model: modelToUse,
      hasPlanilhaBase: Boolean(data.planilhaBase),
      planilhaModo: data.planilhaModo,
      hasInlineData: Boolean(data.planilhaImagem),
      promptChars: systemPrompt.length + userPrompt.length,
    });

    let inlineData = data.planilhaImagem;
    if (!inlineData && data.fileUrl) {
      try {
        const fileRes = await fetch(data.fileUrl);
        if (fileRes.ok) {
          const buffer = Buffer.from(await fileRes.arrayBuffer());
          const mimeType = fileRes.headers.get("content-type") || (data.fileUrl.includes(".pdf") ? "application/pdf" : "image/jpeg");
          inlineData = {
            mimeType,
            data: buffer.toString("base64"),
          };
          console.log(`[AI_REQUEST][${requestId}] Documento carregado via Storage URL: ${mimeType}, ${inlineData.data.length} chars base64`);
        }
      } catch (fErr) {
        console.warn(`[AI_REQUEST][${requestId}] Falha ao baixar fileUrl:`, fErr);
      }
    }

    let conteudo: string;
    try {
      const resultadoIa = await callLovableAiJson({
        scope: "prescricao-ia",
        system: systemPrompt,
        prompt: userPrompt,
        inlineData: inlineData,
        apiKey: data.apiKey?.trim() || undefined,
      });
      conteudo = resultadoIa.raw;
    } catch (err) {
      if (err instanceof AiGatewayError) {
        console.error(`[AI_ERROR][${requestId}] ${err.code} (${err.status})`);
        throw new Error(`${err.code}: ${err.message}`);
      }
      throw err;
    }

    try {
      if (isHibrido && resolvedHibridoTemplate && resolvedHibridoCandidatos) {
        const result = normalizarPrescricaoHibrido(
          conteudo,
          resolvedHibridoTemplate,
          resolvedHibridoCandidatos,
        );
        return { ...result, generation_source: "ai" } as any;
      }

      const result = normalizarPrescricao(conteudo);
      return { ...result, generation_source: "ai" } as any;
    } catch (parseErr: any) {
      console.error(`[AI_PARSE_ERROR][${requestId}] Falha ao processar resposta:`, parseErr);
      if (parseErr.message.includes("AI_") || parseErr.message.includes("POOL_VAZIO")) throw parseErr;
      throw new Error(`AI_SCHEMA_MISMATCH: A resposta da IA não pôde ser validada contra o molde. Erro: ${parseErr.message}`);
    }
  });

export const gerarUploadTreinoUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { fileName: string; fileType?: string }) => input)
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.SUPABASE_URL || "https://muryznvaxzszcffrbxpv.supabase.co";
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY ausente no servidor");
    }

    const adminSb = createClient(supabaseUrl, serviceRoleKey);
    const cleanName = data.fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `planilhas/${Date.now()}-${cleanName}`;

    const { data: signData, error: signError } = await adminSb.storage
      .from("treinos-anexos")
      .createSignedUploadUrl(filePath);

    if (signError || !signData) {
      console.error("[gerarUploadTreinoUrl] Erro ao criar signed upload url:", signError);
      throw new Error(`Falha ao preparar upload seguro: ${signError?.message || "erro de storage"}`);
    }

    const { data: publicData } = adminSb.storage
      .from("treinos-anexos")
      .getPublicUrl(filePath);

    return {
      filePath,
      token: signData.token,
      signedUrl: signData.signedUrl,
      publicUrl: publicData.publicUrl,
    };
  });

