import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
import { t as __require } from "./chunk-BdkLduGY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenants.functions-BTIQM4T0.js
var MODULES = [
	"studio",
	"pt",
	"financeiro",
	"crm"
];
async function assertSuperAdmin(context) {
	const { data, error } = await context.supabase.rpc("is_super_admin", { _user_id: context.userId });
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Somente super admin");
}
/**
* Lista todos os treinadores (usuários com papel `admin`) com seus módulos.
* Super admin apenas.
*/
var listTenants_createServerFn_handler = createServerRpc({
	id: "30869100389fb2a37f8672706c0b6e63bd34215502c3e6cdde755435f105e546",
	name: "listTenants",
	filename: "src/lib/tenants.functions.ts"
}, (opts) => listTenants.__executeServer(opts));
var listTenants = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listTenants_createServerFn_handler, async ({ context }) => {
	await assertSuperAdmin(context);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: roles, error: rErr } = await supabaseAdmin.from("user_roles").select("user_id, role");
	if (rErr) throw new Error(rErr.message);
	const adminIds = Array.from(new Set((roles ?? []).filter((r) => r.role === "admin" || r.role === "super_admin").map((r) => r.user_id)));
	if (adminIds.length === 0) return [];
	const { data: usersList, error: uErr } = await supabaseAdmin.auth.admin.listUsers({
		page: 1,
		perPage: 1e3
	});
	if (uErr) throw new Error(uErr.message);
	const { data: mods, error: mErr } = await supabaseAdmin.from("user_modules").select("user_id, module, active, expires_at").in("user_id", adminIds);
	if (mErr) throw new Error(mErr.message);
	const rolesByUser = /* @__PURE__ */ new Map();
	for (const r of roles ?? []) {
		const arr = rolesByUser.get(r.user_id) ?? [];
		arr.push(r.role);
		rolesByUser.set(r.user_id, arr);
	}
	const modsByUser = /* @__PURE__ */ new Map();
	for (const m of mods ?? []) {
		const arr = modsByUser.get(m.user_id) ?? [];
		arr.push({
			module: m.module,
			active: m.active,
			expires_at: m.expires_at ?? null
		});
		modsByUser.set(m.user_id, arr);
	}
	return adminIds.map((id) => {
		const u = usersList.users.find((x) => x.id === id);
		return {
			userId: id,
			email: u?.email ?? "(sem email)",
			createdAt: u?.created_at ?? null,
			roles: rolesByUser.get(id) ?? [],
			modules: modsByUser.get(id) ?? []
		};
	});
});
var createTrainer_createServerFn_handler = createServerRpc({
	id: "5a4ca12ba9460739c2224e7666421b8d9dc201aeb2fa6839bdf9549784260ac9",
	name: "createTrainer",
	filename: "src/lib/tenants.functions.ts"
}, (opts) => createTrainer.__executeServer(opts));
var createTrainer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.email || !input.email.includes("@")) throw new Error("email inválido");
	if (!Array.isArray(input.modules)) throw new Error("modules inválido");
	for (const m of input.modules) if (!MODULES.includes(m)) throw new Error(`módulo inválido: ${m}`);
	return input;
}).handler(createTrainer_createServerFn_handler, async ({ data, context }) => {
	await assertSuperAdmin(context);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { randomInt } = __require("crypto");
	const gen = () => {
		while (true) {
			let s = "";
			for (let i = 0; i < 10; i++) s += randomInt(0, 10).toString();
			if (/^(\d)\1+$/.test(s)) continue;
			return s;
		}
	};
	const isWeak = (msg) => /weak|pwned|known|easy to guess/i.test(msg);
	let tempPassword = gen();
	let created = null;
	let lastErr = null;
	for (let attempt = 0; attempt < 5; attempt++) {
		const res = await supabaseAdmin.auth.admin.createUser({
			email: data.email,
			password: tempPassword,
			email_confirm: true
		});
		if (!res.error && res.data.user) {
			created = res.data;
			lastErr = null;
			break;
		}
		lastErr = res.error?.message || "Falha ao criar usuário";
		if (!res.error || !isWeak(res.error.message)) throw new Error(lastErr);
		tempPassword = gen();
	}
	if (!created) throw new Error(lastErr || "Falha ao criar usuário");
	const newUserId = created.user.id;
	const { error: rErr } = await supabaseAdmin.from("user_roles").insert({
		user_id: newUserId,
		role: "admin"
	});
	if (rErr) {
		await supabaseAdmin.auth.admin.deleteUser(newUserId);
		throw new Error(rErr.message);
	}
	if (data.modules.length > 0) {
		const rows = data.modules.map((m) => ({
			user_id: newUserId,
			module: m,
			active: true
		}));
		const { error: mErr } = await supabaseAdmin.from("user_modules").insert(rows);
		if (mErr) {
			await supabaseAdmin.auth.admin.deleteUser(newUserId);
			throw new Error(mErr.message);
		}
	}
	return {
		userId: newUserId,
		email: data.email,
		tempPassword
	};
});
var setTenantModule_createServerFn_handler = createServerRpc({
	id: "e97f0fae46f40180285ace7c6ae8c1dcbf9d847505b09441f7709ebd0c4e7b62",
	name: "setTenantModule",
	filename: "src/lib/tenants.functions.ts"
}, (opts) => setTenantModule.__executeServer(opts));
var setTenantModule = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.userId) throw new Error("userId requerido");
	if (!MODULES.includes(input.module)) throw new Error(`módulo inválido: ${input.module}`);
	return input;
}).handler(setTenantModule_createServerFn_handler, async ({ data, context }) => {
	await assertSuperAdmin(context);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { error } = await supabaseAdmin.from("user_modules").upsert({
		user_id: data.userId,
		module: data.module,
		active: data.active,
		expires_at: data.expiresAt
	}, { onConflict: "user_id,module" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var resetTrainerPassword_createServerFn_handler = createServerRpc({
	id: "ece919a9a1237ebaf3f21e73d1156f96260b9ef94fd3c234fa43029892c9f5b2",
	name: "resetTrainerPassword",
	filename: "src/lib/tenants.functions.ts"
}, (opts) => resetTrainerPassword.__executeServer(opts));
var resetTrainerPassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.userId) throw new Error("userId requerido");
	return input;
}).handler(resetTrainerPassword_createServerFn_handler, async ({ data, context }) => {
	await assertSuperAdmin(context);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { randomInt } = __require("crypto");
	const gen = () => {
		let s = "";
		for (let i = 0; i < 10; i++) s += randomInt(0, 10).toString();
		return s;
	};
	const tempPassword = gen();
	const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, { password: tempPassword });
	if (error) throw new Error(error.message);
	return { tempPassword };
});
var impersonateTrainer_createServerFn_handler = createServerRpc({
	id: "f7ea1af03093d10eee37929530d45aa1c8ff01d1f18c3d38d522da154d46efec",
	name: "impersonateTrainer",
	filename: "src/lib/tenants.functions.ts"
}, (opts) => impersonateTrainer.__executeServer(opts));
var impersonateTrainer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.userId) throw new Error("userId requerido");
	return input;
}).handler(impersonateTrainer_createServerFn_handler, async ({ data, context }) => {
	await assertSuperAdmin(context);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: userRes, error: uErr } = await supabaseAdmin.auth.admin.getUserById(data.userId);
	if (uErr || !userRes?.user?.email) throw new Error(uErr?.message ?? "Usuário sem e-mail");
	const targetEmail = userRes.user.email;
	const { data: linkRes, error: lErr } = await supabaseAdmin.auth.admin.generateLink({
		type: "magiclink",
		email: targetEmail
	});
	if (lErr) throw new Error(lErr.message);
	const tokenHash = (linkRes?.properties)?.hashed_token;
	if (!tokenHash) throw new Error("Falha ao gerar token");
	return {
		tokenHash,
		targetEmail
	};
});
//#endregion
export { createTrainer_createServerFn_handler, impersonateTrainer_createServerFn_handler, listTenants_createServerFn_handler, resetTrainerPassword_createServerFn_handler, setTenantModule_createServerFn_handler };
