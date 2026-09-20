import { M as require_jsx_runtime } from "./_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Card } from "./_ssr/card-BQ4bpKnp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_._lovable.oauth.consent-C7KIV-gA.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
	className: "mx-auto max-w-md p-6",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-lg font-semibold",
			children: "Não foi possível carregar a autorização"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: String(error?.message ?? error)
		})]
	})
});
//#endregion
export { SplitErrorComponent as errorComponent };
