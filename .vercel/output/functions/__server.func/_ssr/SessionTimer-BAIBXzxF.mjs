import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { K as Play, V as RotateCcw, dn as ChevronUp, et as Pause, mn as ChevronDown, x as Timer } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SessionTimer-BAIBXzxF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatSeconds(seconds) {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor(seconds % 3600 / 60);
	const s = seconds % 60;
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function playBeep() {
	try {
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		const beep = (freq, start, dur) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.value = freq;
			osc.connect(gain);
			gain.connect(ctx.destination);
			gain.gain.setValueAtTime(0, ctx.currentTime + start);
			gain.gain.linearRampToValueAtTime(.3, ctx.currentTime + start + .02);
			gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
			osc.start(ctx.currentTime + start);
			osc.stop(ctx.currentTime + start + dur);
		};
		beep(880, 0, .35);
		beep(1175, .4, .35);
		beep(880, .8, .45);
		setTimeout(() => ctx.close(), 1500);
	} catch {}
}
function SessionTimer({ seconds = 0, setSeconds, running = false, setRunning, onReset, variant = "hero", className }) {
	const [internalSeconds, setInternalSeconds] = (0, import_react.useState)(0);
	const [internalRunning, setInternalRunning] = (0, import_react.useState)(false);
	const [isCollapsed, setIsCollapsed] = (0, import_react.useState)(false);
	const currentSeconds = setSeconds ? seconds : internalSeconds;
	const currentRunning = setRunning ? running : internalRunning;
	const setCurrentSeconds = setSeconds || setInternalSeconds;
	const setCurrentRunning = setRunning || setInternalRunning;
	const lastAlertRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!currentRunning) return;
		const startedAt = Date.now() - currentSeconds * 1e3;
		const id = window.setInterval(() => {
			const next = Math.floor((Date.now() - startedAt) / 1e3);
			setCurrentSeconds(next);
			const hoursDone = Math.floor(next / 3600);
			if (hoursDone > lastAlertRef.current && next > 0) {
				lastAlertRef.current = hoursDone;
				playBeep();
				toast.info(`Sessão em andamento: ${hoursDone}h completada`);
			}
		}, 1e3);
		return () => window.clearInterval(id);
	}, [currentRunning]);
	function reset() {
		setCurrentRunning(false);
		setCurrentSeconds(0);
		lastAlertRef.current = 0;
		onReset?.();
	}
	if (variant === "compact" || isCollapsed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative flex items-center justify-between gap-2.5 rounded-2xl border border-border/80 bg-card/95 p-2.5 sm:p-3 shadow-xs backdrop-blur-md transition-all duration-200 min-w-0 max-w-full overflow-hidden", currentRunning && "border-emerald-500/30 ring-1 ring-emerald-500/20", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: cn("absolute inset-x-0 top-0 h-1 transition-all duration-300", currentRunning ? "bg-gradient-to-r from-emerald-500 via-primary to-emerald-400" : currentSeconds > 0 ? "bg-amber-500/70" : "bg-muted")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2.5 w-2.5 rounded-full shrink-0", currentRunning ? "bg-emerald-500 animate-ping" : currentSeconds > 0 ? "bg-amber-500" : "bg-muted-foreground/60") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-2xl sm:text-3xl font-black tabular-nums tracking-tight text-foreground leading-none",
					children: formatSeconds(currentSeconds)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						className: cn("h-9 px-3 rounded-xl text-xs font-bold transition-all active:scale-95", currentRunning ? "bg-amber-500 text-white hover:bg-amber-600" : currentSeconds > 0 ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-primary text-primary-foreground hover:bg-primary/90"),
						onClick: () => setCurrentRunning(!currentRunning),
						children: currentRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-3.5 w-3.5 mr-1" }), " Pausar"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5 mr-1" }),
							" ",
							currentSeconds === 0 ? "Iniciar" : "Retomar"
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						onClick: reset,
						disabled: currentSeconds === 0 && !currentRunning,
						className: "h-9 w-9 p-0 rounded-xl border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground",
						title: "Zerar cronômetro",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" })
					}),
					variant !== "compact" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIsCollapsed(false),
						className: "h-9 w-9 grid place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors",
						title: "Expandir cronômetro gigante",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-border/80 bg-card/95 p-3.5 sm:p-5 shadow-sm backdrop-blur-md transition-all duration-200 min-w-0 max-w-full overflow-hidden", currentRunning && "border-emerald-500/30 ring-1 ring-emerald-500/20", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: cn("absolute inset-x-0 top-0 h-1 transition-all duration-300", currentRunning ? "bg-gradient-to-r from-emerald-500 via-primary to-emerald-400" : currentSeconds > 0 ? "bg-amber-500/70" : "bg-muted")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full items-center justify-between min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: cn("h-4 w-4 shrink-0 transition-colors", currentRunning ? "text-emerald-500 animate-pulse" : "text-muted-foreground") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground",
						children: "Cronômetro do treino"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase transition-all duration-200", currentRunning ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : currentSeconds > 0 ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400" : "border-border bg-muted/60 text-muted-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2 w-2 rounded-full", currentRunning ? "bg-emerald-500 animate-ping" : currentSeconds > 0 ? "bg-amber-500" : "bg-muted-foreground/60") }), currentRunning ? "Gravando" : currentSeconds > 0 ? "Pausado" : "Pronto"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIsCollapsed(true),
						className: "h-6 w-6 grid place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
						title: "Recolher para barra compacta",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3.5 w-3.5" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full py-0.5 text-center select-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-4xl sm:text-5xl md:text-6xl font-black tabular-nums tracking-tight text-foreground leading-none",
					children: formatSeconds(currentSeconds)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full items-center justify-center gap-2 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "lg",
					className: cn("flex-1 h-11 sm:h-12 rounded-xl text-sm sm:text-base font-bold shadow-sm transition-all duration-150 active:scale-[0.98]", currentRunning ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20" : currentSeconds > 0 ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20" : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"),
					onClick: () => setCurrentRunning(!currentRunning),
					children: currentRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "mr-1.5 h-5 w-5" }), " Pausar"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-1.5 h-5 w-5" }),
						" ",
						currentSeconds === 0 ? "Iniciar Treino" : "Retomar"
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "lg",
					variant: "outline",
					onClick: reset,
					disabled: currentSeconds === 0 && !currentRunning,
					className: "h-11 sm:h-12 px-4 rounded-xl text-sm font-semibold border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground active:scale-[0.98] transition-all shrink-0",
					title: "Zerar cronômetro",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 sm:mr-1.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Zerar"
					})]
				})]
			})
		]
	});
}
//#endregion
export { formatSeconds as n, SessionTimer as t };
