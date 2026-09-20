import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBA-r8Xh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/email.functions-fisjNvMQ.js
var getEmailSettings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a454e7504a2752c5da71122d3abba29580e56694ff6b2938bc2452d5893f0417"));
var saveEmailSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => ({
	resendApiKey: input.resendApiKey ?? null,
	senderEmail: input.senderEmail ?? null
})).handler(createSsrRpc("78d963cc7bb1dc9031f2dc8b84cd3c53007c546d94fd73554ab3ba3f99ba3e1b"));
var sendEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.to || !input.to.includes("@")) throw new Error("Destinatário inválido");
	if (!input.text || input.text.trim().length === 0) throw new Error("Mensagem vazia");
	return {
		to: input.to,
		subject: input.subject || "Mensagem da sua academia",
		text: input.text
	};
}).handler(createSsrRpc("766b2e2d7fad7b029750d0559af7fde845fd4e9c63a33a8ea2ccba8919938648"));
//#endregion
export { saveEmailSettings as n, sendEmail as r, getEmailSettings as t };
