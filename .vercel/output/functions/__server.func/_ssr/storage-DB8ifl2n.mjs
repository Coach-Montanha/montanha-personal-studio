import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Ln as ArrowLeft, Wt as ExternalLink, Yt as Database, _t as LoaderCircle, b as Trash2, qt as Download } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBA-r8Xh.mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DT1SSYuq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storage-DB8ifl2n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BUCKETS = [
	"announcements",
	"avatars",
	"contracts",
	"exercise-media"
];
var listMyBuckets = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("6fb8d74dc480abab74ccda9328c70c251eb552aa8b9bd20cc0a7a0b69ebafe07"));
var listMyBucketFiles = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!BUCKETS.includes(input.bucket)) throw new Error("Bucket inválido");
	return input;
}).handler(createSsrRpc("511f2d9af3dba84bed75e9b23d41a89127fc8d0d5bb62e9842402e5077233379"));
var signMyBucketFile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!BUCKETS.includes(input.bucket)) throw new Error("Bucket inválido");
	if (!input.path) throw new Error("path requerido");
	return input;
}).handler(createSsrRpc("850492e08fb887dd0ececfd92e4a60d79c3a226d7207b2616946cf9f649f7d58"));
var deleteMyBucketFile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!BUCKETS.includes(input.bucket)) throw new Error("Bucket inválido");
	if (!input.path) throw new Error("path requerido");
	return input;
}).handler(createSsrRpc("ca9f287e7e5fafe7521a09ee026d97dd563d9609dfe4c5326073de44bc1ed308"));
function formatSize(n) {
	if (!n && n !== 0) return "—";
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
function StoragePage() {
	const bucketsFn = useServerFn(listMyBuckets);
	const { data: buckets = [] } = useQuery({
		queryKey: ["my-buckets"],
		queryFn: () => bucketsFn()
	});
	const [active, setActive] = (0, import_react.useState)("announcements");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl space-y-4 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/settings",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1" }), " Voltar"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-xl font-semibold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-5 w-5" }), " Armazenamento e mídia"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Arquivos que o app guarda por você: imagens dos avisos (incluindo IA), fotos de alunos, contratos em PDF e mídia dos exercícios."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: active,
				onValueChange: (v) => setActive(v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
					className: "flex flex-wrap gap-1",
					children: buckets.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: b.id,
						children: b.label
					}, b.id))
				}), buckets.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: b.id,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BucketBrowser, { bucket: b.id })
				}, b.id))]
			})
		]
	});
}
function BucketBrowser({ bucket }) {
	const qc = useQueryClient();
	const listFn = useServerFn(listMyBucketFiles);
	const signFn = useServerFn(signMyBucketFile);
	const delFn = useServerFn(deleteMyBucketFile);
	const { data: files = [], isLoading } = useQuery({
		queryKey: ["my-bucket", bucket],
		queryFn: () => listFn({ data: { bucket } })
	});
	const delMut = useMutation({
		mutationFn: async (path) => delFn({ data: {
			bucket,
			path
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["my-bucket", bucket] });
			toast.success("Arquivo excluído");
		},
		onError: (e) => toast.error(e?.message)
	});
	async function open(path) {
		const r = await signFn({ data: {
			bucket,
			path
		} });
		window.open(r.url, "_blank", "noopener");
	}
	async function handleDelete(path) {
		if (await confirmDialog({
			description: `Excluir este arquivo? Esta ação é permanente.`,
			destructive: true,
			confirmLabel: "Excluir"
		})) delMut.mutate(path);
	}
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center py-8 text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" })
	});
	if (files.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-8 text-center text-sm text-muted-foreground",
		children: "Nenhum arquivo neste bucket ainda."
	});
	const isImageBucket = bucket === "announcements" || bucket === "avatars" || bucket === "exercise-media";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: isImageBucket ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4" : "space-y-2",
		children: files.map((f) => isImageBucket ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageTile, {
			bucket,
			path: f.path,
			name: f.name,
			size: f.size,
			onOpen: () => open(f.path),
			onDelete: () => handleDelete(f.path),
			signFn
		}, f.path) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex items-center justify-between gap-2 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-medium",
					children: f.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						formatSize(f.size),
						" · ",
						f.updated_at ? new Date(f.updated_at).toLocaleString("pt-BR") : "—"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					onClick: () => open(f.path),
					"aria-label": "Abrir",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					onClick: () => handleDelete(f.path),
					"aria-label": "Excluir",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
				})]
			})]
		}, f.path))
	});
}
function ImageTile({ bucket, path, name, size, onOpen, onDelete, signFn }) {
	const { data } = useQuery({
		queryKey: [
			"bucket-thumb",
			bucket,
			path
		],
		queryFn: () => signFn({ data: {
			bucket,
			path
		} }),
		staleTime: 1800 * 1e3
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "group relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onOpen,
				className: "block aspect-square w-full bg-muted",
				children: data?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: data.url,
					alt: name,
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full w-full items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-1 p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-xs",
					title: name,
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 text-[10px] text-muted-foreground",
					children: formatSize(size)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-1 top-1 hidden gap-1 group-hover:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "secondary",
					onClick: onOpen,
					"aria-label": "Abrir",
					className: "h-7 w-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "secondary",
					onClick: onDelete,
					"aria-label": "Excluir",
					className: "h-7 w-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-destructive" })
				})]
			})
		]
	});
}
//#endregion
export { StoragePage as component };
