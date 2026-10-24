import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/forms/google-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          // Espera formato vindo do Google Apps Script ou webhook
          // { formSlug, formTitle, respondentName, respondentContact, answers }
          const formSlug = body.formSlug || body.slug || "formulario-google";
          const formTitle = body.formTitle || body.title || "Formulário Google";
          const respondentName = body.respondentName || body.name || "Respondente Google";
          const respondentContact = body.respondentContact || body.contact || body.email || "";
          const answers = body.answers || body.data || body;

          // Encontra treinador responsável
          let targetUserId = null;
          try {
            const { data: formDef } = await supabaseAdmin
              .from("pt_notifications")
              .select("user_id")
              .eq("type", "custom_form_definition")
              .filter("metadata->>slug", "eq", formSlug.toLowerCase().trim())
              .maybeSingle();

            if (formDef?.user_id) targetUserId = formDef.user_id;
          } catch {}

          if (!targetUserId) {
            try {
              const { data: adminUser } = await supabaseAdmin
                .from("profiles")
                .select("id")
                .order("created_at", { ascending: true })
                .limit(1)
                .maybeSingle();

              targetUserId = adminUser?.id || "b75fc258-7809-4861-b52f-55877117cc92";
            } catch {
              targetUserId = "b75fc258-7809-4861-b52f-55877117cc92";
            }
          }

          const { error } = await supabaseAdmin.from("pt_notifications" as any).insert({
            user_id: targetUserId,
            title: `📋 Novo Envio (Google Forms): ${formTitle} (${respondentName})`,
            message: `${respondentName} (${respondentContact || "Sem contato"}) enviou respostas pelo Google Forms.`,
            type: "form_submission",
            metadata: {
              form_slug: formSlug,
              form_title: formTitle,
              respondent_name: respondentName,
              respondent_contact: respondentContact,
              answers,
              origin: "google_forms_webhook",
              submitted_at: new Date().toISOString(),
            },
          });

          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ ok: true, message: "Resposta importada com sucesso!" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err?.message || "Erro interno" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
