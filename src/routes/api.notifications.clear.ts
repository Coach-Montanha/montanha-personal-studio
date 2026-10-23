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

          const { error } = await supabaseAdmin
            .from("pt_notifications")
            .delete()
            .eq("user_id", userId);

          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
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
