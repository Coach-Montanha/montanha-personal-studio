import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Et as Kanban, G as Plus, H as RotateCcwClock, L as Send, Mt as GripVertical, O as Sparkles, Ot as Image, R as Search, Y as Phone, Z as Pencil, _t as LoaderCircle, b as Trash2, f as UserMinus, h as Upload, kn as Bell, l as UserX, m as UserCheck, pt as Mail, st as MessageSquare, ut as Megaphone } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { a as PointerSensor, g as CSS, h as useSensors, i as KeyboardSensor, m as useSensor, n as DragOverlay, p as useDroppable, s as closestCorners, t as DndContext } from "../_libs/@dnd-kit/core+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as PageHeader } from "./PageHeader-CRue-aiN.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DEnZ0u5J.mjs";
import { a as formatDateBR } from "./format-BT-nao3-.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBA-r8Xh.mjs";
import { t as sendInAppNotification } from "./notifications.functions-DzfytByp.mjs";
import { r as StudentStatusBadge } from "./Badges-BwuNwA-M.mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useScopeFilter } from "./use-scope-filter-q5Imal9c.mjs";
import { a as useSortable, i as sortableKeyboardCoordinates, o as verticalListSortingStrategy, t as SortableContext } from "../_libs/dnd-kit__sortable.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DT1SSYuq.mjs";
import { r as sendEmail } from "./email.functions-fisjNvMQ.mjs";
import { a as upsertAnnouncement, i as listMyAnnouncements, r as getSignedAnnouncementImageUrl, t as deleteAnnouncement } from "./announcements.functions-Dh4YH7L1.mjs";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-Cmlz_mk1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm-KaDKb_Wu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var generateAnnouncementImage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	const p = (input.prompt ?? "").trim();
	if (p.length < 3) throw new Error("Descreva a imagem (mínimo 3 caracteres)");
	if (p.length > 2e3) throw new Error("Prompt muito longo (máx 2000 caracteres)");
	return {
		prompt: p,
		aspect: input.aspect || "1:1",
		model: input.model === "google/gemini-3-pro-image" ? "google/gemini-3-pro-image" : "google/gemini-3.1-flash-image"
	};
}).handler(createSsrRpc("b0d0bbe2cec338019752de92fcf08f0b5a076881dd74f9cf6d5fe26bd924f20a"));
var listAiImageCache = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4cd9bf32634c5cadc86b54880fa62d4ef7ff8591a323cbb2ce727b5ce368484a"));
var deleteAiImageCache = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.id) throw new Error("id requerido");
	return input;
}).handler(createSsrRpc("487a9032bf60a761d595708189927225f796d86d647c1398ccd3496f56b3aa91"));
var ASPECT_PRESETS = [
	{
		value: "1:1",
		label: "Quadrado (1:1)"
	},
	{
		value: "16:9",
		label: "Paisagem (16:9)"
	},
	{
		value: "9:16",
		label: "Retrato (9:16)"
	},
	{
		value: "4:3",
		label: "Padrão (4:3)"
	},
	{
		value: "3:4",
		label: "Vertical (3:4)"
	},
	{
		value: "custom",
		label: "Personalizado…"
	}
];
var MODEL_OPTIONS = [{
	value: "google/gemini-3.1-flash-image",
	label: "Nano Banana 2 (rápido)",
	hint: "Padrão · ótimo custo/qualidade"
}, {
	value: "google/gemini-3-pro-image",
	label: "Gemini Pro Image (alta qualidade)",
	hint: "Mais caro · use quando o resultado precisa ser perfeito"
}];
var DEFAULT_LIMIT_PER_NOTICE = 5;
function AiImageGenerator({ onPick, limitPerNotice = DEFAULT_LIMIT_PER_NOTICE }) {
	const qc = useQueryClient();
	const genFn = useServerFn(generateAnnouncementImage);
	const listFn = useServerFn(listAiImageCache);
	const delFn = useServerFn(deleteAiImageCache);
	const signFn = useServerFn(getSignedAnnouncementImageUrl);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [aspect, setAspect] = (0, import_react.useState)("1:1");
	const [customW, setCustomW] = (0, import_react.useState)(1024);
	const [customH, setCustomH] = (0, import_react.useState)(1024);
	const [model, setModel] = (0, import_react.useState)("google/gemini-3.1-flash-image");
	const [usedInSession, setUsedInSession] = (0, import_react.useState)(0);
	const { data: cache = [] } = useQuery({
		queryKey: ["ai-image-cache"],
		queryFn: () => listFn(),
		staleTime: 3e4
	});
	const effectiveAspect = (0, import_react.useMemo)(() => {
		if (aspect !== "custom") return aspect;
		return `custom:${Math.max(256, Math.min(2048, Number(customW) || 1024))}x${Math.max(256, Math.min(2048, Number(customH) || 1024))}`;
	}, [
		aspect,
		customW,
		customH
	]);
	const genMut = useMutation({
		mutationFn: async () => genFn({ data: {
			prompt: prompt.trim(),
			aspect: effectiveAspect,
			model
		} }),
		onSuccess: (r) => {
			if (!r.cached) setUsedInSession((n) => n + 1);
			qc.invalidateQueries({ queryKey: ["ai-image-cache"] });
			onPick(r.path);
			toast.success(r.cached ? "Imagem reutilizada do cache (0 créditos)" : "Imagem gerada e selecionada");
		},
		onError: (e) => toast.error(e?.message ?? "Falha ao gerar imagem")
	});
	const delMut = useMutation({
		mutationFn: async (id) => delFn({ data: { id } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["ai-image-cache"] });
			toast.success("Imagem removida do cache");
		},
		onError: (e) => toast.error(e?.message)
	});
	const remaining = Math.max(0, limitPerNotice - usedInSession);
	const overLimit = remaining === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 rounded-md border border-dashed p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), " Gerar imagem com IA"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "ghost",
						size: "sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcwClock, { className: "h-4 w-4 mr-1" }),
							" Reutilizar (",
							cache.length,
							")"
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
					align: "end",
					className: "w-[320px] p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 px-1 text-xs text-muted-foreground",
						children: "Clique numa imagem para reaproveitar sem gastar créditos."
					}), cache.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-3 text-center text-xs text-muted-foreground",
						children: "Sem imagens ainda"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid max-h-[280px] grid-cols-3 gap-2 overflow-auto",
						children: cache.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CacheThumb, {
							row: r,
							signFn,
							onPick: () => onPick(r.image_path),
							onDelete: () => delMut.mutate(r.id)
						}, r.id))
					})]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: prompt,
				onChange: (e) => setPrompt(e.target.value),
				placeholder: "Ex: Cartaz motivacional para aula de muay thai no sábado, cores vibrantes, texto 'BORA!'",
				rows: 2
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Modelo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: model,
						onValueChange: (v) => setModel(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: MODEL_OPTIONS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: m.value,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: m.hint
								})]
							})
						}, m.value)) })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Proporção"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: aspect,
						onValueChange: setAspect,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ASPECT_PRESETS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: a.value,
							children: a.label
						}, a.value)) })]
					})]
				})]
			}),
			aspect === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Largura (px)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 256,
						max: 2048,
						value: customW,
						onChange: (e) => setCustomW(Number(e.target.value))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Altura (px)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 256,
						max: 2048,
						value: customH,
						onChange: (e) => setCustomH(Number(e.target.value))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [
						"Restam ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: remaining }),
						" de ",
						limitPerNotice,
						" gerações neste aviso."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: () => genMut.mutate(),
					disabled: genMut.isPending || overLimit || prompt.trim().length < 3,
					size: "sm",
					children: genMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-1 animate-spin" }), " Gerando…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 mr-1" }), " Gerar"] })
				})]
			}),
			overLimit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-amber-600",
				children: "Limite deste aviso atingido. Reutilize uma imagem do cache para economizar créditos."
			})
		]
	});
}
function CacheThumb({ row, signFn, onPick, onDelete }) {
	const { data } = useQuery({
		queryKey: ["ann-thumb", row.image_path],
		queryFn: () => signFn({ data: { path: row.image_path } }),
		staleTime: 3600 * 1e3
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative overflow-hidden rounded border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onPick,
			className: "block h-20 w-full bg-muted",
			title: row.prompt,
			children: data?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: data.url,
				alt: row.prompt,
				className: "h-full w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full w-full items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4 text-muted-foreground" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onDelete,
			className: "absolute right-1 top-1 hidden rounded bg-overlay p-1 text-primary-foreground backdrop-blur-sm transition-ui group-hover:block",
			"aria-label": "Excluir",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
		})]
	});
}
function toLocalInput(iso) {
	const d = new Date(iso);
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(v) {
	return new Date(v).toISOString();
}
var emptyEdit = () => {
	const now = /* @__PURE__ */ new Date();
	const later = new Date(now.getTime() + 7 * 864e5);
	return {
		title: "",
		body: "",
		image_url: null,
		starts_at: toLocalInput(now.toISOString()),
		ends_at: toLocalInput(later.toISOString()),
		active: true
	};
};
function AnnouncementsTab() {
	const qc = useQueryClient();
	const fetchList = useServerFn(listMyAnnouncements);
	const upsertFn = useServerFn(upsertAnnouncement);
	const deleteFn = useServerFn(deleteAnnouncement);
	const signFn = useServerFn(getSignedAnnouncementImageUrl);
	const { data: rows = [], isLoading } = useQuery({
		queryKey: ["announcements-mine"],
		queryFn: () => fetchList()
	});
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const openNew = () => setEdit(emptyEdit());
	const openEdit = (r) => {
		setEdit({
			id: r.id,
			title: r.title ?? "",
			body: r.body ?? "",
			image_url: r.image_url,
			starts_at: toLocalInput(r.starts_at),
			ends_at: toLocalInput(r.ends_at),
			active: r.active
		});
	};
	const saveMut = useMutation({
		mutationFn: async (state) => {
			await upsertFn({ data: {
				id: state.id,
				title: state.title.trim() || null,
				body: state.body.trim() || null,
				image_url: state.image_url ?? null,
				starts_at: fromLocalInput(state.starts_at),
				ends_at: fromLocalInput(state.ends_at),
				active: state.active
			} });
		},
		onSuccess: () => {
			toast.success("Aviso salvo");
			qc.invalidateQueries({ queryKey: ["announcements-mine"] });
			setEdit(null);
		},
		onError: (e) => toast.error(e.message)
	});
	const delMut = useMutation({
		mutationFn: async (id) => {
			await deleteFn({ data: { id } });
		},
		onSuccess: () => {
			toast.success("Aviso excluído");
			qc.invalidateQueries({ queryKey: ["announcements-mine"] });
		},
		onError: (e) => toast.error(e.message)
	});
	async function handleUpload(e) {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file || !edit) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Selecione uma imagem");
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Imagem muito grande (máx 5MB)");
			return;
		}
		setUploading(true);
		try {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) throw new Error("Sem sessão");
			const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
			const path = `${u.user.id}/${Date.now()}.${ext}`;
			const { error: upErr } = await supabase.storage.from("announcements").upload(path, file, {
				contentType: file.type,
				upsert: false
			});
			if (upErr) throw upErr;
			setEdit({
				...edit,
				image_url: path
			});
			toast.success("Imagem enviada");
		} catch (err) {
			toast.error(err.message);
		} finally {
			setUploading(false);
		}
	}
	async function handleDelete(id) {
		if (!await confirmDialog({
			description: "Excluir este aviso? Ele deixará de ser exibido para os alunos.",
			destructive: true,
			confirmLabel: "Excluir"
		})) return;
		delMut.mutate(id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 min-w-0 max-w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-lg font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4 shrink-0" }), " Avisos internos"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Aparecem para os alunos na primeira vez que abrem o app dentro da janela de exibição."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openNew,
					className: "w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " Novo aviso"]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-8 text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" })
			}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-8 text-center text-sm text-muted-foreground",
				children: "Nenhum aviso criado ainda."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementCard, {
					row: r,
					onEdit: () => openEdit(r),
					onDelete: () => handleDelete(r.id),
					signFn
				}, r.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!edit,
				onOpenChange: (o) => !o && !saveMut.isPending && setEdit(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: edit?.id ? "Editar aviso" : "Novo aviso" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Adicione texto, imagem ou ambos. Defina quando o aviso começa e quando encerra." })] }),
						edit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "ann-title",
										children: "Título (opcional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "ann-title",
										value: edit.title,
										onChange: (e) => setEdit({
											...edit,
											title: e.target.value
										}),
										placeholder: "Ex: Studio fechado no sábado"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "ann-body",
										children: "Mensagem"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "ann-body",
										value: edit.body,
										onChange: (e) => setEdit({
											...edit,
											body: e.target.value
										}),
										placeholder: "Escreva a mensagem que será exibida ao aluno",
										rows: 4
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Imagem (opcional)" }),
										edit.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePreview, {
											path: edit.image_url,
											signFn,
											onRemove: () => setEdit({
												...edit,
												image_url: null
											})
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground hover:bg-muted",
											children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Enviando…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), " Enviar imagem (máx 5MB)"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: handleUpload,
												disabled: uploading
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiImageGenerator, { onPick: (path) => setEdit({
											...edit,
											image_url: path
										}) })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "ann-start",
											children: "Início"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "ann-start",
											type: "datetime-local",
											value: edit.starts_at,
											onChange: (e) => setEdit({
												...edit,
												starts_at: e.target.value
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "ann-end",
											children: "Fim"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "ann-end",
											type: "datetime-local",
											value: edit.ends_at,
											onChange: (e) => setEdit({
												...edit,
												ends_at: e.target.value
											})
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-md border p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "ann-active",
										className: "text-sm",
										children: "Aviso ativo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Desative para pausar a exibição sem excluir."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										id: "ann-active",
										checked: edit.active,
										onCheckedChange: (v) => setEdit({
											...edit,
											active: v
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setEdit(null),
							disabled: saveMut.isPending,
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => edit && saveMut.mutate(edit),
							disabled: saveMut.isPending || uploading,
							children: [saveMut.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-1 animate-spin" }), "Salvar"]
						})] })
					]
				})
			})
		]
	});
}
function AnnouncementCard({ row, onEdit, onDelete, signFn }) {
	const now = Date.now();
	const start = new Date(row.starts_at).getTime();
	const end = new Date(row.ends_at).getTime();
	const status = (0, import_react.useMemo)(() => {
		if (!row.active) return {
			label: "Pausado",
			cls: "bg-muted text-muted-foreground"
		};
		if (now < start) return {
			label: "Agendado",
			cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
		};
		if (now > end) return {
			label: "Encerrado",
			cls: "bg-muted text-muted-foreground"
		};
		return {
			label: "Exibindo",
			cls: "bg-state-paid-soft text-state-paid"
		};
	}, [
		row.active,
		now,
		start,
		end
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-3.5 sm:p-4 min-w-0 max-w-full overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3",
			children: [
				row.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedThumb, {
						path: row.image_url,
						signFn
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 text-[10px] font-bold ${status.cls}`,
								children: status.label
							}), row.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold truncate",
								children: row.title
							})]
						}),
						row.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground line-clamp-2",
							children: row.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								formatDateBR(row.starts_at.slice(0, 10)),
								" ",
								new Date(row.starts_at).toLocaleTimeString("pt-BR", {
									hour: "2-digit",
									minute: "2-digit"
								}),
								" → ",
								formatDateBR(row.ends_at.slice(0, 10)),
								" ",
								new Date(row.ends_at).toLocaleTimeString("pt-BR", {
									hour: "2-digit",
									minute: "2-digit"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: onEdit,
						"aria-label": "Editar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: onDelete,
						"aria-label": "Excluir",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
					})]
				})
			]
		})
	});
}
function SignedThumb({ path, signFn }) {
	const { data } = useQuery({
		queryKey: ["ann-thumb", path],
		queryFn: () => signFn({ data: { path } }),
		staleTime: 3600 * 1e3
	});
	if (!data?.url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-5 w-5 text-muted-foreground" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: data.url,
		alt: "",
		className: "h-full w-full object-cover"
	});
}
function ImagePreview({ path, signFn, onRemove }) {
	const { data } = useQuery({
		queryKey: ["ann-preview", path],
		queryFn: () => signFn({ data: { path } }),
		staleTime: 3600 * 1e3
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-md border",
		children: [data?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: data.url,
			alt: "Prévia",
			className: "max-h-48 w-full object-contain bg-muted"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-32 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			size: "sm",
			variant: "secondary",
			className: "absolute right-2 top-2",
			onClick: onRemove,
			children: "Remover"
		})]
	});
}
function KanbanBoard({ columns, onDragEnd, onDragOver, children, className, renderOverlayCard }) {
	const [activeId, setActiveId] = import_react.useState(null);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
	const activeItem = import_react.useMemo(() => {
		if (!activeId) return null;
		for (const col of columns) {
			const found = col.items.find((item) => item.id === activeId);
			if (found) return found;
		}
		return null;
	}, [columns, activeId]);
	const handleDragStart = (event) => {
		setActiveId(event.active.id);
	};
	const handleDragEnd = (event) => {
		setActiveId(null);
		onDragEnd(event);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DndContext, {
		sensors,
		collisionDetection: closestCorners,
		onDragStart: handleDragStart,
		onDragOver,
		onDragEnd: handleDragEnd,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0 w-full", className),
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragOverlay, {
			dropAnimation: {
				duration: 150,
				easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)"
			},
			children: activeItem && renderOverlayCard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rotate-1 scale-105 opacity-95 shadow-xl cursor-grabbing pointer-events-none",
				children: renderOverlayCard(activeItem)
			}) : null
		})]
	});
}
var toneDotStyles = {
	default: "bg-muted-foreground",
	primary: "bg-primary",
	success: "bg-emerald-500",
	warning: "bg-amber-500",
	destructive: "bg-destructive",
	muted: "bg-muted-foreground/60"
};
function KanbanColumn({ id, title, count, badge, icon, tone = "default", items, children, className, emptyText = "Nenhum item nesta coluna" }) {
	const itemIds = import_react.useMemo(() => items.map((i) => i.id), [items]);
	const { isOver, setNodeRef } = useDroppable({ id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		"data-column-id": id,
		className: cn("flex flex-col rounded-xl border border-border/80 bg-muted/20 p-3 shadow-2xs backdrop-blur-xs min-h-[350px] transition-colors", isOver && "border-primary/60 bg-primary/5 ring-1 ring-primary/20", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center justify-between gap-2 px-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2.5 w-2.5 rounded-full ring-2 ring-background", toneDotStyles[tone] || toneDotStyles.default) }),
					icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold tracking-tight text-foreground",
						children: title
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [badge, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-semibold text-muted-foreground",
					children: count ?? items.length
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
			id: String(id),
			items: itemIds,
			strategy: verticalListSortingStrategy,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 flex-col gap-2.5 overflow-y-auto",
				children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground",
					children: emptyText
				}) : children
			})
		})]
	});
}
function KanbanCard({ id, children, className }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Translate.toString(transform),
			transition,
			opacity: isDragging ? .3 : 1
		},
		className: cn("group relative rounded-lg border border-border/80 bg-card p-3 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs", isDragging && "ring-2 ring-primary/40 shadow-md", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				...attributes,
				...listeners,
				"aria-label": "Arrastar card",
				className: "mt-0.5 -ml-1 flex h-6 w-5 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground active:cursor-grabbing focus:opacity-100 focus-ring",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0 flex-1",
				children
			})]
		})
	});
}
var STATUS_CHIPS = [
	{
		key: "active",
		label: "Ativos"
	},
	{
		key: "inactive",
		label: "Inativos"
	},
	{
		key: "churned",
		label: "Churn"
	}
];
function CRMPage() {
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const { data: studioStudents = [] } = useQuery({
		queryKey: ["crm-students", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("students").select("id,name,email,phone,status").is("deleted_at", null).order("name");
			if (scopeId) q = q.eq("user_id", scopeId);
			const { data, error } = await q;
			if (error) throw error;
			return (data ?? []).map((s) => ({
				...s,
				kind: "studio"
			}));
		}
	});
	const { data: ptStudents = [] } = useQuery({
		queryKey: ["crm-pt-students", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_students").select("id,name,email,phone,status").is("deleted_at", null).order("name");
			if (scopeId) q = q.eq("user_id", scopeId);
			const { data, error } = await q;
			if (error) throw error;
			return (data ?? []).map((s) => ({
				...s,
				kind: "pt"
			}));
		}
	});
	const students = [...studioStudents, ...ptStudents];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 max-w-full space-y-6 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			icon: MessageSquare,
			eyebrow: "Relacionamento",
			title: "CRM",
			description: "Comunique-se com seus alunos por email ou WhatsApp"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "pipeline",
			className: "space-y-4 min-w-0 max-w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-full overflow-x-auto pb-1 [touch-action:pan-x] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "h-auto w-max gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "pipeline",
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kanban, { className: "h-4 w-4" }), " Funil de Alunos"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "individual",
								children: "Mensagem Individual"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "bulk",
								children: "Disparo em Massa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "announcements",
								children: "Avisos Internos"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "pipeline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentsKanbanPipeline, { students })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "individual",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndividualMessage, { students })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "bulk",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkMessage, { students })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "announcements",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementsTab, {})
				})
			]
		})]
	});
}
function IndividualMessage({ students }) {
	const [source, setSource] = (0, import_react.useState)("all");
	const [studentId, setStudentId] = (0, import_react.useState)("");
	const [channel, setChannel] = (0, import_react.useState)("email");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const sendEmailFn = useServerFn(sendEmail);
	const sendInAppFn = useServerFn(sendInAppNotification);
	const filteredStudents = (0, import_react.useMemo)(() => students.filter((s) => source === "all" || s.kind === source), [students, source]);
	const student = students.find((s) => s.id === studentId);
	async function send() {
		if (!student) return toast.error("Selecione um aluno.");
		if (!message.trim()) return toast.error("Digite uma mensagem.");
		const personalizedMessage = message.replace(/\{nome\}/gi, student.name);
		if (channel === "email") {
			if (!student.email) return toast.error("Este aluno não tem email cadastrado.");
			setSending(true);
			try {
				await sendEmailFn({ data: {
					to: student.email,
					subject: subject || "Mensagem da sua academia",
					text: personalizedMessage
				} });
				toast.success(`Email enviado para ${student.name}!`);
				setMessage("");
				setSubject("");
			} catch (e) {
				toast.error(`Erro ao enviar email: ${e.message ?? "verifique suas configurações"}`);
			}
			setSending(false);
			return;
		}
		if (channel === "whatsapp") {
			if (!student.phone) return toast.error("Este aluno não tem telefone cadastrado.");
			const phone = student.phone.replace(/\D/g, "");
			window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(personalizedMessage)}`, "_blank");
			toast.success("WhatsApp aberto com a mensagem pré-preenchida.");
			return;
		}
		if (channel === "inapp") {
			setSending(true);
			try {
				if ((await sendInAppFn({ data: {
					studentIds: [student.id],
					title: subject || "Nova mensagem do studio",
					body: personalizedMessage,
					kind: student.kind
				} })).sent > 0) {
					toast.success(`Notificação enviada para ${student.name}!`);
					setMessage("");
					setSubject("");
				} else toast.error(`${student.name} ainda não tem acesso ao app.`);
			} catch (e) {
				toast.error(`Erro: ${e.message ?? "tente novamente"}`);
			}
			setSending(false);
			return;
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[2fr_1fr] min-w-0 max-w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-3.5 sm:p-5 space-y-4 min-w-0 max-w-full overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Destinatário e canal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tipo de aluno" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							"all",
							"studio",
							"pt"
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: source === s ? "default" : "outline",
							size: "sm",
							onClick: () => {
								setSource(s);
								setStudentId("");
							},
							className: "flex-1 sm:flex-initial",
							children: s === "all" ? "Todos" : s === "studio" ? "Studio" : "Personal"
						}, s))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Aluno" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: studentId,
						onValueChange: setStudentId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-full min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione um aluno" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: filteredStudents.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: s.id,
							children: [
								s.kind === "pt" ? "🏋️ " : "🎓 ",
								s.name,
								s.email ? ` · ${s.email}` : "",
								s.phone ? ` · ${s.phone}` : ""
							]
						}, `${s.kind}-${s.id}`)) })]
					})]
				}),
				student && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border bg-muted/30 p-3 space-y-1 min-w-0 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium truncate",
							children: student.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground truncate",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 shrink-0" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: student.email ?? "Sem email"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground truncate",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5 shrink-0" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: student.phone ?? "Sem telefone"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Canal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							"email",
							"whatsapp",
							"inapp"
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: channel === c ? "default" : "outline",
							size: "sm",
							onClick: () => setChannel(c),
							className: "flex-1 sm:flex-initial transition-colors duration-150",
							children: c === "email" ? "📧 Email" : c === "whatsapp" ? "💬 WhatsApp" : "🔔 No app"
						}, c))
					})]
				}),
				(channel === "email" || channel === "inapp") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: channel === "email" ? "Assunto" : "Título da notificação" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: subject,
						onChange: (e) => setSubject(e.target.value),
						placeholder: channel === "email" ? "Ex: Lembrete de pagamento" : "Ex: Aula remarcada"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mensagem" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 8,
						value: message,
						onChange: (e) => setMessage(e.target.value),
						placeholder: "Digite sua mensagem aqui…"
					})]
				}),
				student && message.includes("{nome}") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-dashed bg-muted/30 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted-foreground mb-1",
						children: "👁️ Prévia com o nome do aluno:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm whitespace-pre-wrap",
						children: message.replace(/\{nome\}/gi, student.name)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: send,
					disabled: sending,
					className: "w-full transition-all duration-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 h-4 w-4" }), sending ? "Enviando…" : channel === "email" ? "Enviar email" : channel === "whatsapp" ? "Abrir WhatsApp" : "Enviar notificação"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplatesPanel, { onSelect: setMessage })]
	});
}
function BulkMessage({ students }) {
	const [source, setSource] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)(() => new Set([
		"active",
		"inactive",
		"churned"
	]));
	const [channel, setChannel] = (0, import_react.useState)("email");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [sending, setSending] = (0, import_react.useState)(false);
	const [results, setResults] = (0, import_react.useState)([]);
	const sendEmailFn = useServerFn(sendEmail);
	const sendInAppFn = useServerFn(sendInAppNotification);
	const filtered = (0, import_react.useMemo)(() => students.filter((s) => (source === "all" || s.kind === source) && statusFilter.has(s.status)), [
		students,
		statusFilter,
		source
	]);
	const counts = (0, import_react.useMemo)(() => {
		const c = {
			active: 0,
			inactive: 0,
			churned: 0
		};
		for (const s of students) if (s.status in c) c[s.status]++;
		return c;
	}, [students]);
	function toggleStatus(key) {
		setStatusFilter((prev) => {
			const next = new Set(prev);
			if (next.has(key)) {
				if (next.size === 1) return prev;
				next.delete(key);
			} else next.add(key);
			return next;
		});
		setSelected(/* @__PURE__ */ new Set());
	}
	const allSelected = filtered.length > 0 && filtered.every((s) => selected.has(s.id));
	async function sendBulk() {
		if (selected.size === 0) return toast.error("Selecione pelo menos um aluno.");
		if (!message.trim()) return toast.error("Digite uma mensagem.");
		setSending(true);
		setResults([]);
		const targets = students.filter((s) => selected.has(s.id));
		const res = [];
		if (channel === "inapp") {
			const studioTargets = targets.filter((t) => t.kind === "studio");
			const ptTargets = targets.filter((t) => t.kind === "pt");
			try {
				for (const [kind, group] of [["studio", studioTargets], ["pt", ptTargets]]) {
					if (group.length === 0) continue;
					const r = await sendInAppFn({ data: {
						studentIds: group.map((t) => t.id),
						title: subject || "Nova mensagem do studio",
						body: message,
						kind
					} });
					const skipped = new Set(r.skipped);
					for (const t of group) if (skipped.has(t.name)) res.push({
						name: t.name,
						ok: false,
						reason: "sem acesso ao app"
					});
					else res.push({
						name: t.name,
						ok: true
					});
				}
			} catch (e) {
				toast.error(`Erro: ${e.message ?? "tente novamente"}`);
				setSending(false);
				return;
			}
			setResults(res);
			setSending(false);
			toast.success(`${res.filter((r) => r.ok).length} notificação(ões) enviada(s).`);
			return;
		}
		for (const s of targets) if (channel === "email") {
			if (!s.email) {
				res.push({
					name: s.name,
					ok: false,
					reason: "sem email"
				});
				continue;
			}
			try {
				await sendEmailFn({ data: {
					to: s.email,
					subject: subject || "Mensagem da sua academia",
					text: message.replace(/\{nome\}/gi, s.name)
				} });
				res.push({
					name: s.name,
					ok: true
				});
			} catch (e) {
				res.push({
					name: s.name,
					ok: false,
					reason: e.message ?? "erro"
				});
			}
			await new Promise((r) => setTimeout(r, 200));
		} else {
			if (!s.phone) {
				res.push({
					name: s.name,
					ok: false,
					reason: "sem telefone"
				});
				continue;
			}
			const phone = s.phone.replace(/\D/g, "");
			window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message.replace(/\{nome\}/gi, s.name))}`, "_blank");
			res.push({
				name: s.name,
				ok: true
			});
			await new Promise((r) => setTimeout(r, 800));
		}
		setResults(res);
		setSending(false);
		const ok = res.filter((r) => r.ok).length;
		toast.success(`${ok} mensagem(ns) enviada(s).`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 min-w-0 max-w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-3.5 sm:p-5 space-y-4 min-w-0 max-w-full overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Configurar disparo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tipo de aluno" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								"all",
								"studio",
								"pt"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: source === s ? "default" : "outline",
								size: "sm",
								onClick: () => {
									setSource(s);
									setSelected(/* @__PURE__ */ new Set());
								},
								className: "flex-1 sm:flex-initial",
								children: s === "all" ? "Todos" : s === "studio" ? "Studio" : "Personal"
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Filtrar alunos por status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: STATUS_CHIPS.map((s) => {
									const active = statusFilter.has(s.key);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => toggleStatus(s.key),
										"aria-pressed": active,
										className: cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", active ? "border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-accent hover:text-foreground"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none tabular-nums", active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"),
											children: counts[s.key]
										})]
									}, s.key);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"Combine status para direcionar a mensagem. Ex.: só ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "inativos + churn" }),
									" para reengajar."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Canal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								"email",
								"whatsapp",
								"inapp"
							].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: channel === c ? "default" : "outline",
								size: "sm",
								onClick: () => setChannel(c),
								className: "transition-colors duration-150",
								children: c === "email" ? "📧 Email" : c === "whatsapp" ? "💬 WhatsApp" : "🔔 No app"
							}, c))
						})]
					}),
					(channel === "email" || channel === "inapp") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: channel === "email" ? "Assunto" : "Título da notificação" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: subject,
							onChange: (e) => setSubject(e.target.value),
							placeholder: channel === "email" ? "Assunto do email" : "Ex: Novidade da semana"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
							"Mensagem (use ",
							"{nome}",
							" para personalizar)"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 6,
							value: message,
							onChange: (e) => setMessage(e.target.value),
							placeholder: `Olá {nome}, tudo bem?\n\nSua mensagem aqui…`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: sendBulk,
						disabled: sending || selected.size === 0,
						className: "w-full transition-all duration-200",
						children: [channel === "inapp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mr-2 h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 h-4 w-4" }), sending ? "Enviando…" : channel === "inapp" ? `Notificar ${selected.size} aluno(s) no app` : `Enviar para ${selected.size} aluno(s)`]
					}),
					channel === "whatsapp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "💡 Para WhatsApp em massa, o app abrirá uma janela por aluno. Recomendamos selecionar até 5 por vez."
					}) : channel === "inapp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "🔔 Chegará como notificação e pop-up dentro do app do aluno. Alunos sem acesso são ignorados automaticamente."
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-3.5 sm:p-5 space-y-3 min-w-0 max-w-full overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-sm font-semibold",
						children: [
							"Selecionar alunos (",
							selected.size,
							" de ",
							filtered.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => setSelected(allSelected ? /* @__PURE__ */ new Set() : new Set(filtered.map((s) => s.id))),
						children: allSelected ? "Desmarcar todos" : "Selecionar todos"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-full overflow-x-auto [touch-action:pan-x]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "w-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: allSelected,
								onChange: (e) => setSelected(e.target.checked ? new Set(filtered.map((s) => s.id)) : /* @__PURE__ */ new Set())
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nome" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Email" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Telefone" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filtered.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "cursor-pointer",
						onClick: () => setSelected((prev) => {
							const n = new Set(prev);
							if (n.has(s.id)) n.delete(s.id);
							else n.add(s.id);
							return n;
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: selected.has(s.id),
								onChange: () => {}
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: "font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mr-1.5",
									children: s.kind === "pt" ? "🏋️" : "🎓"
								}), s.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentStatusBadge, { status: s.status }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-muted-foreground",
								children: s.email ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-muted-foreground",
								children: s.phone ?? "—"
							})
						]
					}, `${s.kind}-${s.id}`)) })] })
				})]
			}),
			results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-3.5 sm:p-5 space-y-2 min-w-0 max-w-full overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Resultado do disparo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-full overflow-x-auto [touch-action:pan-x]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aluno" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Detalhe" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: results.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: r.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: r.ok ? "text-state-paid font-medium" : "text-destructive font-medium",
							children: r.ok ? "✅ Enviado" : "❌ Falhou"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground",
							children: r.reason ?? "—"
						})
					] }, i)) })] })
				})]
			})
		]
	});
}
var TEMPLATES_STUDIO = [
	{
		label: "💰 Lembrete de pagamento",
		text: "Olá {nome}! Passando para lembrar que sua mensalidade está próxima do vencimento. Qualquer dúvida, estou à disposição!"
	},
	{
		label: "😊 Boas-vindas",
		text: "Olá {nome}, seja muito bem-vindo(a)! Estamos felizes em ter você conosco. Qualquer dúvida, é só chamar."
	},
	{
		label: "🎊 Boas-vindas — novo aluno (completa)",
		text: "Olá {nome}, seja muito bem-vindo(a) à nossa família! 🎉\n\nEstamos animados por você começar essa jornada com a gente. Algumas informações importantes:\n\n• Sua próxima aula: [informe dia e horário]\n• Traga: roupa confortável, tênis, toalha e garrafa d'água\n• Chegue 10 minutos antes para se ambientar\n\nQualquer dúvida antes da aula, é só me chamar por aqui. Bons treinos! 💪"
	},
	{
		label: "👋 Boas-vindas — primeira aula amanhã",
		text: "Oi {nome}! Tudo pronto para sua primeira aula amanhã? 😊\n\nTe espero em [dia e horário]. Lembre-se de trazer roupa confortável, toalha e água. Se precisar de qualquer orientação antes, é só me chamar!"
	},
	{
		label: "📅 Confirmar aula",
		text: "Oi {nome}! Confirma presença na aula de amanhã? Te espero!"
	},
	{
		label: "🔄 Aluno inativo",
		text: "Olá {nome}, sentimos sua falta! Que tal retomar os treinos? Entre em contato e vamos combinar."
	},
	{
		label: "🎉 Parabéns",
		text: "Feliz aniversário, {nome}! 🎂 Desejamos um dia incrível e muito sucesso na sua jornada!"
	},
	{
		label: "📢 Aviso geral",
		text: "Olá {nome}! Temos um aviso importante para você. Por favor, entre em contato o quanto antes."
	}
];
var TEMPLATES_PT = [
	{
		label: "🏋️ Boas-vindas PT",
		text: "Olá {nome}! Seja muito bem-vindo(a) ao acompanhamento personalizado. Já preparei seu primeiro treino — qualquer dúvida sobre execução ou horários, me chame por aqui."
	},
	{
		label: "🎯 Boas-vindas PT — completa com 1ª sessão",
		text: "Olá {nome}, seja muito bem-vindo(a) ao acompanhamento PT! 💪\n\nEstou muito animado(a) por acompanhar sua evolução. Aqui vai o que você precisa saber:\n\n• Sua primeira sessão: [dia e horário]\n• Local: [endereço/estúdio]\n• Traga: roupa de treino, tênis, toalha e água\n• Seu treino inicial já está liberado no app — dá uma olhada antes\n\nQualquer dúvida, é só me chamar por aqui. Vamos começar com tudo! 🔥"
	},
	{
		label: "📆 Boas-vindas PT — próxima aula",
		text: "Oi {nome}! Que bom te ter no acompanhamento PT. 🙌\n\nSua próxima sessão está marcada para [dia e horário]. Vou te esperar preparado(a) com o treino personalizado. Se precisar reagendar ou tiver qualquer dúvida, me avise por aqui!"
	},
	{
		label: "📅 Confirmar sessão PT",
		text: "Oi {nome}! Confirma nossa sessão de PT? Lembre-se de trazer água, toalha e roupa confortável. Nos vemos em breve!"
	},
	{
		label: "⏰ Reagendamento",
		text: "Olá {nome}, precisamos reagendar nossa próxima sessão. Me envie 2 ou 3 horários que funcionem para você que eu confirmo o encaixe."
	},
	{
		label: "💪 Novo treino disponível",
		text: "Oi {nome}! Seu novo treino já está liberado no app. Dá uma olhada nos exercícios, cargas e vídeos antes da próxima sessão — qualquer dúvida, me chame!"
	},
	{
		label: "📊 Avaliação/Reavaliação",
		text: "Olá {nome}! Está na hora da sua reavaliação física. Vamos medir sua evolução e ajustar o treino para os próximos ciclos. Me passe um horário que funciona pra você."
	},
	{
		label: "🔥 Pacote acabando",
		text: "Oi {nome}! Suas sessões de PT estão acabando. Quer renovar o pacote para não perder o ritmo do treino? Posso já deixar tudo pronto."
	},
	{
		label: "😴 Aluno PT inativo",
		text: "Olá {nome}, senti sua falta nas últimas sessões! Que tal marcarmos uma volta gradual? Podemos ajustar a intensidade para retomar sem desconforto."
	},
	{
		label: "🏆 Meta atingida",
		text: "{nome}, parabéns pela evolução! 🎯 Seu esforço nas últimas semanas tem sido incrível. Vamos ajustar as próximas metas para continuar progredindo."
	},
	{
		label: "💧 Lembrete de hidratação/descanso",
		text: "Oi {nome}! Só um lembrete: hidratação e sono de qualidade são parte do treino. Cuide desses dois pontos até nossa próxima sessão. 💪"
	},
	{
		label: "💳 Cobrança PT",
		text: "Olá {nome}! Sua mensalidade do acompanhamento PT está próxima do vencimento. Qualquer coisa sobre pagamento, é só me chamar."
	},
	{
		label: "📸 Pedido de feedback",
		text: "Oi {nome}! Como você está se sentindo com o treino atual? Algum exercício incomodando ou algo que gostaria de mudar? Seu retorno me ajuda a evoluir sua ficha."
	}
];
function TemplatesPanel({ onSelect }) {
	const [tab, setTab] = (0, import_react.useState)("studio");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-3.5 sm:p-5 space-y-3 min-w-0 max-w-full overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Modelos de mensagem"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				value: tab,
				onValueChange: (v) => setTab(v),
				className: "w-full min-w-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "w-full grid grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "studio",
						className: "min-w-0 truncate px-2",
						children: "Studio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "pt",
						className: "min-w-0 truncate px-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Personal Trainer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sm:hidden",
							children: "Personal"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Clique para usar um modelo como base."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 max-h-[520px] overflow-y-auto pr-1 min-w-0",
				children: (tab === "studio" ? TEMPLATES_STUDIO : TEMPLATES_PT).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onSelect(t.text),
					className: "w-full rounded-lg border p-3 text-left text-sm transition-colors hover:bg-accent min-w-0 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium truncate",
						children: t.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-0.5 truncate text-xs text-muted-foreground",
						children: [t.text.slice(0, 80), "…"]
					})]
				}, t.label))
			})
		]
	});
}
function StudentsKanbanPipeline({ students }) {
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)("all");
	const filtered = (0, import_react.useMemo)(() => {
		return students.filter((s) => {
			if (source !== "all" && s.kind !== source) return false;
			if (!search.trim()) return true;
			const q = search.toLowerCase();
			return s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.phone?.includes(q);
		});
	}, [
		students,
		search,
		source
	]);
	const columns = (0, import_react.useMemo)(() => {
		const normalizeStatus = (status) => {
			const s = (status || "").toLowerCase();
			if (s === "inactive" || s === "inativo") return "inactive";
			if (s === "churned" || s === "churn" || s === "cancelled") return "churned";
			return "active";
		};
		const activeList = filtered.filter((s) => normalizeStatus(s.status) === "active");
		const inactiveList = filtered.filter((s) => normalizeStatus(s.status) === "inactive");
		const churnedList = filtered.filter((s) => normalizeStatus(s.status) === "churned");
		return [
			{
				id: "active",
				title: "Ativos",
				tone: "success",
				items: activeList
			},
			{
				id: "inactive",
				title: "Inativos",
				tone: "warning",
				items: inactiveList
			},
			{
				id: "churned",
				title: "Churn / Desistentes",
				tone: "destructive",
				items: churnedList
			}
		];
	}, [filtered]);
	const handleDragEnd = async (event) => {
		const { active, over } = event;
		if (!over) return;
		const activeStudentId = String(active.id);
		const targetColId = String(over.id);
		const student = students.find((s) => s.id === activeStudentId);
		if (!student) return;
		let destinationStatus = targetColId;
		if (![
			"active",
			"inactive",
			"churned"
		].includes(destinationStatus)) {
			const targetStudent = students.find((s) => s.id === targetColId);
			if (targetStudent) {
				const s = (targetStudent.status || "").toLowerCase();
				destinationStatus = s === "inactive" ? "inactive" : s === "churned" ? "churned" : "active";
			}
		}
		if (![
			"active",
			"inactive",
			"churned"
		].includes(destinationStatus)) return;
		if ((student.status === "inactive" ? "inactive" : student.status === "churned" ? "churned" : "active") === destinationStatus) return;
		const statusLabels = {
			active: "Ativos",
			inactive: "Inativos",
			churned: "Churn"
		};
		try {
			const table = student.kind === "studio" ? "students" : "pt_students";
			const { error } = await supabase.from(table).update({ status: destinationStatus }).eq("id", student.id);
			if (error) throw error;
			toast.success(`${student.name} movido(a) para ${statusLabels[destinationStatus]}!`);
			qc.invalidateQueries({ queryKey: ["crm-students"] });
			qc.invalidateQueries({ queryKey: ["crm-pt-students"] });
		} catch (err) {
			toast.error(`Erro ao mover aluno: ${err.message}`);
		}
	};
	const renderCardContent = (s) => {
		const cleanPhone = (s.phone || "").replace(/\D/g, "");
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-sm text-foreground truncate",
						children: s.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", s.kind === "studio" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"),
						children: s.kind === "studio" ? "Studio" : "Personal"
					})]
				}),
				(s.phone || s.email) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground space-y-0.5 truncate",
					children: [s.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate",
						children: ["📞 ", s.phone]
					}), s.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate",
						children: ["✉️ ", s.email]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 pt-1 border-t border-border/50",
					children: [cleanPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						className: "h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10",
						onClick: (e) => {
							e.stopPropagation();
							window.open(`https://wa.me/55${cleanPhone}`, "_blank");
						},
						title: "Abrir WhatsApp",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5 mr-1" }), " WhatsApp"]
					}), s.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						className: "h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-500/10",
						onClick: (e) => {
							e.stopPropagation();
							window.open(`mailto:${s.email}`, "_blank");
						},
						title: "Enviar E-mail",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 mr-1" }), " Email"]
					})]
				})
			]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 min-w-[200px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Buscar por nome, telefone ou email...",
					className: "pl-9 h-9"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: source,
					onValueChange: (v) => setSource(v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-[140px] h-9",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: "all",
							children: [
								"Todos (",
								students.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "studio",
							children: "Studio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "pt",
							children: "Personal"
						})
					] })]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanBoard, {
			columns,
			onDragEnd: handleDragEnd,
			renderOverlayCard: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-[300px] rounded-lg border border-primary/50 bg-card p-3 shadow-xl",
				children: renderCardContent(item)
			}),
			children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanColumn, {
				id: col.id,
				title: col.title,
				tone: col.tone,
				items: col.items,
				icon: col.id === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-emerald-500" }) : col.id === "inactive" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "h-4 w-4 text-amber-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "h-4 w-4 text-destructive" }),
				children: col.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanCard, {
					id: item.id,
					children: renderCardContent(item)
				}, item.id))
			}, col.id))
		})]
	});
}
//#endregion
export { CRMPage as component };
