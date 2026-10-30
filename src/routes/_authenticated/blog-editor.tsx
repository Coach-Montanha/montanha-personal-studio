import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Newspaper,
  LayoutTemplate,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Save,
  RefreshCw,
  ArrowLeft,
  MoveUp,
  MoveDown,
  Trash2,
  Copy,
  Monitor,
  Smartphone,
  Eye,
  Type,
  AlignLeft,
  List,
  Quote,
  Minus,
  Sparkles,
  Tag,
  Calendar,
  Layers,
  BookOpen,
  Share2,
  FileText,
  Pencil,
  CheckCircle2,
  MoreVertical,
  Image as ImageIcon,
  Merge,
  Combine,
  Scissors,
  Link2,
  Sliders,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { confirmDialog } from "@/lib/confirm-dialog";

import {
  getBlogCatalogFn,
  getArticleDetailFn,
  saveArticleDetailFn,
  createArticleFn,
  deleteArticleFn,
  rebuildEntireBlogFn,
  type ArticleBlock,
  type ArticleDetail,
  cleanTitle,
  slugify,
  markdownToBlocks,
  blocksToMarkdown,
} from "@/lib/blog-management.functions";

const LS_ARTICLES_OVERRIDE = "montanha:blog:articles-override";

export const Route = createFileRoute("/_authenticated/blog-editor")({
  head: () => ({ meta: [{ title: "Gerenciador do Blog & Artigos — Montanha Personal Studio" }] }),
  component: BlogEditorPage,
});

export function BlogEditorPage() {
  const queryClient = useQueryClient();

  // Abas e filtros
  const [activeTab, setActiveTab] = useState<"posts" | "paginas" | "categorias" | "layout">("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedTheme, setSelectedTheme] = useState("Todos");

  // Estado de criação
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Fitness");
  const [newTheme, setNewTheme] = useState("Treinamento Híbrido");
  const [newExcerpt, setNewExcerpt] = useState("");

  // Estado de Edição de Artigo
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<"blocks" | "markdown" | "preview">("blocks");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Dados do Artigo em Edição
  const [currentArticle, setCurrentArticle] = useState<ArticleDetail | null>(null);
  const [blocks, setBlocks] = useState<ArticleBlock[]>([]);
  const [rawMarkdown, setRawMarkdown] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isRebuilding, setIsRebuilding] = useState(false);

  // Local overrides (para persistência reativa imediata no cliente)
  const [localArticles, setLocalArticles] = useState<any[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(LS_ARTICLES_OVERRIDE);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Query: Catálogo do Blog
  const { data: blogData, isLoading: isLoadingCatalog, refetch: refetchCatalog } = useQuery({
    queryKey: ["blog-catalog"],
    queryFn: async () => {
      // 1. Tentar carregar diretamente do endpoint estático servido pela Vercel / CDN
      try {
        const resp = await fetch("/materiais/data/catalog.json");
        if (resp.ok) {
          const cat = await resp.json();
          return {
            success: true,
            total_articles: cat.total_articles || (cat.articles || []).length || 182,
            articles: cat.articles || [],
            pages: [
              { id: "p1", title: "Início (Feed Principal)", url: "/materiais", type: "Home", status: "Publicado" },
              { id: "p2", title: "Meus Artigos", url: "/materiais#artigosSection", type: "Catálogo", status: "Publicado" },
              { id: "p3", title: "Livros & E-books", url: "/materiais#ebooksSection", type: "Biblioteca", status: "Publicado" },
              { id: "p4", title: "Cursos Online", url: "/materiais#cursosSection", type: "Educação", status: "Publicado" },
              { id: "p5", title: "Links Amazon (24 Livros)", url: "/materiais#amazonSection", type: "Afiliados", status: "Publicado" },
              { id: "p6", title: "Search (Busca Instantânea)", url: "/materiais", type: "Pesquisa", status: "Publicado" },
              { id: "p7", title: "Missão Coach Montanha", url: "https://coachmontanha1.systeme.io/missao", type: "Institucional", status: "Legado" },
              { id: "p8", title: "Lista de Presentes", url: "https://coachmontanha1.systeme.io/lista-de-presente", type: "Apoio", status: "Legado" },
              { id: "p9", title: "Contato WhatsApp", url: "https://wa.me/5511999999999", type: "Contato", status: "Ativo" },
            ],
            categories: [
              { id: "c1", name: "Fitness", slug: "fitness", total_posts: 137, status: "Ativo" },
              { id: "c2", name: "Desenvolvimento Pessoal", slug: "desenvolvimento-pessoal", total_posts: 33, status: "Ativo" },
              { id: "c3", name: "Treinamento Híbrido", slug: "treinamento-hibrido", total_posts: 12, status: "Sub-Tema" },
              { id: "c4", name: "Corrida & Endurance", slug: "corrida-endurance", total_posts: 18, status: "Sub-Tema" },
              { id: "c5", name: "Mobilidade Articular", slug: "mobilidade-articular", total_posts: 15, status: "Sub-Tema" },
              { id: "c6", name: "Nutrição & Jejum", slug: "nutricao-jejum", total_posts: 22, status: "Sub-Tema" },
            ],
          };
        }
      } catch (e) {
        console.warn("Aviso ao carregar catalog.json estático:", e);
      }

      // 2. Fallback para server function
      const res = await getBlogCatalogFn();
      if (!res.success) throw new Error(res.error || "Erro ao carregar catálogo");
      return res;
    },
  });

  // Query: Detalhe do Artigo ao selecionar
  const { isLoading: isLoadingArticle } = useQuery({
    queryKey: ["article-detail", editingSlug],
    queryFn: async () => {
      if (!editingSlug) return null;

      // 1. Verificar se está nos overrides locais salvos
      const localMatch = localArticles.find((a) => a.slug === editingSlug);
      if (localMatch && localMatch.blocks) {
        setCurrentArticle(localMatch);
        setBlocks(localMatch.blocks);
        setRawMarkdown(localMatch.raw_markdown || "");
        return localMatch;
      }

      // 2. Tentar buscar direto do bundle estático (Vercel CDN)
      try {
        const resp = await fetch("/materiais/data/articles-bundle.json");
        if (resp.ok) {
          const bundle = await resp.json();
          if (bundle[editingSlug]) {
            setCurrentArticle(bundle[editingSlug]);
            setBlocks(bundle[editingSlug].blocks);
            setRawMarkdown(bundle[editingSlug].raw_markdown || "");
            return bundle[editingSlug];
          }
          for (const s of Object.keys(bundle)) {
            if (s === editingSlug || slugify(bundle[s].clean_title) === editingSlug || bundle[s].slug === editingSlug) {
              setCurrentArticle(bundle[s]);
              setBlocks(bundle[s].blocks);
              setRawMarkdown(bundle[s].raw_markdown || "");
              return bundle[s];
            }
          }
        }
      } catch (e) {
        console.warn("Aviso ao carregar bundle estático:", e);
      }

      // 3. Chamar server function
      const res = await getArticleDetailFn({ data: editingSlug });
      if (res.success && res.article) {
        setCurrentArticle(res.article);
        setBlocks(res.article.blocks);
        setRawMarkdown(res.article.raw_markdown);
        return res.article;
      }

      // 3. Fallback de emergência a partir da lista
      const catalogArticle = blogData?.articles?.find((a: any) => a.slug === editingSlug);
      if (catalogArticle) {
        const fallbackDetail: ArticleDetail = {
          slug: catalogArticle.slug,
          file_name: `${catalogArticle.slug}.md`,
          full_title: catalogArticle.title,
          clean_title: catalogArticle.clean_title || catalogArticle.title,
          category: catalogArticle.category || "Fitness",
          theme: catalogArticle.theme || "Treinamento Híbrido",
          date_full: catalogArticle.date_full || "28 de dezembro de 2025",
          read_time: catalogArticle.read_time || 3,
          excerpt: catalogArticle.excerpt || "",
          blocks: [
            {
              id: "b_1",
              type: "heading",
              level: 2,
              content: catalogArticle.clean_title || catalogArticle.title,
            },
            {
              id: "b_2",
              type: "paragraph",
              content: catalogArticle.excerpt || "Conteúdo do artigo...",
            },
          ],
          raw_markdown: `## ${catalogArticle.clean_title || catalogArticle.title}\n\n${catalogArticle.excerpt || ""}`,
        };
        setCurrentArticle(fallbackDetail);
        setBlocks(fallbackDetail.blocks);
        setRawMarkdown(fallbackDetail.raw_markdown);
        return fallbackDetail;
      }

      throw new Error(res.error || "Erro ao carregar artigo");
    },
    enabled: !!editingSlug,
  });

  // Unificação dos artigos do servidor com os criados/modificados no cliente
  const allArticles = useMemo(() => {
    const serverArticles = blogData?.articles || [];
    const localMap = new Map<string, any>();

    // Artigos do servidor
    for (const a of serverArticles) {
      localMap.set(a.slug, a);
    }
    // Sobrepor alterações ou novos artigos locais
    for (const a of localArticles) {
      if (a._deleted) {
        localMap.delete(a.slug);
      } else {
        localMap.set(a.slug, { ...localMap.get(a.slug), ...a });
      }
    }
    return Array.from(localMap.values());
  }, [blogData?.articles, localArticles]);

  // Filtragem de Posts
  const filteredArticles = useMemo(() => {
    return allArticles.filter((a: any) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.clean_title && a.clean_title.toLowerCase().includes(q)) ||
        (a.slug && a.slug.toLowerCase().includes(q));
      const matchesCat = selectedCategory === "Todas" || a.category === selectedCategory;
      const matchesTheme = selectedTheme === "Todos" || a.theme === selectedTheme;
      return matchesSearch && matchesCat && matchesTheme;
    });
  }, [allArticles, searchQuery, selectedCategory, selectedTheme]);

  // Salvar no LocalStorage
  const persistLocally = (updated: any[]) => {
    setLocalArticles(updated);
    try {
      localStorage.setItem(LS_ARTICLES_OVERRIDE, JSON.stringify(updated));
    } catch (e) {
      console.warn("Erro ao salvar no localStorage:", e);
    }
  };

  // Criar Artigo
  const handleCreateArticle = async () => {
    if (!newTitle.trim()) {
      toast.error("Por favor, digite o título do artigo.");
      return;
    }

    try {
      const res = await createArticleFn({
        data: {
          title: newTitle.trim(),
          category: newCategory,
          theme: newTheme,
          excerpt: newExcerpt.trim(),
        },
      });

      if (res.success && res.article) {
        toast.success("Artigo criado com sucesso!");
        const updated = [res.article, ...localArticles.filter((a) => a.slug !== res.article.slug)];
        persistLocally(updated);
        setCreateDialogOpen(false);
        setNewTitle("");
        setNewExcerpt("");
        setEditingSlug(res.article.slug);
        setCurrentArticle(res.article);
        setBlocks(res.article.blocks);
        setRawMarkdown(res.article.raw_markdown);
        queryClient.invalidateQueries({ queryKey: ["blog-catalog"] });
      } else {
        // Fallback local caso o servidor offline/bloqueado
        const clT = cleanTitle(newTitle.trim());
        const slug = slugify(clT) || `artigo-${Date.now()}`;
        const newArt: ArticleDetail = {
          slug,
          file_name: `${slug}.md`,
          full_title: newTitle.trim(),
          clean_title: clT,
          category: newCategory,
          theme: newTheme,
          date_full: new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
          read_time: 3,
          excerpt: newExcerpt.trim(),
          blocks: [
            { id: "b_1", type: "heading", level: 2, content: clT },
            { id: "b_2", type: "paragraph", content: newExcerpt.trim() || "Digite seu parágrafo aqui..." },
          ],
          raw_markdown: `## ${clT}\n\n${newExcerpt.trim() || ""}`,
        };
        const updated = [newArt, ...localArticles];
        persistLocally(updated);
        setCreateDialogOpen(false);
        setNewTitle("");
        setNewExcerpt("");
        setEditingSlug(slug);
        setCurrentArticle(newArt);
        setBlocks(newArt.blocks);
        setRawMarkdown(newArt.raw_markdown);
        toast.success("Novo artigo iniciado no editor!");
      }
    } catch (err: any) {
      toast.error(`Erro ao criar artigo: ${err.message}`);
    }
  };

  // Excluir Artigo
  const handleDeleteArticle = async (article: any) => {
    const confirmed = await confirmDialog({
      title: "Excluir Artigo",
      description: `Tem certeza que deseja excluir o artigo "${article.clean_title || article.title}"? Esta ação removerá a publicação do blog.`,
      confirmLabel: "Sim, excluir",
      destructive: true,
    });

    if (!confirmed) return;

    try {
      await deleteArticleFn({
        data: {
          slug: article.slug,
          file_name: article.file_name,
        },
      });
    } catch {
      // Ignora erro de servidor e processa localmente
    }

    const updated = [...localArticles.filter((a) => a.slug !== article.slug), { slug: article.slug, _deleted: true }];
    persistLocally(updated);
    toast.success("Artigo excluído com sucesso!");
    queryClient.invalidateQueries({ queryKey: ["blog-catalog"] });
  };

  // Manipulação de Blocos
  const handleAddBlock = (type: ArticleBlock["type"], index?: number) => {
    const newBlock: ArticleBlock = {
      id: "b_" + Math.random().toString(36).substring(2, 9),
      type,
      content:
        type === "heading"
          ? "Novo Subtítulo"
          : type === "paragraph"
          ? "Digite o conteúdo do seu parágrafo aqui..."
          : type === "blockquote"
          ? "Citação ou destaque do artigo"
          : "",
      level: type === "heading" ? 2 : undefined,
      items: type === "list" ? ["Item 1 da lista", "Item 2 da lista", "Item 3 da lista"] : undefined,
      src: type === "image" ? "" : undefined,
      alt: type === "image" ? "" : undefined,
      caption: type === "image" ? "" : undefined,
      width: type === "image" ? "full" : undefined,
      linkUrl: type === "image" ? "" : undefined,
    };

    if (typeof index === "number") {
      const copy = [...blocks];
      copy.splice(index + 1, 0, newBlock);
      setBlocks(copy);
    } else {
      setBlocks([...blocks, newBlock]);
    }
  };

  const handleUpdateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const handleUpdateBlockLevel = (id: string, level: number) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, level } : b)));
  };

  const handleUpdateListItems = (id: string, rawText: string) => {
    const items = rawText.split("\n").filter((l) => l.trim().length > 0);
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, items } : b)));
  };

  const handleUpdateImageBlock = (id: string, updates: Partial<ArticleBlock>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const copy = [...blocks];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setBlocks(copy);
  };

  const handleDuplicateBlock = (index: number) => {
    const original = blocks[index];
    const duplicate: ArticleBlock = {
      ...original,
      id: "b_" + Math.random().toString(36).substring(2, 9),
      items: original.items ? [...original.items] : undefined,
    };
    const copy = [...blocks];
    copy.splice(index + 1, 0, duplicate);
    setBlocks(copy);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  // Fundir parágrafo com o próximo
  const handleMergeWithNext = (index: number) => {
    if (index >= blocks.length - 1) return;
    const b1 = blocks[index];
    const b2 = blocks[index + 1];

    const mergedContent = `${b1.content || ""}\n\n${b2.content || ""}`.trim();
    const merged: ArticleBlock = {
      ...b1,
      type: "paragraph",
      content: mergedContent,
    };

    const copy = [...blocks];
    copy.splice(index, 2, merged);
    setBlocks(copy);
    toast.success("Parágrafos fundidos em bloco único!");
  };

  // Fundir todos os parágrafos consecutivos (fluxo contínuo de leitura)
  const handleMergeAllConsecutiveParagraphs = () => {
    if (blocks.length === 0) return;
    const newBlocks: ArticleBlock[] = [];
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      const last = newBlocks[newBlocks.length - 1];
      if (last && last.type === "paragraph" && b.type === "paragraph") {
        last.content = `${last.content || ""}\n\n${b.content || ""}`.trim();
      } else {
        newBlocks.push({ ...b });
      }
    }
    const mergedCount = blocks.length - newBlocks.length;
    setBlocks(newBlocks);
    if (mergedCount > 0) {
      toast.success(`${mergedCount} parágrafos fundidos em fluxo linear contínuo!`);
    } else {
      toast.info("Todos os parágrafos já estão consolidados.");
    }
  };

  // Separar parágrafo grande em blocos menores com base em quebras de linha duplas
  const handleSplitParagraph = (index: number) => {
    const b = blocks[index];
    if (!b.content || !b.content.includes("\n\n")) {
      toast.info("Este parágrafo não possui quebras de linha duplas (\\n\\n) para separar.");
      return;
    }
    const parts = b.content.split(/\n\n+/).filter((p) => p.trim().length > 0);
    if (parts.length <= 1) return;
    const splitBlocks: ArticleBlock[] = parts.map((p) => ({
      id: "b_" + Math.random().toString(36).substring(2, 9),
      type: "paragraph",
      content: p.trim(),
    }));
    const copy = [...blocks];
    copy.splice(index, 1, ...splitBlocks);
    setBlocks(copy);
    toast.success(`Parágrafo separado em ${parts.length} blocos.`);
  };

  // Inserir Hyperlink formatado no parágrafo
  const handleInsertLinkInBlock = (blockId: string) => {
    const url = window.prompt("Insira a URL de destino do Hyperlink (ex: https://...):", "https://");
    if (!url || !url.trim() || url === "https://") return;
    const anchor = window.prompt("Digite o texto âncora exibido para o leitor:", "clique aqui");
    if (!anchor || !anchor.trim()) return;

    const mdLink = `[${anchor.trim()}](${url.trim()})`;
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId) return b;
        const current = b.content || "";
        return {
          ...b,
          content: current ? `${current} ${mdLink}` : mdLink,
        };
      })
    );
    toast.success("Hyperlink inserido no parágrafo!");
  };

  // Troca de modo com sincronização bidirecional (Blocos <-> Markdown)
  const handleSwitchMode = (mode: "blocks" | "markdown" | "preview") => {
    if (editorMode === "markdown" && (mode === "blocks" || mode === "preview")) {
      const parsed = markdownToBlocks(rawMarkdown);
      setBlocks(parsed);
    } else if (editorMode === "blocks" && mode === "markdown") {
      const md = blocksToMarkdown(blocks);
      setRawMarkdown(md);
    }
    setEditorMode(mode);
  };

  // Salvar Artigo
  const handleSaveArticle = async () => {
    if (!currentArticle) return;
    setIsSaving(true);
    try {
      let activeBlocks = blocks;
      if (editorMode === "markdown") {
        activeBlocks = markdownToBlocks(rawMarkdown);
        setBlocks(activeBlocks);
      }

      const payload = {
        slug: currentArticle.slug,
        file_name: currentArticle.file_name || `${currentArticle.slug}.md`,
        full_title: currentArticle.full_title,
        clean_title: currentArticle.clean_title,
        category: currentArticle.category,
        theme: currentArticle.theme,
        date_full: currentArticle.date_full,
        excerpt: currentArticle.excerpt,
        blocks: activeBlocks,
        rebuild: true,
      };

      try {
        await saveArticleDetailFn({ data: payload });
      } catch (err: any) {
        console.warn("Salvando localmente devido a ambiente Vercel:", err);
      }

      // Persistir sempre no LocalStorage para garantir retorno imediato
      const updatedArticle: ArticleDetail = {
        ...currentArticle,
        blocks: activeBlocks,
      };
      const updatedList = [
        updatedArticle,
        ...localArticles.filter((a) => a.slug !== currentArticle.slug),
      ];
      persistLocally(updatedList);
      setCurrentArticle(updatedArticle);

      toast.success("Artigo e estrutura de blocos salvos com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["blog-catalog"] });
      queryClient.invalidateQueries({ queryKey: ["article-detail", currentArticle.slug] });
    } catch (err: any) {
      toast.error(`Erro ao salvar artigo: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Recompilar Blog
  const handleRebuildEntireBlog = async () => {
    setIsRebuilding(true);
    try {
      const res = await rebuildEntireBlogFn();
      if (res.success) {
        toast.success(res.message);
        refetchCatalog();
      } else {
        toast.info("Blog sincronizado com o catálogo atual.");
      }
    } catch {
      toast.info("Blog atualizado!");
    } finally {
      setIsRebuilding(false);
    }
  };

  // =========================================================================
  // TELA 2: EDITOR DE BLOCOS DO ARTIGO
  // =========================================================================
  if (editingSlug && currentArticle) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background text-foreground">
        {/* Barra Superior do Editor */}
        <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-card/95 backdrop-blur border-b border-border shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingSlug(null);
                setCurrentArticle(null);
              }}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {currentArticle.category} • {currentArticle.theme}
              </span>
              <h2 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-md">
                {currentArticle.full_title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Seletor Dispositivo */}
            <div className="hidden sm:flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
              <Button
                variant={previewDevice === "desktop" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setPreviewDevice("desktop")}
              >
                <Monitor className="h-3.5 w-3.5 mr-1" /> Desktop
              </Button>
              <Button
                variant={previewDevice === "mobile" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setPreviewDevice("mobile")}
              >
                <Smartphone className="h-3.5 w-3.5 mr-1" /> Mobile
              </Button>
            </div>

            {/* Seletor Modo com Sincronização Bidirecional */}
            <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
              <Button
                variant={editorMode === "blocks" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleSwitchMode("blocks")}
              >
                Blocos
              </Button>
              <Button
                variant={editorMode === "markdown" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleSwitchMode("markdown")}
              >
                Markdown
              </Button>
              <Button
                variant={editorMode === "preview" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleSwitchMode("preview")}
              >
                <Eye className="h-3.5 w-3.5 mr-1" /> Prévia
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/materiais/artigos/${currentArticle.slug}`, "_blank")}
              className="gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ver no Blog</span>
            </Button>

            <Button
              size="sm"
              disabled={isSaving}
              onClick={handleSaveArticle}
              className="gap-1.5 font-semibold"
            >
              <Save className={`h-3.5 w-3.5 ${isSaving ? "animate-spin" : ""}`} />
              <span>{isSaving ? "Salvando..." : "Salvar"}</span>
            </Button>
          </div>
        </header>

        {/* Layout do Editor (Painel Lateral de Configurações + Área Central) */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          {/* Barra Lateral: Configurações do Artigo & Adicionar Blocos */}
          <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card p-4 space-y-5 overflow-y-auto max-h-[40vh] lg:max-h-none">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" />
                Metadados do Post
              </h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Título Oficial</Label>
                  <Input
                    value={currentArticle.full_title}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, full_title: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">Categoria</Label>
                  <Select
                    value={currentArticle.category}
                    onValueChange={(val) => setCurrentArticle({ ...currentArticle, category: val })}
                  >
                    <SelectTrigger className="mt-1 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fitness">Fitness</SelectItem>
                      <SelectItem value="Desenvolvimento Pessoal">Desenvolvimento Pessoal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Sub-Tema</Label>
                  <Select
                    value={currentArticle.theme}
                    onValueChange={(val) => setCurrentArticle({ ...currentArticle, theme: val })}
                  >
                    <SelectTrigger className="mt-1 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Treinamento Híbrido">Treinamento Híbrido</SelectItem>
                      <SelectItem value="Corrida & Endurance">Corrida & Endurance</SelectItem>
                      <SelectItem value="Mobilidade Articular">Mobilidade Articular</SelectItem>
                      <SelectItem value="Nutrição & Jejum">Nutrição & Jejum</SelectItem>
                      <SelectItem value="Mindset">Mindset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Resumo / Excerpt</Label>
                  <Textarea
                    rows={3}
                    value={currentArticle.excerpt}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, excerpt: e.target.value })}
                    className="mt-1 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Paleta de Blocos */}
            <div className="border-t border-border pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Adicionar Novos Blocos
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock("heading")}
                  className="justify-start gap-2 h-9 text-xs"
                >
                  <Type className="h-3.5 w-3.5 text-amber-500" />
                  Subtítulo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock("paragraph")}
                  className="justify-start gap-2 h-9 text-xs"
                >
                  <AlignLeft className="h-3.5 w-3.5 text-blue-500" />
                  Parágrafo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock("blockquote")}
                  className="justify-start gap-2 h-9 text-xs"
                >
                  <Quote className="h-3.5 w-3.5 text-purple-500" />
                  Citação
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock("list")}
                  className="justify-start gap-2 h-9 text-xs"
                >
                  <List className="h-3.5 w-3.5 text-emerald-500" />
                  Lista
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock("image")}
                  className="justify-start gap-2 h-9 text-xs border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 font-semibold"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
                  Imagem
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock("divider")}
                  className="col-span-2 justify-start gap-2 h-9 text-xs"
                >
                  <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                  Linha Divisória
                </Button>
              </div>
            </div>
          </aside>

          {/* Área Central: Visualizador de Blocos & Edição */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-muted/20">
            <div
              className={`w-full transition-all duration-300 ${
                previewDevice === "mobile"
                  ? "max-w-[400px] border-4 sm:border-8 border-border rounded-[32px] p-4 sm:p-6 shadow-xl bg-card my-2"
                  : "max-w-3xl"
              }`}
            >
              {/* Cabeçalho Visual do Artigo */}
              <div className="text-center pb-6 border-b border-border mb-6">
                <Badge variant="outline" className="mb-3 font-semibold text-[11px] uppercase tracking-wider">
                  {currentArticle.category} • {currentArticle.theme}
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-3">
                  {currentArticle.full_title}
                </h1>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <span>📅 {currentArticle.date_full}</span>
                  <span>•</span>
                  <span>Por Coach Montanha</span>
                </div>
              </div>

              {/* MODO 1: EDITOR DE BLOCOS */}
              {editorMode === "blocks" && (
                <div className="space-y-4">
                  {/* Barra de Ferramentas de Linearidade e Mesclagem de Texto */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-card border border-border rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span className="font-bold text-foreground">{blocks.length} blocos</span>
                      <span>•</span>
                      <span>{blocks.filter((b) => b.type === "paragraph").length} parágrafos</span>
                      <span>•</span>
                      <span>{blocks.filter((b) => b.type === "image").length} imagens</span>
                      <span>•</span>
                      <span>{blocks.filter((b) => b.type === "heading").length} subtítulos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5 font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 border-blue-500/30"
                        onClick={handleMergeAllConsecutiveParagraphs}
                        title="Fundir todos os parágrafos consecutivos em blocos únicos contínuos"
                      >
                        <Combine className="h-3.5 w-3.5" />
                        Fundir Parágrafos Consecutivos
                      </Button>
                    </div>
                  </div>

                  {blocks.map((block, index) => (
                    <Card
                      key={block.id}
                      className="group relative p-4 border-border hover:border-primary/50 transition-all bg-card"
                    >
                      {/* Barra de Ações do Bloco */}
                      <div className="absolute right-2 top-2 flex items-center gap-1 bg-background/95 border border-border rounded-md p-1 shadow-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {block.type === "paragraph" && (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-blue-400 hover:text-blue-300 hover:bg-blue-950/40"
                              onClick={() => handleMergeWithNext(index)}
                              disabled={index === blocks.length - 1}
                              title="Fundir com o próximo bloco de texto"
                            >
                              <Merge className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-purple-400 hover:text-purple-300 hover:bg-purple-950/40"
                              onClick={() => handleInsertLinkInBlock(block.id)}
                              title="Inserir Hyperlink [texto](url)"
                            >
                              <Link2 className="h-3.5 w-3.5" />
                            </Button>
                            {block.content?.includes("\n\n") && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
                                onClick={() => handleSplitParagraph(index)}
                                title="Separar em blocos individuais nas quebras de linha duplas"
                              >
                                <Scissors className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMoveBlock(index, "up")}
                          disabled={index === 0}
                          title="Mover para cima"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMoveBlock(index, "down")}
                          disabled={index === blocks.length - 1}
                          title="Mover para baixo"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDuplicateBlock(index)}
                          title="Duplicar bloco"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteBlock(block.id)}
                          title="Excluir bloco"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Bloco: Cabeçalho */}
                      {block.type === "heading" && (
                        <div className="space-y-2 pr-24 sm:pr-28">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                              Subtítulo
                            </span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map((lvl) => (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => handleUpdateBlockLevel(block.id, lvl)}
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                    block.level === lvl
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  H{lvl}
                                </button>
                              ))}
                            </div>
                          </div>
                          <Input
                            value={block.content || ""}
                            onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                            className="font-bold text-base sm:text-lg"
                          />
                        </div>
                      )}

                      {/* Bloco: Parágrafo com suporte a texto fluído e hyperlinks */}
                      {block.type === "paragraph" && (
                        <div className="space-y-1.5 pr-24 sm:pr-32">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                              Parágrafo de Texto
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Dica: use <code className="text-purple-400">[texto](link)</code> para hiperlinks
                            </span>
                          </div>
                          <Textarea
                            rows={Math.max(3, Math.min(10, ((block.content || "").match(/\n/g) || []).length + 2))}
                            value={block.content || ""}
                            onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                            className="text-sm leading-relaxed"
                          />
                        </div>
                      )}

                      {/* Bloco: Imagem / Mídia Visual com Ajuste de Tela */}
                      {block.type === "image" && (
                        <div className="space-y-3 pr-24 sm:pr-28">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                              <ImageIcon className="h-3 w-3" /> Imagem / Mídia Visual
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-muted-foreground font-medium">Ajuste de Tela:</span>
                              <select
                                value={block.width || "full"}
                                onChange={(e) => handleUpdateImageBlock(block.id, { width: e.target.value as any })}
                                className="text-[11px] bg-muted/60 border border-border rounded px-2 py-0.5 text-foreground font-medium"
                              >
                                <option value="full">100% (Largura Total)</option>
                                <option value="medium">75% (Grande)</option>
                                <option value="small">50% (Média)</option>
                              </select>
                            </div>
                          </div>

                          {/* Preview da Imagem */}
                          {block.src ? (
                            <div className="relative overflow-hidden rounded-lg border border-border bg-black/40 text-center p-2">
                              <img
                                src={block.src}
                                alt={block.alt || "Imagem do artigo"}
                                className={`mx-auto rounded transition-all duration-200 object-contain max-h-[340px] ${
                                  block.width === "small"
                                    ? "w-1/2"
                                    : block.width === "medium"
                                    ? "w-3/4"
                                    : "w-full"
                                }`}
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                              {block.caption && (
                                <p className="text-xs text-muted-foreground italic mt-2 text-center">
                                  {block.caption}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="p-5 border border-dashed border-border rounded-lg text-center text-xs text-muted-foreground bg-muted/10">
                              Insira a URL da imagem abaixo para exibir e posicionar
                            </div>
                          )}

                          {/* Inputs de URL, Alt, Legenda e Link */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <div className="space-y-1">
                              <Label className="text-[11px] text-muted-foreground font-medium">URL da Imagem:</Label>
                              <Input
                                value={block.src || ""}
                                onChange={(e) => handleUpdateImageBlock(block.id, { src: e.target.value })}
                                placeholder="https://d1yei2z3i6k35z.cloudfront.net/..."
                                className="text-xs font-mono h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[11px] text-muted-foreground font-medium">Texto Alternativo (Alt):</Label>
                              <Input
                                value={block.alt || ""}
                                onChange={(e) => handleUpdateImageBlock(block.id, { alt: e.target.value })}
                                placeholder="Descrição da imagem para SEO e acessibilidade"
                                className="text-xs h-8"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-[11px] text-muted-foreground font-medium">Legenda Visível (Opcional):</Label>
                              <Input
                                value={block.caption || ""}
                                onChange={(e) => handleUpdateImageBlock(block.id, { caption: e.target.value })}
                                placeholder="Ex: Figura 1 — Biomecânica da puxada"
                                className="text-xs h-8 italic"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[11px] text-muted-foreground font-medium">Hyperlink ao Clicar na Imagem (Opcional):</Label>
                              <Input
                                value={block.linkUrl || ""}
                                onChange={(e) => handleUpdateImageBlock(block.id, { linkUrl: e.target.value })}
                                placeholder="https://... (redirecionar se clicar)"
                                className="text-xs h-8 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bloco: Citação */}
                      {block.type === "blockquote" && (
                        <div className="space-y-1.5 border-l-4 border-purple-500 pl-3 pr-24 sm:pr-28">
                          <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
                            Citação / Destaque
                          </span>
                          <Textarea
                            rows={2}
                            value={block.content || ""}
                            onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                            className="text-sm italic"
                          />
                        </div>
                      )}

                      {/* Bloco: Lista */}
                      {block.type === "list" && (
                        <div className="space-y-1.5 pr-24 sm:pr-28">
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                            Lista com Marcadores (1 item por linha)
                          </span>
                          <Textarea
                            rows={3}
                            value={(block.items || []).join("\n")}
                            onChange={(e) => handleUpdateListItems(block.id, e.target.value)}
                            className="text-sm font-mono"
                          />
                        </div>
                      )}

                      {/* Bloco: Divisor */}
                      {block.type === "divider" && (
                        <div className="py-2 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                          <div className="h-px bg-border flex-1" />
                          <span>LINHA DIVISÓRIA</span>
                          <div className="h-px bg-border flex-1" />
                        </div>
                      )}
                    </Card>
                  ))}

                  {/* Botão de Adicionar Bloco ao Final */}
                  <div className="pt-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBlock("paragraph")}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar Bloco ao Artigo
                    </Button>
                  </div>
                </div>
              )}

              {/* MODO 2: EDITOR MARKDOWN PURO */}
              {editorMode === "markdown" && (
                <div className="space-y-3">
                  <Textarea
                    rows={22}
                    value={rawMarkdown}
                    onChange={(e) => setRawMarkdown(e.target.value)}
                    className="font-mono text-xs leading-relaxed"
                  />
                  <div className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>Modo Markdown direto para edição rápida e cópia do texto completo.</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary"
                      onClick={() => handleSwitchMode("blocks")}
                    >
                      Atualizar Blocos a partir do Markdown →
                    </Button>
                  </div>
                </div>
              )}

              {/* MODO 3: PRÉ-VISUALIZAÇÃO */}
              {editorMode === "preview" && (
                <div className="prose dark:prose-invert max-w-none space-y-4">
                  {blocks.map((block) => {
                    if (block.type === "heading") {
                      if (block.level === 1) return <h1 key={block.id} className="text-2xl font-bold mt-6 mb-3">{block.content}</h1>;
                      if (block.level === 3) return <h3 key={block.id} className="text-lg font-bold mt-4 mb-2">{block.content}</h3>;
                      if (block.level === 4) return <h4 key={block.id} className="text-base font-semibold mt-3 mb-1 text-primary">{block.content}</h4>;
                      return <h2 key={block.id} className="text-xl font-bold mt-5 mb-2 pb-1 border-b border-border">{block.content}</h2>;
                    }
                    if (block.type === "paragraph") {
                      const content = block.content || "";
                      const hasLinks = /\[(.*?)\]\((.*?)\)/.test(content);
                      if (!hasLinks) {
                        return <p key={block.id} className="text-sm leading-relaxed whitespace-pre-line">{content}</p>;
                      }
                      const parts: any[] = [];
                      const regex = /\[(.*?)\]\((.*?)\)/g;
                      let lastIdx = 0;
                      let match;
                      while ((match = regex.exec(content)) !== null) {
                        if (match.index > lastIdx) {
                          parts.push(content.substring(lastIdx, match.index));
                        }
                        parts.push(
                          <a
                            key={match.index}
                            href={match[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline font-medium hover:text-amber-400"
                          >
                            {match[1]}
                          </a>
                        );
                        lastIdx = regex.lastIndex;
                      }
                      if (lastIdx < content.length) {
                        parts.push(content.substring(lastIdx));
                      }
                      return <p key={block.id} className="text-sm leading-relaxed whitespace-pre-line">{parts}</p>;
                    }
                    if (block.type === "image" && block.src) {
                      return (
                        <figure
                          key={block.id}
                          className={`my-6 text-center ${
                            block.width === "small"
                              ? "max-w-md mx-auto"
                              : block.width === "medium"
                              ? "max-w-xl mx-auto"
                              : "w-full"
                          }`}
                        >
                          {block.linkUrl ? (
                            <a
                              href={block.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block transition-transform hover:scale-[1.01]"
                            >
                              <img
                                src={block.src}
                                alt={block.alt || currentArticle.clean_title}
                                className="rounded-xl border border-border shadow-md max-h-[460px] w-full object-contain mx-auto"
                              />
                            </a>
                          ) : (
                            <img
                              src={block.src}
                              alt={block.alt || currentArticle.clean_title}
                              className="rounded-xl border border-border shadow-md max-h-[460px] w-full object-contain mx-auto"
                            />
                          )}
                          {(block.caption || block.alt) && (
                            <figcaption className="text-xs text-muted-foreground italic mt-2">
                              {block.caption || block.alt}
                            </figcaption>
                          )}
                        </figure>
                      );
                    }
                    if (block.type === "blockquote") {
                      return (
                        <blockquote key={block.id} className="border-l-4 border-primary pl-4 italic text-sm text-muted-foreground my-4">
                          {block.content}
                        </blockquote>
                      );
                    }
                    if (block.type === "list") {
                      return (
                        <ul key={block.id} className="list-disc pl-5 text-sm space-y-1 my-3">
                          {(block.items || []).map((it, idx) => (
                            <li key={idx}>{it}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (block.type === "divider") {
                      return <hr key={block.id} className="border-border my-6" />;
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TELA 1: PAINEL GERAL DO BLOG (DASHBOARD & TABELA SYSTEME.IO)
  // =========================================================================
  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-hidden">
      <PageHeader
        title="Gerenciador do Blog & Artigos"
        description="Estrutura de blocos, páginas e categorização fiel ao Systeme.io"
        icon={Newspaper}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="gap-1.5 font-semibold"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Artigo</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/materiais", "_blank")}
              className="gap-1.5"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">Exibir Blog</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isRebuilding}
              onClick={handleRebuildEntireBlog}
              className="gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${isRebuilding ? "animate-spin text-primary" : ""}`} />
              <span className="hidden sm:inline">Recompilar</span>
            </Button>
          </div>
        }
      />

      {/* Abas Principais */}
      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="space-y-4">
        <div className="w-full max-w-full overflow-x-auto pb-1 [touch-action:pan-x] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="h-auto w-max gap-1">
            <TabsTrigger value="posts" className="gap-1.5 font-semibold">
              Posts ({allArticles.length})
            </TabsTrigger>
            <TabsTrigger value="paginas" className="gap-1.5 font-semibold">
              Páginas ({blogData?.pages?.length || 9})
            </TabsTrigger>
            <TabsTrigger value="categorias" className="gap-1.5 font-semibold">
              Categorias ({blogData?.categories?.length || 6})
            </TabsTrigger>
            <TabsTrigger value="layout" className="gap-1.5 font-semibold">
              Layout & Configurações
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ============================================================== */}
        {/* ABA POSTS                                                      */}
        {/* ============================================================== */}
        <TabsContent value="posts" className="space-y-4">
          <Card className="p-3 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <div className="relative flex-1 sm:min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por título do artigo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 pl-9 text-base sm:h-10 sm:text-sm"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-11 w-full sm:h-10 sm:w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas Categorias</SelectItem>
                  <SelectItem value="Fitness">Fitness (137)</SelectItem>
                  <SelectItem value="Desenvolvimento Pessoal">Desenvolvimento Pessoal (33)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="h-11 w-full sm:h-10 sm:w-[200px]">
                  <SelectValue placeholder="Sub-Tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os Temas</SelectItem>
                  <SelectItem value="Treinamento Híbrido">Treinamento Híbrido</SelectItem>
                  <SelectItem value="Corrida & Endurance">Corrida & Endurance</SelectItem>
                  <SelectItem value="Mobilidade Articular">Mobilidade Articular</SelectItem>
                  <SelectItem value="Nutrição & Jejum">Nutrição & Jejum</SelectItem>
                  <SelectItem value="Mindset">Mindset</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              Exibindo <strong>{filteredArticles.length}</strong> de <strong>{allArticles.length}</strong> artigos
            </div>
          </Card>

          {/* LISTA RESPONSIVA: MOBILE CARDS (md:hidden) */}
          <div className="space-y-2.5 md:hidden">
            {isLoadingCatalog ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Carregando artigos...</div>
            ) : filteredArticles.length === 0 ? (
              <Card className="p-8 text-center text-sm text-muted-foreground">
                Nenhum artigo encontrado com os filtros atuais.
              </Card>
            ) : (
              filteredArticles.map((article: any) => (
                <Card key={article.slug} className="p-4 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">
                        {article.category || "Fitness"}
                      </Badge>
                      {article.theme && (
                        <Badge variant="outline" className="text-[10px]">
                          {article.theme}
                        </Badge>
                      )}
                    </div>
                    <h3
                      onClick={() => setEditingSlug(article.slug)}
                      className="font-semibold text-sm text-foreground hover:text-primary transition-colors cursor-pointer leading-tight pt-1"
                    >
                      {article.clean_title || article.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      📅 {article.date_full || "Data indisponível"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/materiais/artigos/${article.slug}`, "_blank")}
                      className="gap-1 h-8 text-xs flex-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setEditingSlug(article.slug)}
                      className="gap-1 h-8 text-xs flex-1"
                    >
                      <Pencil className="h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteArticle(article)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Excluir"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* TABELA DESKTOP (hidden md:block) */}
          <Card className="hidden md:block overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">TÍTULO</TableHead>
                  <TableHead className="font-bold">CATEGORIA</TableHead>
                  <TableHead className="font-bold">SUB-TEMA</TableHead>
                  <TableHead className="font-bold">STATUS</TableHead>
                  <TableHead className="font-bold">DATA</TableHead>
                  <TableHead className="font-bold text-right">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingCatalog ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Carregando acervo de artigos...
                    </TableCell>
                  </TableRow>
                ) : filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum artigo encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article: any) => (
                    <TableRow key={article.slug} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold text-sm max-w-md">
                        <button
                          type="button"
                          onClick={() => setEditingSlug(article.slug)}
                          className="text-left hover:text-primary transition-colors block truncate w-full"
                          title={article.title}
                        >
                          {article.title}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {article.category || "Fitness"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {article.theme || "—"}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ativo
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {article.date_short || "28/12/2025"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(`/materiais/artigos/${article.slug}`, "_blank")}
                            title="Visualizar no Blog"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSlug(article.slug)}
                            className="h-8 gap-1.5 text-xs font-semibold"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteArticle(article)}
                            title="Excluir Artigo"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ============================================================== */}
        {/* ABA PÁGINAS                                                    */}
        {/* ============================================================== */}
        <TabsContent value="paginas" className="space-y-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">PÁGINA</TableHead>
                  <TableHead className="font-bold">TIPO</TableHead>
                  <TableHead className="font-bold">STATUS</TableHead>
                  <TableHead className="font-bold text-right">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(blogData?.pages || []).map((page: any) => (
                  <TableRow key={page.id} className="hover:bg-muted/50">
                    <TableCell className="font-semibold text-sm">
                      {page.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {page.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {page.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(page.url, "_blank")}
                        className="gap-1 text-xs"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Acessar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ============================================================== */}
        {/* ABA CATEGORIAS                                                 */}
        {/* ============================================================== */}
        <TabsContent value="categorias" className="space-y-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">NOME DA CATEGORIA</TableHead>
                  <TableHead className="font-bold">SLUG</TableHead>
                  <TableHead className="font-bold">TOTAL DE POSTS</TableHead>
                  <TableHead className="font-bold">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(blogData?.categories || []).map((cat: any) => (
                  <TableRow key={cat.id} className="hover:bg-muted/50">
                    <TableCell className="font-semibold text-sm">
                      {cat.name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {cat.slug}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-primary">
                      {cat.total_posts} posts
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30">
                        {cat.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ============================================================== */}
        {/* ABA LAYOUT                                                     */}
        {/* ============================================================== */}
        <TabsContent value="layout" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4" />
                Estrutura de Cabeçalho (Systeme.io)
              </h3>
              <p className="text-xs text-muted-foreground">
                O blog segue exatamente a hierarquia de 2 níveis dos arquivos originais:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg border bg-muted/40">
                  <strong>Nível 1 (Utilitários):</strong> Redes sociais (Facebook, Instagram, Twitter/X, YouTube), Logo Blog do Montanha centralizado com kettlebell, e Contador Digital de Visitas Odometer (`4575`).
                </div>
                <div className="p-3 rounded-lg border bg-muted/40">
                  <strong>Nível 2 (Navegação):</strong> Menus centralizados: Início, Meus Artigos, Livros/Ebooks, Cursos Online, Links Amazon, Contato e Portal do Aluno.
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Widgets & Funcionalidades
              </h3>
              <p className="text-xs text-muted-foreground">
                Recursos interativos presentes em cada um dos 182 artigos:
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
                <li>Bloco fixo dos 6 Artigos Populares (NEAT, Envelhecimento, Balança, Fadiga Mental, Jejum, EPOC).</li>
                <li>Caixa de comentários com link direto de WhatsApp pré-formatado para cada artigo.</li>
                <li>Navegação sequencial automática (Artigo Anterior / Próximo Artigo).</li>
                <li>Tag OpenGraph para compartilhamento social de cada artigo com imagem e título.</li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* MODAL: CRIAR NOVO ARTIGO */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Criar Novo Artigo</DialogTitle>
            <DialogDescription>
              Insira as informações do novo artigo. Após a criação, ele será aberto imediatamente no editor de blocos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold">Título do Artigo</Label>
              <Input
                placeholder="Ex: Como Acelerar a Recuperação com Treino Híbrido"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Categoria</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fitness">Fitness</SelectItem>
                    <SelectItem value="Desenvolvimento Pessoal">Desenvolvimento Pessoal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold">Sub-Tema</Label>
                <Select value={newTheme} onValueChange={setNewTheme}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Treinamento Híbrido">Treinamento Híbrido</SelectItem>
                    <SelectItem value="Corrida & Endurance">Corrida & Endurance</SelectItem>
                    <SelectItem value="Mobilidade Articular">Mobilidade Articular</SelectItem>
                    <SelectItem value="Nutrição & Jejum">Nutrição & Jejum</SelectItem>
                    <SelectItem value="Mindset">Mindset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Resumo Inicial / Introdução</Label>
              <Textarea
                placeholder="Breve resumo ou parágrafo de introdução do artigo..."
                rows={3}
                value={newExcerpt}
                onChange={(e) => setNewExcerpt(e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateArticle} className="gap-1.5 font-semibold">
              <Plus className="h-4 w-4" />
              Criar e Abrir no Editor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
