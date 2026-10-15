import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type ContinuationContext = {
  version: number;
  programId: string;
  sourceSessionCount: number;
  lastWeekNumber: number;
  recentSessions: Array<{
    week: number;
    day: number;
    title: string | null;
    exerciseNames: string[];
    muscleGroups: string[];
  }>;
  usage: Array<{ exerciseId: string; name: string; count: number; lastSeenSessionIdx: number }>;
  hardExcludeIds: string[];
  softAvoidIds: string[];
  recentFormats: string[];
  lastSessionStructure: Array<{ titulo: string | null; formato: string; chave: string; numeroExercicios: number; fonteExercicios: any }> | null;
  progressionNotes: string;
};

const isUUID = (str?: string | null): boolean =>
  Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str));

export async function buildContinuationContext(
  supabase: SupabaseClient<Database>,
  programId: string,
  nHistory: number,
  cooldown: number = 3
): Promise<ContinuationContext> {
  if (!isUUID(programId) || nHistory === 0) {
    return {
      version: 1,
      programId: programId || "novo-programa",
      sourceSessionCount: 0,
      lastWeekNumber: 0,
      recentSessions: [],
      usage: [],
      hardExcludeIds: [],
      softAvoidIds: [],
      recentFormats: [],
      lastSessionStructure: null,
      progressionNotes: "Início de nova fase sem histórico prévio analisado."
    };
  }

  const { data: weeks } = await supabase
    .from("program_weeks")
    .select("id, numero_semana")
    .eq("program_id", programId)
    .order("numero_semana", { ascending: true });

  const weekIds = (weeks ?? []).map((w) => w.id);
  const lastWeekNumber = weeks?.length ? weeks[weeks.length - 1].numero_semana : 0;

  if (weekIds.length === 0) {
    const { data: ptDays } = await supabase
      .from("pt_training_days" as never)
      .select("id, name, day_label, sort_order, description")
      .eq("program_id" as never, programId)
      .order("sort_order" as never, { ascending: true });

    const days = (ptDays || []) as any[];
    if (days.length > 0 && nHistory > 0) {
      const dayIds = days.map((d) => d.id);
      const { data: ptExercises } = await supabase
        .from("pt_training_exercises" as never)
        .select("id, training_day_id, name, sets, reps, load, rest_seconds, notes, sort_order")
        .in("training_day_id" as never, dayIds)
        .order("sort_order" as never, { ascending: true });

      const exList = (ptExercises || []) as any[];
      const recentSessions = days.map((d, idx) => {
        const exs = exList.filter((e) => e.training_day_id === d.id);
        return {
          week: 1,
          day: (d.sort_order ?? idx) + 1,
          title: d.name || `Dia ${d.day_label || idx + 1}`,
          exerciseNames: exs.map((e) => e.name),
          muscleGroups: [],
        };
      });

      const usageMap = new Map<string, { count: number; lastIdx: number; name: string }>();
      exList.forEach((e, idx) => {
        const curr = usageMap.get(e.name) || { count: 0, lastIdx: idx, name: e.name };
        curr.count += 1;
        curr.lastIdx = idx;
        usageMap.set(e.name, curr);
      });

      const usage = Array.from(usageMap.entries()).map(([k, v]) => ({
        exerciseId: k,
        name: v.name,
        count: v.count,
        lastSeenSessionIdx: v.lastIdx,
      }));

      const notes = [
        `Rotina contínua com ${days.length} sessões já prescritas:`,
        ...recentSessions.map(
          (s) => `- ${s.title}: ${s.exerciseNames.slice(0, 8).join(", ") || "Sem exercícios"}`
        ),
        "Atenção IA: Prossiga a periodização adicionando os novos dias/semanas em coerência com os treinos acima, mantendo a divisão biomecânica sem duplicar desnecessariamente ou reiniciar do zero.",
      ].join("\n");

      return {
        version: 1,
        programId,
        sourceSessionCount: days.length,
        lastWeekNumber: 1,
        recentSessions,
        usage,
        hardExcludeIds: [],
        softAvoidIds: [],
        recentFormats: ["series_reps"],
        lastSessionStructure: null,
        progressionNotes: notes,
      };
    }

    return {
      version: 1,
      programId,
      sourceSessionCount: 0,
      lastWeekNumber,
      recentSessions: [],
      usage: [],
      hardExcludeIds: [],
      softAvoidIds: [],
      recentFormats: [],
      lastSessionStructure: null,
      progressionNotes: "Início de nova fase sem histórico prévio analisado."
    };
  }

  const { data: sessoes } = await supabase
    .from("sessions")
    .select("id, titulo, numero_dia, program_week_id, program_weeks(numero_semana)")
    .in("program_week_id", weekIds)
    .order("created_at", { ascending: false })
    .limit(nHistory);

  if (!sessoes || sessoes.length === 0) {
    return {
      version: 1,
      programId,
      sourceSessionCount: 0,
      lastWeekNumber,
      recentSessions: [],
      usage: [],
      hardExcludeIds: [],
      softAvoidIds: [],
      recentFormats: [],
      lastSessionStructure: null,
      progressionNotes: "Nenhuma sessão encontrada no histórico."
    };
  }

  const sessaoIds = sessoes.map((s) => s.id);
  
  const { data: blocos } = await supabase
    .from("session_blocks")
    .select("id, session_id, formato, titulo, ordem, config")
    .in("session_id", sessaoIds)
    .order("ordem", { ascending: true });

  const blocoIds = (blocos ?? []).map((b) => b.id);

  const { data: exercicios } = await supabase
    .from("session_block_exercises")
    .select(`
      session_block_id, 
      nome_livre, 
      exercise_id,
      exercises(id, nome_pt, grupo_muscular)
    `)
    .in("session_block_id", blocoIds)
    .order("ordem", { ascending: true });

  const sessionData = sessoes.reverse().map((s) => {
    const sBlocos = (blocos ?? []).filter(b => b.session_id === s.id);
    const sExs = (exercicios ?? []).filter(e => sBlocos.some(b => b.id === e.session_block_id));
    
    return {
      week: (s.program_weeks as any)?.numero_semana || 0,
      day: s.numero_dia || 0,
      title: s.titulo,
      exerciseNames: sExs.map(e => e.nome_livre || (e.exercises as any)?.nome_pt).filter(Boolean),
      muscleGroups: sExs.map(e => (e.exercises as any)?.grupo_muscular).filter(Boolean)
    };
  });

  const lastSessao = sessoes[0];
  const lastBlocos = (blocos ?? [])
    .filter(b => b.session_id === lastSessao.id)
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  
  const lastSessionStructure = lastBlocos.map(b => {
    const bExs = (exercicios ?? []).filter(e => e.session_block_id === b.id);
    const config = b.config as any;
    
    return {
      titulo: b.titulo,
      formato: b.formato,
      chave: config?.chave || b.id,
      numeroExercicios: bExs.length || 1,
      fonteExercicios: config?.fonteExercicios || { metodologias: [] }
    };
  });

  const usageMap = new Map<string, { id: string; name: string; count: number; lastIdx: number }>();
  exercicios?.forEach((e) => {
    const id = e.exercise_id || e.nome_livre;
    if (!id) return;
    
    const name = e.nome_livre || (e.exercises as any)?.nome_pt || "Exercício";
    const current = usageMap.get(id) || { id, name, count: 0, lastIdx: -1 };
    
    const sIdx = sessoes.findIndex(s => 
      (blocos ?? []).some(b => b.id === e.session_block_id && b.session_id === s.id)
    );

    usageMap.set(id, {
      id,
      name,
      count: current.count + 1,
      lastIdx: Math.max(current.lastIdx, sIdx)
    });
  });

  const usage = Array.from(usageMap.values())
    .map(u => ({ exerciseId: u.id, name: u.name, count: u.count, lastSeenSessionIdx: u.lastIdx }))
    .sort((a, b) => b.count - a.count);

  const softAvoidIds = usage
    .filter(u => (sessoes.length - 1 - u.lastSeenSessionIdx) < cooldown)
    .map(u => u.exerciseId);

  const recentFormats = Array.from(new Set((blocos ?? []).map(b => b.formato))).slice(0, 10);

  return {
    version: 1,
    programId,
    sourceSessionCount: sessoes.length,
    lastWeekNumber,
    recentSessions: sessionData,
    usage,
    hardExcludeIds: [],
    softAvoidIds,
    recentFormats,
    lastSessionStructure,
    progressionNotes: `Analisadas ${sessoes.length} sessões. Foco em evitar repetições das últimas ${cooldown} sessões e manter progressão ondulatória.`
  };
}