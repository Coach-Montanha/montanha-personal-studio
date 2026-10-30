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

          // 1. Data e hora atual no fuso de Brasília (America/Sao_Paulo) via Intl.DateTimeFormat
          const tz = "America/Sao_Paulo";
          const now = new Date();
          const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).formatToParts(now);

          const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "00";
          const year = getPart("year");
          const month = getPart("month");
          const day = getPart("day");
          const hour = parseInt(getPart("hour"), 10);
          const minute = parseInt(getPart("minute"), 10);
          const second = parseInt(getPart("second"), 10);

          const todayIso = `${year}-${month}-${day}`;
          const currentDaySeconds = hour * 3600 + minute * 60 + second;

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
            const [h, m, s = 0] = session.start_time.split(":").map(Number);
            const sessionDaySeconds = h * 3600 + m * 60 + s;

            // Segundos restantes até a aula
            const diffSeconds = sessionDaySeconds - currentDaySeconds;

            // Janela de disparo precisa: de 21 minutos (1260s) até 2 minutos antes (120s)
            if (diffSeconds <= 1260 && diffSeconds >= 120) {
              const { data: alreadySent } = await supabaseAdmin
                .from("pt_notifications")
                .select("id")
                .or("type.eq.class_reminder_19m30s,type.eq.whatsapp_class_reminder_19m30s,type.eq.whatsapp_class_reminder_20m")
                .contains("metadata", { session_id: session.id, session_date: todayIso })
                .maybeSingle();

              if (!alreadySent) {
                const attendees = (session.class_attendance ?? [])
                  .map((a: any) => a.students?.name)
                  .filter(Boolean);

                const className = (session.classes as any)?.name || "Turma";
                const timeFormatted = session.start_time.slice(0, 5);
                const count = attendees.length;
                const messageText =
                  count > 0
                    ? `${count} aluno(s) confirmados: ${attendees.join(", ")}.`
                    : "Nenhum aluno realizou check-in até o momento.";

                // 1. Notificação Push em Tempo Real no App/Celular (pt_notifications via Supabase Realtime)
                await supabaseAdmin.from("pt_notifications" as any).insert({
                  user_id: session.user_id,
                  title: `⏰ Aula em 19m 30s (${timeFormatted} - ${className})`,
                  message: messageText,
                  type: "class_reminder_19m30s",
                  metadata: {
                    session_id: session.id,
                    session_date: todayIso,
                    start_time: session.start_time,
                    class_name: className,
                    attendee_count: count,
                    attendees,
                  },
                });

                // 2. Alerta via WhatsApp Serverless (se configurado)
                try {
                  await sendTrainerWhatsAppAlert({
                    type: "pre_class_19m30s",
                    className,
                    timeFormatted,
                    attendees,
                    date: todayIso,
                  });
                } catch (waErr: any) {
                  console.warn("[Cron Pre-Class] Aviso WhatsApp:", waErr?.message);
                }

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
              time: new Date().toISOString(),
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
