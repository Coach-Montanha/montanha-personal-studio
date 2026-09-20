import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Fn as ArrowRight, G as Plus, In as ArrowRightLeft, Ln as ArrowLeft, Lt as FileText, Rt as FileSpreadsheet, S as Ticket, Sn as CalendarClock, U as RefreshCw, W as Receipt, Z as Pencil, _t as LoaderCircle, b as Trash2, c as User, en as Clock, ft as MapPin, hn as Check, kt as IdCard, ln as ChevronsUpDown, mn as ChevronDown, on as CirclePause, qt as Download, r as Wallet, u as UserRound, v as TrendingUp, wt as Layers, xn as CalendarDays } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DEnZ0u5J.mjs";
import { t as EmptyState } from "./EmptyState-DK3vCNbs.mjs";
import { a as formatDateBR, i as formatBRL, l as initials, o as formatMonthLabel, s as formatMonthLong, u as paymentMethodLabel } from "./format-BT-nao3-.mjs";
import { a as TooltipTrigger, i as TooltipRoot, n as TooltipContent, r as TooltipProvider } from "./tooltip-CJZST3UV.mjs";
import { n as PlanBadge, r as StudentStatusBadge, t as PaymentStatusBadge } from "./Badges-BwuNwA-M.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as chartTooltip } from "./chart-theme-DG2ASWF8.mjs";
import { t as KPICard } from "./KPICard-CS1xEcGG.mjs";
import { n as checkinChipClass, r as checkinTone, t as allocateCheckins } from "./checkins-DJxtlh1V.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as YAxis, c as Line, i as LineChart, l as CartesianGrid, m as Tooltip, o as XAxis, p as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BymSQoye.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DT1SSYuq.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-Cmlz_mk1.mjs";
import { n as renewPayment, t as downloadReceiptPdf } from "./receipt-pdf-NiEaxcs2.mjs";
import { t as PaymentDialog } from "./PaymentDialog-DLBzOv9b.mjs";
import { i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BosDdXX7.mjs";
import { a as CommandInput, i as CommandGroup, o as CommandItem, r as CommandEmpty, s as CommandList, t as Command$1 } from "./command-CfJ4Rdty.mjs";
import { t as Route } from "./students._id-Ds3vfVTS.mjs";
import { t as FreezeDialog } from "./FreezeDialog-BK_NPCio.mjs";
import { t as StudentDialog } from "./StudentDialog-CxHruDEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students._id-DCFcrW3c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TransferPaymentDialog({ open, onOpenChange, paymentId, fromStudentId, fromStudentName, payment }) {
	const qc = useQueryClient();
	const [targetId, setTargetId] = (0, import_react.useState)("");
	const [pickerOpen, setPickerOpen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) {
			setTargetId("");
			setPickerOpen(false);
			setBusy(false);
		}
	}, [open]);
	const { data: students = [], isLoading } = useQuery({
		queryKey: ["transfer-students-all"],
		queryFn: async () => {
			const { data } = await supabase.from("students").select("id,name").order("name");
			return data ?? [];
		}
	});
	const options = (0, import_react.useMemo)(() => students.filter((s) => s.id !== fromStudentId), [students, fromStudentId]);
	const target = (0, import_react.useMemo)(() => options.find((s) => s.id === targetId), [options, targetId]);
	async function transfer() {
		if (!paymentId || !targetId) return toast.error("Selecione o aluno destino");
		setBusy(true);
		const { data, error } = await supabase.from("payments").update({ student_id: targetId }).eq("id", paymentId).select("id");
		setBusy(false);
		if (error) return toast.error(error.message);
		if (!data || data.length === 0) return toast.error("Sem permissão para transferir este pagamento.");
		toast.success("Pagamento transferido");
		qc.invalidateQueries();
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "space-y-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-lg leading-tight",
								children: "Transferir pagamento"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-sm leading-relaxed",
								children: "Move este pagamento para outro aluno. Nada além do vínculo é alterado."
							})]
						})]
					})
				}),
				payment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border/70 bg-muted/40 p-3.5 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Pagamento"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-base font-semibold tabular-nums text-foreground",
							children: formatBRL(payment.amount)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "capitalize text-foreground/80",
							children: formatMonthLong(payment.reference_month)
						}), payment.plans?.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-border/60 bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground",
							children: payment.plans.name
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentChip, {
								name: fromStudentName ?? "—",
								muted: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: cn("h-4 w-4 shrink-0 transition-colors duration-200", target ? "text-primary" : "text-muted-foreground/50") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentChip, {
								name: target?.name ?? "Selecione…",
								highlight: !!target,
								placeholder: !target
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-medium text-muted-foreground",
							children: "Aluno destino"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
							open: pickerOpen,
							onOpenChange: setPickerOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									role: "combobox",
									"aria-expanded": pickerOpen,
									className: "w-full justify-between font-normal transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("truncate", !target && "text-muted-foreground"),
										children: target ? target.name : isLoading ? "Carregando alunos…" : "Buscar aluno…"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 text-muted-foreground" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
								className: "w-[--radix-popover-trigger-width] p-0",
								align: "start",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, {
									placeholder: "Buscar por nome…",
									className: "h-10"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, {
									className: "py-6 text-center text-sm text-muted-foreground",
									children: "Nenhum aluno encontrado."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, { children: options.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
									value: s.name,
									onSelect: () => {
										setTargetId(s.id);
										setPickerOpen(false);
									},
									className: "gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground",
											children: initials(s.name)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-0 flex-1 truncate",
											children: s.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("h-4 w-4 text-primary transition-opacity duration-150", targetId === s.id ? "opacity-100" : "opacity-0") })
									]
								}, s.id)) })] })] })
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2 sm:gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						disabled: busy,
						className: "transition-colors duration-200",
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: transfer,
						disabled: !targetId || busy,
						className: "min-w-[130px] transition-all duration-200 active:scale-[0.98] disabled:opacity-50",
						children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Transferindo…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "mr-2 h-4 w-4" }), "Transferir"] })
					})]
				})
			]
		})
	});
}
function StudentChip({ name, muted, highlight, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors duration-200", highlight ? "border-primary/40 bg-primary/5" : placeholder ? "border-dashed border-border/60 bg-transparent" : "border-border/60 bg-muted/30"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold", highlight ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"),
			children: placeholder ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" }) : initials(name)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("min-w-0 flex-1 truncate text-xs font-medium", placeholder ? "text-muted-foreground/70" : muted ? "text-foreground/80" : "text-foreground"),
			children: name
		})]
	});
}
function StudentOverviewTab({ kpis, currentPlan, attendanceCount, attendancePeriod, onAttendancePeriodChange, monthlySeries }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
					label: "💰 LTV Total",
					value: formatBRL(kpis.total),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
					label: "📅 Meses Ativo",
					value: kpis.months,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
					label: "📊 Ticket Médio",
					value: formatBRL(kpis.avg),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
					label: "🗓️ Último Pagamento",
					value: kpis.lastDate ? formatDateBR(kpis.lastDate) : "—",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
					label: "⏳ Meses sem pagamento",
					value: kpis.gapMonths,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
					label: "🔁 Plano Atual",
					value: currentPlan?.plans?.name ?? "—",
					hint: currentPlan?.plans?.price ? formatBRL(Number(currentPlan.plans.price)) : void 0,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium text-muted-foreground",
								children: "🏃 Aulas realizadas"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-2xl font-bold font-mono",
							children: attendanceCount
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: attendancePeriod,
							onValueChange: onAttendancePeriodChange,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-2 h-7 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "Total (todo o histórico)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "year",
									children: "Ano atual"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "month",
									children: "Mês atual"
								})
							] })]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-semibold",
				children: "Evolução de pagamentos"
			}), monthlySeries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Sem dados",
				description: "Sem pagamentos registrados"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: monthlySeries,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								className: "stroke-border"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "month",
								tick: { fontSize: 12 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 12 },
								tickFormatter: (v) => formatBRL(v),
								width: 90
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								...chartTooltip,
								formatter: (v) => formatBRL(v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "value",
								stroke: "var(--color-primary)",
								strokeWidth: 2,
								dot: { r: 3 }
							})
						]
					})
				})
			})]
		})]
	});
}
function Field({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] font-semibold uppercase leading-none tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("truncate text-sm leading-6", value ? "font-medium" : "text-muted-foreground"),
			children: value || "—"
		})]
	});
}
function StudentPersonalTab({ student, onEdit }) {
	const addressLine = [
		student.address,
		student.neighborhood,
		[student.city, student.state].filter(Boolean).join(" / "),
		student.postal_code,
		student.country
	].filter((v) => v && String(v).trim().length > 0).join(" · ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-4 w-4 text-primary" }), " Contato"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						className: "h-8 gap-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary/10 active:scale-[0.98]",
						onClick: onEdit,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }), " Editar"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nome",
							value: student.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							value: student.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Telefone",
							value: student.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nascimento",
							value: student.birth_date ? formatDateBR(student.birth_date) : null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Início",
							value: student.start_date ? formatDateBR(student.start_date) : null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Cadastro",
							value: formatDateBR(student.created_at)
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mb-4 flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdCard, { className: "h-4 w-4 text-primary" }), " Documentos"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "CPF",
						value: student.cpf
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "RG",
						value: student.rg
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mb-4 flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-primary" }), " Endereço"]
				}), addressLine ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Logradouro",
							value: student.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Bairro",
							value: student.neighborhood
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Cidade",
							value: student.city
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Estado",
							value: student.state
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "CEP",
							value: student.postal_code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "País",
							value: student.country
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm leading-6 text-muted-foreground",
					children: [
						"Nenhum endereço cadastrado. Use ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: "Editar"
						}),
						" para preencher."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mb-4 flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), " Observações"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("text-sm leading-6", student.notes ? "" : "text-muted-foreground"),
					children: student.notes || "Sem observações."
				})]
			})
		]
	});
}
function StudentPlanTab({ currentPlan, history, freezes, onOpenNewFreeze, onEditFreeze }) {
	const qc = useQueryClient();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Plano atual"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-lg font-semibold leading-tight",
								children: currentPlan?.plans?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-sm tabular-nums text-muted-foreground",
								children: currentPlan?.plans?.price ? formatBRL(Number(currentPlan.plans.price)) : "Sem valor definido"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Início do plano"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-lg font-semibold leading-tight tabular-nums",
								children: currentPlan?.start_date ? formatDateBR(currentPlan.start_date) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-sm text-muted-foreground",
								children: currentPlan ? "Vigente" : "Nenhum plano vigente"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Trancamento"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-lg font-semibold leading-tight tabular-nums",
								children: currentPlan?.plans?.max_freeze_days ? `Até ${currentPlan.plans.max_freeze_days} dia(s)` : "Não permitido"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [freezes.length, " registro(s)"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-sm font-semibold",
					children: "Histórico de planos"
				}), history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nenhum plano associado"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: history.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm transition-colors duration-200 hover:bg-muted/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBadge, { name: h.plans?.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 text-xs tabular-nums text-muted-foreground",
							children: [
								"Início: ",
								formatDateBR(h.start_date),
								" · Fim: ",
								h.end_date ? formatDateBR(h.end_date) : "atual"
							]
						})] }), h.is_current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-success",
							children: "Atual"
						})]
					}, h.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Trancamentos"
					}), currentPlan?.plans?.max_freeze_days ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "transition-all duration-200 active:scale-[0.98]",
						onClick: onOpenNewFreeze,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "h-4 w-4" }), " Novo trancamento"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Plano atual não permite trancamento."
					})]
				}), freezes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nenhum trancamento registrado."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: freezes.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm transition-colors duration-200 hover:bg-muted/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-medium tabular-nums",
								children: [
									f.freeze_days,
									" dia(s) — ",
									formatDateBR(f.start_date),
									" até ",
									formatDateBR(f.end_date)
								]
							}), f.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: f.notes
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								"aria-label": "Editar trancamento",
								className: "transition-all duration-200 active:scale-[0.95]",
								onClick: () => onEditFreeze(f),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								"aria-label": "Excluir trancamento",
								className: "transition-all duration-200 active:scale-[0.95]",
								onClick: async () => {
									if (!await confirmDialog("Excluir este trancamento?")) return;
									const { error } = await supabase.from("payment_freezes").delete().eq("id", f.id);
									if (error) return toast.error(error.message);
									toast.success("Trancamento excluído");
									qc.invalidateQueries();
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
							})]
						})]
					}, f.id))
				})]
			})
		]
	});
}
function StudentPaymentsTab({ payments, attendanceDates, freezes, student, onEdit, onDelete, onAdd, onTransfer, onRenew, onToggleAutoRenew, renewingId }) {
	const [yearFilter, setYearFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const checkinByPayment = (0, import_react.useMemo)(() => allocateCheckins(payments, attendanceDates, freezes), [
		payments,
		attendanceDates,
		freezes
	]);
	const activePackage = (0, import_react.useMemo)(() => {
		const entries = payments.filter((p) => checkinByPayment.has(p.id)).sort((a, b) => a.payment_date < b.payment_date ? -1 : 1).map((p) => ({
			payment: p,
			pkg: checkinByPayment.get(p.id)
		}));
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		return entries.find((e) => e.pkg.quota - e.pkg.used.length > 0 && (!e.pkg.validUntil || e.pkg.validUntil >= today)) ?? null;
	}, [payments, checkinByPayment]);
	const [toggled, setToggled] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const toggleExpanded = (id) => setToggled((prev) => {
		const next = new Set(prev);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		return next;
	});
	const isExpanded = (id, pkg) => {
		const defaultOpen = checkinTone(Math.max(0, pkg.quota - pkg.used.length), pkg.quota) !== "primary";
		return toggled.has(id) ? !defaultOpen : defaultOpen;
	};
	const years = (0, import_react.useMemo)(() => {
		return [...new Set(payments.map((p) => p.reference_month.slice(0, 4)))].sort((a, b) => a < b ? 1 : -1);
	}, [payments]);
	const filtered = (0, import_react.useMemo)(() => {
		return payments.filter((p) => {
			if (yearFilter !== "all" && !p.reference_month.startsWith(yearFilter)) return false;
			if (statusFilter !== "all" && p.status !== statusFilter) return false;
			return true;
		});
	}, [
		payments,
		yearFilter,
		statusFilter
	]);
	const grouped = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of filtered) {
			const y = p.reference_month.slice(0, 4);
			if (!map.has(y)) map.set(y, []);
			map.get(y).push(p);
		}
		return [...map.entries()].sort(([a], [b]) => a < b ? 1 : -1);
	}, [filtered]);
	async function handleGenerateReceipt(p) {
		if (p.status !== "paid") {
			toast.error("Recibos só podem ser emitidos para pagamentos quitados.");
			return;
		}
		try {
			await downloadReceiptPdf({
				receiptId: p.id,
				studentName: student?.name || "Aluno",
				studentEmail: student?.email,
				studentPhone: student?.phone,
				studentCpf: student?.cpf,
				amount: Number(p.amount),
				paymentDate: p.payment_date,
				dueDate: p.due_date,
				referenceMonth: p.reference_month,
				paymentMethod: p.payment_method,
				planName: p.plans?.name || "Mensalidade Studio",
				notes: p.notes,
				kind: "studio"
			});
			toast.success("Recibo do aluno gerado em PDF!");
		} catch (err) {
			toast.error("Erro ao gerar recibo: " + err.message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 space-y-4",
		children: [
			activePackage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivePackageSummary$1, {
				payment: activePackage.payment,
				pkg: activePackage.pkg,
				onOpenDetails: () => {
					setYearFilter("all");
					setStatusFilter("all");
					const id = activePackage.payment.id;
					if (!isExpanded(id, activePackage.pkg)) toggleExpanded(id);
					requestAnimationFrame(() => {
						document.getElementById(`pkg-${id}`)?.scrollIntoView({
							behavior: "smooth",
							block: "center"
						});
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: yearFilter,
						onValueChange: setYearFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-44",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Ano" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Todos os anos"
						}), years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: y,
							children: y
						}, y))] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-44",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Todos os status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "paid",
								children: "Pago"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "pending",
								children: "Pendente"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "overdue",
								children: "Atrasado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "cancelled",
								children: "Cancelado"
							})
						] })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: onAdd,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Adicionar Pagamento"]
				})]
			}),
			grouped.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Sem pagamentos",
				description: "Nenhum registro para os filtros selecionados"
			}) : grouped.map(([year, rows]) => {
				const paidRows = rows.filter((r) => r.status === "paid");
				const total = paidRows.reduce((s, r) => s + Number(r.amount), 0);
				const avg = paidRows.length ? total / paidRows.length : 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-muted-foreground",
						children: year
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mês de Referência" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data de Pagamento" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plano" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Valor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Forma" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Observações" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Ações"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.map((p) => {
						const isRenewable = p.auto_renew ?? p.plans?.auto_renew ?? false;
						const remaining = p.renewals_remaining;
						const isRenewing = renewingId === p.id;
						const canRenew = p.status === "paid" && !isRenewing;
						const pkg = checkinByPayment.get(p.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: cn("group transition-colors duration-200", pkg && isExpanded(p.id, pkg) && "border-b-0"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "text-xs capitalize",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: formatMonthLong(p.reference_month)
									}), isRenewable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipRoot, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-2 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary transition-colors duration-200",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-2.5 w-2.5" }), remaining != null ? `auto · ${remaining}` : "auto"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: remaining != null ? `Renovações automáticas restantes: ${remaining}` : "Renovação automática ativada" })] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs font-mono text-muted-foreground",
									children: formatDateBR(p.payment_date)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBadge, { name: p.plans?.name }), pkg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => toggleExpanded(p.id),
										"aria-expanded": isExpanded(p.id, pkg),
										"aria-controls": `pkg-${p.id}`,
										className: cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums", "transition-all duration-200 hover:brightness-105 active:scale-[0.97]", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1", checkinChipClass(checkinTone(Math.max(0, pkg.quota - pkg.used.length), pkg.quota))),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-3 w-3" }),
											Math.max(0, pkg.quota - pkg.used.length),
											"/",
											pkg.quota,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3 w-3 transition-transform duration-200", isExpanded(p.id, pkg) && "rotate-180") })
										]
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right font-mono font-medium tabular-nums",
									children: formatBRL(p.amount)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs",
									children: paymentMethodLabel(p.payment_method)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentStatusBadge, { status: p.status }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs text-muted-foreground max-w-[200px] truncate",
									children: p.notes ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center rounded-lg border border-border/60 bg-background/50 p-0.5 shadow-sm divide-x divide-border/60",
										children: [
											p.status === "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center px-0.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipRoot, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														"aria-label": "Gerar recibo em PDF",
														className: "h-8 w-8 rounded-md text-blue-600 transition-all duration-200 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:scale-[0.96] dark:text-blue-400 dark:hover:bg-blue-950/50",
														onClick: () => handleGenerateReceipt(p),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Gerar Recibo em PDF" })] })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center px-0.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipRoot, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														"aria-label": isRenewable ? "Desativar renovação automática" : "Ativar renovação automática",
														"aria-pressed": isRenewable,
														className: cn("h-8 w-8 rounded-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:scale-[0.96]", isRenewable && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"),
														onClick: () => onToggleAutoRenew(p),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" })
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: isRenewable ? "Desativar renovação automática" : "Ativar renovação automática" })] })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center px-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipRoot, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														"aria-label": "Renovar pagamento",
														disabled: !canRenew,
														className: "h-8 w-8 rounded-md transition-all duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:scale-[0.96] disabled:opacity-40 disabled:cursor-not-allowed",
														onClick: () => onRenew(p),
														children: isRenewing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: p.status === "paid" ? "Renovar (criar próximo pagamento)" : "Só pagamentos pagos podem ser renovados" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipRoot, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														"aria-label": "Transferir para outro aluno",
														className: "h-8 w-8 rounded-md transition-all duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:scale-[0.96]",
														onClick: () => onTransfer(p),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "h-4 w-4" })
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Transferir para outro aluno" })] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center px-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipRoot, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														"aria-label": "Editar pagamento",
														className: "h-8 w-8 rounded-md transition-all duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:scale-[0.96]",
														onClick: () => onEdit(p),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Editar" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipRoot, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														"aria-label": "Excluir pagamento",
														className: "h-8 w-8 rounded-md transition-all duration-200 hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-1 active:scale-[0.96]",
														onClick: () => onDelete(p),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Excluir" })] })]
											})
										]
									})
								})
							]
						}), pkg && isExpanded(p.id, pkg) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
							className: "hover:bg-transparent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 8,
								className: "pt-0 pb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									id: `pkg-${p.id}`,
									className: "animate-in fade-in-0 slide-in-from-top-1 duration-200",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckinPackagePanel$1, {
										payment: p,
										pkg
									})
								})
							})
						})] }, p.id);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "bg-muted/40 font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								colSpan: 3,
								className: "text-xs",
								children: [
									"Resumo ",
									year,
									": ",
									paidRows.length,
									" pagamento",
									paidRows.length === 1 ? "" : "s"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-mono",
								children: formatBRL(total)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								colSpan: 3,
								className: "text-xs text-muted-foreground",
								children: ["Ticket médio: ", formatBRL(avg)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {})
						]
					})] })] })]
				}, year);
			})
		]
	});
}
function ActivePackageSummary$1({ payment, pkg, onOpenDetails }) {
	const used = pkg.used.length;
	const remaining = Math.max(0, pkg.quota - used);
	const pct = pkg.quota > 0 ? Math.min(100, used / pkg.quota * 100) : 0;
	const tone = checkinTone(remaining, pkg.quota);
	const barClass = tone === "destructive" ? "bg-destructive" : tone === "warning" ? "bg-warning" : "bg-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		"aria-label": "Resumo do pacote ativo",
		className: cn("rounded-xl border p-4 transition-colors duration-200", tone === "destructive" ? "border-destructive/25 bg-destructive/5" : tone === "warning" ? "border-warning/30 bg-warning/5" : "border-primary/20 bg-primary/5"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Pacote ativo"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end gap-x-8 gap-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-3xl font-semibold leading-none tabular-nums",
								children: remaining
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs leading-none text-muted-foreground",
								children: [
									"check-in",
									remaining === 1 ? "" : "s",
									" restante",
									remaining === 1 ? "" : "s"
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-base font-medium leading-none tabular-nums text-foreground/80",
								children: [
									used,
									"/",
									pkg.quota
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-none text-muted-foreground",
								children: "usados"
							})] }),
							pkg.validUntil && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-medium leading-none tabular-nums text-foreground/80",
								children: formatDateBR(pkg.validUntil)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs leading-none text-muted-foreground",
								children: ["válido até", pkg.freezeDays > 0 ? ` (+${pkg.freezeDays}d)` : ""]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 w-full max-w-md overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("h-full rounded-full transition-all duration-300", barClass),
							style: { width: `${pct}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs leading-snug text-muted-foreground",
						children: [
							payment.plans?.name ?? "Pacote",
							" · pago em ",
							formatDateBR(payment.payment_date)
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: onOpenDetails,
				className: "shrink-0 transition-all duration-200 hover:bg-accent active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
				children: ["Ver detalhes ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
			})]
		})
	});
}
function CheckinPackagePanel$1({ payment, pkg }) {
	const qc = useQueryClient();
	const [showAll, setShowAll] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(String(pkg.quota ?? ""));
	const [saving, setSaving] = (0, import_react.useState)(false);
	const used = pkg.used.length;
	const remaining = Math.max(0, pkg.quota - used);
	const pct = pkg.quota > 0 ? Math.min(100, used / pkg.quota * 100) : 0;
	const tone = checkinTone(remaining, pkg.quota);
	const barClass = tone === "destructive" ? "bg-destructive" : tone === "warning" ? "bg-warning" : "bg-primary";
	const ringClass = tone === "destructive" ? "border-destructive/25 bg-destructive/5" : tone === "warning" ? "border-warning/30 bg-warning/5" : "border-primary/20 bg-primary/5";
	const expectedDue = pkg.validUntil;
	const dueMismatch = Boolean(expectedDue && payment.due_date && payment.due_date < expectedDue);
	const [fixing, setFixing] = (0, import_react.useState)(false);
	async function fixDueDate() {
		if (!expectedDue) return;
		setFixing(true);
		const { error } = await supabase.from("payments").update({ due_date: expectedDue }).eq("id", payment.id);
		setFixing(false);
		if (error) return toast.error(error.message);
		toast.success("Validade corrigida");
		qc.invalidateQueries({ queryKey: ["student-payments"] });
	}
	async function save(value) {
		setSaving(true);
		const { error } = await supabase.from("payments").update({ checkin_quota_override: value }).eq("id", payment.id);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success(value == null ? "Cota do plano restaurada" : "Cota ajustada");
		setEditOpen(false);
		qc.invalidateQueries({ queryKey: ["student-payments"] });
	}
	const visible = showAll ? pkg.used : pkg.used.slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl border p-4 transition-colors duration-200", ringClass),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-4 w-4 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-semibold leading-none tracking-tight",
								children: "Check-ins do pacote"
							}),
							pkg.isOverride && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "cota ajustada"
							}),
							dueMismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-warning/40 bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground",
								children: "validade divergente"
							})
						]
					}),
					dueMismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs leading-relaxed text-muted-foreground",
							children: [
								"O vencimento salvo (",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium tabular-nums text-foreground",
									children: formatDateBR(payment.due_date)
								}),
								") é menor que a validade do pacote (",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium tabular-nums text-foreground",
									children: formatDateBR(expectedDue)
								}),
								")."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							disabled: fixing,
							onClick: fixDueDate,
							className: "w-full shrink-0 transition-all duration-200 active:scale-[0.97] sm:w-auto",
							children: [fixing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "mr-1.5 h-3.5 w-3.5" }), "Corrigir validade"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 sm:flex sm:items-end sm:gap-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-semibold leading-tight tabular-nums",
								children: remaining
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-tight text-muted-foreground",
								children: "Restantes"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-medium leading-tight tabular-nums text-foreground/80",
								children: used
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-tight text-muted-foreground",
								children: "Usados"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-medium leading-tight tabular-nums text-foreground/80",
								children: pkg.quota
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-tight text-muted-foreground",
								children: "Cota"
							})] }),
							pkg.validUntil && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-medium leading-tight tabular-nums text-foreground/80",
								children: formatDateBR(pkg.validUntil)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs leading-tight text-muted-foreground",
								children: ["Válido até", pkg.freezeDays > 0 ? ` (+${pkg.freezeDays}d)` : ""]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("h-full rounded-full transition-all duration-300", barClass),
							style: { width: `${pct}%` }
						})
					}),
					used > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [visible.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-muted/70 px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground",
							children: formatDateBR(d)
						}, d)), pkg.used.length > 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowAll((v) => !v),
							className: "rounded-full px-2 py-0.5 text-[11px] font-semibold text-primary transition-colors duration-200 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: showAll ? "ver menos" : `ver todas (${pkg.used.length})`
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Nenhum check-in utilizado neste pacote."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
				open: editOpen,
				onOpenChange: (o) => {
					setEditOpen(o);
					if (o) setDraft(String(pkg.quota ?? ""));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "shrink-0 transition-all duration-200 active:scale-[0.97]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }), " Ajustar"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
					align: "end",
					className: "w-64 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold leading-none",
								children: "Cota de check-ins"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs leading-snug text-muted-foreground",
								children: [
									"Vale só para este pagamento. Limpe para voltar à cota do plano",
									payment.plans?.checkin_quota_amount != null ? ` (${payment.plans.checkin_quota_amount})` : "",
									"."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							className: "tabular-nums"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								disabled: saving || !pkg.isOverride,
								onClick: () => save(null),
								children: "Limpar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								disabled: saving || draft === "" || Number(draft) < 0 || Number.isNaN(Number(draft)),
								onClick: () => save(Number(draft)),
								children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : null, " Salvar"]
							})]
						})
					]
				})]
			})]
		})
	});
}
function StudentCheckinsTab({ payments, attendanceDates, freezes, entries, loading, studentName }) {
	const checkinByPayment = (0, import_react.useMemo)(() => allocateCheckins(payments, attendanceDates, freezes), [
		payments,
		attendanceDates,
		freezes
	]);
	const packages = (0, import_react.useMemo)(() => payments.filter((p) => checkinByPayment.has(p.id)).sort((a, b) => a.payment_date < b.payment_date ? 1 : -1).map((p) => ({
		payment: p,
		pkg: checkinByPayment.get(p.id)
	})), [payments, checkinByPayment]);
	const activePackage = (0, import_react.useMemo)(() => {
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		return [...packages].reverse().find((e) => e.pkg.quota - e.pkg.used.length > 0 && (!e.pkg.validUntil || e.pkg.validUntil >= today)) ?? null;
	}, [packages]);
	const hasPackages = packages.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			loading && !hasPackages ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-xl border border-border bg-muted/40" }) : null,
			hasPackages ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [activePackage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivePackageSummary, {
				payment: activePackage.payment,
				pkg: activePackage.pkg,
				onOpenDetails: () => document.getElementById(`ck-${activePackage.payment.id}`)?.scrollIntoView({
					behavior: "smooth",
					block: "center"
				})
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold leading-none tracking-tight",
						children: "Pacotes de check-in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-snug text-muted-foreground",
						children: "Ajuste a cota de cada pacote e acompanhe os check-ins consumidos."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: packages.map(({ payment, pkg }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: `ck-${payment.id}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckinPackagePanel, {
							payment,
							pkg
						})
					}, payment.id))
				})]
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckinHistoryCard, {
				entries,
				loading,
				studentName
			})
		]
	});
}
function ActivePackageSummary({ payment, pkg, onOpenDetails }) {
	const used = pkg.used.length;
	const remaining = Math.max(0, pkg.quota - used);
	const pct = pkg.quota > 0 ? Math.min(100, used / pkg.quota * 100) : 0;
	const tone = checkinTone(remaining, pkg.quota);
	const barClass = tone === "destructive" ? "bg-destructive" : tone === "warning" ? "bg-warning" : "bg-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-xl border p-4 sm:p-5 transition-colors duration-200", tone === "destructive" ? "border-destructive/25 bg-destructive/5" : tone === "warning" ? "border-warning/30 bg-warning/5" : "border-primary/20 bg-primary/5"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Pacote ativo"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end gap-x-8 gap-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-3xl font-semibold leading-none tabular-nums",
								children: remaining
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs leading-none text-muted-foreground",
								children: [
									"check-in",
									remaining === 1 ? "" : "s",
									" restante",
									remaining === 1 ? "" : "s"
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-base font-medium leading-none tabular-nums text-foreground/80",
								children: [
									used,
									"/",
									pkg.quota
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-none text-muted-foreground",
								children: "usados"
							})] }),
							pkg.validUntil && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-medium leading-none tabular-nums text-foreground/80",
								children: formatDateBR(pkg.validUntil)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs leading-none text-muted-foreground",
								children: ["válido até", pkg.freezeDays > 0 ? ` (+${pkg.freezeDays}d)` : ""]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 w-full max-w-md overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("h-full rounded-full transition-all duration-300", barClass),
							style: { width: `${pct}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs leading-snug text-muted-foreground",
						children: [
							payment.plans?.name ?? "Pacote",
							" · pago em ",
							formatDateBR(payment.payment_date)
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: onOpenDetails,
				className: "shrink-0 transition-all duration-200 hover:bg-accent active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
				children: ["Ver detalhes ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
			})]
		})
	});
}
function CheckinPackagePanel({ payment, pkg }) {
	const qc = useQueryClient();
	const [showAll, setShowAll] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(String(pkg.quota ?? ""));
	const [saving, setSaving] = (0, import_react.useState)(false);
	const used = pkg.used.length;
	const remaining = Math.max(0, pkg.quota - used);
	const pct = pkg.quota > 0 ? Math.min(100, used / pkg.quota * 100) : 0;
	const tone = checkinTone(remaining, pkg.quota);
	const barClass = tone === "destructive" ? "bg-destructive" : tone === "warning" ? "bg-warning" : "bg-primary";
	const ringClass = tone === "destructive" ? "border-destructive/25 bg-destructive/5" : tone === "warning" ? "border-warning/30 bg-warning/5" : "border-primary/20 bg-primary/5";
	const expectedDue = pkg.validUntil;
	const dueMismatch = Boolean(expectedDue && payment.due_date && payment.due_date < expectedDue);
	const [fixing, setFixing] = (0, import_react.useState)(false);
	async function fixDueDate() {
		if (!expectedDue) return;
		setFixing(true);
		const { error } = await supabase.from("payments").update({ due_date: expectedDue }).eq("id", payment.id);
		setFixing(false);
		if (error) return toast.error(error.message);
		toast.success("Validade corrigida");
		qc.invalidateQueries({ queryKey: ["student-payments"] });
	}
	async function save(value) {
		setSaving(true);
		const { error } = await supabase.from("payments").update({ checkin_quota_override: value }).eq("id", payment.id);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success(value == null ? "Cota do plano restaurada" : "Cota ajustada");
		setEditOpen(false);
		qc.invalidateQueries({ queryKey: ["student-payments"] });
	}
	const visible = showAll ? pkg.used : pkg.used.slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl border p-4 transition-colors duration-200", ringClass),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-4 w-4 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-semibold leading-none tracking-tight",
								children: "Check-ins do pacote"
							}),
							pkg.isOverride && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "cota ajustada"
							}),
							dueMismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-warning/40 bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground",
								children: "validade divergente"
							})
						]
					}),
					dueMismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs leading-relaxed text-muted-foreground",
							children: [
								"O vencimento salvo (",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium tabular-nums text-foreground",
									children: formatDateBR(payment.due_date)
								}),
								") é menor que a validade do pacote (",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium tabular-nums text-foreground",
									children: formatDateBR(expectedDue)
								}),
								")."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							disabled: fixing,
							onClick: fixDueDate,
							className: "w-full shrink-0 transition-all duration-200 active:scale-[0.97] sm:w-auto",
							children: [fixing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "mr-1.5 h-3.5 w-3.5" }), "Corrigir validade"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 sm:flex sm:items-end sm:gap-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-semibold leading-tight tabular-nums",
								children: remaining
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-tight text-muted-foreground",
								children: "Restantes"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-medium leading-tight tabular-nums text-foreground/80",
								children: used
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-tight text-muted-foreground",
								children: "Usados"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-medium leading-tight tabular-nums text-foreground/80",
								children: pkg.quota
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-tight text-muted-foreground",
								children: "Cota"
							})] }),
							pkg.validUntil && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-medium leading-tight tabular-nums text-foreground/80",
								children: formatDateBR(pkg.validUntil)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs leading-tight text-muted-foreground",
								children: ["Válido até", pkg.freezeDays > 0 ? ` (+${pkg.freezeDays}d)` : ""]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("h-full rounded-full transition-all duration-300", barClass),
							style: { width: `${pct}%` }
						})
					}),
					used > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [visible.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-muted/70 px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground",
							children: formatDateBR(d)
						}, d)), pkg.used.length > 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowAll((v) => !v),
							className: "rounded-full px-2 py-0.5 text-[11px] font-semibold text-primary transition-colors duration-200 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: showAll ? "ver menos" : `ver todas (${pkg.used.length})`
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Nenhum check-in utilizado neste pacote."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
				open: editOpen,
				onOpenChange: (o) => {
					setEditOpen(o);
					if (o) setDraft(String(pkg.quota ?? ""));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "shrink-0 transition-all duration-200 active:scale-[0.97]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }), " Ajustar"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
					align: "end",
					className: "w-64 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold leading-none",
								children: "Cota de check-ins"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs leading-snug text-muted-foreground",
								children: [
									"Vale só para este pagamento. Limpe para voltar à cota do plano",
									payment.plans?.checkin_quota_amount != null ? ` (${payment.plans.checkin_quota_amount})` : "",
									"."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							className: "tabular-nums"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								disabled: saving || !pkg.isOverride,
								onClick: () => save(null),
								children: "Limpar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								disabled: saving || draft === "" || Number(draft) < 0 || Number.isNaN(Number(draft)),
								onClick: () => save(Number(draft)),
								children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : null, " Salvar"]
							})]
						})
					]
				})]
			})]
		})
	});
}
var CHECKIN_FILTERS = [
	{
		key: "today",
		label: "Hoje"
	},
	{
		key: "month",
		label: "Mês"
	},
	{
		key: "year",
		label: "Ano"
	},
	{
		key: "range",
		label: "Período"
	},
	{
		key: "all",
		label: "Todos"
	}
];
function CheckinHistoryCard({ entries, loading, studentName }) {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [exporting, setExporting] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
		const ym = today.slice(0, 7);
		const y = today.slice(0, 4);
		return entries.filter((e) => {
			if (filter === "today") return e.date === today;
			if (filter === "month") return e.date.startsWith(ym);
			if (filter === "year") return e.date.startsWith(y);
			if (filter === "range") {
				if (from && e.date < from) return false;
				if (to && e.date > to) return false;
				return true;
			}
			return true;
		}).sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
	}, [
		entries,
		filter,
		from,
		to
	]);
	const groups = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const e of filtered) {
			const key = e.date.slice(0, 7);
			map.set(key, [...map.get(key) ?? [], e]);
		}
		return [...map.entries()];
	}, [filtered]);
	const summary = (0, import_react.useMemo)(() => {
		const months = new Set(filtered.map((e) => e.date.slice(0, 7))).size;
		return {
			total: filtered.length,
			avg: months ? filtered.length / months : 0,
			last: filtered[0]?.date ?? null
		};
	}, [filtered]);
	const periodLabel = (0, import_react.useMemo)(() => {
		if (filter === "range") {
			if (!from && !to) return "Período personalizado";
			return `De ${from ? formatDateBR(from) : "início"} até ${to ? formatDateBR(to) : "hoje"}`;
		}
		return CHECKIN_FILTERS.find((f) => f.key === filter)?.label ?? "Todos";
	}, [
		filter,
		from,
		to
	]);
	const handleExport = async (format) => {
		if (!filtered.length) return;
		setExporting(format);
		try {
			const rows = filtered.map((e) => ({
				Data: formatDateBR(e.date),
				"Dia da semana": weekdayLabel(e.date),
				Hora: e.time ? e.time.slice(0, 5) : "—",
				Turma: e.className ?? "—",
				"Mês de referência": e.date.slice(0, 7)
			}));
			const stamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const base = `checkins-${studentName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "aluno"}-${stamp}`;
			if (format === "csv") {
				const csv = (await import("../_libs/papaparse.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default.unparse(rows, { delimiter: ";" });
				downloadBlob(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }), `${base}.csv`);
			} else {
				const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
				const sheet = XLSX.utils.aoa_to_sheet([
					[`Histórico de check-ins — ${studentName}`],
					[`Filtro: ${periodLabel}`, `Registros: ${rows.length}`],
					[]
				]);
				XLSX.utils.sheet_add_json(sheet, rows, { origin: "A4" });
				sheet["!cols"] = [
					{ wch: 14 },
					{ wch: 16 },
					{ wch: 10 },
					{ wch: 28 },
					{ wch: 18 }
				];
				const book = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(book, sheet, "Check-ins");
				const out = XLSX.write(book, {
					bookType: "xlsx",
					type: "array"
				});
				downloadBlob(new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${base}.xlsx`);
			}
			toast.success(`${rows.length} check-in(s) exportado(s)`);
		} catch {
			toast.error("Não foi possível gerar o arquivo");
		} finally {
			setExporting(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden p-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 border-b border-border p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold leading-tight tracking-tight text-foreground",
							children: "Histórico de check-ins"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted-foreground",
							children: "Todos os registros de presença do aluno, agrupados por mês."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-primary",
							children: summary.total
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportCheckinsMenu, {
							disabled: loading || filtered.length === 0,
							exporting,
							onExport: handleExport,
							count: filtered.length
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5",
					children: CHECKIN_FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFilter(f.key),
						"aria-pressed": filter === f.key,
						className: cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", filter === f.key ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/25" : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"),
						children: f.label
					}, f.key))
				}),
				filter === "range" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: from,
						onChange: (e) => setFrom(e.target.value),
						"aria-label": "Data inicial"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: to,
						onChange: (e) => setTo(e.target.value),
						"aria-label": "Data final"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Check-ins",
							value: String(summary.total)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Média/mês",
							value: summary.avg ? summary.avg.toFixed(1) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Último",
							value: summary.last ? formatDateBR(summary.last) : "—"
						})
					]
				})
			]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 p-4 sm:p-5",
			children: [
				0,
				1,
				2
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 animate-pulse rounded-lg bg-muted/60" }, i))
		}) : groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "mx-auto h-8 w-8 text-muted-foreground/50" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm font-medium text-foreground",
					children: "Nenhum check-in neste filtro"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Ajuste o período para ver outros registros."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-[28rem] overflow-y-auto",
			children: groups.map(([month, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-2 backdrop-blur sm:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: formatMonthLabel(month)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium tabular-nums text-muted-foreground",
					children: items.length
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border/60",
				children: items.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-muted/50 sm:px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-semibold leading-tight tabular-nums text-foreground",
							children: [formatDateBR(e.date), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-xs font-normal capitalize text-muted-foreground",
								children: weekdayLabel(e.date)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 truncate text-xs leading-relaxed text-muted-foreground",
							children: e.className ?? "Turma removida"
						})]
					}), e.time && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 rounded-md bg-muted/70 px-2 py-1 text-xs font-medium tabular-nums text-muted-foreground",
						children: e.time.slice(0, 5)
					})]
				}, e.id))
			})] }, month))
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border/70 bg-muted/30 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-sm font-semibold tabular-nums text-foreground",
			children: value
		})]
	});
}
function weekdayLabel(date) {
	const [y, m, d] = date.split("-").map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
function ExportCheckinsMenu({ disabled, exporting, count, onExport }) {
	const busy = exporting !== null;
	const trigger = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		size: "sm",
		disabled: disabled || busy,
		className: cn("h-8 gap-1.5 rounded-full border-border/80 px-3 text-xs font-semibold", "transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary", "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", "active:scale-[0.97] disabled:opacity-50"),
		children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden sm:inline",
			children: "Exportar"
		})]
	});
	if (disabled) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipRoot, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-flex cursor-not-allowed",
			children: trigger
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
		side: "bottom",
		children: "Nenhum check-in no período selecionado"
	})] }) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: trigger
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, {
				className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
				children: [
					"Exportar ",
					count,
					" registro(s)"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: () => onExport("xlsx"),
				className: "gap-3 py-2.5 transition-colors duration-150",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-medium leading-tight text-foreground",
						children: "Excel (.xlsx)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs leading-snug text-muted-foreground",
						children: "Planilha com cabeçalho e período"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: () => onExport("csv"),
				className: "gap-3 py-2.5 transition-colors duration-150",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-medium leading-tight text-foreground",
						children: "CSV (.csv)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs leading-snug text-muted-foreground",
						children: "Compatível com qualquer planilha"
					})]
				})]
			})
		]
	})] });
}
var MONTH_NAMES = [
	"Jan",
	"Fev",
	"Mar",
	"Abr",
	"Mai",
	"Jun",
	"Jul",
	"Ago",
	"Set",
	"Out",
	"Nov",
	"Dez"
];
function monthKey(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
function StudentAttendanceTab({ payments, studentCreatedAt }) {
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const [selectedYear, setSelectedYear] = (0, import_react.useState)(currentYear);
	const startMonthKey = (0, import_react.useMemo)(() => {
		const sortedPaid = payments.filter((p) => p.status === "paid").map((p) => p.reference_month).sort();
		if (sortedPaid.length) return sortedPaid[0];
		return monthKey(new Date(studentCreatedAt));
	}, [payments, studentCreatedAt]);
	const availableYears = (0, import_react.useMemo)(() => {
		const startY = Number(startMonthKey.slice(0, 4));
		const arr = [];
		for (let y = currentYear; y >= startY; y--) arr.push(y);
		return arr;
	}, [startMonthKey, currentYear]);
	const monthStatusForYear = (year) => {
		const result = [];
		const [sy, sm] = startMonthKey.split("-").map(Number);
		const nowY = currentYear;
		const nowM = (/* @__PURE__ */ new Date()).getMonth() + 1;
		for (let m = 1; m <= 12; m++) {
			const key = `${year}-${String(m).padStart(2, "0")}`;
			if (year < sy || year === sy && m < sm) {
				result.push({
					month: m,
					status: "na"
				});
				continue;
			}
			if (year > nowY || year === nowY && m > nowM) {
				result.push({
					month: m,
					status: "na"
				});
				continue;
			}
			const ps = payments.filter((p) => p.reference_month === key);
			if (ps.some((p) => p.status === "paid")) result.push({
				month: m,
				status: "paid"
			});
			else if (ps.some((p) => p.status === "pending" || p.status === "overdue")) result.push({
				month: m,
				status: "pending"
			});
			else result.push({
				month: m,
				status: "absent"
			});
		}
		return result;
	};
	const grid = (0, import_react.useMemo)(() => monthStatusForYear(selectedYear), [
		selectedYear,
		startMonthKey,
		payments
	]);
	const yearStats = (0, import_react.useMemo)(() => {
		const paidMonths = grid.filter((g) => g.status === "paid").length;
		const expected = grid.filter((g) => g.status !== "na").length;
		return {
			paidMonths,
			expected,
			absent: grid.filter((g) => g.status === "absent").length,
			rate: expected ? paidMonths / expected * 100 : 0,
			totalPaid: payments.filter((p) => p.status === "paid" && p.reference_month.startsWith(String(selectedYear))).reduce((s, p) => s + Number(p.amount), 0)
		};
	}, [
		grid,
		payments,
		selectedYear
	]);
	const yearlyEvolution = (0, import_react.useMemo)(() => {
		return availableYears.slice().sort((a, b) => a - b).map((y) => {
			const g = monthStatusForYear(y);
			const paidMonths = g.filter((x) => x.status === "paid").length;
			const expected = g.filter((x) => x.status !== "na").length;
			const absent = g.filter((x) => x.status === "absent").length;
			const total = payments.filter((p) => p.status === "paid" && p.reference_month.startsWith(String(y))).reduce((s, p) => s + Number(p.amount), 0);
			return {
				year: y,
				paidMonths,
				absent,
				total,
				avg: paidMonths ? total / paidMonths : 0,
				rate: expected ? paidMonths / expected * 100 : 0
			};
		}).sort((a, b) => b.year - a.year);
	}, [
		availableYears,
		payments,
		startMonthKey
	]);
	const cellClass = (status) => cn("flex h-20 flex-col items-center justify-center rounded-lg border text-xs font-medium", status === "paid" && "bg-success/15 border-success/30 text-success", status === "pending" && "bg-warning/15 border-warning/30 text-warning-foreground", status === "absent" && "bg-destructive/10 border-destructive/20 text-destructive", status === "na" && "bg-muted/40 border-border text-muted-foreground");
	const statusLabel = (s) => s === "paid" ? "PAGO" : s === "pending" ? "PENDENTE" : s === "absent" ? "AUSENTE" : "N/A";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-semibold",
							children: ["Mapa de frequência — ", selectedYear]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: String(selectedYear),
							onValueChange: (v) => setSelectedYear(Number(v)),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-32",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: availableYears.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: String(y),
								children: y
							}, y)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12",
						children: grid.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cellClass(g.status),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] uppercase",
								children: MONTH_NAMES[g.month - 1]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 text-[10px] font-semibold",
								children: statusLabel(g.status)
							})]
						}, g.month))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
								className: "bg-success",
								label: "Pago"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
								className: "bg-warning",
								label: "Pendente"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
								className: "bg-destructive",
								label: "Ausente"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
								className: "bg-muted",
								label: "N/A"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						label: "Meses pagos no ano",
						value: yearStats.paidMonths
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						label: "Meses ausentes",
						value: yearStats.absent
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						label: "Total pago no ano",
						value: formatBRL(yearStats.totalPaid)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium text-muted-foreground",
								children: "Taxa de frequência"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-2xl font-bold font-mono",
								children: [yearStats.rate.toFixed(1).replace(".", ","), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: yearStats.rate,
								className: "mt-3"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-sm font-semibold",
					children: "Evolução Anual"
				}), yearlyEvolution.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Sem dados",
					description: "Sem histórico anual"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Ano" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Meses Pagos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Meses Ausentes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Total Pago"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Ticket Médio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Taxa de Frequência"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: yearlyEvolution.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: r.year
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-mono",
						children: r.paidMonths
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-mono",
						children: r.absent
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-mono",
						children: formatBRL(r.total)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-mono",
						children: formatBRL(r.avg)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right font-mono",
						children: [r.rate.toFixed(1).replace(".", ","), "%"]
					})
				] }, r.year)) })] })]
			})
		]
	});
}
function LegendDot({ className, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-3 w-3 rounded-sm", className) }), label]
	});
}
function StudentDetail() {
	const { id } = Route.useParams();
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const qc = useQueryClient();
	const tab = search.tab ?? "overview";
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [paymentOpen, setPaymentOpen] = (0, import_react.useState)(false);
	const [editingPayment, setEditingPayment] = (0, import_react.useState)(null);
	const [freezeOpen, setFreezeOpen] = (0, import_react.useState)(false);
	const [editingFreeze, setEditingFreeze] = (0, import_react.useState)(null);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [transferPaymentId, setTransferPaymentId] = (0, import_react.useState)(null);
	const [renewingId, setRenewingId] = (0, import_react.useState)(null);
	const [attendancePeriod, setAttendancePeriod] = (0, import_react.useState)("all");
	const { data: student } = useQuery({
		queryKey: ["student", id],
		queryFn: async () => {
			const { data } = await supabase.from("students").select("*, student_plan_history(*, plans(*))").eq("id", id).is("deleted_at", null).single();
			return data;
		}
	});
	const { data: payments = [] } = useQuery({
		queryKey: ["student-payments", id],
		queryFn: async () => {
			const { data } = await supabase.from("payments").select("*, plans(*)").eq("student_id", id).is("deleted_at", null).order("reference_month", { ascending: false });
			return data ?? [];
		}
	});
	const { data: freezes = [] } = useQuery({
		queryKey: ["student-freezes", id],
		queryFn: async () => {
			const { data } = await supabase.from("payment_freezes").select("*").eq("student_id", id).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const { data: checkinEntries = [], isLoading: loadingAttendance } = useQuery({
		queryKey: ["student-attendance-entries", id],
		queryFn: async () => {
			const { data } = await supabase.from("class_attendance").select("id, created_at, class_sessions:session_id (id, session_date, start_time, classes:class_id (name))").eq("student_id", id).order("created_at", { ascending: false });
			return (data ?? []).map((row) => {
				const inst = row.class_sessions;
				const date = inst?.session_date ?? (row.created_at ? row.created_at.slice(0, 10) : null);
				if (!date) return null;
				return {
					id: row.id,
					date,
					time: inst?.start_time ?? (row.created_at ? row.created_at.slice(11, 16) : null),
					className: inst?.classes?.name ?? null
				};
			}).filter(Boolean);
		}
	});
	const attendance = (0, import_react.useMemo)(() => checkinEntries.map((e) => e.date), [checkinEntries]);
	const attendanceCount = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		const currentYear = String(now.getFullYear());
		const currentMonth = `${currentYear}-${String(now.getMonth() + 1).padStart(2, "0")}`;
		return attendance.filter((d) => {
			if (attendancePeriod === "year") return d.startsWith(currentYear);
			if (attendancePeriod === "month") return d.startsWith(currentMonth);
			return true;
		}).length + (attendancePeriod === "all" ? Number(student?.attendance_offset ?? 0) : 0);
	}, [
		attendance,
		attendancePeriod,
		student
	]);
	const paid = (0, import_react.useMemo)(() => payments.filter((p) => p.status === "paid"), [payments]);
	const kpis = (0, import_react.useMemo)(() => {
		const total = paid.reduce((s, p) => s + Number(p.amount), 0);
		const months = new Set(paid.map((p) => p.reference_month)).size;
		const avg = months ? total / months : 0;
		const sortedAsc = [...paid].sort((a, b) => a.payment_date < b.payment_date ? -1 : 1);
		const first = sortedAsc[0]?.reference_month;
		const last = sortedAsc[sortedAsc.length - 1]?.reference_month;
		const lastDate = sortedAsc[sortedAsc.length - 1]?.payment_date;
		let gapMonths = 0;
		if (first && last) {
			const [fy, fm] = first.split("-").map(Number);
			const [ly, lm] = last.split("-").map(Number);
			const totalMonths = (ly - fy) * 12 + (lm - fm) + 1;
			gapMonths = Math.max(0, totalMonths - months);
		}
		return {
			total,
			months,
			avg,
			lastDate,
			gapMonths
		};
	}, [paid]);
	const monthlySeries = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of paid) map.set(p.reference_month, (map.get(p.reference_month) ?? 0) + Number(p.amount));
		return [...map.entries()].sort(([a], [b]) => a < b ? -1 : 1).map(([k, v]) => ({
			month: formatMonthLabel(k),
			value: v
		}));
	}, [paid]);
	if (!student) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm text-muted-foreground",
		children: "Carregando…"
	});
	const currentPlan = student.student_plan_history?.find((h) => h.is_current);
	const activeFreeze = freezes[0] ?? null;
	const isFrozen = student.status === "paused";
	async function handleUnfreeze() {
		const { error } = await supabase.from("students").update({ status: "active" }).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Plano destrancado e aluno reativado com sucesso!");
		qc.invalidateQueries();
	}
	async function handleDelete() {
		if (!deleteTarget) return;
		const { error } = await supabase.from("payments").update({ deleted_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", deleteTarget.id).is("deleted_at", null);
		if (error) return toast.error(error.message);
		toast.success("Pagamento movido para a Lixeira");
		qc.invalidateQueries();
		setDeleteTarget(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 200,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/students",
					className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Voltar"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary",
							children: initials(student.name)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-bold tracking-tight",
								children: student.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentStatusBadge, { status: student.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBadge, { name: currentPlan?.plans?.name })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									student.email ?? "Sem email",
									" · ",
									student.phone ?? "Sem telefone"
								]
							}),
							student.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-md text-xs text-muted-foreground",
								children: student.notes
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "transition-all duration-200 active:scale-[0.98]",
								onClick: () => setEditOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" }), " Editar"]
							}),
							isFrozen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 transition-all duration-200 active:scale-[0.98]",
								onClick: () => {
									setEditingFreeze(activeFreeze);
									setFreezeOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "h-4 w-4 text-amber-500" }), " Editar trancamento"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "transition-all duration-200 active:scale-[0.98]",
								onClick: () => {
									setEditingFreeze(null);
									setFreezeOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "h-4 w-4" }), " Trancar plano"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "transition-all duration-200 active:scale-[0.98]",
								onClick: () => {
									setEditingPayment(null);
									setPaymentOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo pagamento"]
							})
						]
					})]
				}),
				isFrozen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "h-6 w-6 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-bold text-sm text-amber-900 dark:text-amber-100 flex items-center gap-2",
							children: ["Plano Trancado (Congelado)", activeFreeze?.end_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-normal opacity-90",
								children: ["— Vencimento estendido até: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: (/* @__PURE__ */ new Date(activeFreeze.end_date + "T00:00")).toLocaleDateString("pt-BR") })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-amber-800/80 dark:text-amber-200/80",
							children: activeFreeze ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"Início em ",
								(/* @__PURE__ */ new Date(activeFreeze.start_date + "T00:00")).toLocaleDateString("pt-BR"),
								" (",
								activeFreeze.freeze_days,
								" dias de trancamento)",
								activeFreeze.notes ? ` · Obs: "${activeFreeze.notes}"` : ""
							] }) : "O plano deste aluno está com trancamento ativo."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "gap-1.5 border-amber-500/40 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20",
							onClick: () => {
								setEditingFreeze(activeFreeze);
								setFreezeOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }), " Editar Prazo"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs",
							onClick: handleUnfreeze,
							children: "Destrancar Plano"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					value: tab,
					onValueChange: (v) => navigate({
						search: { tab: v },
						replace: true
					}),
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "inline-flex w-max justify-start gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "overview",
										className: "gap-1.5 transition-all duration-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }), " Visão Geral"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "personal",
										className: "gap-1.5 transition-all duration-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-3.5 w-3.5" }), " Dados pessoais"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "plan",
										className: "gap-1.5 transition-all duration-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" }), " Plano"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "payments",
										className: "gap-1.5 transition-all duration-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-3.5 w-3.5" }), " Pagamentos"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "checkins",
										className: "gap-1.5 transition-all duration-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-3.5 w-3.5" }), " Check-ins"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "attendance",
										className: "gap-1.5 transition-all duration-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5" }), " Frequência"]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "overview",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentOverviewTab, {
								kpis,
								currentPlan,
								attendanceCount,
								attendancePeriod,
								onAttendancePeriodChange: setAttendancePeriod,
								monthlySeries
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "personal",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentPersonalTab, {
								student,
								onEdit: () => setEditOpen(true)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "plan",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentPlanTab, {
								currentPlan,
								history: student.student_plan_history ?? [],
								freezes,
								onOpenNewFreeze: () => {
									setEditingFreeze(null);
									setFreezeOpen(true);
								},
								onEditFreeze: (f) => {
									setEditingFreeze(f);
									setFreezeOpen(true);
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "payments",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentPaymentsTab, {
								payments,
								attendanceDates: attendance,
								freezes,
								student,
								onEdit: (p) => {
									setEditingPayment(p);
									setPaymentOpen(true);
								},
								onDelete: (p) => setDeleteTarget(p),
								onAdd: () => {
									setEditingPayment(null);
									setPaymentOpen(true);
								},
								onTransfer: (p) => setTransferPaymentId(p.id),
								onRenew: async (p) => {
									setRenewingId(p.id);
									const ok = await renewPayment(p);
									setRenewingId(null);
									if (ok) qc.invalidateQueries();
								},
								onToggleAutoRenew: async (p) => {
									const next = !(p.auto_renew ?? p.plans?.auto_renew ?? false);
									const { error } = await supabase.from("payments").update({ auto_renew: next }).eq("id", p.id);
									if (error) {
										toast.error(error.message);
										return;
									}
									toast.success(next ? "Renovação automática ativada" : "Renovação automática desativada");
									qc.invalidateQueries();
								},
								renewingId
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "checkins",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentCheckinsTab, {
								payments,
								attendanceDates: attendance,
								freezes,
								entries: checkinEntries,
								loading: loadingAttendance,
								studentName: student.name
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "attendance",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAttendanceTab, {
								payments,
								studentCreatedAt: student.created_at
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentDialog, {
					open: editOpen,
					onOpenChange: setEditOpen,
					student
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentDialog, {
					open: paymentOpen,
					onOpenChange: setPaymentOpen,
					defaultStudentId: id,
					payment: editingPayment
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreezeDialog, {
					open: freezeOpen,
					onOpenChange: setFreezeOpen,
					studentId: id,
					planName: currentPlan?.plans?.name,
					freeze: editingFreeze
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransferPaymentDialog, {
					open: !!transferPaymentId,
					onOpenChange: (o) => {
						if (!o) setTransferPaymentId(null);
					},
					paymentId: transferPaymentId ?? "",
					fromStudentId: id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
					open: !!deleteTarget,
					onOpenChange: (o) => !o && setDeleteTarget(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Mover pagamento para a Lixeira?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
						"O pagamento de ",
						deleteTarget?.reference_month,
						" (R$",
						" ",
						Number(deleteTarget?.amount).toFixed(2),
						") será movido para a Lixeira. Você poderá restaurá-lo depois se necessário."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						onClick: handleDelete,
						className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
						children: "Mover para a Lixeira"
					})] })] })
				})
			]
		})
	});
}
//#endregion
export { StudentDetail as component };
