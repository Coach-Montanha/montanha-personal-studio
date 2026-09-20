import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBA-r8Xh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/classes.functions-CBapcCd4.js
var generateClassSessions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.classId) throw new Error("classId requerido");
	return {
		classId: input.classId,
		weeks: input.weeks ?? 12
	};
}).handler(createSsrRpc("e92d90087c3116ac58b381f139ea5893c9f9a2c012de2712ffb73e7576dc4db3"));
var getAgenda = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.from || !input.to) throw new Error("Período obrigatório");
	return input;
}).handler(createSsrRpc("d2d857e5143d3a31dc9f33662ac3f404eb527afcdc57ee68dccbee462168b309"));
var getMyQuotaUsage = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c5077056d422784642ce3ec66b8832ce227a556c4fca4b2d19b3b0c29c8673f2"));
var getMyAttendanceStats = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a085a7aa6d4f3c8f637ebdd79bf8af31ea1d73874ca62341a4bb0657f26edfc2"));
var getSessionAttendees = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(createSsrRpc("7a51f3fd3101019af8629441c5efbe1aa2268589cec2fe0658e1546fcc6dd11f"));
var studentCheckIn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(createSsrRpc("3b7a9f753c12b45ec023781bd89462948b6222b94abd6a0fbbbddf024f50888a"));
var studentCancelCheckIn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(createSsrRpc("597bb54d7a9fe392e892734bee821e0a8b06010626d0b2176d1b176e16ca68e7"));
/** Exclui apenas UMA sessão (não afeta as demais nem a turma-mãe). */
var deleteClassSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(createSsrRpc("389a749687d0938fc7478ec7960401424849188d5570ab6c386a787e0969f2b9"));
/** Exclui esta sessão e todas as futuras (mesma turma) a partir dela. */
var deleteClassSessionsFrom = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(createSsrRpc("43d0d2c433c17cc2513eac698285c44a4320d82f9b82c186d64023084e5b38da"));
/** Exclui a turma inteira (e, por cascade, todas as sessões e check-ins). */
var deleteClassAll = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.classId) throw new Error("classId requerido");
	return input;
}).handler(createSsrRpc("57bc17bb00e7c66a5f30906ee4581e0d07ab0f72521f9cde54d091484f6961ba"));
/** Atualiza os campos editáveis de UMA sessão (override individual). */
var updateClassSessionOverrides = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(createSsrRpc("f86db12054e839da9288d644cc5417eb82a4fd5277409a051647f4c3f3a07eca"));
/** Aplica overrides à sessão atual e a todas as futuras da mesma turma. */
var updateClassSessionsFromOverrides = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(createSsrRpc("1248295afb094cd2258bfcd8b2a7eba47ebc8f89c1999d038ea9f939468976b4"));
//#endregion
export { getAgenda as a, getSessionAttendees as c, updateClassSessionOverrides as d, updateClassSessionsFromOverrides as f, generateClassSessions as i, studentCancelCheckIn as l, deleteClassSession as n, getMyAttendanceStats as o, deleteClassSessionsFrom as r, getMyQuotaUsage as s, deleteClassAll as t, studentCheckIn as u };
