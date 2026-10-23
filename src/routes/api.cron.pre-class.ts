import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTrainerWhatsAppAlert } from "@/lib/whatsapp.server";

export const Route = createFileRoute("/api/cron/pre-class")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization") || "";
          const cronSecret = process.env.CRON_SECRET;
          if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 1. Data e hora atual no fuso de Brasília (UTC-3)
          const nowBrt = new Date(
            new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
          );
          const todayIso = nowBrt.toISOString().slice(0, 10);

          // 2. Busca sessões do dia
          const { data: sessions, error } = await supabaseAdmin
            .from("class_sessions")
            .select(`
              id,
              user_id,
              session_date,
              start_time,
              classes:class_id ( name ),
              class_attendance (
                id,
                students:student_id ( name )
              )
            `)
            .eq("session_date", todayIso);

          if (error) throw new Error(error.message);

          const notifiedList: any[] = [];

          for (const session of sessions || []) {
            if (!session.start_time) continue;
            const [h, m] = session.start_time.split(":").map(Number);
            const sessionTime = new Date(nowBrt);
            sessionTime.setHours(h, m, 0, 0);

            const diffSeconds = Math.floor(
              (sessionTime.getTime() - nowBrt.getTime()) / 1000
            );

            // Janela: 19 minutos e 30 segundos antes (1170s) até 3 minutos antes (180s)
            if (diffSeconds <= 1170 && diffSeconds >= 180) {
              const { data: alreadySent } = await supabaseAdmin
                .from("pt_notifications")
                .select("id")
                .or("type.eq.whatsapp_class_reminder_19m30s,type.eq.whatsapp_class_reminder_20m")
                .contains("metadata", { session_id: session.id, session_date: todayIso })
                .maybeSingle();

              if (!alreadySent) {
                const attendees = (session.class_attendance ?? [])
                  .map((a: any) => a.students?.name)
                  .filter(Boolean);

                const className = (session.classes as any)?.name || "Turma";
                const timeFormatted = session.start_time.slice(0, 5);

                await sendTrainerWhatsAppAlert({
                  type: "pre_class_19m30s",
                  className,
                  timeFormatted,
                  attendees,
                  date: todayIso,
                });

                await supabaseAdmin.from("pt_notifications" as any).insert({
                  user_id: session.user_id,
                  title: `⏰ [WhatsApp] Aula em 19m 30s (${timeFormatted} - ${className})`,
                  message: `${attendees.length} aluno(s) confirmados: ${attendees.join(", ")}`,
                  type: "whatsapp_class_reminder_19m30s",
                  metadata: {
                    session_id: session.id,
                    session_date: todayIso,
                    start_time: session.start_time,
                    attendees,
                  },
                });

                notifiedList.push({
                  sessionId: session.id,
                  className,
                  time: timeFormatted,
                  attendeesCount: attendees.length,
                });
              }
            }
          }

          return new Response(
            JSON.stringify({
              ok: true,
              date: todayIso,
              time: nowBrt.toISOString(),
              notified: notifiedList,
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: any) {
          console.error("[Cron Pre-Class] Erro:", err.message);
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
