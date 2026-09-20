import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
import { createHash } from "crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-image.functions-Cr4Omsfb.js
function hashKey(model, aspect, prompt) {
	return createHash("sha256").update(`${model}|${aspect}|${prompt.trim().toLowerCase()}`).digest("hex");
}
function extForAspect(_aspect) {
	return "png";
}
var generateAnnouncementImage_createServerFn_handler = createServerRpc({
	id: "b0d0bbe2cec338019752de92fcf08f0b5a076881dd74f9cf6d5fe26bd924f20a",
	name: "generateAnnouncementImage",
	filename: "src/lib/ai-image.functions.ts"
}, (opts) => generateAnnouncementImage.__executeServer(opts));
var generateAnnouncementImage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	const p = (input.prompt ?? "").trim();
	if (p.length < 3) throw new Error("Descreva a imagem (mínimo 3 caracteres)");
	if (p.length > 2e3) throw new Error("Prompt muito longo (máx 2000 caracteres)");
	return {
		prompt: p,
		aspect: input.aspect || "1:1",
		model: input.model === "google/gemini-3-pro-image" ? "google/gemini-3-pro-image" : "google/gemini-3.1-flash-image"
	};
}).handler(generateAnnouncementImage_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const key = hashKey(data.model, data.aspect, data.prompt);
	const { data: hit } = await supabase.from("ai_image_cache").select("id,prompt,model,aspect,image_path,created_at").eq("user_id", userId).eq("prompt_hash", key).maybeSingle();
	if (hit) return {
		path: hit.image_path,
		cached: true
	};
	const apiKey = process.env.LOVABLE_API_KEY;
	if (!apiKey) throw new Error("LOVABLE_API_KEY ausente");
	const aspectHint = data.aspect === "custom" ? "" : `Formato/proporção da imagem: ${data.aspect.replace("custom:", "")}. Componha o enquadramento respeitando essa proporção.`;
	const userPrompt = `${data.prompt}\n\n${aspectHint}\nEstilo limpo, alta qualidade, adequado para um aviso publicado em app fitness/estúdio.`;
	const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: data.model,
			messages: [{
				role: "user",
				content: userPrompt
			}],
			modalities: ["image", "text"]
		})
	});
	if (res.status === 429) throw new Error("Limite de uso da IA atingido. Tente novamente em alguns instantes.");
	if (res.status === 402) throw new Error("Créditos da IA esgotados. Adicione créditos no workspace.");
	if (!res.ok) {
		const t = await res.text().catch(() => "");
		throw new Error(`Falha na geração de imagem (${res.status}): ${t.slice(0, 200)}`);
	}
	const b64 = (await res.json())?.data?.[0]?.b64_json;
	if (!b64) throw new Error("A IA não retornou uma imagem.");
	const buffer = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
	const path = `${userId}/ai/${key}.${extForAspect(data.aspect)}`;
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { error: upErr } = await supabaseAdmin.storage.from("announcements").upload(path, buffer, {
		contentType: "image/png",
		upsert: true
	});
	if (upErr) throw new Error(upErr.message);
	const { error: cErr } = await supabase.from("ai_image_cache").insert({
		user_id: userId,
		prompt_hash: key,
		prompt: data.prompt,
		model: data.model,
		aspect: data.aspect,
		image_path: path
	});
	if (cErr && !/duplicate key/i.test(cErr.message)) throw new Error(cErr.message);
	return {
		path,
		cached: false
	};
});
var listAiImageCache_createServerFn_handler = createServerRpc({
	id: "4cd9bf32634c5cadc86b54880fa62d4ef7ff8591a323cbb2ce727b5ce368484a",
	name: "listAiImageCache",
	filename: "src/lib/ai-image.functions.ts"
}, (opts) => listAiImageCache.__executeServer(opts));
var listAiImageCache = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listAiImageCache_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data, error } = await supabase.from("ai_image_cache").select("id,prompt,model,aspect,image_path,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(60);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var deleteAiImageCache_createServerFn_handler = createServerRpc({
	id: "487a9032bf60a761d595708189927225f796d86d647c1398ccd3496f56b3aa91",
	name: "deleteAiImageCache",
	filename: "src/lib/ai-image.functions.ts"
}, (opts) => deleteAiImageCache.__executeServer(opts));
var deleteAiImageCache = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.id) throw new Error("id requerido");
	return input;
}).handler(deleteAiImageCache_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: row } = await supabase.from("ai_image_cache").select("image_path").eq("id", data.id).eq("user_id", userId).maybeSingle();
	const { error } = await supabase.from("ai_image_cache").delete().eq("id", data.id).eq("user_id", userId);
	if (error) throw new Error(error.message);
	if (row) {
		const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
		await supabaseAdmin.storage.from("announcements").remove([row.image_path]);
	}
	return { ok: true };
});
//#endregion
export { deleteAiImageCache_createServerFn_handler, generateAnnouncementImage_createServerFn_handler, listAiImageCache_createServerFn_handler };
