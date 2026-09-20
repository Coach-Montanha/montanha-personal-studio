import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DEnZ0u5J.mjs";
import { a as formatDateBR, i as formatBRL } from "./format-BT-nao3-.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BymSQoye.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { t as Checkbox } from "./checkbox-kt6FvQcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/diagnostics-HcauE54p.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DiagnosticsPage() {
	const qc = useQueryClient();
	const [threshold, setThreshold] = (0, import_react.useState)("100");
	const [fixing, setFixing] = (0, import_react.useState)(false);
	const [deleted, setDeleted] = (0, import_react.useState)(null);
	const [selectedIds, setSelectedIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [mergeType, setMergeType] = (0, import_react.useState)("students");
	const [keepId, setKeepId] = (0, import_react.useState)("");
	const [mergeIds, setMergeIds] = (0, import_react.useState)([]);
	const [mergeSearch, setMergeSearch] = (0, import_react.useState)("");
	const [merging, setMerging] = (0, import_react.useState)(false);
	const [mergeConfirmOpen, setMergeConfirmOpen] = (0, import_react.useState)(false);
	const { data: lowPayments = [], isLoading, refetch } = useQuery({
		queryKey: ["diagnostics-low-payments", threshold],
		queryFn: async () => {
			const { data, error } = await supabase.from("payments").select("id,amount,payment_date,reference_month,status,student_id,plan_id,students(name),plans(name)").lt("amount", Number(threshold)).order("amount", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: duplicates = [], isLoading: loadingDupes } = useQuery({
		queryKey: ["diagnostics-duplicates"],
		queryFn: async () => {
			let all = [];
			let from = 0;
			while (true) {
				const { data } = await supabase.from("payments").select("id,amount,payment_date,reference_month,status,student_id,students(name),plans(name)").order("payment_date", { ascending: false }).range(from, from + 999);
				all = all.concat(data ?? []);
				if (!data || data.length < 1e3) break;
				from += 1e3;
			}
			const seen = /* @__PURE__ */ new Map();
			const dupes = [];
			for (const p of all) {
				const key = `${p.student_id}|${p.reference_month}|${p.amount}|${p.payment_date}`;
				if (seen.has(key)) dupes.push({
					...p,
					original_id: seen.get(key).id
				});
				else seen.set(key, p);
			}
			return dupes;
		}
	});
	const { data: allStudents = [] } = useQuery({
		queryKey: ["diagnostics-all-students"],
		queryFn: async () => {
			const { data } = await supabase.from("students").select("id,name,email,phone,status,created_at,payments(id,amount,payment_date,reference_month,status)").order("name");
			return data ?? [];
		}
	});
	const { data: allPtStudents = [] } = useQuery({
		queryKey: ["diagnostics-all-pt-students"],
		queryFn: async () => {
			const { data } = await supabase.from("pt_students").select("id,name,email,phone,status,created_at,pt_payments(id,amount,payment_date,status),pt_sessions(id,session_date,status)").order("name");
			return data ?? [];
		}
	});
	async function executeMerge() {
		if (!keepId || mergeIds.length === 0) return toast.error("Selecione o perfil a manter e ao menos um perfil a fundir.");
		if (mergeIds.includes(keepId)) return toast.error("O perfil a manter não pode estar entre os que serão fundidos.");
		setMerging(true);
		let okCount = 0;
		const errors = [];
		try {
			for (const mid of mergeIds) try {
				if (mergeType === "students") {
					const { error: e1 } = await supabase.from("payments").update({ student_id: keepId }).eq("student_id", mid);
					if (e1) throw e1;
					const { error: e2 } = await supabase.from("student_plan_history").update({ student_id: keepId }).eq("student_id", mid);
					if (e2) throw e2;
					const { error: e3 } = await supabase.from("students").delete().eq("id", mid);
					if (e3) throw e3;
				} else {
					const { error: e1 } = await supabase.from("pt_sessions").update({ pt_student_id: keepId }).eq("pt_student_id", mid);
					if (e1) throw e1;
					const { error: e2 } = await supabase.from("pt_payments").update({ pt_student_id: keepId }).eq("pt_student_id", mid);
					if (e2) throw e2;
					const { error: e3 } = await supabase.from("pt_students").delete().eq("id", mid);
					if (e3) throw e3;
				}
				okCount++;
			} catch (err) {
				errors.push(err.message);
			}
			if (okCount > 0) toast.success(`${okCount} perfil(is) fundido(s) com sucesso!`);
			if (errors.length > 0) toast.error(`${errors.length} falha(s): ${errors[0]}`);
			setKeepId("");
			setMergeIds([]);
			setMergeConfirmOpen(false);
			qc.invalidateQueries();
		} finally {
			setMerging(false);
		}
	}
	const allList = mergeType === "students" ? allStudents : allPtStudents;
	const keepStudent = allList.find((s) => s.id === keepId);
	const mergeStudents = mergeIds.map((id) => allList.find((s) => s.id === id)).filter(Boolean);
	const paymentsOf = (s) => (mergeType === "students" ? s?.payments?.length : s?.pt_payments?.length) ?? 0;
	const sessionsOf = (s) => mergeType === "pt_students" ? s?.pt_sessions?.length ?? 0 : null;
	const keepPayments = paymentsOf(keepStudent);
	const keepSessions = sessionsOf(keepStudent);
	const totalMergePayments = mergeStudents.reduce((n, s) => n + paymentsOf(s), 0);
	const totalMergeSessions = mergeType === "pt_students" ? mergeStudents.reduce((n, s) => n + (s?.pt_sessions?.length ?? 0), 0) : null;
	function toggleMergeId(id) {
		setMergeIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	}
	function toggleSelect(id) {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	}
	function selectAll() {
		setSelectedIds(new Set(lowPayments.map((p) => p.id)));
	}
	async function deleteSelected() {
		if (selectedIds.size === 0) return toast.error("Selecione ao menos um registro.");
		if (!await confirmDialog(`Excluir ${selectedIds.size} pagamento(s) selecionado(s)? Esta ação não pode ser desfeita.`)) return;
		setFixing(true);
		const ids = [...selectedIds];
		let count = 0;
		for (let i = 0; i < ids.length; i += 50) {
			const batch = ids.slice(i, i + 50);
			const { error } = await supabase.from("payments").delete().in("id", batch);
			if (!error) count += batch.length;
		}
		setDeleted(count);
		setSelectedIds(/* @__PURE__ */ new Set());
		setFixing(false);
		toast.success(`${count} pagamento(s) excluído(s).`);
		qc.invalidateQueries();
		refetch();
	}
	async function deleteAllDuplicates() {
		if (duplicates.length === 0) return toast.success("Nenhuma duplicata encontrada.");
		if (!await confirmDialog(`Excluir ${duplicates.length} pagamento(s) duplicado(s)?`)) return;
		setFixing(true);
		const ids = duplicates.map((d) => d.id);
		let count = 0;
		for (let i = 0; i < ids.length; i += 50) {
			const batch = ids.slice(i, i + 50);
			const { error } = await supabase.from("payments").delete().in("id", batch);
			if (!error) count += batch.length;
		}
		setFixing(false);
		toast.success(`${count} duplicata(s) removida(s).`);
		qc.invalidateQueries();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-start justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold",
					children: "🔧 Diagnóstico de Dados"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mt-1",
					children: "Página administrativa para identificar e corrigir inconsistências nos dados. Acesse por: /diagnostics"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Pagamentos com valor abaixo do limite"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm",
						children: "Identifique registros com valores suspeitos."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "threshold",
								children: "Valor mínimo (R$)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "threshold",
								type: "number",
								value: threshold,
								onChange: (e) => {
									setThreshold(e.target.value);
									setSelectedIds(/* @__PURE__ */ new Set());
								}
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => refetch(),
							children: "Atualizar"
						})]
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground py-8 text-center",
					children: "Carregando…"
				}) : lowPayments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground py-8 text-center",
					children: [
						"✅ Nenhum pagamento encontrado abaixo de R$ ",
						threshold,
						"."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground text-sm",
								children: [lowPayments.length, " registro(s) encontrado(s)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: selectAll,
								children: "Selecionar todos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setSelectedIds(/* @__PURE__ */ new Set()),
								children: "Limpar seleção"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								size: "sm",
								disabled: selectedIds.size === 0 || fixing,
								onClick: deleteSelected,
								children: fixing ? "Excluindo…" : `Excluir selecionados (${selectedIds.size})`
							})
						]
					}),
					deleted !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-state-paid",
						children: [
							"✅ ",
							deleted,
							" registro(s) excluído(s) com sucesso."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto rounded-md border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "w-10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: lowPayments.length > 0 && selectedIds.size === lowPayments.length,
									onCheckedChange: (checked) => checked ? selectAll() : setSelectedIds(/* @__PURE__ */ new Set()),
									"aria-label": "Selecionar todos"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aluno" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plano" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Valor" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data Pagamento" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mês Referência" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: lowPayments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "cursor-pointer",
							onClick: () => toggleSelect(p.id),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									onClick: (e) => e.stopPropagation(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: selectedIds.has(p.id),
										onCheckedChange: () => toggleSelect(p.id),
										"aria-label": `Selecionar pagamento ${p.id}`
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.students?.name ?? "—" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.plans?.name ?? "—" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatBRL(p.amount) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDateBR(p.payment_date) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.reference_month }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.status })
							]
						}, p.id)) })] })
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Pagamentos duplicados"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm",
						children: "Mesmo aluno + mesmo mês + mesmo valor + mesma data."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "destructive",
						disabled: duplicates.length === 0 || fixing,
						onClick: deleteAllDuplicates,
						children: fixing ? "Removendo…" : `Remover todas (${duplicates.length})`
					})]
				}), loadingDupes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground py-8 text-center",
					children: "Analisando…"
				}) : duplicates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground py-8 text-center",
					children: "✅ Nenhuma duplicata encontrada."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto rounded-md border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aluno" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mês Referência" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Valor" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: duplicates.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.students?.name ?? "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.reference_month }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatBRL(p.amount) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDateBR(p.payment_date) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.status })
					] }, p.id)) })] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "🔀 Fundir perfis duplicados"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm",
						children: "Escolha o perfil a manter e marque um ou mais perfis duplicados para fundir. Todos os pagamentos e sessões dos perfis marcados serão transferidos para o perfil mantido."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: mergeType === "students" ? "default" : "outline",
							onClick: () => {
								setMergeType("students");
								setKeepId("");
								setMergeIds([]);
							},
							children: "Alunos padrão"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: mergeType === "pt_students" ? "default" : "outline",
							onClick: () => {
								setMergeType("pt_students");
								setKeepId("");
								setMergeIds([]);
							},
							children: "Alunos PT"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 rounded-lg border border-state-paid/30 bg-state-paid-soft p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-state-paid",
									children: "✅ Perfil a MANTER"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: keepId,
									onValueChange: (v) => {
										setKeepId(v);
										setMergeIds((prev) => prev.filter((x) => x !== v));
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o perfil a manter" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: allList.filter((s) => !mergeIds.includes(s.id)).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: s.id,
										children: [s.name, s.email ? ` · ${s.email}` : ""]
									}, s.id)) })]
								}),
								keepStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-sm",
											children: keepStudent.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-muted-foreground",
											children: [
												keepStudent.email ?? "Sem email",
												" · ",
												keepStudent.phone ?? "Sem telefone"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-muted-foreground",
											children: [
												"💳 ",
												keepPayments,
												" pagamento(s)",
												keepSessions !== null && ` · 🏃 ${keepSessions} aula(s)`
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-state-paid",
											children: "Este perfil será mantido com todos os dados"
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 rounded-lg border border-state-late/30 bg-state-late-soft p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "text-state-late",
										children: [
											"🗑️ Perfis a REMOVER (",
											mergeIds.length,
											")"
										]
									}), mergeIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => setMergeIds([]),
										children: "Limpar"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Buscar por nome/email/telefone…",
									value: mergeSearch,
									onChange: (e) => setMergeSearch(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-h-64 overflow-y-auto rounded border bg-background",
									children: [allList.filter((s) => s.id !== keepId).filter((s) => {
										const q = mergeSearch.trim().toLowerCase();
										if (!q) return true;
										return (s.name ?? "").toLowerCase().includes(q) || (s.email ?? "").toLowerCase().includes(q) || (s.phone ?? "").toLowerCase().includes(q);
									}).map((s) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex cursor-pointer items-start gap-2 border-b px-2 py-1.5 text-xs last:border-b-0 hover:bg-muted/40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												checked: mergeIds.includes(s.id),
												onCheckedChange: () => toggleMergeId(s.id),
												className: "mt-0.5"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: s.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-muted-foreground truncate",
													children: [
														s.email ?? "Sem email",
														" · ",
														s.phone ?? "Sem telefone",
														" · 💳 ",
														paymentsOf(s),
														sessionsOf(s) !== null && ` · 🏃 ${sessionsOf(s)}`
													]
												})]
											})]
										}, s.id);
									}), allList.filter((s) => s.id !== keepId).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-3 text-xs text-muted-foreground",
										children: "Nenhum perfil disponível."
									})]
								}),
								mergeStudents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-state-late",
									children: [mergeStudents.length, " perfil(is) será(ão) excluído(s) após a fusão"]
								})
							]
						})]
					}),
					keepId && mergeIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border bg-muted/40 p-3 text-sm space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: "Resumo da fusão:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"• ",
								totalMergePayments,
								" pagamento(s) de ",
								mergeStudents.length,
								" perfil(is) serão transferidos para \"",
								keepStudent?.name,
								"\""
							] }),
							totalMergeSessions !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"• ",
								totalMergeSessions,
								" aula(s) serão transferidas para \"",
								keepStudent?.name,
								"\""
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"• Os perfis ",
								mergeStudents.map((s) => `"${s.name}"`).join(", "),
								" serão excluídos permanentemente"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"• O perfil \"",
								keepStudent?.name,
								"\" será mantido com todos os dados combinados"
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !keepId || mergeIds.length === 0 || merging,
						onClick: () => setMergeConfirmOpen(true),
						className: "w-full",
						children: merging ? "Fundindo perfis…" : `🔀 Fundir ${mergeIds.length || ""} perfil(is)`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: mergeConfirmOpen,
				onOpenChange: setMergeConfirmOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Confirmar fusão de perfis?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							"Todos os dados de ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: mergeStudents.map((s) => `"${s.name}"`).join(", ") }),
							" serão transferidos para",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
								"\"",
								keepStudent?.name,
								"\""
							] }),
							"."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							"Os ",
							mergeStudents.length,
							" perfil(is) selecionado(s) serão excluídos permanentemente. Esta ação não pode ser desfeita."
						] })]
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					disabled: merging,
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: executeMerge,
					disabled: merging,
					children: merging ? "Fundindo…" : "Confirmar fusão"
				})] })] })
			})
		]
	});
}
//#endregion
export { DiagnosticsPage as component };
