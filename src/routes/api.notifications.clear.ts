import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/api/notifications/clear")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization") || "";
          const token = authHeader.replace(/^Bearer\s+/i, "");

          let userId: string | null = null;

          if (token) {
            const { data: { user } } = await supabase.auth.getUser(token);
            userId = user?.id || null;
          }

          // Se não autenticou pelo token, tenta pelo body
          if (!userId) {
            try {
              const body = await request.json();
              if (body?.user_id) userId = body.user_id;
            } catch {
              // no body
            }
          }

          if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 1. Exclui notificações convencionais (check-ins, lembretes, avisos)
          const { error: deleteError } = await supabaseAdmin
            .from("pt_notifications")
            .delete()
            .eq("user_id", userId)
            .neq("type", "custom_form_definition")
            .neq("type", "form_submission");

          if (deleteError) {
            return new Response(JSON.stringify({ error: deleteError.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 2. Para submissões de formulários: NUNCA exclui os dados do formulário!
          // Apenas marca o aviso como lido e com a flag notification_cleared para desocupar a gaveta de notificações
          const { data: formNotifs } = await supabaseAdmin
            .from("pt_notifications")
            .select("id, metadata")
            .eq("user_id", userId)
            .eq("type", "form_submission");

          if (formNotifs && formNotifs.length > 0) {
            for (const item of formNotifs) {
              const currentMeta = (item.metadata as any) || {};
              await supabaseAdmin
                .from("pt_notifications")
                .update({
                  read: true,
                  metadata: {
                    ...currentMeta,
                    notification_cleared: true,
                    cleared_at: new Date().toISOString(),
                  },
                })
                .eq("id", item.id);
            }
          }

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
