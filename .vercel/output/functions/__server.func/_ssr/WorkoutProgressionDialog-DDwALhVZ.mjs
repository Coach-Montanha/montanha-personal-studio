import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Kt as Dumbbell, Pn as ArrowUpRight, Vn as ArrowDownRight, g as Trophy, v as TrendingUp } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as Badge } from "./badge-DB22ix_c.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { t as EmptyState } from "./EmptyState-DK3vCNbs.mjs";
import { a as formatDateBR } from "./format-BT-nao3-.mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as YAxis, c as Line, i as LineChart, l as CartesianGrid, m as Tooltip, o as XAxis, p as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WorkoutProgressionDialog-DDwALhVZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function parseNumericLoad(s) {
	if (!s) return null;
	const m = s.replace(",", ".").trim().match(/-?\d+(?:\.\d+)?/);
	return m ? Number(m[0]) : null;
}
function parseExecutionNotes(raw) {
	if (!raw || typeof raw !== "string") return {};
	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" && parsed.loads ? parsed.loads : {};
	} catch {
		return {};
	}
}
function WorkoutProgressionDialog({ open, onOpenChange, studentId, initialExerciseName }) {
	const [selectedExercise, setSelectedExercise] = (0, import_react.useState)("");
	const { data: programs = [] } = useQuery({
		queryKey: ["progression-programs", studentId],
		enabled: open && !!studentId,
		queryFn: async () => {
			const { data } = await supabase.from("pt_programs").select("id,name,start_date").eq("pt_student_id", studentId).order("start_date", { ascending: true });
			return data ?? [];
		}
	});
	const programIds = programs.map((p) => p.id);
	const { data: days = [] } = useQuery({
		queryKey: ["progression-days", programIds.join(",")],
		enabled: open && programIds.length > 0,
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_days").select("id,program_id,name,day_label").in("program_id", programIds);
			return data ?? [];
		}
	});
	const dayIds = days.map((d) => d.id);
	const { data: exercises = [] } = useQuery({
		queryKey: ["progression-exercises", dayIds.join(",")],
		enabled: open && dayIds.length > 0,
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_exercises").select("id,name,load,training_day_id,created_at").in("training_day_id", dayIds);
			return data ?? [];
		}
	});
	const { data: executions = [] } = useQuery({
		queryKey: ["progression-executions", studentId],
		enabled: open && !!studentId,
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_executions").select("id,training_day_id,executed_at,notes").eq("pt_student_id", studentId).order("executed_at", { ascending: true });
			return data ?? [];
		}
	});
	const groupedExercises = (0, import_react.useMemo)(() => {
		const exerciseMap = /* @__PURE__ */ new Map();
		exercises.forEach((ex) => {
			exerciseMap.set(ex.id, ex);
		});
		const dayMap = /* @__PURE__ */ new Map();
		days.forEach((d) => dayMap.set(d.id, d));
		const programMap = /* @__PURE__ */ new Map();
		programs.forEach((p) => programMap.set(p.id, p));
		const byName = /* @__PURE__ */ new Map();
		for (const ex of exercises) {
			const numeric = parseNumericLoad(ex.load);
			if (numeric == null) continue;
			const day = dayMap.get(ex.training_day_id);
			const prog = day ? programMap.get(day.program_id) : null;
			const date = prog?.start_date || ex.created_at.slice(0, 10);
			const key = ex.name.trim().toLowerCase();
			if (!byName.has(key)) byName.set(key, {
				name: ex.name.trim(),
				points: []
			});
			byName.get(key).points.push({
				date,
				displayDate: formatDateBR(date),
				source: "prescription",
				label: prog ? `${prog.name} (Prescrito)` : "Prescrição",
				load: numeric,
				raw: ex.load ?? `${numeric}kg`
			});
		}
		for (const exec of executions) {
			const execLoads = parseExecutionNotes(exec.notes);
			const date = exec.executed_at.slice(0, 10);
			const day = dayMap.get(exec.training_day_id);
			for (const [exId, rawLoad] of Object.entries(execLoads)) {
				const numeric = parseNumericLoad(rawLoad);
				if (numeric == null) continue;
				const exName = exerciseMap.get(exId)?.name?.trim() || "Exercício";
				const key = exName.toLowerCase();
				if (!byName.has(key)) byName.set(key, {
					name: exName,
					points: []
				});
				byName.get(key).points.push({
					date,
					displayDate: formatDateBR(date),
					source: "execution",
					label: day ? `Treino: ${day.name}` : "Execução",
					load: numeric,
					raw: rawLoad
				});
			}
		}
		for (const item of byName.values()) item.points.sort((a, b) => a.date.localeCompare(b.date));
		return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name));
	}, [
		exercises,
		executions,
		days,
		programs
	]);
	(0, import_react.useEffect)(() => {
		if (initialExerciseName) {
			const match = groupedExercises.find((g) => g.name.toLowerCase() === initialExerciseName.trim().toLowerCase());
			if (match) {
				setSelectedExercise(match.name);
				return;
			}
		}
		if (groupedExercises.length > 0 && (!selectedExercise || !groupedExercises.some((g) => g.name === selectedExercise))) setSelectedExercise(groupedExercises[0].name);
	}, [
		groupedExercises,
		initialExerciseName,
		selectedExercise
	]);
	const currentExercise = groupedExercises.find((g) => g.name === selectedExercise) ?? groupedExercises[0] ?? null;
	const stats = (0, import_react.useMemo)(() => {
		if (!currentExercise || currentExercise.points.length === 0) return null;
		const pts = currentExercise.points;
		const firstLoad = pts[0].load;
		const currentLoad = pts[pts.length - 1].load;
		const maxLoad = Math.max(...pts.map((p) => p.load));
		const totalGain = currentLoad - firstLoad;
		return {
			initial: firstLoad,
			current: currentLoad,
			max: maxLoad,
			gain: totalGain,
			percent: firstLoad > 0 ? totalGain / firstLoad * 100 : 0,
			count: pts.length
		};
	}, [currentExercise]);
	const chartData = (0, import_react.useMemo)(() => {
		if (!currentExercise) return [];
		return currentExercise.points.map((p, idx) => ({
			idx,
			date: p.displayDate,
			load: p.load,
			raw: p.raw,
			label: p.label,
			source: p.source
		}));
	}, [currentExercise]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-lg font-bold",
					children: "Evolução de Cargas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs",
					children: "Acompanhe a progressão de força e sobrecarga progressiva ao longo dos treinos."
				})] })]
			}) }), groupedExercises.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-6 w-6" }),
				title: "Nenhuma carga registrada",
				description: "Ao registrar as cargas durante os treinos no portal (ex: 50kg), o gráfico de evolução histórica será gerado automaticamente."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Selecione o Exercício"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: selectedExercise,
							onValueChange: setSelectedExercise,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-full sm:w-[280px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Escolha um exercício" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
								className: "max-h-60",
								children: groupedExercises.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: g.name,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: g.name
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												"(",
												g.points.length,
												" registros)"
											]
										})
									]
								}, g.name))
							})]
						})]
					}),
					stats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-3 bg-muted/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "Carga Inicial"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-lg font-bold font-mono",
									children: [stats.initial, " kg"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-3 bg-muted/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] font-medium text-muted-foreground flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-3 w-3 text-amber-500" }), " Recorde (PR)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-lg font-bold font-mono text-amber-600 dark:text-amber-400",
									children: [stats.max, " kg"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-3 bg-muted/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "Progresso Total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-baseline gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `text-lg font-bold font-mono ${stats.gain >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`,
										children: [stats.gain > 0 ? `+${stats.gain}` : stats.gain, " kg"]
									}), stats.gain !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-muted-foreground",
										children: [
											"(",
											stats.percent > 0 ? `+${stats.percent.toFixed(0)}%` : `${stats.percent.toFixed(0)}%`,
											")"
										]
									})]
								})]
							})
						]
					}),
					chartData.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-card p-4 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-foreground",
								children: "Linha do Tempo de Cargas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "text-[10px]",
								children: [chartData.length, " sessões registradas"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-56 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: chartData,
									margin: {
										top: 10,
										right: 15,
										left: -10,
										bottom: 5
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											opacity: .2
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "date",
											tick: { fontSize: 11 },
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tick: { fontSize: 11 },
											tickLine: false,
											unit: "kg"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											formatter: (val) => [`${val} kg`, "Carga executada"],
											labelFormatter: (_label, payload) => {
												const item = payload?.[0]?.payload;
												return item ? `${item.date} — ${item.label}` : "";
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "load",
											stroke: "var(--color-primary)",
											strokeWidth: 2.5,
											dot: {
												r: 4,
												fill: "var(--color-primary)"
											},
											activeDot: { r: 6 }
										})
									]
								})
							})
						})]
					}),
					currentExercise && currentExercise.points.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b",
							children: "Histórico de Registros"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-48 overflow-y-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/20 text-muted-foreground sticky top-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 text-left font-medium",
											children: "Data"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 text-left font-medium",
											children: "Origem"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 text-left font-medium",
											children: "Anotação"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 text-right font-medium",
											children: "Carga (kg)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 text-right font-medium",
											children: "Evolução"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border/60",
									children: currentExercise.points.map((p, i) => {
										const prev = i > 0 ? currentExercise.points[i - 1].load : null;
										const delta = prev != null ? p.load - prev : null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/30 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 font-mono",
													children: p.displayDate
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-muted-foreground truncate max-w-[140px]",
													children: p.label
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-muted-foreground font-mono",
													children: p.raw
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "p-2.5 text-right font-mono font-semibold",
													children: [p.load, " kg"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-mono",
													children: delta != null && delta !== 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `inline-flex items-center gap-0.5 font-semibold ${delta > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`,
														children: delta > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" }),
															" +",
															delta
														] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-3 w-3" }),
															" ",
															delta
														] })
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "—"
													})
												})
											]
										}, i);
									})
								})]
							})
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { WorkoutProgressionDialog as t };
