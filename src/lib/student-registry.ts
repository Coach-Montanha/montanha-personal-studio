import { supabase } from "@/integrations/supabase/client";

export type StudentTag = "studio" | "personal";

/**
 * Garante que um aluno da tabela central `students` possua seu registro espelho
 * sincronizado na tabela `pt_students` com o mesmo `id`, preservando
 * `account_user_id` e `temp_password` para nunca quebrar o acesso ao Portal nem
 * violar a chave estrangeira `pt_programs_pt_student_id_fkey`.
 */
export async function ensureStudentTrainingLink(
  studentId: string,
  fallbackUserId?: string
): Promise<{ id: string; account_user_id: string | null }> {
  const [{ data: studioRow, error: stErr }, { data: existingPt }] = await Promise.all([
    supabase
      .from("students")
      .select("id, user_id, name, email, phone, account_user_id, temp_password, status, birth_date, start_date")
      .eq("id", studentId)
      .maybeSingle(),
    supabase
      .from("pt_students")
      .select("id, account_user_id, temp_password, notes")
      .eq("id", studentId)
      .maybeSingle(),
  ]);

  if (stErr) {
    throw new Error(`Falha ao consultar aluno no cadastro central: ${stErr.message}`);
  }

  // Se não está em `students`, pode ser um aluno exclusivamente de `pt_students`
  if (!studioRow) {
    if (existingPt) {
      return { id: existingPt.id, account_user_id: existingPt.account_user_id ?? null };
    }
    throw new Error("Aluno não encontrado no cadastro central nem em Personal Trainer.");
  }

  const resolvedAccountUserId = studioRow.account_user_id ?? existingPt?.account_user_id ?? null;
  const resolvedTempPassword = studioRow.temp_password ?? existingPt?.temp_password ?? null;
  const ownerUserId = studioRow.user_id || fallbackUserId;

  if (!ownerUserId) {
    throw new Error("Usuário proprietário não identificado para vincular o aluno.");
  }

  const existingNotes = existingPt?.notes?.trim();
  const resolvedNotes = existingNotes
    ? existingNotes.includes("[Studio]") || existingNotes.includes("[Aluno Studio]")
      ? existingNotes
      : `${existingNotes} [Aluno Studio]`
    : "[Aluno Studio]";

  const { error: upsertErr } = await supabase.from("pt_students").upsert(
    {
      id: studioRow.id,
      user_id: ownerUserId,
      name: studioRow.name,
      email: studioRow.email ?? null,
      phone: studioRow.phone ?? null,
      birth_date: studioRow.birth_date ?? null,
      start_date: studioRow.start_date ?? null,
      account_user_id: resolvedAccountUserId,
      temp_password: resolvedTempPassword,
      status: studioRow.status === "inactive" ? "inactive" : "active",
      notes: resolvedNotes,
    },
    { onConflict: "id" }
  );

  if (upsertErr) {
    throw new Error(`Falha ao sincronizar espelho de treino do aluno: ${upsertErr.message}`);
  }

  return { id: studioRow.id, account_user_id: resolvedAccountUserId };
}

/**
 * Extrai as tags de segmento de um aluno a partir da coluna `tags` (quando disponível)
 * ou infere com base em `notes` / presença em Studio vs Personal.
 */
export function resolveStudentTags(
  student: { tags?: string[] | null; notes?: string | null },
  hasPersonalLink = false
): StudentTag[] {
  if (Array.isArray(student.tags) && student.tags.length > 0) {
    const valid = student.tags.filter(
      (t): t is StudentTag => t === "studio" || t === "personal"
    );
    if (valid.length > 0) return Array.from(new Set(valid));
  }
  const tags: StudentTag[] = ["studio"];
  if (hasPersonalLink || student.notes?.includes("[Personal]")) {
    tags.push("personal");
  }
  return tags;
}
