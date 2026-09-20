import { i as parseISO, s as format, t as ptBR } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-BT-nao3-.js
var BRL = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL"
});
var formatBRL = (value) => {
	const n = typeof value === "string" ? Number(value) : value ?? 0;
	return BRL.format(Number.isFinite(n) ? n : 0);
};
var formatDateBR = (value) => {
	if (!value) return "—";
	return format(typeof value === "string" ? parseISO(value) : value, "dd/MM/yyyy", { locale: ptBR });
};
var formatMonthLabel = (refMonth) => {
	const [y, m] = refMonth.split("-").map(Number);
	return format(new Date(y, (m ?? 1) - 1, 1), "MMM/yy", { locale: ptBR });
};
var formatMonthLong = (refMonth) => {
	const [y, m] = refMonth.split("-").map(Number);
	return format(new Date(y, (m ?? 1) - 1, 1), "MMMM 'de' yyyy", { locale: ptBR });
};
var monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
var currentMonthKey = () => monthKey(/* @__PURE__ */ new Date());
var addMonths$1 = (refMonth, delta) => {
	const [y, m] = refMonth.split("-").map(Number);
	return monthKey(new Date(y, (m ?? 1) - 1 + delta, 1));
};
var paymentMethodLabel = (m) => {
	return {
		pix: "PIX",
		credit_card: "Cartão de Crédito",
		debit_card: "Cartão de Débito",
		bank_slip: "Boleto",
		cash: "Dinheiro",
		transfer: "Transferência"
	}[m] ?? m;
};
var billingCycleLabel = (c) => {
	return {
		monthly: "Mensal",
		quarterly: "Trimestral",
		semiannual: "Semestral",
		annual: "Anual"
	}[c] ?? c;
};
var statusLabel = {
	payment: {
		paid: "Pago",
		pending: "Pendente",
		overdue: "Atrasado",
		cancelled: "Cancelado"
	},
	student: {
		active: "Ativo",
		inactive: "Inativo",
		churned: "Desligado"
	}
};
var initials = (name) => name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
var formatPhoneBR = (input) => {
	const d = (input ?? "").replace(/\D/g, "").slice(0, 11);
	if (d.length === 0) return "";
	if (d.length <= 2) return `(${d}`;
	if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
	if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
	return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};
//#endregion
export { formatDateBR as a, formatPhoneBR as c, statusLabel as d, formatBRL as i, initials as l, billingCycleLabel as n, formatMonthLabel as o, currentMonthKey as r, formatMonthLong as s, addMonths$1 as t, paymentMethodLabel as u };
