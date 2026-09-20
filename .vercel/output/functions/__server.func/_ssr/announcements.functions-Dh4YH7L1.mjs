import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBA-r8Xh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/announcements.functions-Dh4YH7L1.js
var listMyAnnouncements = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d099163d82d653e6f0998c0e714c9cfc9e2a34b59d93538ec6d9880720e3c98c"));
var upsertAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.starts_at || !input.ends_at) throw new Error("Datas obrigatórias");
	if (new Date(input.ends_at) <= new Date(input.starts_at)) throw new Error("Fim deve ser depois do início");
	if (!input.title && !input.body && !input.image_url) throw new Error("Informe texto ou imagem");
	return input;
}).handler(createSsrRpc("5624dd0e3dabff9b9b1b40276bc272e5fb6ab67814954faccd8dc4dd66366d93"));
var deleteAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.id) throw new Error("id requerido");
	return input;
}).handler(createSsrRpc("c11c97af8521520dd3e62a61ff3858e63857b34966188ffb256b53d39e8b55af"));
var getSignedAnnouncementImageUrl = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.path) throw new Error("path requerido");
	const p = input.path.trim();
	if (p.startsWith("/") || p.includes("..") || p.includes("//") || !p.includes("/")) throw new Error("path inválido");
	return { path: p };
}).handler(createSsrRpc("c14f436a99a93fe2343be344c24c5ffec2b188ff89564ca65c1afe603837022b"));
/**
* Portal: retorna avisos ativos (na janela) do studio do aluno logado.
* Descobre o dono do studio via students.user_id.
*/
var getActiveAnnouncementsForPortal = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("cae4a38af1693a26c4c6abe9cd25a5f0e86d9946fd0d32151e419bbffa71d354"));
//#endregion
export { upsertAnnouncement as a, listMyAnnouncements as i, getActiveAnnouncementsForPortal as n, getSignedAnnouncementImageUrl as r, deleteAnnouncement as t };
