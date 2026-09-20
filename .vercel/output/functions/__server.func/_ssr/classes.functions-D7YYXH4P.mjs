import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/classes.functions-D7YYXH4P.js
function toDateKey(d) {
	return d.toISOString().slice(0, 10);
}
function combineDateTime(dateISO, timeHHMM) {
	return /* @__PURE__ */ new Date(`${dateISO}T${timeHHMM.slice(0, 5)}:00-03:00`);
}
function weekBounds(d, weekStartsOn = 1) {
	const diff = (d.getDay() - weekStartsOn + 7) % 7;
	const start = new Date(d);
	start.setDate(d.getDate() - diff);
	start.setHours(0, 0, 0, 0);
	const end = new Date(start);
	end.setDate(start.getDate() + 6);
	end.setHours(23, 59, 59, 999);
	return {
		start,
		end
	};
}
function monthBounds(d) {
	return {
		start: new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0),
		end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
	};
}
async function computeQuotaUsage(supabase, studentId) {
	const today = toDateKey(/* @__PURE__ */ new Date());
	const [{ data: currentPayments }, { data: settings }] = await Promise.all([supabase.from("payments").select("plan_id, student_id, user_id, payment_date, due_date, plans:plan_id ( name, checkin_quota_type, checkin_quota_amount, package_valid_days )").eq("student_id", studentId).eq("status", "paid").not("plan_id", "is", null).order("payment_date", { ascending: false }).order("created_at", { ascending: false }).limit(10), supabase.from("studio_settings").select("checkin_week_start_day").limit(1).maybeSingle()]);
	const weekStartsOn = settings?.checkin_week_start_day ?? 0;
	const current = (currentPayments ?? []).find((p) => !p.due_date || p.due_date >= today);
	const plan = current?.plans;
	const quotaType = plan?.checkin_quota_type ?? "none";
	const quotaAmount = plan?.checkin_quota_amount ?? null;
	const now = /* @__PURE__ */ new Date();
	const base = {
		plan_id: current?.plan_id ?? null,
		plan_name: plan?.name ?? null,
		quota_type: quotaType,
		quota_amount: quotaAmount,
		used: 0,
		remaining: quotaAmount,
		period_label: "",
		package_expires_at: null
	};
	if (quotaType === "none" || !quotaAmount) return base;
	let periodStart;
	let periodEnd;
	let periodLabel;
	let packageExpiresAt = null;
	if (quotaType === "weekly") {
		const wb = weekBounds(now, weekStartsOn);
		periodStart = wb.start;
		periodEnd = wb.end;
		periodLabel = "esta semana";
	} else if (quotaType === "monthly") {
		const mb = monthBounds(now);
		periodStart = mb.start;
		periodEnd = mb.end;
		periodLabel = "este mês";
	} else {
		const start = current?.payment_date ? new Date(current.payment_date) : now;
		const validDays = plan?.package_valid_days ?? 30;
		periodStart = new Date(start);
		periodStart.setHours(0, 0, 0, 0);
		periodEnd = new Date(periodStart);
		periodEnd.setDate(periodStart.getDate() + validDays);
		packageExpiresAt = periodEnd.toISOString().slice(0, 10);
		periodLabel = `até ${new Date(periodEnd).toLocaleDateString("pt-BR")}`;
	}
	const { data: attRows } = await supabase.from("class_attendance").select("id, class_sessions:session_id ( session_date )").eq("student_id", studentId);
	const used = (attRows ?? []).filter((r) => {
		const sd = r.class_sessions?.session_date;
		if (!sd) return false;
		const d = /* @__PURE__ */ new Date(`${sd}T12:00:00`);
		return d >= periodStart && d <= periodEnd;
	}).length;
	return {
		...base,
		used,
		remaining: Math.max(0, quotaAmount - used),
		period_label: periodLabel,
		package_expires_at: packageExpiresAt
	};
}
async function loadSessionContext(supabase, sessionId) {
	const { data: session, error } = await supabase.from("class_sessions").select(`
      id, session_date, start_time, class_id, user_id,
      classes:class_id (
        capacity, program_id,
        checkin_opens_minutes_before, checkin_closes_minutes_before
      )
    `).eq("id", sessionId).maybeSingle();
	if (error) throw new Error(error.message);
	if (!session) throw new Error("Sessão não encontrada");
	return session;
}
var generateClassSessions_createServerFn_handler = createServerRpc({
	id: "e92d90087c3116ac58b381f139ea5893c9f9a2c012de2712ffb73e7576dc4db3",
	name: "generateClassSessions",
	filename: "src/lib/classes.functions.ts"
}, (opts) => generateClassSessions.__executeServer(opts));
var generateClassSessions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.classId) throw new Error("classId requerido");
	return {
		classId: input.classId,
		weeks: input.weeks ?? 12
	};
}).handler(generateClassSessions_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: cls, error } = await supabase.from("classes").select("id, user_id, days_of_week, day_of_week, start_time, duration_minutes, is_recurring").eq("id", data.classId).maybeSingle();
	if (error) throw new Error(error.message);
	if (!cls) throw new Error("Turma não encontrada");
	if (cls.user_id !== userId) throw new Error("Sem permissão");
	if (!cls.is_recurring) throw new Error("Turma não é recorrente");
	const days = cls.days_of_week && cls.days_of_week.length > 0 ? cls.days_of_week : cls.day_of_week !== null && cls.day_of_week !== void 0 ? [cls.day_of_week] : [];
	if (days.length === 0) throw new Error("Selecione ao menos um dia da semana");
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const currentDow = today.getDay();
	const rows = [];
	for (const targetDow of days) {
		const diff = (targetDow - currentDow + 7) % 7;
		for (let w = 0; w < data.weeks; w++) {
			const d = new Date(today);
			d.setDate(today.getDate() + diff + w * 7);
			rows.push({
				user_id: userId,
				class_id: cls.id,
				session_date: toDateKey(d),
				start_time: cls.start_time,
				duration_minutes: cls.duration_minutes
			});
		}
	}
	const { data: existing } = await supabase.from("class_sessions").select("session_date,start_time").eq("class_id", cls.id).in("session_date", rows.map((r) => r.session_date));
	const existingSet = new Set((existing ?? []).map((e) => `${e.session_date}|${String(e.start_time).slice(0, 5)}`));
	const toInsert = rows.filter((r) => !existingSet.has(`${r.session_date}|${String(r.start_time).slice(0, 5)}`));
	if (toInsert.length > 0) {
		const { error: iErr } = await supabase.from("class_sessions").insert(toInsert);
		if (iErr) throw new Error(iErr.message);
	}
	return {
		created: toInsert.length,
		total: rows.length
	};
});
var getAgenda_createServerFn_handler = createServerRpc({
	id: "d2d857e5143d3a31dc9f33662ac3f404eb527afcdc57ee68dccbee462168b309",
	name: "getAgenda",
	filename: "src/lib/classes.functions.ts"
}, (opts) => getAgenda.__executeServer(opts));
var getAgenda = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.from || !input.to) throw new Error("Período obrigatório");
	return input;
}).handler(getAgenda_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const today = toDateKey(/* @__PURE__ */ new Date());
	const [stuRes, sessionsRes] = await Promise.all([supabase.from("students").select("id").eq("account_user_id", userId).maybeSingle(), supabase.from("class_sessions").select(`
          id, session_date, start_time, duration_minutes, class_id, user_id,
          capacity_override, notes, status,
          classes:class_id (
            name, trainer_name, capacity, program_id,
            checkin_opens_minutes_before, checkin_closes_minutes_before,
            programs:program_id ( id, name, color )
          )
        `).gte("session_date", data.from).lte("session_date", data.to).order("session_date", { ascending: true }).order("start_time", { ascending: true })]);
	if (sessionsRes.error) throw new Error(sessionsRes.error.message);
	const studentId = stuRes.data?.id ?? null;
	const sessions = sessionsRes.data ?? [];
	const sessionIds = sessions.map((s) => s.id);
	const [attRes, paymentsRes] = await Promise.all([sessionIds.length > 0 ? supabase.from("class_attendance").select("session_id, student_id").in("session_id", sessionIds) : Promise.resolve({ data: [] }), studentId ? supabase.from("payments").select("plan_id,due_date,payment_date").eq("student_id", studentId).eq("status", "paid").not("plan_id", "is", null).order("payment_date", { ascending: false }).order("created_at", { ascending: false }).limit(10) : Promise.resolve({ data: [] })]);
	const countsMap = /* @__PURE__ */ new Map();
	const checkedInSessionIds = /* @__PURE__ */ new Set();
	for (const r of attRes.data ?? []) {
		countsMap.set(r.session_id, (countsMap.get(r.session_id) ?? 0) + 1);
		if (studentId && r.student_id === studentId) checkedInSessionIds.add(r.session_id);
	}
	let allowedProgramIds = null;
	let hasCurrentPlan = false;
	const current = (paymentsRes.data ?? []).find((p) => !p.due_date || p.due_date >= today);
	if (current?.plan_id) {
		hasCurrentPlan = true;
		const { data: pp } = await supabase.from("plan_programs").select("program_id").eq("plan_id", current.plan_id);
		const ids = (pp ?? []).map((r) => r.program_id);
		allowedProgramIds = ids.length > 0 ? new Set(ids) : null;
	}
	const hasAccess = (programId) => {
		if (!studentId || !hasCurrentPlan) return false;
		if (allowedProgramIds === null) return true;
		return programId ? allowedProgramIds.has(programId) : false;
	};
	let out = sessions.map((s) => ({
		id: s.id,
		session_date: s.session_date,
		start_time: s.start_time,
		duration_minutes: s.duration_minutes,
		class_id: s.class_id,
		class_name: s.classes?.name ?? "Turma removida",
		trainer_name: s.classes?.trainer_name ?? null,
		program_id: s.classes?.program_id ?? null,
		program_name: s.classes?.programs?.name ?? null,
		program_color: s.classes?.programs?.color ?? null,
		capacity: s.capacity_override ?? s.classes?.capacity ?? 0,
		filled: countsMap.get(s.id) ?? 0,
		is_enrolled: hasAccess(s.classes?.program_id ?? null),
		checked_in: checkedInSessionIds.has(s.id),
		checkin_opens_minutes_before: s.classes?.checkin_opens_minutes_before ?? 60,
		checkin_closes_minutes_before: s.classes?.checkin_closes_minutes_before ?? 15,
		studio_user_id: s.user_id,
		capacity_override: s.capacity_override ?? null,
		session_notes: s.notes ?? null,
		status: s.status ?? "scheduled"
	}));
	if (data.programId) out = out.filter((s) => s.program_id === data.programId);
	return out;
});
var getMyQuotaUsage_createServerFn_handler = createServerRpc({
	id: "c5077056d422784642ce3ec66b8832ce227a556c4fca4b2d19b3b0c29c8673f2",
	name: "getMyQuotaUsage",
	filename: "src/lib/classes.functions.ts"
}, (opts) => getMyQuotaUsage.__executeServer(opts));
var getMyQuotaUsage = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMyQuotaUsage_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: stu } = await supabase.from("students").select("id").eq("account_user_id", userId).maybeSingle();
	if (!stu) return {
		plan_id: null,
		plan_name: null,
		quota_type: "none",
		quota_amount: null,
		used: 0,
		remaining: null,
		period_label: "",
		package_expires_at: null
	};
	return await computeQuotaUsage(supabase, stu.id);
});
var getMyAttendanceStats_createServerFn_handler = createServerRpc({
	id: "a085a7aa6d4f3c8f637ebdd79bf8af31ea1d73874ca62341a4bb0657f26edfc2",
	name: "getMyAttendanceStats",
	filename: "src/lib/classes.functions.ts"
}, (opts) => getMyAttendanceStats.__executeServer(opts));
var getMyAttendanceStats = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMyAttendanceStats_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: stu } = await supabase.from("students").select("id, attendance_offset").eq("account_user_id", userId).maybeSingle();
	if (!stu) return {
		total: 0,
		year: 0,
		month: 0
	};
	const { data: att } = await supabase.from("class_attendance").select("session_id, class_sessions:session_id(session_date)").eq("student_id", stu.id);
	const dates = (att ?? []).map((r) => r.class_sessions?.session_date).filter((d) => !!d);
	const now = /* @__PURE__ */ new Date();
	const y = String(now.getFullYear());
	const ym = `${y}-${String(now.getMonth() + 1).padStart(2, "0")}`;
	const offset = stu.attendance_offset ?? 0;
	return {
		total: dates.length + offset,
		year: dates.filter((d) => d.startsWith(y)).length,
		month: dates.filter((d) => d.startsWith(ym)).length
	};
});
var getSessionAttendees_createServerFn_handler = createServerRpc({
	id: "7a51f3fd3101019af8629441c5efbe1aa2268589cec2fe0658e1546fcc6dd11f",
	name: "getSessionAttendees",
	filename: "src/lib/classes.functions.ts"
}, (opts) => getSessionAttendees.__executeServer(opts));
var getSessionAttendees = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(getSessionAttendees_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: session, error: sErr } = await supabase.from("class_sessions").select("id, user_id").eq("id", data.sessionId).maybeSingle();
	if (sErr) throw new Error(sErr.message);
	if (!session) throw new Error("Sessão não encontrada");
	let myStudentId = null;
	if (session.user_id !== userId) {
		const { data: stu } = await supabase.from("students").select("id, user_id").eq("account_user_id", userId).maybeSingle();
		if (!stu || stu.user_id !== session.user_id) throw new Error("Sem permissão");
		myStudentId = stu.id;
	}
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: att, error: aErr } = await supabaseAdmin.from("class_attendance").select("student_id, students:student_id(name)").eq("session_id", data.sessionId);
	if (aErr) throw new Error(aErr.message);
	return (att ?? []).map((r) => ({
		student_id: r.student_id,
		name: r.students?.name ?? "Aluno",
		is_me: myStudentId === r.student_id
	})).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
});
var studentCheckIn_createServerFn_handler = createServerRpc({
	id: "3b7a9f753c12b45ec023781bd89462948b6222b94abd6a0fbbbddf024f50888a",
	name: "studentCheckIn",
	filename: "src/lib/classes.functions.ts"
}, (opts) => studentCheckIn.__executeServer(opts));
var studentCheckIn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(studentCheckIn_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: stu } = await supabase.from("students").select("id, user_id").eq("account_user_id", userId).maybeSingle();
	if (!stu) throw new Error("Perfil de aluno não encontrado");
	const session = await loadSessionContext(supabase, data.sessionId);
	if (session.user_id !== stu.user_id) throw new Error("Sessão não pertence ao seu studio");
	if (!session.class_id) throw new Error("Sessão sem turma associada");
	const start = combineDateTime(session.session_date, session.start_time);
	const opens = /* @__PURE__ */ new Date(start.getTime() - (session.classes?.checkin_opens_minutes_before ?? 60) * 6e4);
	const closes = /* @__PURE__ */ new Date(start.getTime() - (session.classes?.checkin_closes_minutes_before ?? 15) * 6e4);
	const now = /* @__PURE__ */ new Date();
	if (now < opens) throw new Error(`Check-in abre às ${opens.toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit"
	})}`);
	if (now > closes) throw new Error(`Check-in encerrado às ${closes.toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit"
	})}`);
	const { count } = await supabase.from("class_attendance").select("id", {
		count: "exact",
		head: true
	}).eq("session_id", session.id);
	if ((count ?? 0) >= (session.classes?.capacity ?? 0)) throw new Error("Turma sem vagas");
	const programId = session.classes?.program_id ?? null;
	if (programId) {
		const { data: settings } = await supabase.from("studio_settings").select("allow_multi_checkin_same_program_per_day").eq("user_id", stu.user_id).maybeSingle();
		if (!(settings?.allow_multi_checkin_same_program_per_day ?? false)) {
			const { data: sameDay } = await supabase.from("class_attendance").select("id, class_sessions:session_id ( session_date, classes:class_id ( program_id ) )").eq("student_id", stu.id);
			if ((sameDay ?? []).some((r) => r.class_sessions?.session_date === session.session_date && r.class_sessions?.classes?.program_id === programId)) throw new Error("Você já fez check-in em outra aula deste programa hoje");
		}
	}
	const usage = await computeQuotaUsage(supabase, stu.id);
	if (usage.quota_type !== "none" && usage.quota_amount) {
		if (usage.used >= usage.quota_amount) {
			const label = usage.quota_type === "weekly" ? "semana" : usage.quota_type === "monthly" ? "mês" : "pacote";
			throw new Error(`Cota do plano atingida (${usage.quota_amount} check-ins/${label})`);
		}
	}
	if (!usage.plan_id) throw new Error("Você não possui um plano ativo — fale com o studio");
	if (programId) {
		const { data: allowed } = await supabase.from("plan_programs").select("program_id").eq("plan_id", usage.plan_id);
		const allowedIds = (allowed ?? []).map((r) => r.program_id);
		if (allowedIds.length > 0 && !allowedIds.includes(programId)) throw new Error("Seu plano não libera esta modalidade");
	}
	const { error: insErr } = await supabase.from("class_attendance").insert({
		user_id: stu.user_id,
		session_id: session.id,
		student_id: stu.id,
		status: "present"
	});
	if (insErr) throw new Error(insErr.message);
	return { ok: true };
});
var studentCancelCheckIn_createServerFn_handler = createServerRpc({
	id: "597bb54d7a9fe392e892734bee821e0a8b06010626d0b2176d1b176e16ca68e7",
	name: "studentCancelCheckIn",
	filename: "src/lib/classes.functions.ts"
}, (opts) => studentCancelCheckIn.__executeServer(opts));
var studentCancelCheckIn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(studentCancelCheckIn_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: stu } = await supabase.from("students").select("id, user_id").eq("account_user_id", userId).maybeSingle();
	if (!stu) throw new Error("Perfil de aluno não encontrado");
	const session = await loadSessionContext(supabase, data.sessionId);
	const start = combineDateTime(session.session_date, session.start_time);
	const closes = /* @__PURE__ */ new Date(start.getTime() - (session.classes?.checkin_closes_minutes_before ?? 15) * 6e4);
	if (/* @__PURE__ */ new Date() > closes) throw new Error(`Cancelamento encerrado às ${closes.toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit"
	})}`);
	const { error } = await supabase.from("class_attendance").delete().eq("session_id", session.id).eq("student_id", stu.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
async function assertSessionOwner(supabase, userId, sessionId) {
	const { data: s, error } = await supabase.from("class_sessions").select("id, user_id, class_id, session_date, start_time").eq("id", sessionId).maybeSingle();
	if (error) throw new Error(error.message);
	if (!s) throw new Error("Sessão não encontrada");
	if (s.user_id !== userId) throw new Error("Sem permissão");
	return s;
}
/** Exclui apenas UMA sessão (não afeta as demais nem a turma-mãe). */
var deleteClassSession_createServerFn_handler = createServerRpc({
	id: "389a749687d0938fc7478ec7960401424849188d5570ab6c386a787e0969f2b9",
	name: "deleteClassSession",
	filename: "src/lib/classes.functions.ts"
}, (opts) => deleteClassSession.__executeServer(opts));
var deleteClassSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(deleteClassSession_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertSessionOwner(supabase, userId, data.sessionId);
	const { error } = await supabase.from("class_sessions").delete().eq("id", data.sessionId).eq("user_id", userId);
	if (error) throw new Error(error.message);
	return {
		ok: true,
		deleted: 1
	};
});
var deleteClassSessionsFrom_createServerFn_handler = createServerRpc({
	id: "43d0d2c433c17cc2513eac698285c44a4320d82f9b82c186d64023084e5b38da",
	name: "deleteClassSessionsFrom",
	filename: "src/lib/classes.functions.ts"
}, (opts) => deleteClassSessionsFrom.__executeServer(opts));
var deleteClassSessionsFrom = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(deleteClassSessionsFrom_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const s = await assertSessionOwner(supabase, userId, data.sessionId);
	if (!s.class_id) {
		const { error } = await supabase.from("class_sessions").delete().eq("id", s.id).eq("user_id", userId);
		if (error) throw new Error(error.message);
		return {
			ok: true,
			deleted: 1
		};
	}
	const { data: futures, error: qErr } = await supabase.from("class_sessions").select("id, session_date, start_time").eq("class_id", s.class_id).eq("user_id", userId).gte("session_date", s.session_date);
	if (qErr) throw new Error(qErr.message);
	const ids = (futures ?? []).filter((r) => r.session_date > s.session_date || r.session_date === s.session_date && String(r.start_time) >= String(s.start_time)).map((r) => r.id);
	if (ids.length === 0) return {
		ok: true,
		deleted: 0
	};
	const { error } = await supabase.from("class_sessions").delete().in("id", ids).eq("user_id", userId);
	if (error) throw new Error(error.message);
	return {
		ok: true,
		deleted: ids.length
	};
});
var deleteClassAll_createServerFn_handler = createServerRpc({
	id: "57bc17bb00e7c66a5f30906ee4581e0d07ab0f72521f9cde54d091484f6961ba",
	name: "deleteClassAll",
	filename: "src/lib/classes.functions.ts"
}, (opts) => deleteClassAll.__executeServer(opts));
var deleteClassAll = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.classId) throw new Error("classId requerido");
	return input;
}).handler(deleteClassAll_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { error } = await supabase.from("classes").delete().eq("id", data.classId).eq("user_id", userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var updateClassSessionOverrides_createServerFn_handler = createServerRpc({
	id: "f86db12054e839da9288d644cc5417eb82a4fd5277409a051647f4c3f3a07eca",
	name: "updateClassSessionOverrides",
	filename: "src/lib/classes.functions.ts"
}, (opts) => updateClassSessionOverrides.__executeServer(opts));
var updateClassSessionOverrides = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(updateClassSessionOverrides_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertSessionOwner(supabase, userId, data.sessionId);
	const patch = {};
	if (data.session_date !== void 0) patch.session_date = data.session_date;
	if (data.start_time !== void 0) patch.start_time = data.start_time;
	if (data.duration_minutes !== void 0) patch.duration_minutes = data.duration_minutes;
	if (data.capacity_override !== void 0) patch.capacity_override = data.capacity_override;
	if (data.notes !== void 0) patch.notes = data.notes;
	if (data.status !== void 0) patch.status = data.status;
	if (Object.keys(patch).length === 0) return { ok: true };
	const { error } = await supabase.from("class_sessions").update(patch).eq("id", data.sessionId).eq("user_id", userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var updateClassSessionsFromOverrides_createServerFn_handler = createServerRpc({
	id: "1248295afb094cd2258bfcd8b2a7eba47ebc8f89c1999d038ea9f939468976b4",
	name: "updateClassSessionsFromOverrides",
	filename: "src/lib/classes.functions.ts"
}, (opts) => updateClassSessionsFromOverrides.__executeServer(opts));
var updateClassSessionsFromOverrides = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.sessionId) throw new Error("sessionId requerido");
	return input;
}).handler(updateClassSessionsFromOverrides_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const s = await assertSessionOwner(supabase, userId, data.sessionId);
	const patch = {};
	if (data.start_time !== void 0) patch.start_time = data.start_time;
	if (data.duration_minutes !== void 0) patch.duration_minutes = data.duration_minutes;
	if (data.capacity_override !== void 0) patch.capacity_override = data.capacity_override;
	if (data.notes !== void 0) patch.notes = data.notes;
	if (Object.keys(patch).length === 0) return {
		ok: true,
		updated: 0
	};
	if (!s.class_id) {
		const { error } = await supabase.from("class_sessions").update(patch).eq("id", s.id).eq("user_id", userId);
		if (error) throw new Error(error.message);
		return {
			ok: true,
			updated: 1
		};
	}
	const { data: futures, error: qErr } = await supabase.from("class_sessions").select("id, session_date, start_time").eq("class_id", s.class_id).eq("user_id", userId).gte("session_date", s.session_date);
	if (qErr) throw new Error(qErr.message);
	const ids = (futures ?? []).filter((r) => r.session_date > s.session_date || r.session_date === s.session_date && String(r.start_time) >= String(s.start_time)).map((r) => r.id);
	if (ids.length === 0) return {
		ok: true,
		updated: 0
	};
	const { error } = await supabase.from("class_sessions").update(patch).in("id", ids).eq("user_id", userId);
	if (error) throw new Error(error.message);
	return {
		ok: true,
		updated: ids.length
	};
});
//#endregion
export { deleteClassAll_createServerFn_handler, deleteClassSession_createServerFn_handler, deleteClassSessionsFrom_createServerFn_handler, generateClassSessions_createServerFn_handler, getAgenda_createServerFn_handler, getMyAttendanceStats_createServerFn_handler, getMyQuotaUsage_createServerFn_handler, getSessionAttendees_createServerFn_handler, studentCancelCheckIn_createServerFn_handler, studentCheckIn_createServerFn_handler, updateClassSessionOverrides_createServerFn_handler, updateClassSessionsFromOverrides_createServerFn_handler };
