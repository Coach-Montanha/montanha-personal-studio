import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { $t as CloudDownload, G as Plus, K as Play, Kt as Dumbbell, L as Send, O as Sparkles, Qt as CloudUpload, R as Search, Rn as ArrowLeftRight, Tt as KeyRound, U as RefreshCw, Wt as ExternalLink, Z as Pencil, Zt as Copy, _t as LoaderCircle, b as Trash2, fn as ChevronRight, hn as Check, n as X, o as Video, qt as Download, s as Users, sn as CircleCheck, tn as ClipboardPaste, vt as Link2, wt as Layers, yt as Link2Off, zt as FilePlay } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Badge } from "./badge-DB22ix_c.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBA-r8Xh.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as SectionCard } from "./SectionCard-Dhxnzc2Q.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DT1SSYuq.mjs";
import { t as Checkbox } from "./checkbox-kt6FvQcE.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { t as Route } from "./biblioteca-BsFtuVWj.mjs";
import { d as number, f as object, l as array, m as union, p as string, u as boolean } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/biblioteca-DPnRww0k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Integração com o projeto "Sistema Híbrido de Treinamento".
* 
* Este arquivo foi atualizado para usar uma chave de API direta caso os 
* segredos de ambiente não estejam disponíveis no Lovable Cloud.
*/
var ExerciseSchema = object({
	name: string().min(1),
	sets: union([number(), string()]).nullish(),
	reps: union([number(), string()]).nullish(),
	load_kg: union([number(), string()]).nullish(),
	load: string().nullish(),
	rest_seconds: union([number(), string()]).nullish(),
	rest_sec: union([number(), string()]).nullish(),
	observations: string().nullish(),
	notes: string().nullish()
}).transform((e) => ({
	...e,
	rest_seconds: e.rest_seconds ?? e.rest_sec ?? null,
	observations: e.observations ?? e.notes ?? null
}));
var BlockSchema = object({
	format: string().nullish(),
	title: string().nullish(),
	exercises: array(ExerciseSchema).default([])
});
var SessionSchema = object({
	title: string().nullish(),
	day_number: number().nullish(),
	date: string().nullish(),
	blocks: array(BlockSchema).default([])
});
var WeekSchema = object({
	number: number().nullish(),
	week_number: number().nullish(),
	sessions: array(SessionSchema).default([])
}).transform((w) => ({
	...w,
	number: w.number ?? w.week_number ?? null
}));
var HybridProgramSchema = object({
	id: string().nullish(),
	title: string().min(1),
	methodology: string().nullish(),
	start_date: string().nullish(),
	weeks: array(WeekSchema).nullish(),
	sessions: array(SessionSchema).nullish()
});
/** Diz à UI se a conexão com a origem está configurada. */
var getHybridStatus = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0836dd3f15d95e7e3146481d600e3035f29b84bb2be9750a8b2f30f52beeba0e"));
/** Lista os programas disponíveis na origem. */
var listHybridPrograms = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("3e7fc5ac816f48dae8ec89ad1ac32d4c5c52ed09f02493f50c24d17a8fea8987"));
/** Busca um programa completo na origem, já normalizado. */
var fetchHybridProgram = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({ id: string().min(1) }).parse(raw)).handler(createSsrRpc("d41fe1bc85669a6ff6681f18e5bb253f5b38b0ea92c3f57d491da7358f96125a"));
function str(v) {
	if (v === null || v === void 0 || v === "") return null;
	return String(v);
}
function flattenHybridProgram(program) {
	const days = [];
	(program.weeks?.length ? program.weeks : [{
		number: 1,
		sessions: program.sessions ?? []
	}]).forEach((week, wi) => {
		const weekNumber = week.number ?? wi + 1;
		week.sessions.forEach((session, si) => {
			const dayNumber = session.day_number ?? si + 1;
			const exercises = [];
			session.blocks.forEach((block) => {
				block.exercises.forEach((ex) => {
					const sets = str(ex.sets);
					const reps = str(ex.reps);
					const setsReps = sets && reps ? `${sets}x${reps}` : reps ?? sets;
					const blockTag = block.title ?? block.format ?? null;
					const obs = [blockTag ? `[${blockTag}]` : null, str(ex.observations)].filter(Boolean).join(" ");
					exercises.push({
						name: ex.name,
						sets_reps: setsReps,
						load: ex.load ?? (ex.load_kg != null ? `${ex.load_kg} kg` : null),
						rest_seconds: str(ex.rest_seconds),
						observations: obs || null
					});
				});
			});
			days.push({
				name: session.title ?? `Semana ${weekNumber} · Dia ${dayNumber}`,
				day_label: `S${weekNumber}D${dayNumber}`,
				description: session.date ?? null,
				exercises
			});
		});
	});
	return days;
}
var ImportInput = object({
	ptStudentId: string().uuid(),
	programId: string().min(1).optional(),
	program: HybridProgramSchema.optional(),
	showToStudent: boolean().default(true)
});
var importHybridProgram = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => {
	const parsed = ImportInput.parse(raw);
	if (!parsed.programId && !parsed.program) throw new Error("Informe um programa da origem ou cole o JSON");
	return parsed;
}).handler(createSsrRpc("67449c0507bf8bcc655c012924e7b24c64b183ba1d70669738c9474a163ca2c0"));
/** Lista os exercícios do banco da origem. */
var listHybridExercises = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("1aaa84a0734b91652cf7f6b45308860082da650e866d7835997082d1cf68954f"));
/** Importa os exercícios da origem para a biblioteca de movimentos deste projeto. */
var importHybridExercises = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({ ids: array(string()).optional() }).parse(raw ?? {})).handler(createSsrRpc("6625c9cd04422f9c91ce4ef2ffa8030430e467725fa932171ab4a82be1a925d2"));
function methodologyLabel(m) {
	if (!m) return null;
	return {
		hibrido: "Híbrido",
		kettlebell_sport: "Kettlebell Sport",
		kettlebell_fitness: "Kettlebell Fitness",
		levantamento_peso: "Levantamento de peso",
		musculacao: "Musculação"
	}[m] ?? m;
}
function ImportTrainingPanel() {
	const navigate = useNavigate();
	const status = useServerFn(getHybridStatus);
	const list = useServerFn(listHybridPrograms);
	const fetchOne = useServerFn(fetchHybridProgram);
	const runImport = useServerFn(importHybridProgram);
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [manual, setManual] = (0, import_react.useState)("");
	const [manualProgram, setManualProgram] = (0, import_react.useState)(null);
	const [manualError, setManualError] = (0, import_react.useState)(null);
	const [studentId, setStudentId] = (0, import_react.useState)("");
	const [showToStudent, setShowToStudent] = (0, import_react.useState)(true);
	const [importing, setImporting] = (0, import_react.useState)(false);
	const statusQ = useQuery({
		queryKey: ["hybrid-status"],
		queryFn: () => status(),
		staleTime: 5 * 6e4
	});
	const configured = statusQ.data?.configured ?? false;
	const programsQ = useQuery({
		queryKey: ["hybrid-programs"],
		queryFn: () => list(),
		enabled: configured,
		staleTime: 6e4
	});
	const remoteQ = useQuery({
		queryKey: ["hybrid-program", selectedId],
		queryFn: () => fetchOne({ data: { id: selectedId } }),
		enabled: Boolean(selectedId) && configured
	});
	const studentsQ = useQuery({
		queryKey: ["pt-students-import"],
		staleTime: 6e4,
		queryFn: async () => {
			const { data, error } = await supabase.from("pt_students").select("id,name,status").is("deleted_at", null).order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const program = manualProgram ?? remoteQ.data ?? null;
	const days = (0, import_react.useMemo)(() => program ? flattenHybridProgram(program) : [], [program]);
	const totalExercises = days.reduce((s, d) => s + d.exercises.length, 0);
	function parseManual(value) {
		setManual(value);
		setManualError(null);
		if (!value.trim()) {
			setManualProgram(null);
			return;
		}
		try {
			setManualProgram(HybridProgramSchema.parse(JSON.parse(value)));
			setSelectedId(null);
		} catch (e) {
			setManualProgram(null);
			setManualError(e?.name === "SyntaxError" ? "JSON inválido — verifique a colagem." : "Formato não reconhecido.");
		}
	}
	async function handleImport() {
		if (!program || !studentId) return;
		setImporting(true);
		try {
			const res = await runImport({ data: {
				ptStudentId: studentId,
				program,
				showToStudent
			} });
			toast.success(`Treino importado para ${res.studentName}`, { description: `${res.days} dia(s) · ${res.exercises} exercício(s)` });
			navigate({
				to: "/personal-trainer/students/$id",
				params: { id: studentId }
			}).catch(() => {});
		} catch (e) {
			toast.error("Falha ao importar", { description: e?.message ?? "Erro desconhecido" });
		} finally {
			setImporting(false);
		}
	}
	const canImport = Boolean(program && studentId) && !importing;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full pb-24 lg:pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "h-3.5 w-3.5" }), "Integração entre projetos"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-2xl text-sm leading-relaxed text-muted-foreground",
						children: "Traga um programa gerado no Sistema Híbrido de Treinamento e aplique como rotina de um aluno de Personal Trainer. A importação cria uma cópia — o original continua intacto."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectionChip, {
						loading: statusQ.isLoading,
						configured,
						error: programsQ.data?.ok === false ? programsQ.data.error ?? null : null
					}), configured && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => programsQ.refetch(),
						disabled: programsQ.isFetching,
						className: "transition-ui",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("mr-2 h-4 w-4", programsQ.isFetching && "animate-spin") }), "Atualizar"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						icon: Sparkles,
						title: "Origem do treino",
						description: "Escolha um programa publicado ou cole o JSON",
						bodyClassName: "p-0",
						padded: false,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							defaultValue: configured ? "remote" : "manual",
							className: "w-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border-b border-border px-4 pt-3 sm:px-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
										className: "grid w-full grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "remote",
											children: "Conectado"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "manual",
											children: "Colar JSON"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "remote",
									className: "m-0 p-4 sm:p-5",
									children: statusQ.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-3",
										children: [
											0,
											1,
											2
										].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full rounded-lg" }, i))
									}) : !configured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotConfigured, {}) : programsQ.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-3",
										children: [
											0,
											1,
											2
										].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full rounded-lg" }, i))
									}) : programsQ.data?.ok === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-dashed border-destructive/40 bg-destructive/5 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-caption text-destructive",
											children: programsQ.data.error === "not_configured" ? "Integração ainda não configurada." : programsQ.data.error
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											className: "mt-3 transition-ui",
											onClick: () => programsQ.refetch(),
											disabled: programsQ.isFetching,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("mr-2 h-4 w-4", programsQ.isFetching && "animate-spin") }), "Tentar novamente"]
										})]
									}) : (programsQ.data?.programs.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-caption rounded-lg border border-dashed border-border bg-muted/30 p-4 text-muted-foreground",
										children: "Nenhum programa disponível na origem."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-2",
										children: programsQ.data.programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramRow, {
											program: p,
											active: selectedId === p.id,
											onSelect: () => {
												setSelectedId(p.id);
												setManualProgram(null);
												setManual("");
											}
										}, p.id))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "manual",
									className: "m-0 space-y-3 p-4 sm:p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "hybrid-json",
											className: "text-caption text-muted-foreground",
											children: "Cole o JSON do programa exportado no Sistema Híbrido"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "hybrid-json",
											value: manual,
											onChange: (e) => parseManual(e.target.value),
											placeholder: "{\n  \"title\": \"Bloco de força\",\n  \"weeks\": [ … ]\n}",
											className: "min-h-[180px] font-mono text-xs leading-relaxed transition-ui"
										}),
										manualError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-caption text-destructive",
											children: manualError
										}) : manualProgram ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-caption flex items-center gap-1.5 text-state-paid",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), "Programa reconhecido"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-caption text-muted-foreground",
											children: [
												"Aceita o formato normalizado com ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "rounded bg-muted px-1",
													children: "weeks"
												}),
												" ",
												"ou ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "rounded bg-muted px-1",
													children: "sessions"
												}),
												"."
											]
										})
									]
								})
							]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						icon: Layers,
						title: "Pré-visualização",
						description: program ? `${days.length} dia(s) · ${totalExercises} exercício(s)` : "Nada selecionado ainda",
						children: remoteQ.isFetching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: [
								0,
								1,
								2
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full rounded-lg" }, i))
						}) : !program ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-3 py-10 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-6 w-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-body font-medium text-foreground",
									children: "Selecione um programa"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-caption max-w-xs text-muted-foreground",
									children: "Escolha na lista ao lado ou cole o JSON para ver a estrutura antes de importar."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-section text-foreground",
										children: program.title
									}),
									program.methodology && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: methodologyLabel(program.methodology)
									}),
									program.start_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-caption tabular-nums text-muted-foreground",
										children: ["início ", program.start_date]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2",
								children: days.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-lg border border-border bg-surface-sunken/60 p-3 transition-ui hover:bg-muted/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-body min-w-0 truncate font-medium text-foreground",
											children: d.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: "shrink-0 tabular-nums",
											children: [d.exercises.length, " ex."]
										})]
									}), d.exercises.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-caption mt-1.5 line-clamp-2 text-muted-foreground",
										children: d.exercises.map((e) => e.name).join(" · ")
									})]
								}, `${d.day_label}-${i}`))
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
						icon: Users,
						title: "Destino",
						description: "Aluno de Personal Trainer que receberá a rotina",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "pt-student",
									className: "text-caption text-muted-foreground",
									children: "Aluno PT"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: studentId,
									onValueChange: setStudentId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "pt-student",
										className: "transition-ui",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: studentsQ.isLoading ? "Carregando alunos…" : "Selecione o aluno" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (studentsQ.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s.id,
										children: s.name
									}, s.id)) })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-lg border border-border bg-surface-sunken/60 px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									id: "show-student",
									checked: showToStudent,
									onCheckedChange: setShowToStudent
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "show-student",
									className: "text-caption cursor-pointer text-foreground",
									children: "Visível para o aluno"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 hidden justify-end lg:flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleImport,
								disabled: !canImport,
								className: "min-w-44 transition-ui",
								children: importing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Importando…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "mr-2 h-4 w-4" }), "Importar treino"] })
							})
						})]
					})]
				})]
			}),
			!statusQ.isLoading && !configured && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupGuide, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequestForOrigin, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: handleImport,
					disabled: !canImport,
					className: "w-full transition-ui",
					children: importing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Importando…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "mr-2 h-4 w-4" }), "Importar treino"] })
				})
			})
		]
	});
}
function ProgramRow({ program, active, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onSelect,
		"aria-pressed": active,
		className: cn("group flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-ui", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", active ? "border-primary/40 bg-primary/10" : "border-border bg-card hover:border-border hover:bg-muted/40 active:bg-muted/60"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-ui", active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-body block truncate font-medium text-foreground",
					children: program.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-caption block truncate text-muted-foreground",
					children: [
						methodologyLabel(program.methodology),
						program.weeks_count ? `${program.weeks_count} semana(s)` : null,
						program.start_date
					].filter(Boolean).join(" · ") || "—"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("h-4 w-4 shrink-0 transition-ui", active ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground") })
		]
	}) });
}
function ConnectionChip({ loading, configured, error }) {
	const state = loading ? {
		label: "Verificando…",
		cls: "border-border bg-muted/40 text-muted-foreground",
		Icon: LoaderCircle,
		spin: true
	} : !configured || error === "not_configured" ? {
		label: "Não configurado",
		cls: "border-border bg-muted/40 text-muted-foreground",
		Icon: Link2Off,
		spin: false
	} : error ? {
		label: "Falha na conexão",
		cls: "border-destructive/40 bg-destructive/10 text-destructive",
		Icon: Link2Off,
		spin: false
	} : {
		label: "Conectado",
		cls: "border-state-paid/30 bg-state-paid-soft text-state-paid",
		Icon: CircleCheck,
		spin: false
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("text-caption inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium transition-ui", state.cls),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(state.Icon, { className: cn("h-3.5 w-3.5", state.spin && "animate-spin") }), state.label]
	});
}
function NotConfigured() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-dashed border-border bg-muted/30 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: "mt-0.5 shrink-0 text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2Off, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-body font-medium text-foreground",
					children: "Conexão ainda não configurada"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-caption text-muted-foreground",
					children: [
						"Para listar os programas automaticamente, o Sistema Híbrido precisa expor",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-muted px-1",
							children: "/api/public/programs"
						}),
						" protegido por token, e este projeto precisa dos segredos ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "HYBRID_API_URL" }),
						" e",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "HYBRID_API_TOKEN" }),
						". Enquanto isso, use a aba",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 font-medium text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPaste, { className: "h-3.5 w-3.5" }), " Colar JSON"]
						}),
						"."
					]
				})]
			})]
		})
	});
}
var SETUP_STEPS = [
	{
		title: "Gere um token aleatório",
		body: "No terminal, rode openssl rand -hex 32 (ou use um gerador de senha forte com 64 caracteres). Esse mesmo valor será usado nos dois projetos."
	},
	{
		title: "Salve no Sistema Híbrido",
		body: "Abra o projeto de origem e vá em Cloud → Secrets. Adicione o segredo STUDIO_INTEGRATION_TOKEN com o valor gerado."
	},
	{
		title: "Salve aqui no StudioCoach",
		body: "Neste projeto, vá em Cloud → Secrets e adicione HYBRID_API_TOKEN com o mesmo valor. O HYBRID_API_URL já está configurado."
	},
	{
		title: "Exponha os endpoints na origem",
		body: "No Sistema Híbrido, crie /api/public/programs e /api/public/programs/:id exigindo o header Authorization: Bearer <token>."
	}
];
function SetupGuide() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
		icon: KeyRound,
		title: "Onde encontrar os Secrets",
		description: "Secrets não fica em Configurações do workspace — fica dentro do menu Cloud de cada projeto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-muted/30 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-caption font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Desktop"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-body mt-2 leading-relaxed text-foreground",
							children: [
								"Nome do projeto (canto superior esquerdo) → ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Cloud" }),
								" →",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Secrets" })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-muted/30 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-caption font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Mobile"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-body mt-2 leading-relaxed text-foreground",
							children: [
								"Modo Chat → menu ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "···" }),
								" → ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Cloud" }),
								" →",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Secrets" })
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-4",
					children: SETUP_STEPS.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "text-caption grid h-7 w-7 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 font-semibold text-primary",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 pt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-body font-medium leading-snug text-foreground",
								children: step.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-caption leading-relaxed text-muted-foreground",
								children: step.body
							})]
						})]
					}, step.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-caption rounded-lg border border-dashed border-border bg-muted/20 p-3 leading-relaxed text-muted-foreground",
					children: [
						"Sem permissão de owner/admin no projeto? Só owners e admins conseguem gravar segredos — peça para o responsável colar o token. Enquanto isso, a aba",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: "Colar JSON"
						}),
						" importa treinos normalmente."
					]
				})
			]
		})
	});
}
var ORIGIN_REQUEST = `Preciso expor dois endpoints públicos protegidos por token para que outro
projeto meu (StudioCoach) consiga importar os programas de treino daqui.

1) Crie o secret STUDIO_INTEGRATION_TOKEN (Cloud → Secrets). Vou colar o valor.

2) Crie GET /api/public/programs
   - Exige header: Authorization: Bearer <STUDIO_INTEGRATION_TOKEN>
   - Sem token válido → 401
   - Retorna: { "programs": [ { "id", "name", "description", "updated_at" } ] }

3) Crie GET /api/public/programs/:id
   - Mesma autenticação
   - Retorna o programa completo no formato:
     {
       "id", "name", "description",
       "weeks": [ { "label", "days": [ { "label", "exercises": [
         { "name", "sets", "reps", "load", "rest_seconds", "notes", "video_url" }
       ] } ] } ]
     }
   - Se o id não existir → 404

4) Não retorne dados pessoais de alunos nesses endpoints — apenas os
   programas/treinos.`;
function RequestForOrigin() {
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(ORIGIN_REQUEST);
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		} catch {
			toast.error("Não foi possível copiar. Selecione o texto manualmente.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
		icon: Send,
		title: "Solicitação para o Sistema Híbrido",
		description: "Copie o texto abaixo e cole no chat do projeto de origem",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			size: "sm",
			onClick: handleCopy,
			className: "w-full transition-ui sm:w-auto",
			children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2 h-4 w-4 text-state-paid" }), "Copiado!"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-4 w-4" }), "Copiar solicitação"] })
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "text-caption max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-4 font-mono leading-relaxed text-foreground",
				children: ORIGIN_REQUEST
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-caption leading-relaxed text-muted-foreground",
				children: [
					"Depois de colar lá e gerar o ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "font-medium text-foreground",
						children: "STUDIO_INTEGRATION_TOKEN"
					}),
					", volte aqui e salve o mesmo valor como",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "font-medium text-foreground",
						children: "HYBRID_API_TOKEN"
					}),
					" em Cloud → Secrets."
				]
			})]
		})
	});
}
function ImportExercisesPanel() {
	const qc = useQueryClient();
	const list = useServerFn(listHybridExercises);
	const doImport = useServerFn(importHybridExercises);
	const [search, setSearch] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data, isLoading, refetch, isFetching } = useQuery({
		queryKey: ["hybrid-exercises"],
		queryFn: () => list({}),
		staleTime: 6e4
	});
	const exercises = data?.exercises ?? [];
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		if (!q) return exercises;
		return exercises.filter((e) => e.name.toLowerCase().includes(q) || (e.muscle_group ?? "").toLowerCase().includes(q));
	}, [exercises, search]);
	function toggle(id) {
		setSelected((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	}
	async function run(ids) {
		setBusy(true);
		try {
			const res = await doImport({ data: ids?.length ? { ids } : {} });
			toast.success(`${res.imported} novo(s) movimento(s)` + (res.updated ? ` · ${res.updated} atualizado(s)` : "") + (res.skipped ? ` · ${res.skipped} já completos` : ""));
			setSelected(/* @__PURE__ */ new Set());
			qc.invalidateQueries({ queryKey: ["pt-library"] });
			qc.invalidateQueries({ queryKey: ["exercise-library"] });
		} catch (e) {
			toast.error(e?.message ?? "Falha ao importar exercícios");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border/60 bg-card p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: "Banco de exercícios da origem"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Importa os movimentos do Sistema Híbrido de Treinamento direto para a sua biblioteca. Nomes já existentes são ignorados."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => refetch(),
							disabled: isFetching || busy,
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4" }), "Atualizar"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => run(Array.from(selected)),
							disabled: busy || exercises.length === 0,
							className: "gap-2",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), selected.size > 0 ? `Importar ${selected.size}` : "Importar todos"]
						})]
					})]
				})
			}),
			data && !data.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive",
				children: data.error === "not_configured" ? "Integração não configurada." : `Não foi possível ler a origem: ${data.error}`
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Buscar exercício na origem…",
					className: "h-11 pl-9"
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 p-6 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Carregando exercícios…"]
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground",
				children: "Nenhum exercício encontrado na origem."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					filtered.length,
					" exercício(s) disponíveis",
					selected.size > 0 ? ` · ${selected.size} selecionado(s)` : ""
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: filtered.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card p-3 transition-colors hover:bg-muted/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: selected.has(e.id),
							onCheckedChange: () => toggle(e.id)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-medium",
								children: e.name
							}), e.muscle_group ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "mt-1 text-[10px]",
								children: e.muscle_group
							}) : null]
						}),
						e.media_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0 text-muted-foreground" }) : null
					]
				}, e.id))
			})] })
		]
	});
}
var MUSCLE_GROUPS = [
	"Peito",
	"Costas",
	"Pernas",
	"Glúteos",
	"Ombros",
	"Braços",
	"Core",
	"Cardio",
	"Mobilidade",
	"Corpo inteiro",
	"Outro"
];
function detectMedia(url) {
	const u = url.trim();
	if (!u) return {
		type: "url",
		thumb: null
	};
	const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1];
	if (yt) return {
		type: "youtube",
		thumb: `https://img.youtube.com/vi/${yt}/hqdefault.jpg`
	};
	if (u.match(/vimeo\.com\/(\d+)/)?.[1]) return {
		type: "vimeo",
		thumb: null
	};
	if (/\.(mp4|webm|mov)(\?|$)/i.test(u)) return {
		type: "video",
		thumb: null
	};
	if (/\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(u)) return {
		type: "image",
		thumb: u
	};
	return {
		type: "url",
		thumb: null
	};
}
function youtubeEmbed(url) {
	const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1];
	return yt ? `https://www.youtube.com/embed/${yt}` : null;
}
function BibliotecaPage() {
	const qc = useQueryClient();
	const navigate = Route.useNavigate();
	const { tab } = Route.useSearch();
	const pageTab = tab ?? "movimentos";
	const setPageTab = (v) => navigate({
		search: { tab: v },
		replace: true
	});
	const [search, setSearch] = (0, import_react.useState)("");
	const [groupFilter, setGroupFilter] = (0, import_react.useState)("all");
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [viewing, setViewing] = (0, import_react.useState)(null);
	const { data: items = [], isLoading } = useQuery({
		queryKey: ["pt-library"],
		queryFn: async () => {
			const { data, error } = await supabase.from("pt_exercises_library").select("id,name,muscle_group,description,media_url,media_type,thumbnail_url,user_id,is_global,created_at").order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const groups = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		items.forEach((i) => i.muscle_group && set.add(i.muscle_group));
		return Array.from(set).sort();
	}, [items]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.toLowerCase().trim();
		return items.filter((i) => {
			if (groupFilter !== "all" && (i.muscle_group ?? "") !== groupFilter) return false;
			if (!q) return true;
			return i.name.toLowerCase().includes(q) || (i.muscle_group ?? "").toLowerCase().includes(q) || (i.description ?? "").toLowerCase().includes(q);
		});
	}, [
		items,
		search,
		groupFilter
	]);
	async function handleDelete(item) {
		if (!await confirmDialog({
			title: "Excluir movimento?",
			description: `"${item.name}" será removido da biblioteca. Treinos que já usam este movimento mantêm seus dados, mas perdem a referência ao vídeo.`,
			confirmLabel: "Excluir",
			destructive: true
		})) return;
		const { error } = await supabase.from("pt_exercises_library").delete().eq("id", item.id);
		if (error) toast.error(error.message);
		else {
			toast.success("Movimento excluído");
			qc.invalidateQueries({ queryKey: ["pt-library"] });
			qc.invalidateQueries({ queryKey: ["exercise-library"] });
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-3.5 w-3.5" }), "Personal Trainer"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold tracking-tight md:text-3xl",
						children: "Biblioteca"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-2xl text-sm leading-relaxed text-muted-foreground",
						children: "O objetivo é conectar o banco de dados de exercícios de outro projeto a minha área biblioteca > movimentos. Seu acervo de movimentos com vídeo de referência e a importação de programas prontos — tudo em um só lugar."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: pageTab,
				onValueChange: (v) => setPageTab(v),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
							className: "h-auto w-max gap-1 rounded-xl border border-border/60 bg-muted/40 p-1",
							children: [
								{
									v: "movimentos",
									label: "Movimentos",
									icon: Dumbbell
								},
								{
									v: "importar",
									label: "Importar treino",
									icon: ArrowLeftRight
								},
								{
									v: "exercicios",
									label: "Importar exercícios",
									icon: CloudDownload
								}
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: t.v,
								className: "gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "h-4 w-4 shrink-0" }), t.label]
							}, t.v))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "importar",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportTrainingPanel, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "exercicios",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportExercisesPanel, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "movimentos",
						className: "mt-6 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 sm:flex-row sm:items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: search,
										onChange: (e) => setSearch(e.target.value),
										placeholder: "Buscar por nome, grupo muscular ou descrição…",
										className: "h-11 pl-9"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: groupFilter,
										onValueChange: setGroupFilter,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-11 w-full sm:w-48",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Grupo muscular" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "Todos os grupos"
										}), groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: g,
											children: g
										}, g))] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => {
											setEditing(null);
											setFormOpen(true);
										},
										className: "h-11 gap-2 whitespace-nowrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden sm:inline",
												children: "Novo movimento"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "sm:hidden",
												children: "Novo"
											})
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: isLoading ? "Carregando…" : `${filtered.length} ${filtered.length === 1 ? "movimento" : "movimentos"}${items.length !== filtered.length ? ` de ${items.length}` : ""}`
							})]
						}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "animate-pulse space-y-3 rounded-xl border border-border/60 bg-card/40 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-video rounded-lg bg-muted" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-2/3 rounded bg-muted" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-1/3 rounded bg-muted" })
								]
							}, i))
						}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							hasItems: items.length > 0,
							onCreate: () => {
								setEditing(null);
								setFormOpen(true);
							},
							onClearFilters: () => {
								setSearch("");
								setGroupFilter("all");
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: filtered.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseTile, {
								item,
								onView: () => setViewing(item),
								onEdit: () => {
									setEditing(item);
									setFormOpen(true);
								},
								onDelete: () => handleDelete(item)
							}, item.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseFormDialog, {
				open: formOpen,
				onOpenChange: setFormOpen,
				editing,
				onSaved: () => {
					qc.invalidateQueries({ queryKey: ["pt-library"] });
					qc.invalidateQueries({ queryKey: ["exercise-library"] });
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseViewer, {
				item: viewing,
				onOpenChange: (v) => !v && setViewing(null)
			})
		]
	});
}
function ExerciseTile({ item, onView, onEdit, onDelete }) {
	const thumb = item.thumbnail_url ?? (item.media_url ? detectMedia(item.media_url).thumb : null);
	const hasVideo = !!item.media_url;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm", "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-border hover:shadow-md", "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onView,
			className: cn("relative block aspect-video w-full overflow-hidden bg-muted", "focus:outline-none"),
			"aria-label": `Ver vídeo de ${item.name}`,
			children: [
				thumb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: thumb,
					alt: "",
					loading: "lazy",
					className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, {
						className: "h-10 w-10 text-muted-foreground/40",
						strokeWidth: 1.5
					})
				}),
				hasVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex items-center justify-center bg-background/0 transition-colors duration-200 group-hover:bg-background/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-12 w-12 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur-sm transition-transform duration-200 group-hover:scale-110",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5 h-5 w-5 fill-current" })
					})
				}),
				item.muscle_group && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					className: "absolute left-2 top-2 border-border/50 bg-background/85 backdrop-blur-sm",
					children: item.muscle_group
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-3 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "truncate text-base font-semibold leading-tight",
					children: item.name
				}), item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground",
					children: item.description
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-t border-border/50 pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 text-xs text-muted-foreground",
					children: hasVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Com vídeo" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground/70",
						children: "Sem mídia"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: onEdit,
						className: "h-8 w-8 text-muted-foreground hover:text-foreground",
						"aria-label": "Editar movimento",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: onDelete,
						className: "h-8 w-8 text-muted-foreground hover:text-destructive",
						"aria-label": "Excluir movimento",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					})]
				})]
			})]
		})]
	});
}
function EmptyState({ hasItems, onCreate, onClearFilters }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/30 px-6 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, {
				className: "h-6 w-6",
				strokeWidth: 1.75
			})
		}), hasItems ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Nenhum movimento encontrado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: "Tente ajustar a busca ou remover os filtros aplicados."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: onClearFilters,
				className: "mt-4",
				children: "Limpar filtros"
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Sua biblioteca está vazia"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: "Comece cadastrando seu primeiro movimento com vídeo de referência para reutilizar em todos os seus treinos."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onCreate,
				className: "mt-4 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Cadastrar primeiro movimento"]
			})
		] })]
	});
}
function ExerciseFormDialog({ open, onOpenChange, editing, onSaved }) {
	const [name, setName] = (0, import_react.useState)("");
	const [muscleGroup, setMuscleGroup] = (0, import_react.useState)("");
	const [mediaUrl, setMediaUrl] = (0, import_react.useState)("");
	const [mediaType, setMediaType] = (0, import_react.useState)(null);
	const [description, setDescription] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("link");
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [uploadProgress, setUploadProgress] = (0, import_react.useState)(0);
	(0, import_react.useMemo)(() => {
		if (open) {
			setName(editing?.name ?? "");
			setMuscleGroup(editing?.muscle_group ?? "");
			setMediaUrl(editing?.media_url ?? "");
			setMediaType(editing?.media_type ?? null);
			setDescription(editing?.description ?? "");
			setTab(editing?.media_type === "upload" ? "upload" : "link");
			setUploadProgress(0);
		}
	}, [open, editing]);
	const isUpload = mediaType === "upload";
	const media = mediaUrl && !isUpload ? detectMedia(mediaUrl) : null;
	const embed = mediaUrl && !isUpload ? youtubeEmbed(mediaUrl) : null;
	async function handleFileSelected(file) {
		if (!file.type.startsWith("video/")) {
			toast.error("Envie um arquivo de vídeo (MP4, WebM ou MOV).");
			return;
		}
		if (file.size > 200 * 1024 * 1024) {
			toast.error("Arquivo maior que 200MB. Comprima antes de enviar.");
			return;
		}
		setUploading(true);
		setUploadProgress(8);
		try {
			const { data: userData } = await supabase.auth.getUser();
			const userId = userData.user?.id;
			if (!userId) throw new Error("Sessão expirada");
			const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
			const path = `${userId}/library/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
			const tick = setInterval(() => {
				setUploadProgress((p) => p < 88 ? p + Math.max(1, Math.round((90 - p) / 8)) : p);
			}, 400);
			const { error: uploadError } = await supabase.storage.from("exercise-media").upload(path, file, {
				contentType: file.type,
				upsert: false
			});
			clearInterval(tick);
			if (uploadError) throw uploadError;
			const { data: signed, error: signErr } = await supabase.storage.from("exercise-media").createSignedUrl(path, 3600 * 24 * 365 * 100);
			if (signErr || !signed?.signedUrl) throw signErr ?? /* @__PURE__ */ new Error("Falha ao gerar URL");
			setMediaUrl(signed.signedUrl);
			setMediaType("upload");
			setUploadProgress(100);
			toast.success("Vídeo enviado com sucesso");
		} catch (e) {
			toast.error(e.message ?? "Erro ao enviar vídeo");
			setUploadProgress(0);
		} finally {
			setUploading(false);
		}
	}
	function clearMedia() {
		setMediaUrl("");
		setMediaType(null);
		setUploadProgress(0);
	}
	async function handleSave() {
		if (!name.trim()) {
			toast.error("Informe o nome do movimento.");
			return;
		}
		setSaving(true);
		try {
			const { data: userData } = await supabase.auth.getUser();
			const userId = userData.user?.id;
			if (!userId) throw new Error("Sessão expirada");
			const trimmed = mediaUrl.trim();
			const resolvedType = trimmed ? isUpload ? "upload" : detectMedia(trimmed).type : null;
			const resolvedThumb = trimmed && !isUpload ? detectMedia(trimmed).thumb : null;
			const payload = {
				name: name.trim(),
				muscle_group: muscleGroup || null,
				media_url: trimmed || null,
				media_type: resolvedType,
				thumbnail_url: resolvedThumb,
				description: description.trim() || null
			};
			if (editing) {
				const { error } = await supabase.from("pt_exercises_library").update(payload).eq("id", editing.id);
				if (error) throw error;
				toast.success("Movimento atualizado");
			} else {
				const { error } = await supabase.from("pt_exercises_library").insert({
					...payload,
					user_id: userId
				});
				if (error) throw error;
				toast.success("Movimento cadastrado");
			}
			onSaved();
			onOpenChange(false);
		} catch (e) {
			toast.error(e.message ?? "Erro ao salvar");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90dvh] max-w-2xl overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Editar movimento" : "Novo movimento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Cadastre uma vez, reutilize em todos os treinos. Cole um link do YouTube/Vimeo ou envie seu próprio vídeo — armazenado com segurança na sua conta." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "ex-name",
								children: ["Nome ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ex-name",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Ex.: Agachamento livre com barra",
								autoFocus: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ex-group",
								children: "Grupo muscular"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: muscleGroup || "__none__",
								onValueChange: (v) => setMuscleGroup(v === "__none__" ? "" : v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "ex-group",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecionar…" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "__none__",
									children: "Sem grupo"
								}), MUSCLE_GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: g,
									children: g
								}, g))] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-3.5 w-3.5" }), "Vídeo de referência"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
								value: tab,
								onValueChange: (v) => setTab(v),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
										className: "grid w-full grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "link",
											className: "gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-3.5 w-3.5" }), "Link"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "upload",
											className: "gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-3.5 w-3.5" }), "Enviar vídeo"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
										value: "link",
										className: "mt-3 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "ex-media",
											value: isUpload ? "" : mediaUrl,
											onChange: (e) => {
												setMediaUrl(e.target.value);
												setMediaType(null);
											},
											placeholder: "https://youtube.com/… · vimeo.com/… · https://…/video.mp4",
											className: "h-11"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "YouTube e Vimeo geram preview automaticamente."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
										value: "upload",
										className: "mt-3 space-y-2",
										children: isUpload && mediaUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "overflow-hidden rounded-lg border border-border/60 bg-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
												src: mediaUrl,
												controls: true,
												className: "aspect-video w-full"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2 border-t border-border/60 bg-card/40 px-3 py-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlay, { className: "h-3.5 w-3.5 text-primary" }), "Vídeo próprio · armazenado com segurança"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													type: "button",
													variant: "ghost",
													size: "sm",
													onClick: clearMedia,
													className: "h-8 gap-1.5 text-muted-foreground hover:text-destructive",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), "Trocar"]
												})]
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											onDragOver: (e) => {
												e.preventDefault();
												setDragOver(true);
											},
											onDragLeave: () => setDragOver(false),
											onDrop: (e) => {
												e.preventDefault();
												setDragOver(false);
												const f = e.dataTransfer.files?.[0];
												if (f) handleFileSelected(f);
											},
											className: cn("group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200", "border-border/70 hover:border-primary/60 hover:bg-primary/[0.03]", "focus-within:border-primary focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background", dragOver && "scale-[1.01] border-primary bg-primary/[0.06]", uploading && "pointer-events-none opacity-70"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: cn("flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200", !uploading && "group-hover:scale-110"),
													children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, {
														className: "h-5 w-5",
														strokeWidth: 2
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm font-medium text-foreground",
														children: uploading ? "Enviando vídeo…" : dragOver ? "Solte aqui para enviar" : "Arraste um vídeo ou clique para selecionar"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground",
														children: "MP4, WebM ou MOV · até 200MB"
													})]
												}),
												uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "w-full max-w-xs space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
														value: uploadProgress,
														className: "h-1.5"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[11px] tabular-nums text-muted-foreground",
														children: [uploadProgress, "%"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept: "video/mp4,video/webm,video/quicktime",
													className: "sr-only",
													disabled: uploading,
													onChange: (e) => {
														const f = e.target.files?.[0];
														if (f) handleFileSelected(f);
														e.target.value = "";
													}
												})
											]
										})
									})
								]
							})]
						}),
						mediaUrl && !isUpload && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase tracking-wider text-muted-foreground",
								children: "Preview"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-hidden rounded-lg border border-border/60 bg-muted",
								children: embed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
									src: embed,
									title: "Preview",
									allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
									allowFullScreen: true,
									className: "aspect-video w-full"
								}) : media?.type === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: mediaUrl,
									controls: true,
									className: "aspect-video w-full"
								}) : media?.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: mediaUrl,
									alt: "Preview",
									className: "aspect-video w-full object-contain"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: mediaUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "flex aspect-video w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" }), "Abrir link em nova aba"]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ex-desc",
								children: "Observações técnicas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "ex-desc",
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: "Postura, respiração, erros comuns…",
								rows: 3
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						disabled: saving,
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handleSave,
						disabled: saving,
						className: "gap-2",
						children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), editing ? "Salvar alterações" : "Cadastrar movimento"]
					})]
				})
			]
		})
	});
}
function ExerciseViewer({ item, onOpenChange }) {
	if (!item) return null;
	const embed = item.media_url ? youtubeEmbed(item.media_url) : null;
	const media = item.media_url ? detectMedia(item.media_url) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!item,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90dvh] max-w-3xl overflow-y-auto p-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden bg-muted",
					children: embed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						src: embed,
						title: item.name,
						allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
						allowFullScreen: true,
						className: "aspect-video w-full"
					}) : (item.media_type === "upload" || media?.type === "video") && item.media_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: item.media_url,
						controls: true,
						autoPlay: true,
						className: "aspect-video w-full"
					}) : media?.type === "image" && item.media_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.media_url,
						alt: item.name,
						className: "aspect-video w-full object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex aspect-video w-full items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, {
							className: "h-14 w-14 text-muted-foreground/40",
							strokeWidth: 1.5
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onOpenChange(false),
					className: "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/85 text-foreground shadow backdrop-blur-sm transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					"aria-label": "Fechar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-semibold leading-tight",
							children: item.name
						}), item.muscle_group && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "mt-2",
							children: item.muscle_group
						})]
					}), item.media_url && !embed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: item.media_url,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-1.5 text-sm text-primary hover:underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), "Abrir original"]
					})]
				}), item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground",
					children: item.description
				})]
			})]
		})
	});
}
//#endregion
export { BibliotecaPage as component };
