import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { R as Search, V as RotateCcw, Z as Pencil, _t as LoaderCircle, c as User, en as Clock, mn as ChevronDown, s as Users, sn as CircleCheck, t as Zap } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as PageHeader } from "./PageHeader-CRue-aiN.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { s as format, t as ptBR } from "../_libs/date-fns.mjs";
import { l as initials } from "./format-BT-nao3-.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useScopeFilter } from "./use-scope-filter-q5Imal9c.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { i as PTStudentStatusBadge } from "./PTBadges-CcuDhA9u.mjs";
import { r as parseStudentPartner, t as addSessionToCalendar } from "./pt-duo-Dbaj7St1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkin-ksUjmTu5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WA_TEMPLATE_KEY = "edufinance.checkinWhatsAppTemplate";
var DEFAULT_WA_TEMPLATE = `Olá {{aluno}}! ✅

Seu check-in foi registrado com sucesso!

📅 *Data:* {{data}}
🕐 *Horário:* {{hora}}
⏱️ *Duração:* {{duracao}}

📦 *Saldo restante:* {{saldo}} aula(s)
   • {{utilizadas}} de {{contratadas}} aulas utilizadas

Bom treino! 💪`;
var WA_VARS = [
	{
		key: "aluno",
		label: "Nome do aluno"
	},
	{
		key: "data",
		label: "Data do check-in"
	},
	{
		key: "hora",
		label: "Horário"
	},
	{
		key: "duracao",
		label: "Duração"
	},
	{
		key: "saldo",
		label: "Aulas restantes"
	},
	{
		key: "utilizadas",
		label: "Aulas utilizadas"
	},
	{
		key: "contratadas",
		label: "Aulas contratadas"
	},
	{
		key: "plano",
		label: "Nome do pacote"
	}
];
function applyTemplate(tpl, vars) {
	return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, k) => vars[k] ?? "");
}
function CheckinPage() {
	const qc = useQueryClient();
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
	const todayLabel = format(/* @__PURE__ */ new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });
	const [search, setSearch] = (0, import_react.useState)("");
	const [checkingIn, setCheckingIn] = (0, import_react.useState)(null);
	const [duration, setDuration] = (0, import_react.useState)("60");
	const [sessionTime, setSessionTime] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "HH:mm"));
	const [checkedIn, setCheckedIn] = (0, import_react.useState)([]);
	const [expandedStudent, setExpandedStudent] = (0, import_react.useState)(null);
	const [sendWhatsApp, setSendWhatsApp] = (0, import_react.useState)(typeof window !== "undefined" ? localStorage.getItem("edufinance.checkinWhatsApp") === "true" : false);
	const [waTemplate, setWaTemplate] = (0, import_react.useState)("");
	const [tplOpen, setTplOpen] = (0, import_react.useState)(false);
	const [tplDraft, setTplDraft] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		try {
			setWaTemplate(localStorage.getItem(WA_TEMPLATE_KEY) ?? "");
		} catch {}
	}, []);
	function openTemplateEditor() {
		setTplDraft(waTemplate.trim() ? waTemplate : DEFAULT_WA_TEMPLATE);
		setTplOpen(true);
	}
	function saveTemplate() {
		const value = tplDraft.trim();
		setWaTemplate(value);
		try {
			if (value) localStorage.setItem(WA_TEMPLATE_KEY, value);
			else localStorage.removeItem(WA_TEMPLATE_KEY);
		} catch {}
		setTplOpen(false);
		toast.success("Mensagem de WhatsApp atualizada.");
	}
	const { data: students = [] } = useQuery({
		queryKey: ["pt-students-checkin", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_students").select("id,name,phone,status,goal,health_notes,notes,pt_payments(id,amount,payment_date,status,sessions_paid,reference_month,pt_plans(name,sessions_per_month))").eq("status", "active").is("deleted_at", null).order("name");
			if (scopeId) q = q.eq("user_id", scopeId);
			return (await q).data ?? [];
		},
		staleTime: 0,
		refetchOnWindowFocus: true
	});
	const { data: usedCounts = [] } = useQuery({
		queryKey: ["pt-sessions-used-counts", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_sessions").select("pt_payment_id").not("pt_payment_id", "is", null);
			if (scopeId) q = q.eq("user_id", scopeId);
			return (await q).data ?? [];
		}
	});
	const { data: todaySessions = [], refetch: refetchSessions } = useQuery({
		queryKey: [
			"pt-today-sessions",
			today,
			scopeKey
		],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_sessions").select("id,pt_student_id,session_time,duration_minutes,status,pt_students(name)").eq("session_date", today).order("session_time");
			if (scopeId) q = q.eq("user_id", scopeId);
			return (await q).data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
		return students.filter((s) => {
			const name = s.name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
			return !q || name.includes(q);
		});
	}, [students, search]);
	const alreadyCheckedInIds = (0, import_react.useMemo)(() => new Set(todaySessions.map((s) => s.pt_student_id)), [todaySessions]);
	const [duoModal, setDuoModal] = (0, import_react.useState)(null);
	const [soloDebitMode, setSoloDebitMode] = (0, import_react.useState)("package");
	const studentById = (0, import_react.useMemo)(() => new Map(students.map((s) => [s.id, s])), [students]);
	const balanceMap = (0, import_react.useMemo)(() => {
		const usedByPayment = /* @__PURE__ */ new Map();
		for (const row of usedCounts) {
			const pid = row.pt_payment_id;
			if (!pid) continue;
			usedByPayment.set(pid, (usedByPayment.get(pid) ?? 0) + 1);
		}
		const map = /* @__PURE__ */ new Map();
		for (const s of students) {
			const payments = [];
			for (const p of s.pt_payments ?? []) {
				if (p.status !== "paid") continue;
				const contracted = Number(p.pt_plans?.sessions_per_month ?? p.sessions_paid ?? 0) || 0;
				const used = usedByPayment.get(p.id) ?? 0;
				payments.push({
					id: p.id,
					payment_date: p.payment_date,
					reference_month: p.reference_month ?? null,
					planName: p.pt_plans?.name ?? null,
					contracted,
					used,
					remaining: Math.max(0, contracted - used)
				});
			}
			payments.sort((a, b) => a.payment_date < b.payment_date ? -1 : a.payment_date > b.payment_date ? 1 : 0);
			const contracted = payments.reduce((acc, p) => acc + p.contracted, 0);
			const used = payments.reduce((acc, p) => acc + p.used, 0);
			map.set(s.id, {
				contracted,
				used,
				remaining: Math.max(0, contracted - used),
				payments,
				packagesWithBalance: payments.filter((p) => p.remaining > 0 && p.contracted > 0)
			});
		}
		return map;
	}, [students, usedCounts]);
	const getEffectiveBalance = (studentId) => {
		const s = studentById.get(studentId);
		const selfBal = balanceMap.get(studentId);
		if (selfBal && selfBal.contracted > 0) return selfBal;
		const partnerId = s ? parseStudentPartner(s.notes).partnerId : null;
		if (partnerId) {
			const pBal = balanceMap.get(partnerId);
			const partner = studentById.get(partnerId);
			if (pBal && pBal.contracted > 0) return {
				...pBal,
				isShared: true,
				sharedPartnerName: partner?.name ?? "Parceiro(a)",
				sharedPartnerId: partnerId
			};
		}
		return selfBal ?? {
			contracted: 0,
			used: 0,
			remaining: 0,
			payments: [],
			packagesWithBalance: []
		};
	};
	function sendWaNotification(targetStudent, bal, chosen) {
		if (!targetStudent.phone) return;
		const dateLabel = (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
			weekday: "long",
			day: "2-digit",
			month: "long"
		});
		const timeLabel = sessionTime;
		const lines = [
			`Olá ${targetStudent.name}! ✅`,
			``,
			`Seu check-in foi registrado com sucesso!`,
			``,
			`📅 *Data:* ${dateLabel}`,
			`🕐 *Horário:* ${timeLabel}`
		];
		if (chosen && bal) {
			const totalRemainingAfter = Math.max(0, bal.remaining - 1);
			const usedAfter = chosen.used + 1;
			const otherRemaining = bal.packagesWithBalance.filter((p) => p.id !== chosen.id).reduce((acc, p) => acc + p.remaining, 0);
			const otherCount = bal.packagesWithBalance.filter((p) => p.id !== chosen.id && p.remaining > 0).length;
			const openPackages = bal.packagesWithBalance.length;
			lines.push(``);
			if (openPackages > 1) lines.push(`📦 *Saldo restante:* ${totalRemainingAfter} aula(s) em ${openPackages} pacote(s)`);
			else lines.push(`📦 *Saldo restante:* ${totalRemainingAfter} aula(s)`);
			lines.push(`   • ${usedAfter} de ${chosen.contracted} aulas utilizadas`);
			if (otherCount > 0) lines.push(`   • Outros pacotes em aberto: ${otherCount} pacote(s), ${otherRemaining} aula(s)`);
			if (totalRemainingAfter === 0) {
				lines.push(``);
				lines.push(`ℹ️ Check-in registrado, mas você está sem aulas em aberto. Fale com seu treinador para renovar.`);
			}
		} else {
			lines.push(``);
			if (bal && bal.contracted > 0 && bal.remaining === 0) lines.push(`ℹ️ Check-in registrado, mas você está sem aulas em aberto. Fale com seu treinador para renovar.`);
			else if (bal && bal.remaining > 0) {
				lines.push(`📦 *Saldo atual:* ${bal.remaining} aula(s)`);
				lines.push(`ℹ️ Check-in registrado com sucesso.`);
			} else lines.push(`ℹ️ Check-in registrado com sucesso.`);
		}
		lines.push(``);
		lines.push(`Bom treino! 💪`);
		const defaultMessage = lines.join("\n");
		const totalRemainingAfter = chosen && bal ? Math.max(0, bal.remaining - 1) : bal?.remaining ?? 0;
		const whatsappMessage = waTemplate.trim() ? applyTemplate(waTemplate, {
			aluno: targetStudent.name,
			data: dateLabel,
			hora: timeLabel,
			duracao: `${duration} min`,
			saldo: String(totalRemainingAfter),
			utilizadas: chosen ? String(chosen.used + 1) : "0",
			contratadas: chosen ? String(chosen.contracted) : "0",
			plano: chosen?.planName ?? ""
		}) : defaultMessage;
		const url = `https://wa.me/55${targetStudent.phone.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;
		window.open(url, "_blank");
	}
	async function promptGoogleCalendar(studentName) {
		if (localStorage.getItem("edufinance.gcalClientId")) {
			if (await confirmDialog(`Adicionar aula de ${studentName} ao Google Calendar?`)) addSessionToCalendar({
				studentName,
				sessionDate: today,
				sessionTime,
				durationMinutes: Number(duration)
			});
		}
	}
	function handleCheckinClick(student) {
		const { partnerId } = parseStudentPartner(student.notes);
		const partner = partnerId ? studentById.get(partnerId) : null;
		if (!partner) return executeSingleCheckin(student, true);
		const partnerCheckedIn = alreadyCheckedInIds.has(partner.id);
		const partnerSession = todaySessions.find((ts) => ts.pt_student_id === partner.id);
		setSoloDebitMode("package");
		setDuoModal({
			student,
			partner,
			partnerCheckedIn,
			partnerSession
		});
	}
	async function executeSingleCheckin(student, debitPackage) {
		setCheckingIn(student.id);
		try {
			const { data: userData } = await supabase.auth.getUser();
			const userId = userData.user?.id;
			if (!userId) throw new Error("Usuário não autenticado");
			const effBal = getEffectiveBalance(student.id);
			let chosenPaymentId = null;
			let chosenPkg = null;
			if (debitPackage) {
				const chosen = effBal.packagesWithBalance[0] ?? null;
				const latestPaid = [...student.pt_payments ?? []].filter((p) => p.status === "paid").sort((a, b) => a.payment_date < b.payment_date ? 1 : -1)[0];
				chosenPaymentId = chosen?.id ?? latestPaid?.id ?? null;
				chosenPkg = chosen;
			}
			const { data, error } = await supabase.from("pt_sessions").insert({
				user_id: userId,
				pt_student_id: student.id,
				pt_payment_id: chosenPaymentId,
				session_date: today,
				session_time: sessionTime + ":00",
				duration_minutes: Number(duration),
				status: "completed"
			}).select("id").single();
			if (error) throw error;
			const result = {
				studentId: student.id,
				studentName: student.name,
				sessionId: data.id,
				time: sessionTime,
				duration: Number(duration),
				status: "completed"
			};
			setCheckedIn((prev) => [result, ...prev]);
			const multiPackages = (effBal.packagesWithBalance.length ?? 0) > 1;
			toast.success(chosenPaymentId ? multiPackages && chosenPkg?.planName ? `✅ Check-in de ${student.name} — consumido do pacote ${chosenPkg.planName}` : `✅ Check-in de ${student.name} registrado!` : `✅ Check-in avulso de ${student.name} registrado (sem débito de pacote)!`);
			qc.invalidateQueries();
			refetchSessions();
			if (sendWhatsApp && student.phone) sendWaNotification(student, effBal, chosenPkg);
			else if (sendWhatsApp && !student.phone) toast.warning(`${student.name} não tem telefone cadastrado — WhatsApp não enviado.`);
			promptGoogleCalendar(student.name);
		} catch (err) {
			toast.error(`Erro: ${err.message}`);
		} finally {
			setCheckingIn(null);
			setDuoModal(null);
		}
	}
	async function executeDuoJointCheckin(student, partner) {
		setCheckingIn(student.id);
		try {
			const { data: userData } = await supabase.auth.getUser();
			const userId = userData.user?.id;
			if (!userId) throw new Error("Usuário não autenticado");
			const sBal = balanceMap.get(student.id);
			const pBal = balanceMap.get(partner.id);
			let payingStudent = student;
			let companionStudent = partner;
			let chosenPkg = sBal?.packagesWithBalance[0] ?? null;
			if (!chosenPkg && pBal?.packagesWithBalance[0]) {
				payingStudent = partner;
				companionStudent = student;
				chosenPkg = pBal.packagesWithBalance[0];
			}
			const chosenPaymentId = chosenPkg?.id ?? null;
			const { data: s1, error: e1 } = await supabase.from("pt_sessions").insert({
				user_id: userId,
				pt_student_id: payingStudent.id,
				pt_payment_id: chosenPaymentId,
				session_date: today,
				session_time: sessionTime + ":00",
				duration_minutes: Number(duration),
				performance_notes: `Treino em Dupla com ${companionStudent.name}`,
				status: "completed"
			}).select("id").single();
			if (e1) throw e1;
			const { data: s2, error: e2 } = await supabase.from("pt_sessions").insert({
				user_id: userId,
				pt_student_id: companionStudent.id,
				pt_payment_id: null,
				session_date: today,
				session_time: sessionTime + ":00",
				duration_minutes: Number(duration),
				performance_notes: `Treino em Dupla com ${payingStudent.name} (Sessão compartilhada)`,
				status: "completed"
			}).select("id").single();
			if (e2) throw e2;
			setCheckedIn((prev) => [
				{
					studentId: payingStudent.id,
					studentName: payingStudent.name,
					sessionId: s1.id,
					time: sessionTime,
					duration: Number(duration),
					status: "completed"
				},
				{
					studentId: companionStudent.id,
					studentName: companionStudent.name,
					sessionId: s2.id,
					time: sessionTime,
					duration: Number(duration),
					status: "completed"
				},
				...prev
			]);
			toast.success(`✅ Check-in de Dupla registrado! (${student.name} & ${partner.name}) — apenas 1 aula debitada do plano.`);
			qc.invalidateQueries();
			refetchSessions();
			if (sendWhatsApp) {
				if (student.phone) sendWaNotification(student, getEffectiveBalance(student.id), chosenPkg);
				if (partner.phone) toast.info(`Deseja enviar WhatsApp para ${partner.name}?`, {
					action: {
						label: "Enviar WhatsApp",
						onClick: () => sendWaNotification(partner, getEffectiveBalance(partner.id), chosenPkg)
					},
					duration: 8e3
				});
			}
			promptGoogleCalendar(`${student.name} e ${partner.name}`);
		} catch (err) {
			toast.error(`Erro no check-in em dupla: ${err.message}`);
		} finally {
			setCheckingIn(null);
			setDuoModal(null);
		}
	}
	async function executeLinkToExistingDuo(student, partner) {
		setCheckingIn(student.id);
		try {
			const { data: userData } = await supabase.auth.getUser();
			const userId = userData.user?.id;
			if (!userId) throw new Error("Usuário não autenticado");
			const { data, error } = await supabase.from("pt_sessions").insert({
				user_id: userId,
				pt_student_id: student.id,
				pt_payment_id: null,
				session_date: today,
				session_time: sessionTime + ":00",
				duration_minutes: Number(duration),
				performance_notes: `Treino em Dupla com ${partner.name} (Sessão vinculada)`,
				status: "completed"
			}).select("id").single();
			if (error) throw error;
			setCheckedIn((prev) => [{
				studentId: student.id,
				studentName: student.name,
				sessionId: data.id,
				time: sessionTime,
				duration: Number(duration),
				status: "completed"
			}, ...prev]);
			toast.success(`✅ Presença de ${student.name} vinculada ao treino da dupla (sem débito adicional)!`);
			qc.invalidateQueries();
			refetchSessions();
			if (sendWhatsApp && student.phone) sendWaNotification(student, getEffectiveBalance(student.id), null);
		} catch (err) {
			toast.error(`Erro: ${err.message}`);
		} finally {
			setCheckingIn(null);
			setDuoModal(null);
		}
	}
	async function undoCheckin(sessionId, studentName) {
		if (!await confirmDialog(`Desfazer check-in de ${studentName}?`)) return;
		const { error } = await supabase.from("pt_sessions").delete().eq("id", sessionId);
		if (error) return toast.error(error.message);
		setCheckedIn((prev) => prev.filter((c) => c.sessionId !== sessionId));
		toast.success("Check-in desfeito.");
		qc.invalidateQueries();
		refetchSessions();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: Zap,
				eyebrow: "Presença",
				title: "Check-in Rápido",
				description: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "capitalize",
					children: todayLabel
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Configurar aula"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Horário" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "time",
									value: sessionTime,
									onChange: (e) => setSessionTime(e.target.value),
									className: "h-9"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duração" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: duration,
									onValueChange: setDuration,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-9",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "45",
											children: "45 min"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "60",
											children: "60 min"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "90",
											children: "90 min"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg border p-3 col-span-2 sm:col-span-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "💬 Notificar via WhatsApp"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Envia mensagem automática ao aluno no check-in"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									role: "switch",
									"aria-checked": sendWhatsApp,
									"aria-label": "Alternar notificação via WhatsApp",
									onClick: () => {
										const next = !sendWhatsApp;
										setSendWhatsApp(next);
										localStorage.setItem("edufinance.checkinWhatsApp", String(next));
									},
									className: "relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${sendWhatsApp ? "bg-primary" : "bg-muted-foreground/30"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-background shadow-card transition-transform duration-200 ease-ui ${sendWhatsApp ? "translate-x-6" : "translate-x-1"}` })
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2 sm:col-span-1 flex items-center justify-between rounded-lg border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: "✏️ Texto da mensagem"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-xs text-muted-foreground",
										children: waTemplate.trim() ? "Modelo personalizado ativo" : "Usando o modelo padrão"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: openTemplateEditor,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-1.5 h-3.5 w-3.5" }), "Editar"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Todos os check-ins desta sessão usarão esses valores. Você pode ajustar individualmente depois na página do aluno."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: tplOpen,
				onOpenChange: setTplOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Editar mensagem do WhatsApp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Personalize o texto enviado ao aluno no check-in. Use as variáveis abaixo — elas são substituídas automaticamente." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: tplDraft,
							onChange: (e) => setTplDraft(e.target.value),
							rows: 12,
							className: "font-mono text-xs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: WA_VARS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: v.label,
								onClick: () => setTplDraft((t) => `${t}{{${v.key}}}`),
								className: "rounded-md border bg-muted/50 px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
								children: `{{${v.key}}}`
							}, v.key))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								onClick: () => setTplDraft(DEFAULT_WA_TEMPLATE),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1.5 h-3.5 w-3.5" }), "Restaurar padrão"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setTplOpen(false),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									onClick: saveTemplate,
									children: "Salvar mensagem"
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!duoModal,
				onOpenChange: (open) => !open && setDuoModal(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5 text-primary" }), "Treino em Dupla"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: duoModal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: duoModal.student.name }),
							" treina em dupla com",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: duoModal.partner.name }),
							". Como foi a presença de hoje?"
						] }) })] }),
						duoModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4 py-1",
							children: !duoModal.partnerCheckedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border-2 border-primary/30 bg-primary/5 p-4 space-y-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-semibold text-sm flex items-center gap-1.5 text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary" }), "Treinaram juntos hoje"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium",
											children: "Recomendado"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground leading-relaxed",
										children: [
											"Registra a presença e histórico para ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: duoModal.student.name }),
											" e",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: duoModal.partner.name }),
											", consumindo ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "apenas 1 aula" }),
											" do pacote compartilhado."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "w-full mt-1 font-medium gap-1.5",
										disabled: checkingIn !== null,
										onClick: () => executeDuoJointCheckin(duoModal.student, duoModal.partner),
										children: checkingIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), "Confirmar Check-in da Dupla (1 aula)"] })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border p-4 space-y-3 bg-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold text-sm flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-muted-foreground" }),
											"Apenas ",
											duoModal.student.name,
											" treinou hoje (Individual)"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"O parceiro (",
											duoModal.partner.name,
											") não compareceu. Registra a presença apenas de ",
											duoModal.student.name,
											"."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 pt-1 border-t border-border/50 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "radio",
												name: "soloDebitMode",
												checked: soloDebitMode === "package",
												onChange: () => setSoloDebitMode("package"),
												className: "text-primary"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Debitar 1 aula do plano da dupla (padrão)" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "radio",
												name: "soloDebitMode",
												checked: soloDebitMode === "free",
												onChange: () => setSoloDebitMode("free"),
												className: "text-primary"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Aula avulsa / reposição (sem debitar aula)" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "w-full",
										disabled: checkingIn !== null,
										onClick: () => executeSingleCheckin(duoModal.student, soloDebitMode === "package"),
										children: checkingIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : `Registrar Apenas ${duoModal.student.name}`
									})
								]
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-state-paid/30 bg-state-paid-soft p-3.5 text-xs space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-semibold text-state-paid flex items-center gap-1.5 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
												duoModal.partner.name,
												" já registrou check-in hoje!"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground",
											children: [
												duoModal.partnerSession?.session_time && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"Horário registrado: ",
													duoModal.partnerSession.session_time.slice(0, 5),
													". "
												] }),
												"Deseja vincular a presença de ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: duoModal.student.name }),
												" à mesma aula da dupla sem debitar outro crédito?"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "w-full gap-1.5",
										disabled: checkingIn !== null,
										onClick: () => executeLinkToExistingDuo(duoModal.student, duoModal.partner),
										children: checkingIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), "Vincular à sessão da dupla (Sem débito extra)"] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "w-full",
										disabled: checkingIn !== null,
										onClick: () => executeSingleCheckin(duoModal.student, true),
										children: "Registrar aula individual separada (Debita 1 aula)"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setDuoModal(null),
							children: "Cancelar"
						}) })
					]
				})
			}),
			todaySessions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-state-paid/25 bg-state-paid-soft p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-state-paid" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm font-semibold text-state-paid",
						children: [todaySessions.length, " aula(s) registrada(s) hoje"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: todaySessions.map((s) => {
						const localResult = checkedIn.find((c) => c.sessionId === s.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-xs shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3 text-state-paid" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: s.pt_students?.name
								}),
								s.session_time && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: s.session_time.slice(0, 5)
								}),
								localResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => undoCheckin(s.id, s.pt_students?.name),
									className: "ml-1 text-destructive hover:underline",
									children: "desfazer"
								})
							]
						}, s.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "search",
					inputMode: "search",
					placeholder: "Buscar aluno por nome...",
					className: "pl-9 h-11 text-base sm:text-sm",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					autoFocus: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "p-6 text-center text-sm text-muted-foreground",
					children: "Nenhum aluno ativo encontrado."
				}), filtered.map((s) => {
					const isCheckedIn = alreadyCheckedInIds.has(s.id);
					const isLoading = checkingIn === s.id;
					const isExpanded = expandedStudent === s.id;
					const latestPayment = [...s.pt_payments ?? []].filter((p) => p.status === "paid").sort((a, b) => a.payment_date < b.payment_date ? 1 : -1)[0];
					const planName = latestPayment?.pt_plans?.name;
					const sessionsPerMonth = latestPayment?.pt_plans?.sessions_per_month ?? latestPayment?.sessions_paid;
					const todayCount = todaySessions.filter((ts) => ts.pt_student_id === s.id).length;
					const bal = getEffectiveBalance(s.id);
					const nextPackage = bal?.packagesWithBalance[0] ?? null;
					const hasMultiplePackages = (bal?.packagesWithBalance.length ?? 0) > 1;
					const parsedPartner = parseStudentPartner(s.notes);
					const partner = parsedPartner.partnerId ? studentById.get(parsedPartner.partnerId) : null;
					const partnerCheckedIn = parsedPartner.partnerId ? alreadyCheckedInIds.has(parsedPartner.partnerId) : false;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3 transition-shadow duration-200 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold", isCheckedIn ? "bg-state-paid-soft text-state-paid" : "bg-primary/10 text-primary"),
									children: isCheckedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" }) : initials(s.name)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: s.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTStudentStatusBadge, { status: s.status }),
												partner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
														"Dupla: ",
														partner.name
													]
												}),
												partnerCheckedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400",
													children: "👥 Parceiro presente hoje"
												}),
												isCheckedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-full bg-state-paid-soft px-2 py-0.5 text-[10px] font-medium text-state-paid",
													children: [
														"✅ ",
														todayCount,
														" aula(s) hoje"
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 flex flex-wrap gap-2 text-xs text-muted-foreground",
											children: [
												planName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["📋 ", planName] }),
												sessionsPerMonth && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"🏃 ",
													sessionsPerMonth,
													" aulas/mês"
												] }),
												bal && bal.contracted > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													"aria-label": "Saldo total de aulas",
													children: [
														"💳 ",
														bal.remaining,
														"/",
														bal.contracted,
														" restantes",
														bal.isShared && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "ml-1 text-[11px] text-primary font-normal",
															children: [
																"(plano de ",
																bal.sharedPartnerName,
																")"
															]
														})
													]
												})
											]
										}),
										hasMultiplePackages && nextPackage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 text-[11px] leading-tight text-muted-foreground/90",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground/70",
													children: "Próximo check-in usa:"
												}),
												" ",
												nextPackage.planName ?? "pacote mais antigo",
												nextPackage.reference_month ? ` · ${nextPackage.reference_month}` : "",
												" · ",
												nextPackage.remaining,
												" aula(s) em aberto"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 sm:gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": isExpanded ? `Ocultar detalhes de ${s.name}` : `Ver detalhes de pacotes de ${s.name}`,
										onClick: () => setExpandedStudent(isExpanded ? null : s.id),
										className: "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-5 w-5 transition-transform duration-200", isExpanded && "rotate-180") })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: isCheckedIn ? "outline" : "default",
										disabled: isLoading,
										onClick: () => handleCheckinClick(s),
										className: cn("min-h-[44px] min-w-[105px] px-3 font-medium transition-all active:scale-[0.98]", isCheckedIn && "border-state-paid/30 text-state-paid hover:bg-state-paid-soft"),
										children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 animate-spin" }), " Registrando…"]
										}) : isCheckedIn ? "+ outra aula" : partner ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }), " Check-in"]
										}) : "✅ Check-in"
									})]
								})
							]
						}), isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-1 border-t pt-3 text-xs",
							children: [
								s.goal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: "🎯 Objetivo:"
									}),
									" ",
									s.goal
								] }),
								s.health_notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: "⚠️ Saúde/Restrições:"
									}),
									" ",
									s.health_notes
								] }),
								!s.goal && !s.health_notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground",
									children: "Sem objetivo ou observações de saúde registrados."
								})
							]
						})]
					}, s.id);
				})]
			})
		]
	});
}
//#endregion
export { CheckinPage as component };
