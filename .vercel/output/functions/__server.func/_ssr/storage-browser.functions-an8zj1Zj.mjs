import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storage-browser.functions-an8zj1Zj.js
var BUCKETS = [
	"announcements",
	"avatars",
	"contracts",
	"exercise-media"
];
var listMyBuckets_createServerFn_handler = createServerRpc({
	id: "6fb8d74dc480abab74ccda9328c70c251eb552aa8b9bd20cc0a7a0b69ebafe07",
	name: "listMyBuckets",
	filename: "src/lib/storage-browser.functions.ts"
}, (opts) => listMyBuckets.__executeServer(opts));
var listMyBuckets = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listMyBuckets_createServerFn_handler, async () => {
	return BUCKETS.map((id) => ({
		id,
		label: labelFor(id)
	}));
});
function labelFor(b) {
	switch (b) {
		case "announcements": return "Avisos e imagens IA";
		case "avatars": return "Fotos de alunos";
		case "contracts": return "Contratos (PDF)";
		case "exercise-media": return "Mídia de exercícios";
	}
}
var listMyBucketFiles_createServerFn_handler = createServerRpc({
	id: "511f2d9af3dba84bed75e9b23d41a89127fc8d0d5bb62e9842402e5077233379",
	name: "listMyBucketFiles",
	filename: "src/lib/storage-browser.functions.ts"
}, (opts) => listMyBucketFiles.__executeServer(opts));
var listMyBucketFiles = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!BUCKETS.includes(input.bucket)) throw new Error("Bucket inválido");
	return input;
}).handler(listMyBucketFiles_createServerFn_handler, async ({ data, context }) => {
	const { userId } = context;
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const basePrefix = data.prefix ? `${userId}/${data.prefix}` : `${userId}`;
	async function walk(prefix, depth) {
		if (depth > 3) return [];
		const { data: rows, error } = await supabaseAdmin.storage.from(data.bucket).list(prefix, {
			limit: 200,
			sortBy: {
				column: "updated_at",
				order: "desc"
			}
		});
		if (error) return [];
		const out = [];
		for (const r of rows ?? []) {
			const isFolder = !r.id;
			const p = `${prefix}/${r.name}`;
			if (isFolder) out.push(...await walk(p, depth + 1));
			else out.push({
				name: r.name,
				path: p,
				size: r.metadata?.size ?? null,
				updated_at: r.updated_at ?? r.created_at ?? null,
				mimetype: r.metadata?.mimetype ?? null
			});
		}
		return out;
	}
	return (await walk(basePrefix, 0)).slice(0, 300);
});
var signMyBucketFile_createServerFn_handler = createServerRpc({
	id: "850492e08fb887dd0ececfd92e4a60d79c3a226d7207b2616946cf9f649f7d58",
	name: "signMyBucketFile",
	filename: "src/lib/storage-browser.functions.ts"
}, (opts) => signMyBucketFile.__executeServer(opts));
var signMyBucketFile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!BUCKETS.includes(input.bucket)) throw new Error("Bucket inválido");
	if (!input.path) throw new Error("path requerido");
	return input;
}).handler(signMyBucketFile_createServerFn_handler, async ({ data, context }) => {
	const { userId } = context;
	if (!data.path.startsWith(`${userId}/`)) throw new Error("Acesso negado");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: signed, error } = await supabaseAdmin.storage.from(data.bucket).createSignedUrl(data.path, 3600);
	if (error) throw new Error(error.message);
	return { url: signed.signedUrl };
});
var deleteMyBucketFile_createServerFn_handler = createServerRpc({
	id: "ca9f287e7e5fafe7521a09ee026d97dd563d9609dfe4c5326073de44bc1ed308",
	name: "deleteMyBucketFile",
	filename: "src/lib/storage-browser.functions.ts"
}, (opts) => deleteMyBucketFile.__executeServer(opts));
var deleteMyBucketFile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!BUCKETS.includes(input.bucket)) throw new Error("Bucket inválido");
	if (!input.path) throw new Error("path requerido");
	return input;
}).handler(deleteMyBucketFile_createServerFn_handler, async ({ data, context }) => {
	const { userId } = context;
	if (!data.path.startsWith(`${userId}/`)) throw new Error("Acesso negado");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { error } = await supabaseAdmin.storage.from(data.bucket).remove([data.path]);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { deleteMyBucketFile_createServerFn_handler, listMyBucketFiles_createServerFn_handler, listMyBuckets_createServerFn_handler, signMyBucketFile_createServerFn_handler };
