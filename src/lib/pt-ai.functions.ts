import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { callLovableAiJson } from "@/lib/ai-gateway.server";

const InputSchema = z.object({
  programId: z.string().uuid(),
  prompt: z.string().min(3).max(4000),
});

export type AiExercise = {
  name: string;
  series_type?: string;
  sets_reps?: string;
  load?: string;
  time_seconds?: number;
  inclination?: string;
  pace?: string;
  cadence?: string;
  rest_seconds?: number;
  observations?: string;
};
export type AiTrainingDay = {
  name: string;
  day_label: string;
  description?: string;
  exercises: AiExercise[];
};
export type AiPrescription = { days: AiTrainingDay[]; notes?: string };

export const prescribeTrainingWithAi = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw: unknown) => InputSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: programRow, error } = await supabase
      .from("pt_programs" as never)
      .select("id,name,category,level,training_type,goals,start_date,end_date")
      .eq("id", data.programId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!programRow) throw new Error("Rotina não encontrada");
    const program = programRow as any;

    const system = `Você é um Personal Trainer experiente. Gere uma prescrição de treino em português (Brasil).
Responda APENAS com JSON válido, sem markdown, no formato:
{
  "days": [
    {
      "name": "Treino 1",
      "day_label": "Dia A",
      "description": "Foco muscular / observações gerais",
      "exercises": [
        { 
          "name": "Supino reto", 
          "series_type": "reps_load", 
          "sets_reps": "4x10", 
          "load": "60kg", 
          "rest_seconds": 90, 
          "observations": "Cadência 2:1" 
        }
      ]
    }
  ],
  "notes": "Observações finais do plano"
}
Tipos de série (series_type):
- "reps_load": Repetições e carga (campos: sets_reps, load)
- "reps_load_time": Repetições, carga e tempo (campos: sets_reps, load, time_seconds)
- "sets_time": Séries e tempo (campos: sets_reps, time_seconds)
- "reps_time": Repetições e tempo (campos: sets_reps, time_seconds)
- "time_inclination": Tempo e inclinação (campos: time_seconds, inclination)
- "run": Corrida (campos: load para distância, pace)
- "cadence": Cadência (campo: cadence)
Regras: 4 a 8 exercícios por dia. "day_label" segue o tipo (numérico "Dia 1/2/3..." ou alfabético "Dia A/B/C...").`;

    const user = `Rotina: ${program.name}
Categoria: ${program.category}
Nível: ${program.level}
Tipo de nomenclatura: ${program.training_type}
Período: ${program.start_date}${program.end_date ? ` até ${program.end_date}` : ""}
Objetivos: ${program.goals ?? "(não informado)"}

Instruções do trainer:
${data.prompt}`;

    const res = await callLovableAiJson<AiPrescription>({
      prompt: user,
      system,
      temperature: 0.7,
    });

    const parsed = res.json || { days: [] };
    if (!Array.isArray(parsed.days)) parsed.days = [];
    return parsed;
  });

const ReprogramDaySchema = z.object({
  programId: z.string().uuid(),
  dayId: z.string().uuid(),
  prompt: z.string().min(3).max(4000),
  currentExercises: z
    .array(
      z.object({
        name: z.string(),
        series_type: z.string().optional().nullable(),
        sets_reps: z.string().optional().nullable(),
        load: z.string().optional().nullable(),
        rest_seconds: z.union([z.string(), z.number()]).optional().nullable(),
        observations: z.string().optional().nullable(),
      })
    )
    .optional()
    .default([]),
});

export type ReprogramDayResult = {
  day: AiTrainingDay;
  rationale?: string;
};

export const reprogramDayWithAi = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw: unknown) => ReprogramDaySchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: programRow, error: progErr } = await supabase
      .from("pt_programs" as never)
      .select("id,name,category,level,training_type,goals,start_date,end_date,ai_prompt")
      .eq("id", data.programId)
      .maybeSingle();
    if (progErr || !programRow) throw new Error("Rotina de treino não encontrada");
    const program = programRow as any;

    const { data: dayRow, error: dayErr } = await supabase
      .from("pt_training_days" as never)
      .select("id,name,day_label,description")
      .eq("id", data.dayId)
      .maybeSingle();
    if (dayErr || !dayRow) throw new Error("Sessão de treino não encontrada");
    const day = dayRow as any;

    const system = `Você é um Personal Trainer especialista em periodização e progressão de treino.
Sua missão é REPROGRAMAR / REAJUSTAR uma sessão específica de treino de um aluno com base:
1. No que foi planejado no início na formação do programa (metas, nível, categoria, objetivos da rotina).
2. Na estrutura dos exercícios e cargas que o aluno já realizava nessa sessão.
3. No novo objetivo/foco de reajuste solicitado pelo treinador.

Responda APENAS com JSON válido, sem markdown:
{
  "day": {
    "name": "${day.name}",
    "day_label": "${day.day_label}",
    "description": "Foco do reajuste / progressão aplicada",
    "exercises": [
      {
        "name": "Nome do exercício",
        "series_type": "reps_load",
        "sets_reps": "4x10",
        "load": "60kg",
        "rest_seconds": 90,
        "observations": "Progresso de carga / orientação"
      }
    ]
  },
  "rationale": "Resumo técnico sucinto das alterações feitas em relação ao bloco anterior"
}
Tipos de série (series_type): "reps_load", "reps_load_time", "sets_time", "reps_time", "time_inclination", "run", "cadence".`;

    const exerciseListStr =
      data.currentExercises.length > 0
        ? data.currentExercises
            .map(
              (e, idx) =>
                `${idx + 1}. ${e.name} — Séries: ${e.sets_reps || "N/A"}, Carga: ${e.load || "0kg"}, Intervalo: ${e.rest_seconds || 60}s${e.observations ? ` (${e.observations})` : ""}`
            )
            .join("\n")
        : "(Nenhum exercício cadastrado anteriormente)";

    const user = `PROGRAMA ORIGINAL:
Nome: ${program.name}
Categoria: ${program.category} | Nível: ${program.level} | Nomenclatura: ${program.training_type}
Metas na formação do programa: ${program.goals || "(não informado)"}
${program.ai_prompt ? `Diretriz inicial do programa: ${program.ai_prompt}` : ""}

SESSÃO ATUAL A SER REPROGRAMADA:
Nome: ${day.name} (${day.day_label})
Descrição anterior: ${day.description || "(sem descrição)"}

EXERCÍCIOS ATUAIS DESTA SESSÃO:
${exerciseListStr}

OBJETIVO / INSTRUÇÃO DO TREINADOR PARA O REAJUSTE:
${data.prompt}`;

    const res = await callLovableAiJson<ReprogramDayResult>({
      prompt: user,
      system,
      temperature: 0.7,
    });

    return res.json;
  });
