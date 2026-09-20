import { t as cn } from "./utils-C_uf36nf.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { M as ShieldAlert, _ as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ClinicalAlertBadge-DvxlxBCj.js
var import_jsx_runtime = require_jsx_runtime();
var PARQ_QUESTIONS = [
	{
		key: "parq_heart_condition",
		question: "Algum médico já disse que você possui algum problema cardíaco?"
	},
	{
		key: "parq_chest_pain_activity",
		question: "Você sente dores no peito quando pratica atividade física?"
	},
	{
		key: "parq_chest_pain_rest",
		question: "No último mês, você sentiu dor no peito em repouso (sem praticar atividade física)?"
	},
	{
		key: "parq_dizziness",
		question: "Você costuma perder o equilíbrio por causa de tonturas ou já perdeu a consciência?"
	},
	{
		key: "parq_bone_joint_problem",
		question: "Você tem algum problema ósseo ou articular que possa piorar com a atividade física?"
	},
	{
		key: "parq_blood_pressure_meds",
		question: "Você toma medicamentos de uso contínuo para pressão arterial ou problema cardíaco?"
	},
	{
		key: "parq_other_reason",
		question: "Você tem conhecimento de alguma outra razão médica pela qual não deva praticar exercícios?"
	}
];
function calculateRiskLevel(data) {
	if (data.parq_heart_condition || data.parq_chest_pain_activity || data.parq_chest_pain_rest || data.parq_dizziness) return "high";
	if (data.parq_bone_joint_problem || data.parq_blood_pressure_meds || data.parq_other_reason || data.joint_spine || data.joint_knee || data.joint_shoulder || data.orthopedic_injuries && data.orthopedic_injuries.trim().length > 3) return "moderate";
	return "low";
}
function extractClinicalAlerts(anamnesis) {
	if (!anamnesis) return [];
	const alerts = [];
	if (anamnesis.parq_heart_condition) alerts.push("Cardiopatia diagnosticada");
	if (anamnesis.parq_chest_pain_activity || anamnesis.parq_chest_pain_rest) alerts.push("Dor no peito relatada");
	if (anamnesis.parq_dizziness) alerts.push("Tonturas / Perda de equilíbrio");
	if (anamnesis.parq_blood_pressure_meds) alerts.push("Uso de anti-hipertensivo");
	if (anamnesis.joint_spine) alerts.push("Coluna / Lombar");
	if (anamnesis.joint_knee) alerts.push("Joelhos");
	if (anamnesis.joint_shoulder) alerts.push("Ombros");
	if (anamnesis.joint_hip) alerts.push("Quadril");
	if (anamnesis.orthopedic_injuries && anamnesis.orthopedic_injuries.trim()) alerts.push(`Lesão: ${anamnesis.orthopedic_injuries.trim()}`);
	if (anamnesis.contraindications && anamnesis.contraindications.trim()) alerts.push(`Restrição: ${anamnesis.contraindications.trim()}`);
	return alerts;
}
var LOCAL_STORAGE_KEY_PREFIX = "pt_student_anamnesis_";
async function getStudentAnamnesis(studentId) {
	try {
		const { data, error } = await supabase.from("pt_student_anamnesis").select("*").eq("pt_student_id", studentId).maybeSingle();
		if (!error && data) return data;
	} catch {}
	if (typeof window !== "undefined") try {
		const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${studentId}`);
		if (stored) return JSON.parse(stored);
	} catch {}
	return null;
}
async function saveStudentAnamnesis(studentId, input) {
	const risk_level = calculateRiskLevel(input);
	const payload = {
		...input,
		pt_student_id: studentId,
		risk_level,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (typeof window !== "undefined") try {
		localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${studentId}`, JSON.stringify(payload));
	} catch {}
	try {
		const { data: userRes } = await supabase.auth.getUser();
		const userId = userRes.user?.id;
		if (userId) payload.user_id = userId;
		const { data: existing } = await supabase.from("pt_student_anamnesis").select("id").eq("pt_student_id", studentId).maybeSingle();
		if (existing && existing.id) {
			const { data, error } = await supabase.from("pt_student_anamnesis").update(payload).eq("id", existing.id).select().single();
			if (!error && data) return data;
		} else {
			const { data, error } = await supabase.from("pt_student_anamnesis").insert(payload).select().single();
			if (!error && data) return data;
		}
		const alerts = extractClinicalAlerts(payload);
		if (alerts.length > 0) await supabase.from("pt_students").update({ health_notes: alerts.join(" • ") }).eq("id", studentId);
	} catch {}
	return payload;
}
function ClinicalAlertBadge({ alerts, riskLevel = "moderate", onClick, className, variant = "banner" }) {
	if (!alerts || alerts.length === 0) return null;
	const isHighRisk = riskLevel === "high";
	if (variant === "compact") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border transition-all cursor-pointer", isHighRisk ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20" : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20", className),
		title: alerts.join(" • "),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
			"Atenção Clínica (",
			alerts.length,
			")"
		] })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick,
		className: cn("flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border p-3 sm:px-4 sm:py-3 transition-all", isHighRisk ? "border-red-500/40 bg-red-500/[0.06] text-red-950 dark:text-red-200 shadow-xs" : "border-amber-500/40 bg-amber-500/[0.06] text-amber-950 dark:text-amber-200 shadow-xs", onClick && "cursor-pointer hover:border-amber-500/70", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", isHighRisk ? "bg-red-500/20 text-red-600 dark:text-red-400" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"),
				children: isHighRisk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold uppercase tracking-wider",
						children: isHighRisk ? "Alto Risco Clínico (PAR-Q)" : "Atenção Clínica & Restrições"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-1",
						children: alerts.map((alert, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold border", isHighRisk ? "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-300" : "border-amber-500/30 bg-amber-500/15 text-amber-800 dark:text-amber-300"),
							children: alert
						}, i))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-[11px] opacity-80 truncate",
					children: "Evite sobrecargas axiais ou amplitudes extremas nas articulações indicadas."
				})]
			})]
		}), onClick && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-semibold underline underline-offset-2 opacity-90 hover:opacity-100 shrink-0",
			children: "Ver Anamnese →"
		})]
	});
}
//#endregion
export { saveStudentAnamnesis as a, getStudentAnamnesis as i, PARQ_QUESTIONS as n, extractClinicalAlerts as r, ClinicalAlertBadge as t };
