import { t as supabase } from "./client-CCQALzHq.mjs";
import { u as paymentMethodLabel } from "./format-BT-nao3-.mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-payment-methods-Ch_8GI_2.js
var DEFAULT_PAYMENT_METHODS = [
	{
		key: "pix",
		label: "PIX"
	},
	{
		key: "credit_card",
		label: "Cartão de Crédito"
	},
	{
		key: "debit_card",
		label: "Cartão de Débito"
	},
	{
		key: "bank_slip",
		label: "Boleto"
	},
	{
		key: "cash",
		label: "Dinheiro"
	},
	{
		key: "transfer",
		label: "Transferência"
	}
];
function usePaymentMethods(opts = {}) {
	const query = useQuery({
		queryKey: ["payment-methods"],
		queryFn: async () => {
			const { data, error } = await supabase.from("payment_methods").select("id,key,label,is_active,sort_order").order("sort_order", { ascending: true }).order("label", { ascending: true });
			if (error) throw error;
			return data ?? [];
		},
		staleTime: 6e4
	});
	const methods = query.data ?? [];
	const filtered = opts.activeOnly ? methods.filter((m) => m.is_active) : methods;
	const labelMap = /* @__PURE__ */ new Map();
	for (const m of methods) labelMap.set(m.key, m.label);
	return {
		...query,
		methods: filtered,
		all: methods,
		labelFor: (key) => key ? labelMap.get(key) ?? paymentMethodLabel(key) : "—"
	};
}
//#endregion
export { usePaymentMethods as n, DEFAULT_PAYMENT_METHODS as t };
