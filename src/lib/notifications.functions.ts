import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const sendInAppNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { studentIds: string[]; title: string; body: string; kind?: "studio" | "pt" }) => {
    if (!Array.isArray(input.studentIds) || input.studentIds.length === 0)
      throw new Error("Selecione ao menos um aluno");
    if (!input.title?.trim()) throw new Error("Título obrigatório");
    if (!input.body?.trim()) throw new Error("Mensagem obrigatória");
    return { ...input, kind: input.kind ?? "studio" };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const table = data.kind === "pt" ? "pt_students" : "students";
    const { data: students, error } = await supabase
      .from(table)
      .select("id, name, account_user_id")
      .in("id", data.studentIds)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);

    const withAccount = (students ?? []).filter((s) => s.account_user_id);
    const withoutAccount = (students ?? []).filter((s) => !s.account_user_id);

    if (withAccount.length === 0) {
      return { sent: 0, skipped: withoutAccount.map((s) => s.name) };
    }

    const rows = withAccount.map((s) => ({
      recipient_user_id: s.account_user_id!,
      sender_user_id: userId,
      title: data.title.trim(),
      body: data.body.trim(),
    }));

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: iErr } = await supabaseAdmin.from("notifications").insert(rows);
    if (iErr) throw new Error(iErr.message);

    return { sent: withAccount.length, skipped: withoutAccount.map((s) => s.name) };
  });

export const clearAllNotificationsFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("pt_notifications")
      .delete()
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const notifyCoachWorkoutCompleted = createServerFn({ method: "POST" })
  .validator((input: {
    coachUserId?: string | null;
    studentId: string;
    studentName: string;
    dayName: string;
    durationSeconds: number;
    durationFormatted: string;
    loadsCount: number;
    performedCount: number;
    feedback?: string | null;
    executionId?: string;
    studentType?: "studio" | "pt";
  }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Coleta destinatários da gestão (coachUserId + todos os super_admins e admins)
    const { data: adminRoles } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .in("role", ["super_admin", "admin"]);

    const adminIds = (adminRoles ?? []).map((r: any) => r.user_id as string);
    const targetUserIds = Array.from(new Set([data.coachUserId, ...adminIds])).filter(Boolean) as string[];

    const isStudio = data.studentType === "studio";
    const title = isStudio
      ? `🏋️ ${data.studentName} (Studio - Planilha) finalizou o treino!`
      : `🏋️ ${data.studentName} finalizou o treino!`;
    const feedbackText = data.feedback ? ` | Feedback: "${data.feedback}"` : "";
    const originText = isStudio ? " [Aluno Studio]" : "";
    const message = `Treino "${data.dayName}" concluído em ${data.durationFormatted} (${data.performedCount} exerc., ${data.loadsCount} cargas)${originText}${feedbackText}`;

    // 2. Grava em pt_notifications para TODOS os administradores e treinadores
    if (targetUserIds.length > 0) {
      const rows = targetUserIds.map((userId) => ({
        user_id: userId,
        title,
        message,
        type: "training_complete",
        metadata: {
          student_id: data.studentId,
          student_name: data.studentName,
          student_type: data.studentType || "pt",
          day_name: data.dayName,
          execution_id: data.executionId,
          duration_seconds: data.durationSeconds,
          duration_formatted: data.durationFormatted,
          loads_count: data.loadsCount,
          feedback: data.feedback || null,
          performed_count: data.performedCount,
        },
      }));

      const { error } = await supabaseAdmin.from("pt_notifications").insert(rows);
      if (error) {
        console.error("[notifyCoachWorkoutCompleted] Erro ao gravar notificação no sininho:", error);
      }
    }

    return { success: true, notifiedCount: targetUserIds.length };
  });
