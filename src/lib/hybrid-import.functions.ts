import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Integração com o projeto "Sistema Híbrido de Treinamento".
 * 
 * Este arquivo foi atualizado para usar uma chave de API direta caso os 
 * segredos de ambiente não estejam disponíveis no Lovable Cloud.
 */

const ExerciseSchema = z
  .object({
    name: z.string().min(1),
    sets: z.union([z.number(), z.string()]).nullish(),
    reps: z.union([z.number(), z.string()]).nullish(),
    load_kg: z.union([z.number(), z.string()]).nullish(),
    load: z.string().nullish(),
    rest_seconds: z.union([z.number(), z.string()]).nullish(),
    rest_sec: z.union([z.number(), z.string()]).nullish(),
    observations: z.string().nullish(),
    notes: z.string().nullish(),
  })
  .transform((e) => ({
    ...e,
    rest_seconds: e.rest_seconds ?? e.rest_sec ?? null,
    observations: e.observations ?? e.notes ?? null,
  }));

const BlockSchema = z.object({
  format: z.string().nullish(),
  title: z.string().nullish(),
  exercises: z.array(ExerciseSchema).default([]),
});

const SessionSchema = z.object({
  title: z.string().nullish(),
  day_number: z.number().nullish(),
  date: z.string().nullish(),
  blocks: z.array(BlockSchema).default([]),
});

const WeekSchema = z
  .object({
    number: z.number().nullish(),
    week_number: z.number().nullish(),
    sessions: z.array(SessionSchema).default([]),
  })
  .transform((w) => ({ ...w, number: w.number ?? w.week_number ?? null }));


export const HybridProgramSchema = z.object({
  id: z.string().nullish(),
  title: z.string().min(1),
  methodology: z.string().nullish(),
  start_date: z.string().nullish(),
  weeks: z.array(WeekSchema).nullish(),
  sessions: z.array(SessionSchema).nullish(),
});

export type HybridProgram = z.infer<typeof HybridProgramSchema>;

export type HybridProgramSummary = {
  id: string;
  title: string;
  methodology?: string | null;
  start_date?: string | null;
  weeks_count?: number | null;
  sessions_count?: number | null;
};

function originConfig() {
  const envUrl = process.env.HYBRID_API_URL?.trim();
  const defaultUrl = "https://montanha-hybrid-training.vercel.app";
  // Evita apontar para o subdomínio antigo do Lovable que retorna 404
  const url = (envUrl && !envUrl.includes("sistemahibridodetreinamento.lovable.app") ? envUrl : defaultUrl).replace(/\/+$/, "");
  const token = process.env.HYBRID_API_TOKEN || "chm_sk_64f944daa5b3154fbe821e56e1d16e7ccb0afd6a7c753432451022b948974fe1";
  return { url, token, configured: Boolean(url && token) };
}

async function originFetch(path: string) {
  const { url, token } = originConfig();
  const primaryUrl = `${url}${path}`;
  const fallbackUrl = `https://montanha-hybrid-training.vercel.app${path}`;

  let res: Response | null = null;
  try {
    res = await fetch(primaryUrl, {
      headers: {
        "x-api-key": token ?? "",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  } catch {
    // Tenta fallback
  }

  if (!res || !res.ok) {
    if (primaryUrl !== fallbackUrl) {
      try {
        const fbRes = await fetch(fallbackUrl, {
          headers: {
            "x-api-key": token ?? "",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (fbRes.ok) return fbRes.json();
      } catch {
        // Ignora e cai no tratamento de erro padrão
      }
    }

    if (res) {
      throw new Error(
        res.status === 401 || res.status === 403
          ? "Token de integração recusado pela origem."
          : res.status === 404
            ? "Endpoint não encontrado na origem (a API pública ainda não foi criada lá)."
            : `Origem respondeu ${res.status}.`,
      );
    }
    throw new Error("Falha de conexão com o Sistema Híbrido de Treinamento.");
  }
  return res.json();
}

/** Diz à UI se a conexão com a origem está configurada. */
export const getHybridStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { url, configured } = originConfig();
    return { configured, url: url ?? null };
  });

/** Lista os programas disponíveis na origem. */
export const listHybridPrograms = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<{ ok: boolean; error?: string; programs: HybridProgramSummary[] }> => {
    if (!originConfig().configured)
      return { ok: false, error: "not_configured", programs: [] };
    try {
      const json = (await originFetch("/api/public/programs")) as any;
      const raw = Array.isArray(json) ? json : (json?.data ?? json?.programs ?? []);
      const programs: HybridProgramSummary[] = raw.map((p: any) => ({
        id: String(p.id),
        title: p.title ?? p.titulo ?? "Programa sem título",
        methodology: p.methodology ?? p.metodologia ?? null,
        start_date: p.start_date ?? p.data_inicio ?? null,
        weeks_count: p.weeks_count ?? p.duracao_semanas ?? null,
        sessions_count: p.sessions_count ?? null,
      }));
      return { ok: true, programs };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Falha ao consultar a origem", programs: [] };
    }
  });

/** Busca um programa completo na origem, já normalizado. */
export const fetchHybridProgram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: z.string().min(1) }).parse(raw))
  .handler(async ({ data }) => {
    if (!originConfig().configured) throw new Error("Integração não configurada");
    const json = await originFetch(`/api/public/programs/${encodeURIComponent(data.id)}`);
    const payload = (json as any)?.data ?? (json as any)?.program ?? json;
    return HybridProgramSchema.parse(payload);
  });

/* ------------------------------ normalização ----------------------------- */

type FlatExercise = {
  name: string;
  sets_reps: string | null;
  load: string | null;
  rest_seconds: string | null;
  observations: string | null;
};

type FlatDay = { name: string; day_label: string; description: string | null; exercises: FlatExercise[] };

function str(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  return String(v);
}

export function flattenHybridProgram(program: HybridProgram): FlatDay[] {
  const days: FlatDay[] = [];
  const weeks = program.weeks?.length
    ? program.weeks
    : [{ number: 1, sessions: program.sessions ?? [] }];

  weeks.forEach((week, wi) => {
    const weekNumber = week.number ?? wi + 1;
    week.sessions.forEach((session, si) => {
      const dayNumber = session.day_number ?? si + 1;
      const exercises: FlatExercise[] = [];
      session.blocks.forEach((block) => {
        block.exercises.forEach((ex) => {
          const sets = str(ex.sets);
          const reps = str(ex.reps);
          const setsReps = sets && reps ? `${sets}x${reps}` : (reps ?? sets);
          const blockTag = block.title ?? block.format ?? null;
          const obs = [blockTag ? `[${blockTag}]` : null, str(ex.observations)]
            .filter(Boolean)
            .join(" ");
          exercises.push({
            name: ex.name,
            sets_reps: setsReps,
            load: ex.load ?? (ex.load_kg != null ? `${ex.load_kg} kg` : null),
            rest_seconds: str(ex.rest_seconds),
            observations: obs || null,
          });
        });
      });
      days.push({
        name: session.title ?? `Semana ${weekNumber} · Dia ${dayNumber}`,
        day_label: `S${weekNumber}D${dayNumber}`,
        description: session.date ?? null,
        exercises,
      });
    });
  });

  return days;
}

/* -------------------------------- import --------------------------------- */

const ImportInput = z.object({
  ptStudentId: z.string().uuid().optional(),
  studioStudentId: z.string().uuid().optional(),
  studentType: z.enum(["pt", "studio"]).default("pt"),
  programId: z.string().min(1).optional(),
  program: HybridProgramSchema.optional(),
  showToStudent: z.boolean().default(true),
});

export const importHybridProgram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const parsed = ImportInput.parse(raw);
    if (!parsed.programId && !parsed.program)
      throw new Error("Informe um programa da origem ou cole o JSON");
    if (!parsed.ptStudentId && !parsed.studioStudentId)
      throw new Error("Selecione o aluno de destino");
    return parsed;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const targetStudentId = (data.studioStudentId || data.ptStudentId)!;
    let studentName = "";

    if (data.studentType === "studio" || data.studioStudentId) {
      const { data: student, error: stErr } = await supabase
        .from("students")
        .select("id,user_id,name")
        .eq("id", targetStudentId)
        .maybeSingle();
      if (stErr) throw new Error(stErr.message);
      if (!student) throw new Error("Aluno do Studio não encontrado");
      if ((student as any).user_id !== userId) throw new Error("Sem permissão para este aluno");
      studentName = student.name;
    } else {
      const { data: student, error: stErr } = await supabase
        .from("pt_students")
        .select("id,user_id,name")
        .eq("id", targetStudentId)
        .maybeSingle();
      if (stErr) throw new Error(stErr.message);
      if (!student) throw new Error("Aluno PT não encontrado");
      if ((student as any).user_id !== userId) throw new Error("Sem permissão para este aluno");
      studentName = student.name;
    }

    const program: HybridProgram = data.program
      ? HybridProgramSchema.parse(data.program)
      : HybridProgramSchema.parse(
          (await originFetch(`/api/public/programs/${encodeURIComponent(data.programId!)}`)) as any,
        );

    const days = flattenHybridProgram(program);
    if (days.length === 0) throw new Error("O programa não contém sessões de treino");

    const startDate =
      program.start_date && /^\d{4}-\d{2}-\d{2}$/.test(program.start_date)
        ? program.start_date
        : new Date().toISOString().slice(0, 10);

    const programPayload: any = {
      user_id: userId,
      name: program.title,
      start_date: startDate,
      goals: program.methodology ? `Importado do Sistema Híbrido · ${program.methodology}` : null,
      show_to_student: data.showToStudent,
    };

    if (data.studentType === "studio" || data.studioStudentId) {
      programPayload.studio_student_id = targetStudentId;
      programPayload.pt_student_id = null;
    } else {
      programPayload.pt_student_id = targetStudentId;
    }

    const { data: created, error: cErr } = await supabase
      .from("pt_programs")
      .insert(programPayload as never)
      .select("id")
      .single();
    if (cErr) throw new Error(`Falha ao criar programa: ${cErr.message}`);
    const newProgramId = (created as any).id as string;

    try {
      for (const [i, day] of days.entries()) {
        const { data: newDay, error: dErr } = await supabase
          .from("pt_training_days")
          .insert({
            user_id: userId,
            program_id: newProgramId,
            name: day.name,
            day_label: day.day_label,
            description: day.description,
            sort_order: i,
          } as never)
          .select("id")
          .single();
        if (dErr) throw new Error(dErr.message);
        const dayId = (newDay as any).id as string;

        if (day.exercises.length > 0) {
          const rows = day.exercises.map((ex, j) => ({
            user_id: userId,
            training_day_id: dayId,
            name: ex.name,
            sets_reps: ex.sets_reps,
            load: ex.load,
            rest_seconds: ex.rest_seconds,
            observations: ex.observations,
            sort_order: j,
          }));
          const { error: exErr } = await supabase
            .from("pt_training_exercises")
            .insert(rows as never);
          if (exErr) throw new Error(exErr.message);
        }
      }
    } catch (e) {
      await supabase.from("pt_programs").delete().eq("id", newProgramId);
      throw e;
    }

    return {
      programId: newProgramId,
      studentName: (student as any).name as string,
      days: days.length,
      exercises: days.reduce((s, d) => s + d.exercises.length, 0),
    };
  });
/* --------------------------- exercícios (banco) --------------------------- */

export type HybridExercise = {
  id: string;
  name: string;
  description: string | null;
  muscle_group: string | null;
  media_url: string | null;
  media_type: string | null;
  thumbnail_url: string | null;
};

function normalizeExercise(raw: any): HybridExercise | null {
  const name = String(raw?.name ?? raw?.nome ?? "").trim();
  if (!name) return null;
  const media = raw?.media ?? {};
  const video = media?.video ?? raw?.video_url ?? null;
  const gif = media?.gif ?? raw?.gif_url ?? null;
  const image = media?.image ?? raw?.image_url ?? raw?.thumbnail_url ?? null;
  const url = video ?? gif ?? image ?? null;
  const equip = Array.isArray(raw?.equipment) ? raw.equipment.filter(Boolean) : [];
  const methods = Array.isArray(raw?.methodologies) ? raw.methodologies.filter(Boolean) : [];
  const parts = [
    raw?.description ? String(raw.description) : null,
    raw?.instructions ? String(raw.instructions) : null,
    raw?.name_en ? `Nome (EN): ${raw.name_en}` : null,
    equip.length ? `Equipamento: ${equip.join(", ")}` : null,
    methods.length ? `Metodologias: ${methods.join(", ")}` : null,
  ].filter(Boolean) as string[];
  return {
    id: String(raw?.id ?? name),
    name,
    description: parts.length ? parts.join("\n") : null,
    muscle_group: raw?.muscle_group ?? (equip.length ? String(equip[0]) : null),
    media_url: url ? String(url) : null,
    media_type: url ? (video ? "video" : "image") : null,
    thumbnail_url: image ? String(image) : gif ? String(gif) : null,
  };
}


/** Lista os exercícios do banco da origem. */
export const listHybridExercises = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<{ ok: boolean; error?: string; exercises: HybridExercise[] }> => {
    try {
      const json = (await originFetch("/api/public/exercises")) as any;
      const raw = Array.isArray(json) ? json : (json?.data ?? json?.exercises ?? []);
      const exercises = (raw as any[]).map(normalizeExercise).filter(Boolean) as HybridExercise[];
      if (exercises.length > 0) return { ok: true, exercises };
    } catch {
      // Fallback gracioso para acervo embutido
    }

    try {
      const localModule = await import("@/data/mfit-exercises-normalized.json");
      const localData = localModule.default || localModule;
      const exercises = (localData as any[]).map(normalizeExercise).filter(Boolean) as HybridExercise[];
      return { ok: true, exercises };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Falha ao consultar a origem", exercises: [] };
    }
  });

/** Importa os exercícios da origem para a biblioteca de movimentos deste projeto. */
export const importHybridExercises = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ ids: z.array(z.string()).optional() }).parse(raw ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    let raw: any = null;
    try {
      const json = (await originFetch("/api/public/exercises")) as any;
      raw = Array.isArray(json) ? json : (json?.data ?? json?.exercises ?? []);
    } catch {
      const localModule = await import("@/data/mfit-exercises-normalized.json");
      raw = localModule.default || localModule;
    }
    let list = (raw as any[]).map(normalizeExercise).filter(Boolean) as HybridExercise[];
    if (data.ids?.length) {
      const set = new Set(data.ids);
      list = list.filter((e) => set.has(e.id));
    }
    if (list.length === 0) return { imported: 0, skipped: 0, total: 0 };

    const { data: existing, error: exErr } = await supabase
      .from("pt_exercises_library")
      .select("id,name,description,media_url,media_type,thumbnail_url,muscle_group")
      .eq("user_id", userId);
    if (exErr) throw new Error(exErr.message);
    const byName = new Map(
      (existing ?? []).map((r: any) => [String(r.name).trim().toLowerCase(), r]),
    );

    const rows: any[] = [];
    let updated = 0;

    for (const e of list) {
      const key = e.name.trim().toLowerCase();
      const cur = byName.get(key);
      if (!cur) {
        rows.push({
          user_id: userId,
          name: e.name,
          muscle_group: e.muscle_group,
          description: e.description,
          media_url: e.media_url,
          media_type: e.media_type,
          thumbnail_url: e.thumbnail_url,
          is_global: false,
        });
        continue;
      }
      // Completa informações que ainda faltam no registro local (sem sobrescrever o que já existe)
      const patch: Record<string, unknown> = {};
      if (!cur.description && e.description) patch.description = e.description;
      if (!cur.muscle_group && e.muscle_group) patch.muscle_group = e.muscle_group;
      if (!cur.media_url && e.media_url) {
        patch.media_url = e.media_url;
        patch.media_type = e.media_type;
      }
      if (!cur.thumbnail_url && e.thumbnail_url) patch.thumbnail_url = e.thumbnail_url;
      if (Object.keys(patch).length > 0) {
        const { error } = await supabase
          .from("pt_exercises_library")
          .update(patch as never)
          .eq("id", cur.id)
          .eq("user_id", userId);
        if (error) throw new Error(error.message);
        updated++;
      }
    }

    if (rows.length > 0) {
      const { error } = await supabase.from("pt_exercises_library").insert(rows as never);
      if (error) throw new Error(error.message);
    }

    return {
      imported: rows.length,
      updated,
      skipped: list.length - rows.length - updated,
      total: list.length,
      withMedia: list.filter((e) => e.media_url).length,
    };
  });

