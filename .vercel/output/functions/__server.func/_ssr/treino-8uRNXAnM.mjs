import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { G as Plus, H as RotateCcwClock, In as ArrowRightLeft, K as Play, Kt as Dumbbell, Ln as ArrowLeft, Ut as EyeOff, V as RotateCcw, et as Pause, fn as ChevronRight, hn as Check, n as X, nn as ClipboardList, ot as Minus, sn as CircleCheck, v as TrendingUp, w as Target, x as Timer, xn as CalendarDays } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as formatDateBR } from "./format-BT-nao3-.mjs";
import { t as useAuth } from "./use-auth-ChcWg5G-.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { n as formatSeconds, t as SessionTimer } from "./SessionTimer-BAIBXzxF.mjs";
import { t as WorkoutSummaryDialog } from "./WorkoutSummaryDialog-EMqTb5_R.mjs";
import { t as useWakeLock } from "./use-wake-lock-PVcvsvFx.mjs";
import { t as WorkoutProgressionDialog } from "./WorkoutProgressionDialog-DDwALhVZ.mjs";
import { i as getStudentAnamnesis, r as extractClinicalAlerts, t as ClinicalAlertBadge } from "./ClinicalAlertBadge-DvxlxBCj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/treino-8uRNXAnM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function playCompletionChime() {
	try {
		const AudioCtx = window.AudioContext || window.webkitAudioContext;
		if (!AudioCtx) return;
		const ctx = new AudioCtx();
		const playTone = (freq, start, dur) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.value = freq;
			osc.connect(gain);
			gain.connect(ctx.destination);
			gain.gain.setValueAtTime(0, ctx.currentTime + start);
			gain.gain.linearRampToValueAtTime(.35, ctx.currentTime + start + .02);
			gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
			osc.start(ctx.currentTime + start);
			osc.stop(ctx.currentTime + start + dur);
		};
		playTone(523.25, 0, .25);
		playTone(659.25, .15, .25);
		playTone(783.99, .3, .4);
		playTone(1046.5, .45, .5);
		setTimeout(() => ctx.close(), 1800);
	} catch {}
	if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) try {
		navigator.vibrate([
			200,
			100,
			200,
			100,
			300
		]);
	} catch {}
}
function parseSafeSeconds(val, fallback = 60) {
	if (typeof val === "number" && !isNaN(val) && val > 0) return Math.round(val);
	if (typeof val === "string") {
		const cleaned = val.replace(/\D/g, "");
		const parsed = parseInt(cleaned, 10);
		if (!isNaN(parsed) && parsed > 0) return parsed;
	}
	return fallback;
}
function RestCountdownTimer({ active, initialSeconds = 60, exerciseName, currentSet, totalSets, onComplete, onDismiss, className }) {
	const safeInit = parseSafeSeconds(initialSeconds, 60);
	const [totalTime, setTotalTime] = (0, import_react.useState)(safeInit);
	const [remaining, setRemaining] = (0, import_react.useState)(safeInit);
	const [isRunning, setIsRunning] = (0, import_react.useState)(true);
	const hasFinishedRef = (0, import_react.useRef)(false);
	const lastTriggerKeyRef = (0, import_react.useRef)("");
	const triggerKey = `${active ? "1" : "0"}_${exerciseName || ""}_${currentSet ?? 0}_${safeInit}`;
	(0, import_react.useEffect)(() => {
		if (active) {
			if (lastTriggerKeyRef.current !== triggerKey) {
				lastTriggerKeyRef.current = triggerKey;
				const sec = parseSafeSeconds(initialSeconds, 60);
				setTotalTime(sec);
				setRemaining(sec);
				setIsRunning(true);
				hasFinishedRef.current = false;
			}
		} else lastTriggerKeyRef.current = "";
	}, [
		active,
		triggerKey,
		initialSeconds
	]);
	(0, import_react.useEffect)(() => {
		if (!active || !isRunning) return;
		if (remaining <= 0) {
			if (!hasFinishedRef.current) {
				hasFinishedRef.current = true;
				playCompletionChime();
				toast.success("Descanso concluído! Bora para a próxima série 💪", { icon: "⏰" });
				onComplete?.();
			}
			return;
		}
		const timer = setInterval(() => {
			setRemaining((prev) => {
				return Math.max(0, (typeof prev === "number" && !isNaN(prev) ? prev : safeInit) - 1);
			});
		}, 1e3);
		return () => clearInterval(timer);
	}, [
		active,
		isRunning,
		remaining,
		onComplete,
		safeInit
	]);
	if (!active) return null;
	const validRemaining = typeof remaining === "number" && !isNaN(remaining) && remaining >= 0 ? remaining : 0;
	const progressPercent = Math.max(0, Math.min(100, validRemaining / (typeof totalTime === "number" && !isNaN(totalTime) && totalTime > 0 ? totalTime : Math.max(1, validRemaining)) * 100));
	const minutes = Math.floor(validRemaining / 60);
	const seconds = validRemaining % 60;
	const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	const adjustTime = (delta) => {
		const deltaNum = Number(delta) || 0;
		setRemaining((prev) => {
			const next = Math.max(5, (typeof prev === "number" && !isNaN(prev) ? prev : safeInit) + deltaNum);
			setTotalTime((currTot) => {
				return Math.max(next, typeof currTot === "number" && !isNaN(currTot) ? currTot : next);
			});
			return next;
		});
	};
	const setPreset = (sec) => {
		const cleanSec = parseSafeSeconds(sec, 60);
		setTotalTime(cleanSec);
		setRemaining(cleanSec);
		setIsRunning(true);
		hasFinishedRef.current = false;
	};
	const isCompleted = validRemaining === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md", "animate-in fade-in slide-in-from-bottom-5 duration-300", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative overflow-hidden rounded-3xl border shadow-2xl p-4 sm:p-5 backdrop-blur-xl transition-all", isCompleted ? "border-emerald-500 bg-emerald-950/90 text-white shadow-emerald-500/30" : "border-primary/40 bg-zinc-950/95 text-white shadow-primary/20"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 top-0 h-1.5 bg-white/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("h-full transition-all duration-1000 ease-linear", isCompleted ? "bg-emerald-400" : "bg-gradient-to-r from-amber-500 via-primary to-emerald-400"),
						style: { width: `${progressPercent}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-3.5 w-3.5 text-primary shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate max-w-[180px] sm:max-w-[220px] text-zinc-300",
									children: exerciseName || "Descanso entre séries"
								}),
								currentSet !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary shrink-0",
									children: [
										"Série ",
										currentSet,
										totalSets ? `/${totalSets}` : ""
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-xs font-medium text-zinc-400",
							children: isCompleted ? "Pronto para recomeçar!" : "Recuperação muscular ativa"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onDismiss,
						"aria-label": "Fechar cronômetro de descanso",
						className: "rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("font-mono text-4xl sm:text-5xl font-black tabular-nums tracking-tight", isCompleted ? "text-emerald-400 animate-pulse" : "text-white"),
							children: formattedTime
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-zinc-400 uppercase tracking-wider",
							children: isCompleted ? "Fim" : "Restante"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: () => adjustTime(-15),
								disabled: remaining <= 15,
								className: "h-9 w-9 p-0 rounded-xl border-white/10 bg-white/5 hover:bg-white/15 text-white",
								title: "-15 segundos",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: () => adjustTime(15),
								className: "h-9 w-9 p-0 rounded-xl border-white/10 bg-white/5 hover:bg-white/15 text-white",
								title: "+15 segundos",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								onClick: () => setIsRunning(!isRunning),
								className: cn("h-9 px-3.5 rounded-xl font-bold text-xs gap-1.5 transition-all shadow-md active:scale-95", isRunning ? "bg-amber-500 hover:bg-amber-600 text-black" : "bg-emerald-600 hover:bg-emerald-700 text-white"),
								children: isRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-3.5 w-3.5" }), " Pausar"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5" }), " Continuar"] })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3.5 flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none",
					children: [[
						30,
						45,
						60,
						90,
						120
					].map((sec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setPreset(sec),
						className: cn("rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all shrink-0", totalTime === sec ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25" : "bg-white/10 text-zinc-300 hover:bg-white/20 hover:text-white"),
						children: [sec, "s"]
					}, sec)), isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onDismiss,
						className: "ml-auto rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all shrink-0",
						children: "Concluir ✕"
					})]
				})
			]
		})
	});
}
function parseSetCount(setsReps) {
	if (!setsReps) return 3;
	const match = setsReps.match(/^(\d+)\s*[xX]/);
	if (match) {
		const num = parseInt(match[1], 10);
		if (!isNaN(num) && num > 0 && num <= 10) return num;
	}
	return 3;
}
var CATEGORY_LABELS = {
	hypertrophy: "Hipertrofia",
	conditioning: "Condicionamento físico",
	strength: "Força",
	cardio: "Cardio",
	general: "Geral"
};
var LEVEL_LABELS = {
	beginner: "Iniciante",
	intermediate: "Intermediário",
	advanced: "Avançado"
};
function parseNotes(raw) {
	if (!raw || typeof raw !== "string") return {};
	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function isSameDay(iso, ref) {
	const d = new Date(iso);
	return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();
}
function PTTreinoPage() {
	const { user } = useAuth();
	const qc = useQueryClient();
	const [selectedDayId, setSelectedDayId] = (0, import_react.useState)(null);
	useWakeLock(!!selectedDayId);
	const { data: student, isLoading: loadingStudent } = useQuery({
		queryKey: ["pt-portal-treino", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data } = await supabase.from("pt_students").select("id,name,training_plan,user_id").eq("account_user_id", user.id).maybeSingle();
			return data;
		}
	});
	const { data: programs = [], isLoading: loadingPrograms } = useQuery({
		queryKey: ["pt-portal-programs", student?.id],
		enabled: !!student?.id,
		queryFn: async () => {
			const { data } = await supabase.from("pt_programs").select("*").eq("pt_student_id", student.id).order("start_date", { ascending: false });
			return data ?? [];
		}
	});
	const programIds = programs.map((p) => p.id);
	const { data: days = [] } = useQuery({
		queryKey: ["pt-portal-days", programIds.join(",")],
		enabled: programIds.length > 0,
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_days").select("*").in("program_id", programIds).order("sort_order", { ascending: true }).order("created_at", { ascending: true });
			return data ?? [];
		}
	});
	const dayIds = days.map((d) => d.id);
	const { data: exercises = [] } = useQuery({
		queryKey: ["pt-portal-exercises", dayIds.join(",")],
		enabled: dayIds.length > 0,
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_exercises").select("*").in("training_day_id", dayIds).order("sort_order", { ascending: true }).order("created_at", { ascending: true });
			return data ?? [];
		}
	});
	const { data: executions = [] } = useQuery({
		queryKey: ["pt-portal-executions", student?.id],
		enabled: !!student?.id,
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_executions").select("id,training_day_id,executed_at,notes").eq("pt_student_id", student.id).order("executed_at", { ascending: false }).limit(200);
			return data ?? [];
		}
	});
	const isLoading = loadingStudent || loadingPrograms;
	const selectedDay = days.find((d) => d.id === selectedDayId) ?? null;
	const [progressionOpen, setProgressionOpen] = (0, import_react.useState)(false);
	const [selectedProgressEx, setSelectedProgressEx] = (0, import_react.useState)(null);
	const [selectedProgramId, setSelectedProgramId] = (0, import_react.useState)(null);
	const selectedProgram = (0, import_react.useMemo)(() => programs.find((p) => p.id === selectedProgramId) ?? null, [programs, selectedProgramId]);
	const { data: anamnesis } = useQuery({
		queryKey: ["pt-portal-anamnesis", student?.id],
		enabled: !!student?.id,
		queryFn: () => getStudentAnamnesis(student.id)
	});
	const clinicalAlerts = (0, import_react.useMemo)(() => extractClinicalAlerts(anamnesis), [anamnesis]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			clinicalAlerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClinicalAlertBadge, {
				alerts: clinicalAlerts,
				riskLevel: anamnesis?.risk_level
			}),
			!selectedDay && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-title text-foreground",
					children: "Treino Personal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Rotinas montadas pelo seu Personal Trainer."
				})] }), student && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					className: "gap-1.5 shadow-sm",
					onClick: () => {
						setSelectedProgressEx(null);
						setProgressionOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-primary" }), "Evolução de Cargas"]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Carregando…"
				})
			}) : programs.length === 0 && !student?.training_plan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 py-8 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: "Nenhuma rotina publicada ainda"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Assim que seu Personal Trainer publicar sua rotina, ela aparecerá aqui."
					})] })]
				})
			}) : selectedDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusedDayView, {
				day: selectedDay,
				exercises: exercises.filter((e) => e.training_day_id === selectedDay.id),
				executions: executions.filter((x) => x.training_day_id === selectedDay.id),
				allExecutions: executions,
				studentName: student?.name,
				onBack: () => setSelectedDayId(null),
				onOpenProgression: (exName) => {
					setSelectedProgressEx(exName);
					setProgressionOpen(true);
				},
				onSaved: () => {
					qc.invalidateQueries({ queryKey: ["pt-portal-executions", student?.id] });
					setSelectedDayId(null);
				},
				studentId: student.id,
				userId: student.user_id
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [programs.map((p) => {
					const programDays = days.filter((d) => d.program_id === p.id);
					const doneToday = programDays.some((d) => executions.some((x) => x.training_day_id === d.id && isSameDay(x.executed_at, /* @__PURE__ */ new Date())));
					executions.find((x) => programDays.some((d) => d.id === x.training_day_id));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						onClick: () => setSelectedProgramId(p.id),
						className: cn("group relative overflow-hidden rounded-2xl border bg-card p-4 sm:p-5 shadow-xs transition-all duration-200 cursor-pointer", "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md active:translate-y-0", doneToday && "border-emerald-500/30 bg-emerald-500/5"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3.5 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all", doneToday ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-primary/10 text-primary group-hover:scale-105 group-hover:bg-primary/15"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-6 w-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-base sm:text-lg font-bold text-foreground leading-tight truncate",
											children: p.name
										}), doneToday && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Feito hoje"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5 shrink-0" }), formatDateBR(p.start_date)]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-foreground/80",
												children: [
													programDays.length,
													" ",
													programDays.length === 1 ? "treino" : "treinos"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary",
												children: CATEGORY_LABELS[p.category] ?? p.category
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground",
												children: LEVEL_LABELS[p.level] ?? p.level
											})
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "hidden sm:inline-flex gap-1.5 rounded-xl font-semibold text-primary group-hover:bg-primary/10 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Abrir rotina" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sm:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
								})]
							})]
						})
					}, p.id);
				}), student?.training_plan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4 sm:p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground",
						children: "Orientações Gerais do Personal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "whitespace-pre-wrap break-words font-sans text-xs sm:text-sm leading-relaxed text-foreground",
						children: student.training_plan
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedProgram,
				onOpenChange: (open) => {
					if (!open) setSelectedProgramId(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-lg w-[95vw] sm:w-full max-h-[85vh] overflow-y-auto rounded-2xl p-5 sm:p-6 space-y-4",
					children: selectedProgram && (() => {
						const programDays = days.filter((d) => d.program_id === selectedProgram.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
								className: "space-y-1.5 text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary",
											children: CATEGORY_LABELS[selectedProgram.category] ?? selectedProgram.category
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground",
											children: LEVEL_LABELS[selectedProgram.level] ?? selectedProgram.level
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
										className: "text-xl font-bold leading-tight text-foreground",
										children: selectedProgram.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
										className: "text-xs text-muted-foreground flex flex-wrap items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatDateBR(selectedProgram.start_date), selectedProgram.end_date ? ` — ${formatDateBR(selectedProgram.end_date)}` : ""] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												programDays.length,
												" ",
												programDays.length === 1 ? "sessão" : "sessões",
												" de treino"
											] })
										]
									})
								]
							}),
							selectedProgram.goals && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/40 p-3.5 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5 text-primary" }), " Objetivos do Treino"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-wrap",
									children: selectedProgram.goals
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "Selecione o treino de hoje:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-semibold text-muted-foreground tabular-nums",
										children: [
											programDays.length,
											" ",
											programDays.length === 1 ? "opção" : "opções"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-2.5",
									children: programDays.map((d) => {
										const count = exercises.filter((e) => e.training_day_id === d.id).length;
										const doneToday = executions.some((x) => x.training_day_id === d.id && isSameDay(x.executed_at, /* @__PURE__ */ new Date()));
										const lastExec = executions.find((x) => x.training_day_id === d.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setSelectedProgramId(null);
												setSelectedDayId(d.id);
											},
											className: cn("group relative flex flex-col gap-2 rounded-xl border bg-card p-3.5 sm:p-4 text-left shadow-xs transition-all duration-200", "hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-sm active:translate-y-0", doneToday && "border-emerald-500/30 bg-emerald-500/5"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary",
														children: d.day_label
													}), doneToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Feito hoje"]
													}) : lastExec ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcwClock, { className: "h-3 w-3" }), formatDateBR(lastExec.executed_at)]
													}) : null]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-baseline justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm sm:text-base font-bold leading-tight group-hover:text-primary transition-colors",
														children: d.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary shrink-0" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3 text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "tabular-nums",
														children: [
															count,
															" ",
															count === 1 ? "exercício" : "exercícios"
														]
													}), lastExec?.notes && parseNotes(lastExec.notes).timerSeconds ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1 text-[11px] opacity-75",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-3 w-3" }), formatSeconds(parseNotes(lastExec.notes).timerSeconds)]
													}) : null]
												})
											]
										}, d.id);
									})
								})]
							})
						] });
					})()
				})
			}),
			student && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkoutProgressionDialog, {
				open: progressionOpen,
				onOpenChange: setProgressionOpen,
				studentId: student.id,
				initialExerciseName: selectedProgressEx
			})
		]
	});
}
function FocusedDayView({ day, exercises, executions, allExecutions, studentName, onBack, onSaved, onOpenProgression, studentId, userId }) {
	const [loads, setLoads] = (0, import_react.useState)({});
	const [done, setDone] = (0, import_react.useState)({});
	const [timerSeconds, setTimerSeconds] = (0, import_react.useState)(0);
	const [timerRunning, setTimerRunning] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [activeSubstitutes, setActiveSubstitutes] = (0, import_react.useState)({});
	const [excludedExerciseIds, setExcludedExerciseIds] = (0, import_react.useState)([]);
	const [summaryOpen, setSummaryOpen] = (0, import_react.useState)(false);
	const [lastExecutionId, setLastExecutionId] = (0, import_react.useState)(void 0);
	const [completedSets, setCompletedSets] = (0, import_react.useState)({});
	const [restTimer, setRestTimer] = (0, import_react.useState)({
		active: false,
		seconds: 60,
		exerciseName: ""
	});
	const toggleExcludeFromSession = (exerciseId) => {
		setExcludedExerciseIds((prev) => prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]);
	};
	const toggleSet = (ex, setNum, totalSets) => {
		const current = completedSets[ex.id] || [];
		const isAlreadyDone = current.includes(setNum);
		const updated = isAlreadyDone ? current.filter((s) => s !== setNum) : [...current, setNum].sort((a, b) => a - b);
		setCompletedSets((prev) => ({
			...prev,
			[ex.id]: updated
		}));
		if (!isAlreadyDone) setRestTimer({
			active: true,
			seconds: parseSafeSeconds(ex.rest_seconds, 60),
			exerciseName: ex.name,
			currentSet: setNum,
			totalSets
		});
		if (updated.length === totalSets) setDone((d) => ({
			...d,
			[ex.id]: true
		}));
		else if (isAlreadyDone && done[ex.id]) setDone((d) => ({
			...d,
			[ex.id]: false
		}));
	};
	const lastByExercise = (0, import_react.useMemo)(() => {
		const map = {};
		for (const exec of executions) {
			const n = parseNotes(exec.notes);
			if (!n.loads) continue;
			for (const [exId, load] of Object.entries(n.loads)) if (!map[exId] && load) map[exId] = {
				load,
				date: exec.executed_at
			};
		}
		return map;
	}, [executions]);
	const candidateExercises = (0, import_react.useMemo)(() => exercises.filter((e) => !e.substitute_exercise_id), [exercises]);
	const activeExercises = (0, import_react.useMemo)(() => candidateExercises.filter((e) => !excludedExerciseIds.includes(e.id)), [candidateExercises, excludedExerciseIds]);
	const totalDone = (0, import_react.useMemo)(() => {
		return activeExercises.filter((parentEx) => {
			const substitute = exercises.find((s) => s.substitute_exercise_id === parentEx.id);
			return !!done[(substitute && activeSubstitutes[parentEx.id] === substitute.id && substitute ? substitute : parentEx).id];
		}).length;
	}, [
		activeExercises,
		exercises,
		activeSubstitutes,
		done
	]);
	const progress = activeExercises.length > 0 ? Math.round(totalDone / activeExercises.length * 100) : 0;
	async function handleComplete() {
		setSaving(true);
		try {
			const performedExerciseIds = activeExercises.filter((parentEx) => {
				const substitute = exercises.find((s) => s.substitute_exercise_id === parentEx.id);
				const ex = substitute && activeSubstitutes[parentEx.id] === substitute.id && substitute ? substitute : parentEx;
				const hasSets = (completedSets[ex.id] || []).length > 0;
				const isDone = !!done[ex.id];
				const hasLoad = !!(loads[ex.id] && loads[ex.id].trim());
				return hasSets || isDone || hasLoad;
			}).map((parentEx) => {
				const substitute = exercises.find((s) => s.substitute_exercise_id === parentEx.id);
				return (substitute && activeSubstitutes[parentEx.id] === substitute.id && substitute ? substitute : parentEx).id;
			});
			const notes = {
				loads: Object.fromEntries(Object.entries(loads).filter(([, v]) => v && v.trim())),
				doneExercises: performedExerciseIds,
				completedSets,
				timerSeconds,
				excludedExercises: excludedExerciseIds
			};
			const { data: newExec, error } = await supabase.from("pt_training_executions").insert({
				pt_student_id: studentId,
				training_day_id: day.id,
				user_id: userId,
				notes: JSON.stringify(notes),
				feedback: feedback.trim() || null
			}).select("id").single();
			if (error) throw error;
			const { data: studentData } = await supabase.from("pt_students").select("user_id, name").eq("id", studentId).single();
			if (studentData?.user_id) await supabase.from("pt_notifications").insert({
				user_id: studentData.user_id,
				title: "Novo treino concluído!",
				message: `${studentData.name} finalizou o treino "${day.name}"`,
				type: "training_complete",
				metadata: {
					student_id: studentId,
					execution_id: newExec?.id,
					day_name: day.name
				}
			});
			setLastExecutionId(newExec?.id);
			toast.success("Treino concluído — bom trabalho! 💪");
			setSummaryOpen(true);
		} catch (err) {
			toast.error(err?.message ?? "Erro ao salvar");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-16 z-30 -mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 py-3 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85 border-b border-border/80 shadow-xs space-y-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: onBack,
							className: "-ml-1.5 h-8 gap-1.5 px-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Voltar"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/20",
								children: day.day_label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-muted/80 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground border border-border/60",
								children: [
									totalDone,
									"/",
									activeExercises.length,
									" (",
									progress,
									"%)",
									excludedExerciseIds.length > 0 && ` · ${excludedExerciseIds.length} pulado${excludedExerciseIds.length > 1 ? "s" : ""}`
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base sm:text-lg font-bold text-foreground leading-snug break-words",
							children: day.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-300",
								style: { width: `${progress}%` }
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimer, {
						variant: "hero",
						seconds: timerSeconds,
						setSeconds: setTimerSeconds,
						running: timerRunning,
						setRunning: setTimerRunning,
						onReset: () => {
							setTimerSeconds(0);
							setTimerRunning(false);
						}
					})
				]
			}),
			day.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-wrap rounded-2xl border border-border/70 bg-muted/30 p-4 text-xs sm:text-sm leading-relaxed text-muted-foreground",
					children: day.description
				})
			}),
			exercises.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-8 text-center rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nenhum exercício neste treino ainda."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3.5 pt-1",
				children: exercises.filter((e) => !e.substitute_exercise_id).map((parentEx, idx) => {
					const substitute = exercises.find((s) => s.substitute_exercise_id === parentEx.id);
					const isActiveSub = substitute && activeSubstitutes[parentEx.id] === substitute.id;
					const ex = isActiveSub && substitute ? substitute : parentEx;
					const isDone = !!done[ex.id];
					const last = lastByExercise[ex.id];
					const isExcluded = excludedExerciseIds.includes(parentEx.id);
					const totalSetsCount = parseSetCount(ex.sets_reps);
					if (isExcluded) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-dashed border-border/80 bg-muted/25 px-4 py-3 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground shrink-0",
									children: String(idx + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4 text-muted-foreground/60 shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-semibold text-muted-foreground line-through block truncate",
										children: ex.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground/80 block",
										children: "Excluído desta sessão (falta de tempo / equipamento indisponível)"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							className: "h-8 text-xs font-semibold gap-1.5 px-3 rounded-xl shrink-0 hover:bg-primary/10 hover:text-primary",
							onClick: () => toggleExcludeFromSession(parentEx.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Restaurar"]
						})]
					}, parentEx.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("relative overflow-hidden rounded-2xl border bg-card/95 p-4 sm:p-5 shadow-xs transition-all duration-200", isDone ? "border-emerald-500/40 bg-emerald-500/[0.03] ring-1 ring-emerald-500/20" : "border-border/80 hover:border-primary/40"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setDone((d) => ({
											...d,
											[ex.id]: !d[ex.id]
										})),
										"aria-label": isDone ? "Marcar como não concluído" : "Marcar como concluído",
										className: cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-200 active:scale-95", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", isDone ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/25" : "border-border bg-background hover:border-primary/60 text-transparent hover:text-muted-foreground/30"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											className: cn("h-5 w-5 transition-transform", isDone ? "scale-100" : "scale-75 opacity-0"),
											strokeWidth: 3
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-1.5 sm:gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] font-bold text-muted-foreground",
													children: String(idx + 1).padStart(2, "0")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: cn("text-base sm:text-lg font-bold leading-snug tracking-tight transition-all break-words", isDone && "text-muted-foreground line-through"),
													children: ex.name
												}),
												isActiveSub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 border border-amber-500/20",
													children: "Substituto"
												}),
												isDone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider",
													children: "Concluído"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2",
											children: [ex.series_type === "run" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [ex.load && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5 shrink-0" }), ex.load]
											}), ex.pace && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground",
												children: ["Pace: ", ex.pace]
											})] }) : ex.series_type === "time_inclination" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [ex.time_seconds && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-3.5 w-3.5 shrink-0" }),
													ex.time_seconds,
													"s"
												]
											}), ex.inclination && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground",
												children: ["Inclinação: ", ex.inclination]
											})] }) : ex.series_type === "cadence" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary",
												children: ["Cadência: ", ex.cadence]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												ex.sets_reps && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-3.5 w-3.5 shrink-0" }), ex.sets_reps]
												}),
												ex.load && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
														"Sugerido: ",
														ex.load
													]
												}),
												ex.time_seconds && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
														ex.time_seconds,
														"s"
													]
												})
											] }), ex.rest_seconds && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-3.5 w-3.5 shrink-0" }),
													"Descanso: ",
													parseSafeSeconds(ex.rest_seconds, 60),
													"s"
												]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 shrink-0",
										children: [substitute && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "ghost",
											size: "sm",
											className: cn("h-8 shrink-0 gap-1 px-2 text-xs font-semibold rounded-lg transition-colors", isActiveSub ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20" : "text-muted-foreground hover:text-foreground"),
											onClick: () => setActiveSubstitutes((prev) => ({
												...prev,
												[parentEx.id]: isActiveSub ? "" : substitute.id
											})),
											title: isActiveSub ? "Voltar ao exercício original" : "Trocar por exercício substituto",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden sm:inline",
												children: isActiveSub ? "Original" : "Substituir"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "ghost",
											size: "sm",
											className: "h-8 shrink-0 gap-1 px-2 text-xs font-semibold rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
											onClick: () => toggleExcludeFromSession(parentEx.id),
											title: "Excluir este exercício apenas desta sessão (falta de tempo, equipamento indisponível, etc.)",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden sm:inline",
												children: "Pular"
											})]
										})]
									})
								]
							}),
							ex.series_type !== "run" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/30 border border-border/60 p-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1",
										children: "Séries:"
									}), Array.from({ length: totalSetsCount }, (_, i) => i + 1).map((sNum) => {
										const isSetDone = (completedSets[ex.id] || []).includes(sNum);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => toggleSet(ex, sNum, totalSetsCount),
											className: cn("flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95", isSetDone ? "bg-emerald-500 text-white shadow-xs shadow-emerald-500/25" : "border border-border/80 bg-background hover:border-primary/60 text-foreground/80"),
											title: isSetDone ? `Série ${sNum} concluída (clique para desmarcar)` : `Concluir série ${sNum} e iniciar descanso de ${parseSafeSeconds(ex.rest_seconds, 60)}s`,
											children: [isSetDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
												className: "h-3 w-3",
												strokeWidth: 3
											}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["S", sNum] })]
										}, sNum);
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									onClick: () => setRestTimer({
										active: true,
										seconds: parseSafeSeconds(ex.rest_seconds, 60),
										exerciseName: ex.name,
										totalSets: totalSetsCount
									}),
									className: "h-7 text-[11px] font-semibold gap-1 px-2 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-lg",
									title: "Iniciar cronômetro de descanso agora",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Descansar (",
										parseSafeSeconds(ex.rest_seconds, 60),
										"s)"
									] })]
								})]
							}),
							ex.media_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3.5 overflow-hidden rounded-xl border border-border bg-black/5",
								children: ex.media_type === "youtube" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
									src: ex.media_url,
									className: "aspect-video w-full",
									allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
									allowFullScreen: true
								}) : ex.media_type === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: ex.media_url,
									controls: true,
									className: "max-h-72 sm:max-h-80 w-full object-contain rounded-xl bg-black/40"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: ex.media_url,
									alt: ex.name,
									loading: "lazy",
									className: "max-h-72 sm:max-h-80 w-full object-contain rounded-xl bg-black/5"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3.5 rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-3.5 space-y-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
											children: "Carga realizada hoje"
										}), onOpenProgression && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => onOpenProgression(ex.name),
											className: "inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }), " Ver evolução"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "text",
											inputMode: "decimal",
											placeholder: "ex: 22.5 kg",
											value: loads[ex.id] ?? "",
											onChange: (e) => setLoads((l) => ({
												...l,
												[ex.id]: e.target.value
											})),
											className: "h-11 flex-1 rounded-xl text-sm font-semibold tabular-nums bg-background border-border/80"
										}), last?.load && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => setLoads((l) => ({
												...l,
												[ex.id]: last.load
											})),
											title: `Copiar última carga (${last.load})`,
											className: "h-11 shrink-0 gap-1.5 px-3 rounded-xl border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-xs transition-all active:scale-95",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-3.5 w-3.5 shrink-0" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "hidden xs:inline",
													children: "Usar última"
												}),
												" (",
												last.load,
												")"
											]
										})]
									}),
									last && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-[11px] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcwClock, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Última carga registrada: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: last.load
											}),
											" em ",
											formatDateBR(last.date)
										] })]
									})
								]
							}),
							ex.observations && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 rounded-xl border-l-4 border-primary/70 bg-primary/5 p-3 text-xs leading-relaxed text-foreground/90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-primary block mb-0.5",
									children: "Orientações do Coach:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "whitespace-pre-wrap break-words",
									children: ex.observations
								})]
							})
						]
					}, ex.id);
				})
			}),
			exercises.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-4 sm:p-5 shadow-xs space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
					children: "Feedback do treino (opcional)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					placeholder: "Como foi o treino? Algum desconforto, RPE ou observação para o treinador?",
					className: "min-h-[80px] rounded-xl text-sm resize-y",
					value: feedback,
					onChange: (e) => setFeedback(e.target.value)
				})]
			}),
			activeExercises.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky bottom-0 z-20 -mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 py-3.5 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-t border-border/80 shadow-lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					onClick: handleComplete,
					disabled: saving,
					className: cn("w-full h-12 gap-2 text-base font-bold rounded-xl shadow-md transition-all active:scale-[0.99]", totalDone === activeExercises.length && activeExercises.length > 0 ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25" : "shadow-primary/20"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 shrink-0" }), saving ? "Salvando treino..." : totalDone === activeExercises.length ? `Finalizar treino completo (${totalDone}/${activeExercises.length})` : `Concluir treino (${totalDone}/${activeExercises.length} feitos)`]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkoutSummaryDialog, {
				open: summaryOpen,
				onOpenChange: (open) => {
					setSummaryOpen(open);
					if (!open) {
						onSaved();
						setLastExecutionId(void 0);
					}
				},
				dayName: day.name,
				duration: timerSeconds,
				exercises,
				loads,
				feedback,
				executionId: lastExecutionId,
				initialExcludedExercises: excludedExerciseIds,
				onExcludedExercisesChange: setExcludedExerciseIds,
				completedSets,
				doneExercises: done,
				previousExecutions: allExecutions || executions,
				studentName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestCountdownTimer, {
				active: restTimer.active,
				initialSeconds: restTimer.seconds,
				exerciseName: restTimer.exerciseName,
				currentSet: restTimer.currentSet,
				totalSets: restTimer.totalSets,
				onDismiss: () => setRestTimer((t) => ({
					...t,
					active: false
				})),
				onComplete: () => setRestTimer((t) => ({
					...t,
					active: false
				}))
			})
		]
	});
}
//#endregion
export { PTTreinoPage as component };
