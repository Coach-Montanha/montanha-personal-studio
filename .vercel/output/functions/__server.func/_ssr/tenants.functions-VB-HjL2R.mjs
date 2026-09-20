import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBA-r8Xh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenants.functions-VB-HjL2R.js
var MODULES = [
	"studio",
	"pt",
	"financeiro",
	"crm"
];
/**
* Lista todos os treinadores (usuários com papel `admin`) com seus módulos.
* Super admin apenas.
*/
var listTenants = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("30869100389fb2a37f8672706c0b6e63bd34215502c3e6cdde755435f105e546"));
/**
* Cria uma nova conta de treinador (papel `admin`) com senha temporária.
* Super admin apenas.
*/
var createTrainer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.email || !input.email.includes("@")) throw new Error("email inválido");
	if (!Array.isArray(input.modules)) throw new Error("modules inválido");
	for (const m of input.modules) if (!MODULES.includes(m)) throw new Error(`módulo inválido: ${m}`);
	return input;
}).handler(createSsrRpc("5a4ca12ba9460739c2224e7666421b8d9dc201aeb2fa6839bdf9549784260ac9"));
/**
* Ativa/desativa/define validade de um módulo para um treinador.
* Super admin apenas.
*/
var setTenantModule = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.userId) throw new Error("userId requerido");
	if (!MODULES.includes(input.module)) throw new Error(`módulo inválido: ${input.module}`);
	return input;
}).handler(createSsrRpc("e97f0fae46f40180285ace7c6ae8c1dcbf9d847505b09441f7709ebd0c4e7b62"));
/**
* Redefine a senha de um treinador (super admin).
*/
var resetTrainerPassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.userId) throw new Error("userId requerido");
	return input;
}).handler(createSsrRpc("ece919a9a1237ebaf3f21e73d1156f96260b9ef94fd3c234fa43029892c9f5b2"));
/**
* Gera um token para o super_admin "entrar como" um treinador (suporte).
* Retorna um token_hash de magiclink que o cliente consome via verifyOtp,
* substituindo a sessão do super_admin pela do treinador.
*/
var impersonateTrainer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.userId) throw new Error("userId requerido");
	return input;
}).handler(createSsrRpc("f7ea1af03093d10eee37929530d45aa1c8ff01d1f18c3d38d522da154d46efec"));
//#endregion
export { setTenantModule as a, resetTrainerPassword as i, impersonateTrainer as n, listTenants as r, createTrainer as t };
