import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/announcements.functions-CDv98avI.js
var listMyAnnouncements_createServerFn_handler = createServerRpc({
	id: "d099163d82d653e6f0998c0e714c9cfc9e2a34b59d93538ec6d9880720e3c98c",
	name: "listMyAnnouncements",
	filename: "src/lib/announcements.functions.ts"
}, (opts) => listMyAnnouncements.__executeServer(opts));
var listMyAnnouncements = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listMyAnnouncements_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data, error } = await supabase.from("announcements").select("id,title,body,image_url,starts_at,ends_at,active,created_at").eq("user_id", userId).order("starts_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var upsertAnnouncement_createServerFn_handler = createServerRpc({
	id: "5624dd0e3dabff9b9b1b40276bc272e5fb6ab67814954faccd8dc4dd66366d93",
	name: "upsertAnnouncement",
	filename: "src/lib/announcements.functions.ts"
}, (opts) => upsertAnnouncement.__executeServer(opts));
var upsertAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.starts_at || !input.ends_at) throw new Error("Datas obrigatórias");
	if (new Date(input.ends_at) <= new Date(input.starts_at)) throw new Error("Fim deve ser depois do início");
	if (!input.title && !input.body && !input.image_url) throw new Error("Informe texto ou imagem");
	return input;
}).handler(upsertAnnouncement_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const payload = {
		user_id: userId,
		title: data.title ?? null,
		body: data.body ?? null,
		image_url: data.image_url ?? null,
		starts_at: data.starts_at,
		ends_at: data.ends_at,
		active: data.active ?? true
	};
	if (data.id) {
		const { error } = await supabase.from("announcements").update(payload).eq("id", data.id).eq("user_id", userId);
		if (error) throw new Error(error.message);
		return { id: data.id };
	}
	const { data: inserted, error } = await supabase.from("announcements").insert(payload).select("id").single();
	if (error) throw new Error(error.message);
	return { id: inserted.id };
});
var deleteAnnouncement_createServerFn_handler = createServerRpc({
	id: "c11c97af8521520dd3e62a61ff3858e63857b34966188ffb256b53d39e8b55af",
	name: "deleteAnnouncement",
	filename: "src/lib/announcements.functions.ts"
}, (opts) => deleteAnnouncement.__executeServer(opts));
var deleteAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.id) throw new Error("id requerido");
	return input;
}).handler(deleteAnnouncement_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { error } = await supabase.from("announcements").delete().eq("id", data.id).eq("user_id", userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var getSignedAnnouncementImageUrl_createServerFn_handler = createServerRpc({
	id: "c14f436a99a93fe2343be344c24c5ffec2b188ff89564ca65c1afe603837022b",
	name: "getSignedAnnouncementImageUrl",
	filename: "src/lib/announcements.functions.ts"
}, (opts) => getSignedAnnouncementImageUrl.__executeServer(opts));
var getSignedAnnouncementImageUrl = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.path) throw new Error("path requerido");
	const p = input.path.trim();
	if (p.startsWith("/") || p.includes("..") || p.includes("//") || !p.includes("/")) throw new Error("path inválido");
	return { path: p };
}).handler(getSignedAnnouncementImageUrl_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const ownerSegment = data.path.split("/")[0];
	let authorized = ownerSegment === userId;
	if (!authorized) {
		const [{ data: st }, { data: ptSt }] = await Promise.all([supabase.from("students").select("user_id").eq("account_user_id", userId), supabase.from("pt_students").select("user_id").eq("account_user_id", userId)]);
		const owners = /* @__PURE__ */ new Set();
		for (const s of st ?? []) if (s.user_id) owners.add(s.user_id);
		for (const s of ptSt ?? []) if (s.user_id) owners.add(s.user_id);
		authorized = owners.has(ownerSegment);
	}
	if (!authorized) throw new Error("Acesso negado");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: signed, error } = await supabaseAdmin.storage.from("announcements").createSignedUrl(data.path, 3600);
	if (error) throw new Error(error.message);
	return { url: signed.signedUrl };
});
var getActiveAnnouncementsForPortal_createServerFn_handler = createServerRpc({
	id: "cae4a38af1693a26c4c6abe9cd25a5f0e86d9946fd0d32151e419bbffa71d354",
	name: "getActiveAnnouncementsForPortal",
	filename: "src/lib/announcements.functions.ts"
}, (opts) => getActiveAnnouncementsForPortal.__executeServer(opts));
var getActiveAnnouncementsForPortal = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getActiveAnnouncementsForPortal_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: st } = await supabase.from("students").select("user_id").eq("account_user_id", userId);
	const ownerIds = Array.from(new Set((st ?? []).map((s) => s.user_id).filter(Boolean)));
	const { data: ptSt } = await supabase.from("pt_students").select("user_id").eq("account_user_id", userId);
	for (const s of ptSt ?? []) if (s.user_id && !ownerIds.includes(s.user_id)) ownerIds.push(s.user_id);
	if (ownerIds.length === 0) return [];
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const { data, error } = await supabase.from("announcements").select("id,title,body,image_url,starts_at,ends_at,active,created_at").in("user_id", ownerIds).eq("active", true).lte("starts_at", nowIso).gte("ends_at", nowIso).order("starts_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
//#endregion
export { deleteAnnouncement_createServerFn_handler, getActiveAnnouncementsForPortal_createServerFn_handler, getSignedAnnouncementImageUrl_createServerFn_handler, listMyAnnouncements_createServerFn_handler, upsertAnnouncement_createServerFn_handler };
