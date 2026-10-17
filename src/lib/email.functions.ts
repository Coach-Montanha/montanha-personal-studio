import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type EmailSettings = {
  hasKey: boolean;
  senderEmail: string | null;
};

export const getEmailSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EmailSettings> => {
    const { data, error } = await context.supabase
      .from("user_email_settings")
      .select("resend_api_key, sender_email")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      hasKey: !!data?.resend_api_key,
      senderEmail: data?.sender_email ?? null,
    };
  });

export const saveEmailSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { resendApiKey?: string | null; senderEmail?: string | null }) => ({
    resendApiKey: input.resendApiKey ?? null,
    senderEmail: input.senderEmail ?? null,
  }))
  .handler(async ({ data, context }) => {
    const payload: {
      user_id: string;
      sender_email: string | null;
      resend_api_key?: string;
    } = {
      user_id: context.userId,
      sender_email: data.senderEmail,
    };
    // Only overwrite the API key when a non-empty value is provided,
    // so users can update the sender email without re-typing the key.
    if (data.resendApiKey && data.resendApiKey.trim().length > 0) {
      payload.resend_api_key = data.resendApiKey.trim();
    }
    const { error } = await context.supabase
      .from("user_email_settings")
      .upsert(payload, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const sendEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { to: string; subject: string; text: string }) => {
    if (!input.to || !input.to.includes("@")) throw new Error("Destinatário inválido");
    if (!input.text || input.text.trim().length === 0) throw new Error("Mensagem vazia");
    return {
      to: input.to,
      subject: input.subject || "Mensagem da sua academia",
      text: input.text,
    };
  })
  .handler(async ({ data, context }) => {
    const { data: settings, error } = await context.supabase
      .from("user_email_settings")
      .select("resend_api_key, sender_email")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const apiKey = settings?.resend_api_key; // Removido fallback para process.env.RESEND_API_KEY compartilhado
    if (!apiKey) {
      throw new Error("Configure sua própria API key do Resend em Configurações > Geral.");
    }
    const from = settings?.sender_email || "noreply@seudominio.com";

    // Rodapé de Conformidade Legal Obrigatório (CDC Art. 33, Decreto 7.962/13 e LGPD)
    const legalFooter =
      `\n\n---\n` +
      `Ecossistema Montanha — Gestão e Performance Esportiva\n` +
      `CNPJ: 50.123.456/0001-78 | Av. das Américas, 4200 - Rio de Janeiro - RJ, 22640-102\n` +
      `Você está recebendo esta mensagem como usuário cadastrado.\n` +
      `Para descadastrar-se de comunicações informativas ou alterar preferências, responda com "DESCADASTRAR" ou acesse: https://montanha-personal-studio.vercel.app/portal/perfil`;

    const finalText = data.text + legalFooter;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [data.to],
        subject: data.subject,
        text: finalText,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend ${res.status}: ${body.slice(0, 200)}`);
    }
    return { ok: true };
  });
