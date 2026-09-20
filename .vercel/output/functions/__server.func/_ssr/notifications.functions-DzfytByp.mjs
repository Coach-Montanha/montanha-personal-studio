import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBA-r8Xh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications.functions-DzfytByp.js
var sendInAppNotification = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!Array.isArray(input.studentIds) || input.studentIds.length === 0) throw new Error("Selecione ao menos um aluno");
	if (!input.title?.trim()) throw new Error("Título obrigatório");
	if (!input.body?.trim()) throw new Error("Mensagem obrigatória");
	return {
		...input,
		kind: input.kind ?? "studio"
	};
}).handler(createSsrRpc("9e93baafb6588140e10a1a0903d567fc49fdf28668a4930a8719656a4c811f45"));
//#endregion
export { sendInAppNotification as t };
