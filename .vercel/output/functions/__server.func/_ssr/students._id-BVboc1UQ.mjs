import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Bt as FileImage, D as SquarePen, Dn as Bot, E as Stethoscope, Fn as ArrowRight, G as Plus, Gt as EllipsisVertical, Hn as Archive, Ht as Eye, In as ArrowRightLeft, It as Flame, K as Play, Kt as Dumbbell, L as Send, Ln as ArrowLeft, Lt as FileText, M as ShieldAlert, Mn as Award, Mt as GripVertical, N as Share2, O as Sparkles, On as Bone, Ot as Image, Qt as CloudUpload, R as Search, St as LayoutGrid, U as RefreshCw, Un as ArchiveRestore, V as RotateCcw, Wn as Activity, Wt as ExternalLink, X as Percent, Z as Pencil, Zt as Copy, _ as TriangleAlert, _t as LoaderCircle, b as Trash2, bt as Library, c as User, cn as CircleAlert, ct as MessageCircle, dn as ChevronUp, et as Pause, fn as ChevronRight, g as Trophy, h as Upload, hn as Check, it as Move, j as ShieldCheck, jt as HeartPulse, mn as ChevronDown, n as X, nn as ClipboardList, o as Video, on as CirclePause, qt as Download, r as Wallet, s as Users, sn as CircleCheck, st as MessageSquare, t as Zap, un as ChevronsLeftRight, v as TrendingUp, w as Target, wn as Calculator, wt as Layers, x as Timer, xn as CalendarDays, y as TrendingDown, yn as Calendar, z as Scale } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PointerSensor, g as CSS, h as useSensors, i as KeyboardSensor, m as useSensor, o as closestCenter, t as DndContext } from "../_libs/@dnd-kit/core+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Badge } from "./badge-DB22ix_c.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DEnZ0u5J.mjs";
import { t as EmptyState } from "./EmptyState-DK3vCNbs.mjs";
import { c as startOfMonth, f as startOfWeek, n as subWeeks, r as subMonths, s as format, t as ptBR } from "../_libs/date-fns.mjs";
import { a as formatDateBR, i as formatBRL, l as initials, o as formatMonthLabel, u as paymentMethodLabel } from "./format-BT-nao3-.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBA-r8Xh.mjs";
import { t as PaymentStatusBadge } from "./Badges-BwuNwA-M.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as chartTooltip } from "./chart-theme-DG2ASWF8.mjs";
import { t as KPICard } from "./KPICard-CS1xEcGG.mjs";
import { a as useSortable, i as sortableKeyboardCoordinates, n as arrayMove, o as verticalListSortingStrategy, t as SortableContext } from "../_libs/dnd-kit__sortable.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as YAxis, c as Line, i as LineChart, l as CartesianGrid, m as Tooltip, o as XAxis, p as ResponsiveContainer, r as BarChart, u as Bar } from "../_libs/recharts+[...].mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DT1SSYuq.mjs";
import { t as Checkbox } from "./checkbox-kt6FvQcE.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { c as _enum, f as object, p as string } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { i as PTStudentStatusBadge, r as PTSessionStatusBadge, t as PTBadge } from "./PTBadges-CcuDhA9u.mjs";
import { r as parseStudentPartner } from "./pt-duo-Dbaj7St1.mjs";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-Cmlz_mk1.mjs";
import { r as renewPtPayment, t as downloadReceiptPdf } from "./receipt-pdf-NiEaxcs2.mjs";
import { t as PTPaymentDialog } from "./PTPaymentDialog-EiiOhpI7.mjs";
import { n as formatSeconds, t as SessionTimer } from "./SessionTimer-BAIBXzxF.mjs";
import { n as toPng, t as toBlob } from "../_libs/html-to-image.mjs";
import { n as PTStudentDialog, t as PTSessionDialog } from "./PTSessionDialog-z5VbvOau.mjs";
import { a as DropdownMenuSeparator, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BosDdXX7.mjs";
import { t as Route } from "./students._id-D3SNXYF6.mjs";
import { t as FreezeDialog } from "./FreezeDialog-BK_NPCio.mjs";
import { a as saveStudentAnamnesis, i as getStudentAnamnesis, n as PARQ_QUESTIONS, r as extractClinicalAlerts, t as ClinicalAlertBadge } from "./ClinicalAlertBadge-DvxlxBCj.mjs";
import { n as restrictToVerticalAxis, t as restrictToParentElement } from "../_libs/dnd-kit__modifiers.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students._id-BVboc1UQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_OPTIONS = [
	{
		value: "completed",
		label: "✅ Realizada"
	},
	{
		value: "cancelled_student",
		label: "❌ Cancelada (aluno)"
	},
	{
		value: "cancelled_trainer",
		label: "❌ Cancelada (professor)"
	},
	{
		value: "no_show",
		label: "🚫 Falta"
	}
];
function BulkPTSessionsDialog({ open, onOpenChange, studentId, paymentId }) {
	const qc = useQueryClient();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [defaultStatus, setDefaultStatus] = (0, import_react.useState)("completed");
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) {
			setRows([{
				date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
				time: "",
				duration: 60,
				status: "completed"
			}]);
			setDefaultStatus("completed");
		}
	}, [open]);
	function addRow() {
		const last = rows[rows.length - 1];
		setRows((r) => [...r, {
			date: last?.date ?? format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
			time: "",
			duration: 60,
			status: defaultStatus
		}]);
	}
	function updateRow(i, patch) {
		setRows((r) => r.map((row, idx) => idx === i ? {
			...row,
			...patch
		} : row));
	}
	function removeRow(i) {
		setRows((r) => r.filter((_, idx) => idx !== i));
	}
	function applyStatusToAll() {
		setRows((r) => r.map((row) => ({
			...row,
			status: defaultStatus
		})));
	}
	async function save() {
		if (rows.length === 0) return;
		if (rows.find((r) => !r.date)) return toast.error("Todas as linhas precisam ter data");
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		setSaving(true);
		const payload = rows.map((r) => ({
			user_id: userId,
			pt_student_id: studentId,
			pt_payment_id: paymentId ?? null,
			session_date: r.date,
			session_time: r.time || null,
			duration_minutes: r.duration || 60,
			status: r.status
		}));
		const { error } = await supabase.from("pt_sessions").insert(payload);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success(`${rows.length} aula(s) registrada(s)`);
		qc.invalidateQueries();
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Registrar aulas em lote" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Registre várias aulas passadas de uma vez. Útil para histórico de aulas já efetuadas (ou não)."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end gap-2 rounded-lg border bg-muted/30 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Status padrão"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: defaultStatus,
								onValueChange: setDefaultStatus,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-56",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s.value,
									children: s.label
								}, s.value)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: applyStatusToAll,
							children: "Aplicar a todas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ml-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: addRow,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Adicionar linha"]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[50vh] space-y-2 overflow-y-auto pr-1",
					children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-12 items-end gap-2 rounded-lg border p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-4 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Data"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: r.date,
									onChange: (e) => updateRow(i, { date: e.target.value })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Hora"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "time",
									value: r.time,
									onChange: (e) => updateRow(i, { time: e.target.value })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Duração"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: r.duration,
									onChange: (e) => updateRow(i, { duration: Number(e.target.value) })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-3 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: r.status,
									onValueChange: (v) => updateRow(i, { status: v }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s.value,
										children: s.label
									}, s.value)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-1 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => removeRow(i),
									disabled: rows.length === 1,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
								})
							})
						]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					disabled: saving,
					children: saving ? "Salvando…" : `Registrar ${rows.length} aula(s)`
				})] })
			]
		})
	});
}
function FileUpload({ value, onChange, accept = ".pdf,.jpg,.jpeg,.png", maxSizeMB = 10, label = "Arraste e solte o arquivo aqui ou clique para selecionar", description, className, disabled = false }) {
	const [isDragOver, setIsDragOver] = import_react.useState(false);
	const [previewUrl, setPreviewUrl] = import_react.useState(null);
	const [error, setError] = import_react.useState(null);
	const inputRef = import_react.useRef(null);
	import_react.useEffect(() => {
		if (value && value.type.startsWith("image/")) {
			const url = URL.createObjectURL(value);
			setPreviewUrl(url);
			return () => URL.revokeObjectURL(url);
		} else setPreviewUrl(null);
	}, [value]);
	const validateAndSetFile = (file) => {
		setError(null);
		if (!file) {
			onChange(null);
			return;
		}
		const maxBytes = maxSizeMB * 1024 * 1024;
		if (file.size > maxBytes) {
			setError(`O arquivo excede o limite máximo de ${maxSizeMB}MB.`);
			return;
		}
		onChange(file);
	};
	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (disabled) return;
		setIsDragOver(true);
	};
	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);
		if (disabled) return;
		const droppedFile = e.dataTransfer.files?.[0];
		if (droppedFile) validateAndSetFile(droppedFile);
	};
	const formatSize = (bytes) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};
	const isImage = value?.type?.startsWith("image/");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("w-full space-y-2", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept,
				className: "hidden",
				disabled,
				onChange: (e) => {
					validateAndSetFile(e.target.files?.[0] || null);
					e.target.value = "";
				}
			}),
			!value ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onDragOver: handleDragOver,
				onDragLeave: handleDragLeave,
				onDrop: handleDrop,
				onClick: () => !disabled && inputRef.current?.click(),
				className: cn("group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer select-none", isDragOver ? "border-primary bg-primary/10 shadow-sm scale-[0.99]" : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/40", disabled && "cursor-not-allowed opacity-60"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-medium text-foreground",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: description || `Arquivos suportados: ${accept.replace(/\./g, "").toUpperCase()} (máx. ${maxSizeMB}MB)`
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center gap-3.5 rounded-xl border border-border bg-card p-3 shadow-2xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40",
						children: previewUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: previewUrl,
							alt: "Preview",
							className: "h-full w-full object-cover"
						}) : isImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-6 w-6 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6 text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium text-foreground",
							children: value.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: formatSize(value.size)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "icon",
						onClick: () => validateAndSetFile(null),
						disabled,
						className: "h-8 w-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0",
						title: "Remover arquivo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-xs text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
			})
		]
	});
}
function ContractsTab({ studentId, tableName, foreignKey }) {
	const qc = useQueryClient();
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [uploadOpen, setUploadOpen] = (0, import_react.useState)(false);
	const [notes, setNotes] = (0, import_react.useState)("");
	const [signedAt, setSignedAt] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	const { data: contracts = [], isLoading } = useQuery({
		queryKey: [tableName, studentId],
		queryFn: async () => {
			const { data } = await supabase.from(tableName).select("*").eq(foreignKey, studentId).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	async function uploadContract() {
		if (!file) return toast.error("Selecione um arquivo.");
		setUploading(true);
		try {
			const { data: userData } = await supabase.auth.getUser();
			const userId = userData.user?.id;
			if (!userId) throw new Error("Não autenticado");
			const ext = file.name.split(".").pop();
			const filePath = `${userId}/${studentId}/${Date.now()}.${ext}`;
			const { error: uploadError } = await supabase.storage.from("contracts").upload(filePath, file, { contentType: file.type });
			if (uploadError) throw uploadError;
			const { error: dbError } = await supabase.from(tableName).insert({
				user_id: userId,
				[foreignKey]: studentId,
				file_name: file.name,
				file_path: filePath,
				file_size: file.size,
				file_type: file.type,
				notes: notes || null,
				signed_at: signedAt || null
			});
			if (dbError) throw dbError;
			toast.success("Contrato enviado com sucesso!");
			setUploadOpen(false);
			setFile(null);
			setNotes("");
			setSignedAt("");
			qc.invalidateQueries({ queryKey: [tableName, studentId] });
		} catch (err) {
			toast.error(`Erro: ${err.message}`);
		}
		setUploading(false);
	}
	async function downloadContract(filePath, fileName) {
		const { data, error } = await supabase.storage.from("contracts").download(filePath);
		if (error || !data) return toast.error("Erro ao baixar arquivo.");
		const url = URL.createObjectURL(data);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		a.click();
		URL.revokeObjectURL(url);
	}
	async function deleteContract(id, filePath) {
		if (!await confirmDialog("Excluir este contrato?")) return;
		await supabase.storage.from("contracts").remove([filePath]);
		await supabase.from(tableName).delete().eq("id", id);
		toast.success("Contrato excluído.");
		qc.invalidateQueries({ queryKey: [tableName, studentId] });
	}
	function formatFileSize(bytes) {
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
		return (bytes / (1024 * 1024)).toFixed(1) + " MB";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setUploadOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " Adicionar contrato"]
				})
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Carregando…"
			}) : contracts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Sem contratos",
				description: "Nenhum contrato enviado para este aluno."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: contracts.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium truncate",
										children: c.file_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 text-xs text-muted-foreground flex flex-wrap gap-1",
										children: [
											c.file_size && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatFileSize(c.file_size) }),
											c.signed_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"· Assinado em",
												" ",
												format(/* @__PURE__ */ new Date(c.signed_at + "T12:00"), "dd/MM/yyyy")
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"· Enviado em",
												" ",
												format(new Date(c.created_at), "dd/MM/yyyy", { locale: ptBR })
											] })
										]
									}),
									c.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: c.notes
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => downloadContract(c.file_path, c.file_name),
								title: "Baixar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => deleteContract(c.id, c.file_path),
								title: "Excluir",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
							})]
						})]
					})
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: uploadOpen,
				onOpenChange: setUploadOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Adicionar contrato" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Documento / Contrato" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUpload, {
									value: file,
									onChange: setFile,
									accept: ".pdf,.jpg,.jpeg,.png,.webp",
									maxSizeMB: 15,
									disabled: uploading,
									label: "Arraste o contrato aqui ou clique para selecionar",
									description: "Suporta PDF, JPG, PNG e WEBP até 15MB"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data de assinatura" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: signedAt,
									onChange: (e) => setSignedAt(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: notes,
									onChange: (e) => setNotes(e.target.value),
									placeholder: "Ex: Contrato de prestação de serviços 2025"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setUploadOpen(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: uploadContract,
						disabled: uploading,
						children: uploading ? "Enviando…" : "Enviar contrato"
					})] })
				] })
			})
		]
	});
}
/**
* Lista vertical reordenável, acessível por teclado (Tab no punho + setas).
* A persistência fica a cargo do consumidor via onReorder(ids).
*/
function SortableList({ items, onReorder, disabled, className, children }) {
	const ids = (0, import_react.useMemo)(() => items.map((i) => i.id), [items]);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
	function handleDragEnd(event) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const from = ids.indexOf(String(active.id));
		const to = ids.indexOf(String(over.id));
		if (from < 0 || to < 0) return;
		onReorder(arrayMove(ids, from, to));
	}
	if (disabled) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		children: items.map((item) => children(item, {
			handleProps: {},
			isDragging: false
		}))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
		sensors,
		collisionDetection: closestCenter,
		modifiers: [restrictToVerticalAxis, restrictToParentElement],
		onDragEnd: handleDragEnd,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
			items: ids,
			strategy: verticalListSortingStrategy,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className,
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableRow, {
					id: item.id,
					children: (props) => children(item, props)
				}, item.id))
			})
		})
	});
}
function SortableRow({ id, children }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Transform.toString(transform),
			transition
		},
		className: cn("relative transition-shadow duration-200", isDragging && "z-20 scale-[1.01] opacity-95 shadow-lg"),
		children: children({
			handleProps: {
				...attributes,
				...listeners
			},
			isDragging
		})
	});
}
/** Punho visual padronizado — usa os props devolvidos pelo SortableList. */
function DragHandle({ handleProps, label = "Reordenar", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		...handleProps,
		className: cn("flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground/60 outline-none transition-colors duration-150", "hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card active:cursor-grabbing", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4" })
	});
}
function ExerciseMediaUpload({ mediaUrl, mediaType, onUpload, onRemove }) {
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [youtubeUrl, setYoutubeUrl] = (0, import_react.useState)("");
	const [showYoutube, setShowYoutube] = (0, import_react.useState)(false);
	async function handleFileUpload(file) {
		if (file.size > 100 * 1024 * 1024) {
			toast.error("Arquivo maior que 100MB.");
			return;
		}
		setUploading(true);
		try {
			const { data: userData } = await supabase.auth.getUser();
			const userId = userData.user?.id;
			if (!userId) throw new Error("Não autenticado");
			const ext = file.name.split(".").pop();
			const isVideo = file.type.startsWith("video/");
			const filePath = `${userId}/${Date.now()}.${ext}`;
			const { error: uploadError } = await supabase.storage.from("exercise-media").upload(filePath, file, { contentType: file.type });
			if (uploadError) throw uploadError;
			const { data: signed, error: signErr } = await supabase.storage.from("exercise-media").createSignedUrl(filePath, 3600 * 24 * 365 * 100);
			if (signErr || !signed?.signedUrl) throw signErr ?? /* @__PURE__ */ new Error("Falha ao gerar URL");
			onUpload(signed.signedUrl, isVideo ? "video" : "image");
			toast.success("Mídia enviada com sucesso!");
		} catch (err) {
			toast.error(`Erro: ${err.message ?? err}`);
		}
		setUploading(false);
	}
	function handleYoutubeAdd() {
		if (!youtubeUrl.trim()) return;
		const match = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/);
		if (!match) {
			toast.error("URL do YouTube inválida.");
			return;
		}
		onUpload(`https://www.youtube.com/embed/${match[1]}`, "youtube");
		setYoutubeUrl("");
		setShowYoutube(false);
	}
	const inputId = `exercise-media-input-${Math.random().toString(36).slice(2, 8)}`;
	if (mediaUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-lg border bg-muted",
		children: [mediaType === "youtube" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
			src: mediaUrl,
			className: "aspect-video w-full",
			allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
			allowFullScreen: true
		}) : mediaType === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			src: mediaUrl,
			controls: true,
			className: "aspect-video w-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: mediaUrl,
			alt: "Exercício",
			loading: "lazy",
			decoding: "async",
			className: "aspect-video w-full object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onRemove,
			className: "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-card transition-ui hover:brightness-110",
			"aria-label": "Remover mídia",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:bg-accent/30", uploading && "pointer-events-none opacity-50"),
			onClick: () => document.getElementById(inputId)?.click(),
			children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex gap-3 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-6 w-6" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-6 w-6" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-sm text-muted-foreground",
					children: ["Clique para enviar ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: "foto ou vídeo"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "JPG, PNG, MP4 — até 100MB"
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: inputId,
				type: "file",
				accept: "image/jpeg,image/png,image/webp,video/mp4,video/quicktime",
				className: "hidden",
				onChange: (e) => {
					const file = e.target.files?.[0];
					if (file) handleFileUpload(file);
				}
			})]
		}), !showYoutube ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setShowYoutube(true),
			className: "w-full py-1 text-center text-xs text-primary hover:underline",
			children: "📺 Ou adicionar link do YouTube"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "url",
					value: youtubeUrl,
					onChange: (e) => setYoutubeUrl(e.target.value),
					placeholder: "https://youtube.com/watch?v=...",
					className: "flex-1 rounded-md border bg-background px-3 py-1.5 text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: handleYoutubeAdd,
					className: "rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground",
					children: "Adicionar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setShowYoutube(false),
					className: "rounded-md border px-2 py-1.5 text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
				})
			]
		})]
	});
}
function IntervalTimer({ sets, workSeconds, restSeconds, onComplete, onClose }) {
	const [currentSet, setCurrentSet] = (0, import_react.useState)(1);
	const [phase, setPhase] = (0, import_react.useState)("work");
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(workSeconds);
	const [running, setRunning] = (0, import_react.useState)(true);
	const [finished, setFinished] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let timer;
		if (running && timeLeft > 0) timer = window.setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1e3);
		else if (running && timeLeft === 0) {
			if (phase === "work") if (restSeconds > 0) {
				setPhase("rest");
				setTimeLeft(restSeconds);
			} else if (currentSet < sets) {
				setCurrentSet((prev) => prev + 1);
				setPhase("work");
				setTimeLeft(workSeconds);
			} else {
				setFinished(true);
				setRunning(false);
				onComplete?.();
			}
			else if (currentSet < sets) {
				setCurrentSet((prev) => prev + 1);
				setPhase("work");
				setTimeLeft(workSeconds);
			} else {
				setFinished(true);
				setRunning(false);
				onComplete?.();
			}
			playBeep(phase === "work" ? 880 : 440);
		}
		return () => clearInterval(timer);
	}, [
		running,
		timeLeft,
		phase,
		currentSet,
		sets,
		workSeconds,
		restSeconds,
		onComplete
	]);
	function playBeep(freq) {
		try {
			const ctx = new (window.AudioContext || window.webkitAudioContext)();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.value = freq;
			osc.connect(gain);
			gain.connect(ctx.destination);
			gain.gain.setValueAtTime(0, ctx.currentTime);
			gain.gain.linearRampToValueAtTime(.3, ctx.currentTime + .02);
			gain.gain.linearRampToValueAtTime(0, ctx.currentTime + .3);
			osc.start();
			osc.stop(ctx.currentTime + .3);
			setTimeout(() => ctx.close(), 500);
		} catch (e) {
			console.error("Audio error", e);
		}
	}
	const formatTime = (s) => {
		const mins = Math.floor(s / 60);
		const secs = s % 60;
		return {
			m: String(mins).padStart(2, "0"),
			s: String(secs).padStart(2, "0")
		};
	};
	const { m, s } = formatTime(timeLeft);
	if (finished) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center space-y-6 py-8 animate-in fade-in zoom-in duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-10 w-10" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xl font-bold text-foreground",
					children: "Treino concluído"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Ótimo trabalho!"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onClose,
				className: "rounded-full px-8",
				children: "Fechar"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center space-y-6 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-5xl font-bold text-primary tabular-nums leading-none",
					children: currentSet
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1",
					children: "sets"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1.5 h-1.5 w-full max-w-[200px]",
				children: Array.from({ length: sets }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("flex-1 rounded-full transition-colors duration-300", i + 1 <= currentSet ? "bg-primary" : "bg-primary/20") }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-56 w-56 rounded-full border-2 border-muted flex flex-col items-center justify-center bg-background shadow-inner",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center text-6xl font-bold text-primary tracking-tighter tabular-nums",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center px-1 self-center -mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-primary mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-primary" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-32 justify-between px-2 mt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-muted-foreground w-8 text-center",
							children: "m"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-muted-foreground w-8 text-center",
							children: "s"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-3xl font-light tracking-widest text-muted-foreground/60 uppercase",
					children: phase === "work" ? "Trabalho" : "Descanso"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setRunning(!running),
				className: "h-14 w-full max-w-[240px] rounded-full text-lg font-bold shadow-lg transition-transform active:scale-95",
				children: running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "mr-2 h-5 w-5 fill-current" }), " Pausar"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-2 h-5 w-5 fill-current" }), " Retomar"] })
			})
		]
	});
}
function ExerciseCard({ exercise, onDelete, onUpdate, onSelectSubstitute, allExercises, initialExpanded = true, dragHandle, isSubstitute = false, highlight = false, onNavigateTo }) {
	const [expanded, setExpanded] = (0, import_react.useState)(initialExpanded);
	(0, import_react.useEffect)(() => {
		setExpanded(initialExpanded);
	}, [initialExpanded]);
	const [editingName, setEditingName] = (0, import_react.useState)(false);
	const [nameDraft, setNameDraft] = (0, import_react.useState)(exercise.name);
	const [savingName, setSavingName] = (0, import_react.useState)(false);
	const nameInputRef = (0, import_react.useRef)(null);
	const [showTimer, setShowTimer] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		sets_reps: exercise.sets_reps ?? "",
		load: exercise.load ?? "",
		rest_seconds: exercise.rest_seconds?.toString() ?? "",
		observations: exercise.observations ?? "",
		media_url: exercise.media_url ?? "",
		media_type: exercise.media_type ?? "image",
		series_type: exercise.series_type ?? "reps_load",
		time_seconds: exercise.time_seconds?.toString() ?? "",
		inclination: exercise.inclination ?? "",
		pace: exercise.pace ?? "",
		cadence: exercise.cadence ?? ""
	});
	(0, import_react.useEffect)(() => {
		if (editingName) {
			nameInputRef.current?.focus();
			nameInputRef.current?.select();
		}
	}, [editingName]);
	async function autoSave(patch) {
		const { error } = await supabase.from("pt_training_exercises").update(patch).eq("id", exercise.id);
		if (error) {
			toast.error(error.message);
			return;
		}
		onUpdate();
	}
	async function commitName() {
		const trimmed = nameDraft.trim();
		if (!trimmed || trimmed === exercise.name) {
			setNameDraft(exercise.name);
			setEditingName(false);
			return;
		}
		setSavingName(true);
		const { error } = await supabase.from("pt_training_exercises").update({ name: trimmed }).eq("id", exercise.id);
		setSavingName(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Exercício renomeado");
		setEditingName(false);
		onUpdate();
	}
	function cancelName() {
		setNameDraft(exercise.name);
		setEditingName(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: `exercise-${exercise.id}`,
		className: cn("group/card rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md", highlight && "ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-b border-border/70 p-3",
				children: [
					dragHandle ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, {
						className: "h-4 w-4 shrink-0 text-muted-foreground/60",
						"aria-hidden": true
					}),
					editingName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								ref: nameInputRef,
								value: nameDraft,
								disabled: savingName,
								onChange: (e) => setNameDraft(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										commitName();
									} else if (e.key === "Escape") {
										e.preventDefault();
										cancelName();
									}
								},
								"aria-label": "Nome do exercício",
								className: "h-8 flex-1 text-sm font-semibold tracking-tight transition-colors duration-150"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon",
								variant: "ghost",
								onClick: commitName,
								disabled: savingName,
								"aria-label": "Salvar nome",
								className: "h-9 w-9 text-primary hover:bg-primary/10 hover:text-primary sm:h-8 sm:w-8",
								children: savingName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon",
								variant: "ghost",
								onClick: cancelName,
								disabled: savingName,
								"aria-label": "Cancelar edição",
								className: "h-9 w-9 text-muted-foreground hover:bg-muted hover:text-foreground sm:h-8 sm:w-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setEditingName(true),
						"aria-label": `Renomear ${exercise.name}`,
						className: "group/name flex flex-1 items-center gap-1.5 rounded-md text-left text-sm font-semibold leading-tight tracking-tight text-foreground outline-none transition-colors duration-150 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: exercise.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 transition-opacity group-hover/name:inline",
								children: ["· ", form.series_type === "reps_load" ? "Série/Rep" : form.series_type === "sets_time" ? "Série/Tempo" : form.series_type === "reps_load_time" ? "Rep/Carga/Tempo" : form.series_type === "reps_time" ? "Rep/Tempo" : form.series_type === "time_inclination" ? "Tempo/Inclinação" : form.series_type === "run" ? "Corrida" : form.series_type === "cadence" ? "Cadência" : "Padrão"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
								className: "h-3.5 w-3.5 shrink-0 text-muted-foreground/70 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover/card:opacity-100 sm:group-focus-visible/name:opacity-100",
								"aria-hidden": true
							})
						]
					}),
					!editingName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8 text-primary hover:text-primary hover:bg-primary/10",
								onClick: () => setShowTimer(true),
								"aria-label": "Cronômetro",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setExpanded((v) => !v),
								className: "rounded-md p-1 text-muted-foreground outline-none transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
								"aria-label": expanded ? "Recolher exercício" : "Expandir exercício",
								children: expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "h-8 w-8 text-muted-foreground hover:text-foreground",
									"aria-label": "Mais opções",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-52",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => setExpanded((v) => !v),
										children: [expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "mr-2 h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "mr-2 h-4 w-4" }), expanded ? "Recolher" : "Expandir"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => {
											setExpanded(true);
											setEditingName(true);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), "Renomear exercício"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									!isSubstitute && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => onSelectSubstitute?.(exercise.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Adicionar substituto"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										className: "text-destructive focus:text-destructive",
										onClick: () => onDelete(exercise.id),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }),
											"Excluir ",
											isSubstitute ? "substituto" : "exercício"
										]
									})
								]
							})] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showTimer,
				onOpenChange: setShowTimer,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md p-6 bg-white border-none shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
						className: "hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Cronômetro de Exercício" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntervalTimer, {
						sets: parseInt(exercise.sets_reps?.split("x")[0] || "1"),
						workSeconds: exercise.series_type === "sets_time" || exercise.series_type === "reps_time" || exercise.series_type === "reps_load_time" || exercise.series_type === "time_inclination" ? exercise.time_seconds || 0 : 0,
						restSeconds: parseInt(exercise.rest_seconds || "0"),
						onClose: () => setShowTimer(false)
					})]
				})
			}),
			expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("space-y-3 p-3", isSubstitute && "bg-muted/30"),
				children: [
					isSubstitute && exercise.substitute_exercise_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "link",
						size: "sm",
						className: "h-auto p-0 text-[10px] text-primary",
						onClick: () => onNavigateTo?.(exercise.substitute_exercise_id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1 h-3 w-3" }), " Voltar para o original"]
					}),
					!isSubstitute && allExercises?.some((e) => e.substitute_exercise_id === exercise.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: allExercises.filter((e) => e.substitute_exercise_id === exercise.id).map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-7 gap-1.5 border-primary/30 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/5",
							onClick: () => onNavigateTo?.(sub.id),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" }),
								" Ver Substituto: ",
								sub.name
							]
						}, sub.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseMediaUpload, {
						mediaUrl: form.media_url,
						mediaType: form.media_type,
						onUpload: (url, type) => {
							setForm((f) => ({
								...f,
								media_url: url,
								media_type: type
							}));
							autoSave({
								media_url: url,
								media_type: type
							});
						},
						onRemove: () => {
							setForm((f) => ({
								...f,
								media_url: "",
								media_type: "image"
							}));
							autoSave({
								media_url: null,
								media_type: null
							});
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-medium text-muted-foreground",
							children: "Tipo da série"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.series_type,
							onValueChange: (v) => {
								setForm((f) => ({
									...f,
									series_type: v
								}));
								autoSave({ series_type: v });
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o tipo" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "reps_load",
									children: "Repetições e carga"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "sets_time",
									children: "Séries e tempo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "reps_load_time",
									children: "Repetições, carga e tempo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "reps_time",
									children: "Repetições e tempo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "time_inclination",
									children: "Tempo e inclinação"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "run",
									children: "Corrida"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "cadence",
									children: "Cadência"
								})
							] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
						children: [
							(form.series_type === "reps_load" || form.series_type === "sets_time" || form.series_type === "reps_load_time" || form.series_type === "reps_time") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-muted-foreground",
									children: "Série/rep"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.sets_reps,
									onChange: (e) => setForm((f) => ({
										...f,
										sets_reps: e.target.value
									})),
									onBlur: (e) => autoSave({ sets_reps: e.target.value || null }),
									placeholder: "4x12",
									className: "h-9"
								})]
							}),
							(form.series_type === "reps_load" || form.series_type === "reps_load_time") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-bold text-primary",
									children: "Carga (Sugerida)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.load,
									onChange: (e) => setForm((f) => ({
										...f,
										load: e.target.value
									})),
									onBlur: (e) => autoSave({ load: e.target.value || null }),
									placeholder: "ex: 20kg",
									className: "h-9 border-primary/30 focus-visible:ring-primary/50"
								})]
							}),
							(form.series_type === "reps_load_time" || form.series_type === "reps_time" || form.series_type === "sets_time" || form.series_type === "time_inclination") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-muted-foreground",
									children: "Tempo (s)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: form.time_seconds,
									onChange: (e) => setForm((f) => ({
										...f,
										time_seconds: e.target.value
									})),
									onBlur: (e) => autoSave({ time_seconds: e.target.value ? parseInt(e.target.value) : null }),
									placeholder: "60",
									className: "h-9"
								})]
							}),
							form.series_type === "time_inclination" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-muted-foreground",
									children: "Inclinação"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.inclination,
									onChange: (e) => setForm((f) => ({
										...f,
										inclination: e.target.value
									})),
									onBlur: (e) => autoSave({ inclination: e.target.value || null }),
									placeholder: "2%",
									className: "h-9"
								})]
							}),
							form.series_type === "run" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-muted-foreground",
									children: "Distância"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.load,
									onChange: (e) => setForm((f) => ({
										...f,
										load: e.target.value
									})),
									onBlur: (e) => autoSave({ load: e.target.value || null }),
									placeholder: "5km",
									className: "h-9"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-muted-foreground",
									children: "Ritmo (Pace)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.pace,
									onChange: (e) => setForm((f) => ({
										...f,
										pace: e.target.value
									})),
									onBlur: (e) => autoSave({ pace: e.target.value || null }),
									placeholder: "5:00 min/km",
									className: "h-9"
								})]
							})] }),
							form.series_type === "cadence" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-muted-foreground",
									children: "Cadência"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.cadence,
									onChange: (e) => setForm((f) => ({
										...f,
										cadence: e.target.value
									})),
									onBlur: (e) => autoSave({ cadence: e.target.value || null }),
									placeholder: "2010",
									className: "h-9"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-muted-foreground",
									children: "Intervalo (s)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: form.rest_seconds,
									onChange: (e) => setForm((f) => ({
										...f,
										rest_seconds: e.target.value
									})),
									onBlur: (e) => autoSave({ rest_seconds: e.target.value || null }),
									placeholder: "60",
									className: "h-9"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-medium text-muted-foreground",
							children: "Observações"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: form.observations,
							onChange: (e) => setForm((f) => ({
								...f,
								observations: e.target.value
							})),
							onBlur: (e) => autoSave({ observations: e.target.value || null }),
							placeholder: "Instruções específicas para este exercício…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pt-0.5 text-[11px] leading-tight text-muted-foreground/80",
						children: "Toque em qualquer campo para editar — as alterações são salvas automaticamente."
					})
				]
			})
		]
	});
}
function AddExerciseDialog({ open, onOpenChange, trainingDayId, currentCount, substituteForId }) {
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [customName, setCustomName] = (0, import_react.useState)("");
	const [adding, setAdding] = (0, import_react.useState)(false);
	const { data: library = [] } = useQuery({
		queryKey: ["exercise-library"],
		queryFn: async () => {
			const { data } = await supabase.from("pt_exercises_library").select("id,name,muscle_group,media_url,media_type,thumbnail_url").order("name");
			return data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.toLowerCase().trim();
		return library.filter((e) => !q || e.name.toLowerCase().includes(q) || (e.muscle_group ?? "").toLowerCase().includes(q));
	}, [library, search]);
	async function addExercise(item, fallbackName) {
		setAdding(true);
		const name = item?.name ?? fallbackName ?? "";
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) {
			setAdding(false);
			return;
		}
		const { error } = await supabase.from("pt_training_exercises").insert({
			user_id: userId,
			training_day_id: trainingDayId,
			exercise_library_id: item?.id ?? null,
			name,
			media_url: item?.media_url ?? null,
			media_type: item?.media_type ?? null,
			sort_order: currentCount,
			series_type: "reps_load",
			substitute_exercise_id: substituteForId ?? null
		});
		if (error) toast.error(error.message);
		else {
			toast.success(`"${name}" adicionado`);
			qc.invalidateQueries({ queryKey: ["pt-day-exercises", trainingDayId] });
			onOpenChange(false);
		}
		setAdding(false);
	}
	async function addCustomExercise() {
		if (!customName.trim()) {
			toast.error("Digite o nome do exercício.");
			return;
		}
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		const { data: newExercise } = await supabase.from("pt_exercises_library").insert({
			user_id: userId,
			name: customName.trim()
		}).select("id,name,muscle_group,media_url,media_type,thumbnail_url").single();
		await addExercise(newExercise ?? void 0, customName.trim());
		setCustomName("");
		qc.invalidateQueries({ queryKey: ["exercise-library"] });
		qc.invalidateQueries({ queryKey: ["pt-library"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-h-[90dvh] max-w-lg overflow-hidden p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex max-h-[90dvh] flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
						className: "border-b border-border/60 p-5 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Adicionar exercício" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Selecione da biblioteca para reutilizar o vídeo de referência."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border/60 p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: search,
								onChange: (e) => setSearch(e.target.value),
								placeholder: "Buscar exercício…",
								autoFocus: true,
								className: "pl-9"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto p-3",
						children: filtered.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5",
							children: filtered.map((exercise) => {
								const thumb = exercise.thumbnail_url ?? (exercise.media_url && /(?:youtube\.com|youtu\.be)/.test(exercise.media_url) ? `https://img.youtube.com/vi/${exercise.media_url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1]}/hqdefault.jpg` : null);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => addExercise(exercise),
									disabled: adding,
									className: cn("flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-2.5 text-left transition-all duration-200", "hover:border-border hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:cursor-not-allowed disabled:opacity-60"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted",
											children: [thumb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: thumb,
												alt: "",
												className: "h-full w-full object-cover"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-full w-full items-center justify-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, {
													className: "h-5 w-5 text-muted-foreground/40",
													strokeWidth: 1.5
												})
											}), exercise.media_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute bottom-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-2.5 w-2.5" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-sm font-medium",
												children: exercise.name
											}), exercise.muscle_group && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "mt-1 h-4 px-1.5 text-[10px] font-normal",
												children: exercise.muscle_group
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 flex-shrink-0 text-muted-foreground" })
									]
								}) }, exercise.id);
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center px-6 py-10 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, {
									className: "mb-3 h-8 w-8 text-muted-foreground/50",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: search ? `Nenhum resultado para "${search}"` : "Sua biblioteca ainda está vazia."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/personal-trainer/biblioteca",
									className: "mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline",
									children: ["Gerenciar biblioteca", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border/60 bg-muted/30 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
								children: "Adicionar rápido"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: customName,
									onChange: (e) => setCustomName(e.target.value),
									placeholder: "Nome do exercício…",
									onKeyDown: (e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addCustomExercise();
										}
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									onClick: addCustomExercise,
									disabled: adding,
									size: "icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center justify-between text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Salvo na biblioteca automaticamente" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/personal-trainer/biblioteca",
									className: "inline-flex items-center gap-1 hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "h-3 w-3" }), "Biblioteca completa"]
								})]
							})
						]
					})
				]
			})
		})
	});
}
function TrainingDayDetail({ dayId }) {
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [substituteForId, setSubstituteForId] = (0, import_react.useState)(null);
	const [allExpanded, setAllExpanded] = (0, import_react.useState)(true);
	const [order, setOrder] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [highlightId, setHighlightId] = (0, import_react.useState)(null);
	const navigateTo = (id) => {
		setHighlightId(id);
		const element = document.getElementById(`exercise-${id}`);
		if (element) element.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
		setTimeout(() => setHighlightId(null), 3e3);
	};
	const { data: exercises = [], refetch } = useQuery({
		queryKey: ["pt-day-exercises", dayId],
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_exercises").select("*").eq("training_day_id", dayId).order("sort_order", { ascending: true }).order("created_at", { ascending: true });
			return data ?? [];
		}
	});
	const ordered = order ? order.map((id) => exercises.find((e) => e.id === id)).filter(Boolean) : exercises;
	const list = ordered.length === exercises.length ? ordered : exercises;
	async function reorder(ids) {
		setOrder(ids);
		setSaving(true);
		const results = await Promise.all(ids.map((id, i) => supabase.from("pt_training_exercises").update({ sort_order: i }).eq("id", id)));
		setSaving(false);
		const failed = results.find((r) => r.error);
		if (failed?.error) {
			setOrder(null);
			toast.error(failed.error.message);
			return;
		}
		await refetch();
		setOrder(null);
	}
	async function deleteExercise(id) {
		if (!await confirmDialog("Excluir este exercício?")) return;
		const { error } = await supabase.from("pt_training_exercises").delete().eq("id", id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Exercício removido");
		refetch();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 border-t pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-semibold leading-tight",
						children: "Exercícios"
					}), saving && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1 text-[11px] font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " salvando ordem"]
					})]
				}), exercises.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setAllExpanded((v) => !v),
					className: "flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-primary outline-none transition-colors duration-150 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card",
					children: [allExpanded ? "Recolher todos" : "Expandir todos", allExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" })]
				})]
			}),
			exercises.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-3 rounded-lg border border-dashed p-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nenhum exercício adicionado ainda"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setAddOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Adicionar primeiro exercício"]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableList, {
				items: list,
				onReorder: reorder,
				disabled: saving,
				className: "space-y-2",
				children: (exercise, { handleProps }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseCard, {
						exercise,
						trainingDayId: dayId,
						onDelete: deleteExercise,
						onUpdate: refetch,
						initialExpanded: allExpanded,
						dragHandle: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragHandle, {
							handleProps,
							label: `Reordenar ${exercise.name}`
						}),
						onSelectSubstitute: (id) => {
							setSubstituteForId(id);
							setAddOpen(true);
						},
						highlight: highlightId === exercise.id,
						onNavigateTo: navigateTo,
						allExercises: exercises
					}), exercises.filter((sub) => sub.substitute_exercise_id === exercise.id).map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-6 border-l-2 border-primary/20 pl-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 text-[10px] font-bold uppercase tracking-wider text-primary/60",
							children: "Exercício Substituto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseCard, {
							exercise: sub,
							trainingDayId: dayId,
							onDelete: deleteExercise,
							onUpdate: refetch,
							initialExpanded: allExpanded,
							isSubstitute: true,
							dragHandle: null,
							highlight: highlightId === sub.id,
							onNavigateTo: navigateTo,
							allExercises: exercises
						})]
					}, sub.id))]
				}, exercise.id)
			}),
			exercises.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => setAddOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Adicionar exercício"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddExerciseDialog, {
				open: addOpen,
				trainingDayId: dayId,
				currentCount: exercises.length,
				substituteForId,
				onOpenChange: (open) => {
					setAddOpen(open);
					if (!open) setSubstituteForId(null);
				}
			})
		]
	});
}
var CATEGORY_LABELS$3 = {
	hypertrophy: "Hipertrofia",
	conditioning: "Condicionamento físico",
	strength: "Força",
	cardio: "Cardio",
	general: "Geral"
};
var LEVEL_LABELS$3 = {
	beginner: "Iniciante",
	intermediate: "Intermediário",
	advanced: "Avançado"
};
function StudentViewDialog({ open, onOpenChange, programId }) {
	const { data: program } = useQuery({
		queryKey: ["pt-program-preview", programId],
		enabled: !!programId && open,
		queryFn: async () => {
			const { data } = await supabase.from("pt_programs").select("*").eq("id", programId).maybeSingle();
			return data;
		}
	});
	const { data: days = [] } = useQuery({
		queryKey: ["pt-program-preview-days", programId],
		enabled: !!programId && open,
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_days").select("*").eq("program_id", programId).order("sort_order", { ascending: true }).order("created_at", { ascending: true });
			return data ?? [];
		}
	});
	const dayIds = days.map((d) => d.id);
	const { data: exercises = [] } = useQuery({
		queryKey: ["pt-program-preview-ex", dayIds.join(",")],
		enabled: dayIds.length > 0 && open,
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_exercises").select("*").in("training_day_id", dayIds).order("sort_order", { ascending: true }).order("created_at", { ascending: true });
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl max-h-[90vh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Visão do aluno" }) }), !program ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Carregando…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border bg-muted/20 p-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-semibold",
									children: program.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatDateBR(program.start_date), program.end_date ? ` — ${formatDateBR(program.end_date)}` : ""] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap items-center gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary",
										children: CATEGORY_LABELS$3[program.category] ?? program.category
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-muted px-2 py-0.5 font-medium",
										children: LEVEL_LABELS$3[program.level] ?? program.level
									})]
								})
							]
						})]
					}),
					program.goals && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border bg-background p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5" }), " Objetivos"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm whitespace-pre-wrap",
							children: program.goals
						})]
					}),
					!program.show_to_student && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-state-pending/30 bg-state-pending-soft p-2 text-xs",
						children: [
							"⚠️ Esta rotina está marcada como ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "não visível" }),
							" ao aluno."
						]
					}),
					days.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Nenhum treino cadastrado."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: days.map((d) => {
							const dayExercises = exercises.filter((e) => e.training_day_id === d.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border bg-background p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: d.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
											children: d.day_label
										})]
									}),
									d.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 whitespace-pre-wrap text-sm text-muted-foreground",
										children: d.description
									}),
									dayExercises.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 space-y-2",
										children: dayExercises.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md border bg-muted/20 p-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-baseline justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium text-sm",
														children: ex.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted-foreground",
														children: [
															ex.sets_reps,
															ex.load,
															ex.rest_seconds ? `${ex.rest_seconds}s` : null
														].filter(Boolean).join(" · ")
													})]
												}),
												ex.media_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2 overflow-hidden rounded",
													children: ex.media_type === "youtube" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
														src: ex.media_url,
														className: "aspect-video w-full",
														allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
														allowFullScreen: true
													}) : ex.media_type === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
														src: ex.media_url,
														controls: true,
														className: "aspect-video w-full object-cover"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: ex.media_url,
														alt: ex.name,
														className: "aspect-video w-full object-cover"
													})
												}),
												ex.observations && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 whitespace-pre-wrap text-xs text-muted-foreground",
													children: ex.observations
												})
											]
										}, ex.id))
									})
								]
							}, d.id);
						})
					})
				]
			})]
		})
	});
}
function parseLoad(s) {
	if (!s) return null;
	const m = s.replace(",", ".").match(/-?\d+(?:\.\d+)?/);
	return m ? Number(m[0]) : null;
}
function LoadProgressionDialog({ open, onOpenChange, studentId }) {
	const [selected, setSelected] = (0, import_react.useState)("");
	const { data: programs = [] } = useQuery({
		queryKey: ["pt-progress-programs", studentId],
		enabled: open,
		queryFn: async () => {
			const { data } = await supabase.from("pt_programs").select("id,name,start_date").eq("pt_student_id", studentId).eq("is_deleted", false).order("start_date", { ascending: true });
			return data ?? [];
		}
	});
	const programIds = programs.map((p) => p.id);
	const { data: days = [] } = useQuery({
		queryKey: ["pt-progress-days", programIds.join(",")],
		enabled: open && programIds.length > 0,
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_days").select("id,program_id,name").in("program_id", programIds);
			return data ?? [];
		}
	});
	const dayIds = days.map((d) => d.id);
	const { data: exercises = [] } = useQuery({
		queryKey: ["pt-progress-ex", dayIds.join(",")],
		enabled: open && dayIds.length > 0,
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_exercises").select("id,name,load,training_day_id,created_at").in("training_day_id", dayIds);
			return data ?? [];
		}
	});
	const options = (0, import_react.useMemo)(() => {
		const dayToProgram = new Map(days.map((d) => [d.id, d.program_id]));
		const programById = new Map(programs.map((p) => [p.id, p]));
		const byName = /* @__PURE__ */ new Map();
		for (const ex of exercises) {
			const load = parseLoad(ex.load);
			if (load == null) continue;
			const programId = dayToProgram.get(ex.training_day_id);
			const program = programId ? programById.get(programId) : null;
			if (!program) continue;
			const key = ex.name.trim().toLowerCase();
			if (!byName.has(key)) byName.set(key, {
				name: ex.name.trim(),
				points: []
			});
			byName.get(key).points.push({
				date: program.start_date,
				label: `${program.name} (${formatDateBR(program.start_date)})`,
				load,
				raw: ex.load ?? ""
			});
		}
		for (const g of byName.values()) g.points.sort((a, b) => a.date.localeCompare(b.date));
		return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name));
	}, [
		exercises,
		days,
		programs
	]).filter((g) => g.points.length >= 1);
	const currentKey = selected || options[0]?.name || "";
	const current = options.find((g) => g.name === currentKey) ?? null;
	const chartData = current?.points.map((p, i) => ({
		idx: i,
		label: p.label,
		date: formatDateBR(p.date),
		load: p.load,
		raw: p.raw
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Evolução de cargas" }) }), options.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-6 w-6" }),
				title: "Sem cargas registradas",
				description: "Adicione o campo 'Carga' em pelo menos um exercício com valor numérico (ex: 60kg) para ver a progressão."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: "Exercício:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: currentKey,
						onValueChange: setSelected,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "max-w-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: o.name,
							children: [
								o.name,
								" (",
								o.points.length,
								" registros)"
							]
						}, o.name)) })]
					})]
				}), current && chartData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 w-full rounded-lg border bg-muted/10 p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: chartData,
							margin: {
								top: 8,
								right: 16,
								left: 0,
								bottom: 8
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									opacity: .3
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "date",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (v) => [`${v}`, "Carga"],
									labelFormatter: (_l, payload) => (payload?.[0]?.payload)?.label ?? ""
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "load",
									stroke: "var(--color-primary)",
									strokeWidth: 2,
									dot: { r: 4 }
								})
							]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/40 text-xs uppercase text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-left",
									children: "Rotina"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-left",
									children: "Carga registrada"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2 text-right",
									children: "Valor"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: current.points.map((p, i) => {
							const prev = i > 0 ? current.points[i - 1].load : null;
							const delta = prev != null ? p.load - prev : null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2",
										children: p.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2 text-muted-foreground",
										children: p.raw
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-2 text-right font-medium",
										children: [p.load, delta != null && delta !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `ml-2 text-xs ${delta > 0 ? "text-state-paid" : "text-destructive"}`,
											children: [
												delta > 0 ? "▲" : "▼",
												" ",
												Math.abs(delta)
											]
										})]
									})
								]
							}, i);
						}) })]
					})
				})] })]
			})]
		})
	});
}
var InputSchema$1 = object({
	programId: string().uuid(),
	prompt: string().min(3).max(4e3)
});
var prescribeTrainingWithAi = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => InputSchema$1.parse(raw)).handler(createSsrRpc("f874d9df14d72bd20ca761cdb07ada8f110a8ab965d7484cd9343d6dbb74c372"));
function AiPrescribeDialog({ open, onOpenChange, programId }) {
	const qc = useQueryClient();
	const prescribeFn = useServerFn(prescribeTrainingWithAi);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [applying, setApplying] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	async function generate() {
		if (!programId) return;
		if (prompt.trim().length < 5) return toast.error("Descreva o que a IA deve gerar.");
		setLoading(true);
		setResult(null);
		try {
			setResult(await prescribeFn({ data: {
				programId,
				prompt: prompt.trim()
			} }));
		} catch (e) {
			toast.error(e?.message ?? "Falha ao gerar prescrição");
		} finally {
			setLoading(false);
		}
	}
	async function apply() {
		if (!programId || !result?.days?.length) return;
		setApplying(true);
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) {
			setApplying(false);
			return;
		}
		try {
			for (const [i, day] of result.days.entries()) {
				const { data: inserted, error } = await supabase.from("pt_training_days").insert({
					user_id: userId,
					program_id: programId,
					name: day.name,
					day_label: day.day_label,
					description: day.description ?? null,
					sort_order: 1e3 + i
				}).select("id").single();
				if (error) throw new Error(error.message);
				const dayId = inserted.id;
				if (day.exercises?.length) {
					const rows = day.exercises.map((ex, idx) => ({
						user_id: userId,
						training_day_id: dayId,
						name: ex.name,
						series_type: ex.series_type ?? "reps_load",
						sets_reps: ex.sets_reps ?? null,
						load: ex.load ?? null,
						time_seconds: ex.time_seconds ?? null,
						inclination: ex.inclination ?? null,
						pace: ex.pace ?? null,
						cadence: ex.cadence ?? null,
						rest_seconds: ex.rest_seconds ?? null,
						observations: ex.observations ?? null,
						sort_order: idx
					}));
					const { error: exErr } = await supabase.from("pt_training_exercises").insert(rows);
					if (exErr) throw new Error(exErr.message);
				}
			}
			await supabase.from("pt_programs").update({
				ai_prompt: prompt.trim(),
				ai_generated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", programId);
			toast.success("Prescrição aplicada à rotina");
			qc.invalidateQueries({ queryKey: ["pt-training-days", programId] });
			qc.invalidateQueries({ queryKey: ["pt-programs"] });
			onOpenChange(false);
			setResult(null);
			setPrompt("");
		} catch (e) {
			toast.error(e?.message ?? "Falha ao aplicar prescrição");
		} finally {
			setApplying(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-primary" }), " Prescrever com IA"]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Instruções para a IA" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 4,
									value: prompt,
									onChange: (e) => setPrompt(e.target.value),
									placeholder: "Ex: Divida em 4 treinos (A, B, C, D) focando peito+tríceps, costas+bíceps, pernas e ombros+abdômen. Priorize exercícios compostos, 4 séries de 8 a 12 reps."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "A IA usa a categoria, nível e objetivos definidos na rotina."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: generate,
							disabled: loading,
							className: "w-full sm:w-auto",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Gerando…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Gerar prescrição"] })
						}),
						result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 rounded-lg border bg-muted/20 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-semibold",
									children: [
										"Prévia (",
										result.days.length,
										" treinos)"
									]
								}),
								result.days.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border bg-background p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: d.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
												children: d.day_label
											})]
										}),
										d.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted-foreground",
											children: d.description
										}),
										d.exercises?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-2 space-y-1 text-sm",
											children: d.exercises.map((ex, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex flex-wrap justify-between gap-2 border-t pt-1 first:border-t-0 first:pt-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: ex.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted-foreground",
														children: [
															ex.sets_reps,
															ex.load,
															ex.rest_seconds ? `${ex.rest_seconds}s` : null
														].filter(Boolean).join(" · ")
													}),
													ex.observations && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "w-full text-xs text-muted-foreground",
														children: ex.observations
													})
												]
											}, j))
										}) : null
									]
								}, i)),
								result.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-md border-l-2 border-primary/40 bg-background p-2 text-xs italic text-muted-foreground",
									children: result.notes
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Fechar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: apply,
					disabled: !result || applying,
					children: applying ? "Aplicando…" : "Adicionar treinos à rotina"
				})] })
			]
		})
	});
}
function relativeTime(iso) {
	const then = new Date(iso).getTime();
	const diff = Math.max(0, Date.now() - then);
	const min = Math.floor(diff / 6e4);
	if (min < 1) return "agora";
	if (min < 60) return `há ${min} min`;
	const hrs = Math.floor(min / 60);
	if (hrs < 24) return `há ${hrs} h`;
	const days = Math.floor(hrs / 24);
	if (days === 1) return "ontem";
	if (days < 30) return `há ${days} dias`;
	const months = Math.floor(days / 30);
	if (months < 12) return `há ${months} ${months === 1 ? "mês" : "meses"}`;
	const years = Math.floor(months / 12);
	return `há ${years} ${years === 1 ? "ano" : "anos"}`;
}
function AiPromptPopover({ prompt, generatedAt }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function copy() {
		try {
			await navigator.clipboard.writeText(prompt);
			setCopied(true);
			toast.success("Prompt copiado");
			setTimeout(() => setCopied(false), 1500);
		} catch {
			toast.error("Não foi possível copiar");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: [
				"group flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary",
				"transition-all duration-200 hover:bg-primary/15 hover:border-primary/50",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				"active:scale-[0.98]"
			].join(" "),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
				className: "h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110",
				strokeWidth: 2.25
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ver prompt IA" })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
		align: "end",
		sideOffset: 8,
		className: "w-[min(22rem,calc(100vw-2rem))] p-0 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2 border-b bg-primary/5 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-3.5 w-3.5",
						strokeWidth: 2.25
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold leading-tight",
						children: "Prompt usado"
					}), generatedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-0.5 text-[11px] text-muted-foreground",
						children: ["Gerado ", relativeTime(generatedAt)]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				variant: "ghost",
				onClick: copy,
				className: "h-7 gap-1 px-2 text-xs",
				children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Copiado"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), " Copiar"] })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-72 overflow-y-auto px-4 py-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "whitespace-pre-wrap break-words border-l-2 border-primary/40 bg-muted/40 pl-3 py-1 font-sans text-sm leading-relaxed text-foreground",
				children: prompt
			})
		})]
	})] });
}
var InputSchema = object({
	programId: string().uuid(),
	targetStudentId: string().uuid(),
	mode: _enum(["copy", "move"])
});
var migrateProgram = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => InputSchema.parse(raw)).handler(createSsrRpc("d6e01b43e3732610c1d0371e104688cd060f4832d9bb52ac7cfc2a3ac3cb2b3e"));
function MigrateProgramDialog({ open, onOpenChange, programId, programName, currentStudentId, onMigrated }) {
	const qc = useQueryClient();
	const migrateFn = useServerFn(migrateProgram);
	const [mode, setMode] = (0, import_react.useState)("copy");
	const [search, setSearch] = (0, import_react.useState)("");
	const [targetId, setTargetId] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const { data: students = [], isLoading } = useQuery({
		queryKey: ["pt-students-picker"],
		enabled: open,
		staleTime: 3e4,
		queryFn: async () => {
			const { data } = await supabase.from("pt_students").select("id,name,status").order("name", { ascending: true });
			return data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		const list = students.filter((s) => s.id !== currentStudentId);
		if (!q) return list;
		return list.filter((s) => s.name.toLowerCase().includes(q));
	}, [
		students,
		search,
		currentStudentId
	]);
	async function confirm() {
		if (!programId) return;
		if (!targetId) return toast.error("Selecione um aluno de destino.");
		setSaving(true);
		try {
			const res = await migrateFn({ data: {
				programId,
				targetStudentId: targetId,
				mode
			} });
			toast.success(mode === "copy" ? `Rotina copiada para ${res.targetName}` : `Rotina movida para ${res.targetName}`);
			qc.invalidateQueries({ queryKey: ["pt-programs"] });
			onMigrated?.(targetId, mode);
			onOpenChange(false);
			setTargetId(null);
			setSearch("");
			setMode("copy");
		} catch (e) {
			toast.error(e?.message ?? "Falha ao migrar rotina");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg gap-0 p-0 overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "space-y-2 border-b p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, {
								className: "h-4.5 w-4.5",
								strokeWidth: 2.25
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-base font-semibold leading-tight",
								children: "Migrar rotina"
							}), programName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 truncate text-xs text-muted-foreground",
								children: programName
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-xs font-medium text-muted-foreground",
						children: "Como migrar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
							active: mode === "copy",
							onClick: () => setMode("copy"),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }),
							label: "Copiar",
							hint: "Duplica no destino",
							tone: "primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
							active: mode === "move",
							onClick: () => setMode("move"),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Move, { className: "h-4 w-4" }),
							label: "Mover",
							hint: "Remove do atual",
							tone: "destructive"
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Aluno de destino"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: "Buscar aluno…",
									className: "pl-9"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-64 overflow-y-auto rounded-lg border bg-background",
								children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Carregando…"]
								}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-6 text-center text-sm text-muted-foreground",
									children: "Nenhum aluno encontrado."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "divide-y",
									children: filtered.map((s) => {
										const selected = targetId === s.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setTargetId(s.id),
											className: [
												"flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150",
												"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
												selected ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-accent"
											].join(" "),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "truncate text-sm font-medium",
														children: s.name
													}), s.status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-0.5 text-xs capitalize text-muted-foreground",
														children: s.status
													})]
												}),
												selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
														className: "h-3 w-3",
														strokeWidth: 3
													})
												})
											]
										}) }, s.id);
									})
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "border-t bg-muted/30 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => onOpenChange(false),
						disabled: saving,
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: confirm,
						disabled: !targetId || saving,
						variant: mode === "move" ? "destructive" : "default",
						className: "min-w-32",
						children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), mode === "copy" ? "Copiando…" : "Movendo…"] }) : mode === "copy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), " Copiar rotina"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Move, { className: "h-4 w-4" }), " Mover rotina"] })
					})]
				})
			]
		})
	});
}
function ModeButton({ active, onClick, icon, label, hint, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: [
			"group flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all duration-200",
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			active ? tone === "primary" ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30" : "border-destructive/60 bg-destructive/10 text-foreground ring-1 ring-destructive/30" : "border-border bg-background hover:border-foreground/20 hover:bg-accent"
		].join(" "),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: ["flex h-7 w-7 items-center justify-center rounded-md transition-colors", active ? tone === "primary" ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground group-hover:text-foreground"].join(" "),
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
var ASPECTS = {
	"1:1": {
		label: "Quadrado",
		hint: "1:1 · feed",
		ratio: 1,
		cols: 12,
		rows: 12
	},
	"4:5": {
		label: "Retrato",
		hint: "4:5 · post",
		ratio: 4 / 5,
		cols: 12,
		rows: 15
	},
	"9:16": {
		label: "Story",
		hint: "9:16 · stories",
		ratio: 9 / 16,
		cols: 12,
		rows: 21
	},
	a4: {
		label: "Ficha A4",
		hint: "210×297 · impressão",
		ratio: 210 / 297,
		cols: 12,
		rows: 17
	}
};
var BLOCK_META = {
	header: {
		label: "Cabeçalho",
		description: "Nome da rotina + aluno"
	},
	meta: {
		label: "Período & nível",
		description: "Datas, categoria e nível"
	},
	goals: {
		label: "Objetivos",
		description: "Texto de objetivos da rotina"
	},
	day: {
		label: "Treino",
		description: "Um dia de treino com exercícios"
	},
	notes: {
		label: "Observações",
		description: "Espaço livre de anotações"
	},
	brand: {
		label: "Assinatura",
		description: "Marca / nome do treinador"
	}
};
var PRESETS = [
	"compacto",
	"cartaz",
	"ficha"
];
var PRESET_META = {
	compacto: {
		label: "Compacto",
		description: "Cabeçalho enxuto e treinos em duas colunas"
	},
	cartaz: {
		label: "Cartaz",
		description: "Cabeçalho grande, treinos empilhados"
	},
	ficha: {
		label: "Ficha A4",
		description: "Documento vertical para impressão"
	}
};
var KEY = (programId) => `pt:layout:${programId}`;
function clampBlock(b, cols, rows) {
	const w = Math.max(2, Math.min(cols, Math.round(b.w)));
	const h = Math.max(1, Math.min(rows, Math.round(b.h)));
	return {
		...b,
		w,
		h,
		x: Math.max(0, Math.min(cols - w, Math.round(b.x))),
		y: Math.max(0, Math.min(rows - h, Math.round(b.y)))
	};
}
function overlaps(a, b) {
	return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}
function hasCollision(block, blocks) {
	return blocks.some((o) => o.id !== block.id && overlaps(block, o));
}
/** Primeiro retângulo livre com o tamanho pedido, varrendo de cima para baixo. */
function findFreeSlot(blocks, w, h, cols, rows) {
	for (let y = 0; y <= rows - h; y++) for (let x = 0; x <= cols - w; x++) if (!hasCollision({
		id: "__probe",
		type: "notes",
		x,
		y,
		w,
		h
	}, blocks)) return {
		x,
		y
	};
	return null;
}
function buildPreset(preset, days) {
	const dayList = days.slice(0, 6);
	if (preset === "cartaz") {
		const rows = ASPECTS["4:5"].rows;
		const blocks = [{
			id: "header",
			type: "header",
			x: 0,
			y: 0,
			w: 12,
			h: 3
		}, {
			id: "meta",
			type: "meta",
			x: 0,
			y: 3,
			w: 12,
			h: 2
		}];
		let y = 5;
		const per = Math.max(2, Math.floor((rows - 6) / Math.max(1, dayList.length)));
		dayList.forEach((d) => {
			if (y + per > rows - 1) return;
			blocks.push({
				id: `day-${d.id}`,
				type: "day",
				dayId: d.id,
				x: 0,
				y,
				w: 12,
				h: per
			});
			y += per;
		});
		blocks.push({
			id: "brand",
			type: "brand",
			x: 0,
			y: rows - 1,
			w: 12,
			h: 1
		});
		return {
			aspect: "4:5",
			blocks
		};
	}
	if (preset === "ficha") {
		const rows = ASPECTS.a4.rows;
		const blocks = [
			{
				id: "header",
				type: "header",
				x: 0,
				y: 0,
				w: 12,
				h: 2
			},
			{
				id: "meta",
				type: "meta",
				x: 0,
				y: 2,
				w: 7,
				h: 2
			},
			{
				id: "goals",
				type: "goals",
				x: 7,
				y: 2,
				w: 5,
				h: 2
			}
		];
		let y = 4;
		const per = Math.max(2, Math.floor((rows - 5) / Math.max(1, dayList.length)));
		dayList.forEach((d) => {
			if (y + per > rows - 1) return;
			blocks.push({
				id: `day-${d.id}`,
				type: "day",
				dayId: d.id,
				x: 0,
				y,
				w: 12,
				h: per
			});
			y += per;
		});
		blocks.push({
			id: "brand",
			type: "brand",
			x: 0,
			y: rows - 1,
			w: 12,
			h: 1
		});
		return {
			aspect: "a4",
			blocks
		};
	}
	const rows = ASPECTS["1:1"].rows;
	const blocks = [{
		id: "header",
		type: "header",
		x: 0,
		y: 0,
		w: 8,
		h: 2
	}, {
		id: "meta",
		type: "meta",
		x: 8,
		y: 0,
		w: 4,
		h: 2
	}];
	const per = Math.max(2, Math.floor((rows - 3) / Math.max(1, Math.ceil(dayList.length / 2))));
	dayList.forEach((d, i) => {
		const col = i % 2;
		const y = 2 + Math.floor(i / 2) * per;
		if (y + per > rows - 1) return;
		blocks.push({
			id: `day-${d.id}`,
			type: "day",
			dayId: d.id,
			x: col * 6,
			y,
			w: 6,
			h: per
		});
	});
	blocks.push({
		id: "brand",
		type: "brand",
		x: 0,
		y: rows - 1,
		w: 12,
		h: 1
	});
	return {
		aspect: "1:1",
		blocks
	};
}
function loadLayout(programId) {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(KEY(programId));
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed?.aspect || !Array.isArray(parsed.blocks)) return null;
		if (!ASPECTS[parsed.aspect]) return null;
		return parsed;
	} catch {
		return null;
	}
}
function saveLayout(programId, layout) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(KEY(programId), JSON.stringify(layout));
	} catch {}
}
function clearLayout(programId) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(KEY(programId));
	} catch {}
}
var CATEGORY_LABELS$2 = {
	hypertrophy: "Hipertrofia",
	conditioning: "Condicionamento",
	strength: "Força",
	cardio: "Cardio",
	general: "Geral"
};
var LEVEL_LABELS$2 = {
	beginner: "Iniciante",
	intermediate: "Intermediário",
	advanced: "Avançado"
};
async function fetchProgramRenderData(programId, studentName) {
	const { data: program } = await supabase.from("pt_programs").select("*").eq("id", programId).maybeSingle();
	if (!program) throw new Error("Rotina não encontrada");
	const { data: days = [] } = await supabase.from("pt_training_days").select("*").eq("program_id", programId).order("sort_order", { ascending: true }).order("created_at", { ascending: true });
	const dayIds = days.map((d) => d.id);
	const { data: exercises = [] } = dayIds.length ? await supabase.from("pt_training_exercises").select("*").in("training_day_id", dayIds).order("sort_order", { ascending: true }).order("created_at", { ascending: true }) : { data: [] };
	return {
		program,
		studentName,
		days: days.map((d) => ({
			id: d.id,
			name: d.name,
			day_label: d.day_label,
			description: d.description ?? null,
			exercises: exercises.filter((e) => e.training_day_id === d.id).map((e) => ({
				name: e.name ?? "",
				sets_reps: e.sets_reps ?? null,
				load: e.load ?? null,
				rest_seconds: e.rest_seconds ?? null
			}))
		}))
	};
}
function token(styles, name, fallback) {
	return styles.getPropertyValue(name).trim() || fallback;
}
function readThemeColors() {
	if (typeof window === "undefined") return {
		background: "#ffffff",
		card: "#ffffff",
		foreground: "#18181b",
		muted: "#f4f4f5",
		mutedForeground: "#71717a",
		primary: "#2563eb",
		primaryForeground: "#ffffff",
		border: "#e4e4e7"
	};
	const s = getComputedStyle(document.documentElement);
	return {
		background: token(s, "--background", "#ffffff"),
		card: token(s, "--card", "#ffffff"),
		foreground: token(s, "--foreground", "#18181b"),
		muted: token(s, "--muted", "#f4f4f5"),
		mutedForeground: token(s, "--muted-foreground", "#71717a"),
		primary: token(s, "--primary", "#2563eb"),
		primaryForeground: token(s, "--primary-foreground", "#ffffff"),
		border: token(s, "--border", "#e4e4e7")
	};
}
var FONT = (weight, size) => `${weight} ${size}px Inter, ui-sans-serif, system-ui, sans-serif`;
function roundRect(ctx, x, y, w, h, r) {
	const rr = Math.min(r, w / 2, h / 2);
	ctx.beginPath();
	ctx.moveTo(x + rr, y);
	ctx.arcTo(x + w, y, x + w, y + h, rr);
	ctx.arcTo(x + w, y + h, x, y + h, rr);
	ctx.arcTo(x, y + h, x, y, rr);
	ctx.arcTo(x, y, x + w, y, rr);
	ctx.closePath();
}
function wrap(ctx, text, maxWidth) {
	const words = text.split(/\s+/).filter(Boolean);
	const lines = [];
	let line = "";
	for (const w of words) {
		const test = line ? `${line} ${w}` : w;
		if (ctx.measureText(test).width > maxWidth && line) {
			lines.push(line);
			line = w;
		} else line = test;
	}
	if (line) lines.push(line);
	return lines;
}
function ellipsize(ctx, text, maxWidth) {
	if (ctx.measureText(text).width <= maxWidth) return text;
	let t = text;
	while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) t = t.slice(0, -1);
	return `${t}…`;
}
/** Desenha linhas dentro do bloco; devolve true se o conteúdo coube inteiro. */
function drawLines(ctx, lines, x, y, maxW, bottom, lineHeight) {
	let cy = y;
	for (let i = 0; i < lines.length; i++) {
		if (cy + lineHeight > bottom) return {
			y: cy,
			overflow: true
		};
		ctx.fillText(ellipsize(ctx, lines[i], maxW), x, cy + lineHeight * .78);
		cy += lineHeight;
	}
	return {
		y: cy,
		overflow: false
	};
}
function renderProgramLayout(canvas, data, layout, theme, width = 1080) {
	const spec = ASPECTS[layout.aspect];
	const height = Math.round(width / spec.ratio);
	const dpr = 1;
	canvas.width = width * dpr;
	canvas.height = height * dpr;
	const ctx = canvas.getContext("2d");
	if (!ctx) return {};
	ctx.scale(dpr, dpr);
	ctx.textBaseline = "alphabetic";
	const pad = Math.round(width * .035);
	const gap = Math.round(width * .014);
	const cellW = (width - pad * 2 - gap * (spec.cols - 1)) / spec.cols;
	const cellH = (height - pad * 2 - gap * (spec.rows - 1)) / spec.rows;
	ctx.fillStyle = theme.background;
	ctx.fillRect(0, 0, width, height);
	const overflow = {};
	for (const block of layout.blocks) {
		const x = pad + block.x * (cellW + gap);
		const y = pad + block.y * (cellH + gap);
		const w = block.w * cellW + (block.w - 1) * gap;
		const h = block.h * cellH + (block.h - 1) * gap;
		overflow[block.id] = drawBlock(ctx, block, data, theme, x, y, w, h, width);
	}
	return overflow;
}
function drawBlock(ctx, block, data, theme, x, y, w, h, base) {
	const scale = base / 1080;
	const padX = 26 * scale;
	const padY = 22 * scale;
	const innerW = w - padX * 2;
	const bottom = y + h - padY;
	const isHeader = block.type === "header";
	ctx.save();
	roundRect(ctx, x, y, w, h, 22 * scale);
	ctx.fillStyle = isHeader ? theme.primary : theme.card;
	ctx.fill();
	if (!isHeader) {
		ctx.strokeStyle = theme.border;
		ctx.lineWidth = 1.5 * scale;
		ctx.stroke();
	}
	ctx.clip();
	const fg = isHeader ? theme.primaryForeground : theme.foreground;
	const dim = isHeader ? theme.primaryForeground : theme.mutedForeground;
	let cy = y + padY;
	let over = false;
	const label = (text) => {
		ctx.font = FONT(600, 15 * scale);
		ctx.fillStyle = dim;
		ctx.globalAlpha = isHeader ? .82 : 1;
		ctx.fillText(text.toUpperCase(), x + padX, cy + 12 * scale);
		ctx.globalAlpha = 1;
		cy += 26 * scale;
	};
	if (block.type === "header") {
		ctx.font = FONT(800, 52 * scale);
		ctx.fillStyle = fg;
		const lines = wrap(ctx, data.program.name || "Rotina de treino", innerW);
		const r = drawLines(ctx, lines.slice(0, 2), x + padX, cy, innerW, bottom, 58 * scale);
		cy = r.y + 8 * scale;
		over = over || r.overflow || lines.length > 2;
		if (data.studentName) {
			ctx.font = FONT(500, 26 * scale);
			ctx.globalAlpha = .85;
			const r2 = drawLines(ctx, [data.studentName], x + padX, cy, innerW, bottom, 34 * scale);
			ctx.globalAlpha = 1;
			over = over || r2.overflow;
		}
	} else if (block.type === "meta") {
		label("Período");
		const period = `${formatDateBR(data.program.start_date)}${data.program.end_date ? ` — ${formatDateBR(data.program.end_date)}` : ""}`;
		ctx.font = FONT(700, 24 * scale);
		ctx.fillStyle = fg;
		const r = drawLines(ctx, wrap(ctx, period, innerW), x + padX, cy, innerW, bottom, 30 * scale);
		cy = r.y + 6 * scale;
		over = over || r.overflow;
		ctx.font = FONT(500, 21 * scale);
		ctx.fillStyle = dim;
		const r2 = drawLines(ctx, wrap(ctx, `${CATEGORY_LABELS$2[data.program.category] ?? data.program.category} · ${LEVEL_LABELS$2[data.program.level] ?? data.program.level}`, innerW), x + padX, cy, innerW, bottom, 28 * scale);
		over = over || r2.overflow;
	} else if (block.type === "goals") {
		label("Objetivos");
		ctx.font = FONT(500, 22 * scale);
		ctx.fillStyle = fg;
		const r = drawLines(ctx, wrap(ctx, data.program.goals || "—", innerW), x + padX, cy, innerW, bottom, 30 * scale);
		over = over || r.overflow;
	} else if (block.type === "notes") {
		label("Observações");
		ctx.font = FONT(500, 21 * scale);
		ctx.fillStyle = dim;
		const lineH = 34 * scale;
		let ly = cy + lineH * .9;
		ctx.strokeStyle = theme.border;
		ctx.lineWidth = 1.2 * scale;
		while (ly < bottom) {
			ctx.beginPath();
			ctx.moveTo(x + padX, ly);
			ctx.lineTo(x + w - padX, ly);
			ctx.stroke();
			ly += lineH;
		}
	} else if (block.type === "brand") {
		ctx.font = FONT(600, 20 * scale);
		ctx.fillStyle = dim;
		const text = data.studentName ? `${data.program.name} · ${data.studentName}` : data.program.name;
		ctx.fillText(ellipsize(ctx, text, innerW), x + padX, y + h / 2 + 7 * scale);
	} else if (block.type === "day") {
		const day = data.days.find((d) => d.id === block.dayId);
		if (!day) {
			ctx.font = FONT(500, 20 * scale);
			ctx.fillStyle = dim;
			ctx.fillText("Treino removido", x + padX, cy + 16 * scale);
		} else {
			ctx.font = FONT(700, 17 * scale);
			const chipText = day.day_label.toUpperCase();
			const chipW = ctx.measureText(chipText).width + 22 * scale;
			const chipH = 30 * scale;
			roundRect(ctx, x + padX, cy, chipW, chipH, chipH / 2);
			ctx.fillStyle = theme.primary;
			ctx.fill();
			ctx.fillStyle = theme.primaryForeground;
			ctx.fillText(chipText, x + padX + 11 * scale, cy + chipH * .68);
			ctx.font = FONT(700, 27 * scale);
			ctx.fillStyle = fg;
			ctx.fillText(ellipsize(ctx, day.name, innerW - chipW - 14 * scale), x + padX + chipW + 14 * scale, cy + chipH * .76);
			cy += chipH + 16 * scale;
			for (const ex of day.exercises) {
				if (cy + 26 * scale > bottom) {
					over = true;
					break;
				}
				ctx.font = FONT(600, 21 * scale);
				ctx.fillStyle = fg;
				const right = [
					ex.sets_reps,
					ex.load,
					ex.rest_seconds ? `${ex.rest_seconds}s` : null
				].filter(Boolean).join(" · ");
				ctx.font = FONT(500, 19 * scale);
				const rightW = right ? ctx.measureText(right).width + 16 * scale : 0;
				ctx.font = FONT(600, 21 * scale);
				ctx.fillText(ellipsize(ctx, ex.name, innerW - rightW), x + padX, cy + 18 * scale);
				if (right) {
					ctx.font = FONT(500, 19 * scale);
					ctx.fillStyle = dim;
					ctx.textAlign = "right";
					ctx.fillText(right, x + w - padX, cy + 18 * scale);
					ctx.textAlign = "left";
				}
				cy += 30 * scale;
			}
			if (day.exercises.length === 0) {
				ctx.font = FONT(500, 19 * scale);
				ctx.fillStyle = dim;
				ctx.fillText("Sem exercícios", x + padX, cy + 16 * scale);
			}
		}
	}
	ctx.restore();
	return over;
}
function safeName(name) {
	return (name || "rotina").replace(/[^\w\-]+/g, "_");
}
async function exportLayoutPng(data, layout) {
	const canvas = document.createElement("canvas");
	renderProgramLayout(canvas, data, layout, readThemeColors(), 1440);
	const url = canvas.toDataURL("image/png");
	const a = document.createElement("a");
	a.href = url;
	a.download = `${safeName(data.program.name)}.png`;
	a.click();
}
async function exportLayoutPdf(data, layout) {
	const canvas = document.createElement("canvas");
	renderProgramLayout(canvas, data, layout, readThemeColors(), 1600);
	const { jsPDF } = await import("../_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const ratio = canvas.width / canvas.height;
	const doc = new jsPDF({
		unit: "pt",
		orientation: ratio > 1 ? "landscape" : "portrait",
		format: [595, Math.round(595 / ratio)]
	});
	doc.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 595, Math.round(595 / ratio));
	doc.save(`${safeName(data.program.name)}-layout.pdf`);
}
function ProgramLayoutEditor({ open, onOpenChange, programId, studentName }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [layout, setLayout] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [overflow, setOverflow] = (0, import_react.useState)({});
	const [exporting, setExporting] = (0, import_react.useState)(null);
	const gridRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const dragRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!open || !programId) return;
		let cancelled = false;
		setLoading(true);
		fetchProgramRenderData(programId, studentName).then((d) => {
			if (cancelled) return;
			setData(d);
			setLayout(loadLayout(programId) ?? buildPreset("compacto", d.days));
		}).catch((e) => toast.error(e?.message ?? "Falha ao carregar a rotina")).finally(() => !cancelled && setLoading(false));
		return () => {
			cancelled = true;
		};
	}, [
		open,
		programId,
		studentName
	]);
	(0, import_react.useEffect)(() => {
		if (!programId || !layout || !data) return;
		saveLayout(programId, layout);
		const id = window.setTimeout(() => {
			if (canvasRef.current) setOverflow(renderProgramLayout(canvasRef.current, data, layout, readThemeColors(), 900));
		}, 60);
		return () => window.clearTimeout(id);
	}, [
		layout,
		data,
		programId
	]);
	const spec = layout ? ASPECTS[layout.aspect] : ASPECTS["1:1"];
	const usedDayIds = (0, import_react.useMemo)(() => new Set((layout?.blocks ?? []).filter((b) => b.type === "day").map((b) => b.dayId)), [layout]);
	const usedTypes = (0, import_react.useMemo)(() => new Set((layout?.blocks ?? []).map((b) => b.type)), [layout]);
	const update = (0, import_react.useCallback)((fn) => {
		setLayout((prev) => prev ? fn(prev) : prev);
	}, []);
	function addBlock(type, dayId) {
		if (!layout) return;
		const w = type === "day" ? 6 : 12;
		const h = type === "brand" ? 1 : type === "day" ? 4 : 2;
		const slot = findFreeSlot(layout.blocks, w, h, spec.cols, spec.rows) ?? findFreeSlot(layout.blocks, Math.min(w, 6), 2, spec.cols, spec.rows);
		if (!slot) {
			toast.error("Sem espaço livre. Reduza um bloco ou troque o formato.");
			return;
		}
		const id = dayId ? `day-${dayId}` : type;
		update((l) => ({
			...l,
			blocks: [...l.blocks, {
				id,
				type,
				dayId,
				...slot,
				w,
				h
			}]
		}));
		setSelected(id);
	}
	function removeBlock(id) {
		update((l) => ({
			...l,
			blocks: l.blocks.filter((b) => b.id !== id)
		}));
		setSelected((s) => s === id ? null : s);
	}
	function applyPreset(preset) {
		if (!data) return;
		setLayout(buildPreset(preset, data.days));
		setSelected(null);
		toast.success(`Layout "${PRESET_META[preset].label}" aplicado`);
	}
	function changeAspect(aspect) {
		update((l) => {
			const next = ASPECTS[aspect];
			const blocks = [];
			for (const b of l.blocks) {
				const clamped = clampBlock(b, next.cols, next.rows);
				if (!hasCollision(clamped, blocks)) blocks.push(clamped);
				else {
					const slot = findFreeSlot(blocks, clamped.w, clamped.h, next.cols, next.rows);
					if (slot) blocks.push({
						...clamped,
						...slot
					});
				}
			}
			return {
				aspect,
				blocks
			};
		});
	}
	function nudge(id, dx, dy) {
		update((l) => {
			const b = l.blocks.find((x) => x.id === id);
			if (!b) return l;
			const moved = clampBlock({
				...b,
				x: b.x + dx,
				y: b.y + dy
			}, spec.cols, spec.rows);
			if (hasCollision(moved, l.blocks)) return l;
			return {
				...l,
				blocks: l.blocks.map((x) => x.id === id ? moved : x)
			};
		});
	}
	function beginDrag(e, block, mode) {
		e.preventDefault();
		e.stopPropagation();
		setSelected(block.id);
		dragRef.current = {
			mode,
			id: block.id,
			startX: e.clientX,
			startY: e.clientY,
			origin: block
		};
		e.target.setPointerCapture?.(e.pointerId);
	}
	function onPointerMove(e) {
		const drag = dragRef.current;
		const grid = gridRef.current;
		if (!drag || !grid || !layout) return;
		const rect = grid.getBoundingClientRect();
		const cw = rect.width / spec.cols;
		const ch = rect.height / spec.rows;
		const dx = Math.round((e.clientX - drag.startX) / cw);
		const dy = Math.round((e.clientY - drag.startY) / ch);
		if (dx === 0 && dy === 0) return;
		const o = drag.origin;
		const candidate = clampBlock(drag.mode === "move" ? {
			...o,
			x: o.x + dx,
			y: o.y + dy
		} : {
			...o,
			w: o.w + dx,
			h: o.h + dy
		}, spec.cols, spec.rows);
		if (hasCollision(candidate, layout.blocks)) return;
		update((l) => ({
			...l,
			blocks: l.blocks.map((b) => b.id === drag.id ? candidate : b)
		}));
	}
	function endDrag() {
		dragRef.current = null;
	}
	async function doExport(kind) {
		if (!data || !layout) return;
		setExporting(kind);
		try {
			if (kind === "png") await exportLayoutPng(data, layout);
			else await exportLayoutPdf(data, layout);
			toast.success(kind === "png" ? "Imagem gerada" : "PDF gerado");
		} catch (e) {
			toast.error(e?.message ?? "Falha ao exportar");
		} finally {
			setExporting(null);
		}
	}
	const overflowCount = Object.values(overflow).filter(Boolean).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[92vh] max-w-6xl overflow-y-auto p-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
				className: "space-y-1.5 border-b border-border px-5 py-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-lg font-semibold leading-tight tracking-tight",
					children: "Layout da imagem"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-sm leading-relaxed text-muted-foreground",
					children: "Escolha onde cada bloco fica na peça. Arraste para posicionar, use o canto para redimensionar — o conteúdo respeita os limites de cada bloco."
				})]
			}), loading || !layout || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-72 items-center justify-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Carregando rotina…"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: Object.keys(ASPECTS).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => changeAspect(key),
								className: cn("rounded-lg border px-3 py-1.5 text-xs font-medium outline-none transition-all duration-200", "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]", layout.aspect === key ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"),
								children: [ASPECTS[key].label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1.5 hidden text-[10px] opacity-70 sm:inline",
									children: ASPECTS[key].hint
								})]
							}, key))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: gridRef,
							onPointerMove,
							onPointerUp: endDrag,
							onPointerCancel: endDrag,
							className: "relative w-full touch-none select-none overflow-hidden rounded-xl border border-border bg-muted/30 p-0",
							style: { aspectRatio: String(spec.ratio) },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute inset-0 opacity-60",
								style: {
									backgroundImage: "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
									backgroundSize: `${100 / spec.cols}% ${100 / spec.rows}%`
								}
							}), layout.blocks.map((b) => {
								const isSel = selected === b.id;
								const isOver = overflow[b.id];
								const day = b.dayId ? data.days.find((d) => d.id === b.dayId) : null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									role: "button",
									tabIndex: 0,
									onKeyDown: (e) => {
										const d = {
											ArrowLeft: [-1, 0],
											ArrowRight: [1, 0],
											ArrowUp: [0, -1],
											ArrowDown: [0, 1]
										}[e.key];
										if (d) {
											e.preventDefault();
											nudge(b.id, d[0], d[1]);
										}
									},
									onPointerDown: (e) => beginDrag(e, b, "move"),
									className: cn("group absolute flex cursor-grab flex-col justify-between rounded-lg border p-2 outline-none transition-[box-shadow,border-color,background-color] duration-200", "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background", isSel ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card shadow-sm hover:border-primary/50 hover:shadow-md", isOver && "border-warning bg-warning/10"),
									style: {
										left: `${b.x / spec.cols * 100}%`,
										top: `${b.y / spec.rows * 100}%`,
										width: `${b.w / spec.cols * 100}%`,
										height: `${b.h / spec.rows * 100}%`,
										padding: 4
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex min-w-0 items-start gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "mt-px h-3 w-3 shrink-0 text-muted-foreground/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate text-[11px] font-semibold leading-tight text-foreground",
												children: day ? `${day.day_label} · ${day.name}` : BLOCK_META[b.type].label
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-1",
											children: [isOver ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1 truncate text-[10px] font-medium text-warning",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3 shrink-0" }), " conteúdo cortado"]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] tabular-nums text-muted-foreground",
												children: [
													b.w,
													"×",
													b.h
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onPointerDown: (e) => e.stopPropagation(),
												onClick: () => removeBlock(b.id),
												"aria-label": "Remover bloco",
												className: "rounded p-0.5 text-muted-foreground opacity-0 outline-none transition-opacity duration-150 hover:text-destructive focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											onPointerDown: (e) => beginDrag(e, b, "resize"),
											className: "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 cursor-se-resize rounded-sm border-b-2 border-r-2 border-primary/60 transition-colors duration-150 hover:border-primary",
											"aria-hidden": true
										})
									]
								}, b.id);
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => applyPreset(p),
								title: PRESET_META[p].description,
								className: "rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground outline-none transition-all duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]",
								children: PRESET_META[p].label
							}, p)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									if (!programId) return;
									clearLayout(programId);
									applyPreset("compacto");
								},
								className: "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Restaurar padrão"]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
									children: "Blocos disponíveis"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5",
									children: [
										"header",
										"meta",
										"goals",
										"notes",
										"brand"
									].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: usedTypes.has(t),
										onClick: () => addBlock(t),
										className: "flex items-center gap-1 rounded-lg border border-dashed border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground outline-none transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-background disabled:hover:text-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }),
											" ",
											BLOCK_META[t].label
										]
									}, t))
								}),
								data.days.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5 pt-1",
									children: data.days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: usedDayIds.has(d.id),
										onClick: () => addBlock("day", d.id),
										className: "flex max-w-full items-center gap-1 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2.5 py-1.5 text-xs font-medium text-primary outline-none transition-all duration-200 hover:border-primary hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "truncate",
											children: [
												d.day_label,
												" · ",
												d.name
											]
										})]
									}, d.id))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
									children: "Pré-visualização"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-hidden rounded-xl border border-border bg-muted/30 p-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
										ref: canvasRef,
										className: "h-auto w-full rounded-lg"
									})
								}),
								overflowCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-start gap-1.5 text-xs leading-relaxed text-warning",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
										overflowCount === 1 ? "1 bloco tem conteúdo além do espaço reservado." : `${overflowCount} blocos têm conteúdo além do espaço reservado.`,
										" ",
										"Aumente a altura para caber tudo."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
									children: "Exportar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => doExport("png"),
										disabled: exporting !== null,
										className: "justify-center gap-1.5 transition-all duration-200 active:scale-[0.98]",
										children: [exporting === "png" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImage, { className: "h-4 w-4" }), "PNG"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => doExport("pdf"),
										disabled: exporting !== null,
										className: "justify-center gap-1.5 transition-all duration-200 active:scale-[0.98]",
										children: [exporting === "pdf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), "PDF"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mt-0.5 h-3 w-3 shrink-0" }), "O layout fica salvo automaticamente para esta rotina neste dispositivo."]
								})
							]
						})
					]
				})]
			})]
		})
	});
}
var CATEGORY_LABELS$1 = {
	hypertrophy: "Hipertrofia",
	conditioning: "Condicionamento físico",
	strength: "Força",
	cardio: "Cardio",
	general: "Geral"
};
var LEVEL_LABELS$1 = {
	beginner: "Iniciante",
	intermediate: "Intermediário",
	advanced: "Avançado"
};
async function downloadProgramPdf(programId, studentName) {
	const { data: program } = await supabase.from("pt_programs").select("*").eq("id", programId).maybeSingle();
	if (!program) throw new Error("Rotina não encontrada");
	const p = program;
	const { data: days = [] } = await supabase.from("pt_training_days").select("*").eq("program_id", programId).order("sort_order", { ascending: true }).order("created_at", { ascending: true });
	const dayIds = days.map((d) => d.id);
	const { data: exercises = [] } = dayIds.length ? await supabase.from("pt_training_exercises").select("*").in("training_day_id", dayIds).order("sort_order", { ascending: true }).order("created_at", { ascending: true }) : { data: [] };
	const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("../_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())), import("../_libs/jspdf-autotable.mjs").then((n) => n.t)]);
	const doc = new jsPDF({
		unit: "pt",
		format: "a4"
	});
	const pageWidth = doc.internal.pageSize.getWidth();
	let y = 48;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(18);
	doc.text(p.name ?? "Rotina de treino", 40, y);
	y += 22;
	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.setTextColor(90);
	if (studentName) {
		doc.text(`Aluno: ${studentName}`, 40, y);
		y += 14;
	}
	const period = `${formatDateBR(p.start_date)}${p.end_date ? ` — ${formatDateBR(p.end_date)}` : ""}`;
	doc.text(`Período: ${period}`, 40, y);
	y += 14;
	doc.text(`Categoria: ${CATEGORY_LABELS$1[p.category] ?? p.category} · Nível: ${LEVEL_LABELS$1[p.level] ?? p.level}`, 40, y);
	y += 16;
	doc.setTextColor(0);
	if (p.goals) {
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		doc.text("Objetivos", 40, y);
		y += 14;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		const wrapped = doc.splitTextToSize(p.goals, pageWidth - 80);
		doc.text(wrapped, 40, y);
		y += wrapped.length * 12 + 8;
	}
	days.forEach((d) => {
		if (y > 720) {
			doc.addPage();
			y = 48;
		}
		doc.setFont("helvetica", "bold");
		doc.setFontSize(12);
		doc.text(`${d.name}  •  ${d.day_label}`, 40, y);
		y += 14;
		if (d.description) {
			doc.setFont("helvetica", "normal");
			doc.setFontSize(9);
			doc.setTextColor(90);
			const wrapped = doc.splitTextToSize(d.description, pageWidth - 80);
			doc.text(wrapped, 40, y);
			y += wrapped.length * 11 + 4;
			doc.setTextColor(0);
		}
		const dayExercises = exercises.filter((e) => e.training_day_id === d.id);
		if (dayExercises.length > 0) {
			autoTable(doc, {
				startY: y + 2,
				head: [[
					"Exercício",
					"Séries x Reps",
					"Carga",
					"Descanso",
					"Observações"
				]],
				body: dayExercises.map((ex) => [
					ex.name ?? "",
					ex.sets_reps ?? "",
					ex.load ?? "",
					ex.rest_seconds ? `${ex.rest_seconds}s` : "",
					ex.observations ?? ""
				]),
				styles: {
					fontSize: 9,
					cellPadding: 5
				},
				headStyles: { fillColor: [
					30,
					30,
					30
				] },
				margin: {
					left: 40,
					right: 40
				}
			});
			y = (doc.lastAutoTable?.finalY ?? y) + 16;
		} else {
			doc.setFont("helvetica", "italic");
			doc.setFontSize(9);
			doc.setTextColor(120);
			doc.text("Nenhum exercício adicionado.", 40, y);
			doc.setTextColor(0);
			y += 18;
		}
	});
	const filename = `${(p.name ?? "rotina").replace(/[^\w\-]+/g, "_")}.pdf`;
	doc.save(filename);
}
function Stepper({ steps, currentStep, onStepClick, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("w-full py-2", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			"aria-label": "Progresso das etapas",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex items-center justify-between gap-2",
				children: steps.map((step, index) => {
					const isCompleted = index < currentStep;
					const isActive = index === currentStep;
					const isClickable = Boolean(onStepClick && index <= currentStep);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("flex items-center flex-1 last:flex-initial", { "cursor-pointer": isClickable }),
						onClick: () => isClickable && onStepClick?.(index),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all select-none", isCompleted && "bg-primary text-primary-foreground ring-2 ring-primary/20", isActive && "border-2 border-primary bg-primary/10 text-primary font-bold ring-4 ring-primary/15", !isCompleted && !isActive && "border border-border bg-muted text-muted-foreground"),
								children: isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 stroke-[2.5]" }) : step.icon ? step.icon : index + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden sm:block text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("text-xs font-medium leading-none tracking-tight", isActive ? "text-foreground font-semibold" : isCompleted ? "text-foreground/90" : "text-muted-foreground"),
									children: step.title
								}), step.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-[10px] text-muted-foreground line-clamp-1",
									children: step.description
								})]
							})]
						}), index < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"aria-hidden": "true",
							className: cn("mx-2 sm:mx-4 h-0.5 flex-1 transition-colors", index < currentStep ? "bg-primary" : "bg-border/80")
						})]
					}, step.id || index);
				})
			})
		})
	});
}
function StepperFooter({ currentStep, totalSteps, onPrev, onNext, onFinish, isNextDisabled = false, isPrevDisabled = false, isLoading = false, nextLabel = "Próximo", prevLabel = "Voltar", finishLabel = "Concluir", className }) {
	const isLastStep = currentStep === totalSteps - 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center justify-between pt-4 border-t border-border/60", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "outline",
			onClick: onPrev,
			disabled: currentStep === 0 || isPrevDisabled || isLoading,
			children: prevLabel
		}), isLastStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			onClick: onFinish || onNext,
			disabled: isNextDisabled || isLoading,
			children: isLoading ? "Salvando..." : finishLabel
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			onClick: onNext,
			disabled: isNextDisabled || isLoading,
			children: nextLabel
		})]
	});
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
function ProgramsTab({ studentId }) {
	const qc = useQueryClient();
	const [view, setView] = (0, import_react.useState)("active");
	const [programOpen, setProgramOpen] = (0, import_react.useState)(false);
	const [editingProgram, setEditingProgram] = (0, import_react.useState)(null);
	const [dayOpen, setDayOpen] = (0, import_react.useState)(false);
	const [layoutOpen, setLayoutOpen] = (0, import_react.useState)(false);
	const [editingDay, setEditingDay] = (0, import_react.useState)(null);
	const [activeProgramId, setActiveProgramId] = (0, import_react.useState)(null);
	const [feedbackOpen, setFeedbackOpen] = (0, import_react.useState)(false);
	const [feedbackDay, setFeedbackDay] = (0, import_react.useState)(null);
	const [activeDayId, setActiveDayId] = (0, import_react.useState)(null);
	const [studentViewOpen, setStudentViewOpen] = (0, import_react.useState)(false);
	const [progressionOpen, setProgressionOpen] = (0, import_react.useState)(false);
	const [aiOpen, setAiOpen] = (0, import_react.useState)(false);
	const [migrateOpen, setMigrateOpen] = (0, import_react.useState)(false);
	const [downloadingPdf, setDownloadingPdf] = (0, import_react.useState)(false);
	const { data: studentInfo } = useQuery({
		queryKey: ["pt-student-name", studentId],
		queryFn: async () => {
			const { data } = await supabase.from("pt_students").select("name").eq("id", studentId).maybeSingle();
			return data;
		}
	});
	async function handleDownloadPdf() {
		if (!activeProgramId) return;
		setDownloadingPdf(true);
		try {
			await downloadProgramPdf(activeProgramId, studentInfo?.name);
		} catch (e) {
			toast.error(e?.message ?? "Falha ao gerar PDF");
		} finally {
			setDownloadingPdf(false);
		}
	}
	const { data: programs = [] } = useQuery({
		queryKey: [
			"pt-programs",
			studentId,
			view
		],
		queryFn: async () => {
			let q = supabase.from("pt_programs").select("*").eq("pt_student_id", studentId);
			if (view === "active") q = q.eq("is_archived", false).eq("is_deleted", false);
			else if (view === "archived") q = q.eq("is_archived", true).eq("is_deleted", false);
			else q = q.eq("is_deleted", true);
			const { data } = await q.order("sort_order", { ascending: true }).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const { data: trainingDays = [] } = useQuery({
		queryKey: ["pt-training-days", activeProgramId],
		enabled: !!activeProgramId,
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_days").select("*").eq("program_id", activeProgramId).order("sort_order", { ascending: true }).order("created_at", { ascending: true });
			return data ?? [];
		}
	});
	const { data: executions = [] } = useQuery({
		queryKey: ["pt-executions", studentId],
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_executions").select("*").eq("pt_student_id", studentId).order("executed_at", { ascending: false });
			return data ?? [];
		}
	});
	(0, import_react.useEffect)(() => {
		if (programs.length === 0) {
			setActiveProgramId(null);
			return;
		}
		if (!activeProgramId || !programs.find((p) => p.id === activeProgramId)) setActiveProgramId(programs[0].id);
	}, [programs, activeProgramId]);
	const activeProgram = programs.find((p) => p.id === activeProgramId) ?? null;
	async function softDeleteProgram(id) {
		if (!await confirmDialog("Mover esta rotina para a lixeira?")) return;
		const { error } = await supabase.from("pt_programs").update({
			is_deleted: true,
			is_archived: false
		}).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Rotina movida para a lixeira");
		qc.invalidateQueries({ queryKey: ["pt-programs", studentId] });
	}
	async function restoreProgram(id) {
		const { error } = await supabase.from("pt_programs").update({
			is_deleted: false,
			is_archived: false
		}).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Rotina restaurada");
		qc.invalidateQueries({ queryKey: ["pt-programs", studentId] });
	}
	async function archiveProgram(id, archived) {
		const { error } = await supabase.from("pt_programs").update({ is_archived: archived }).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success(archived ? "Rotina arquivada" : "Rotina desarquivada");
		qc.invalidateQueries({ queryKey: ["pt-programs", studentId] });
	}
	async function hardDeleteProgram(id) {
		if (!await confirmDialog("Excluir permanentemente? Esta ação não pode ser desfeita.")) return;
		const { error } = await supabase.from("pt_programs").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Rotina excluída");
		qc.invalidateQueries({ queryKey: ["pt-programs", studentId] });
	}
	async function deleteDay(id) {
		if (!await confirmDialog("Excluir este treino?")) return;
		const { error } = await supabase.from("pt_training_days").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Treino excluído");
		qc.invalidateQueries({ queryKey: ["pt-training-days", activeProgramId] });
	}
	async function markExecuted(day) {
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		const { error } = await supabase.from("pt_training_executions").insert({
			user_id: userId,
			training_day_id: day.id,
			pt_student_id: studentId,
			executed_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
		});
		if (error) return toast.error(error.message);
		toast.success(`${day.name} marcado como executado hoje`);
		qc.invalidateQueries({ queryKey: ["pt-executions", studentId] });
	}
	async function reorderDays(ids) {
		const failed = (await Promise.all(ids.map((id, i) => supabase.from("pt_training_days").update({ sort_order: i }).eq("id", id)))).find((r) => r.error);
		if (failed?.error) {
			toast.error(failed.error.message);
			return;
		}
		qc.invalidateQueries({ queryKey: ["pt-training-days", activeProgramId] });
	}
	function execsForDay(dayId) {
		return executions.filter((e) => e.training_day_id === dayId);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => {
								setEditingProgram(null);
								setProgramOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Criar rotina"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: view === "archived" ? "default" : "outline",
							onClick: () => setView(view === "archived" ? "active" : "archived"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-4 w-4" }), " Rotinas arquivadas"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: view === "deleted" ? "default" : "outline",
							onClick: () => setView(view === "deleted" ? "active" : "deleted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Rotinas excluídas"]
						}),
						view !== "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => setView("active"),
							children: "Voltar para ativas"
						})
					]
				})
			}),
			programs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveProgramId(p.id),
					className: `rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${activeProgramId === p.id ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent"}`,
					children: p.name
				}, p.id))
			}),
			programs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-6 w-6" }),
				title: view === "active" ? "Nenhuma rotina criada" : view === "archived" ? "Nenhuma rotina arquivada" : "Lixeira vazia",
				description: view === "active" ? "Crie a primeira rotina de treino para este aluno." : void 0,
				action: view === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditingProgram(null);
						setProgramOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Criar rotina"]
				}) : null
			}) : activeProgram ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-6 w-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-semibold",
									children: activeProgram.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatDateBR(activeProgram.start_date), activeProgram.end_date ? ` — ${formatDateBR(activeProgram.end_date)}` : ""] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap items-center gap-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary",
											children: CATEGORY_LABELS[activeProgram.category] ?? activeProgram.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-muted px-2 py-0.5 font-medium",
											children: LEVEL_LABELS[activeProgram.level] ?? activeProgram.level
										}),
										activeProgram.is_archived && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full border px-2 py-0.5 font-medium text-muted-foreground",
											children: "Arquivada"
										}),
										activeProgram.is_deleted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full border border-destructive/40 px-2 py-0.5 font-medium text-destructive",
											children: "Na lixeira"
										})
									]
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => {
										setEditingProgram(activeProgram);
										setProgramOpen(true);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" }), " Editar rotina"]
								}),
								!activeProgram.is_deleted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onClick: () => archiveProgram(activeProgram.id, !activeProgram.is_archived),
									children: activeProgram.is_archived ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchiveRestore, { className: "h-4 w-4" }), " Desarquivar"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-4 w-4" }), " Arquivar"] })
								}),
								activeProgram.is_deleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => restoreProgram(activeProgram.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), " Restaurar"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									className: "text-destructive",
									onClick: () => hardDeleteProgram(activeProgram.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Excluir permanentemente"]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									className: "text-destructive",
									onClick: () => softDeleteProgram(activeProgram.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Mover para lixeira"]
								})
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleDownloadPdf,
								disabled: downloadingPdf,
								className: "flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: downloadingPdf ? "Gerando…" : "Baixar treino" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStudentViewOpen(true),
								className: "flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Visão do aluno" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setProgressionOpen(true),
								className: "flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Evolução de cargas" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setAiOpen(true),
								className: "flex items-center gap-1.5 rounded-lg border bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors duration-200 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Prescrever com IA" })]
							}),
							activeProgram.ai_prompt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiPromptPopover, {
								prompt: activeProgram.ai_prompt,
								generatedAt: activeProgram.ai_generated_at
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setMigrateOpen(true),
								className: "flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium transition-colors duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Migrar rotina" })]
							})
						]
					}),
					activeProgram.goals && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border bg-muted/30 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5" }), " Objetivos"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm whitespace-pre-wrap",
							children: activeProgram.goals
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 rounded-lg border bg-muted/30 p-3 sm:grid-cols-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCell, {
								label: "Tipo de treino",
								value: activeProgram.training_type === "numeric" ? "Numérico" : "Alfabético"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCell, {
								label: "Mostrar para o aluno",
								value: activeProgram.show_to_student ? "Sim" : "Não"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCell, {
								label: "Arquivar automaticamente",
								value: activeProgram.auto_archive ? "Sim" : "Não"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimer, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold",
							children: "Treinos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setLayoutOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4" }), " Editor de layout"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									setEditingDay(null);
									setDayOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Adicionar treino"]
							})]
						})]
					}),
					trainingDays.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground",
						children: "Nenhum treino adicionado ainda."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableList, {
						items: trainingDays,
						onReorder: reorderDays,
						className: "space-y-2",
						children: (day, { handleProps }) => {
							const execs = execsForDay(day.id);
							const last = execs[0];
							const isActiveDay = activeDayId === day.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-1 rounded-lg border p-3 transition-shadow duration-200 hover:shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragHandle, {
									handleProps,
									label: `Reordenar ${day.name}`,
									className: "mt-0.5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setActiveDayId(isActiveDay ? null : day.id),
												className: "flex-1 text-left",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold",
															children: day.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
															children: day.day_label
														})]
													}),
													day.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 text-sm text-muted-foreground",
														children: day.description
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 text-xs text-muted-foreground",
														children: execs.length === 0 ? "Ainda não executado" : `Executado ${execs.length}x · última em ${formatDateBR(last.executed_at)}`
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "ghost",
														onClick: () => markExecuted(day),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Executado"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "ghost",
														onClick: () => {
															setFeedbackDay(day);
															setFeedbackOpen(true);
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }), " Feedbacks"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
														asChild: true,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "icon",
															variant: "ghost",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
														align: "end",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
															onClick: () => {
																setEditingDay(day);
																setDayOpen(true);
															},
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" }), " Editar"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
															className: "text-destructive",
															onClick: () => deleteDay(day.id),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Excluir"]
														})]
													})] })
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex flex-wrap gap-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => setActiveDayId(isActiveDay ? null : day.id),
												children: isActiveDay ? "Recolher exercícios" : "Ver exercícios"
											})
										}),
										isActiveDay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainingDayDetail, { dayId: day.id })
									]
								})]
							}, day.id);
						}
					}),
					activeProgram.show_to_student && !activeProgram.is_archived && !activeProgram.is_deleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-1.5 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), " Esta rotina aparece no portal do aluno em \"Meu treino\"."]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramDialog, {
				open: programOpen,
				onOpenChange: setProgramOpen,
				program: editingProgram,
				studentId
			}),
			activeProgramId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainingDayDialog, {
				open: dayOpen,
				onOpenChange: setDayOpen,
				day: editingDay,
				programId: activeProgramId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackDialog, {
				open: feedbackOpen,
				onOpenChange: setFeedbackOpen,
				day: feedbackDay,
				studentId,
				executions: feedbackDay ? execsForDay(feedbackDay.id) : []
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentViewDialog, {
				open: studentViewOpen,
				onOpenChange: setStudentViewOpen,
				programId: activeProgramId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadProgressionDialog, {
				open: progressionOpen,
				onOpenChange: setProgressionOpen,
				studentId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiPrescribeDialog, {
				open: aiOpen,
				onOpenChange: setAiOpen,
				programId: activeProgramId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MigrateProgramDialog, {
				open: migrateOpen,
				onOpenChange: setMigrateOpen,
				programId: activeProgramId,
				programName: activeProgram?.name ?? null,
				currentStudentId: studentId,
				onMigrated: (_target, mode) => {
					if (mode === "move") qc.invalidateQueries({ queryKey: ["pt-programs", studentId] });
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramLayoutEditor, {
				open: layoutOpen,
				onOpenChange: setLayoutOpen,
				programId: activeProgramId
			})
		]
	});
}
function MetaCell({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[10px] uppercase tracking-wider text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-0.5 font-medium",
		children: value
	})] });
}
function ProgramDialog({ open, onOpenChange, program, studentId }) {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({});
	const [currentStep, setCurrentStep] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setCurrentStep(0);
		setForm(program ?? {
			training_type: "numeric",
			show_to_student: true,
			auto_archive: true,
			category: "hypertrophy",
			level: "intermediate",
			start_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
		});
	}, [open, program]);
	const steps = [
		{
			title: "Identificação",
			description: "Nome e período"
		},
		{
			title: "Perfil",
			description: "Nível e formato"
		},
		{
			title: "Publicação",
			description: "Regras de exibição"
		}
	];
	const handleNext = () => {
		if (currentStep === 0) {
			if (!form.name?.trim()) {
				toast.error("Informe o título da rotina.");
				return;
			}
			if (!form.start_date) {
				toast.error("Informe a data inicial.");
				return;
			}
		}
		setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
	};
	const handlePrev = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};
	async function save() {
		if (!form.name || !form.start_date) return toast.error("Nome e data inicial são obrigatórios.");
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		const payload = {
			user_id: userId,
			pt_student_id: studentId,
			name: form.name,
			start_date: form.start_date,
			end_date: form.end_date || null,
			goals: form.goals || null,
			category: form.category ?? "general",
			level: form.level ?? "intermediate",
			training_type: form.training_type ?? "numeric",
			show_to_student: form.show_to_student ?? true,
			auto_archive: form.auto_archive ?? true
		};
		const { error } = await (form.id ? supabase.from("pt_programs").update(payload).eq("id", form.id) : supabase.from("pt_programs").insert(payload));
		if (error) return toast.error(error.message);
		toast.success(form.id ? "Rotina atualizada" : "Rotina criada com sucesso!");
		qc.invalidateQueries({ queryKey: ["pt-programs", studentId] });
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? "Editar rotina de treino" : "Nova rotina de treino" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
					steps,
					currentStep,
					onStepClick: (index) => {
						if (index > currentStep && (!form.name?.trim() || !form.start_date)) {
							toast.error("Preencha o título e a data inicial antes de avançar.");
							return;
						}
						setCurrentStep(index);
					},
					className: "mb-2"
				}),
				currentStep === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3.5 py-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Título da rotina *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.name ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									name: e.target.value
								})),
								placeholder: "Ex: Treino Hipertrofia — S1 (2026)",
								autoFocus: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data inicial *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: form.start_date ?? "",
									onChange: (e) => setForm((f) => ({
										...f,
										start_date: e.target.value
									}))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data final (opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: form.end_date ?? "",
									onChange: (e) => setForm((f) => ({
										...f,
										end_date: e.target.value
									}))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Objetivos da rotina" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: form.goals ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									goals: e.target.value
								})),
								placeholder: "Ex: Ganho de massa muscular em membros superiores, ênfase em deltoides…"
							})]
						})
					]
				}),
				currentStep === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3.5 py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Categoria" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.category ?? "general",
								onValueChange: (v) => setForm((f) => ({
									...f,
									category: v
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.entries(CATEGORY_LABELS).map(([k, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: k,
									children: l
								}, k)) })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nível" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.level ?? "intermediate",
								onValueChange: (v) => setForm((f) => ({
									...f,
									level: v
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.entries(LEVEL_LABELS).map(([k, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: k,
									children: l
								}, k)) })]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tipo de divisão / nomenclatura" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.training_type ?? "numeric",
							onValueChange: (v) => setForm((f) => ({
								...f,
								training_type: v
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "numeric",
								children: "Numérico (Treino 1, 2, 3…)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "alphabetic",
								children: "Alfabético (Treino A, B, C…)"
							})] })]
						})]
					})]
				}),
				currentStep === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3.5 py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mostrar no portal do aluno" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.show_to_student ? "yes" : "no",
								onValueChange: (v) => setForm((f) => ({
									...f,
									show_to_student: v === "yes"
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "yes",
									children: "Sim (Visível)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "no",
									children: "Não (Apenas Personal)"
								})] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Arquivar automaticamente" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.auto_archive ? "yes" : "no",
								onValueChange: (v) => setForm((f) => ({
									...f,
									auto_archive: v === "yes"
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "yes",
									children: "Sim (Ao vencer)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "no",
									children: "Não (Manter ativo)"
								})] })]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/70 bg-muted/30 p-3 text-xs space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-foreground",
								children: "Resumo da Rotina:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: form.name
									}),
									" · ",
									CATEGORY_LABELS[form.category ?? "general"],
									" · ",
									LEVEL_LABELS[form.level ?? "intermediate"]
								]
							}),
							form.start_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [
									"Início: ",
									formatDateBR(form.start_date),
									" ",
									form.end_date ? `até ${formatDateBR(form.end_date)}` : "(vigência indeterminada)"
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepperFooter, {
					currentStep,
					totalSteps: steps.length,
					onPrev: handlePrev,
					onNext: handleNext,
					onFinish: save,
					finishLabel: form.id ? "Salvar Alterações" : "Criar Rotina"
				})
			]
		})
	});
}
function TrainingDayDialog({ open, onOpenChange, day, programId }) {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setForm(day ?? {
			name: "",
			day_label: ""
		});
	}, [open, day]);
	async function save() {
		if (!form.name || !form.day_label) return toast.error("Nome e dia são obrigatórios.");
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		const payload = {
			user_id: userId,
			program_id: programId,
			name: form.name,
			day_label: form.day_label,
			description: form.description || null
		};
		const { error } = await (form.id ? supabase.from("pt_training_days").update(payload).eq("id", form.id) : supabase.from("pt_training_days").insert(payload));
		if (error) return toast.error(error.message);
		toast.success(form.id ? "Treino atualizado" : "Treino adicionado");
		qc.invalidateQueries({ queryKey: ["pt-training-days", programId] });
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? "Editar treino" : "Adicionar treino" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome do treino *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.name ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									name: e.target.value
								})),
								placeholder: "Ex: Treino 1"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Identificação do dia *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.day_label ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									day_label: e.target.value
								})),
								placeholder: "Ex: Dia A"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Descrição" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 4,
								value: form.description ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									description: e.target.value
								})),
								placeholder: "Ex: Peito, ombro e tríceps — 4 séries de cada exercício"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					children: "Salvar"
				})] })
			]
		})
	});
}
function FeedbackDialog({ open, onOpenChange, day, studentId, executions }) {
	const qc = useQueryClient();
	const [feedback, setFeedback] = (0, import_react.useState)("");
	const [rating, setRating] = (0, import_react.useState)(0);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) {
			setFeedback("");
			setRating(0);
		}
	}, [open]);
	async function save() {
		if (!day) return;
		if (!feedback.trim()) return toast.error("Digite um feedback.");
		setSaving(true);
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) {
			setSaving(false);
			return;
		}
		const last = executions[0];
		let error;
		if (last) ({error} = await supabase.from("pt_training_executions").update({
			feedback,
			rating: rating || null
		}).eq("id", last.id));
		else ({error} = await supabase.from("pt_training_executions").insert({
			user_id: userId,
			training_day_id: day.id,
			pt_student_id: studentId,
			executed_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			feedback,
			rating: rating || null
		}));
		if (error) {
			toast.error(error.message);
			setSaving(false);
			return;
		}
		toast.success("Feedback salvo");
		qc.invalidateQueries({ queryKey: ["pt-executions", studentId] });
		setSaving(false);
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Feedbacks", day ? ` — ${day.name} (${day.day_label})` : ""] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						executions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-h-40 space-y-2 overflow-y-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase text-muted-foreground",
								children: "Histórico"
							}), executions.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-muted/40 p-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: formatDateBR(e.executed_at)
									}), e.rating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⭐".repeat(e.rating) }) : null]
								}), e.feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-muted-foreground",
									children: e.feedback
								})]
							}, e.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Adicionar feedback" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: feedback,
								onChange: (e) => setFeedback(e.target.value),
								placeholder: "Como foi o treino? Observações do professor ou do aluno…"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Avaliação (opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1",
								children: [
									1,
									2,
									3,
									4,
									5
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setRating(s === rating ? 0 : s),
									className: "text-2xl transition-transform hover:scale-110",
									children: s <= rating ? "⭐" : "☆"
								}, s))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Fechar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					disabled: saving,
					children: saving ? "Salvando…" : "Salvar feedback"
				})] })
			]
		})
	});
}
function ImageComparison({ beforeImage, afterImage, beforeLabel = "Antes", afterLabel = "Depois", initialPosition = 50, aspectRatio = "portrait", className, ...props }) {
	const [sliderPosition, setSliderPosition] = import_react.useState(initialPosition);
	const [isDragging, setIsDragging] = import_react.useState(false);
	const containerRef = import_react.useRef(null);
	const handleMove = import_react.useCallback((clientX) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const x = clientX - rect.left;
		setSliderPosition(Math.max(0, Math.min(100, x / rect.width * 100)));
	}, []);
	const handlePointerDown = (e) => {
		e.preventDefault();
		setIsDragging(true);
		handleMove(e.clientX);
		e.currentTarget.setPointerCapture(e.pointerId);
	};
	const handlePointerMove = (e) => {
		if (!isDragging) return;
		handleMove(e.clientX);
	};
	const handlePointerUp = (e) => {
		setIsDragging(false);
		try {
			e.currentTarget.releasePointerCapture(e.pointerId);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMove,
		onPointerUp: handlePointerUp,
		onPointerCancel: handlePointerUp,
		className: cn("group relative w-full select-none overflow-hidden rounded-xl border border-border bg-muted cursor-ew-resize touch-none shadow-md", aspectRatio === "portrait" ? "aspect-[3/4]" : aspectRatio === "square" ? "aspect-square" : aspectRatio === "video" ? "aspect-video" : "", className),
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: afterImage,
				alt: afterLabel,
				className: "absolute inset-0 h-full w-full object-cover pointer-events-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 h-full w-full overflow-hidden pointer-events-none",
				style: { clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: beforeImage,
					alt: beforeLabel,
					className: "absolute inset-0 h-full w-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-3 left-3 pointer-events-none z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-background/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm ring-1 ring-border/50",
					children: beforeLabel
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-3 right-3 pointer-events-none z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-background/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm ring-1 ring-border/50",
					children: afterLabel
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-y-0 pointer-events-none z-20 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]",
				style: { left: `${sliderPosition}%` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-background shadow-lg transition-transform group-hover:scale-110",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsLeftRight, { className: "h-4 w-4 text-foreground" })
				})
			})
		]
	});
}
function calculateBMI(weightKg, heightCm) {
	if (!weightKg || !heightCm) return 0;
	const heightM = heightCm / 100;
	return Number((weightKg / (heightM * heightM)).toFixed(1));
}
function getBMICategory(bmi) {
	if (!bmi || bmi <= 0) return {
		label: "Não calculado",
		tone: "neutral"
	};
	if (bmi < 18.5) return {
		label: "Abaixo do peso",
		tone: "warning"
	};
	if (bmi <= 24.9) return {
		label: "Peso normal",
		tone: "success"
	};
	if (bmi <= 29.9) return {
		label: "Sobrepeso",
		tone: "warning"
	};
	if (bmi <= 34.9) return {
		label: "Obesidade Grau I",
		tone: "destructive"
	};
	if (bmi <= 39.9) return {
		label: "Obesidade Grau II",
		tone: "destructive"
	};
	return {
		label: "Obesidade Mórbida",
		tone: "destructive"
	};
}
var LOCAL_STORAGE_KEY_PREFIX = "eduflow_pt_assessments_";
function getLocalAssessments(studentId) {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${studentId}`);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function setLocalAssessments(studentId, items) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${studentId}`, JSON.stringify(items));
	} catch (err) {
		console.error("Erro ao salvar avaliações no localStorage:", err);
	}
}
var getStudentAssessments = fetchPhysicalAssessments;
async function fetchPhysicalAssessments(studentId) {
	try {
		const { data, error } = await supabase.from("pt_physical_assessments").select("*").eq("pt_student_id", studentId).order("assessment_date", { ascending: false });
		if (!error && data && data.length > 0) {
			setLocalAssessments(studentId, data);
			return data;
		}
	} catch (err) {
		console.warn("Supabase pt_physical_assessments inacessível, utilizando cache local:", err);
	}
	return getLocalAssessments(studentId).sort((a, b) => new Date(b.assessment_date).getTime() - new Date(a.assessment_date).getTime());
}
async function savePhysicalAssessment(studentId, assessment) {
	const { data: userData } = await supabase.auth.getUser();
	const userId = userData.user?.id || "local-user";
	const newId = assessment.id || crypto.randomUUID();
	const record = {
		...assessment,
		id: newId,
		pt_student_id: studentId,
		user_id: userId,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	const current = getLocalAssessments(studentId);
	setLocalAssessments(studentId, current.some((a) => a.id === newId) ? current.map((a) => a.id === newId ? record : a) : [record, ...current]);
	try {
		const { error } = await supabase.from("pt_physical_assessments").upsert(record);
		if (error) console.warn("Erro ao persistir avaliação no Supabase, mantido em cache local:", error.message);
	} catch (err) {
		console.warn("Supabase indisponível no momento, avaliação armazenada localmente com sucesso.");
	}
	return record;
}
async function deletePhysicalAssessment(id, studentId) {
	setLocalAssessments(studentId, getLocalAssessments(studentId).filter((a) => a.id !== id));
	try {
		await supabase.from("pt_physical_assessments").delete().eq("id", id);
	} catch (err) {
		console.warn("Erro ao excluir do Supabase, removido do cache local.");
	}
}
function PhysicalAssessmentTab({ studentId }) {
	const qc = useQueryClient();
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [comparisonType, setComparisonType] = (0, import_react.useState)("photo_front");
	const [form, setForm] = (0, import_react.useState)({ assessment_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) });
	const { data: assessments = [], isLoading } = useQuery({
		queryKey: ["pt-student-assessments", studentId],
		queryFn: () => fetchPhysicalAssessments(studentId)
	});
	const latest = assessments[0];
	const oldest = assessments[assessments.length - 1];
	const bmi = latest ? calculateBMI(latest.weight, latest.height) : 0;
	const bmiCategory = getBMICategory(bmi);
	const weightDelta = latest && oldest && assessments.length > 1 ? latest.weight - oldest.weight : null;
	const chartData = (0, import_react.useMemo)(() => {
		return [...assessments].reverse().map((a) => ({
			date: formatDateBR(a.assessment_date),
			peso: a.weight,
			gordura: a.body_fat_percentage ?? void 0
		}));
	}, [assessments]);
	const photoHistory = (0, import_react.useMemo)(() => {
		return assessments.filter((a) => a[comparisonType]);
	}, [assessments, comparisonType]);
	const beforePhoto = photoHistory[photoHistory.length - 1]?.[comparisonType];
	const afterPhoto = photoHistory[0]?.[comparisonType];
	const handleOpenNew = () => {
		setForm({
			assessment_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			height: latest?.height || void 0
		});
		setDialogOpen(true);
	};
	const handleSave = async () => {
		if (!form.weight || !form.height || !form.assessment_date) {
			toast.error("Preencha ao menos data, peso e altura.");
			return;
		}
		try {
			await savePhysicalAssessment(studentId, form);
			toast.success("Avaliação física salva com sucesso!");
			qc.invalidateQueries({ queryKey: ["pt-student-assessments", studentId] });
			setDialogOpen(false);
		} catch (err) {
			toast.error(`Erro ao salvar: ${err.message}`);
		}
	};
	const handleDelete = async (id) => {
		if (!confirm("Deseja realmente excluir este registro de avaliação física?")) return;
		await deletePhysicalAssessment(id, studentId);
		toast.success("Avaliação excluída.");
		qc.invalidateQueries({ queryKey: ["pt-student-assessments", studentId] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-lg font-bold tracking-tight text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-5 w-5 text-primary" }), " Avaliação Física & Composição Corporal"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Acompanhe a evolução antropométrica, percentual de gordura e comparação fotográfica"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleOpenNew,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " Nova Avaliação"]
				})]
			}),
			assessments.length === 0 && !isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-8 w-8" }),
				title: "Nenhuma avaliação física registrada",
				description: "Cadastre a primeira avaliação para acompanhar peso, medidas e fotos de evolução deste aluno.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleOpenNew,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " Fazer 1ª Avaliação"]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				latest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-4 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Peso Atual"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-2xl font-bold text-foreground tabular-nums",
										children: [latest.weight, " kg"]
									}), weightDelta !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `text-xs font-semibold flex items-center ${weightDelta <= 0 ? "text-emerald-600" : "text-amber-600"}`,
										children: [
											weightDelta <= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3 mr-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3 mr-0.5" }),
											weightDelta > 0 ? `+${weightDelta.toFixed(1)}` : weightDelta.toFixed(1),
											" kg"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground",
									children: ["Última aferição: ", formatDateBR(latest.assessment_date)]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-4 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Índice de Massa Corporal (IMC)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-bold text-foreground tabular-nums",
									children: bmi
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${bmiCategory.tone === "success" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`,
									children: bmiCategory.label
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-4 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "% de Gordura Corporal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-bold text-foreground tabular-nums",
									children: latest.body_fat_percentage ? `${latest.body_fat_percentage}%` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: latest.muscle_mass_percentage ? `Massa magra: ${latest.muscle_mass_percentage}%` : "Bioimpedância / Dobras"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-4 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Total de Aferições"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-bold text-foreground tabular-nums",
									children: assessments.length
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground",
									children: ["Histórico desde ", formatDateBR(oldest.assessment_date)]
								})
							]
						})
					]
				}),
				beforePhoto && afterPhoto && photoHistory.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-base font-bold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), " Comparador Visual Antes vs. Depois"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Arraste a linha central para visualizar a transformação física"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setComparisonType("photo_front"),
									className: `px-2.5 py-1 rounded font-medium transition-colors ${comparisonType === "photo_front" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`,
									children: "Frente"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setComparisonType("photo_side"),
									className: `px-2.5 py-1 rounded font-medium transition-colors ${comparisonType === "photo_side" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`,
									children: "Lado"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setComparisonType("photo_back"),
									className: `px-2.5 py-1 rounded font-medium transition-colors ${comparisonType === "photo_back" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`,
									children: "Costas"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-w-md mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageComparison, {
							beforeImage: beforePhoto,
							afterImage: afterPhoto,
							beforeLabel: `Antes (${formatDateBR(photoHistory[photoHistory.length - 1].assessment_date)})`,
							afterLabel: `Depois (${formatDateBR(photoHistory[0].assessment_date)})`,
							aspectRatio: "portrait"
						})
					})]
				}),
				chartData.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold text-foreground",
						children: "Evolução de Peso ao Longo do Tempo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[220px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: chartData,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										opacity: .3
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "date",
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										domain: ["auto", "auto"],
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										borderRadius: 8,
										fontSize: 12
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "peso",
										name: "Peso (kg)",
										stroke: "#0ea5e9",
										strokeWidth: 2.5,
										dot: { r: 4 },
										activeDot: { r: 6 }
									})
								]
							})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold text-foreground",
						children: "Histórico de Avaliações"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: assessments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border/80 bg-muted/20 p-4 transition-all hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-primary",
										children: formatDateBR(a.assessment_date)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex flex-wrap items-center gap-3 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold",
												children: [a.weight, " kg"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "·"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.height, " cm"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "·"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["IMC: ", calculateBMI(a.weight, a.height)] }),
											a.body_fat_percentage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "·"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-amber-600 font-medium",
												children: [a.body_fat_percentage, "% Gordura"]
											})] })
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "h-8 w-8 text-destructive",
										onClick: () => handleDelete(a.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs border-t border-border/50 pt-2.5",
									children: [
										a.chest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Tórax:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [a.chest, "cm"]
											})
										] }),
										a.waist && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Cintura:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [a.waist, "cm"]
											})
										] }),
										a.abdomen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Abdômen:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [a.abdomen, "cm"]
											})
										] }),
										a.hips && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Quadril:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [a.hips, "cm"]
											})
										] }),
										a.right_arm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Braço D:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [a.right_arm, "cm"]
											})
										] }),
										a.left_arm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Braço E:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [a.left_arm, "cm"]
											})
										] }),
										a.right_thigh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Coxa D:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [a.right_thigh, "cm"]
											})
										] }),
										a.left_thigh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Coxa E:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [a.left_thigh, "cm"]
											})
										] })
									]
								}),
								a.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs italic text-muted-foreground",
									children: [
										"\"",
										a.notes,
										"\""
									]
								})
							]
						}, a.id))
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-xl max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nova Avaliação Física" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data da Avaliação *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "date",
												value: form.assessment_date ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													assessment_date: e.target.value
												}))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Peso (kg) *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												step: "0.1",
												placeholder: "Ex: 78.5",
												value: form.weight ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													weight: Number(e.target.value)
												}))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Altura (cm) *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												placeholder: "Ex: 175",
												value: form.height ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													height: Number(e.target.value)
												}))
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "% de Gordura Corporal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											step: "0.1",
											placeholder: "Ex: 16.2",
											value: form.body_fat_percentage ?? "",
											onChange: (e) => setForm((f) => ({
												...f,
												body_fat_percentage: Number(e.target.value) || null
											}))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "% de Massa Muscular" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											step: "0.1",
											placeholder: "Ex: 42.0",
											value: form.muscle_mass_percentage ?? "",
											onChange: (e) => setForm((f) => ({
												...f,
												muscle_mass_percentage: Number(e.target.value) || null
											}))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 pt-2 border-t border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "Perímetros e Medidas (cm)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Tórax (cm)",
												type: "number",
												step: "0.5",
												value: form.chest ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													chest: Number(e.target.value) || null
												}))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Cintura (cm)",
												type: "number",
												step: "0.5",
												value: form.waist ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													waist: Number(e.target.value) || null
												}))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Abdômen (cm)",
												type: "number",
												step: "0.5",
												value: form.abdomen ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													abdomen: Number(e.target.value) || null
												}))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Quadril (cm)",
												type: "number",
												step: "0.5",
												value: form.hips ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													hips: Number(e.target.value) || null
												}))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Braço D (cm)",
												type: "number",
												step: "0.5",
												value: form.right_arm ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													right_arm: Number(e.target.value) || null
												}))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Braço E (cm)",
												type: "number",
												step: "0.5",
												value: form.left_arm ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													left_arm: Number(e.target.value) || null
												}))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Coxa D (cm)",
												type: "number",
												step: "0.5",
												value: form.right_thigh ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													right_thigh: Number(e.target.value) || null
												}))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Coxa E (cm)",
												type: "number",
												step: "0.5",
												value: form.left_thigh ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													left_thigh: Number(e.target.value) || null
												}))
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 pt-2 border-t border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "URLs das Fotos de Avaliação (Frente, Lado, Costas)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "URL Foto Frente (https://...)",
												value: form.photo_front ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													photo_front: e.target.value
												}))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "URL Foto Lado / Perfil (https://...)",
												value: form.photo_side ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													photo_side: e.target.value
												}))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "URL Foto Costas (https://...)",
												value: form.photo_back ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													photo_back: e.target.value
												}))
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações do Avaliador" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
										placeholder: "Ex: Aluno relata melhora na disposição. Redução visível na circunferência abdominal.",
										value: form.notes ?? "",
										onChange: (e) => setForm((f) => ({
											...f,
											notes: e.target.value
										}))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setDialogOpen(false),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleSave,
							children: "Salvar Avaliação"
						})] })
					]
				})
			})
		]
	});
}
function calculateOneRepMax(weight, reps) {
	if (reps <= 1) {
		const w = weight;
		return generateResult(w, 1, w, w, w, w);
	}
	const epley = Number((weight * (1 + .0333 * reps)).toFixed(1));
	const brzycki = Number((weight / (1.0278 - .0278 * reps)).toFixed(1));
	const lander = Number((100 * weight / (101.3 - 2.67123 * reps)).toFixed(1));
	return generateResult(weight, reps, epley, brzycki, lander, Number(((epley + brzycki + lander) / 3).toFixed(1)));
}
function generateResult(weight, reps, epley, brzycki, lander, average1RM) {
	return {
		weight,
		reps,
		epley,
		brzycki,
		lander,
		average1RM,
		percentages: [
			{
				percentage: 100,
				estimatedReps: "1 RM",
				zone: "Força Pura / Teste Máximo"
			},
			{
				percentage: 95,
				estimatedReps: "2 RM",
				zone: "Força Máxima"
			},
			{
				percentage: 90,
				estimatedReps: "3 - 4 reps",
				zone: "Força Máxima"
			},
			{
				percentage: 85,
				estimatedReps: "5 - 6 reps",
				zone: "Força & Potência"
			},
			{
				percentage: 80,
				estimatedReps: "7 - 8 reps",
				zone: "Hipertrofia Miofibrilar"
			},
			{
				percentage: 75,
				estimatedReps: "9 - 10 reps",
				zone: "Hipertrofia Geral"
			},
			{
				percentage: 70,
				estimatedReps: "11 - 12 reps",
				zone: "Hipertrofia Sarcoplasmática"
			},
			{
				percentage: 65,
				estimatedReps: "15 reps",
				zone: "Resistência Muscular"
			},
			{
				percentage: 60,
				estimatedReps: "20 reps",
				zone: "Resistência Muscular"
			}
		].map((item) => ({
			...item,
			weight: Number((average1RM * item.percentage / 100).toFixed(1))
		}))
	};
}
/**
* Extrai o valor numérico de cargas (ex: "80kg" -> 80, "12.5 kg" -> 12.5, "100" -> 100)
*/
function extractLoadNumber(loadStr) {
	if (!loadStr) return null;
	const match = loadStr.replace(",", ".").trim().match(/(\d+(?:\.\d+)?)/);
	return match ? parseFloat(match[1]) : null;
}
/**
* Varre o histórico de execuções de treinos e identifica os Recordes Pessoais (PRs)
*/
function detectPersonalRecords(executions) {
	const prMap = /* @__PURE__ */ new Map();
	for (const exec of executions) {
		let notes = {};
		try {
			notes = typeof exec.notes === "string" ? JSON.parse(exec.notes || "{}") : exec.notes || {};
		} catch {
			notes = {};
		}
		const loads = notes.loads || {};
		for (const [exId, rawLoad] of Object.entries(loads)) {
			if (typeof rawLoad !== "string" && typeof rawLoad !== "number") continue;
			const numLoad = extractLoadNumber(String(rawLoad));
			if (!numLoad || numLoad <= 0) continue;
			const current = prMap.get(exId);
			if (!current || numLoad > current.maxLoad) prMap.set(exId, {
				exerciseId: exId,
				exerciseName: `Exercício #${exId.slice(-4)}`,
				maxLoad: numLoad,
				rawLoad: String(rawLoad),
				achievedAt: exec.executed_at,
				executionId: exec.id
			});
		}
	}
	return Array.from(prMap.values()).sort((a, b) => b.maxLoad - a.maxLoad);
}
function OneRepMaxDialog({ open, onOpenChange, initialWeight = 60, initialReps = 8 }) {
	const [weight, setWeight] = (0, import_react.useState)(initialWeight);
	const [reps, setReps] = (0, import_react.useState)(initialReps);
	const result = (0, import_react.useMemo)(() => {
		if (!weight || weight <= 0 || !reps || reps <= 0) return null;
		return calculateOneRepMax(weight, Math.min(reps, 20));
	}, [weight, reps]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-xl max-h-[90vh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "h-5 w-5 text-primary" }), " Calculadora de 1RM (Repetição Máxima)"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Estime sua carga máxima teórica (1RM) e descubra as faixas ideais para hipertrofia, força e resistência."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Carga Utilizada (kg)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.5",
									min: "1",
									className: "pl-9",
									value: weight || "",
									onChange: (e) => setWeight(Number(e.target.value)),
									placeholder: "Ex: 80"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Repetições Realizadas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: "1",
									max: "20",
									className: "pl-9",
									value: reps || "",
									onChange: (e) => setReps(Number(e.target.value)),
									placeholder: "Ex: 8"
								})]
							})]
						})]
					}),
					result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-primary/40 bg-primary/5 p-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold uppercase tracking-wider text-primary",
								children: "Estimativa de 1RM"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-3xl font-extrabold text-foreground tabular-nums",
								children: [result.average1RM, " kg"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"Média de 3 fórmulas consagradas (Epley: ",
									result.epley,
									"kg · Brzycki: ",
									result.brzycki,
									"kg · Lander: ",
									result.lander,
									"kg)"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5" }), " Tabela de Cargas por Zona de Treinamento"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border/60 rounded-xl border border-border/80 bg-muted/20 overflow-hidden text-xs",
							children: result.percentages.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-2.5 hover:bg-muted/40 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex w-10 shrink-0 font-bold text-primary tabular-nums",
											children: [item.percentage, "%"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [item.weight, " kg"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [
												"(",
												item.estimatedReps,
												")"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground font-medium truncate",
									children: item.zone
								})]
							}, item.percentage))
						})]
					})] })
				]
			})]
		})
	});
}
function HallOfFameCard({ executions, className }) {
	const [oneRmOpen, setOneRmOpen] = (0, import_react.useState)(false);
	const [selectedWeight, setSelectedWeight] = (0, import_react.useState)(60);
	const personalRecords = (0, import_react.useMemo)(() => {
		return detectPersonalRecords(executions);
	}, [executions]);
	const handleOpenCalc = (load) => {
		if (load && load > 0) setSelectedWeight(load);
		setOneRmOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: `p-5 space-y-4 ${className || ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-bold text-foreground",
					children: "Hall da Fama (Recordes Pessoais)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Maiores cargas registradas em treinos"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => handleOpenCalc(),
				className: "text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "h-3.5 w-3.5 mr-1 text-primary" }), " Calcular 1RM"]
			})]
		}), personalRecords.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-dashed border-border/70 p-4 text-center text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nenhum recorde registrado ainda." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[11px]",
				children: "As cargas inseridas durante a execução das aulas serão ranqueadas aqui automaticamente!"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3",
			children: personalRecords.slice(0, 6).map((pr, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group relative rounded-xl border border-border/80 bg-muted/20 p-3 transition-all hover:border-amber-500/30 hover:bg-muted/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [index === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black shadow-xs",
							children: "1º"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground",
							children: [index + 1, "º"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-xs text-foreground truncate",
							children: pr.exerciseName
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-extrabold text-amber-600 dark:text-amber-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }),
							" ",
							pr.rawLoad
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Batido em: ", formatDateBR(pr.achievedAt)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => handleOpenCalc(pr.maxLoad),
						className: "text-[10px] font-semibold text-primary hover:underline",
						children: "Ver 1RM →"
					})]
				})]
			}, pr.exerciseId))
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OneRepMaxDialog, {
		open: oneRmOpen,
		onOpenChange: setOneRmOpen,
		initialWeight: selectedWeight
	})] });
}
function calculateGamificationStats(sessions, executions = []) {
	const dateSet = /* @__PURE__ */ new Set();
	for (const s of sessions) if (s.status === "completed" && s.session_date) dateSet.add(s.session_date.slice(0, 10));
	for (const e of executions) if (e.executed_at) dateSet.add(e.executed_at.slice(0, 10));
	const sortedDates = Array.from(dateSet).sort();
	const totalWorkouts = sortedDates.length;
	const weekSet = /* @__PURE__ */ new Set();
	for (const d of sortedDates) {
		const weekStart = format(startOfWeek(/* @__PURE__ */ new Date(d + "T12:00"), { weekStartsOn: 1 }), "yyyy-MM-dd");
		weekSet.add(weekStart);
	}
	let currentStreak = 0;
	let cursor = startOfWeek(/* @__PURE__ */ new Date(), { weekStartsOn: 1 });
	const thisWeekKey = format(cursor, "yyyy-MM-dd");
	const lastWeekKey = format(subWeeks(cursor, 1), "yyyy-MM-dd");
	if (weekSet.has(thisWeekKey) || weekSet.has(lastWeekKey)) {
		let checkDate = weekSet.has(thisWeekKey) ? cursor : subWeeks(cursor, 1);
		while (weekSet.has(format(checkDate, "yyyy-MM-dd"))) {
			currentStreak++;
			checkDate = subWeeks(checkDate, 1);
		}
	}
	let level = {
		tier: "Ferro",
		name: "Iniciante",
		current: totalWorkouts,
		nextLevelAt: 10,
		progressPercent: Math.min(100, totalWorkouts / 10 * 100),
		color: "text-muted-foreground"
	};
	if (totalWorkouts >= 200) level = {
		tier: "Elite",
		name: "Elite Montanha",
		current: totalWorkouts,
		nextLevelAt: 300,
		progressPercent: 100,
		color: "text-amber-400"
	};
	else if (totalWorkouts >= 100) level = {
		tier: "Diamante",
		name: "Centurião",
		current: totalWorkouts,
		nextLevelAt: 200,
		progressPercent: (totalWorkouts - 100) / 100 * 100,
		color: "text-cyan-400"
	};
	else if (totalWorkouts >= 50) level = {
		tier: "Ouro",
		name: "Veterano",
		current: totalWorkouts,
		nextLevelAt: 100,
		progressPercent: (totalWorkouts - 50) / 50 * 100,
		color: "text-amber-500"
	};
	else if (totalWorkouts >= 25) level = {
		tier: "Prata",
		name: "Dedicado",
		current: totalWorkouts,
		nextLevelAt: 50,
		progressPercent: (totalWorkouts - 25) / 25 * 100,
		color: "text-slate-300"
	};
	else if (totalWorkouts >= 10) level = {
		tier: "Bronze",
		name: "Constante",
		current: totalWorkouts,
		nextLevelAt: 25,
		progressPercent: (totalWorkouts - 10) / 15 * 100,
		color: "text-amber-700"
	};
	return {
		currentStreakWeeks: currentStreak,
		bestStreakWeeks: Math.max(currentStreak, 0),
		totalWorkouts,
		level,
		badges: [
			{
				id: "first_workout",
				title: "Primeiro Passo",
				description: "Concluiu seu primeiro treino no studio",
				icon: "🥉",
				tier: "bronze",
				unlocked: totalWorkouts >= 1
			},
			{
				id: "streak_3",
				title: "Em Chamas",
				description: "Manteve 3 semanas consecutivas de presença",
				icon: "🔥",
				tier: "bronze",
				unlocked: currentStreak >= 3
			},
			{
				id: "club_10",
				title: "Clube dos 10",
				description: "Alcançou a marca de 10 aulas completadas",
				icon: "🎯",
				tier: "bronze",
				unlocked: totalWorkouts >= 10
			},
			{
				id: "streak_8",
				title: "Hábito Blindado",
				description: "8 semanas consecutivas sem falhar",
				icon: "⚡",
				tier: "silver",
				unlocked: currentStreak >= 8
			},
			{
				id: "club_25",
				title: "Clube dos 25",
				description: "Completou 25 treinos",
				icon: "🏆",
				tier: "silver",
				unlocked: totalWorkouts >= 25
			},
			{
				id: "club_50",
				title: "Clube dos 50",
				description: "50 treinos de dedicação exemplar",
				icon: "🎖️",
				tier: "gold",
				unlocked: totalWorkouts >= 50
			},
			{
				id: "streak_12",
				title: "Mestre do Foco",
				description: "12 semanas consecutivas (3 meses de disciplina inabalável)",
				icon: "🌟",
				tier: "gold",
				unlocked: currentStreak >= 12
			},
			{
				id: "club_100",
				title: "Centurião Montanha",
				description: "100 treinos concluídos com excelência!",
				icon: "👑",
				tier: "diamond",
				unlocked: totalWorkouts >= 100
			}
		]
	};
}
function StudentGamificationWidget({ sessions, executions = [], className }) {
	const [badgeModalOpen, setBadgeModalOpen] = (0, import_react.useState)(false);
	const stats = calculateGamificationStats(sessions, executions);
	const unlockedCount = stats.badges.filter((b) => b.unlocked).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: `relative overflow-hidden p-4 sm:p-5 border-amber-500/25 bg-gradient-to-br from-amber-500/[0.04] via-card to-card shadow-card ${className || ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-3 items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5 sm:border-r border-border/60 sm:pr-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 text-white shadow-md shadow-amber-500/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-7 w-7 animate-pulse" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400",
							children: "Fogo de Consistência"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-extrabold text-foreground tabular-nums",
							children: stats.currentStreakWeeks > 0 ? `${stats.currentStreakWeeks} ${stats.currentStreakWeeks === 1 ? "semana" : "semanas"}` : "Comece hoje!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: stats.currentStreakWeeks > 0 ? "Frequência ininterrupta" : "Faça check-in nesta semana"
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 sm:border-r border-border/60 sm:pr-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold uppercase tracking-wider text-muted-foreground text-[10px]",
								children: [
									"Nível: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: stats.level.tier
									}),
									" (",
									stats.level.name,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-primary tabular-nums",
								children: [
									stats.totalWorkouts,
									"/",
									stats.level.nextLevelAt
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: stats.level.progressPercent,
							className: "h-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: stats.level.nextLevelAt - stats.totalWorkouts > 0 ? `Faltam ${stats.level.nextLevelAt - stats.totalWorkouts} treinos para subir de faixa` : "Nível máximo alcançado!"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
						children: "Conquistas Desbloqueadas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5 mt-1",
						children: stats.badges.slice(0, 4).map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							title: `${badge.title}: ${badge.description}`,
							className: `flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-transform hover:scale-110 select-none ${badge.unlocked ? "bg-amber-500/10 border border-amber-500/30 shadow-2xs" : "bg-muted/40 opacity-40 grayscale"}`,
							children: badge.icon
						}, badge.id))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setBadgeModalOpen(true),
						className: "flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							unlockedCount,
							"/",
							stats.badges.length
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
					})]
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: badgeModalOpen,
		onOpenChange: setBadgeModalOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md max-h-[85vh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5 text-amber-500" }), " Galeria de Conquistas do Aluno"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Insígnias conquistadas automaticamente conforme a assiduidade e disciplina nos treinos."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2.5",
					children: stats.badges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-start gap-3 rounded-xl border p-3 transition-all ${badge.unlocked ? "border-amber-500/30 bg-amber-500/5 shadow-2xs" : "border-border/60 bg-muted/20 opacity-50 grayscale"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl shrink-0 mt-0.5",
							children: badge.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-bold text-foreground",
									children: badge.title
								}), badge.unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full",
									children: "Conquistado"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full",
									children: "Bloqueado"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: badge.description
							})]
						})]
					}, badge.id))
				})]
			})]
		})
	})] });
}
function WorkoutStoryModal({ open, onOpenChange, data }) {
	const storyRef = (0, import_react.useRef)(null);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	if (!data) return null;
	const durationMin = data.timerSeconds ? Math.floor(data.timerSeconds / 60) : null;
	const loadEntries = Object.entries(data.loads || {}).slice(0, 4);
	const handleDownloadImage = async () => {
		if (!storyRef.current) return;
		setExporting(true);
		try {
			const dataUrl = await toPng(storyRef.current, {
				pixelRatio: 3,
				cacheBust: true
			});
			const a = document.createElement("a");
			a.href = dataUrl;
			a.download = `treino-${data.studentName.toLowerCase().replace(/\s+/g, "-")}-${data.executedAt.slice(0, 10)}.png`;
			a.click();
			toast.success("Imagem gerada em alta resolução para seus Stories!");
		} catch (err) {
			toast.error(`Erro ao gerar imagem: ${err.message}`);
		}
		setExporting(false);
	};
	const handleNativeShare = async () => {
		if (!storyRef.current) return;
		setExporting(true);
		try {
			const blob = await toBlob(storyRef.current, {
				pixelRatio: 3,
				cacheBust: true
			});
			if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], "treino.png", { type: "image/png" })] })) {
				const file = new File([blob], "treino-coach-montanha.png", { type: "image/png" });
				await navigator.share({
					title: `Treino de ${data.studentName} no Studio Coach Montanha`,
					text: `Treino concluído com sucesso! ⚡🏋️‍♂️`,
					files: [file]
				});
				toast.success("Compartilhado com sucesso!");
			} else await handleDownloadImage();
		} catch (err) {
			if (err.name !== "AbortError") toast.error(`Erro ao compartilhar: ${err.message}`);
		}
		setExporting(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md max-h-[95vh] overflow-y-auto p-4 sm:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "flex items-center justify-between text-base",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-amber-500" }), " Story de Vitória (9:16)"]
				})
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center space-y-4 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: storyRef,
					className: "relative w-[300px] h-[533px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 text-white select-none border border-white/10",
					style: { background: "linear-gradient(145deg, #09090b 0%, #18181b 45%, #050505 100%)" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 w-48 h-48 bg-primary/25 rounded-full blur-3xl pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-extrabold uppercase tracking-[0.25em] text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/25",
									children: "Studio Coach Montanha"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-medium text-zinc-400",
									children: formatDateBR(data.executedAt)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-400 font-medium",
									children: "Aluno em evolução:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-black tracking-tight text-white",
									children: data.studentName
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 my-auto space-y-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-amber-500 text-white shadow-lg shadow-primary/20 mx-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-8 w-8 stroke-[2.5]" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Missão Cumprida"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-extrabold text-white mt-0.5 leading-snug",
									children: data.workoutName || "Treino Personalizado"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 pt-2",
									children: [durationMin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-1 text-[10px] text-zinc-400 font-bold uppercase",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-3 w-3 text-primary" }), " Tempo"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-sm font-black text-white mt-0.5",
											children: [durationMin, " min"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-1 text-[10px] text-zinc-400 font-bold uppercase",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3 w-3 text-amber-400" }), " Foco"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-black text-white mt-0.5",
											children: "100% Pago"
										})]
									})]
								}),
								loadEntries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-left space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-bold uppercase tracking-wider text-zinc-400",
										children: "Cargas Principais:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5",
										children: loadEntries.map(([exId, load]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-amber-300",
											children: [
												"⚡ #",
												exId.slice(-4),
												": ",
												load
											]
										}, exId))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 border-t border-white/10 pt-3 text-center space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-bold tracking-wider text-white",
								children: "#VemProCoachMontanha"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[9px] text-zinc-500 font-medium",
								children: "Resultados Reais · Disciplina Diária"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full flex-col sm:flex-row gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						className: "flex-1",
						disabled: exporting,
						onClick: handleDownloadImage,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), exporting ? "Gerando PNG..." : "Baixar Imagem (Stories)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						disabled: exporting,
						onClick: handleNativeShare,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-4 w-4 mr-2 text-primary" }), " Compartilhar"]
					})]
				})]
			})]
		})
	});
}
async function generateStudentMonthlyReportPdf({ student, referenceDate, sessions, executions, coachNotes, coachName = "Studio Coach Montanha" }) {
	const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("../_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())), import("../_libs/jspdf-autotable.mjs").then((n) => n.t)]);
	const doc = new jsPDF({
		unit: "pt",
		format: "a4"
	});
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const margin = 40;
	const contentWidth = pageWidth - margin * 2;
	const monthYearLabel = format(referenceDate, "MMMM 'de' yyyy", { locale: ptBR });
	const monthYearFormatted = monthYearLabel.charAt(0).toUpperCase() + monthYearLabel.slice(1);
	const refYear = referenceDate.getFullYear();
	const refMonth = referenceDate.getMonth();
	const monthSessions = sessions.filter((s) => {
		const d = new Date(s.session_date);
		return d.getFullYear() === refYear && d.getMonth() === refMonth;
	});
	const monthExecutions = executions.filter((x) => {
		const d = new Date(x.executed_at);
		return d.getFullYear() === refYear && d.getMonth() === refMonth;
	});
	const completedSessions = monthSessions.filter((s) => s.status === "completed").length;
	const totalMonthWorkouts = Math.max(completedSessions, monthExecutions.length);
	const gamification = calculateGamificationStats(sessions, executions);
	const allPrs = detectPersonalRecords(executions);
	const assessments = await getStudentAssessments(student.id);
	let totalTonnageKg = 0;
	for (const exec of monthExecutions) {
		if (!exec.notes) continue;
		try {
			const parsed = typeof exec.notes === "string" ? JSON.parse(exec.notes) : exec.notes;
			if (parsed.loads && typeof parsed.loads === "object") for (const val of Object.values(parsed.loads)) {
				const num = parseFloat(String(val).replace(",", ".").replace(/[^\d.]/g, ""));
				if (!isNaN(num) && num > 0 && num < 1e3) totalTonnageKg += num * 30;
			}
		} catch {}
	}
	let y = margin;
	doc.setFillColor(15, 23, 42);
	doc.roundedRect(margin, y, contentWidth, 68, 8, 8, "F");
	doc.setFillColor(234, 179, 8);
	doc.rect(margin, y, contentWidth, 4, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(16);
	doc.text("STUDIO COACH MONTANHA", 58, y + 28);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.setTextColor(203, 213, 225);
	doc.text("RELATÓRIO MENSAL DE DESEMPENHO E EVOLUÇÃO FÍSICA", 58, y + 44);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(11);
	doc.setTextColor(250, 204, 21);
	doc.text(monthYearFormatted, pageWidth - margin - 18, y + 36, { align: "right" });
	y += 84;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(11);
	doc.setTextColor(15, 23, 42);
	doc.text("PERFIL DO ALUNO", margin, y);
	y += 6;
	autoTable(doc, {
		startY: y,
		margin: {
			left: margin,
			right: margin
		},
		theme: "plain",
		styles: {
			fontSize: 9,
			cellPadding: 3,
			textColor: [
				30,
				41,
				59
			]
		},
		columnStyles: {
			0: {
				fontStyle: "bold",
				cellWidth: 90,
				textColor: [
					100,
					116,
					139
				]
			},
			1: {
				fontStyle: "normal",
				cellWidth: 170
			},
			2: {
				fontStyle: "bold",
				cellWidth: 90,
				textColor: [
					100,
					116,
					139
				]
			},
			3: { fontStyle: "normal" }
		},
		body: [
			[
				"Aluno:",
				student.name,
				"Plano / Contrato:",
				student.planName || "Personal Trainer Individual"
			],
			[
				"Objetivo:",
				student.goal || "Condicionamento e Hipertrofia",
				"Nível & Liga:",
				`${gamification.level.name} (${gamification.currentStreakWeeks} semanas ativas)`
			],
			[
				"Emissão:",
				formatDateBR(/* @__PURE__ */ new Date()),
				"Preparador Físico:",
				coachName
			]
		]
	});
	y = doc.lastAutoTable.finalY + 16;
	const boxWidth = (contentWidth - 24) / 4;
	const boxHeight = 46;
	[
		{
			label: "TREINOS NO MÊS",
			val: `${totalMonthWorkouts} sessões`,
			color: [
				14,
				165,
				233
			]
		},
		{
			label: "TONELAGEM TOTAL",
			val: totalTonnageKg > 0 ? `${Math.round(totalTonnageKg).toLocaleString("pt-BR")} kg` : "Consistente",
			color: [
				234,
				179,
				8
			]
		},
		{
			label: "FOGO CONSISTÊNCIA",
			val: `${gamification.currentStreakWeeks} sem. seguidas`,
			color: [
				249,
				115,
				22
			]
		},
		{
			label: "CONQUISTAS",
			val: `${gamification.badges.filter((badge) => badge.unlocked).length}/8 medalhas`,
			color: [
				168,
				85,
				247
			]
		}
	].forEach((kpi, idx) => {
		const bx = margin + idx * (boxWidth + 8);
		doc.setFillColor(248, 250, 252);
		doc.setDrawColor(226, 232, 240);
		doc.roundedRect(bx, y, boxWidth, boxHeight, 6, 6, "FD");
		doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
		doc.rect(bx, y, 3, boxHeight, "F");
		doc.setFont("helvetica", "bold");
		doc.setFontSize(7.5);
		doc.setTextColor(100, 116, 139);
		doc.text(kpi.label, bx + 8, y + 15);
		doc.setFontSize(11);
		doc.setTextColor(15, 23, 42);
		doc.text(kpi.val, bx + 8, y + 33);
	});
	y += 66;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(11);
	doc.setTextColor(15, 23, 42);
	doc.text("HALL DA FAMA: RECORDES & CARGAS DE DESTAQUE", margin, y);
	y += 6;
	const topPrs = allPrs.slice(0, 5);
	const prRows = topPrs.length > 0 ? topPrs.map((pr) => [
		pr.exerciseName,
		`${pr.maxLoad} kg`,
		`${pr.maxLoad} kg`,
		formatDateBR(pr.achievedAt),
		"Recorde Consolidado"
	]) : [
		[
			"Supino Reto",
			"60 kg",
			"74 kg",
			formatDateBR(/* @__PURE__ */ new Date()),
			"Referência"
		],
		[
			"Agachamento Livre",
			"80 kg",
			"98 kg",
			formatDateBR(/* @__PURE__ */ new Date()),
			"Referência"
		],
		[
			"Puxada Alta",
			"55 kg",
			"68 kg",
			formatDateBR(/* @__PURE__ */ new Date()),
			"Referência"
		]
	];
	autoTable(doc, {
		startY: y,
		margin: {
			left: margin,
			right: margin
		},
		head: [[
			"Exercício",
			"Carga Máx.",
			"1RM Estimada",
			"Data do Recorde",
			"Status"
		]],
		body: prRows,
		theme: "striped",
		headStyles: {
			fillColor: [
				15,
				23,
				42
			],
			textColor: 255,
			fontStyle: "bold",
			fontSize: 8.5
		},
		styles: {
			fontSize: 8.5,
			cellPadding: 4.5
		}
	});
	y = doc.lastAutoTable.finalY + 18;
	if (assessments.length > 0) {
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		doc.setTextColor(15, 23, 42);
		doc.text("ACOMPANHAMENTO ANTROPOMÉTRICO (AVALIAÇÃO FÍSICA)", margin, y);
		y += 6;
		const latest = assessments[0];
		const initial = assessments[assessments.length - 1];
		const initialBmi = initial.weight && initial.height ? calculateBMI(initial.weight, initial.height) : null;
		const latestBmi = latest.weight && latest.height ? calculateBMI(latest.weight, latest.height) : null;
		const initialCat = initialBmi ? getBMICategory(initialBmi).label : "";
		const latestCat = latestBmi ? getBMICategory(latestBmi).label : "";
		const weightDiff = (latest.weight ?? 0) - (initial.weight ?? 0);
		const weightDiffLabel = weightDiff === 0 ? "0 kg" : `${weightDiff > 0 ? "+" : ""}${weightDiff.toFixed(1)} kg`;
		autoTable(doc, {
			startY: y,
			margin: {
				left: margin,
				right: margin
			},
			head: [[
				"Parâmetro Antropométrico",
				"Início",
				"Última Medição",
				"Evolução"
			]],
			body: [
				[
					"Peso Corporal",
					initial.weight ? `${initial.weight} kg` : "-",
					latest.weight ? `${latest.weight} kg` : "-",
					weightDiffLabel
				],
				[
					"Índice de Massa Corporal (IMC)",
					initialBmi ? `${initialBmi} (${initialCat})` : "-",
					latestBmi ? `${latestBmi} (${latestCat})` : "-",
					latestCat || "Estável"
				],
				[
					"Gordura Corporal (%)",
					initial.body_fat_percentage ? `${initial.body_fat_percentage}%` : "-",
					latest.body_fat_percentage ? `${latest.body_fat_percentage}%` : "-",
					latest.body_fat_percentage ? "Em acompanhamento" : "-"
				],
				[
					"Circunferência Abdominal / Cintura",
					initial.waist ? `${initial.waist} cm` : "-",
					latest.waist ? `${latest.waist} cm` : "-",
					latest.waist ? "Medição Atualizada" : "-"
				]
			],
			theme: "grid",
			headStyles: {
				fillColor: [
					51,
					65,
					85
				],
				textColor: 255,
				fontStyle: "bold",
				fontSize: 8.5
			},
			styles: {
				fontSize: 8.5,
				cellPadding: 4
			}
		});
		y = doc.lastAutoTable.finalY + 18;
	}
	const defaultNotes = coachNotes || `Parabéns pelo comprometimento ao longo de ${monthYearFormatted}! A adesão aos treinos foi exemplar, mantendo a consistência e superando marcas importantes. Para o próximo ciclo, nosso foco será a progressão de sobrecarga regenerativa e aprimoramento da técnica nos movimentos principais. Seguimos fortes rumo ao objetivo!`;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(10.5);
	doc.setTextColor(15, 23, 42);
	doc.text("PARECER TÉCNICO & DIRETRIZES DO TREINADOR", margin, y);
	y += 6;
	doc.setFillColor(248, 250, 252);
	doc.setDrawColor(203, 213, 225);
	doc.roundedRect(margin, y, contentWidth, 60, 6, 6, "FD");
	doc.setFont("helvetica", "italic");
	doc.setFontSize(8.5);
	doc.setTextColor(51, 65, 85);
	const splitNotes = doc.splitTextToSize(defaultNotes, contentWidth - 20);
	doc.text(splitNotes, 50, y + 16);
	y += 82;
	const signY = Math.min(y, pageHeight - 50);
	doc.setDrawColor(148, 163, 184);
	doc.line(90, signY + 14, 300, signY + 14);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(9);
	doc.setTextColor(15, 23, 42);
	doc.text(coachName, 195, signY + 26, { align: "center" });
	doc.setFont("helvetica", "normal");
	doc.setFontSize(7.5);
	doc.setTextColor(100, 116, 139);
	doc.text("Preparador Físico & Personal Trainer", 195, signY + 36, { align: "center" });
	doc.text(`Relatório emitido em ${formatDateBR(/* @__PURE__ */ new Date())} · Studio Coach Montanha`, pageWidth - margin, signY + 36, { align: "right" });
	const fileName = `relatorio-mensal-${student.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${refYear}-${String(refMonth + 1).padStart(2, "0")}.pdf`;
	doc.save(fileName);
}
function StudentMonthlyReportDialog({ open, onOpenChange, student, sessions, executions }) {
	const [selectedMonthOffset, setSelectedMonthOffset] = (0, import_react.useState)("0");
	const [coachNotes, setCoachNotes] = (0, import_react.useState)("");
	const [isGenerating, setIsGenerating] = (0, import_react.useState)(false);
	const monthOptions = Array.from({ length: 6 }, (_, i) => {
		const date = subMonths(/* @__PURE__ */ new Date(), i);
		const label = format(date, "MMMM 'de' yyyy", { locale: ptBR });
		return {
			value: String(i),
			date,
			label: label.charAt(0).toUpperCase() + label.slice(1)
		};
	});
	const selectedDate = subMonths(/* @__PURE__ */ new Date(), parseInt(selectedMonthOffset, 10));
	const refYear = selectedDate.getFullYear();
	const refMonth = selectedDate.getMonth();
	const monthSessions = sessions.filter((s) => {
		const d = new Date(s.session_date);
		return d.getFullYear() === refYear && d.getMonth() === refMonth && s.status === "completed";
	});
	const monthExecutions = executions.filter((x) => {
		const d = new Date(x.executed_at);
		return d.getFullYear() === refYear && d.getMonth() === refMonth;
	});
	const totalWorkouts = Math.max(monthSessions.length, monthExecutions.length);
	const handleGeneratePdf = async () => {
		setIsGenerating(true);
		try {
			await generateStudentMonthlyReportPdf({
				student,
				referenceDate: selectedDate,
				sessions,
				executions,
				coachNotes: coachNotes.trim() || void 0,
				coachName: "Studio Coach Montanha"
			});
			toast.success("Relatório executivo em PDF gerado com sucesso!", { icon: "📄" });
			onOpenChange(false);
		} catch (err) {
			toast.error(`Falha ao gerar relatório: ${err?.message || "Tente novamente"}`);
		} finally {
			setIsGenerating(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Documentação Profissional" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-xl font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 text-primary" }), "Relatório Mensal do Aluno"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Gere um documento executivo em PDF de alto padrão contendo frequência, tonelagem levantada, PRs de carga, histórico antropométrico e parecer do treinador." })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold",
								children: "Mês de Referência"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedMonthOffset,
								onValueChange: setSelectedMonthOffset,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o mês" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: monthOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: opt.value,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground" }), opt.label]
									})
								}, opt.value)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2.5 rounded-2xl bg-muted/40 border border-border/80 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wider block",
								children: "Treinos no Mês"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-xl font-black text-foreground",
								children: [totalWorkouts, " sessões"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wider block",
								children: "Aluno Selecionado"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-primary truncate block",
								children: student.name
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Parecer Técnico & Diretrizes do Treinador"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: "Opcional"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									placeholder: "Ex: Excelente evolução de força no supino e agachamento. Manter o foco na cadência excêntrica e na hidratação para o próximo ciclo...",
									className: "min-h-[90px] text-xs resize-y",
									value: coachNotes,
									onChange: (e) => setCoachNotes(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Se deixado em branco, uma mensagem padrão de parabéns e incentivo técnico será inserida no PDF."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2 sm:gap-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						disabled: isGenerating,
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handleGeneratePdf,
						disabled: isGenerating,
						className: "gap-1.5 font-bold shadow-md shadow-primary/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), isGenerating ? "Gerando Relatório..." : "Baixar Relatório PDF"]
					})]
				})
			]
		})
	});
}
function AnamnesisTab({ studentId }) {
	const qc = useQueryClient();
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const { data: anamnesis, isLoading } = useQuery({
		queryKey: ["pt-student-anamnesis", studentId],
		queryFn: () => getStudentAnamnesis(studentId)
	});
	const [form, setForm] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (anamnesis) setForm(anamnesis);
		else setForm({
			parq_heart_condition: false,
			parq_chest_pain_activity: false,
			parq_chest_pain_rest: false,
			parq_dizziness: false,
			parq_bone_joint_problem: false,
			parq_blood_pressure_meds: false,
			parq_other_reason: false,
			joint_spine: false,
			joint_knee: false,
			joint_shoulder: false,
			joint_hip: false,
			joint_ankle: false,
			risk_level: "low"
		});
	}, [anamnesis, dialogOpen]);
	const handleSave = async () => {
		setSaving(true);
		try {
			await saveStudentAnamnesis(studentId, form);
			toast.success("Anamnese e questionário de prontidão salvos com sucesso!", { icon: "🩺" });
			qc.invalidateQueries({ queryKey: ["pt-student-anamnesis", studentId] });
			setDialogOpen(false);
		} catch (err) {
			toast.error(`Erro ao salvar anamnese: ${err?.message || "Tente novamente"}`);
		} finally {
			setSaving(false);
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm text-muted-foreground p-6",
		children: "Carregando dados da anamnese..."
	});
	const alerts = extractClinicalAlerts(anamnesis);
	const isHighRisk = anamnesis?.risk_level === "high";
	const isModerateRisk = anamnesis?.risk_level === "moderate";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { className: "h-5 w-5 text-primary" }), "Anamnese Digital & Questionário PAR-Q"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Avaliação de prontidão para atividade física, restrições articulares e histórico de saúde do aluno."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setDialogOpen(true),
					className: "gap-1.5 font-bold shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-4 w-4" }), anamnesis ? "Editar Anamnese" : "Preencher Anamnese"]
				})]
			}),
			!anamnesis ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-8 text-center bg-muted/20 border-dashed rounded-3xl space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-md mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-foreground",
							children: "Nenhuma anamnese registrada ainda"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Cadastre o questionário de prontidão para atividade física (PAR-Q) e mapeie restrições ortopédicas para gerar alertas automáticos nos treinos."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setDialogOpen(true),
						variant: "outline",
						className: "mt-2 text-xs font-bold",
						children: "Cadastrar Primeira Anamnese"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-3xl border p-5 sm:p-6 transition-all", isHighRisk ? "border-red-500/40 bg-red-500/[0.04]" : isModerateRisk ? "border-amber-500/40 bg-amber-500/[0.04]" : "border-emerald-500/40 bg-emerald-500/[0.04]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("flex h-12 w-12 items-center justify-center rounded-2xl", isHighRisk ? "bg-red-500/20 text-red-600 dark:text-red-400" : isModerateRisk ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"),
								children: isHighRisk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-6 w-6" }) : isModerateRisk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-6 w-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Grau de Risco para Exercício"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded-full px-2.5 py-0.5 text-xs font-black uppercase tracking-wider", isHighRisk ? "bg-red-500 text-white" : isModerateRisk ? "bg-amber-500 text-black" : "bg-emerald-500 text-white"),
									children: isHighRisk ? "Alto Risco" : isModerateRisk ? "Risco Moderado" : "Baixo Risco (Apto)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-semibold text-foreground",
								children: isHighRisk ? "Atenção: O aluno relatou condições cardíacas ou desconfortos no peito. Recomenda-se liberação médica formal." : isModerateRisk ? "O aluno possui histórico de dores articulares ou uso de medicamentos. Ajuste as sobrecargas nos exercícios." : "Aluno liberado para práticas de intensidade moderada e avançada sem restrições preliminares."
							})] })]
						}), anamnesis.updated_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground font-mono",
							children: ["Última atualização: ", formatDateBR(anamnesis.updated_at)]
						})]
					}), alerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 pt-4 border-t border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2",
							children: "Alertas Ativos vinculados aos treinos:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: alerts.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300",
								children: ["⚠️ ", a]
							}, i))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5 sm:p-6 space-y-4 rounded-3xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-base font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-primary" }), "Respostas PAR-Q (Prontidão Internacional)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2.5",
							children: PARQ_QUESTIONS.map((q) => {
								const isYes = Boolean(anamnesis[q.key]);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("flex items-start justify-between gap-3 p-3 rounded-2xl border text-xs transition-all", isYes ? "border-red-500/40 bg-red-500/[0.04]" : "border-border/60 bg-muted/20"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1 text-foreground/90 font-medium leading-snug",
										children: q.question
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("rounded-md px-2 py-0.5 font-bold uppercase text-[10px] shrink-0", isYes ? "bg-red-500 text-white" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"),
										children: isYes ? "Sim" : "Não"
									})]
								}, q.key);
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5 sm:p-6 space-y-4 rounded-3xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-base font-bold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bone, { className: "h-4 w-4 text-primary" }), "Mapeamento de Articulações & Lesões"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
									children: [
										{
											key: "joint_spine",
											label: "Coluna / Lombar"
										},
										{
											key: "joint_knee",
											label: "Joelhos"
										},
										{
											key: "joint_shoulder",
											label: "Ombros"
										},
										{
											key: "joint_hip",
											label: "Quadril"
										},
										{
											key: "joint_ankle",
											label: "Tornozelos"
										}
									].map((j) => {
										const active = Boolean(anamnesis[j.key]);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: cn("flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all", active ? "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300" : "border-border/60 bg-muted/20 text-muted-foreground"),
											children: [active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-amber-500 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-muted-foreground/40 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: j.label })]
										}, j.key);
									})
								}),
								anamnesis.orthopedic_injuries && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-muted/40 border p-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-muted-foreground uppercase text-[10px] block mb-1",
										children: "Lesões e Dores Específicas"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-foreground leading-relaxed whitespace-pre-wrap",
										children: anamnesis.orthopedic_injuries
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5 sm:p-6 space-y-3.5 rounded-3xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-base font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "h-4 w-4 text-primary" }), "Histórico Médico & Rotina"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5 text-xs",
								children: [
									anamnesis.medical_conditions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border bg-muted/20 p-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-muted-foreground block text-[10px] uppercase",
											children: "Condições Médicas / Patologias"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: anamnesis.medical_conditions
										})]
									}),
									anamnesis.medications && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border bg-muted/20 p-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-muted-foreground block text-[10px] uppercase",
											children: "Medicamentos de Uso Contínuo"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: anamnesis.medications
										})]
									}),
									anamnesis.contraindications && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-red-500/30 bg-red-500/[0.04] p-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-red-600 dark:text-red-400 block text-[10px] uppercase",
											children: "Contraindicações / Exercícios a Evitar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-medium",
											children: anamnesis.contraindications
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border bg-muted/20 p-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-muted-foreground block text-[10px] uppercase",
												children: "Horas de Sono"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-bold",
												children: anamnesis.sleep_hours ? `${anamnesis.sleep_hours}h por noite` : "Não informado"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border bg-muted/20 p-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-muted-foreground block text-[10px] uppercase",
												children: "Nível de Estresse"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-bold capitalize",
												children: anamnesis.stress_level || "Moderado"
											})]
										})]
									})
								]
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-xl font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { className: "h-5 w-5 text-primary" }), "Formulário de Anamnese & PAR-Q"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Preencha o questionário de prontidão e mapeie restrições físicas para gerar alertas automáticos." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs font-bold uppercase tracking-wider text-primary",
										children: "1. Questionário de Prontidão (PAR-Q)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2 rounded-2xl border bg-muted/20 p-3",
										children: PARQ_QUESTIONS.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-3 py-1 border-b border-border/40 last:border-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												id: q.key,
												checked: Boolean(form[q.key]),
												onCheckedChange: (c) => setForm((prev) => ({
													...prev,
													[q.key]: Boolean(c)
												})),
												className: "mt-0.5"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: q.key,
												className: "text-xs font-normal leading-relaxed cursor-pointer flex-1",
												children: q.question
											})]
										}, q.key))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-primary",
											children: "2. Articulações com Dor ou Histórico de Lesão"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5",
											children: [
												{
													key: "joint_spine",
													label: "Coluna / Lombar"
												},
												{
													key: "joint_knee",
													label: "Joelhos"
												},
												{
													key: "joint_shoulder",
													label: "Ombros"
												},
												{
													key: "joint_hip",
													label: "Quadril"
												},
												{
													key: "joint_ankle",
													label: "Tornozelos"
												}
											].map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 rounded-xl border p-2.5 bg-muted/20",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
													id: j.key,
													checked: Boolean(form[j.key]),
													onCheckedChange: (c) => setForm((prev) => ({
														...prev,
														[j.key]: Boolean(c)
													}))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: j.key,
													className: "text-xs cursor-pointer font-medium",
													children: j.label
												})]
											}, j.key))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Detalhes de Lesões Ortopédicas / Cirurgias"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												placeholder: "Ex: Hérnia discal L4-L5 diagnosticada em 2024, condromalácia patelar grau 2 no joelho direito...",
												value: form.orthopedic_injuries || "",
												onChange: (e) => setForm((prev) => ({
													...prev,
													orthopedic_injuries: e.target.value
												})),
												className: "text-xs min-h-[70px]"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-primary",
											children: "3. Condições Médicas, Medicamentos & Estilo de Vida"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid sm:grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Condições Médicas / Patologias"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Ex: Hipertensão, Asma...",
													value: form.medical_conditions || "",
													onChange: (e) => setForm((prev) => ({
														...prev,
														medical_conditions: e.target.value
													})),
													className: "h-9 text-xs"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Medicamentos de Uso Contínuo"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Ex: Losartana 50mg...",
													value: form.medications || "",
													onChange: (e) => setForm((prev) => ({
														...prev,
														medications: e.target.value
													})),
													className: "h-9 text-xs"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Exercícios Contraindicados / Evitar no Treino"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Ex: Não prescrever agachamento livre pesado nem supino declinado...",
												value: form.contraindications || "",
												onChange: (e) => setForm((prev) => ({
													...prev,
													contraindications: e.target.value
												})),
												className: "h-9 text-xs"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Horas de Sono por Noite"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													step: "0.5",
													placeholder: "Ex: 7.5",
													value: form.sleep_hours || "",
													onChange: (e) => setForm((prev) => ({
														...prev,
														sleep_hours: parseFloat(e.target.value) || null
													})),
													className: "h-9 text-xs"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Nível de Estresse Habitual"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: form.stress_level || "moderate",
													onValueChange: (val) => setForm((prev) => ({
														...prev,
														stress_level: val
													})),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														className: "h-9 text-xs",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "low",
															children: "Baixo (Tranquilo)"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "moderate",
															children: "Moderado"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "high",
															children: "Alto (Estressante)"
														})
													] })]
												})]
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setDialogOpen(false),
								disabled: saving,
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleSave,
								disabled: saving,
								className: "font-bold",
								children: saving ? "Salvando..." : "Salvar Anamnese"
							})]
						})
					]
				})
			})
		]
	});
}
function generateWorkoutWhatsAppFeedback({ studentName, workoutName, timerSeconds = 0, loads = {}, totalExercisesDone = 0, newPrsCount = 0 }) {
	const firstName = studentName.trim().split(" ")[0];
	const timeFormatted = timerSeconds > 0 ? formatSeconds(timerSeconds) : "45:00";
	let maxLoad = 0;
	let totalVolumeKg = 0;
	for (const v of Object.values(loads)) {
		const num = parseFloat(String(v).replace(",", ".").replace(/[^\d.]/g, ""));
		if (!isNaN(num) && num > 0) {
			if (num > maxLoad) maxLoad = num;
			totalVolumeKg += num * 30;
		}
	}
	const parts = [];
	parts.push(`Fala, *${firstName}*! Tudo bem? 🔥`);
	parts.push(`Passando para parabenizar pelo treinão de hoje: *${workoutName}*! 👏`);
	parts.push("");
	parts.push("📊 *Resumo da sua sessão:*");
	if (timerSeconds > 0) parts.push(`⏱️ Duração: *${timeFormatted}*`);
	if (totalExercisesDone > 0) parts.push(`✅ Exercícios concluídos: *${totalExercisesDone}*`);
	if (maxLoad > 0) parts.push(`💥 Maior carga do dia: *${maxLoad} kg*`);
	if (totalVolumeKg > 0) parts.push(`🏋️ Tonelagem acumulada: *${Math.round(totalVolumeKg).toLocaleString("pt-BR")} kg levantados*`);
	if (newPrsCount > 0) parts.push(`🏆 *${newPrsCount} novo(s) recorde(s) de carga atingido(s)! Sensacional!*`);
	parts.push("");
	parts.push("💪 *Orientações pós-treino:*");
	parts.push("Capricha na hidratação, alimentação proteica e no descanso regenerativo hoje. Cada treino conta para a sua meta!");
	parts.push("");
	parts.push("Nos vemos no próximo treino! 🚀");
	parts.push("_Studio Coach Montanha — Excelência em Treinamento_");
	return parts.join("\n");
}
function createWhatsAppUrl(phone, text) {
	if (!text) return "";
	let cleanPhone = phone ? phone.replace(/\D/g, "") : "";
	if (cleanPhone && cleanPhone.length >= 10 && cleanPhone.length <= 11) cleanPhone = `55${cleanPhone}`;
	const encodedText = encodeURIComponent(text);
	if (cleanPhone) return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
	return `https://api.whatsapp.com/send?text=${encodedText}`;
}
var CLINICAL_EXERCISE_RULES = [
	{
		joint: "Coluna / Lombar",
		contraindicated: [
			"Agachamento livre pesado",
			"Levantamento terra",
			"Desenvolvimento militar em pé",
			"Remada curvada livre"
		],
		safeAlternatives: [
			"Leg press 45° com apoio lombar",
			"Elevação pélvica no banco",
			"Desenvolvimento sentado com encosto",
			"Remada baixa articulada"
		],
		reason: "Reduz a compressão axial nos discos intervertebrais e estabiliza a lombar."
	},
	{
		joint: "Joelhos",
		contraindicated: [
			"Cadeira extensora pesada final de amplitude",
			"Agachamento profundo sissy",
			"Passada com avanço descontrolado"
		],
		safeAlternatives: [
			"Agachamento búlgaro controlado",
			"Leg press horizontal",
			"Stiff e mesa flexora (foco cadeia posterior)"
		],
		reason: "Protege a cartilagem retropatelar e evita forças de cisalhamento anteriores."
	},
	{
		joint: "Ombros",
		contraindicated: [
			"Desenvolvimento com barra atrás da nuca",
			"Puxada atrás da nuca",
			"Supino com amplitude hiperestendida"
		],
		safeAlternatives: [
			"Supino com halteres pegada neutra",
			"Puxada frontal pronada/neutra",
			"Elevação lateral no plano escapular"
		],
		reason: "Evita impacto subacromial e protege os tendões do manguito rotador."
	}
];
function loadCoachMemory(studentId) {
	if (typeof window === "undefined") return null;
	const raw = localStorage.getItem(`coach_memory_${studentId}`);
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function saveCoachMemory(studentId, data) {
	if (typeof window === "undefined") return;
	try {
		const serialized = JSON.stringify(data);
		localStorage.setItem(`coach_memory_${studentId}`, serialized);
	} catch {}
}
function CoachAiCopilotDialog({ open, onOpenChange, student, latestExecution, anamnesis }) {
	const [memory, setMemory] = (0, import_react.useState)(() => loadCoachMemory(student.id) || {});
	const [feedbackText, setFeedbackText] = (0, import_react.useState)(memory.lastFeedback || generateWorkoutWhatsAppFeedback({
		studentName: student.name,
		studentPhone: student.phone,
		workoutName: latestExecution?.pt_training_days?.name || "Treino Personal",
		timerSeconds: (() => {
			let parsed = {};
			if (latestExecution?.notes) try {
				parsed = typeof latestExecution.notes === "string" ? JSON.parse(latestExecution.notes) : latestExecution.notes;
			} catch {}
			return parsed.timerSeconds || 0;
		})(),
		loads: (() => {
			let parsed = {};
			if (latestExecution?.notes) try {
				parsed = typeof latestExecution.notes === "string" ? JSON.parse(latestExecution.notes) : latestExecution.notes;
			} catch {}
			return parsed.loads || {};
		})(),
		totalExercisesDone: (() => {
			let parsed = {};
			if (latestExecution?.notes) try {
				parsed = typeof latestExecution.notes === "string" ? JSON.parse(latestExecution.notes) : latestExecution.notes;
			} catch {}
			return Array.isArray(parsed.doneExercises) ? parsed.doneExercises.length : 0;
		})()
	}));
	(0, import_react.useEffect)(() => {
		if (open) saveCoachMemory(student.id, {
			...memory,
			lastFeedback: feedbackText
		});
	}, [feedbackText, open]);
	(0, import_react.useEffect)(() => {
		if (!open) setMemory(loadCoachMemory(student.id) || {});
	}, [open, student.id]);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(feedbackText);
			setCopied(true);
			toast.success("Mensagem copiada para a área de transferência!");
			setTimeout(() => setCopied(false), 2e3);
		} catch {
			toast.error("Não foi possível copiar o texto.");
		}
	};
	const handleSendWhatsApp = () => {
		const url = createWhatsAppUrl(student.phone, feedbackText);
		if (!url) return;
		window.open(url, "_blank", "noopener,noreferrer");
		toast.success("Abrindo WhatsApp...", { icon: "💬" });
	};
	const clinicalAlerts = extractClinicalAlerts(anamnesis);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Assistente do Treinador" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-xl font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-amber-500" }), "Coach AI Copilot"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Gere mensagens técnicas para envio no WhatsApp e consulte diretrizes de prescrição segura com base na saúde do aluno." })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "feedback",
					className: "py-2 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "grid grid-cols-2 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "feedback",
								className: "gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), "Feedback WhatsApp"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "safety",
								className: "gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4" }), "Prescrição Segura"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "feedback",
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-muted/40 border p-3 flex items-center justify-between gap-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-muted-foreground uppercase text-[10px] block",
										children: "Destinatário"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-foreground",
										children: student.name
									}),
									student.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground ml-1.5",
										children: [
											"(",
											student.phone,
											")"
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-amber-600 dark:text-amber-400 ml-1.5",
										children: "(sem telefone cadastrado)"
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 font-bold text-[10px] border border-emerald-500/20",
									children: "Pós-treino"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mensagem Personalizada" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: handleCopy,
										className: "inline-flex items-center gap-1 text-primary hover:underline font-bold",
										children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copied ? "Copiado!" : "Copiar Texto"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: feedbackText,
									onChange: (e) => setFeedbackText(e.target.value),
									className: "min-h-[190px] text-xs font-sans leading-relaxed resize-y"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "safety",
							className: "space-y-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border bg-muted/20 p-4 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm font-bold text-foreground",
										children: "Restrições Mapeadas do Aluno"
									})]
								}), clinicalAlerts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: clinicalAlerts.map((alert, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300",
										children: ["⚠️ ", alert]
									}, idx))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Nenhuma restrição articular ou clínica severa cadastrada na anamnese. Aluno apto para prescrição padrão."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground block",
									children: "Regras Biomecânicas Recomendadas pelo Copilot:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2 text-xs",
									children: CLINICAL_EXERCISE_RULES.map((rule, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border p-3 bg-card space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-bold text-foreground flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rule.joint })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground text-[11px] leading-relaxed",
												children: rule.reason
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pt-1 flex flex-wrap gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mr-1",
													children: "Preferir:"
												}), rule.safeAlternatives.map((alt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground",
													children: alt
												}, i))]
											})
										]
									}, idx))
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2 sm:gap-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Fechar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handleSendWhatsApp,
						className: "gap-1.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), "Enviar no WhatsApp"]
					})]
				})
			]
		})
	});
}
var Timeline = import_react.forwardRef(({ className, children, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: cn("relative space-y-6", className),
		...props,
		children
	});
});
Timeline.displayName = "Timeline";
var TimelineItem = import_react.forwardRef(({ className, children, status = "default", ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-status": status,
		className: cn("group relative flex gap-4 pb-6 last:pb-0", className),
		...props,
		children
	});
});
TimelineItem.displayName = "TimelineItem";
var TimelineConnector = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"aria-hidden": "true",
		className: cn("absolute left-3.5 top-7 -bottom-6 w-0.5 bg-border/80 group-last:hidden transition-colors", className),
		...props
	});
});
TimelineConnector.displayName = "TimelineConnector";
var variantStyles = {
	default: "border-border bg-background text-foreground",
	primary: "border-primary/30 bg-primary/10 text-primary ring-primary/20",
	success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
	warning: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
	destructive: "border-destructive/30 bg-destructive/10 text-destructive ring-destructive/20",
	muted: "border-border/60 bg-muted text-muted-foreground"
};
var TimelineIcon = import_react.forwardRef(({ className, children, variant = "primary", ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: cn("relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-xs ring-4 ring-background transition-all", variantStyles[variant], className),
		...props,
		children: children || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-current" })
	});
});
TimelineIcon.displayName = "TimelineIcon";
var TimelineContent = import_react.forwardRef(({ className, children, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: cn("flex-1 pt-0.5 min-w-0 space-y-2", className),
		...props,
		children
	});
});
TimelineContent.displayName = "TimelineContent";
var TimelineHeader = import_react.forwardRef(({ className, children, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: cn("flex flex-wrap items-center justify-between gap-2", className),
		...props,
		children
	});
});
TimelineHeader.displayName = "TimelineHeader";
var TimelineTitle = import_react.forwardRef(({ className, children, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
		ref,
		className: cn("text-sm font-semibold leading-tight text-foreground tracking-tight", className),
		...props,
		children
	});
});
TimelineTitle.displayName = "TimelineTitle";
var TimelineTime = import_react.forwardRef(({ className, children, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
		ref,
		className: cn("text-[11px] font-medium text-muted-foreground tabular-nums tracking-wide uppercase", className),
		...props,
		children
	});
});
TimelineTime.displayName = "TimelineTime";
var TimelineDescription = import_react.forwardRef(({ className, children, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		ref,
		className: cn("text-xs text-muted-foreground leading-relaxed", className),
		...props,
		children
	});
});
TimelineDescription.displayName = "TimelineDescription";
function PTStudentDetail() {
	const { id } = Route.useParams();
	const navigate = Route.useNavigate();
	const qc = useQueryClient();
	const [editStudent, setEditStudent] = (0, import_react.useState)(false);
	const [sessionOpen, setSessionOpen] = (0, import_react.useState)(false);
	const [editingSession, setEditingSession] = (0, import_react.useState)(null);
	const [paymentOpen, setPaymentOpen] = (0, import_react.useState)(false);
	const [editingPayment, setEditingPayment] = (0, import_react.useState)(null);
	const [bulkSessionsOpen, setBulkSessionsOpen] = (0, import_react.useState)(false);
	const [freezeOpen, setFreezeOpen] = (0, import_react.useState)(false);
	const [editingFreeze, setEditingFreeze] = (0, import_react.useState)(null);
	const [reportOpen, setReportOpen] = (0, import_react.useState)(false);
	const [copilotOpen, setCopilotOpen] = (0, import_react.useState)(false);
	const { data: anamnesis } = useQuery({
		queryKey: ["pt-student-anamnesis", id],
		queryFn: () => getStudentAnamnesis(id)
	});
	const clinicalAlerts = (0, import_react.useMemo)(() => extractClinicalAlerts(anamnesis), [anamnesis]);
	const { data: student } = useQuery({
		queryKey: ["pt-student", id],
		queryFn: async () => (await supabase.from("pt_students").select("*").eq("id", id).single()).data
	});
	const { data: sessions = [] } = useQuery({
		queryKey: ["pt-student-sessions", id],
		queryFn: async () => (await supabase.from("pt_sessions").select("*").eq("pt_student_id", id).order("session_date", { ascending: false })).data ?? []
	});
	const { data: executions = [] } = useQuery({
		queryKey: ["pt-student-executions", id],
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_executions").select("*, pt_training_days(name)").eq("pt_student_id", id).order("executed_at", { ascending: false });
			return data ?? [];
		}
	});
	const { data: freezes = [] } = useQuery({
		queryKey: ["pt-student-freezes", id],
		queryFn: async () => {
			const { data } = await supabase.from("payment_freezes").select("*").eq("student_id", id).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const { data: payments = [] } = useQuery({
		queryKey: ["pt-student-payments", id],
		queryFn: async () => {
			const { data: pays } = await supabase.from("pt_payments").select("*,pt_plans(name,billing_type,sessions_per_month,package_sessions)").eq("pt_student_id", id).is("deleted_at", null).order("payment_date", { ascending: false });
			if (!pays?.length) return [];
			const payIds = pays.map((p) => p.id);
			const { data: sessions } = await supabase.from("pt_sessions").select("id,pt_payment_id,status,session_date,pt_student_id").in("pt_payment_id", payIds).eq("status", "completed");
			const sessionsByPayment = /* @__PURE__ */ new Map();
			for (const s of sessions ?? []) {
				if (!s.pt_payment_id) continue;
				const arr = sessionsByPayment.get(s.pt_payment_id) ?? [];
				arr.push(s);
				sessionsByPayment.set(s.pt_payment_id, arr);
			}
			return pays.map((p) => {
				const contracted = p.sessions_paid ?? p.pt_plans?.sessions_per_month ?? p.pt_plans?.package_sessions ?? null;
				const linkedSessions = sessionsByPayment.get(p.id) ?? [];
				const used = linkedSessions.length;
				const remaining = contracted !== null ? contracted - used : null;
				return {
					...p,
					contracted,
					used,
					remaining,
					linkedSessions
				};
			});
		}
	});
	const parsedPartner = (0, import_react.useMemo)(() => parseStudentPartner(student?.notes), [student?.notes]);
	const { data: partnerStudent } = useQuery({
		queryKey: ["pt-student-partner", parsedPartner.partnerId],
		enabled: !!parsedPartner.partnerId,
		queryFn: async () => (await supabase.from("pt_students").select("id,name,phone").eq("id", parsedPartner.partnerId).single()).data
	});
	const { data: partnerPayments = [] } = useQuery({
		queryKey: ["pt-partner-payments", parsedPartner.partnerId],
		enabled: !!parsedPartner.partnerId,
		queryFn: async () => {
			const { data: pays } = await supabase.from("pt_payments").select("*,pt_plans(name,billing_type,sessions_per_month,package_sessions)").eq("pt_student_id", parsedPartner.partnerId).is("deleted_at", null).order("payment_date", { ascending: false });
			if (!pays?.length) return [];
			const payIds = pays.map((p) => p.id);
			const { data: sessions } = await supabase.from("pt_sessions").select("id,pt_payment_id,status,session_date,pt_student_id").in("pt_payment_id", payIds).eq("status", "completed");
			const sessionsByPayment = /* @__PURE__ */ new Map();
			for (const s of sessions ?? []) {
				if (!s.pt_payment_id) continue;
				const arr = sessionsByPayment.get(s.pt_payment_id) ?? [];
				arr.push(s);
				sessionsByPayment.set(s.pt_payment_id, arr);
			}
			return pays.map((p) => {
				const contracted = p.sessions_paid ?? p.pt_plans?.sessions_per_month ?? p.pt_plans?.package_sessions ?? null;
				const linkedSessions = sessionsByPayment.get(p.id) ?? [];
				const used = linkedSessions.length;
				const remaining = contracted !== null ? contracted - used : null;
				return {
					...p,
					contracted,
					used,
					remaining,
					linkedSessions,
					isShared: true
				};
			});
		}
	});
	const [completedPeriod, setCompletedPeriod] = (0, import_react.useState)("all");
	const kpis = (0, import_react.useMemo)(() => {
		const paidPayments = payments.filter((p) => p.status === "paid");
		const ltv = paidPayments.reduce((s, p) => s + Number(p.amount), 0);
		const now = /* @__PURE__ */ new Date();
		const ymNow = format(now, "yyyy-MM");
		const yNow = format(now, "yyyy");
		const completed = sessions.filter((s) => {
			if (s.status !== "completed") return false;
			if (completedPeriod === "all") return true;
			if (completedPeriod === "year") return s.session_date.startsWith(yNow);
			if (completedPeriod === "month") return s.session_date.startsWith(ymNow);
			return true;
		}).length;
		const totalCount = sessions.length || 1;
		const allCompleted = sessions.filter((s) => s.status === "completed").length;
		const rate = sessions.length ? allCompleted / totalCount * 100 : 0;
		const lastPkg = paidPayments.find((p) => (p.sessions_paid ?? 0) > 0 || p.pt_plans?.billing_type === "package");
		let pkgLabel = "—";
		let pkgFull = false;
		if (lastPkg) {
			const total = lastPkg.sessions_paid ?? lastPkg.pt_plans?.package_sessions ?? 0;
			const used = (lastPkg.linkedSessions ?? []).length;
			pkgLabel = `${used}/${total}`;
			pkgFull = total > 0 && used >= total;
		} else if (partnerPayments.length > 0) {
			const partnerLastPkg = partnerPayments.find((p) => p.status === "paid" && ((p.sessions_paid ?? 0) > 0 || p.pt_plans?.billing_type === "package"));
			if (partnerLastPkg) {
				const total = partnerLastPkg.contracted ?? 0;
				const used = partnerLastPkg.used ?? 0;
				pkgLabel = `${used}/${total} (Dupla)`;
				pkgFull = total > 0 && used >= total;
			}
		}
		return {
			ltv,
			completed,
			rate,
			pkgLabel,
			pkgFull
		};
	}, [
		payments,
		sessions,
		partnerPayments,
		completedPeriod
	]);
	const currentPlan = payments.find((p) => p.status === "paid")?.pt_plans?.name ?? (partnerPayments.find((p) => p.status === "paid")?.pt_plans?.name ? `${partnerPayments.find((p) => p.status === "paid")?.pt_plans?.name} (Dupla)` : void 0);
	if (!student) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm text-muted-foreground",
		children: "Carregando…"
	});
	const activeFreeze = freezes[0] ?? null;
	const isFrozen = student?.status === "paused";
	async function handleUnfreeze() {
		const { error } = await supabase.from("pt_students").update({ status: "active" }).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Plano destrancado e aluno PT reativado!");
		qc.invalidateQueries();
	}
	async function deleteSession(sId) {
		if (!await confirmDialog("Excluir aula?")) return;
		const { error } = await supabase.from("pt_sessions").delete().eq("id", sId);
		if (error) return toast.error(error.message);
		toast.success("Aula excluída");
		qc.invalidateQueries({ queryKey: ["pt-student-sessions", id] });
	}
	async function deletePayment(pId) {
		if (!await confirmDialog("Excluir pagamento? Ele ficará disponível na Lixeira para restauração.")) return;
		const { error } = await supabase.from("pt_payments").update({ deleted_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", pId);
		if (error) return toast.error(error.message);
		toast.success("Pagamento movido para a lixeira");
		qc.invalidateQueries({ queryKey: ["pt-student-payments", id] });
	}
	async function deleteStudent(sId) {
		if (!await confirmDialog("Excluir este aluno PT? Todos os dados (treinos, pagamentos) serão movidos para a Lixeira.")) return;
		const { error } = await supabase.from("pt_students").update({ deleted_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sId);
		if (error) return toast.error(error.message);
		toast.success("Aluno PT movido para a Lixeira");
		qc.invalidateQueries({ queryKey: ["pt-students-overview"] });
		navigate({ to: "/personal-trainer" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/personal-trainer",
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-bold tracking-tight",
								children: student.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTBadge, {})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTStudentStatusBadge, { status: student.status }),
								currentPlan && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
									children: currentPlan
								}),
								partnerStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/personal-trainer/students/$id",
									params: { id: partnerStudent.id },
									className: "inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }),
										"Dupla com ",
										partnerStudent.name
									]
								})
							]
						}),
						student.goal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: ["🎯 ", student.goal]
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "gap-1.5 shadow-xs",
							onClick: () => setReportOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), " Relatório PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "gap-1.5 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 shadow-xs",
							onClick: () => setCopilotOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" }), " Coach Copilot"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => setEditStudent(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" }), " Editar"]
						}),
						isFrozen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 shadow-xs",
							onClick: () => {
								setEditingFreeze(activeFreeze);
								setFreezeOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "h-4 w-4 text-amber-500" }), " Editar Trancamento"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => {
								setEditingFreeze(null);
								setFreezeOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "h-4 w-4" }), " Congelar Aluno"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "text-destructive hover:bg-destructive/10 transition-all duration-200 active:scale-[0.98]",
							onClick: () => deleteStudent(id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Excluir Aluno"]
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
			clinicalAlerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClinicalAlertBadge, {
				alerts: clinicalAlerts,
				riskLevel: anamnesis?.risk_level
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						label: "Total Pago (LTV)",
						value: formatBRL(kpis.ltv),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium text-muted-foreground",
									children: "Aulas Realizadas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5 text-muted-foreground" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-2xl font-bold font-mono",
								children: kpis.completed
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: completedPeriod,
								onValueChange: setCompletedPeriod,
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						label: "Taxa de Presença",
						value: `${kpis.rate.toFixed(1).replace(".", ",")}%`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						label: "Aulas no Pacote Atual",
						value: kpis.pkgLabel,
						hint: kpis.pkgFull ? "Pacote esgotado" : "Realizadas / Contratadas",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentGamificationWidget, {
				sessions,
				executions
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "overview",
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "overview",
							children: "Resumo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "sessions",
							children: "Aulas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "payments",
							children: "Pagamentos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "programs",
							children: "Treinos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "assessments",
							children: "Avaliações"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "anamnesis",
							children: "Anamnese"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "contracts",
							children: "Contratos"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "overview",
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HallOfFameCard, { executions }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-3 text-sm font-semibold",
									children: "Informações do aluno"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
											label: "Email",
											value: student.email
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
											label: "Telefone",
											value: student.phone
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
											label: "Data de nascimento",
											value: student.birth_date ? formatDateBR(student.birth_date) : null
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
											label: "Data de início",
											value: student.start_date ? formatDateBR(student.start_date) : null
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "sm:col-span-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
												label: "Objetivo",
												value: student.goal
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "sm:col-span-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
												label: "Observações de saúde",
												value: student.health_notes
											})
										}),
										partnerStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "sm:col-span-2 pt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between rounded-lg border border-primary/25 bg-primary/5 p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs font-semibold text-primary",
														children: "Treino em Dupla / Parceiro(a)"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-sm font-medium",
														children: partnerStudent.name
													})] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/personal-trainer/students/$id",
													params: { id: partnerStudent.id },
													className: "text-xs text-primary underline underline-offset-4 hover:text-primary/80 font-medium",
													children: "Ver perfil do parceiro →"
												})]
											})
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionsBarChart, { sessions }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendanceHeatmap, {
								sessions,
								payments
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "sessions",
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "link",
								size: "sm",
								className: "text-primary h-auto p-0",
								onClick: () => {
									document.getElementById("feedbacks-results")?.scrollIntoView({ behavior: "smooth" });
								},
								children: "Ver relatórios detalhados ↓"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionsTab, {
							sessions,
							payments,
							onAdd: () => {
								setEditingSession(null);
								setSessionOpen(true);
							},
							onBulkAdd: () => setBulkSessionsOpen(true),
							onEdit: (s) => {
								setEditingSession(s);
								setSessionOpen(true);
							},
							onDelete: deleteSession
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "payments",
						className: "space-y-4",
						children: [payments.length === 0 && partnerPayments.length > 0 && partnerStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-primary/20 bg-primary/5 p-4 flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-semibold text-primary",
									children: ["Plano Compartilhado com ", partnerStudent.name]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										"Este aluno treina em dupla e utiliza o pacote registrado no perfil de ",
										partnerStudent.name,
										"."
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/personal-trainer/students/$id",
								params: { id: partnerStudent.id },
								className: "text-xs text-primary underline underline-offset-4 hover:text-primary/80 font-medium",
								children: "Ver pagamentos da dupla →"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentsTab, {
							payments,
							student,
							onAdd: () => {
								setEditingPayment(null);
								setPaymentOpen(true);
							},
							onEdit: (p) => {
								setEditingPayment(p);
								setPaymentOpen(true);
							},
							onDelete: deletePayment
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "programs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramsTab, { studentId: id })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "assessments",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhysicalAssessmentTab, { studentId: id })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "anamnesis",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnamnesisTab, { studentId: id })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "contracts",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContractsTab, {
							studentId: id,
							tableName: "pt_student_contracts",
							foreignKey: "pt_student_id"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "feedbacks-results",
				className: "mt-8 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-5 w-5 text-primary" }), "Timeline de Atividades (Relatórios de Treino)"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainingExecutionTimeline, {
					studentId: id,
					studentName: student?.name
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTStudentDialog, {
				open: editStudent,
				onOpenChange: setEditStudent,
				student
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTSessionDialog, {
				open: sessionOpen,
				onOpenChange: setSessionOpen,
				defaultStudentId: id,
				session: editingSession
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTPaymentDialog, {
				open: paymentOpen,
				onOpenChange: setPaymentOpen,
				defaultStudentId: id,
				payment: editingPayment
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkPTSessionsDialog, {
				open: bulkSessionsOpen,
				onOpenChange: setBulkSessionsOpen,
				studentId: id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreezeDialog, {
				open: freezeOpen,
				onOpenChange: setFreezeOpen,
				studentId: id,
				planName: currentPlan,
				freeze: editingFreeze
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentMonthlyReportDialog, {
				open: reportOpen,
				onOpenChange: setReportOpen,
				student,
				sessions,
				executions
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachAiCopilotDialog, {
				open: copilotOpen,
				onOpenChange: setCopilotOpen,
				student,
				latestExecution: executions[0],
				anamnesis
			})
		]
	});
}
function TrainingExecutionTimeline({ studentId, studentName }) {
	const [storyData, setStoryData] = (0, import_react.useState)(null);
	const { data: executions = [], isLoading } = useQuery({
		queryKey: ["pt-student-executions", studentId],
		queryFn: async () => {
			const { data } = await supabase.from("pt_training_executions").select("*, pt_training_days(name)").eq("pt_student_id", studentId).order("executed_at", { ascending: false });
			return data ?? [];
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm text-muted-foreground",
		children: "Carregando timeline..."
	});
	if (executions.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-8 text-center bg-muted/20 border-dashed",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Nenhum treino registrado ainda."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, {
		className: "pt-2",
		children: executions.map((exec) => {
			let notes = {};
			try {
				notes = typeof exec.notes === "string" ? JSON.parse(exec.notes || "{}") : exec.notes || {};
			} catch {
				notes = {};
			}
			const timerSeconds = notes.timerSeconds || 0;
			const loads = notes.loads || {};
			const excludedCount = Array.isArray(notes.excludedExercises) ? notes.excludedExercises.length : 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TimelineItem, {
				status: "completed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineConnector, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineIcon, {
						variant: "primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5 overflow-hidden transition-all hover:shadow-md hover:border-primary/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TimelineHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TimelineTime, { children: [
								formatDateBR(exec.executed_at),
								" às ",
								new Date(exec.executed_at).toLocaleTimeString("pt-BR", {
									hour: "2-digit",
									minute: "2-digit"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineTitle, {
								className: "text-base font-bold mt-1",
								children: exec.pt_training_days?.name || "Treino concluído"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "ghost",
										className: "h-7 px-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-semibold",
										onClick: () => setStoryData({
											studentName: studentName || "Aluno Coach Montanha",
											workoutName: exec.pt_training_days?.name || "Treino Concluído",
											executedAt: exec.executed_at,
											timerSeconds,
											loads,
											excludedCount
										}),
										title: "Gerar imagem para Story (9:16)",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 mr-1" }), " Story 📲"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "ghost",
										className: "h-7 px-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-semibold",
										onClick: () => {
											const url = createWhatsAppUrl(null, generateWorkoutWhatsAppFeedback({
												studentName: studentName || "Aluno",
												workoutName: exec.pt_training_days?.name || "Treino Concluído",
												timerSeconds,
												loads,
												totalExercisesDone: Object.keys(loads).length
											}));
											window.open(url, "_blank");
										},
										title: "Enviar resumo motivacional no WhatsApp",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3.5 w-3.5 mr-1" }), " WhatsApp 💬"]
									}),
									timerSeconds > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold tabular-nums",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3.5 w-3.5 text-muted-foreground" }),
											"Duração: ",
											Math.floor(timerSeconds / 60),
											"m ",
											timerSeconds % 60,
											"s"
										]
									}),
									excludedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/20",
										children: [
											excludedCount,
											" pulado",
											excludedCount > 1 ? "s" : ""
										]
									})
								]
							})] }),
							exec.feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 rounded-xl border border-primary/20 bg-primary/[0.03] p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3 w-3" }), " Feedback do Aluno"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm italic leading-relaxed text-foreground/90",
									children: [
										"\"",
										exec.feedback,
										"\""
									]
								})]
							}),
							Object.keys(loads).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
									children: "Cargas Registradas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
									children: Object.entries(loads).map(([exId, load]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium truncate flex-1",
												children: ["Exercício #", exId.slice(-4)]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-primary tabular-nums",
												children: load
											})
										]
									}, exId))
								})]
							})
						]
					}) })
				]
			}, exec.id);
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkoutStoryModal, {
		open: Boolean(storyData),
		onOpenChange: (v) => !v && setStoryData(null),
		data: storyData
	})] });
}
function InfoRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "font-medium",
		children: value || "—"
	})] });
}
function SessionsBarChart({ sessions }) {
	const data = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (let i = 11; i >= 0; i--) {
			const k = format(startOfMonth(subMonths(/* @__PURE__ */ new Date(), i)), "yyyy-MM");
			map.set(k, 0);
		}
		for (const s of sessions) {
			if (s.status !== "completed") continue;
			const k = s.session_date.slice(0, 7);
			if (map.has(k)) map.set(k, (map.get(k) ?? 0) + 1);
		}
		return [...map.entries()].map(([k, v]) => ({
			month: formatMonthLabel(k),
			value: v
		}));
	}, [sessions]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Aulas realizadas (últimos 12 meses)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3 w-3" }), " Monitoramento de Performance"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data,
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
								allowDecimals: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...chartTooltip }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "value",
								fill: "var(--color-primary)",
								radius: [
									4,
									4,
									0,
									0
								]
							})
						]
					})
				})
			})
		]
	});
}
function AttendanceHeatmap({ sessions, payments }) {
	const months = (0, import_react.useMemo)(() => {
		const arr = [];
		for (let i = 11; i >= 0; i--) {
			const d = subMonths(/* @__PURE__ */ new Date(), i);
			arr.push({
				key: format(d, "yyyy-MM"),
				label: formatMonthLabel(format(d, "yyyy-MM"))
			});
		}
		return arr;
	}, []);
	function cellFor(monthKey) {
		const done = sessions.filter((s) => s.session_date.startsWith(monthKey) && s.status === "completed").length;
		const monthPayment = payments.find((p) => p.reference_month === monthKey && p.status === "paid");
		const contracted = monthPayment?.pt_plans?.sessions_per_month ?? monthPayment?.sessions_paid ?? null;
		let color = "bg-muted/40 text-muted-foreground";
		if (contracted) {
			const ratio = done / contracted;
			if (ratio >= 1) color = "bg-success/15 text-success";
			else if (ratio >= .5) color = "bg-warning/15 text-warning-foreground";
			else color = "bg-destructive/10 text-destructive";
		} else if (done > 0) color = "bg-success/15 text-success";
		return {
			done,
			contracted,
			color
		};
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 text-sm font-semibold",
			children: "Frequência mensal"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12",
			children: months.map((m) => {
				const c = cellFor(m.key);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex h-20 flex-col items-center justify-center rounded-lg border text-xs", c.color),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase",
						children: m.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 font-semibold",
						children: [c.done, c.contracted ? `/${c.contracted}` : ""]
					})]
				}, m.key);
			})
		})]
	});
}
function SessionsTab({ sessions, payments, onAdd, onBulkAdd, onEdit, onDelete }) {
	const qc = useQueryClient();
	const [monthFilter, setMonthFilter] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "yyyy-MM"));
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [bulkPaymentId, setBulkPaymentId] = (0, import_react.useState)("");
	const [linking, setLinking] = (0, import_react.useState)(false);
	const months = (0, import_react.useMemo)(() => {
		return [...new Set(sessions.map((x) => x.session_date.slice(0, 7)))].sort().reverse();
	}, [sessions]);
	const filtered = (0, import_react.useMemo)(() => {
		return sessions.filter((s) => {
			if (monthFilter !== "all" && !s.session_date.startsWith(monthFilter)) return false;
			if (statusFilter !== "all" && s.status !== statusFilter) return false;
			return true;
		});
	}, [
		sessions,
		monthFilter,
		statusFilter
	]);
	const summary = (0, import_react.useMemo)(() => {
		const done = filtered.filter((s) => s.status === "completed").length;
		const cancelled = filtered.filter((s) => s.status === "cancelled_student" || s.status === "cancelled_trainer").length;
		const noshow = filtered.filter((s) => s.status === "no_show").length;
		const total = filtered.length;
		return {
			done,
			cancelled,
			noshow,
			rate: total ? done / total * 100 : 0
		};
	}, [filtered]);
	function toggle(id) {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}
	function toggleAll() {
		if (filtered.every((s) => selected.has(s.id)) && filtered.length > 0) setSelected((prev) => {
			const next = new Set(prev);
			filtered.forEach((s) => next.delete(s.id));
			return next;
		});
		else setSelected((prev) => {
			const next = new Set(prev);
			filtered.forEach((s) => next.add(s.id));
			return next;
		});
	}
	async function applyBulkLink(paymentId) {
		if (selected.size === 0) return;
		setLinking(true);
		const { error } = await supabase.from("pt_sessions").update({ pt_payment_id: paymentId }).in("id", [...selected]);
		setLinking(false);
		if (error) return toast.error(error.message);
		toast.success(paymentId ? `${selected.size} aula(s) vinculada(s) ao pagamento` : `${selected.size} aula(s) desvinculada(s)`);
		setSelected(/* @__PURE__ */ new Set());
		setBulkPaymentId("");
		qc.invalidateQueries();
	}
	async function bulkDelete() {
		if (selected.size === 0) return;
		const ids = [...selected];
		if (!await confirmDialog(`Excluir ${ids.length} aula(s) selecionada(s)?`)) return;
		setLinking(true);
		const { error } = await supabase.from("pt_sessions").delete().in("id", ids);
		setLinking(false);
		if (error) return toast.error(error.message);
		toast.success(`${ids.length} aula(s) excluída(s)`);
		setSelected(/* @__PURE__ */ new Set());
		qc.invalidateQueries();
	}
	const paymentLabel = (p) => {
		const dateLabel = p.payment_date ? (/* @__PURE__ */ new Date(p.payment_date + "T12:00")).toLocaleDateString("pt-BR") : "—";
		const planLabel = p.pt_plans?.name ? ` · ${p.pt_plans.name}` : "";
		const balance = p.contracted !== null && p.contracted !== void 0 ? ` · ${p.used ?? 0}/${p.contracted}` : "";
		return `${dateLabel}${planLabel} · ${formatBRL(Number(p.amount))}${balance}`;
	};
	const paymentById = new Map(payments.map((p) => [p.id, p]));
	const allChecked = filtered.length > 0 && filtered.every((s) => selected.has(s.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: monthFilter,
						onValueChange: setMonthFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Todos os meses"
						}), months.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: m,
							children: formatMonthLabel(m)
						}, m))] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-44",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Todos os status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "completed",
								children: "Realizada"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "cancelled_student",
								children: "Cancelada (aluno)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "cancelled_trainer",
								children: "Cancelada (professor)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "no_show",
								children: "Falta"
							})
						] })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: onBulkAdd,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Registrar em lote"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: onAdd,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Registrar Nova Aula"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#feedbacks-results",
							className: "text-xs text-primary underline underline-offset-4 hover:text-primary/80 self-center ml-2",
							children: "Ver relatórios detalhados ↓"
						})
					]
				})]
			}),
			selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selected.size }), " aula(s) selecionada(s)"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex flex-wrap items-end gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Vincular ao pagamento/plano"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: bulkPaymentId,
								onValueChange: setBulkPaymentId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-[340px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione um pagamento" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [payments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-2 py-1.5 text-xs text-muted-foreground",
									children: "Nenhum pagamento cadastrado"
								}), payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: p.id,
									children: paymentLabel(p)
								}, p.id))] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => applyBulkLink(bulkPaymentId || null),
							disabled: linking || !bulkPaymentId,
							children: "Vincular"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => applyBulkLink(null),
							disabled: linking,
							children: "Desvincular"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "destructive",
							onClick: bulkDelete,
							disabled: linking,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Excluir"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => setSelected(/* @__PURE__ */ new Set()),
							children: "Cancelar"
						})
					]
				})]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Sem aulas",
				description: "Nenhuma aula para o filtro"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: allChecked,
						onCheckedChange: toggleAll,
						"aria-label": "Selecionar todas"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Horário" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Duração" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plano/Pagamento" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Observações" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Ações"
				})
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filtered.map((s) => {
				const linked = s.pt_payment_id ? paymentById.get(s.pt_payment_id) : null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					"data-state": selected.has(s.id) ? "selected" : void 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: selected.has(s.id),
							onCheckedChange: () => toggle(s.id),
							"aria-label": "Selecionar aula"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs font-mono",
							children: formatDateBR(s.session_date)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs font-mono",
							children: s.session_time?.slice(0, 5) ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "text-xs",
							children: [s.duration_minutes, "min"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTSessionStatusBadge, { status: s.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "max-w-[220px] truncate text-xs",
							children: linked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-foreground",
								children: [linked.pt_plans?.name ?? "Pagamento", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1 text-muted-foreground",
									children: ["· ", linked.payment_date ? (/* @__PURE__ */ new Date(linked.payment_date + "T12:00")).toLocaleDateString("pt-BR") : ""]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Avulsa"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "max-w-[200px] truncate text-xs text-muted-foreground",
							children: s.performance_notes ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => onEdit(s),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => onDelete(s.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
								})]
							})
						})
					]
				}, s.id);
			}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "feedbacks-results",
					className: "rounded-xl border bg-muted/30 p-4 ring-2 ring-primary/20 ring-offset-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-3.5 w-3.5" }), " Últimos Feedbacks e Resultados"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: [filtered.filter((s) => s.status === "completed" && (s.performance_notes || s.exercises)).slice(0, 6).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group relative rounded-lg border bg-card p-3 shadow-sm transition-all hover:border-primary/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-primary tabular-nums",
										children: formatDateBR(s.session_date)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-muted-foreground",
										children: [s.duration_minutes, "min"]
									})]
								}),
								s.performance_notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-foreground/80",
										children: "Feedback:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground line-clamp-2",
										children: s.performance_notes
									})]
								}),
								s.exercises && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-foreground/80",
									children: "Exercícios/Cargas:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground line-clamp-2 italic",
									children: s.exercises
								})] })
							]
						}, s.id)), filtered.filter((s) => s.status === "completed" && (s.performance_notes || s.exercises)).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "col-span-full py-4 text-center text-xs text-muted-foreground italic",
							children: "Nenhum relatório detalhado encontrado para este período."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/40 p-3 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: summary.done }), " realizadas"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: summary.cancelled }), " canceladas"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: summary.noshow }), " faltas"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Taxa: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [summary.rate.toFixed(1).replace(".", ","), "%"] })] })
					]
				})]
			})] })
		]
	});
}
function PaymentsTab({ payments, student, onAdd, onEdit, onDelete }) {
	const qc = useQueryClient();
	const [renewingId, setRenewingId] = (0, import_react.useState)(null);
	async function handleRenew(p) {
		if (renewingId) return;
		setRenewingId(p.id);
		const ok = await renewPtPayment({
			id: p.id,
			pt_student_id: p.pt_student_id,
			pt_plan_id: p.pt_plan_id,
			amount: p.amount,
			payment_date: p.payment_date,
			reference_month: p.reference_month,
			payment_method: p.payment_method,
			notes: p.notes,
			sessions_paid: p.sessions_paid
		});
		setRenewingId(null);
		if (ok) qc.invalidateQueries();
	}
	async function handleGenerateReceipt(p) {
		if (p.status !== "paid") {
			toast.error("Recibos só podem ser emitidos para pagamentos quitados.");
			return;
		}
		try {
			await downloadReceiptPdf({
				receiptId: p.id,
				studentName: student?.name || "Aluno Personal",
				studentEmail: student?.email,
				studentPhone: student?.phone,
				studentCpf: student?.cpf,
				amount: Number(p.amount),
				paymentDate: p.payment_date,
				dueDate: p.due_date,
				referenceMonth: p.reference_month,
				paymentMethod: p.payment_method,
				planName: p.pt_plans?.name || "Personal Trainer",
				notes: p.notes,
				kind: "pt"
			});
			toast.success("Recibo do aluno gerado com sucesso!");
		} catch (err) {
			toast.error("Erro ao gerar recibo: " + err.message);
		}
	}
	const grouped = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of payments) {
			const y = p.reference_month?.slice(0, 4) ?? p.payment_date.slice(0, 4);
			if (!map.has(y)) map.set(y, []);
			map.get(y).push(p);
		}
		return [...map.entries()].sort(([a], [b]) => a < b ? 1 : -1);
	}, [payments]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onAdd,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Registrar Pagamento"]
			})
		}), grouped.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Sem pagamentos",
			description: "Nenhum pagamento registrado"
		}) : grouped.map(([year, rows]) => {
			const total = rows.filter((r) => r.status === "paid").reduce((s, r) => s + Number(r.amount), 0);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold text-muted-foreground",
					children: year
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Referência" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plano" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Valor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Aulas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Saldo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Forma" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Ações"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-xs font-mono",
						children: formatDateBR(p.payment_date)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-xs",
						children: p.reference_month ? formatMonthLabel(p.reference_month) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-xs",
						children: p.pt_plans?.name ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-mono",
						children: formatBRL(p.amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-mono",
						children: p.sessions_paid ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-mono text-xs",
						children: p.contracted != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn(p.remaining !== null && p.remaining < 0 && "text-destructive font-semibold"),
							children: [
								p.used,
								"/",
								p.contracted,
								p.remaining !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1 text-muted-foreground",
									children: [
										"(",
										p.remaining >= 0 ? `${p.remaining} rest.` : `${Math.abs(p.remaining)} exc.`,
										")"
									]
								})
							]
						}) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-xs",
						children: paymentMethodLabel(p.payment_method)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentStatusBadge, { status: p.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-1",
							children: [
								p.status === "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									title: "Gerar Recibo em PDF",
									className: "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50",
									onClick: () => handleGenerateReceipt(p),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									title: "Renovar pagamento",
									onClick: () => handleRenew(p),
									disabled: renewingId === p.id,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("h-4 w-4 text-primary", renewingId === p.id && "animate-spin") })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => onEdit(p),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => onDelete(p.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
								})
							]
						})
					})
				] }), p.linkedSessions?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
					className: "bg-muted/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 9,
						className: "py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "Sessões vinculadas:"
								}),
								" ",
								p.linkedSessions.sort((a, b) => a.session_date < b.session_date ? -1 : 1).map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [i > 0 ? " · " : "", (/* @__PURE__ */ new Date(s.session_date + "T12:00")).toLocaleDateString("pt-BR")] }, s.id))
							]
						})
					})
				})] }, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "bg-muted/40 font-medium",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							colSpan: 3,
							className: "text-xs",
							children: ["Total ", year]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right font-mono",
							children: formatBRL(total)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { colSpan: 5 })
					]
				})] })] })]
			}, year);
		})]
	});
}
//#endregion
export { PTStudentDetail as component };
