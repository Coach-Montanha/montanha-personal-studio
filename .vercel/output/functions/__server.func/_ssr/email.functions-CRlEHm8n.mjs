import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/email.functions-CRlEHm8n.js
var getEmailSettings_createServerFn_handler = createServerRpc({
	id: "a454e7504a2752c5da71122d3abba29580e56694ff6b2938bc2452d5893f0417",
	name: "getEmailSettings",
	filename: "src/lib/email.functions.ts"
}, (opts) => getEmailSettings.__executeServer(opts));
var getEmailSettings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getEmailSettings_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("user_email_settings").select("resend_api_key, sender_email").eq("user_id", context.userId).maybeSingle();
	if (error) throw new Error(error.message);
	return {
		hasKey: !!data?.resend_api_key,
		senderEmail: data?.sender_email ?? null
	};
});
var saveEmailSettings_createServerFn_handler = createServerRpc({
	id: "78d963cc7bb1dc9031f2dc8b84cd3c53007c546d94fd73554ab3ba3f99ba3e1b",
	name: "saveEmailSettings",
	filename: "src/lib/email.functions.ts"
}, (opts) => saveEmailSettings.__executeServer(opts));
var saveEmailSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => ({
	resendApiKey: input.resendApiKey ?? null,
	senderEmail: input.senderEmail ?? null
})).handler(saveEmailSettings_createServerFn_handler, async ({ data, context }) => {
	const payload = {
		user_id: context.userId,
		sender_email: data.senderEmail
	};
	if (data.resendApiKey && data.resendApiKey.trim().length > 0) payload.resend_api_key = data.resendApiKey.trim();
	const { error } = await context.supabase.from("user_email_settings").upsert(payload, { onConflict: "user_id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var sendEmail_createServerFn_handler = createServerRpc({
	id: "766b2e2d7fad7b029750d0559af7fde845fd4e9c63a33a8ea2ccba8919938648",
	name: "sendEmail",
	filename: "src/lib/email.functions.ts"
}, (opts) => sendEmail.__executeServer(opts));
var sendEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.to || !input.to.includes("@")) throw new Error("Destinatário inválido");
	if (!input.text || input.text.trim().length === 0) throw new Error("Mensagem vazia");
	return {
		to: input.to,
		subject: input.subject || "Mensagem da sua academia",
		text: input.text
	};
}).handler(sendEmail_createServerFn_handler, async ({ data, context }) => {
	const { data: settings, error } = await context.supabase.from("user_email_settings").select("resend_api_key, sender_email").eq("user_id", context.userId).maybeSingle();
	if (error) throw new Error(error.message);
	const apiKey = settings?.resend_api_key;
	if (!apiKey) throw new Error("Configure sua própria API key do Resend em Configurações > Geral.");
	const from = settings?.sender_email || "noreply@seudominio.com";
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			from,
			to: [data.to],
			subject: data.subject,
			text: data.text
		})
	});
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Resend ${res.status}: ${body.slice(0, 200)}`);
	}
	return { ok: true };
});
//#endregion
export { getEmailSettings_createServerFn_handler, saveEmailSettings_createServerFn_handler, sendEmail_createServerFn_handler };
