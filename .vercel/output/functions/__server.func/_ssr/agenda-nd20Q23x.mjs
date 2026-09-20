import { o as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime, d as Description, f as Overlay, h as Title, l as Close, m as Root, p as Portal, u as Content } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { G as Plus, Z as Pencil, b as Trash2, n as X, s as Users, xn as CalendarDays } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as PageHeader } from "./PageHeader-CRue-aiN.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BymSQoye.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { d as updateClassSessionOverrides, f as updateClassSessionsFromOverrides, i as generateClassSessions, n as deleteClassSession, r as deleteClassSessionsFrom, t as deleteClassAll } from "./classes.functions-CBapcCd4.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { t as AgendaView } from "./AgendaView-B1OE-VVR.mjs";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-BJ3sdkEm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agenda-nd20Q23x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Root;
var SheetPortal = Portal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
	className: cn("fixed inset-0 z-50 bg-overlay backdrop-blur-[2px]  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = Overlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = Content.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = Title.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = Description.displayName;
var DOW = [
	"D",
	"S",
	"T",
	"Q",
	"Q",
	"S",
	"S"
];
var DOW_LABELS = [
	"Domingo",
	"Segunda",
	"Terça",
	"Quarta",
	"Quinta",
	"Sexta",
	"Sábado"
];
function DaysOfWeekChips({ value, onChange }) {
	const normalizedValue = Array.isArray(value) ? value.map((v) => Number(v)).filter((n) => !isNaN(n)) : [];
	function toggle(dow) {
		onChange((normalizedValue.includes(dow) ? normalizedValue.filter((d) => d !== dow) : [...normalizedValue, dow]).sort((a, b) => a - b));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2 py-1",
		children: DOW.map((letter, i) => {
			const on = normalizedValue.includes(i);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: (e) => {
					e.preventDefault();
					e.stopPropagation();
					toggle(i);
				},
				"aria-label": DOW_LABELS[i],
				"aria-pressed": on,
				className: cn("flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-xl font-bold text-sm transition-all select-none", "active:scale-95 touch-manipulation cursor-pointer border", on ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/25 ring-2 ring-primary/20" : "border-border/80 bg-background text-muted-foreground hover:bg-muted/70 hover:text-foreground hover:border-border"),
				children: letter
			}, i);
		})
	});
}
function formatDaysOfWeek(days) {
	if (!days || days.length === 0) return "—";
	const abbr = [
		"Dom",
		"Seg",
		"Ter",
		"Qua",
		"Qui",
		"Sex",
		"Sáb"
	];
	return [...days].sort().map((d) => abbr[d]).join(" · ");
}
function AgendaPage() {
	const qc = useQueryClient();
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [weeksToGenerate, setWeeksToGenerate] = (0, import_react.useState)(12);
	const genSessions = useServerFn(generateClassSessions);
	const { data: programs = [] } = useQuery({
		queryKey: ["programs-lookup"],
		queryFn: async () => {
			const { data } = await supabase.from("programs").select("id,name,color").order("name");
			return data ?? [];
		}
	});
	function openNew() {
		setEditing({
			name: "",
			trainer_name: "",
			days_of_week: [1],
			start_time: "07:00",
			duration_minutes: 60,
			capacity: 10,
			is_active: true,
			is_recurring: true,
			program_id: null,
			checkin_opens_minutes_before: 60,
			checkin_closes_minutes_before: 15
		});
		setDialogOpen(true);
	}
	async function openEditFromSession(classId) {
		const { data, error } = await supabase.from("classes").select("id,name,trainer_name,day_of_week,days_of_week,start_time,duration_minutes,capacity,is_active,is_recurring,notes,program_id,checkin_opens_minutes_before,checkin_closes_minutes_before").eq("id", classId).maybeSingle();
		if (error || !data) return toast.error(error?.message ?? "Turma não encontrada");
		const rawDays = data.days_of_week && data.days_of_week.length > 0 ? data.days_of_week : data.day_of_week !== null && data.day_of_week !== void 0 ? [data.day_of_week] : [];
		const safeDays = Array.isArray(rawDays) ? rawDays.map(Number).filter((n) => !isNaN(n)) : [];
		setEditing({
			...data,
			days_of_week: safeDays
		});
		setSelected(null);
		setDialogOpen(true);
	}
	async function saveClass() {
		if (!editing?.name) return toast.error("Nome obrigatório");
		if (!editing.days_of_week || editing.days_of_week.length === 0) return toast.error("Selecione ao menos um dia");
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) return;
		const payload = {
			user_id: u.user.id,
			name: editing.name,
			trainer_name: editing.trainer_name || null,
			days_of_week: editing.days_of_week,
			day_of_week: editing.days_of_week[0] ?? null,
			start_time: editing.start_time || "07:00",
			duration_minutes: editing.duration_minutes ?? 60,
			capacity: editing.capacity ?? 10,
			is_active: editing.is_active ?? true,
			is_recurring: editing.is_recurring ?? true,
			notes: editing.notes || null,
			program_id: editing.program_id || null,
			checkin_opens_minutes_before: editing.checkin_opens_minutes_before ?? 60,
			checkin_closes_minutes_before: editing.checkin_closes_minutes_before ?? 15
		};
		const { data: saved, error } = editing.id ? await supabase.from("classes").update(payload).eq("id", editing.id).select("id").single() : await supabase.from("classes").insert(payload).select("id").single();
		if (error) return toast.error(error.message);
		const classId = editing.id ?? saved?.id;
		if (classId && payload.is_active && payload.is_recurring) try {
			await genSessions({ data: {
				classId,
				weeks: weeksToGenerate
			} });
		} catch (e) {
			toast.error(`Turma salva, mas a agenda não foi gerada: ${e.message}`);
		}
		toast.success(editing.id ? "Turma atualizada" : "Turma criada");
		qc.invalidateQueries();
		setDialogOpen(false);
	}
	const delOne = useServerFn(deleteClassSession);
	const delFrom = useServerFn(deleteClassSessionsFrom);
	const delAll = useServerFn(deleteClassAll);
	async function runDelete(session, scope) {
		try {
			if (scope === "one") await delOne({ data: { sessionId: session.id } });
			else if (scope === "from") await delFrom({ data: { sessionId: session.id } });
			else if (scope === "all") if (!session.class_id) await delOne({ data: { sessionId: session.id } });
			else await delAll({ data: { classId: session.class_id } });
			toast.success("Excluído");
			qc.invalidateQueries();
			setSelected(null);
		} catch (e) {
			toast.error(e.message);
		}
	}
	async function generate(classId, weeks) {
		try {
			const res = await genSessions({ data: {
				classId,
				weeks
			} });
			toast.success(`${res.created} sessões criadas`);
			qc.invalidateQueries();
		} catch (e) {
			toast.error(e.message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: CalendarDays,
				eyebrow: "Studio",
				title: "Turmas & Agenda",
				description: "Suas turmas semanais e a ocupação em tempo real. Toque em um card para gerenciar.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full sm:w-auto",
					onClick: openNew,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Nova turma"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgendaView, { renderCard: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setSelected(s),
				className: "w-full text-left",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "min-h-[44px] space-y-1 border-l-4 p-2 transition hover:border-primary active:scale-[0.99]",
					style: { borderLeftColor: s.program_color ?? "var(--color-border)" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold",
							children: String(s.start_time).slice(0, 5)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: s.class_name
						}),
						s.program_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-[10px] uppercase tracking-wide text-muted-foreground",
							children: s.program_name
						}),
						s.trainer_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-xs text-muted-foreground",
							children: s.trainer_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `font-mono text-[10px] ${s.filled >= s.capacity ? "text-destructive" : "text-state-paid"}`,
							children: [
								s.filled,
								"/",
								s.capacity
							]
						})
					]
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!selected,
				onOpenChange: (v) => !v && setSelected(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					className: "w-full overflow-y-auto sm:max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
						className: "pr-6",
						children: selected?.class_name
					}) }), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionDetails, {
						session: selected,
						onEdit: () => selected.class_id && openEditFromSession(selected.class_id),
						onDelete: (scope) => void runDelete(selected, scope),
						onGenerate: (weeks) => {
							if (selected.class_id) generate(selected.class_id, weeks);
						}
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] max-w-lg overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? "Editar turma" : "Nova turma" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "h-11 sm:h-10",
										value: editing?.name ?? "",
										onChange: (e) => setEditing((f) => ({
											...f,
											name: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Treinador" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "h-11 sm:h-10",
										value: editing?.trainer_name ?? "",
										onChange: (e) => setEditing((f) => ({
											...f,
											trainer_name: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Programa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: editing?.program_id ?? "none",
										onValueChange: (v) => setEditing((f) => ({
											...f,
											program_id: v === "none" ? null : v
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-11 sm:h-10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Sem programa" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "none",
											children: "Sem programa"
										}), programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: p.id,
											children: p.name
										}, p.id))] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Dias da semana *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DaysOfWeekChips, {
										value: editing?.days_of_week ?? [],
										onChange: (v) => setEditing((f) => ({
											...f,
											days_of_week: v
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Horário" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "h-11 sm:h-10",
										type: "time",
										value: editing?.start_time ?? "07:00",
										onChange: (e) => setEditing((f) => ({
											...f,
											start_time: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duração (min)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "h-11 sm:h-10",
										type: "number",
										value: editing?.duration_minutes ?? 60,
										onChange: (e) => setEditing((f) => ({
											...f,
											duration_minutes: Number(e.target.value)
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Capacidade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "h-11 sm:h-10",
										type: "number",
										value: editing?.capacity ?? 10,
										onChange: (e) => setEditing((f) => ({
											...f,
											capacity: Number(e.target.value)
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-3 border-t pt-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-overline text-muted-foreground",
											children: "Janela de check-in do aluno"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Abre X min antes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													className: "h-11 sm:h-10",
													type: "number",
													min: 0,
													value: editing?.checkin_opens_minutes_before ?? 60,
													onChange: (e) => setEditing((f) => ({
														...f,
														checkin_opens_minutes_before: Number(e.target.value)
													}))
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Fecha X min antes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													className: "h-11 sm:h-10",
													type: "number",
													min: 0,
													value: editing?.checkin_closes_minutes_before ?? 15,
													onChange: (e) => setEditing((f) => ({
														...f,
														checkin_closes_minutes_before: Number(e.target.value)
													}))
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Ex: 60 e 15 → o aluno pode marcar/desmarcar entre 60 min antes e 15 min antes do início."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 flex flex-wrap items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: editing?.is_active ?? true,
											onCheckedChange: (v) => setEditing((f) => ({
												...f,
												is_active: v
											}))
										}), "Ativa"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: editing?.is_recurring ?? true,
											onCheckedChange: (v) => setEditing((f) => ({
												...f,
												is_recurring: v
											}))
										}), "Recorrente semanal"]
									})]
								}),
								(editing?.is_recurring ?? true) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Gerar sessões para" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: String(weeksToGenerate),
											onValueChange: (v) => setWeeksToGenerate(Number(v)),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-11 sm:h-10",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
												className: "max-h-[240px]",
												children: Array.from({ length: 52 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
													value: String(n),
													children: [
														n,
														" ",
														n === 1 ? "semana" : "semanas"
													]
												}, n))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Sessões recorrentes serão pré-criadas para este prazo (1 a 52 semanas)."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
										value: editing?.notes ?? "",
										onChange: (e) => setEditing((f) => ({
											...f,
											notes: e.target.value
										}))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "h-11 sm:h-10",
								onClick: () => setDialogOpen(false),
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "h-11 sm:h-10",
								onClick: saveClass,
								children: "Salvar"
							})]
						})
					]
				})
			})
		]
	});
}
function SessionDetails({ session, onEdit, onDelete, onGenerate }) {
	const qc = useQueryClient();
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [genWeeks, setGenWeeks] = (0, import_react.useState)(12);
	const [addSearch, setAddSearch] = (0, import_react.useState)("");
	const [delOpen, setDelOpen] = (0, import_react.useState)(false);
	const [delScope, setDelScope] = (0, import_react.useState)("one");
	const [sessionEditOpen, setSessionEditOpen] = (0, import_react.useState)(false);
	const { data: classInfo } = useQuery({
		queryKey: ["class-info", session.class_id],
		enabled: !!session.class_id,
		queryFn: async () => {
			const { data } = await supabase.from("classes").select("days_of_week,day_of_week,duration_minutes,notes,is_recurring").eq("id", session.class_id).maybeSingle();
			return data;
		}
	});
	const { data: checkedIn = [] } = useQuery({
		queryKey: ["session-checkins", session.id],
		queryFn: async () => {
			const { data } = await supabase.from("class_attendance").select("id, students(id,name,email,phone)").eq("session_id", session.id);
			return data ?? [];
		}
	});
	const { data: students = [] } = useQuery({
		queryKey: ["students-lookup-with-status"],
		queryFn: async () => {
			const { data } = await supabase.from("students").select("id, name, status").order("name");
			return data ?? [];
		}
	});
	const [showAllStudents, setShowAllStudents] = (0, import_react.useState)(false);
	const checkedInIds = new Set(checkedIn.map((c) => c.students?.id).filter(Boolean));
	const notCheckedIn = students.filter((s) => !checkedInIds.has(s.id));
	const activeStudents = notCheckedIn.filter((s) => s.status === "active");
	const availableStudents = showAllStudents ? notCheckedIn : activeStudents;
	const hiddenInactiveCount = notCheckedIn.length - activeStudents.length;
	const isFull = checkedIn.length >= session.capacity;
	const daysList = classInfo?.days_of_week && classInfo.days_of_week.length > 0 ? classInfo.days_of_week : classInfo?.day_of_week !== null && classInfo?.day_of_week !== void 0 ? [classInfo.day_of_week] : [];
	async function removeCheckin(id, name) {
		if (!await confirmDialog(`Remover o check-in de ${name ?? "este aluno"}?`)) return;
		const { error } = await supabase.from("class_attendance").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Check-in removido");
		qc.invalidateQueries();
	}
	async function addCheckin(studentId) {
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) return;
		const { error } = await supabase.from("class_attendance").insert({
			session_id: session.id,
			student_id: studentId,
			user_id: u.user.id,
			status: "present"
		});
		if (error) return toast.error(error.message);
		toast.success("Check-in adicionado");
		qc.invalidateQueries();
	}
	const when = /* @__PURE__ */ new Date(`${session.session_date}T${session.start_time}`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-1.5 p-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Sessão:"
						}),
						" ",
						when.toLocaleString("pt-BR", {
							dateStyle: "full",
							timeStyle: "short"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Duração:"
						}),
						" ",
						session.duration_minutes,
						" min"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Programa:"
						}),
						" ",
						session.program_name ?? "—"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Treinador:"
						}),
						" ",
						session.trainer_name ?? "—"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Vagas:"
						}),
						" ",
						session.filled,
						"/",
						session.capacity
					] }),
					daysList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Recorre:"
						}),
						" ",
						formatDaysOfWeek(daysList)
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Janela check-in:"
						}),
						" ",
						session.checkin_opens_minutes_before,
						"min antes → ",
						session.checkin_closes_minutes_before,
						"min antes"
					] }),
					classInfo?.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Notas:"
							}),
							" ",
							classInfo.notes
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "h-11 sm:h-9",
						onClick: () => setSessionEditOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-1 h-3 w-3" }), " Editar esta sessão"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "h-11 sm:h-9",
						onClick: onEdit,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-1 h-3 w-3" }), " Editar turma (modelo)"]
					}),
					classInfo?.is_recurring && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: String(genWeeks),
							onValueChange: (v) => setGenWeeks(Number(v)),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-11 w-[92px] sm:h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
								className: "max-h-[240px]",
								children: Array.from({ length: 52 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: String(n),
									children: [
										n,
										" ",
										n === 1 ? "semana" : "semanas"
									]
								}, n))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							className: "h-11 sm:h-9",
							onClick: () => onGenerate(genWeeks),
							children: "Gerar"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "destructive",
						className: "h-11 sm:h-9",
						onClick: () => {
							setDelScope("one");
							setDelOpen(true);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-3 w-3" }), " Excluir…"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: delOpen,
				onOpenChange: setDelOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Excluir turma" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Escolha o alcance da exclusão. Sessões recorrentes agora são independentes — você pode remover apenas esta, esta e todas as futuras, ou a turma inteira." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
						value: delScope,
						onValueChange: (v) => setDelScope(v),
						className: "space-y-2 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-start gap-2 rounded-md border p-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
									value: "one",
									id: "scope-one",
									className: "mt-0.5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: "Somente esta sessão"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Remove apenas a aula deste dia/horário. Nenhuma outra é afetada."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-start gap-2 rounded-md border p-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
									value: "from",
									id: "scope-from",
									className: "mt-0.5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: "Esta e as seguintes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Remove esta sessão e todas as futuras desta turma. Sessões passadas ficam intactas."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-start gap-2 rounded-md border p-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
									value: "all",
									id: "scope-all",
									className: "mt-0.5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: "Todas (excluir a turma)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Remove a turma e todas as sessões (passadas e futuras) e seus check-ins."
								})] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
						onClick: () => onDelete(delScope),
						children: "Excluir"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionOverrideDialog, {
				open: sessionEditOpen,
				onOpenChange: setSessionEditOpen,
				session,
				onSaved: () => qc.invalidateQueries()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-sm font-semibold",
						children: [
							"Check-ins (",
							checkedIn.length,
							"/",
							session.capacity,
							")"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "mb-3 h-11 w-full sm:h-10",
					disabled: isFull,
					onClick: () => setAddOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), isFull ? "Turma cheia" : "Adicionar aluno ao check-in"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1",
					children: checkedIn.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Nenhum aluno fez check-in ainda"
					}) : checkedIn.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-md border p-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-medium",
								children: e.students?.name
							}), e.students?.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-xs text-muted-foreground",
								children: e.students.phone
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "h-11 w-11 shrink-0 text-destructive hover:text-destructive",
							onClick: () => removeCheckin(e.id, e.students?.name),
							"aria-label": "Remover check-in",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					}, e.id))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addOpen,
				onOpenChange: (v) => {
					setAddOpen(v);
					if (!v) {
						setAddSearch("");
						setShowAllStudents(false);
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Adicionar aluno ao check-in" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "h-11 sm:h-10",
							placeholder: "Buscar aluno...",
							value: addSearch,
							onChange: (e) => setAddSearch(e.target.value),
							autoFocus: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 max-h-80 space-y-1 overflow-y-auto",
							children: availableStudents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "py-4 text-center text-sm text-muted-foreground",
								children: showAllStudents ? "Todos os alunos já fizeram check-in nesta sessão." : "Nenhum aluno ativo disponível."
							}) : availableStudents.filter((s) => s.name.toLowerCase().includes(addSearch.toLowerCase())).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "min-h-[44px] w-full rounded-md border p-2 text-left text-sm transition hover:bg-accent flex items-center justify-between gap-2",
								onClick: async () => {
									await addCheckin(s.id);
									setAddOpen(false);
									setAddSearch("");
									setShowAllStudents(false);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: s.name
								}), showAllStudents && s.status && s.status !== "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize",
									children: s.status === "inactive" ? "inativo" : s.status === "churned" ? "cancelado" : s.status
								})]
							}, s.id))
						}),
						!showAllStudents && hiddenInactiveCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "w-full",
							onClick: () => setShowAllStudents(true),
							children: [
								"Exibir todos (",
								hiddenInactiveCount,
								" inativo",
								hiddenInactiveCount === 1 ? "" : "s",
								")"
							]
						}),
						showAllStudents && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							className: "w-full",
							onClick: () => setShowAllStudents(false),
							children: "Mostrar só ativos"
						})
					]
				})
			})
		]
	});
}
function SessionOverrideDialog({ open, onOpenChange, session, onSaved }) {
	const updOne = useServerFn(updateClassSessionOverrides);
	const updFrom = useServerFn(updateClassSessionsFromOverrides);
	const [date, setDate] = (0, import_react.useState)(session.session_date);
	const [time, setTime] = (0, import_react.useState)(String(session.start_time).slice(0, 5));
	const [duration, setDuration] = (0, import_react.useState)(session.duration_minutes);
	const [cap, setCap] = (0, import_react.useState)(session.capacity_override ?? session.capacity);
	const [notes, setNotes] = (0, import_react.useState)(session.session_notes ?? "");
	const [scope, setScope] = (0, import_react.useState)("one");
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function save() {
		setSaving(true);
		try {
			const capOverride = cap === "" ? null : Number(cap) === session.capacity && session.capacity_override === null ? null : Number(cap);
			if (scope === "one") await updOne({ data: {
				sessionId: session.id,
				session_date: date,
				start_time: `${time}:00`,
				duration_minutes: Number(duration),
				capacity_override: capOverride,
				notes: notes.trim() ? notes.trim() : null
			} });
			else await updFrom({ data: {
				sessionId: session.id,
				start_time: `${time}:00`,
				duration_minutes: Number(duration),
				capacity_override: capOverride,
				notes: notes.trim() ? notes.trim() : null
			} });
			toast.success("Alterações salvas");
			onSaved();
			onOpenChange(false);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Editar sessão" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: date,
										onChange: (e) => setDate(e.target.value),
										disabled: scope === "from",
										className: "h-11 sm:h-10"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Horário" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: time,
										onChange: (e) => setTime(e.target.value),
										className: "h-11 sm:h-10"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duração (min)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: duration,
										onChange: (e) => setDuration(Number(e.target.value)),
										className: "h-11 sm:h-10"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Capacidade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: cap,
										onChange: (e) => setCap(e.target.value === "" ? "" : Number(e.target.value)),
										className: "h-11 sm:h-10"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notas desta sessão" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: notes,
								onChange: (e) => setNotes(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 rounded-md border p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-overline text-muted-foreground",
									children: "Aplicar em"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
									value: scope,
									onValueChange: (v) => setScope(v),
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
											value: "one",
											id: "edit-one"
										}), "Somente esta sessão"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
											value: "from",
											id: "edit-from"
										}), "Esta e as seguintes (mantém a data de cada uma)"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Para alterar nome, treinador, programa ou dias da semana da turma, use “Editar turma (modelo)”. As sessões já geradas permanecem independentes."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					disabled: saving,
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					disabled: saving,
					children: "Salvar"
				})] })
			]
		})
	});
}
//#endregion
export { AgendaPage as component };
