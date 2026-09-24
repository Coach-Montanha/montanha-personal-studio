import { supabase } from "@/integrations/supabase/client";
import type { AgendaSession } from "@/lib/classes.functions";

export async function fetchAgendaClient(
  from: string,
  to: string,
  programId?: string | null,
): Promise<AgendaSession[]> {
  const { data: u } = await supabase.auth.getUser();
  const userId = u.user?.id;
  const today = new Date().toISOString().slice(0, 10);

  // 1. Identifica se o usuário logado é aluno (para restrições de programa e saldo bônus)
  let studentId: string | null = null;
  let bonusBalance = 0;
  if (userId) {
    const { data: stu } = await supabase
      .from("students")
      .select("id, bonus_checkins_balance")
      .eq("account_user_id", userId)
      .maybeSingle();
    studentId = stu?.id ?? null;
    bonusBalance = (stu as any)?.bonus_checkins_balance ?? 0;
  }

  // 2. Busca sessões do range diretamente via cliente Supabase (RLS autenticado)
  const { data: sessionsData, error: sessErr } = await supabase
    .from("class_sessions")
    .select(`
      id, session_date, start_time, duration_minutes, class_id, user_id,
      capacity_override, notes, status,
      classes:class_id (
        name, trainer_name, capacity, program_id,
        checkin_opens_minutes_before, checkin_closes_minutes_before,
        programs:program_id ( id, name, color )
      )
    `)
    .gte("session_date", from)
    .lte("session_date", to)
    .order("session_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (sessErr) {
    console.error("Erro ao carregar turmas na agenda:", sessErr);
    return [];
  }

  const sessions = sessionsData ?? [];
  const sessionIds = sessions.map((s: any) => s.id);

  // 3. Attendance do range + pagamentos do aluno em paralelo
  const [attRes, paymentsRes] = await Promise.all([
    sessionIds.length > 0
      ? supabase
          .from("class_attendance")
          .select("session_id, student_id")
          .in("session_id", sessionIds)
      : Promise.resolve({ data: [] as any[] }),
    studentId
      ? supabase
          .from("payments")
          .select("plan_id,due_date,payment_date")
          .eq("student_id", studentId)
          .eq("status", "paid")
          .not("plan_id", "is", null)
          .order("payment_date", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const countsMap = new Map<string, number>();
  const checkedInSessionIds = new Set<string>();
  for (const r of (attRes.data ?? []) as any[]) {
    countsMap.set(r.session_id, (countsMap.get(r.session_id) ?? 0) + 1);
    if (studentId && r.student_id === studentId) checkedInSessionIds.add(r.session_id);
  }

  // 4. Regras de acesso a programas
  let allowedProgramIds: Set<string> | null = null;
  let hasCurrentPlan = false;
  const current = ((paymentsRes.data ?? []) as any[]).find(
    (p) => !p.due_date || p.due_date >= today,
  );
  if (current?.plan_id) {
    hasCurrentPlan = true;
    const { data: pp } = await supabase
      .from("plan_programs")
      .select("program_id")
      .eq("plan_id", current.plan_id);
    const ids = (pp ?? []).map((r: any) => r.program_id);
    allowedProgramIds = ids.length > 0 ? new Set(ids) : null;
  }

  const hasPlanAccess = (progId: string | null) => {
    if (!studentId || !hasCurrentPlan) return false;
    if (allowedProgramIds === null) return true;
    return progId ? allowedProgramIds.has(progId) : false;
  };

  const hasAccess = (progId: string | null) => {
    // Coach / Admin do studio tem acesso irrestrito
    if (!studentId) return true;
    // Aluno com saldo de bônus pode agendar
    if (bonusBalance > 0) return true;
    return hasPlanAccess(progId);
  };

  let out: AgendaSession[] = sessions.map((s: any) => {
    const progId = s.classes?.program_id ?? null;
    return {
      id: s.id,
      session_date: s.session_date,
      start_time: s.start_time,
      duration_minutes: s.duration_minutes,
      class_id: s.class_id,
      class_name: s.classes?.name ?? "Turma removida",
      trainer_name: s.classes?.trainer_name ?? null,
      program_id: progId,
      program_name: s.classes?.programs?.name ?? null,
      program_color: s.classes?.programs?.color ?? null,
      capacity: s.capacity_override ?? s.classes?.capacity ?? 0,
      filled: countsMap.get(s.id) ?? 0,
      is_enrolled: hasAccess(progId),
      has_plan_access: hasPlanAccess(progId),
      checked_in: checkedInSessionIds.has(s.id),
      checkin_opens_minutes_before: s.classes?.checkin_opens_minutes_before ?? 60,
      checkin_closes_minutes_before: s.classes?.checkin_closes_minutes_before ?? 15,
      studio_user_id: s.user_id,
      capacity_override: s.capacity_override ?? null,
      session_notes: s.notes ?? null,
      status: s.status ?? "scheduled",
    };
  });

  if (programId && programId !== "all") {
    out = out.filter((s) => s.program_id === programId);
  }

  return out;
}
