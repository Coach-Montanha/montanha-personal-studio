import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BymSQoye.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/confirm-dialog-loCJ8q2f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var setPendingExternal = null;
function confirmDialog(descriptionOrOptions) {
	if (typeof window === "undefined") return Promise.resolve(false);
	const opts = typeof descriptionOrOptions === "string" ? { description: descriptionOrOptions } : descriptionOrOptions;
	return new Promise((resolve) => {
		if (!setPendingExternal) {
			resolve(window.confirm(opts.description ?? ""));
			return;
		}
		setPendingExternal({
			...opts,
			resolve
		});
	});
}
function ConfirmDialogHost() {
	const [pending, setPending] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setPendingExternal = setPending;
		return () => {
			setPendingExternal = null;
		};
	}, []);
	const close = (result) => {
		if (pending) pending.resolve(result);
		setPending(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: !!pending,
		onOpenChange: (o) => !o && close(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: pending?.title ?? "Coach Montanha diz" }), pending?.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
			className: "whitespace-pre-line",
			children: pending.description
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
			onClick: () => close(false),
			children: pending?.cancelLabel ?? "Cancelar"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
			onClick: () => close(true),
			className: pending?.destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : void 0,
			children: pending?.confirmLabel ?? "OK"
		})] })] })
	});
}
//#endregion
export { confirmDialog as n, ConfirmDialogHost as t };
