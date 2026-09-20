import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { G as Plus, K as Play, V as RotateCcw, a as Volume2, et as Pause, i as VolumeX, n as X, ot as Minus, x as Timer } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TrainingTimerDialog-D0y9wxVP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function playSound(freq, duration = .15, type = "sine") {
	try {
		const AudioCtx = window.AudioContext || window.webkitAudioContext;
		if (!AudioCtx) return;
		const ctx = new AudioCtx();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, ctx.currentTime);
		osc.connect(gain);
		gain.connect(ctx.destination);
		gain.gain.setValueAtTime(0, ctx.currentTime);
		gain.gain.linearRampToValueAtTime(.35, ctx.currentTime + .01);
		gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
		osc.start(ctx.currentTime);
		osc.stop(ctx.currentTime + duration);
		setTimeout(() => {
			try {
				ctx.close();
			} catch {}
		}, (duration + .5) * 1e3);
	} catch {}
}
function TrainingTimerDialog({ open, onOpenChange, defaultMode = "EMOM" }) {
	const [mode, setMode] = (0, import_react.useState)(defaultMode);
	const [soundEnabled, setSoundEnabled] = (0, import_react.useState)(true);
	const [totalMinutes, setTotalMinutes] = (0, import_react.useState)(10);
	const [tabataRounds, setTabataRounds] = (0, import_react.useState)(8);
	const [tabataWorkSec, setTabataWorkSec] = (0, import_react.useState)(20);
	const [tabataRestSec, setTabataRestSec] = (0, import_react.useState)(10);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [secondsLeft, setSecondsLeft] = (0, import_react.useState)(60);
	const [currentMinute, setCurrentMinute] = (0, import_react.useState)(1);
	const [amrapRounds, setAmrapRounds] = (0, import_react.useState)(0);
	const [currentTabataRound, setCurrentTabataRound] = (0, import_react.useState)(1);
	const [isTabataWork, setIsTabataWork] = (0, import_react.useState)(true);
	const [livreSeconds, setLivreSeconds] = (0, import_react.useState)(0);
	const intervalRef = (0, import_react.useRef)(null);
	const triggerBeep = (freq, dur = .15) => {
		if (soundEnabled) playSound(freq, dur);
	};
	const resetTimer = () => {
		setRunning(false);
		if (intervalRef.current) clearInterval(intervalRef.current);
		if (mode === "EMOM") {
			setSecondsLeft(60);
			setCurrentMinute(1);
		} else if (mode === "AMRAP") {
			setSecondsLeft(Math.max(1, totalMinutes) * 60);
			setAmrapRounds(0);
		} else if (mode === "Tabata") {
			setIsTabataWork(true);
			setCurrentTabataRound(1);
			setSecondsLeft(tabataWorkSec);
		} else if (mode === "Livre") setLivreSeconds(0);
	};
	(0, import_react.useEffect)(() => {
		resetTimer();
	}, [
		mode,
		totalMinutes,
		tabataRounds,
		tabataWorkSec,
		tabataRestSec
	]);
	(0, import_react.useEffect)(() => {
		if (!running) {
			if (intervalRef.current) clearInterval(intervalRef.current);
			return;
		}
		intervalRef.current = setInterval(() => {
			if (mode === "Livre") {
				setLivreSeconds((prev) => prev + 1);
				return;
			}
			setSecondsLeft((prev) => {
				if (prev <= 4 && prev > 1) triggerBeep(600, .1);
				if (prev <= 1) {
					if (mode === "EMOM") {
						if (currentMinute >= totalMinutes) {
							triggerBeep(1200, .5);
							setRunning(false);
							return 0;
						}
						triggerBeep(950, .35);
						setCurrentMinute((m) => m + 1);
						return 60;
					}
					if (mode === "AMRAP") {
						triggerBeep(1200, .6);
						setRunning(false);
						return 0;
					}
					if (mode === "Tabata") if (isTabataWork) {
						triggerBeep(800, .3);
						setIsTabataWork(false);
						return tabataRestSec;
					} else {
						if (currentTabataRound >= tabataRounds) {
							triggerBeep(1200, .6);
							setRunning(false);
							return 0;
						}
						triggerBeep(1e3, .35);
						setIsTabataWork(true);
						setCurrentTabataRound((r) => r + 1);
						return tabataWorkSec;
					}
				}
				return prev - 1;
			});
		}, 1e3);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [
		running,
		mode,
		currentMinute,
		totalMinutes,
		isTabataWork,
		currentTabataRound,
		tabataRounds,
		tabataWorkSec,
		tabataRestSec,
		soundEnabled
	]);
	const formatTime = (secs) => {
		const m = Math.floor(secs / 60);
		const s = secs % 60;
		return `${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
	};
	const displayTime = mode === "Livre" ? formatTime(livreSeconds) : formatTime(secondsLeft);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[95vw] max-w-md rounded-2xl bg-zinc-950 text-white border border-zinc-800/90 p-5 sm:p-6 shadow-2xl overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/25 text-orange-500 shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-5 w-5 stroke-[2.2]" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-lg font-bold tracking-tight text-orange-500",
							children: "Timer de Treino"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSoundEnabled(!soundEnabled),
							title: soundEnabled ? "Som ativado" : "Som desativado",
							"aria-label": soundEnabled ? "Som ativado" : "Som desativado",
							className: "flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors",
							children: soundEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-5 w-5 text-zinc-600" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onOpenChange(false),
							"aria-label": "Fechar",
							className: "flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid grid-cols-4 gap-1 rounded-xl bg-zinc-900/80 p-1 border border-zinc-800/80",
					children: [
						"EMOM",
						"AMRAP",
						"Tabata",
						"Livre"
					].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setMode(m);
							resetTimer();
						},
						className: cn("h-9 rounded-lg text-xs font-semibold transition-all select-none", mode === m ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"),
						children: m
					}, m))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-7 relative overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-16 -right-16 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2",
							children: [
								mode === "EMOM" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-zinc-800/90 border border-zinc-700/60 px-3.5 py-1 text-xs font-medium text-zinc-300",
									children: [
										"Minuto ",
										currentMinute,
										" de ",
										totalMinutes
									]
								}),
								mode === "AMRAP" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-zinc-800/90 border border-zinc-700/60 px-3.5 py-1 text-xs font-medium text-zinc-300",
									children: [
										"Tempo Restante • ",
										amrapRounds,
										" ",
										amrapRounds === 1 ? "round" : "rounds"
									]
								}),
								mode === "Tabata" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors", isTabataWork ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"),
									children: [
										"Round ",
										currentTabataRound,
										" de ",
										tabataRounds,
										" • ",
										isTabataWork ? "WORK" : "REST"
									]
								}),
								mode === "Livre" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-zinc-800/90 border border-zinc-700/60 px-3.5 py-1 text-xs font-medium text-zinc-300",
									children: "Cronômetro Livre"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-5xl sm:text-6xl font-mono font-black tracking-tight text-white select-none my-1 tabular-nums",
							children: displayTime
						}),
						mode === "AMRAP" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setAmrapRounds((r) => Math.max(0, r - 1)),
									className: "flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold uppercase tracking-wider text-zinc-300",
									children: [amrapRounds, " Rounds"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setAmrapRounds((r) => r + 1);
										triggerBeep(880, .1);
									},
									className: "flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
								})
							]
						})
					]
				}),
				(mode === "EMOM" || mode === "AMRAP") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between rounded-xl bg-zinc-900/50 border border-zinc-800/80 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-zinc-300",
						children: "Duração total (minutos):"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							max: 120,
							value: totalMinutes,
							disabled: running,
							onChange: (e) => setTotalMinutes(Math.max(1, Number(e.target.value) || 1)),
							className: "h-9 w-20 text-center font-mono font-bold bg-zinc-900 border-zinc-700 text-white rounded-lg focus:ring-orange-500"
						})
					})]
				}),
				mode === "Tabata" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-3 gap-2 rounded-xl bg-zinc-900/50 border border-zinc-800/80 p-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-zinc-400 uppercase font-bold",
							children: "Rounds"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							max: 50,
							value: tabataRounds,
							disabled: running,
							onChange: (e) => setTabataRounds(Math.max(1, Number(e.target.value) || 1)),
							className: "h-8 mt-1 text-center font-mono font-bold bg-zinc-900 border-zinc-700 text-white rounded-lg text-xs"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-emerald-400 uppercase font-bold",
							children: "Work (s)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 5,
							max: 300,
							value: tabataWorkSec,
							disabled: running,
							onChange: (e) => setTabataWorkSec(Math.max(1, Number(e.target.value) || 1)),
							className: "h-8 mt-1 text-center font-mono font-bold bg-zinc-900 border-zinc-700 text-emerald-400 rounded-lg text-xs"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-amber-400 uppercase font-bold",
							children: "Rest (s)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							max: 180,
							value: tabataRestSec,
							disabled: running,
							onChange: (e) => setTabataRestSec(Math.max(0, Number(e.target.value) || 0)),
							className: "h-8 mt-1 text-center font-mono font-bold bg-zinc-900 border-zinc-700 text-amber-400 rounded-lg text-xs"
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						onClick: resetTimer,
						className: "h-12 rounded-xl border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 font-semibold gap-2 transition-all active:scale-[0.98]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 text-zinc-400" }), "Reiniciar"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => {
							if (!running) triggerBeep(900, .2);
							setRunning(!running);
						},
						className: cn("h-12 rounded-xl text-white font-bold gap-2 transition-all active:scale-[0.98] shadow-lg", running ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20" : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/25"),
						children: running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-4 w-4 fill-current" }), " Pausar"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current" }), " Iniciar"] })
					})]
				})
			]
		})
	});
}
//#endregion
export { TrainingTimerDialog as t };
