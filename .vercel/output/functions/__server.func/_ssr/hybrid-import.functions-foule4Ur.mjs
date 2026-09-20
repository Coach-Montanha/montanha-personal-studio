import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
import { d as number, f as object, l as array, m as union, p as string, u as boolean } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hybrid-import.functions-foule4Ur.js
/**
* Integração com o projeto "Sistema Híbrido de Treinamento".
* 
* Este arquivo foi atualizado para usar uma chave de API direta caso os 
* segredos de ambiente não estejam disponíveis no Lovable Cloud.
*/
var ExerciseSchema = object({
	name: string().min(1),
	sets: union([number(), string()]).nullish(),
	reps: union([number(), string()]).nullish(),
	load_kg: union([number(), string()]).nullish(),
	load: string().nullish(),
	rest_seconds: union([number(), string()]).nullish(),
	rest_sec: union([number(), string()]).nullish(),
	observations: string().nullish(),
	notes: string().nullish()
}).transform((e) => ({
	...e,
	rest_seconds: e.rest_seconds ?? e.rest_sec ?? null,
	observations: e.observations ?? e.notes ?? null
}));
var BlockSchema = object({
	format: string().nullish(),
	title: string().nullish(),
	exercises: array(ExerciseSchema).default([])
});
var SessionSchema = object({
	title: string().nullish(),
	day_number: number().nullish(),
	date: string().nullish(),
	blocks: array(BlockSchema).default([])
});
var WeekSchema = object({
	number: number().nullish(),
	week_number: number().nullish(),
	sessions: array(SessionSchema).default([])
}).transform((w) => ({
	...w,
	number: w.number ?? w.week_number ?? null
}));
var HybridProgramSchema = object({
	id: string().nullish(),
	title: string().min(1),
	methodology: string().nullish(),
	start_date: string().nullish(),
	weeks: array(WeekSchema).nullish(),
	sessions: array(SessionSchema).nullish()
});
function originConfig() {
	const url = (process.env.HYBRID_API_URL || "https://sistemahibridodetreinamento.lovable.app").replace(/\/+$/, "");
	const token = process.env.HYBRID_API_TOKEN || "chm_sk_64f944daa5b3154fbe821e56e1d16e7ccb0afd6a7c753432451022b948974fe1";
	return {
		url,
		token,
		configured: Boolean(url && token)
	};
}
async function originFetch(path) {
	const { url, token } = originConfig();
	const res = await fetch(`${url}${path}`, { headers: {
		"x-api-key": token ?? "",
		Authorization: `Bearer ${token}`,
		Accept: "application/json"
	} });
	if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? "Token de integração recusado pela origem." : res.status === 404 ? "Endpoint não encontrado na origem (a API pública ainda não foi criada lá)." : `Origem respondeu ${res.status}.`);
	return res.json();
}
/** Diz à UI se a conexão com a origem está configurada. */
var getHybridStatus_createServerFn_handler = createServerRpc({
	id: "0836dd3f15d95e7e3146481d600e3035f29b84bb2be9750a8b2f30f52beeba0e",
	name: "getHybridStatus",
	filename: "src/lib/hybrid-import.functions.ts"
}, (opts) => getHybridStatus.__executeServer(opts));
var getHybridStatus = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getHybridStatus_createServerFn_handler, async () => {
	const { url, configured } = originConfig();
	return {
		configured,
		url: url ?? null
	};
});
var listHybridPrograms_createServerFn_handler = createServerRpc({
	id: "3e7fc5ac816f48dae8ec89ad1ac32d4c5c52ed09f02493f50c24d17a8fea8987",
	name: "listHybridPrograms",
	filename: "src/lib/hybrid-import.functions.ts"
}, (opts) => listHybridPrograms.__executeServer(opts));
var listHybridPrograms = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listHybridPrograms_createServerFn_handler, async () => {
	if (!originConfig().configured) return {
		ok: false,
		error: "not_configured",
		programs: []
	};
	try {
		const json = await originFetch("/api/public/programs");
		return {
			ok: true,
			programs: (Array.isArray(json) ? json : json?.data ?? json?.programs ?? []).map((p) => ({
				id: String(p.id),
				title: p.title ?? p.titulo ?? "Programa sem título",
				methodology: p.methodology ?? p.metodologia ?? null,
				start_date: p.start_date ?? p.data_inicio ?? null,
				weeks_count: p.weeks_count ?? p.duracao_semanas ?? null,
				sessions_count: p.sessions_count ?? null
			}))
		};
	} catch (e) {
		return {
			ok: false,
			error: e?.message ?? "Falha ao consultar a origem",
			programs: []
		};
	}
});
var fetchHybridProgram_createServerFn_handler = createServerRpc({
	id: "d41fe1bc85669a6ff6681f18e5bb253f5b38b0ea92c3f57d491da7358f96125a",
	name: "fetchHybridProgram",
	filename: "src/lib/hybrid-import.functions.ts"
}, (opts) => fetchHybridProgram.__executeServer(opts));
var fetchHybridProgram = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({ id: string().min(1) }).parse(raw)).handler(fetchHybridProgram_createServerFn_handler, async ({ data }) => {
	if (!originConfig().configured) throw new Error("Integração não configurada");
	const json = await originFetch(`/api/public/programs/${encodeURIComponent(data.id)}`);
	const payload = json?.data ?? json?.program ?? json;
	return HybridProgramSchema.parse(payload);
});
function str(v) {
	if (v === null || v === void 0 || v === "") return null;
	return String(v);
}
function flattenHybridProgram(program) {
	const days = [];
	(program.weeks?.length ? program.weeks : [{
		number: 1,
		sessions: program.sessions ?? []
	}]).forEach((week, wi) => {
		const weekNumber = week.number ?? wi + 1;
		week.sessions.forEach((session, si) => {
			const dayNumber = session.day_number ?? si + 1;
			const exercises = [];
			session.blocks.forEach((block) => {
				block.exercises.forEach((ex) => {
					const sets = str(ex.sets);
					const reps = str(ex.reps);
					const setsReps = sets && reps ? `${sets}x${reps}` : reps ?? sets;
					const blockTag = block.title ?? block.format ?? null;
					const obs = [blockTag ? `[${blockTag}]` : null, str(ex.observations)].filter(Boolean).join(" ");
					exercises.push({
						name: ex.name,
						sets_reps: setsReps,
						load: ex.load ?? (ex.load_kg != null ? `${ex.load_kg} kg` : null),
						rest_seconds: str(ex.rest_seconds),
						observations: obs || null
					});
				});
			});
			days.push({
				name: session.title ?? `Semana ${weekNumber} · Dia ${dayNumber}`,
				day_label: `S${weekNumber}D${dayNumber}`,
				description: session.date ?? null,
				exercises
			});
		});
	});
	return days;
}
var ImportInput = object({
	ptStudentId: string().uuid(),
	programId: string().min(1).optional(),
	program: HybridProgramSchema.optional(),
	showToStudent: boolean().default(true)
});
var importHybridProgram_createServerFn_handler = createServerRpc({
	id: "67449c0507bf8bcc655c012924e7b24c64b183ba1d70669738c9474a163ca2c0",
	name: "importHybridProgram",
	filename: "src/lib/hybrid-import.functions.ts"
}, (opts) => importHybridProgram.__executeServer(opts));
var importHybridProgram = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => {
	const parsed = ImportInput.parse(raw);
	if (!parsed.programId && !parsed.program) throw new Error("Informe um programa da origem ou cole o JSON");
	return parsed;
}).handler(importHybridProgram_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: student, error: stErr } = await supabase.from("pt_students").select("id,user_id,name").eq("id", data.ptStudentId).maybeSingle();
	if (stErr) throw new Error(stErr.message);
	if (!student) throw new Error("Aluno PT não encontrado");
	if (student.user_id !== userId) throw new Error("Sem permissão para este aluno");
	const program = data.program ? HybridProgramSchema.parse(data.program) : HybridProgramSchema.parse(await originFetch(`/api/public/programs/${encodeURIComponent(data.programId)}`));
	const days = flattenHybridProgram(program);
	if (days.length === 0) throw new Error("O programa não contém sessões de treino");
	const startDate = program.start_date && /^\d{4}-\d{2}-\d{2}$/.test(program.start_date) ? program.start_date : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const { data: created, error: cErr } = await supabase.from("pt_programs").insert({
		user_id: userId,
		pt_student_id: data.ptStudentId,
		name: program.title,
		start_date: startDate,
		goals: program.methodology ? `Importado do Sistema Híbrido · ${program.methodology}` : null,
		show_to_student: data.showToStudent
	}).select("id").single();
	if (cErr) throw new Error(`Falha ao criar programa: ${cErr.message}`);
	const newProgramId = created.id;
	try {
		for (const [i, day] of days.entries()) {
			const { data: newDay, error: dErr } = await supabase.from("pt_training_days").insert({
				user_id: userId,
				program_id: newProgramId,
				name: day.name,
				day_label: day.day_label,
				description: day.description,
				sort_order: i
			}).select("id").single();
			if (dErr) throw new Error(dErr.message);
			const dayId = newDay.id;
			if (day.exercises.length > 0) {
				const rows = day.exercises.map((ex, j) => ({
					user_id: userId,
					training_day_id: dayId,
					name: ex.name,
					sets_reps: ex.sets_reps,
					load: ex.load,
					rest_seconds: ex.rest_seconds,
					observations: ex.observations,
					sort_order: j
				}));
				const { error: exErr } = await supabase.from("pt_training_exercises").insert(rows);
				if (exErr) throw new Error(exErr.message);
			}
		}
	} catch (e) {
		await supabase.from("pt_programs").delete().eq("id", newProgramId);
		throw e;
	}
	return {
		programId: newProgramId,
		studentName: student.name,
		days: days.length,
		exercises: days.reduce((s, d) => s + d.exercises.length, 0)
	};
});
function normalizeExercise(raw) {
	const name = String(raw?.name ?? raw?.nome ?? "").trim();
	if (!name) return null;
	const media = raw?.media ?? {};
	const video = media?.video ?? raw?.video_url ?? null;
	const gif = media?.gif ?? raw?.gif_url ?? null;
	const image = media?.image ?? raw?.image_url ?? raw?.thumbnail_url ?? null;
	const url = video ?? gif ?? image ?? null;
	const equip = Array.isArray(raw?.equipment) ? raw.equipment.filter(Boolean) : [];
	const methods = Array.isArray(raw?.methodologies) ? raw.methodologies.filter(Boolean) : [];
	const parts = [
		raw?.description ? String(raw.description) : null,
		raw?.instructions ? String(raw.instructions) : null,
		raw?.name_en ? `Nome (EN): ${raw.name_en}` : null,
		equip.length ? `Equipamento: ${equip.join(", ")}` : null,
		methods.length ? `Metodologias: ${methods.join(", ")}` : null
	].filter(Boolean);
	return {
		id: String(raw?.id ?? name),
		name,
		description: parts.length ? parts.join("\n") : null,
		muscle_group: raw?.muscle_group ?? (equip.length ? String(equip[0]) : null),
		media_url: url ? String(url) : null,
		media_type: url ? video ? "video" : "image" : null,
		thumbnail_url: image ? String(image) : gif ? String(gif) : null
	};
}
/** Lista os exercícios do banco da origem. */
var listHybridExercises_createServerFn_handler = createServerRpc({
	id: "1aaa84a0734b91652cf7f6b45308860082da650e866d7835997082d1cf68954f",
	name: "listHybridExercises",
	filename: "src/lib/hybrid-import.functions.ts"
}, (opts) => listHybridExercises.__executeServer(opts));
var listHybridExercises = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listHybridExercises_createServerFn_handler, async () => {
	if (!originConfig().configured) return {
		ok: false,
		error: "not_configured",
		exercises: []
	};
	try {
		const json = await originFetch("/api/public/exercises");
		return {
			ok: true,
			exercises: (Array.isArray(json) ? json : json?.data ?? json?.exercises ?? []).map(normalizeExercise).filter(Boolean)
		};
	} catch (e) {
		return {
			ok: false,
			error: e?.message ?? "Falha ao consultar a origem",
			exercises: []
		};
	}
});
var importHybridExercises_createServerFn_handler = createServerRpc({
	id: "6625c9cd04422f9c91ce4ef2ffa8030430e467725fa932171ab4a82be1a925d2",
	name: "importHybridExercises",
	filename: "src/lib/hybrid-import.functions.ts"
}, (opts) => importHybridExercises.__executeServer(opts));
var importHybridExercises = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({ ids: array(string()).optional() }).parse(raw ?? {})).handler(importHybridExercises_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const json = await originFetch("/api/public/exercises");
	let list = (Array.isArray(json) ? json : json?.data ?? json?.exercises ?? []).map(normalizeExercise).filter(Boolean);
	if (data.ids?.length) {
		const set = new Set(data.ids);
		list = list.filter((e) => set.has(e.id));
	}
	if (list.length === 0) return {
		imported: 0,
		skipped: 0,
		total: 0
	};
	const { data: existing, error: exErr } = await supabase.from("pt_exercises_library").select("id,name,description,media_url,media_type,thumbnail_url,muscle_group").eq("user_id", userId);
	if (exErr) throw new Error(exErr.message);
	const byName = new Map((existing ?? []).map((r) => [String(r.name).trim().toLowerCase(), r]));
	const rows = [];
	let updated = 0;
	for (const e of list) {
		const key = e.name.trim().toLowerCase();
		const cur = byName.get(key);
		if (!cur) {
			rows.push({
				user_id: userId,
				name: e.name,
				muscle_group: e.muscle_group,
				description: e.description,
				media_url: e.media_url,
				media_type: e.media_type,
				thumbnail_url: e.thumbnail_url,
				is_global: false
			});
			continue;
		}
		const patch = {};
		if (!cur.description && e.description) patch.description = e.description;
		if (!cur.muscle_group && e.muscle_group) patch.muscle_group = e.muscle_group;
		if (!cur.media_url && e.media_url) {
			patch.media_url = e.media_url;
			patch.media_type = e.media_type;
		}
		if (!cur.thumbnail_url && e.thumbnail_url) patch.thumbnail_url = e.thumbnail_url;
		if (Object.keys(patch).length > 0) {
			const { error } = await supabase.from("pt_exercises_library").update(patch).eq("id", cur.id).eq("user_id", userId);
			if (error) throw new Error(error.message);
			updated++;
		}
	}
	if (rows.length > 0) {
		const { error } = await supabase.from("pt_exercises_library").insert(rows);
		if (error) throw new Error(error.message);
	}
	return {
		imported: rows.length,
		updated,
		skipped: list.length - rows.length - updated,
		total: list.length,
		withMedia: list.filter((e) => e.media_url).length
	};
});
//#endregion
export { fetchHybridProgram_createServerFn_handler, getHybridStatus_createServerFn_handler, importHybridExercises_createServerFn_handler, importHybridProgram_createServerFn_handler, listHybridExercises_createServerFn_handler, listHybridPrograms_createServerFn_handler };
