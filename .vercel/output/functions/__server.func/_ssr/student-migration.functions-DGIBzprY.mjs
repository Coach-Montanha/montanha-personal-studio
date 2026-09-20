import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student-migration.functions-DGIBzprY.js
/**
* Migra alunos entre os módulos Studio e Personal Trainer.
* - copy: cria cópia no destino, mantém original ativo.
* - move: cria cópia no destino e apaga o original (o cascade remove pagamentos/contratos do origem).
* Sempre copia: perfil básico + account_user_id (mesmo login) + histórico de pagamentos + contratos.
*/
var migrateStudents_createServerFn_handler = createServerRpc({
	id: "f9cdea59a0b6aafd3f0599a57347028affeb1fe16f7d159bdf963096a391dcb9",
	name: "migrateStudents",
	filename: "src/lib/student-migration.functions.ts"
}, (opts) => migrateStudents.__executeServer(opts));
var migrateStudents = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input || !Array.isArray(input.ids) || input.ids.length === 0) throw new Error("Selecione ao menos 1 aluno");
	if (input.direction !== "studio_to_pt" && input.direction !== "pt_to_studio") throw new Error("Direção inválida");
	if (input.mode !== "move" && input.mode !== "copy") throw new Error("Modo inválido");
	return input;
}).handler(migrateStudents_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: isAdmin } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Somente administradores");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const results = [];
	const errors = [];
	for (const id of data.ids) try {
		if (data.direction === "studio_to_pt") {
			const newId = await studioToPt(supabaseAdmin, userId, id, data.mode);
			results.push({
				id,
				newId
			});
		} else {
			const newId = await ptToStudio(supabaseAdmin, userId, id, data.mode);
			results.push({
				id,
				newId
			});
		}
	} catch (e) {
		errors.push({
			id,
			error: e?.message ?? "Erro desconhecido"
		});
	}
	return {
		results,
		errors
	};
});
async function studioToPt(admin, userId, sourceId, mode) {
	const { data: src, error: sErr } = await admin.from("students").select("*").eq("id", sourceId).maybeSingle();
	if (sErr) throw new Error(sErr.message);
	if (!src) throw new Error("Aluno não encontrado");
	if (src.user_id !== userId) throw new Error("Aluno não pertence a este usuário");
	const { data: created, error: cErr } = await admin.from("pt_students").insert({
		user_id: src.user_id,
		name: src.name,
		email: src.email,
		phone: src.phone,
		birth_date: src.birth_date,
		status: src.status,
		start_date: src.start_date,
		notes: src.notes,
		account_user_id: src.account_user_id,
		temp_password: src.temp_password
	}).select("id").single();
	if (cErr) throw new Error(`Falha ao criar aluno PT: ${cErr.message}`);
	const newId = created.id;
	const { data: payments } = await admin.from("payments").select("amount,payment_date,due_date,reference_month,payment_method,status,notes").eq("student_id", sourceId);
	if (payments && payments.length > 0) {
		const rows = payments.map((p) => ({
			user_id: userId,
			pt_student_id: newId,
			amount: p.amount,
			payment_date: p.payment_date,
			due_date: p.due_date,
			reference_month: p.reference_month,
			payment_method: p.payment_method,
			status: p.status,
			notes: p.notes
		}));
		const { error } = await admin.from("pt_payments").insert(rows);
		if (error) throw new Error(`Falha ao copiar pagamentos: ${error.message}`);
	}
	const { data: contracts } = await admin.from("student_contracts").select("file_name,file_path,file_size,file_type,notes,signed_at").eq("student_id", sourceId);
	if (contracts && contracts.length > 0) {
		const rows = contracts.map((c) => ({
			user_id: userId,
			pt_student_id: newId,
			file_name: c.file_name,
			file_path: c.file_path,
			file_size: c.file_size,
			file_type: c.file_type,
			notes: c.notes,
			signed_at: c.signed_at
		}));
		const { error } = await admin.from("pt_student_contracts").insert(rows);
		if (error) throw new Error(`Falha ao copiar contratos: ${error.message}`);
	}
	if (mode === "move") {
		const { error } = await admin.from("students").delete().eq("id", sourceId);
		if (error) throw new Error(`Cópia criada, mas falha ao remover original: ${error.message}`);
	}
	return newId;
}
async function ptToStudio(admin, userId, sourceId, mode) {
	const { data: src, error: sErr } = await admin.from("pt_students").select("*").eq("id", sourceId).maybeSingle();
	if (sErr) throw new Error(sErr.message);
	if (!src) throw new Error("Aluno não encontrado");
	if (src.user_id !== userId) throw new Error("Aluno não pertence a este usuário");
	const { data: created, error: cErr } = await admin.from("students").insert({
		user_id: src.user_id,
		name: src.name,
		email: src.email,
		phone: src.phone,
		birth_date: src.birth_date,
		status: src.status,
		start_date: src.start_date,
		notes: src.notes,
		account_user_id: src.account_user_id,
		temp_password: src.temp_password
	}).select("id").single();
	if (cErr) throw new Error(`Falha ao criar aluno Studio: ${cErr.message}`);
	const newId = created.id;
	const { data: payments } = await admin.from("pt_payments").select("amount,payment_date,due_date,reference_month,payment_method,status,notes").eq("pt_student_id", sourceId);
	if (payments && payments.length > 0) {
		const rows = payments.map((p) => ({
			user_id: userId,
			student_id: newId,
			amount: p.amount,
			payment_date: p.payment_date,
			due_date: p.due_date,
			reference_month: p.reference_month ?? new Date(p.payment_date).toISOString().slice(0, 7),
			payment_method: p.payment_method,
			status: p.status,
			notes: p.notes
		}));
		const { error } = await admin.from("payments").insert(rows);
		if (error) throw new Error(`Falha ao copiar pagamentos: ${error.message}`);
	}
	const { data: contracts } = await admin.from("pt_student_contracts").select("file_name,file_path,file_size,file_type,notes,signed_at").eq("pt_student_id", sourceId);
	if (contracts && contracts.length > 0) {
		const rows = contracts.map((c) => ({
			user_id: userId,
			student_id: newId,
			file_name: c.file_name,
			file_path: c.file_path,
			file_size: c.file_size,
			file_type: c.file_type,
			notes: c.notes,
			signed_at: c.signed_at
		}));
		const { error } = await admin.from("student_contracts").insert(rows);
		if (error) throw new Error(`Falha ao copiar contratos: ${error.message}`);
	}
	if (mode === "move") {
		const { error } = await admin.from("pt_students").delete().eq("id", sourceId);
		if (error) throw new Error(`Cópia criada, mas falha ao remover original: ${error.message}`);
	}
	return newId;
}
//#endregion
export { migrateStudents_createServerFn_handler };
