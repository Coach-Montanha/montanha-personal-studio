import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Cn as CalendarCheck, H as RotateCcwClock, N as Share2, Q as Pen, b as Trash2, dn as ChevronUp, hn as Check, mn as ChevronDown, n as X, nn as ClipboardList, sn as CircleCheck, x as Timer, yn as Calendar } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as Badge } from "./badge-DB22ix_c.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as formatDateBR, i as formatBRL } from "./format-BT-nao3-.mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { n as formatSeconds } from "./SessionTimer-BAIBXzxF.mjs";
import { t as WorkoutSummaryDialog } from "./WorkoutSummaryDialog-EMqTb5_R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfil-BIeHfyz4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HistoryShareSelector({ studentId }) {
	const [selectedExec, setSelectedExec] = (0, import_react.useState)(null);
	const [summaryOpen, setSummaryOpen] = (0, import_react.useState)(false);
	const [listDialogOpen, setListDialogOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editFeedback, setEditFeedback] = (0, import_react.useState)("");
	const qc = useQueryClient();
	const { data: history = [], isLoading } = useQuery({
		queryKey: ["pt-execution-history-share", studentId],
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_executions").select(`
          id,
          executed_at,
          feedback,
          notes,
          training_day_id,
          pt_training_days (
            name,
            program_id
          )
        `).eq("pt_student_id", studentId).order("executed_at", { ascending: false }).limit(20);
			return data ?? [];
		}
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("pt_training_executions").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["pt-execution-history-share", studentId] });
			toast.success("Registro removido com sucesso");
		},
		onError: (err) => toast.error(err.message)
	});
	const updateMutation = useMutation({
		mutationFn: async ({ id, feedback }) => {
			const { error } = await supabase.from("pt_training_executions").update({ feedback }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["pt-execution-history-share", studentId] });
			setEditingId(null);
			toast.success("Feedback atualizado!");
		},
		onError: (err) => toast.error(err.message)
	});
	const { data: exercises = [] } = useQuery({
		queryKey: ["pt-history-exercises", selectedExec?.training_day_id],
		enabled: !!selectedExec?.training_day_id,
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_exercises").select("*").eq("training_day_id", selectedExec.training_day_id).order("sort_order", { ascending: true });
			return data ?? [];
		}
	});
	const handleShare = (exec) => {
		setSelectedExec(exec);
		setSummaryOpen(true);
	};
	const startEdit = (exec) => {
		setEditingId(exec.id);
		setEditFeedback(exec.feedback || "");
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-16 rounded-2xl bg-muted/40 animate-pulse flex items-center px-4 text-xs text-muted-foreground",
		children: "Carregando relatório de treinos..."
	});
	if (history.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 p-4 rounded-2xl border border-dashed border-border bg-card/40 text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-5 w-5 text-muted-foreground/60 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs",
			children: "Nenhum treino anterior registrado ainda."
		})]
	});
	const latestExec = history[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs transition-all hover:border-primary/40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col xs:flex-row xs:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-bold text-foreground",
							children: "Relatório de Treinos Anteriores"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground truncate mt-0.5",
							children: [
								history.length,
								" ",
								history.length === 1 ? "sessão registrada" : "sessões registradas"
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					onClick: () => setListDialogOpen(true),
					size: "sm",
					className: "gap-1.5 rounded-xl font-semibold shadow-xs shrink-0 self-start xs:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcwClock, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Ver Relatório (",
						history.length,
						")"
					] })]
				})]
			}), latestExec && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 pt-3 border-t border-border/60 flex items-center justify-between gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "truncate",
					children: [
						"Último: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: latestExec.pt_training_days?.name || "Treino"
						}),
						" (",
						formatDateBR(latestExec.executed_at),
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: () => handleShare(latestExec),
					className: "h-7 px-2 text-[11px] font-semibold text-primary hover:bg-primary/10 rounded-lg shrink-0 gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Foto" })]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: listDialogOpen,
			onOpenChange: setListDialogOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-lg w-[95vw] sm:w-full max-h-[85vh] overflow-y-auto rounded-2xl p-4 sm:p-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "text-left space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary",
								children: [
									history.length,
									" ",
									history.length === 1 ? "registro" : "registros"
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-lg sm:text-xl font-bold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-5 w-5 text-primary" }), "Relatório de Treinos Anteriores"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Histórico das sessões realizadas. Gere imagens para Story/WhatsApp, edite feedbacks ou consulte cargas."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3 pt-1",
					children: history.map((exec) => {
						let parsedNotes = {};
						try {
							parsedNotes = typeof exec.notes === "string" ? JSON.parse(exec.notes) : exec.notes || {};
						} catch {}
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 rounded-xl border border-border bg-card/70 p-3.5 hover:border-primary/40 hover:bg-muted/20 transition-all shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-bold truncate text-foreground",
											children: exec.pt_training_days?.name || "Treino"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDateBR(exec.executed_at) }), parsedNotes?.timerSeconds ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-0.5 tabular-nums text-foreground/80",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-3 w-3 text-muted-foreground" }), formatSeconds(parsedNotes.timerSeconds)]
											})] }) : null]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 shrink-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											className: "h-8 gap-1 px-2.5 text-xs font-semibold rounded-lg text-primary hover:bg-primary/10",
											onClick: () => handleShare(exec),
											title: "Gerar foto para Story ou WhatsApp",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden xs:inline",
												children: "Foto"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg",
											onClick: () => startEdit(exec),
											title: "Editar feedback",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-8 w-8 text-muted-foreground hover:text-destructive rounded-lg",
											onClick: () => {
												if (confirm("Tem certeza que deseja apagar este registro?")) deleteMutation.mutate(exec.id);
											},
											title: "Excluir registro",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})
									]
								})]
							}), editingId === exec.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 mt-2 animate-in slide-in-from-top-1 duration-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: editFeedback,
									onChange: (e) => setEditFeedback(e.target.value),
									placeholder: "Editar feedback do treino...",
									className: "text-xs min-h-[60px] rounded-xl"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => setEditingId(null),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3 mr-1" }), " Cancelar"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: () => updateMutation.mutate({
											id: exec.id,
											feedback: editFeedback
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 mr-1" }), " Salvar"]
									})]
								})]
							}) : exec.feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground italic bg-muted/30 p-2.5 rounded-lg border border-border/50 mt-1",
								children: [
									"\"",
									exec.feedback,
									"\""
								]
							})]
						}, exec.id);
					})
				})]
			})
		}),
		selectedExec && (() => {
			let notes = {};
			try {
				notes = typeof selectedExec.notes === "string" ? JSON.parse(selectedExec.notes || "{}") : selectedExec.notes || {};
			} catch {
				notes = {};
			}
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkoutSummaryDialog, {
				open: summaryOpen,
				onOpenChange: setSummaryOpen,
				dayName: selectedExec.pt_training_days?.name || "Treino",
				duration: notes.timerSeconds || 0,
				exercises,
				loads: notes.loads || {},
				feedback: selectedExec.feedback || "",
				executionId: selectedExec.id,
				initialExcludedExercises: notes.excludedExercises || [],
				completedSets: notes.completedSets,
				doneExercises: notes.doneExercises,
				previousExecutions: history
			});
		})()
	] });
}
function PerfilPage() {
	const [showHistory, setShowHistory] = (0, import_react.useState)(false);
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const { data: userTypes } = useQuery({
		queryKey: ["portal-user-types"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return {
				studio: false,
				pt: false,
				userId: null
			};
			const [studio, pt] = await Promise.all([supabase.from("students").select("id").eq("account_user_id", u.user.id).maybeSingle(), supabase.from("pt_students").select("id").eq("account_user_id", u.user.id).maybeSingle()]);
			return {
				studio: !!studio.data,
				pt: !!pt.data,
				studioId: studio.data?.id,
				ptId: pt.data?.id,
				userId: u.user.id
			};
		}
	});
	const { data: studioMe } = useQuery({
		queryKey: ["portal-me-studio", userTypes?.studioId],
		enabled: !!userTypes?.studioId,
		queryFn: async () => {
			const { data } = await supabase.from("students").select("id,name,email,phone,birth_date,status,created_at").eq("id", userTypes.studioId).single();
			return data;
		}
	});
	const { data: ptMe } = useQuery({
		queryKey: ["portal-me-pt", userTypes?.ptId],
		enabled: !!userTypes?.ptId,
		queryFn: async () => {
			const { data } = await supabase.from("pt_students").select("id,name,email,phone,birth_date,status,created_at,start_date,goal,health_notes").eq("id", userTypes.ptId).single();
			return data;
		}
	});
	const me = studioMe || ptMe;
	const { data: currentPayment } = useQuery({
		queryKey: ["perfil-current-payment", me?.id],
		enabled: !!me?.id,
		queryFn: async () => {
			const { data } = await supabase.from("payments").select("amount,payment_date,due_date,status,plans(name,price,billing_cycle,description)").eq("student_id", me.id).eq("status", "paid").not("plan_id", "is", null).order("payment_date", { ascending: false }).limit(10);
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			return (data ?? []).find((p) => !p.due_date || p.due_date >= today) ?? null;
		}
	});
	const { data: planHistory = [] } = useQuery({
		queryKey: ["perfil-plan-history", me?.id],
		enabled: !!me?.id && showHistory,
		queryFn: async () => {
			const { data } = await supabase.from("student_plan_history").select("id,start_date,end_date,is_current,plans(name,price,billing_cycle)").eq("student_id", me.id).order("start_date", { ascending: false });
			return data ?? [];
		}
	});
	const { data: paymentsHistory = [] } = useQuery({
		queryKey: ["perfil-payments-history", userTypes?.studioId],
		enabled: !!userTypes?.studioId && showHistory,
		queryFn: async () => {
			const { data } = await supabase.from("payments").select("id,amount,payment_date,due_date,status,reference_month,payment_method").eq("student_id", userTypes.studioId).order("payment_date", { ascending: false });
			return data ?? [];
		}
	});
	const { data: ptPaymentsHistory = [] } = useQuery({
		queryKey: ["perfil-pt-payments-history", userTypes?.ptId],
		enabled: !!userTypes?.ptId && showHistory,
		queryFn: async () => {
			const { data } = await supabase.from("pt_payments").select("id,amount,payment_date,due_date,status,pt_plans(name)").eq("pt_student_id", userTypes.ptId).order("payment_date", { ascending: false });
			return data ?? [];
		}
	});
	const [showAllCheckins, setShowAllCheckins] = (0, import_react.useState)(false);
	const { data: checkins = [], isLoading: loadingCheckins } = useQuery({
		queryKey: ["perfil-checkins", userTypes?.studioId],
		enabled: !!userTypes?.studioId,
		queryFn: async () => {
			const { data } = await supabase.from("class_attendance").select("id,created_at,class_sessions(session_date,start_time,classes(name,programs(name,color)))").eq("student_id", userTypes.studioId).order("created_at", { ascending: false }).limit(50);
			return data ?? [];
		}
	});
	async function changePassword() {
		if (newPassword.length < 6) return toast.error("Mínimo 6 caracteres");
		setLoading(true);
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Senha atualizada!");
		setNewPassword("");
	}
	const statusBadge = (status) => {
		if (status === "paid") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "border-state-paid/30 bg-state-paid-soft text-state-paid",
			children: "Pago"
		});
		if (status === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "secondary",
			children: "Pendente"
		});
		if (status === "overdue") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "destructive",
			children: "Vencido"
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "outline",
			children: status
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-overline mb-1.5 text-muted-foreground",
				children: userTypes?.studio && userTypes?.pt ? "Portal Híbrido" : "Área do aluno"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-title text-foreground",
				children: "Meus dados"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4 p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-overline text-muted-foreground",
						children: "Dados pessoais"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-overline text-muted-foreground",
								children: "Nome"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-body text-foreground",
								children: me?.name ?? "—"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-overline text-muted-foreground",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-body text-foreground",
								children: me?.email ?? "—"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-overline text-muted-foreground",
								children: "Telefone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-body text-foreground",
								children: me?.phone ?? "—"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-overline text-muted-foreground",
								children: "Nascimento"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-body text-foreground",
								children: me?.birth_date ? formatDateBR(me.birth_date) : "—"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-overline text-muted-foreground",
								children: "Aluno desde"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-body text-foreground",
								children: me?.created_at ? formatDateBR(me.created_at) : "—"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground pt-2 border-t",
						children: "Para alterar seus dados, entre em contato com o studio."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6",
				children: [userTypes?.studio && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "space-y-4 p-5 sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-overline text-muted-foreground",
							children: "Studio — Plano e Financeiro"
						}),
						currentPayment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-overline text-muted-foreground",
									children: "Plano atual"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg font-semibold",
									children: currentPayment.plans?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm text-muted-foreground",
									children: [
										formatBRL(Number(currentPayment.plans?.price ?? currentPayment.amount ?? 0)),
										" / ",
										currentPayment.plans?.billing_cycle ?? "mês"
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-3 pt-3 mt-2 border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-overline text-muted-foreground",
										children: "Valor pago"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-base font-medium",
										children: currentPayment.amount != null ? formatBRL(Number(currentPayment.amount)) : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-overline text-muted-foreground",
										children: "Data do pagamento"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-base font-medium",
										children: currentPayment.payment_date ? formatDateBR(currentPayment.payment_date) : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-overline text-muted-foreground",
										children: "Vencimento"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-base font-medium",
										children: currentPayment.due_date ? formatDateBR(currentPayment.due_date) : "—"
									})] })
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Sem plano de Studio ativo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setShowHistory((v) => !v),
							className: "transition-ui mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: [showHistory ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" }), showHistory ? "Ocultar histórico Studio" : "Ver histórico Studio"]
						}),
						showHistory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-overline mb-2 text-muted-foreground",
								children: "Histórico de planos Studio"
							}), planHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Nenhum plano registrado"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1.5",
								children: planHistory.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "transition-ui flex items-center justify-between rounded-xl border border-border bg-card/60 p-3 text-sm hover:bg-muted/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-medium",
										children: [
											h.plans?.name,
											" ",
											h.is_current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "ml-1 border-state-paid/30 bg-state-paid-soft text-[10px] text-state-paid",
												children: "atual"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											formatDateBR(h.start_date),
											" — ",
											h.end_date ? formatDateBR(h.end_date) : "atual"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-numeric text-xs",
										children: formatBRL(Number(h.plans?.price ?? 0))
									})]
								}, h.id))
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-overline mb-2 text-muted-foreground",
								children: "Histórico de pagamentos Studio"
							}), paymentsHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Nenhum pagamento registrado"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1.5",
								children: paymentsHistory.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "transition-ui flex items-center justify-between rounded-xl border border-border bg-card/60 p-3 text-sm hover:bg-muted/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: p.reference_month ?? formatDateBR(p.payment_date)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											"Pago em ",
											formatDateBR(p.payment_date),
											p.due_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · vence ", formatDateBR(p.due_date)] }),
											p.payment_method && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", p.payment_method] })
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [statusBadge(p.status), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-numeric text-xs",
											children: formatBRL(Number(p.amount))
										})]
									})]
								}, p.id))
							})] })]
						})
					]
				}), userTypes?.pt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "space-y-4 p-5 sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-overline text-muted-foreground",
						children: "Personal Trainer — Plano e Financeiro"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							ptMe?.goal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-overline text-muted-foreground",
								children: "Objetivo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: ptMe.goal
							})] }),
							ptPaymentsHistory.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-overline text-muted-foreground",
								children: "Últimos Pagamentos PT"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1.5",
								children: ptPaymentsHistory.slice(0, 5).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "transition-ui flex items-center justify-between rounded-xl border border-border bg-card/60 p-3 text-sm hover:bg-muted/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: p.pt_plans?.name ?? "Personal Trainer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											"Pago em ",
											formatDateBR(p.payment_date),
											p.due_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · vence ", formatDateBR(p.due_date)] })
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [statusBadge(p.status), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-numeric text-xs",
											children: formatBRL(Number(p.amount))
										})]
									})]
								}, p.id))
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Nenhum pagamento de PT registrado"
							}),
							userTypes?.ptId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-overline text-muted-foreground mb-3 block",
									children: "Relatório de Treinos Anteriores"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryShareSelector, { studentId: userTypes.ptId })]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4 p-5 sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold leading-tight text-foreground",
							children: "Histórico de check-ins"
						})]
					}), checkins.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground tabular-nums",
						children: [
							checkins.length,
							" ",
							checkins.length === 1 ? "registro" : "registros"
						]
					})]
				}), loadingCheckins ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 rounded-lg bg-muted/50 animate-pulse" }, i))
				}) : checkins.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Sem check-ins ainda"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-xs text-xs text-muted-foreground",
							children: "Seus check-ins aparecerão aqui após confirmar presença nas turmas."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border rounded-lg border",
					children: (showAllCheckins ? checkins : checkins.slice(0, 10)).map((c) => {
						const session = c.class_sessions;
						const cls = session?.classes;
						const prog = cls?.programs;
						const dateStr = session?.session_date ?? c.created_at;
						const d = new Date(dateStr);
						const day = d.getDate();
						const month = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
						const time = session?.start_time ? String(session.start_time).slice(0, 5) : new Date(c.created_at).toLocaleTimeString("pt-BR", {
							hour: "2-digit",
							minute: "2-digit"
						});
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-3 py-3 transition-colors duration-150 hover:bg-muted/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex w-10 flex-col items-center leading-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-lg font-bold tabular-nums",
										children: day
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground",
										children: month
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-medium",
										children: cls?.name ?? "Turma"
									}), prog?.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
										style: prog?.color ? {
											backgroundColor: `${prog.color}22`,
											color: prog.color
										} : void 0,
										children: prog.name
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs tabular-nums text-muted-foreground",
									children: time
								})
							]
						}, c.id);
					})
				}), checkins.length > 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setShowAllCheckins((v) => !v),
					className: "flex items-center gap-1 text-xs text-primary transition-colors duration-150 hover:underline",
					children: [showAllCheckins ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" }), showAllCheckins ? "Mostrar menos" : `Ver todos (${checkins.length})`]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4 p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-overline text-muted-foreground",
						children: "Alterar senha"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nova senha" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: newPassword,
							onChange: (e) => setNewPassword(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: changePassword,
						disabled: loading,
						children: loading ? "Salvando…" : "Atualizar senha"
					})
				]
			})
		]
	});
}
//#endregion
export { PerfilPage as component };
