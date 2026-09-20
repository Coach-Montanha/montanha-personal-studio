import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as Shield, At as House, Bn as ArrowDownUp, E as Stethoscope, G as Plus, Ht as Eye, I as Settings2, Kt as Dumbbell, Mt as GripVertical, O as Sparkles, R as Search, Rt as FileSpreadsheet, T as Sun, Ut as EyeOff, V as RotateCcw, Xt as CreditCard, Yt as Database, Z as Pencil, Zt as Copy, _ as TriangleAlert, _t as LoaderCircle, at as Moon, b as Trash2, c as User, h as Upload, hn as Check, n as X, p as UserCog, qt as Download, s as Users, sn as CircleCheck, xt as LayoutTemplate } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as PageHeader } from "./PageHeader-CRue-aiN.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { t as EmptyState } from "./EmptyState-DK3vCNbs.mjs";
import { a as formatDateBR, i as formatBRL, n as billingCycleLabel, u as paymentMethodLabel } from "./format-BT-nao3-.mjs";
import { t as useAuth } from "./use-auth-ChcWg5G-.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as useRole, r as useScopeFilter, t as useProfileMode } from "./use-scope-filter-q5Imal9c.mjs";
import { n as LANDING_STORAGE_KEY, r as useLandingOptions, t as LANDING_REDIRECT_FLAG } from "./use-landing-page-CK5BT-cY.mjs";
import { t as SectionCard } from "./SectionCard-Dhxnzc2Q.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DT1SSYuq.mjs";
import { t as Checkbox } from "./checkbox-kt6FvQcE.mjs";
import { n as saveEmailSettings, t as getEmailSettings } from "./email.functions-fisjNvMQ.mjs";
import { n as usePaymentMethods, t as DEFAULT_PAYMENT_METHODS } from "./use-payment-methods-Ch_8GI_2.mjs";
import { n as useTheme } from "./use-theme-FNNvhyxv.mjs";
import { i as TABS, n as FONT_SIZE_PX, o as useFontSize, r as Route, t as FONT_SIZE_LABEL } from "./settings-C07t28M0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BNOglYWz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function sanitize(name) {
	return name.replace(/[[\]:*?/\\]/g, " ").slice(0, 31) || "Aluno";
}
function uniqueSheetName(existing, base) {
	let name = sanitize(base);
	let i = 2;
	while (existing.has(name)) {
		const suffix = ` (${i++})`;
		name = sanitize(base).slice(0, 31 - suffix.length) + suffix;
	}
	existing.add(name);
	return name;
}
function PerStudentExport() {
	const [kind, setKind] = (0, import_react.useState)("studio");
	const [search, setSearch] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data: studioStudents = [] } = useQuery({
		queryKey: ["export-studio-students"],
		queryFn: async () => {
			const { data, error } = await supabase.from("students").select("id,name,email,phone,status,notes,cpf,rg,birth_date,address,neighborhood,city,state,postal_code,country,start_date,created_at").is("deleted_at", null).order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: ptStudents = [] } = useQuery({
		queryKey: ["export-pt-students"],
		queryFn: async () => {
			const { data, error } = await supabase.from("pt_students").select("id,name,email,phone,status,notes,goal,health_notes,training_plan,birth_date,start_date,created_at").is("deleted_at", null).order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const list = kind === "studio" ? studioStudents : ptStudents;
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		if (!q) return list;
		return list.filter((s) => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
	}, [list, search]);
	function toggle(id, on) {
		setSelected((prev) => {
			const n = new Set(prev);
			if (on) n.add(id);
			else n.delete(id);
			return n;
		});
	}
	function toggleAll(on) {
		if (on) setSelected(new Set(filtered.map((s) => s.id)));
		else setSelected(/* @__PURE__ */ new Set());
	}
	async function exportSelected(mode) {
		const ids = mode === "all" ? list.map((s) => s.id) : [...selected];
		if (ids.length === 0) {
			toast.error("Selecione ao menos um aluno");
			return;
		}
		setBusy(true);
		try {
			const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
			const wb = XLSX.utils.book_new();
			const usedSheetNames = /* @__PURE__ */ new Set();
			const indexRows = ids.map((id) => list.find((s) => s.id === id)).filter(Boolean).map((s) => ({
				Nome: s.name,
				Email: s.email ?? "",
				Telefone: s.phone ?? "",
				Status: s.status
			}));
			XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(indexRows), "Índice");
			for (const id of ids) {
				const student = list.find((s) => s.id === id);
				if (!student) continue;
				let payments = [];
				let planHistory = [];
				if (kind === "studio") {
					const { data: pays } = await supabase.from("payments").select("amount,payment_date,due_date,reference_month,payment_method,status,notes,plans(name)").eq("student_id", id).is("deleted_at", null).order("payment_date", { ascending: false });
					payments = pays ?? [];
					const { data: hist } = await supabase.from("student_plan_history").select("start_date,end_date,is_current,plans(name)").eq("student_id", id).order("start_date", { ascending: false });
					planHistory = hist ?? [];
				} else {
					const { data: pays } = await supabase.from("pt_payments").select("amount,payment_date,due_date,reference_month,payment_method,status,sessions_paid,notes,pt_plans(name)").eq("pt_student_id", id).is("deleted_at", null).order("payment_date", { ascending: false });
					payments = pays ?? [];
				}
				const sections = [];
				sections.push(["DADOS PESSOAIS"]);
				const s = student;
				const personalRows = kind === "studio" ? [
					["Nome", s.name],
					["Email", s.email ?? ""],
					["Telefone", s.phone ?? ""],
					["CPF", s.cpf ?? ""],
					["RG", s.rg ?? ""],
					["Nascimento", s.birth_date ?? ""],
					["Endereço", s.address ?? ""],
					["Bairro", s.neighborhood ?? ""],
					["Cidade", s.city ?? ""],
					["Estado", s.state ?? ""],
					["CEP", s.postal_code ?? ""],
					["País", s.country ?? ""],
					["Início", s.start_date ?? ""],
					["Status", s.status],
					["Objetivo", s.goal ?? ""],
					["Notas de saúde", s.health_notes ?? ""],
					["Plano de treino", s.training_plan ?? ""],
					["Observações", s.notes ?? ""],
					["Criado em", s.created_at ?? ""]
				] : [
					["Nome", s.name],
					["Email", s.email ?? ""],
					["Telefone", s.phone ?? ""],
					["Nascimento", s.birth_date ?? ""],
					["Início", s.start_date ?? ""],
					["Status", s.status],
					["Objetivo", s.goal ?? ""],
					["Notas de saúde", s.health_notes ?? ""],
					["Plano de treino", s.training_plan ?? ""],
					["Observações", s.notes ?? ""],
					["Criado em", s.created_at ?? ""]
				];
				for (const [k, v] of personalRows) sections.push([k, v]);
				sections.push([]);
				sections.push(["PAGAMENTOS"]);
				if (kind === "studio") {
					sections.push([
						"Data",
						"Vencimento",
						"Mês Ref.",
						"Plano",
						"Valor",
						"Método",
						"Status",
						"Notas"
					]);
					for (const p of payments) sections.push([
						p.payment_date,
						p.due_date ?? "",
						p.reference_month ?? "",
						p.plans?.name ?? "",
						Number(p.amount),
						paymentMethodLabel(p.payment_method),
						p.status,
						p.notes ?? ""
					]);
					const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
					sections.push([]);
					sections.push([
						"Total pago",
						"",
						"",
						"",
						totalPaid
					]);
					sections.push([]);
					sections.push(["HISTÓRICO DE PLANOS"]);
					sections.push([
						"Início",
						"Fim",
						"Atual",
						"Plano"
					]);
					for (const h of planHistory) sections.push([
						h.start_date,
						h.end_date ?? "",
						h.is_current ? "Sim" : "Não",
						h.plans?.name ?? ""
					]);
				} else {
					sections.push([
						"Data",
						"Vencimento",
						"Mês Ref.",
						"Plano",
						"Valor",
						"Sessões pagas",
						"Método",
						"Status",
						"Notas"
					]);
					for (const p of payments) sections.push([
						p.payment_date,
						p.due_date ?? "",
						p.reference_month ?? "",
						p.pt_plans?.name ?? "",
						Number(p.amount),
						p.sessions_paid ?? "",
						paymentMethodLabel(p.payment_method),
						p.status,
						p.notes ?? ""
					]);
					const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
					sections.push([]);
					sections.push([
						"Total pago",
						"",
						"",
						"",
						totalPaid
					]);
				}
				const ws = XLSX.utils.aoa_to_sheet(sections);
				const sheetName = uniqueSheetName(usedSheetNames, s.name);
				XLSX.utils.book_append_sheet(wb, ws, sheetName);
			}
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const prefix = kind === "studio" ? "alunos_studio" : "alunos_pt";
			XLSX.writeFile(wb, `edufinance_${prefix}_individual_${today}.xlsx`);
			toast.success(`${ids.length} aluno(s) exportado(s)`);
		} catch (e) {
			toast.error(e?.message ?? "Erro ao exportar");
		} finally {
			setBusy(false);
		}
	}
	const allChecked = filtered.length > 0 && filtered.every((s) => selected.has(s.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold",
					children: "Exportar alunos individualmente"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Gera um arquivo Excel com uma aba por aluno, contendo dados pessoais, pagamentos e histórico."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: kind === "studio" ? "default" : "outline",
					onClick: () => {
						setKind("studio");
						setSelected(/* @__PURE__ */ new Set());
					},
					children: "Studio"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: kind === "pt" ? "default" : "outline",
					onClick: () => {
						setKind("pt");
						setSelected(/* @__PURE__ */ new Set());
					},
					children: "Personal Trainer"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Buscar aluno…",
					className: "h-10 pl-9",
					value: search,
					onChange: (e) => setSearch(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: allChecked,
						onCheckedChange: (v) => toggleAll(!!v),
						"aria-label": "Selecionar todos filtrados"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Selecionar todos (",
						filtered.length,
						")"
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground",
					children: [selected.size, " selecionado(s)"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 max-h-72 overflow-auto rounded-lg border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "divide-y",
					children: [filtered.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2 p-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: selected.has(s.id),
								onCheckedChange: (v) => toggle(s.id, !!v),
								"aria-label": `Selecionar ${s.name}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate font-medium",
								children: s.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-auto truncate text-xs text-muted-foreground",
								children: s.email ?? ""
							})
						]
					}, s.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "p-3 text-sm text-muted-foreground",
						children: "Nenhum aluno encontrado"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => exportSelected("selected"),
					disabled: busy || selected.size === 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4" }),
						"Exportar selecionados (",
						selected.size,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => exportSelected("all"),
					disabled: busy || list.length === 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4" }),
						"Exportar todos (",
						list.length,
						")"
					]
				})]
			})
		]
	});
}
var headerMap = {
	nome: "name",
	name: "name",
	email: "email",
	telefone: "phone",
	phone: "phone",
	status: "status",
	notas: "notes",
	notes: "notes",
	plano: "plan_name",
	plan: "plan_name",
	plan_name: "plan_name",
	inicio: "start_date",
	start_date: "start_date",
	cpf: "cpf",
	rg: "rg",
	nascimento: "birth_date",
	data_nascimento: "birth_date",
	birth_date: "birth_date",
	endereco: "address",
	address: "address",
	bairro: "neighborhood",
	neighborhood: "neighborhood",
	cidade: "city",
	city: "city",
	estado: "state",
	uf: "state",
	state: "state",
	cep: "postal_code",
	codigo_postal: "postal_code",
	postal_code: "postal_code",
	pais: "country",
	country: "country",
	objetivo: "goal",
	goal: "goal",
	saude: "health_notes",
	notas_saude: "health_notes",
	health_notes: "health_notes",
	plano_treino: "training_plan",
	training_plan: "training_plan",
	aluno: "student_name",
	student_name: "student_name",
	valor: "amount",
	amount: "amount",
	data: "payment_date",
	data_pagamento: "payment_date",
	payment_date: "payment_date",
	vencimento: "due_date",
	due_date: "due_date",
	mes_ref: "reference_month",
	mes_referencia: "reference_month",
	reference_month: "reference_month",
	metodo: "payment_method",
	forma_pagamento: "payment_method",
	payment_method: "payment_method",
	sessoes_pagas: "sessions_paid",
	sessions_paid: "sessions_paid",
	nome_plano: "name",
	plan_price: "price",
	preco: "price",
	price: "price",
	ciclo: "billing_cycle",
	billing_cycle: "billing_cycle",
	ciclo_cobranca: "billing_cycle",
	descricao: "description",
	description: "description",
	ativo: "is_active",
	is_active: "is_active",
	tipo_cobranca: "billing_type",
	billing_type: "billing_type",
	preco_mensal: "price_per_month",
	price_per_month: "price_per_month",
	preco_sessao: "price_per_session",
	price_per_session: "price_per_session",
	preco_pacote: "package_price",
	package_price: "package_price",
	sessoes_pacote: "package_sessions",
	package_sessions: "package_sessions",
	sessoes_mes: "sessions_per_month",
	sessions_per_month: "sessions_per_month"
};
var norm = (s) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, "_");
function parseDate(v) {
	if (!v) return null;
	if (v instanceof Date) return v.toISOString().slice(0, 10);
	const s = String(v).trim();
	const br = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
	if (br) {
		let y = Number(br[3]);
		if (y < 100) y += 2e3;
		return `${y}-${br[2].padStart(2, "0")}-${br[1].padStart(2, "0")}`;
	}
	if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
	if (/^\d+(\.\d+)?$/.test(s)) {
		const num = Number(s);
		if (num > 0) {
			const date = new Date(Math.round((num - 25569) * 86400 * 1e3));
			if (!isNaN(date.getTime())) return date.toISOString().slice(0, 10);
		}
	}
	return null;
}
function parseMonth(v) {
	if (!v) return null;
	const s = String(v).trim();
	const m = s.match(/^(\d{1,2})\/(\d{4})$/);
	if (m) return `${m[2]}-${m[1].padStart(2, "0")}`;
	if (/^\d{4}-\d{2}$/.test(s)) return s;
	if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 7);
	return null;
}
var methodMap = {
	pix: "pix",
	"cartao_de_credito": "credit_card",
	"credito": "credit_card",
	"cartao_de_debito": "debit_card",
	"debito": "debit_card",
	boleto: "bank_slip",
	dinheiro: "cash",
	transferencia: "transfer"
};
var statusMap = {
	pago: "paid",
	pendente: "pending",
	atrasado: "overdue",
	cancelado: "cancelled",
	ativo: "active",
	congelado: "paused",
	trancado: "paused",
	inativo: "inactive"
};
var billingCycleMap = {
	mensal: "monthly",
	monthly: "monthly",
	trimestral: "quarterly",
	quarterly: "quarterly",
	semestral: "semiannual",
	semiannual: "semiannual",
	anual: "annual",
	annual: "annual"
};
function DataTransferPanel() {
	const qc = useQueryClient();
	const [importType, setImportType] = (0, import_react.useState)("payments");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [fullReportData, setFullReportData] = (0, import_react.useState)(null);
	const [errors, setErrors] = (0, import_react.useState)([]);
	const [imported, setImported] = (0, import_react.useState)(null);
	const { data: students = [] } = useQuery({
		queryKey: ["students-all"],
		queryFn: async () => {
			let all = [];
			let from = 0;
			let pages = 0;
			while (pages < 20) {
				pages++;
				const { data, error } = await supabase.from("students").select("id,name,email,phone,status,notes,cpf,rg,birth_date,address,neighborhood,city,state,postal_code,country,start_date,created_at").is("deleted_at", null).order("name").range(from, from + 999);
				if (error) break;
				all = all.concat(data ?? []);
				if (!data || data.length < 1e3) break;
				from += 1e3;
			}
			return all;
		}
	});
	const { data: plans = [] } = useQuery({
		queryKey: ["plans-all"],
		queryFn: async () => {
			const { data } = await supabase.from("plans").select("id,name,price,billing_cycle,description,is_active");
			return data ?? [];
		}
	});
	const { data: payments = [] } = useQuery({
		queryKey: ["payments-export"],
		queryFn: async () => {
			let all = [];
			let from = 0;
			let pages = 0;
			while (pages < 20) {
				pages++;
				const { data, error } = await supabase.from("payments").select("amount,payment_date,due_date,reference_month,payment_method,status,notes,students!payments_student_id_fkey(name),plans(name)").is("deleted_at", null).order("payment_date", { ascending: false }).range(from, from + 999);
				if (error) break;
				all = all.concat(data ?? []);
				if (!data || data.length < 1e3) break;
				from += 1e3;
			}
			return all;
		}
	});
	const { data: ptStudents = [] } = useQuery({
		queryKey: ["pt-students-all"],
		queryFn: async () => {
			let all = [];
			let from = 0;
			let pages = 0;
			while (pages < 20) {
				pages++;
				const { data, error } = await supabase.from("pt_students").select("id,name,email,phone,status,notes,goal,health_notes,training_plan,birth_date,start_date,created_at").is("deleted_at", null).order("name").range(from, from + 999);
				if (error) break;
				all = all.concat(data ?? []);
				if (!data || data.length < 1e3) break;
				from += 1e3;
			}
			return all;
		}
	});
	const { data: ptPlans = [] } = useQuery({
		queryKey: ["pt-plans-all"],
		queryFn: async () => {
			const { data } = await supabase.from("pt_plans").select("id,name,description,billing_type,price_per_month,price_per_session,package_price,package_sessions,sessions_per_month,is_active");
			return data ?? [];
		}
	});
	const { data: ptPayments = [] } = useQuery({
		queryKey: ["pt-payments-export"],
		queryFn: async () => {
			let all = [];
			let from = 0;
			let pages = 0;
			while (pages < 20) {
				pages++;
				const { data, error } = await supabase.from("pt_payments").select("amount,payment_date,due_date,reference_month,payment_method,status,sessions_paid,notes,pt_students!pt_payments_pt_student_id_fkey(name),pt_plans(name)").is("deleted_at", null).order("payment_date", { ascending: false }).range(from, from + 999);
				if (error) break;
				all = all.concat(data ?? []);
				if (!data || data.length < 1e3) break;
				from += 1e3;
			}
			return all;
		}
	});
	const mapRawRows = (rawRows) => {
		return rawRows.map((row) => {
			const out = {};
			for (const [k, v] of Object.entries(row)) {
				const key = headerMap[norm(k)] ?? norm(k);
				out[key] = v;
			}
			return out;
		});
	};
	async function handleFile(file) {
		const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = new Uint8Array(e.target?.result);
			const wb = XLSX.read(data, { type: "array" });
			if (importType === "full_report" || wb.SheetNames.length > 1) {
				const parsedReport = {};
				for (const sheetName of wb.SheetNames) {
					const normName = norm(sheetName);
					const ws = wb.Sheets[sheetName];
					const mapped = mapRawRows(XLSX.utils.sheet_to_json(ws, { defval: null }));
					if (normName.includes("pagamento") && normName.includes("pt")) parsedReport.pt_payments = mapped;
					else if (normName.includes("plano") && normName.includes("pt")) parsedReport.pt_plans = mapped;
					else if (normName.includes("aluno") && normName.includes("pt")) parsedReport.pt_students = mapped;
					else if (normName.includes("pagamento")) parsedReport.payments = mapped;
					else if (normName.includes("plano")) parsedReport.plans = mapped;
					else if (normName.includes("aluno")) parsedReport.students = mapped;
				}
				setFullReportData(parsedReport);
				setRows([]);
				if (importType !== "full_report") setImportType("full_report");
			} else {
				const ws = wb.Sheets[wb.SheetNames[0]];
				setRows(mapRawRows(XLSX.utils.sheet_to_json(ws, { defval: null })));
				setFullReportData(null);
			}
			setErrors([]);
			setImported(null);
		};
		reader.readAsArrayBuffer(file);
	}
	async function importPlansRows(userId, targetRows, errs) {
		let ok = 0;
		for (let i = 0; i < targetRows.length; i++) {
			const r = targetRows[i];
			if (!r.name) {
				errs.push(`Planos [Linha ${i + 2}]: nome do plano ausente`);
				continue;
			}
			const price = Number(r.price);
			if (isNaN(price)) {
				errs.push(`Planos [Linha ${i + 2}]: preço inválido`);
				continue;
			}
			const billing_cycle = billingCycleMap[r.billing_cycle ? norm(String(r.billing_cycle)) : "monthly"] ?? "monthly";
			const isActiveRaw = r.is_active;
			const is_active = isActiveRaw === void 0 || isActiveRaw === null ? true : [
				"true",
				"1",
				"sim",
				"ativo",
				true,
				1
			].includes(typeof isActiveRaw === "string" ? isActiveRaw.toLowerCase() : isActiveRaw);
			const { error } = await supabase.from("plans").insert({
				user_id: userId,
				name: String(r.name),
				price,
				billing_cycle,
				description: r.description ? String(r.description) : null,
				is_active
			});
			if (error) errs.push(`Planos [Linha ${i + 2}]: ${error.message}`);
			else ok++;
		}
		return ok;
	}
	async function importStudentsRows(userId, targetRows, errs) {
		let ok = 0;
		for (let i = 0; i < targetRows.length; i++) {
			const r = targetRows[i];
			if (!r.name) {
				errs.push(`Alunos [Linha ${i + 2}]: nome ausente`);
				continue;
			}
			const { error } = await supabase.from("students").insert({
				user_id: userId,
				name: String(r.name),
				email: r.email ? String(r.email) : null,
				phone: r.phone ? String(r.phone) : null,
				status: r.status ? statusMap[norm(String(r.status))] ?? String(r.status) : "active",
				notes: r.notes ? String(r.notes) : null,
				cpf: r.cpf ? String(r.cpf) : null,
				rg: r.rg ? String(r.rg) : null,
				birth_date: parseDate(r.birth_date),
				address: r.address ? String(r.address) : null,
				neighborhood: r.neighborhood ? String(r.neighborhood) : null,
				city: r.city ? String(r.city) : null,
				state: r.state ? String(r.state) : null,
				postal_code: r.postal_code ? String(r.postal_code) : null,
				country: r.country ? String(r.country) : null,
				start_date: parseDate(r.start_date)
			});
			if (error) errs.push(`Alunos [Linha ${i + 2}]: ${error.message}`);
			else ok++;
		}
		return ok;
	}
	async function importPaymentsRows(userId, targetRows, errs) {
		let ok = 0;
		const studentByName = new Map(students.map((s) => [s.name.toLowerCase(), s.id]));
		const planByName = new Map(plans.map((p) => [p.name.toLowerCase(), p.id]));
		for (let i = 0; i < targetRows.length; i++) {
			const r = targetRows[i];
			const name = r.student_name ?? r.name;
			if (!name) {
				errs.push(`Pagamentos [Linha ${i + 2}]: aluno ausente`);
				continue;
			}
			const amount = Number(r.amount);
			if (isNaN(amount)) {
				errs.push(`Pagamentos [Linha ${i + 2}]: valor inválido`);
				continue;
			}
			const pd = parseDate(r.payment_date) ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const rm = parseMonth(r.reference_month) ?? pd.slice(0, 7);
			const key = String(name).toLowerCase();
			let studentId = studentByName.get(key);
			if (!studentId) {
				const { data, error } = await supabase.from("students").insert({
					user_id: userId,
					name: String(name)
				}).select("id").single();
				if (error) {
					errs.push(`Pagamentos [Linha ${i + 2}]: ${error.message}`);
					continue;
				}
				studentId = data.id;
				studentByName.set(key, studentId);
			}
			const planId = r.plan_name ? planByName.get(String(r.plan_name).toLowerCase()) ?? null : null;
			const methodRaw = r.payment_method ? norm(String(r.payment_method)) : "pix";
			const method = methodMap[methodRaw] ?? methodRaw;
			const statusRaw = r.status ? norm(String(r.status)) : "paid";
			const status = statusMap[statusRaw] ?? statusRaw;
			const { error } = await supabase.from("payments").insert({
				user_id: userId,
				student_id: studentId,
				plan_id: planId,
				amount,
				payment_date: pd,
				reference_month: rm,
				due_date: parseDate(r.due_date),
				payment_method: method,
				status,
				notes: r.notes ? String(r.notes) : null
			});
			if (error) errs.push(`Pagamentos [Linha ${i + 2}]: ${error.message}`);
			else ok++;
		}
		return ok;
	}
	async function importPTPlansRows(userId, targetRows, errs) {
		let ok = 0;
		for (let i = 0; i < targetRows.length; i++) {
			const r = targetRows[i];
			if (!r.name) {
				errs.push(`Planos PT [Linha ${i + 2}]: nome ausente`);
				continue;
			}
			const isActiveRaw = r.is_active;
			const is_active = isActiveRaw === void 0 || isActiveRaw === null ? true : [
				"true",
				"1",
				"sim",
				"ativo",
				true,
				1
			].includes(typeof isActiveRaw === "string" ? isActiveRaw.toLowerCase() : isActiveRaw);
			const { error } = await supabase.from("pt_plans").insert({
				user_id: userId,
				name: String(r.name),
				description: r.description ? String(r.description) : null,
				billing_type: r.billing_type ? String(r.billing_type) : "monthly",
				price_per_month: r.price_per_month ? Number(r.price_per_month) : null,
				price_per_session: r.price_per_session ? Number(r.price_per_session) : null,
				package_price: r.package_price ? Number(r.package_price) : null,
				package_sessions: r.package_sessions ? Number(r.package_sessions) : null,
				sessions_per_month: r.sessions_per_month ? Number(r.sessions_per_month) : null,
				is_active
			});
			if (error) errs.push(`Planos PT [Linha ${i + 2}]: ${error.message}`);
			else ok++;
		}
		return ok;
	}
	async function importPTStudentsRows(userId, targetRows, errs) {
		let ok = 0;
		for (let i = 0; i < targetRows.length; i++) {
			const r = targetRows[i];
			if (!r.name) {
				errs.push(`Alunos PT [Linha ${i + 2}]: nome ausente`);
				continue;
			}
			const { error } = await supabase.from("pt_students").insert({
				user_id: userId,
				name: String(r.name),
				email: r.email ? String(r.email) : null,
				phone: r.phone ? String(r.phone) : null,
				status: r.status ? statusMap[norm(String(r.status))] ?? String(r.status) : "active",
				goal: r.goal ? String(r.goal) : null,
				health_notes: r.health_notes ? String(r.health_notes) : null,
				training_plan: r.training_plan ? String(r.training_plan) : null,
				birth_date: parseDate(r.birth_date),
				start_date: parseDate(r.start_date),
				notes: r.notes ? String(r.notes) : null
			});
			if (error) errs.push(`Alunos PT [Linha ${i + 2}]: ${error.message}`);
			else ok++;
		}
		return ok;
	}
	async function importPTPaymentsRows(userId, targetRows, errs) {
		let ok = 0;
		const ptStudentByName = new Map(ptStudents.map((s) => [s.name.toLowerCase(), s.id]));
		const ptPlanByName = new Map(ptPlans.map((p) => [p.name.toLowerCase(), p.id]));
		for (let i = 0; i < targetRows.length; i++) {
			const r = targetRows[i];
			const name = r.student_name ?? r.name;
			if (!name) {
				errs.push(`Pagamentos PT [Linha ${i + 2}]: aluno ausente`);
				continue;
			}
			const amount = Number(r.amount);
			if (isNaN(amount)) {
				errs.push(`Pagamentos PT [Linha ${i + 2}]: valor inválido`);
				continue;
			}
			const pd = parseDate(r.payment_date) ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const rm = parseMonth(r.reference_month) ?? pd.slice(0, 7);
			const key = String(name).toLowerCase();
			let ptStudentId = ptStudentByName.get(key);
			if (!ptStudentId) {
				const { data, error } = await supabase.from("pt_students").insert({
					user_id: userId,
					name: String(name)
				}).select("id").single();
				if (error) {
					errs.push(`Pagamentos PT [Linha ${i + 2}]: ${error.message}`);
					continue;
				}
				ptStudentId = data.id;
				ptStudentByName.set(key, ptStudentId);
			}
			const ptPlanId = r.plan_name ? ptPlanByName.get(String(r.plan_name).toLowerCase()) ?? null : null;
			const methodRaw = r.payment_method ? norm(String(r.payment_method)) : "pix";
			const method = methodMap[methodRaw] ?? methodRaw;
			const statusRaw = r.status ? norm(String(r.status)) : "paid";
			const status = statusMap[statusRaw] ?? statusRaw;
			const { error } = await supabase.from("pt_payments").insert({
				user_id: userId,
				pt_student_id: ptStudentId,
				pt_plan_id: ptPlanId,
				amount,
				payment_date: pd,
				due_date: parseDate(r.due_date),
				reference_month: rm,
				sessions_paid: r.sessions_paid ? Number(r.sessions_paid) : null,
				payment_method: method,
				status,
				notes: r.notes ? String(r.notes) : null
			});
			if (error) errs.push(`Pagamentos PT [Linha ${i + 2}]: ${error.message}`);
			else ok++;
		}
		return ok;
	}
	async function confirmImport() {
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		const errs = [];
		let okCount = 0;
		if (importType === "full_report" && fullReportData) {
			if (fullReportData.plans?.length) okCount += await importPlansRows(userId, fullReportData.plans, errs);
			if (fullReportData.students?.length) okCount += await importStudentsRows(userId, fullReportData.students, errs);
			if (fullReportData.payments?.length) okCount += await importPaymentsRows(userId, fullReportData.payments, errs);
			if (fullReportData.pt_plans?.length) okCount += await importPTPlansRows(userId, fullReportData.pt_plans, errs);
			if (fullReportData.pt_students?.length) okCount += await importPTStudentsRows(userId, fullReportData.pt_students, errs);
			if (fullReportData.pt_payments?.length) okCount += await importPTPaymentsRows(userId, fullReportData.pt_payments, errs);
		} else if (importType === "plans") okCount = await importPlansRows(userId, rows, errs);
		else if (importType === "students") okCount = await importStudentsRows(userId, rows, errs);
		else if (importType === "payments") okCount = await importPaymentsRows(userId, rows, errs);
		else if (importType === "pt_plans") okCount = await importPTPlansRows(userId, rows, errs);
		else if (importType === "pt_students") okCount = await importPTStudentsRows(userId, rows, errs);
		else if (importType === "pt_payments") okCount = await importPTPaymentsRows(userId, rows, errs);
		setErrors(errs);
		setImported(okCount);
		qc.invalidateQueries();
		if (okCount) toast.success(`${okCount} registro(s) importado(s) com sucesso! 🎉`);
		if (errs.length) toast.error(`${errs.length} erro(s) durante a importação.`);
	}
	async function downloadTemplate(kind) {
		const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
		const wb = XLSX.utils.book_new();
		if (kind === "full_report") {
			XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{
				student_name: "João Silva",
				plan_name: "Mensal Basic",
				amount: 99.9,
				payment_date: "01/03/2026",
				reference_month: "03/2026",
				payment_method: "pix",
				status: "pago",
				notes: ""
			}]), "Pagamentos");
			XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{
				name: "João Silva",
				email: "joao@example.com",
				phone: "11999990000",
				cpf: "000.000.000-00",
				rg: "",
				birth_date: "15/05/1990",
				address: "Rua A, 123",
				neighborhood: "Centro",
				city: "São Paulo",
				state: "SP",
				postal_code: "01000-000",
				country: "Brasil",
				start_date: "01/03/2026",
				status: "active",
				notes: ""
			}]), "Alunos");
			XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{
				name: "Mensal Basic",
				price: 99.9,
				billing_cycle: "mensal",
				description: "Plano mensal padrão",
				is_active: true
			}]), "Planos");
			XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{
				name: "Maria Santos",
				email: "maria@example.com",
				phone: "11988887777",
				goal: "Hipertrofia",
				health_notes: "Nenhuma",
				training_plan: "Treino A/B",
				birth_date: "20/10/1995",
				start_date: "01/03/2026",
				status: "active",
				notes: ""
			}]), "Alunos PT");
			XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{
				student_name: "Maria Santos",
				plan_name: "Personal 12 Sessoes",
				amount: 450,
				payment_date: "01/03/2026",
				due_date: "01/04/2026",
				reference_month: "03/2026",
				sessions_paid: 12,
				payment_method: "pix",
				status: "pago",
				notes: ""
			}]), "Pagamentos PT");
			XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{
				name: "Personal 12 Sessoes",
				description: "Pacote 12 Aulas",
				billing_type: "package",
				price_per_month: "",
				price_per_session: 37.5,
				package_price: 450,
				package_sessions: 12,
				sessions_per_month: "",
				is_active: true
			}]), "Planos PT");
			XLSX.writeFile(wb, `edufinance_template_backup_completo.xlsx`);
			return;
		}
		const data = kind === "payments" ? [{
			student_name: "João Silva",
			plan_name: "Mensal Basic",
			amount: 99.9,
			payment_date: "01/03/2026",
			reference_month: "03/2026",
			payment_method: "pix",
			status: "pago",
			notes: ""
		}] : kind === "students" ? [{
			name: "João Silva",
			email: "joao@example.com",
			phone: "11999990000",
			cpf: "000.000.000-00",
			rg: "",
			birth_date: "15/05/1990",
			address: "Rua A, 123",
			neighborhood: "Centro",
			city: "São Paulo",
			state: "SP",
			postal_code: "01000-000",
			country: "Brasil",
			start_date: "01/03/2026",
			status: "active",
			notes: ""
		}] : kind === "plans" ? [{
			name: "Mensal Pro",
			price: 250,
			billing_cycle: "mensal",
			description: "Plano mensal completo",
			is_active: true
		}] : kind === "pt_students" ? [{
			name: "Maria Santos",
			email: "maria@example.com",
			phone: "11988887777",
			goal: "Hipertrofia",
			health_notes: "Sem restrições",
			training_plan: "ABC",
			birth_date: "20/10/1995",
			start_date: "01/03/2026",
			status: "active",
			notes: ""
		}] : kind === "pt_payments" ? [{
			student_name: "Maria Santos",
			plan_name: "Personal 12 Sessoes",
			amount: 450,
			payment_date: "01/03/2026",
			due_date: "01/04/2026",
			reference_month: "03/2026",
			sessions_paid: 12,
			payment_method: "pix",
			status: "pago",
			notes: ""
		}] : [{
			name: "Personal 12 Sessoes",
			description: "Pacote 12 Aulas",
			billing_type: "package",
			price_per_month: "",
			price_per_session: 37.5,
			package_price: 450,
			package_sessions: 12,
			sessions_per_month: "",
			is_active: true
		}];
		const ws = XLSX.utils.json_to_sheet(data);
		XLSX.utils.book_append_sheet(wb, ws, kind);
		XLSX.writeFile(wb, `edufinance_template_${kind}.xlsx`);
	}
	async function exportPlans() {
		const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
		const data = plans.map((p) => ({
			Nome: p.name,
			Preco: Number(p.price),
			Ciclo: billingCycleLabel(p.billing_cycle),
			Descricao: p.description ?? "",
			Ativo: p.is_active ? "Sim" : "Não"
		}));
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Planos");
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		XLSX.writeFile(wb, `edufinance_planos_${today}.xlsx`);
	}
	async function exportPayments() {
		const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
		const data = payments.map((p) => ({
			Aluno: p.students?.name ?? "",
			Plano: p.plans?.name ?? "",
			Valor: Number(p.amount),
			Data_Pagamento: p.payment_date,
			Vencimento: p.due_date ?? "",
			Mes_Referencia: p.reference_month,
			Metodo: paymentMethodLabel(p.payment_method),
			Status: p.status,
			Notas: p.notes ?? ""
		}));
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Pagamentos");
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		XLSX.writeFile(wb, `edufinance_pagamentos_${today}.xlsx`);
	}
	async function exportStudents() {
		const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
		const data = students.map((s) => ({
			Nome: s.name,
			Email: s.email ?? "",
			Telefone: s.phone ?? "",
			CPF: s.cpf ?? "",
			RG: s.rg ?? "",
			Nascimento: s.birth_date ?? "",
			Endereco: s.address ?? "",
			Bairro: s.neighborhood ?? "",
			Cidade: s.city ?? "",
			Estado: s.state ?? "",
			CEP: s.postal_code ?? "",
			Pais: s.country ?? "",
			Inicio: s.start_date ?? "",
			Status: s.status,
			Notas: s.notes ?? "",
			Criado_em: s.created_at
		}));
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Alunos");
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		XLSX.writeFile(wb, `edufinance_alunos_${today}.xlsx`);
	}
	async function exportPTStudents() {
		const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
		const data = ptStudents.map((s) => ({
			Nome: s.name,
			Email: s.email ?? "",
			Telefone: s.phone ?? "",
			Status: s.status,
			Objetivo: s.goal ?? "",
			Saude: s.health_notes ?? "",
			Plano_Treino: s.training_plan ?? "",
			Nascimento: s.birth_date ?? "",
			Inicio: s.start_date ?? "",
			Notas: s.notes ?? "",
			Criado_em: s.created_at
		}));
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Alunos PT");
		XLSX.writeFile(wb, `edufinance_alunos_pt_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
	}
	async function exportPTPayments() {
		const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
		const data = ptPayments.map((p) => ({
			Aluno: p.pt_students?.name ?? "",
			Plano: p.pt_plans?.name ?? "",
			Valor: Number(p.amount),
			Data_Pagamento: p.payment_date,
			Vencimento: p.due_date ?? "",
			Mes_Referencia: p.reference_month ?? "",
			Sessoes_Pagas: p.sessions_paid ?? "",
			Metodo: paymentMethodLabel(p.payment_method),
			Status: p.status,
			Notas: p.notes ?? ""
		}));
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Pagamentos PT");
		XLSX.writeFile(wb, `edufinance_pagamentos_pt_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
	}
	async function exportPTPlans() {
		const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
		const data = ptPlans.map((p) => ({
			Nome: p.name,
			Descricao: p.description ?? "",
			Tipo_Cobranca: p.billing_type,
			Preco_Mensal: p.price_per_month ?? "",
			Preco_Sessao: p.price_per_session ?? "",
			Preco_Pacote: p.package_price ?? "",
			Sessoes_Pacote: p.package_sessions ?? "",
			Sessoes_Mes: p.sessions_per_month ?? "",
			Ativo: p.is_active ? "Sim" : "Não"
		}));
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Planos PT");
		XLSX.writeFile(wb, `edufinance_planos_pt_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
	}
	async function exportReport() {
		const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(payments.map((p) => ({
			Aluno: p.students?.name,
			Plano: p.plans?.name,
			Valor: Number(p.amount),
			Data: p.payment_date,
			Mes_Ref: p.reference_month,
			Status: p.status
		}))), "Pagamentos");
		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(students.map((s) => ({
			Nome: s.name,
			Email: s.email ?? "",
			Telefone: s.phone ?? "",
			Status: s.status,
			CPF: s.cpf ?? "",
			RG: s.rg ?? "",
			Nascimento: s.birth_date ?? "",
			Endereco: s.address ?? "",
			Bairro: s.neighborhood ?? "",
			Cidade: s.city ?? "",
			Estado: s.state ?? "",
			CEP: s.postal_code ?? "",
			Pais: s.country ?? "",
			Inicio: s.start_date ?? "",
			Notas: s.notes ?? ""
		}))), "Alunos");
		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(plans.map((p) => ({
			Nome: p.name,
			Preco: Number(p.price),
			Ciclo: billingCycleLabel(p.billing_cycle),
			Ativo: p.is_active
		}))), "Planos");
		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ptStudents.map((s) => ({
			Nome: s.name,
			Email: s.email ?? "",
			Telefone: s.phone ?? "",
			Status: s.status,
			Nascimento: s.birth_date ?? "",
			Objetivo: s.goal ?? "",
			Saude: s.health_notes ?? "",
			Plano_Treino: s.training_plan ?? "",
			Inicio: s.start_date ?? "",
			Notas: s.notes ?? ""
		}))), "Alunos PT");
		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ptPayments.map((p) => ({
			Aluno: p.pt_students?.name ?? "",
			Plano: p.pt_plans?.name ?? "",
			Valor: Number(p.amount),
			Data: p.payment_date,
			Vencimento: p.due_date ?? "",
			Mes_Ref: p.reference_month ?? "",
			Sessoes_Pagas: p.sessions_paid ?? "",
			Metodo: paymentMethodLabel(p.payment_method),
			Status: p.status
		}))), "Pagamentos PT");
		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ptPlans.map((p) => ({
			Nome: p.name,
			Descricao: p.description ?? "",
			Tipo_Cobranca: p.billing_type,
			Preco_Mensal: p.price_per_month ?? "",
			Preco_Sessao: p.price_per_session ?? "",
			Preco_Pacote: p.package_price ?? "",
			Sessoes_Pacote: p.package_sessions ?? "",
			Sessoes_Mes: p.sessions_per_month ?? "",
			Ativo: p.is_active
		}))), "Planos PT");
		XLSX.writeFile(wb, `edufinance_relatorio_completo_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-5 flex flex-col justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: "Importar Dados"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Selecione o tipo de dado ou importe um relatório completo (backup multi-abas .xlsx)."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-1.5",
						children: [
							{
								id: "payments",
								label: "Pagamentos"
							},
							{
								id: "students",
								label: "Alunos"
							},
							{
								id: "plans",
								label: "Planos"
							},
							{
								id: "pt_students",
								label: "Alunos PT"
							},
							{
								id: "pt_payments",
								label: "Pagamentos PT"
							},
							{
								id: "pt_plans",
								label: "Planos PT"
							},
							{
								id: "full_report",
								label: "Relatório Completo (Backup)"
							}
						].map((cat) => {
							const isActive = importType === cat.id;
							const isFull = cat.id === "full_report";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: isActive ? "default" : "outline",
								size: "sm",
								onClick: () => {
									setImportType(cat.id);
									setRows([]);
									setFullReportData(null);
									setErrors([]);
									setImported(null);
								},
								className: `text-xs ${isFull && !isActive ? "border-primary/40 text-primary bg-primary/5 hover:bg-primary/10" : ""}`,
								children: [isFull && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "mr-1 h-3.5 w-3.5" }), cat.label]
							}, cat.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-lg border-2 border-dashed p-6 text-center bg-card/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mx-auto h-8 w-8 text-muted-foreground/60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-medium",
								children: importType === "full_report" ? "Arraste o arquivo do Relatório Completo (.xlsx com abas)" : "Arraste um arquivo .xlsx ou .csv"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-2 inline-block cursor-pointer text-sm font-semibold text-primary hover:underline",
								children: ["selecione um arquivo do computador", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: ".xlsx,.csv,.xls",
									className: "hidden",
									onChange: (e) => {
										const f = e.target.files?.[0];
										if (f) handleFile(f);
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => downloadTemplate(importType),
									className: "text-xs gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), importType === "full_report" ? "Baixar template do Backup Completo (.xlsx)" : "Baixar template"]
								})
							})
						]
					}),
					rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-semibold flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rows.length }),
									" linhas detectadas para a categoria ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "uppercase text-primary font-bold",
										children: importType
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-40 overflow-auto rounded-lg border bg-muted/40 p-2.5 text-[11px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "font-mono leading-relaxed",
									children: JSON.stringify(rows.slice(0, 3), null, 2)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "mt-2 w-full font-bold",
								onClick: confirmImport,
								children: [
									"Confirmar Importação de ",
									rows.length,
									" Registros"
								]
							})
						]
					}),
					fullReportData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-bold text-primary flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4" }), " Relatório Completo Detectado (Backup Multi-Abas):"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "grid grid-cols-2 gap-1.5 pl-2 font-medium",
								children: [
									fullReportData.students && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• Alunos: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fullReportData.students.length })] }),
									fullReportData.payments && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• Pagamentos: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fullReportData.payments.length })] }),
									fullReportData.plans && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• Planos: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fullReportData.plans.length })] }),
									fullReportData.pt_students && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• Alunos PT: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fullReportData.pt_students.length })] }),
									fullReportData.pt_payments && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• Pagamentos PT: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fullReportData.pt_payments.length })] }),
									fullReportData.pt_plans && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• Planos PT: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fullReportData.pt_plans.length })] })
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full font-bold bg-primary hover:bg-primary/90",
							onClick: confirmImport,
							children: "Restaurar Backup Completo (Importar Todas as Abas)"
						})]
					}),
					imported !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-600 dark:text-emerald-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0" }),
							" ",
							imported,
							" registro(s) importado(s) com sucesso no seu banco!"
						]
					}),
					errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-bold text-destructive",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0" }),
								" ",
								errors.length,
								" erro(s) durante o processamento:"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 max-h-32 list-disc overflow-auto pl-5 font-mono text-[11px] text-destructive space-y-0.5",
							children: errors.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: e }, i))
						})]
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-5 flex flex-col justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: "Exportar Dados"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Baixe seus dados cadastrais e financeiros como planilhas Excel organizadas."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "justify-start text-xs font-semibold gap-2",
								onClick: exportPayments,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-emerald-600" }), " Exportar pagamentos (Studio)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "justify-start text-xs font-semibold gap-2",
								onClick: exportStudents,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-emerald-600" }), " Exportar alunos (Studio)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "justify-start text-xs font-semibold gap-2",
								onClick: exportPlans,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-emerald-600" }), " Exportar planos (Studio)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "justify-start text-xs font-semibold gap-2",
								onClick: exportPTStudents,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-indigo-600" }), " Exportar alunos PT (Personal)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "justify-start text-xs font-semibold gap-2",
								onClick: exportPTPayments,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-indigo-600" }), " Exportar pagamentos PT (Personal)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "justify-start text-xs font-semibold gap-2",
								onClick: exportPTPlans,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-indigo-600" }), " Exportar planos PT (Personal)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "default",
								className: "justify-start text-xs font-bold gap-2 bg-primary hover:bg-primary/90 mt-1 shadow-md shadow-primary/20",
								onClick: exportReport,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-primary-foreground" }), " Relatório completo (todas as abas)"]
							})
						]
					})
				] })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerStudentExport, {})]
	});
}
function TrashPanel() {
	const qc = useQueryClient();
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const { data: students = [], isLoading: loadS } = useQuery({
		queryKey: ["trash-students", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("students").select("id,name,deleted_at,status").not("deleted_at", "is", null).order("deleted_at", { ascending: false });
			if (scopeId) q = q.eq("user_id", scopeId);
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: payments = [], isLoading: loadP } = useQuery({
		queryKey: ["trash-payments", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let all = [];
			let from = 0;
			while (true) {
				let q = supabase.from("payments").select("id,amount,payment_date,reference_month,deleted_at,students(name)").not("deleted_at", "is", null).order("deleted_at", { ascending: false }).range(from, from + 999);
				if (scopeId) q = q.eq("user_id", scopeId);
				const { data, error } = await q;
				if (error) throw error;
				all = all.concat(data ?? []);
				if (!data || data.length < 1e3) break;
				from += 1e3;
			}
			return all;
		}
	});
	const { data: ptStudents = [], isLoading: loadPS } = useQuery({
		queryKey: ["trash-pt-students", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_students").select("id,name,deleted_at,status").not("deleted_at", "is", null).order("deleted_at", { ascending: false });
			if (scopeId) q = q.eq("user_id", scopeId);
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: ptPayments = [], isLoading: loadPP } = useQuery({
		queryKey: ["trash-pt-payments", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let all = [];
			let from = 0;
			while (true) {
				let q = supabase.from("pt_payments").select("id,amount,payment_date,reference_month,deleted_at,pt_students(name)").not("deleted_at", "is", null).order("deleted_at", { ascending: false }).range(from, from + 999);
				if (scopeId) q = q.eq("user_id", scopeId);
				const { data, error } = await q;
				if (error) throw error;
				all = all.concat(data ?? []);
				if (!data || data.length < 1e3) break;
				from += 1e3;
			}
			return all;
		}
	});
	async function restoreStudent(id) {
		const { error } = await supabase.from("students").update({ deleted_at: null }).eq("id", id);
		if (error) return toast.error(error.message);
		await supabase.from("payments").update({ deleted_at: null }).eq("student_id", id).not("deleted_at", "is", null);
		toast.success("Aluno restaurado");
		qc.invalidateQueries();
	}
	async function purgeStudent(id) {
		if (!await confirmDialog("Excluir PERMANENTEMENTE este aluno e todos os pagamentos? Não é possível desfazer.")) return;
		const { error } = await supabase.from("students").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Excluído permanentemente");
		qc.invalidateQueries();
	}
	async function restorePayment(id) {
		const { error } = await supabase.from("payments").update({ deleted_at: null }).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Pagamento restaurado");
		qc.invalidateQueries();
	}
	async function purgePayment(id) {
		if (!await confirmDialog("Excluir PERMANENTEMENTE este pagamento?")) return;
		const { error } = await supabase.from("payments").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Excluído permanentemente");
		qc.invalidateQueries();
	}
	async function restorePTStudent(id) {
		const { error } = await supabase.from("pt_students").update({ deleted_at: null }).eq("id", id);
		if (error) return toast.error(error.message);
		await supabase.from("pt_payments").update({ deleted_at: null }).eq("pt_student_id", id).not("deleted_at", "is", null);
		toast.success("Aluno PT restaurado");
		qc.invalidateQueries();
	}
	async function purgePTStudent(id) {
		if (!await confirmDialog("Excluir PERMANENTEMENTE este aluno PT e todos os pagamentos? Não é possível desfazer.")) return;
		const { error } = await supabase.from("pt_students").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Excluído permanentemente");
		qc.invalidateQueries();
	}
	async function restorePTPayment(id) {
		const { error } = await supabase.from("pt_payments").update({ deleted_at: null }).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Pagamento PT restaurado");
		qc.invalidateQueries();
	}
	async function purgePTPayment(id) {
		if (!await confirmDialog("Excluir PERMANENTEMENTE este pagamento PT?")) return;
		const { error } = await supabase.from("pt_payments").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Excluído permanentemente");
		qc.invalidateQueries();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-semibold",
						children: [
							"Alunos (",
							students.length,
							")"
						]
					})]
				}), loadS ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "Carregando…"
				}) : students.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nenhum aluno na lixeira",
					description: "Alunos excluídos aparecerão aqui"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-medium",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: ["Excluído em ", formatDateBR(s.deleted_at)]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => restoreStudent(s.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Restaurar"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => purgeStudent(s.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-destructive" })
							})]
						})]
					}, s.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-semibold",
						children: [
							"Pagamentos (",
							payments.length,
							")"
						]
					})]
				}), loadP ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "Carregando…"
				}) : payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nenhum pagamento na lixeira",
					description: "Pagamentos excluídos aparecerão aqui"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate font-medium",
								children: [
									p.students?.name ?? "—",
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: formatBRL(p.amount)
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									"Ref ",
									p.reference_month,
									" · pago em ",
									formatDateBR(p.payment_date),
									" · excluído em ",
									formatDateBR(p.deleted_at)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => restorePayment(p.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Restaurar"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => purgePayment(p.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-destructive" })
							})]
						})]
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-semibold",
						children: [
							"Alunos PT (",
							ptStudents.length,
							")"
						]
					})]
				}), loadPS ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "Carregando…"
				}) : ptStudents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nenhum aluno PT na lixeira",
					description: "Alunos PT excluídos aparecerão aqui"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: ptStudents.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-medium",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: ["Excluído em ", formatDateBR(s.deleted_at)]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => restorePTStudent(s.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Restaurar"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => purgePTStudent(s.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-destructive" })
							})]
						})]
					}, s.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-semibold",
						children: [
							"Pagamentos PT (",
							ptPayments.length,
							")"
						]
					})]
				}), loadPP ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "Carregando…"
				}) : ptPayments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nenhum pagamento PT na lixeira",
					description: "Pagamentos PT excluídos aparecerão aqui"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: ptPayments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate font-medium",
								children: [
									p.pt_students?.name ?? "—",
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: formatBRL(p.amount)
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									"Ref ",
									p.reference_month ?? "—",
									" · pago em ",
									formatDateBR(p.payment_date),
									" · excluído em ",
									formatDateBR(p.deleted_at)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => restorePTPayment(p.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Restaurar"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => purgePTPayment(p.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-destructive" })
							})]
						})]
					}, p.id))
				})]
			})
		]
	});
}
/**
* Prompt pronto para copiar e colar no projeto de origem
* (Sistema Híbrido de Treinamento), replicando lá o mesmo formato de
* produção drag-and-drop de treinos e do editor de imagem.
*/
var DND_PROMPT = `Quero replicar neste projeto o mesmo formato de produção drag-and-drop
de treinos e de imagens que já uso no meu outro sistema. Antes de codar,
leia o projeto e ADAPTE tudo ao modelo de dados, nomes de tabelas, campos
e componentes que ele JÁ usa — não invente estrutura nova, não crie
backend novo, não faça migração se não for estritamente necessário.

PARTE A — Reordenação drag-and-drop
- Dias/semanas de treino e exercícios dentro de cada dia passam a ser
  reordenáveis arrastando (use @dnd-kit/core + @dnd-kit/sortable).
- Handle de arraste visível e sempre acessível por teclado
  (setas para mover, Espaço/Enter para pegar e soltar, anúncio via aria-live).
- Enquanto arrasta: item levantado com sombra e leve escala, alvo com
  linha/realce de destino. Nada de layout "pulando".
- Persistência: grave a nova ordem no mesmo campo de ordenação que o
  projeto já usa (order/position/sort_index). Atualização otimista com
  rollback e toast de erro se a gravação falhar.

PARTE B — Editor de layout da imagem do programa
- Um editor de canvas em grade de 12 colunas onde cada bloco do programa
  (cabeçalho, período/nível, objetivos, cada dia de treino, observações,
  assinatura) pode ser posicionado e redimensionado arrastando.
- Snap à grade, sem sobreposição (empurra ou bloqueia), clamp nas bordas.
- Formatos de saída selecionáveis: 1:1 (feed), 4:5 (post), 9:16 (story)
  e A4 (ficha para impressão), cada um com sua altura de grade.
- Presets prontos: Compacto, Cartaz e Ficha A4 — aplicáveis em um clique.
- Preview ao vivo lado a lado e aviso claro quando o conteúdo estoura o
  bloco ("texto não cabe neste tamanho").
- Persistência do layout por programa: use o que o projeto já tiver; se
  não houver lugar natural, use localStorage por id de programa. Não crie
  tabela nova só para isso.

PARTE C — Exportação
- Renderize a peça final em canvas de alta densidade (devicePixelRatio 2–3)
  e exporte em PNG e PDF.
- As cores e a tipografia do render devem ser lidas dos tokens de tema do
  projeto (não hardcode hex no renderer).
- Botão de exportar com estado de loading e toast de sucesso/erro.

DESIGN SYSTEM (obrigatório)
- Cores como tokens HSL no index.css e tudo referenciado por tokens
  semânticos do Tailwind. Proibido text-white, bg-black ou hex direto —
  dark mode tem que funcionar de graça.
- Hierarquia tipográfica clara (tamanho, peso e line-height guiando o olho).
- Respiro consistente na escala de 4/8px, alinhamento impecável.
- shadcn como base, mas com variantes customizadas — personalidade própria,
  sem cara de template.
- Mobile-first de verdade: no toque, o arraste usa handle dedicado para não
  brigar com o scroll; o editor de layout ganha versão simplificada.
- Todos os estados cobertos: hover, focus visível, active, disabled e
  loading, com transições de 150–250ms.
- Contraste acessível. Cara de produto, não de protótipo.

ESCOPO
- Proporcional ao pedido: sem over-engineering, sem rota nova
  desnecessária, sem serviço externo. Só o que faz sentido para o que
  está descrito acima.`;
function DragDropPromptCard() {
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(DND_PROMPT);
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		} catch {
			toast.error("Não foi possível copiar. Selecione o texto manualmente.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
		icon: LayoutTemplate,
		title: "Prompt: drag-and-drop no projeto de origem",
		description: "Copie e cole no chat do Sistema Híbrido de Treinamento",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			size: "sm",
			onClick: handleCopy,
			className: "w-full transition-ui active:scale-[0.98] sm:w-auto",
			children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2 h-4 w-4 text-state-paid" }), "Copiado!"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-4 w-4" }), "Copiar prompt"] })
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "text-caption max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-4 font-mono leading-relaxed text-foreground",
				children: DND_PROMPT
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-caption leading-relaxed text-muted-foreground",
				children: [
					"O prompt pede que o outro projeto",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "font-medium text-foreground",
						children: "adapte ao modelo de dados dele"
					}),
					" — reordenação de dias e exercícios, editor de layout em grade e exportação PNG/PDF — sem criar backend ou estrutura extra."
				]
			})]
		})
	});
}
/**
* Prompt pronto para copiar e colar no projeto de origem, replicando lá o
* mesmo motor de "Prescrever com IA" usado aqui (contexto do banco → JSON
* estrito → prévia revisável → gravação em duas tabelas).
*/
var AI_ENGINE_PROMPT = `Quero implementar um motor de "Prescrever com IA" para geração de treinos, no
mesmo padrão que já uso em outro projeto. Adapte ao meu schema e às minhas
convenções atuais — não crie tabelas novas nem backend extra se o que já existe
resolver.

ARQUITETURA (2 peças, nada além disso)

1) Função de servidor autenticada \`prescribeTrainingWithAi\`
   - Autenticação obrigatória; use o cliente do banco com RLS do próprio usuário.
   - Entrada validada com Zod: { programId: uuid, prompt: string 3..4000 }.
   - Busque no banco a rotina/programa desse id e extraia o contexto:
     nome, categoria, nível, tipo de nomenclatura dos dias (numérico "Dia 1/2/3"
     ou alfabético "Dia A/B/C"), período (início/fim) e objetivos.
     Esse contexto é injetado automaticamente — o usuário não deve repetir isso.
   - Chame o Lovable AI Gateway:
       POST https://ai.gateway.lovable.dev/v1/chat/completions
       headers: { "Content-Type": "application/json",
                  "Lovable-API-Key": process.env.LOVABLE_API_KEY }
       body: { model: "google/gemini-3-flash-preview",
               messages: [system, user],
               response_format: { type: "json_object" } }
   - SYSTEM PROMPT (use praticamente isto, em pt-BR):
       "Você é um Personal Trainer experiente. Gere uma prescrição de treino em
        português (Brasil). Responda APENAS com JSON válido, sem markdown, no
        formato:
        {
          "days": [
            { "name": "Treino 1",
              "day_label": "Dia A",
              "description": "Foco muscular / observações gerais",
              "exercises": [
                { "name": "Supino reto", "sets_reps": "4x10", "load": "60kg",
                  "rest_seconds": 90, "observations": "Cadência 2:1" }
              ] }
          ],
          "notes": "Observações finais do plano"
        }
        Regras: 4 a 8 exercícios por dia; 'load' e 'observations' podem ser
        vazios; 'day_label' segue o tipo de nomenclatura da rotina."
   - USER PROMPT: contexto da rotina (nome, categoria, nível, tipo, período,
     objetivos) + as instruções livres digitadas pelo usuário.
   - Tratamento de erro amigável: 429 -> "Limite de uso da IA atingido, tente em
     instantes"; 402 -> "Créditos da IA esgotados"; demais -> falha genérica com
     o status. JSON.parse defensivo com mensagem clara; garanta days como array.
   - A função NÃO escreve nada no banco: apenas retorna o JSON.

2) Diálogo "Prescrever com IA" no editor da rotina
   - Textarea de instruções (placeholder com exemplo real de divisão A/B/C/D,
     foco muscular, séries e repetições) + microcopy dizendo que a IA já usa
     categoria, nível e objetivos da rotina.
   - Botão "Gerar prescrição" com estado de loading (spinner + label mutável).
   - PRÉVIA revisável do resultado: cada dia como card com nome, badge do
     day_label, descrição e lista de exercícios mostrando
     "séries/reps · carga · descanso" e observações em linha secundária;
     bloco de notas finais em destaque sutil.
   - Só o botão "Adicionar treinos à rotina" persiste:
       para cada dia -> insert no equivalente a training_days com sort_order
       incremental a partir do fim da lista; com o id retornado, insert em lote
       dos exercícios com sort_order sequencial;
       ao final, grave no programa o prompt usado e o timestamp de geração
       (ex.: ai_prompt / ai_generated_at) para rastrear proveniência e permitir
       exibir depois o prompt que originou o treino.
   - Invalide os caches de listagem, feche o diálogo e limpe o estado.

DESIGN SYSTEM (obrigatório)
- Cores só como tokens HSL no CSS global, referenciadas pelos tokens semânticos
  do Tailwind. Nada de text-white, bg-black ou hex chumbado — dark mode tem que
  funcionar de graça.
- Hierarquia tipográfica clara (tamanho, peso, line-height), espaçamento em
  escala de 4/8px, alinhamento impecável.
- shadcn como base, mas com variantes customizadas — sem cara de template.
- Mobile-first de verdade: diálogo com max-height e scroll interno, botões que
  ocupam largura total no mobile.
- Todos os estados cobertos: hover, focus visível, active, disabled, loading,
  vazio e erro (toast). Transições de 150–250ms.
- Contraste acessível; nada de over-engineering: só o que o pedido exige.`;
function AiEnginePromptCard() {
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(AI_ENGINE_PROMPT);
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		} catch {
			toast.error("Não foi possível copiar. Selecione o texto manualmente.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
		icon: Sparkles,
		title: "Prompt: motor de prescrição com IA",
		description: "Replique o gerador de treinos por IA no projeto de origem",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			size: "sm",
			onClick: handleCopy,
			className: "w-full transition-ui active:scale-[0.98] sm:w-auto",
			children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2 h-4 w-4 text-state-paid" }), "Copiado!"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-4 w-4" }), "Copiar prompt"] })
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "text-caption max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-4 font-mono leading-relaxed text-foreground",
				children: AI_ENGINE_PROMPT
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-caption leading-relaxed text-muted-foreground",
				children: [
					"O motor tem duas peças: uma função de servidor que injeta o contexto da rotina e exige",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "font-medium text-foreground",
						children: "JSON estrito"
					}),
					" do modelo, e um diálogo que mostra a prévia — nada é gravado antes de você aprovar."
				]
			})]
		})
	});
}
var LOGO_PT_KEY = "coach.logo.pt";
var LOGO_STUDIO_KEY = "coach.logo.studio";
function BusinessLogosPanel() {
	const { user } = useAuth();
	const [logoPt, setLogoPt] = (0, import_react.useState)(null);
	const [logoStudio, setLogoStudio] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [uploading, setUploading] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		async function loadLogos() {
			if (!user) return;
			const { data, error } = await supabase.from("studio_settings").select("logo_pt_base64, logo_studio_base64").eq("user_id", user.id).maybeSingle();
			if (data) {
				const settings = data;
				if (settings.logo_pt_base64) {
					setLogoPt(settings.logo_pt_base64);
					localStorage.setItem(LOGO_PT_KEY, settings.logo_pt_base64);
				}
				if (settings.logo_studio_base64) {
					setLogoStudio(settings.logo_studio_base64);
					localStorage.setItem(LOGO_STUDIO_KEY, settings.logo_studio_base64);
				}
			} else {
				setLogoPt(localStorage.getItem(LOGO_PT_KEY));
				setLogoStudio(localStorage.getItem(LOGO_STUDIO_KEY));
			}
			setLoading(false);
		}
		loadLogos();
	}, [user]);
	const handleLogoUpload = async (e, key, field, setter) => {
		const file = e.target.files?.[0];
		if (file && user) {
			if (file.size > 1024 * 1024) {
				toast.error("Imagem muito grande. Use uma imagem menor que 1MB.");
				return;
			}
			setUploading(field);
			const reader = new FileReader();
			reader.onloadend = async () => {
				const base64 = reader.result;
				const { error } = await supabase.from("studio_settings").upsert({
					user_id: user.id,
					[field]: base64,
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				});
				if (error) toast.error("Erro ao salvar no servidor: " + error.message);
				else {
					localStorage.setItem(key, base64);
					setter(base64);
					toast.success("Logo salva com sucesso!");
				}
				setUploading(null);
			};
			reader.readAsDataURL(file);
		}
	};
	const removeLogo = async (key, field, setter) => {
		if (!user) return;
		setUploading(field);
		const { error } = await supabase.from("studio_settings").upsert({
			user_id: user.id,
			[field]: null,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (error) toast.error("Erro ao remover do servidor");
		else {
			localStorage.removeItem(key);
			setter(null);
			toast.success("Logo removida.");
		}
		setUploading(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-base font-semibold",
			children: "Identidade Visual (Logos)"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Configure as logos que serão exibidas no portal e nos compartilhamentos de resultados."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 rounded-xl border p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold",
							children: "Logo Personal Trainer"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Usada no compartilhamento de resultados de treinos PT."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-24 w-24 items-center justify-center rounded-xl bg-muted border-2 border-dashed border-muted-foreground/20 overflow-hidden",
							children: logoPt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: logoPt,
								className: "h-full w-full object-contain",
								alt: "PT Logo"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-10 w-10 text-muted-foreground/40" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									id: "logo-pt-input",
									className: "hidden",
									accept: "image/*",
									onChange: (e) => handleLogoUpload(e, LOGO_PT_KEY, "logo_pt_base64", setLogoPt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "flex-1 gap-2",
									onClick: () => document.getElementById("logo-pt-input")?.click(),
									disabled: uploading === "logo_pt_base64",
									children: [uploading === "logo_pt_base64" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), " Subir"]
								}),
								logoPt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									className: "text-destructive hover:bg-destructive/10",
									onClick: () => removeLogo(LOGO_PT_KEY, "logo_pt_base64", setLogoPt),
									disabled: uploading === "logo_pt_base64",
									children: "Remover"
								})
							]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 rounded-xl border p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold",
							children: "Logo Studio"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Usada no portal do aluno e comunicações do Studio."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-24 w-24 items-center justify-center rounded-xl bg-muted border-2 border-dashed border-muted-foreground/20 overflow-hidden",
							children: logoStudio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: logoStudio,
								className: "h-full w-full object-contain",
								alt: "Studio Logo"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-10 w-10 text-muted-foreground/40" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									id: "logo-studio-input",
									className: "hidden",
									accept: "image/*",
									onChange: (e) => handleLogoUpload(e, LOGO_STUDIO_KEY, "logo_studio_base64", setLogoStudio)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "flex-1 gap-2",
									onClick: () => document.getElementById("logo-studio-input")?.click(),
									disabled: uploading === "logo_studio_base64",
									children: [uploading === "logo_studio_base64" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), " Subir"]
								}),
								logoStudio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									className: "text-destructive hover:bg-destructive/10",
									onClick: () => removeLogo(LOGO_STUDIO_KEY, "logo_studio_base64", setLogoStudio),
									disabled: uploading === "logo_studio_base64",
									children: "Remover"
								})
							]
						})]
					})
				]
			})]
		})]
	});
}
function slugify(v) {
	return v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
}
function PaymentMethodsSettings() {
	const { user } = useAuth();
	const qc = useQueryClient();
	const { all: methods, isLoading } = usePaymentMethods();
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [seeding, setSeeding] = (0, import_react.useState)(false);
	async function seedDefaults() {
		if (!user) return;
		setSeeding(true);
		const existing = new Set(methods.map((m) => m.key));
		const toInsert = DEFAULT_PAYMENT_METHODS.filter((d) => !existing.has(d.key)).map((d, i) => ({
			user_id: user.id,
			key: d.key,
			label: d.label,
			sort_order: methods.length + i
		}));
		if (toInsert.length === 0) {
			toast.info("Formas padrão já estão cadastradas.");
			setSeeding(false);
			return;
		}
		const { error } = await supabase.from("payment_methods").insert(toInsert);
		setSeeding(false);
		if (error) return toast.error(error.message);
		toast.success(`${toInsert.length} forma(s) padrão adicionada(s).`);
		qc.invalidateQueries({ queryKey: ["payment-methods"] });
	}
	async function toggleActive(m) {
		const { error } = await supabase.from("payment_methods").update({ is_active: !m.is_active }).eq("id", m.id);
		if (error) return toast.error(error.message);
		qc.invalidateQueries({ queryKey: ["payment-methods"] });
	}
	async function remove(m) {
		if (!await confirmDialog(`Excluir a forma "${m.label}"? Pagamentos já registrados com essa forma continuarão exibindo o código "${m.key}".`)) return;
		const { error } = await supabase.from("payment_methods").delete().eq("id", m.id);
		if (error) return toast.error(error.message);
		toast.success("Forma de pagamento excluída");
		qc.invalidateQueries({ queryKey: ["payment-methods"] });
	}
	async function move(m, direction) {
		const sorted = [...methods].sort((a, b) => a.sort_order - b.sort_order);
		const swap = sorted[sorted.findIndex((x) => x.id === m.id) + direction];
		if (!swap) return;
		const updates = [supabase.from("payment_methods").update({ sort_order: swap.sort_order }).eq("id", m.id), supabase.from("payment_methods").update({ sort_order: m.sort_order }).eq("id", swap.id)];
		const err = (await Promise.all(updates)).find((r) => r.error)?.error;
		if (err) return toast.error(err.message);
		qc.invalidateQueries({ queryKey: ["payment-methods"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold",
					children: "Formas de pagamento"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Cadastre, edite e organize as formas de pagamento disponíveis nos registros."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [methods.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: seedDefaults,
						disabled: seeding,
						children: [seeding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Usar padrões"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => {
							setEditing(null);
							setDialogOpen(true);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Nova forma"]
					})]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "Carregando…"
			}) : methods.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-dashed p-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nenhuma forma de pagamento cadastrada. Use os padrões (PIX, Cartão, Boleto…) ou crie a sua."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y rounded-lg border",
				children: [...methods].sort((a, b) => a.sort_order - b.sort_order).map((m, i, arr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-3 p-3 transition-colors hover:bg-muted/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30",
								onClick: () => move(m, -1),
								disabled: i === 0,
								"aria-label": "Mover para cima",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-3.5 w-3.5 rotate-180" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30",
								onClick: () => move(m, 1),
								disabled: i === arr.length - 1,
								"aria-label": "Mover para baixo",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-3.5 w-3.5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: m.label
								}), !m.is_active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground",
									children: "Inativa"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: m.key
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: m.is_active,
									onCheckedChange: () => toggleActive(m)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => {
										setEditing(m);
										setDialogOpen(true);
									},
									"aria-label": "Editar",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => remove(m),
									"aria-label": "Excluir",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
								})
							]
						})
					]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentMethodDialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				method: editing,
				nextSortOrder: methods.length
			})
		]
	});
}
function PaymentMethodDialog({ open, onOpenChange, method, nextSortOrder }) {
	const { user } = useAuth();
	const qc = useQueryClient();
	const [label, setLabel] = (0, import_react.useState)("");
	const [key, setKey] = (0, import_react.useState)("");
	const [keyTouched, setKeyTouched] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) {
			setLabel(method?.label ?? "");
			setKey(method?.key ?? "");
			setKeyTouched(!!method);
		}
	}, [open, method]);
	async function save() {
		if (!user) return;
		const finalLabel = label.trim();
		const finalKey = (keyTouched || method ? key : slugify(label)).trim();
		if (!finalLabel) return toast.error("Informe um nome");
		if (!finalKey) return toast.error("Informe um código");
		setSaving(true);
		const payload = {
			user_id: user.id,
			label: finalLabel,
			key: finalKey
		};
		const { error } = await (method ? supabase.from("payment_methods").update(payload).eq("id", method.id) : supabase.from("payment_methods").insert({
			...payload,
			sort_order: nextSortOrder
		}));
		setSaving(false);
		if (error) {
			if (error.code === "23505") return toast.error("Já existe uma forma com esse código.");
			return toast.error(error.message);
		}
		toast.success(method ? "Forma atualizada" : "Forma criada");
		qc.invalidateQueries({ queryKey: ["payment-methods"] });
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: method ? "Editar forma de pagamento" : "Nova forma de pagamento" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: label,
							onChange: (e) => {
								setLabel(e.target.value);
								if (!keyTouched && !method) setKey(slugify(e.target.value));
							},
							placeholder: "Ex: PIX Empresa, Dinheiro, Cartão Nubank…",
							autoFocus: true
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Código interno *" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: key,
								onChange: (e) => {
									setKey(slugify(e.target.value));
									setKeyTouched(true);
								},
								placeholder: "pix_empresa",
								className: "font-mono text-sm",
								disabled: !!method
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: method ? "O código não pode ser alterado após a criação." : "Gerado automaticamente. Usado internamente para identificar a forma."
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), " Cancelar"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: save,
					disabled: saving,
					children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), "Salvar"]
				})] })
			]
		})
	});
}
var TAB_META = {
	geral: {
		label: "Geral",
		icon: Settings2,
		description: "Preferências da sua conta, aparência e integrações"
	},
	dados: {
		label: "Dados",
		icon: ArrowDownUp,
		description: "Backup, exportações e importação em massa via Excel ou CSV"
	},
	prompts: {
		label: "Prompts",
		icon: Sparkles,
		description: "Configuração de motores de IA e prompts customizados"
	},
	lixeira: {
		label: "Lixeira",
		icon: Trash2,
		description: "Registros excluídos podem ser restaurados. Excluir permanente é irreversível"
	}
};
function SettingsPage() {
	const tab = Route.useSearch().tab ?? "geral";
	const navigate = useNavigate({ from: Route.fullPath });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-5xl space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			icon: Settings2,
			eyebrow: "Conta",
			title: "Configurações",
			description: TAB_META[tab].description
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: tab,
			onValueChange: (v) => navigate({
				search: { tab: v },
				replace: true
			}),
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "-mx-1 overflow-x-auto px-1 pb-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
						className: "inline-flex h-auto gap-1 rounded-xl bg-muted/50 p-1",
						children: TABS.map((key) => {
							const Icon = TAB_META[key].icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: key,
								className: "gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }), TAB_META[key].label]
							}, key);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "geral",
					className: "mt-0 focus-visible:outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeneralSettings, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "dados",
					className: "mt-0 focus-visible:outline-none",
					children: tab === "dados" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTransferPanel, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "prompts",
					className: "mt-0 focus-visible:outline-none",
					children: tab === "prompts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragDropPromptCard, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiEnginePromptCard, {})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "lixeira",
					className: "mt-0 focus-visible:outline-none",
					children: tab === "lixeira" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrashPanel, {})
				})
			]
		})]
	});
}
function GeneralSettings() {
	const { user } = useAuth();
	const [academyName, setAcademyName] = (0, import_react.useState)(typeof window !== "undefined" ? localStorage.getItem("edufinance.academy") ?? "" : "");
	const [fiscalMonth, setFiscalMonth] = (0, import_react.useState)(typeof window !== "undefined" ? localStorage.getItem("edufinance.fiscalMonth") ?? "1" : "1");
	const [resendKey, setResendKey] = (0, import_react.useState)("");
	const [hasSavedResendKey, setHasSavedResendKey] = (0, import_react.useState)(false);
	const [senderEmail, setSenderEmail] = (0, import_react.useState)("");
	const [emailSaving, setEmailSaving] = (0, import_react.useState)(false);
	const loadEmailSettings = useServerFn(getEmailSettings);
	const persistEmailSettings = useServerFn(saveEmailSettings);
	(0, import_react.useEffect)(() => {
		loadEmailSettings().then((s) => {
			setHasSavedResendKey(s.hasKey);
			setSenderEmail(s.senderEmail ?? "");
		}).catch(() => {});
	}, [loadEmailSettings]);
	const [gcalApiKey, setGcalApiKey] = (0, import_react.useState)(typeof window !== "undefined" ? localStorage.getItem("edufinance.gcalApiKey") ?? "" : "");
	const [gcalId, setGcalId] = (0, import_react.useState)(typeof window !== "undefined" ? localStorage.getItem("edufinance.gcalId") ?? "primary" : "primary");
	const [gcalClientId, setGcalClientId] = (0, import_react.useState)(typeof window !== "undefined" ? localStorage.getItem("edufinance.gcalClientId") ?? "" : "");
	const [aiApiKey, setAiApiKey] = (0, import_react.useState)(typeof window !== "undefined" ? localStorage.getItem("edufinance.aiApiKey") ?? "" : "");
	const [showAiApiKey, setShowAiApiKey] = (0, import_react.useState)(false);
	const { theme, toggleTheme } = useTheme();
	function saveGcal() {
		localStorage.setItem("edufinance.gcalApiKey", gcalApiKey);
		localStorage.setItem("edufinance.gcalId", gcalId);
		localStorage.setItem("edufinance.gcalClientId", gcalClientId);
		toast.success("Configurações do Google Calendar salvas!");
	}
	function saveAiKey() {
		if (aiApiKey.trim()) {
			localStorage.setItem("edufinance.aiApiKey", aiApiKey.trim());
			toast.success("Chave da IA salva localmente!");
		} else {
			localStorage.removeItem("edufinance.aiApiKey");
			toast.success("Chave da IA removida.");
		}
	}
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showNew, setShowNew] = (0, import_react.useState)(false);
	const [showConfirm, setShowConfirm] = (0, import_react.useState)(false);
	const [pwLoading, setPwLoading] = (0, import_react.useState)(false);
	const [pwError, setPwError] = (0, import_react.useState)(null);
	function save() {
		localStorage.setItem("edufinance.academy", academyName);
		localStorage.setItem("edufinance.fiscalMonth", fiscalMonth);
	}
	async function saveResend() {
		setEmailSaving(true);
		try {
			await persistEmailSettings({ data: {
				resendApiKey: resendKey,
				senderEmail
			} });
			if (resendKey.trim().length > 0) {
				setHasSavedResendKey(true);
				setResendKey("");
			}
			toast.success("Configurações de email salvas!");
		} catch (e) {
			toast.error(e.message ?? "Erro ao salvar");
		} finally {
			setEmailSaving(false);
		}
	}
	async function handleChangePassword(e) {
		e.preventDefault();
		setPwError(null);
		if (newPassword.length < 8) {
			setPwError("A nova senha deve ter no mínimo 8 caracteres.");
			return;
		}
		if (newPassword !== confirmPassword) {
			setPwError("As senhas não coincidem.");
			return;
		}
		setPwLoading(true);
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: user?.email ?? "",
			password: currentPassword
		});
		if (signInError) {
			setPwLoading(false);
			setPwError("Senha atual incorreta.");
			return;
		}
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		setPwLoading(false);
		if (error) {
			setPwError(error.message);
			return;
		}
		toast.success("Senha alterada com sucesso!");
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: "Aparência"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: "Tema"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: theme === "dark" ? "Modo escuro ativado" : "Modo claro ativado"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: toggleTheme,
							children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "mr-2 h-4 w-4" }), " Modo claro"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "mr-2 h-4 w-4" }), " Modo escuro"] })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisualThemeSelector, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontSizeSetting, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingPageSetting, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessLogosPanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: "Perfil"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: user?.email ?? "",
							disabled: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileModeSetting, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioCheckinSettings, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentMethodsSettings, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: "Armazenamento e mídia"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Veja e gerencie tudo o que o app guarda para você: imagens de avisos (incluindo as geradas por IA), fotos de alunos, contratos em PDF e mídia de exercícios."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "w-full sm:w-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/storage",
							children: "Abrir armazenamento"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: "Negócio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome da escola / academia" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: academyName,
							onChange: (e) => setAcademyName(e.target.value),
							placeholder: "Minha Escola"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Moeda padrão" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: "BRL — Real brasileiro",
							disabled: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mês inicial do ano fiscal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							max: 12,
							value: fiscalMonth,
							onChange: (e) => setFiscalMonth(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: save,
						children: "Salvar"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold",
					children: "Alterar senha"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: handleChangePassword,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Senha atual" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: currentPassword,
								onChange: (e) => setCurrentPassword(e.target.value),
								autoComplete: "current-password",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nova senha" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: showNew ? "text" : "password",
										value: newPassword,
										onChange: (e) => setNewPassword(e.target.value),
										autoComplete: "new-password",
										className: "pr-10",
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowNew((v) => !v),
										className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
										"aria-label": showNew ? "Ocultar senha" : "Mostrar senha",
										children: showNew ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Mínimo 8 caracteres."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Confirmar nova senha" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: showConfirm ? "text" : "password",
									value: confirmPassword,
									onChange: (e) => setConfirmPassword(e.target.value),
									autoComplete: "new-password",
									className: "pr-10",
									required: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowConfirm((v) => !v),
									className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
									"aria-label": showConfirm ? "Ocultar senha" : "Mostrar senha",
									children: showConfirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								})]
							})]
						}),
						pwError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-destructive",
							children: pwError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: pwLoading,
							children: [pwLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Alterar senha"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: "Integração de Email (Resend)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Para enviar emails pelo CRM, configure sua API key do",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://resend.com",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "text-primary underline",
								children: "Resend"
							}),
							". A chave fica guardada com segurança no servidor e nunca é enviada ao navegador."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "API Key do Resend" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: resendKey,
								onChange: (e) => setResendKey(e.target.value),
								placeholder: hasSavedResendKey ? "•••••••• (chave salva — preencha só para trocar)" : "re_xxxxxxxxxxxxxxxxxxxx",
								autoComplete: "off"
							}),
							hasSavedResendKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-state-paid",
								children: "✓ Uma API key já está salva no servidor."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email remetente" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: senderEmail,
								onChange: (e) => setSenderEmail(e.target.value),
								placeholder: "noreply@seudominio.com"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Deve ser um domínio verificado no Resend. Para testes, use onboarding@resend.dev"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: saveResend,
						disabled: emailSaving,
						children: [emailSaving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Salvar configurações de email"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: "Google Calendar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Sincronize aulas PT com seu Google Calendar. Você precisará de um",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://console.cloud.google.com/apis/credentials",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "text-primary underline",
								children: "Client ID OAuth2"
							}),
							" ",
							"do Google Cloud Console com a API Calendar habilitada."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Google OAuth2 Client ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: gcalClientId,
							onChange: (e) => setGcalClientId(e.target.value),
							placeholder: "xxxx.apps.googleusercontent.com"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "API Key (opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: gcalApiKey,
							onChange: (e) => setGcalApiKey(e.target.value),
							placeholder: "AIza..."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ID do Calendário" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: gcalId,
								onChange: (e) => setGcalId(e.target.value),
								placeholder: "primary (ou email@gmail.com)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Use \"primary\" para o calendário principal da sua conta Google."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: saveGcal,
						children: "Salvar configurações do Calendar"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-muted-foreground mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-semibold",
								children: "Chave de IA (BYOK)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Use sua própria chave de API do Gemini ou outro provedor de IA. A chave é armazenada apenas neste dispositivo e nunca enviada ao nosso servidor."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "API Key do Gemini / OpenAI" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: showAiApiKey ? "text" : "password",
									value: aiApiKey,
									onChange: (e) => setAiApiKey(e.target.value),
									placeholder: "AIza... ou sk-...",
									autoComplete: "off",
									className: "pr-10"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowAiApiKey((v) => !v),
									className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
									"aria-label": showAiApiKey ? "Ocultar chave" : "Mostrar chave",
									children: showAiApiKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								})]
							}),
							typeof window !== "undefined" && localStorage.getItem("edufinance.aiApiKey") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-state-paid",
								children: "✓ Chave salva neste dispositivo."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Obtenha sua chave em",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://aistudio.google.com/apikey",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-primary underline",
										children: "Google AI Studio"
									}),
									" ",
									"ou",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://platform.openai.com/api-keys",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-primary underline",
										children: "OpenAI"
									}),
									"."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: saveAiKey,
						children: "Salvar chave de IA"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "h-5 w-5 text-muted-foreground mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: "Diagnóstico do sistema"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Verifique o estado das integrações, permissões e dados do seu studio. Use para depurar problemas."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/diagnostics",
						children: "Abrir diagnóstico"
					})
				})]
			})
		]
	});
}
function StudioCheckinSettings() {
	const { user } = useAuth();
	const qc = useQueryClient();
	const { data: settings, isLoading } = useQuery({
		queryKey: ["studio-settings", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data } = await supabase.from("studio_settings").select("*").eq("user_id", user.id).maybeSingle();
			return data ?? {
				allow_multi_checkin_same_program_per_day: false,
				default_checkin_opens_minutes_before: 60,
				default_checkin_closes_minutes_before: 15,
				checkin_week_start_day: 0
			};
		}
	});
	const [allowMulti, setAllowMulti] = (0, import_react.useState)(false);
	const [opens, setOpens] = (0, import_react.useState)(60);
	const [closes, setCloses] = (0, import_react.useState)(15);
	const [weekStart, setWeekStart] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (settings) {
			setAllowMulti(!!settings.allow_multi_checkin_same_program_per_day);
			setOpens(settings.default_checkin_opens_minutes_before ?? 60);
			setCloses(settings.default_checkin_closes_minutes_before ?? 15);
			setWeekStart(settings.checkin_week_start_day ?? 0);
		}
	}, [settings]);
	async function save() {
		if (!user) return;
		const { error } = await supabase.from("studio_settings").upsert({
			user_id: user.id,
			allow_multi_checkin_same_program_per_day: allowMulti,
			default_checkin_opens_minutes_before: opens,
			default_checkin_closes_minutes_before: closes,
			checkin_week_start_day: weekStart
		}, { onConflict: "user_id" });
		if (error) return toast.error(error.message);
		toast.success("Regras de check-in salvas");
		qc.invalidateQueries({ queryKey: ["studio-settings"] });
	}
	if (isLoading) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-semibold",
				children: "Regras de check-in"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Estas regras se aplicam ao check-in dos alunos nas turmas do studio."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-start gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "mt-1",
					checked: allowMulti,
					onChange: (e) => setAllowMulti(e.target.checked)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: "Permitir múltiplos check-ins por dia no mesmo programa"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: "Quando desligado, o aluno só pode fazer 1 check-in por dia dentro de cada programa (ex: 1x Muay Thai, 1x Funcional)."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Padrão: abre X min antes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 0,
						value: opens,
						onChange: (e) => setOpens(Number(e.target.value))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Padrão: fecha X min antes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 0,
						value: closes,
						onChange: (e) => setCloses(Number(e.target.value))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Dia de abertura/resete semanal de check-ins" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: String(weekStart),
						onValueChange: (v) => setWeekStart(Number(v)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o dia" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "0",
								children: "Domingo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "1",
								children: "Segunda-feira"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "2",
								children: "Terça-feira"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "3",
								children: "Quarta-feira"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "4",
								children: "Quinta-feira"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "5",
								children: "Sexta-feira"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "6",
								children: "Sábado"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground",
						children: "Define quando a contagem semanal de check-ins reinicia e libera a próxima semana."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Esses valores servem como sugestão ao criar novas turmas. Cada turma pode ter valores próprios."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: save,
				children: "Salvar regras"
			})
		]
	});
}
function FontSizeSetting() {
	const { size, setSize } = useFontSize();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-medium",
			children: "Tamanho da fonte"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: "Aumente a fonte se estiver com dificuldade para ler no celular."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value: size,
			onValueChange: (v) => setSize(v),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				className: "h-10 w-full sm:w-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
				"sm",
				"md",
				"lg",
				"xl"
			].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
				value: k,
				children: [
					FONT_SIZE_LABEL[k],
					" — ",
					FONT_SIZE_PX[k],
					"px"
				]
			}, k)) })]
		})]
	});
}
function VisualThemeSelector() {
	const { visualTheme, changeVisualTheme, theme } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 border-t pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-medium",
			children: "Tema Visual"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: "Escolha a linguagem visual e paleta de cores aplicada em todo o sistema."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
			children: [
				{
					id: "padrao",
					label: "Padrão",
					description: "Interface clássica e limpa em azul profissional.",
					primary: "#3B82F6",
					bg: theme === "dark" ? "#18181B" : "#F8FAFC",
					border: theme === "dark" ? "#27272A" : "#E2E8F0"
				},
				{
					id: "pulse",
					label: "Pulse",
					description: "Estilo atlético com alta energia, laranja vibrante e pills.",
					primary: "#FF6B00",
					bg: theme === "dark" ? "#0A0A0C" : "#FAFAF8",
					border: theme === "dark" ? "#232328" : "#E4E4E7"
				},
				{
					id: "midnight",
					label: "Midnight Fintech",
					description: "Linguagem fintech moderna com violeta, ciano e glow refinado.",
					primary: "#6958E2",
					gradient: "linear-gradient(90deg, #6958E2 20%, #7317D5)",
					bg: theme === "dark" ? "#050A14" : "#F8F9FE",
					border: theme === "dark" ? "#171E2C" : "#E2E6F2",
					glow: theme === "dark" ? "radial-gradient(circle at 80% 20%, rgba(83, 73, 126, 0.45), transparent 70%), radial-gradient(circle at 20% 80%, rgba(56, 152, 236, 0.2), transparent 70%)" : "radial-gradient(circle at 80% 20%, rgba(105, 88, 226, 0.12), transparent 70%), radial-gradient(circle at 20% 80%, rgba(56, 152, 236, 0.08), transparent 70%)"
				}
			].map((t) => {
				const isSelected = visualTheme === t.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => changeVisualTheme(t.id),
					className: cn("group relative flex flex-col items-start gap-2.5 rounded-xl border-2 p-3.5 text-left transition-all hover:border-primary/50 no-pill", isSelected ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20" : "border-border bg-card hover:bg-accent/40"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-14 w-full rounded-lg overflow-hidden flex flex-col justify-between p-2",
						style: {
							backgroundColor: t.bg,
							backgroundImage: t.glow ?? "none",
							border: `1px solid ${t.border}`
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-10 rounded-full",
							style: {
								background: t.gradient ?? t.primary,
								boxShadow: t.id === "midnight" ? "0 0 8px rgba(105, 88, 226, 0.6)" : "none"
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1.5 opacity-60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-6 rounded-full bg-current opacity-30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-4 rounded-full bg-current opacity-20" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full space-y-0.5 px-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold tracking-tight",
								children: t.label
							}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold",
								children: "✓"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] leading-snug text-muted-foreground line-clamp-2",
							children: t.description
						})]
					})]
				}, t.id);
			})
		})]
	});
}
function LandingPageSetting() {
	const options = useLandingOptions();
	const [value, setValue] = (0, import_react.useState)(typeof window !== "undefined" ? localStorage.getItem("edufinance.landingPage") ?? "/" : "/");
	const safeValue = options.some((o) => o.path === value) ? value : "/";
	function onChange(v) {
		setValue(v);
		localStorage.setItem(LANDING_STORAGE_KEY, v);
		sessionStorage.removeItem(LANDING_REDIRECT_FLAG);
		toast.success("Tela inicial atualizada");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-medium",
			children: "Tela inicial"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: "O app abrirá nesta tela ao carregar. Você pode navegar livremente depois."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value: safeValue,
			onValueChange: onChange,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				className: "h-10 w-full sm:w-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: o.path,
				children: o.label
			}, o.path)) })]
		})]
	});
}
function ProfileModeSetting() {
	const { isSuperAdmin, loading } = useRole();
	const { mode, setMode } = useProfileMode();
	const qc = useQueryClient();
	if (loading || !isSuperAdmin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5 border-t pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" }), " Modo de acesso"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Alterne entre visão de super_admin (com escopo entre treinadores) e admin (agindo apenas sobre seus próprios dados)."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: mode,
				onValueChange: (v) => {
					setMode(v);
					qc.invalidateQueries();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "w-full max-w-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "super_admin",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5" }), " Super admin (edição e suporte)"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "admin",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-3.5 w-3.5" }), " Admin (meu perfil do sistema)"]
					})
				})] })]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
