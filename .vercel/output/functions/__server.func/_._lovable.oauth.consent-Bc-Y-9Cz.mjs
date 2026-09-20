import { o as __toESM } from "./_runtime.mjs";
import { i as require_react } from "./_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "./_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _t as LoaderCircle } from "./_libs/lucide-react.mjs";
import { t as Button } from "./_ssr/button-C0L5fFXX.mjs";
import { t as Card } from "./_ssr/card-BQ4bpKnp.mjs";
import { n as oauth, t as Route } from "./_._lovable.oauth.consent-AYP6ZP_0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_._lovable.oauth.consent-Bc-Y-9Cz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Consent() {
	const details = Route.useLoaderData();
	const { authorization_id } = Route.useSearch();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const clientName = details?.client?.name ?? "esse aplicativo";
	async function decide(approve) {
		setBusy(approve ? "approve" : "deny");
		setError(null);
		const { data, error } = approve ? await oauth.approveAuthorization(authorization_id) : await oauth.denyAuthorization(authorization_id);
		if (error) {
			setBusy(null);
			setError(error.message);
			return;
		}
		const target = data?.redirect_url ?? data?.redirect_to;
		if (!target) {
			setBusy(null);
			setError("O servidor de autorização não retornou uma URL de redirecionamento.");
			return;
		}
		window.location.href = target;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto flex min-h-screen max-w-md items-center p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full space-y-4 p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-xl font-semibold",
					children: [
						"Conectar ",
						clientName,
						" à sua conta"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: [
						"Isto permite que ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: clientName }),
						" use este app como você, acessando somente os seus alunos, pagamentos e resumos financeiros. As permissões do app e as políticas do banco continuam valendo."
					]
				})] }),
				details?.client?.client_uri && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: ["Origem do cliente: ", details.client.client_uri]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-sm text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row-reverse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => decide(true),
						disabled: busy !== null,
						className: "sm:flex-1",
						children: [busy === "approve" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Aprovar e conectar"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => decide(false),
						disabled: busy !== null,
						className: "sm:flex-1",
						children: [busy === "deny" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Cancelar conexão"]
					})]
				})
			]
		})
	});
}
//#endregion
export { Consent as component };
