import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
import { c as _enum, f as object, p as string } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pt-program-migrate.functions-BZsqhS0E.js
var InputSchema = object({
	programId: string().uuid(),
	targetStudentId: string().uuid(),
	mode: _enum(["copy", "move"])
});
var migrateProgram_createServerFn_handler = createServerRpc({
	id: "d6e01b43e3732610c1d0371e104688cd060f4832d9bb52ac7cfc2a3ac3cb2b3e",
	name: "migrateProgram",
	filename: "src/lib/pt-program-migrate.functions.ts"
}, (opts) => migrateProgram.__executeServer(opts));
var migrateProgram = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => InputSchema.parse(raw)).handler(migrateProgram_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: program, error: progErr } = await supabase.from("pt_programs").select("*").eq("id", data.programId).maybeSingle();
	if (progErr) throw new Error(progErr.message);
	if (!program) throw new Error("Rotina não encontrada");
	const p = program;
	if (p.user_id !== userId) throw new Error("Sem permissão para esta rotina");
	const { data: target, error: tgtErr } = await supabase.from("pt_students").select("id,user_id,name").eq("id", data.targetStudentId).maybeSingle();
	if (tgtErr) throw new Error(tgtErr.message);
	if (!target) throw new Error("Aluno de destino não encontrado");
	const t = target;
	if (t.user_id !== userId) throw new Error("Sem permissão para o aluno de destino");
	if (data.mode === "move") {
		if (p.pt_student_id === data.targetStudentId) return {
			newProgramId: p.id,
			targetName: t.name
		};
		const { error } = await supabase.from("pt_programs").update({ pt_student_id: data.targetStudentId }).eq("id", p.id);
		if (error) throw new Error(error.message);
		return {
			newProgramId: p.id,
			targetName: t.name
		};
	}
	const newName = p.pt_student_id === data.targetStudentId ? `${p.name} (cópia)` : p.name;
	const { data: created, error: createErr } = await supabase.from("pt_programs").insert({
		user_id: userId,
		pt_student_id: data.targetStudentId,
		name: newName,
		start_date: p.start_date,
		end_date: p.end_date,
		goals: p.goals,
		category: p.category,
		level: p.level,
		training_type: p.training_type,
		show_to_student: p.show_to_student,
		auto_archive: p.auto_archive,
		ai_prompt: p.ai_prompt ?? null,
		ai_generated_at: p.ai_generated_at ?? null
	}).select("id").single();
	if (createErr) throw new Error(createErr.message);
	const newProgramId = created.id;
	try {
		const { data: days, error: daysErr } = await supabase.from("pt_training_days").select("*").eq("program_id", p.id).order("sort_order", { ascending: true });
		if (daysErr) throw new Error(daysErr.message);
		for (const dRaw of days ?? []) {
			const d = dRaw;
			const { data: newDay, error: newDayErr } = await supabase.from("pt_training_days").insert({
				user_id: userId,
				program_id: newProgramId,
				name: d.name,
				day_label: d.day_label,
				description: d.description,
				sort_order: d.sort_order
			}).select("id").single();
			if (newDayErr) throw new Error(newDayErr.message);
			const newDayId = newDay.id;
			const { data: exercises, error: exErr } = await supabase.from("pt_training_exercises").select("*").eq("training_day_id", d.id).order("sort_order", { ascending: true });
			if (exErr) throw new Error(exErr.message);
			const rows = (exercises ?? []).map((eRaw) => {
				const e = eRaw;
				return {
					user_id: userId,
					training_day_id: newDayId,
					name: e.name,
					sets_reps: e.sets_reps,
					load: e.load,
					rest_seconds: e.rest_seconds,
					observations: e.observations,
					media_url: e.media_url,
					media_type: e.media_type,
					sort_order: e.sort_order
				};
			});
			if (rows.length > 0) {
				const { error: insExErr } = await supabase.from("pt_training_exercises").insert(rows);
				if (insExErr) throw new Error(insExErr.message);
			}
		}
		return {
			newProgramId,
			targetName: t.name
		};
	} catch (e) {
		await supabase.from("pt_programs").delete().eq("id", newProgramId);
		throw e;
	}
});
//#endregion
export { migrateProgram_createServerFn_handler };
