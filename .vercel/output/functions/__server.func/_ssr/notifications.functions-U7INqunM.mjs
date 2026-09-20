import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications.functions-U7INqunM.js
var sendInAppNotification_createServerFn_handler = createServerRpc({
	id: "9e93baafb6588140e10a1a0903d567fc49fdf28668a4930a8719656a4c811f45",
	name: "sendInAppNotification",
	filename: "src/lib/notifications.functions.ts"
}, (opts) => sendInAppNotification.__executeServer(opts));
var sendInAppNotification = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!Array.isArray(input.studentIds) || input.studentIds.length === 0) throw new Error("Selecione ao menos um aluno");
	if (!input.title?.trim()) throw new Error("Título obrigatório");
	if (!input.body?.trim()) throw new Error("Mensagem obrigatória");
	return {
		...input,
		kind: input.kind ?? "studio"
	};
}).handler(sendInAppNotification_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const table = data.kind === "pt" ? "pt_students" : "students";
	const { data: students, error } = await supabase.from(table).select("id, name, account_user_id").in("id", data.studentIds).eq("user_id", userId);
	if (error) throw new Error(error.message);
	const withAccount = (students ?? []).filter((s) => s.account_user_id);
	const withoutAccount = (students ?? []).filter((s) => !s.account_user_id);
	if (withAccount.length === 0) return {
		sent: 0,
		skipped: withoutAccount.map((s) => s.name)
	};
	const rows = withAccount.map((s) => ({
		recipient_user_id: s.account_user_id,
		sender_user_id: userId,
		title: data.title.trim(),
		body: data.body.trim()
	}));
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { error: iErr } = await supabaseAdmin.from("notifications").insert(rows);
	if (iErr) throw new Error(iErr.message);
	return {
		sent: withAccount.length,
		skipped: withoutAccount.map((s) => s.name)
	};
});
//#endregion
export { sendInAppNotification_createServerFn_handler };
