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
  MessageCircle,
  FileText,
  CheckCircle2,
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
  getBlogCatalogFn,
  getArticleDetailFn,
  saveArticleDetailFn,
  rebuildEntireBlogFn,
  type ArticleBlock,
  type ArticleDetail,
} from "@/lib/blog-management.functions";

export const Route = createFileRoute("/_authenticated/blog-editor")({
  head: () => ({ meta: [{ title: "Gerenciador do Blog & Artigos — Montanha Personal Studio" }] }),
  component: BlogEditorPage,
});

export function BlogEditorPage() {
  const queryClient = useQueryClient();

  // Estado geral
  const [activeTab, setActiveTab] = useState<"posts" | "paginas" | "categorias" | "layout">("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedTheme, setSelectedTheme] = useState("Todos");

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

  // Query: Catálogo do Blog
  const { data: blogData, isLoading: isLoadingCatalog, refetch: refetchCatalog } = useQuery({
    queryKey: ["blog-catalog"],
    queryFn: async () => {
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
      const res = await getArticleDetailFn({ data: editingSlug });
      if (!res.success || !res.article) throw new Error(res.error || "Erro ao carregar artigo");
      setCurrentArticle(res.article);
      setBlocks(res.article.blocks);
      setRawMarkdown(res.article.raw_markdown);
      return res.article;
    },
    enabled: !!editingSlug,
  });

  // Filtragem de Posts
  const filteredArticles = useMemo(() => {
    if (!blogData?.articles) return [];
    return blogData.articles.filter((a: any) => {
      const matchesSearch =
        !searchQuery ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.clean_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "Todas" || a.category === selectedCategory;
      const matchesTheme = selectedTheme === "Todos" || a.theme === selectedTheme;
      return matchesSearch && matchesCat && matchesTheme;
    });
  }, [blogData?.articles, searchQuery, selectedCategory, selectedTheme]);

  // Manipulação de Blocos
  const handleAddBlock = (type: ArticleBlock["type"], index?: number) => {
    const newBlock: ArticleBlock = {
      id: "b_" + Math.random().toString(36).substring(2, 9),
      type,
      content: type === "heading" ? "Novo Subtítulo" : type === "paragraph" ? "Digite o conteúdo do seu parágrafo aqui..." : type === "blockquote" ? "Citação em destaque" : "",
      level: type === "heading" ? 2 : undefined,
      items: type === "list" ? ["Item 1", "Item 2", "Item 3"] : undefined,
    };

    if (index !== undefined) {
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

  const handleUpdateListItems = (id: string, itemsText: string) => {
    const items = itemsText.split("\n").filter((i) => i.trim());
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, items } : b)));
  };

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const copy = [...blocks];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    setBlocks(copy);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleDuplicateBlock = (index: number) => {
    const original = blocks[index];
    const duplicated: ArticleBlock = {
      ...original,
      id: "b_" + Math.random().toString(36).substring(2, 9),
    };
    const copy = [...blocks];
    copy.splice(index + 1, 0, duplicated);
    setBlocks(copy);
  };

  // Salvar Artigo
  const handleSaveArticle = async (rebuildAfter = false) => {
    if (!currentArticle) return;
    try {
      setIsSaving(true);
      const res = await saveArticleDetailFn({
        data: {
          slug: currentArticle.slug,
          file_name: currentArticle.file_name,
          full_title: currentArticle.full_title,
          clean_title: currentArticle.clean_title,
          category: currentArticle.category,
          theme: currentArticle.theme,
          date_full: currentArticle.date_full,
          excerpt: currentArticle.excerpt,
          blocks: blocks,
          rebuild: rebuildAfter,
        },
      });

      if (!res.success) throw new Error(res.error || "Erro ao salvar");
      toast.success(rebuildAfter ? "Artigo salvo e blog recompilado!" : "Artigo salvo com sucesso!");
      refetchCatalog();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Recompilar Blog Inteiro
  const handleRebuildEntireBlog = async () => {
    try {
      setIsRebuilding(true);
      toast.info("Iniciando compilação de todos os 182 artigos e páginas...");
      const res = await rebuildEntireBlogFn();
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      refetchCatalog();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsRebuilding(false);
    }
  };

  // =========================================================================
  // TELA 2: CONSTRUTOR DE BLOCOS (Quando um artigo está sendo editado)
  // =========================================================================
  if (editingSlug && currentArticle) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
        {/* Barra Superior do Editor */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-slate-900/95 backdrop-blur border-b border-slate-800">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingSlug(null)}
              className="gap-2 text-slate-300 border-slate-700 hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar aos Posts
            </Button>
            <div className="flex flex-col">
              <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">
                {currentArticle.category} • {currentArticle.theme}
              </span>
              <h2 className="text-sm font-semibold text-white max-w-md truncate">
                {currentArticle.full_title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Seletor de Dispositivo */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded ${previewDevice === "desktop" ? "bg-amber-500 text-black font-bold" : "text-slate-400 hover:text-white"}`}
                title="Modo Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded ${previewDevice === "mobile" ? "bg-amber-500 text-black font-bold" : "text-slate-400 hover:text-white"}`}
                title="Modo Smartphone"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Alternador de Modo de Trabalho */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => setEditorMode("blocks")}
                className={`px-3 py-1 text-xs font-semibold rounded ${editorMode === "blocks" ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-white"}`}
              >
                Blocos Visuais
              </button>
              <button
                onClick={() => setEditorMode("preview")}
                className={`px-3 py-1 text-xs font-semibold rounded ${editorMode === "preview" ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-white"}`}
              >
                Preview ao Vivo
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/materiais/artigos/${currentArticle.slug}`, "_blank")}
              className="gap-2 text-slate-300 border-slate-700 hover:bg-slate-800"
            >
              <ExternalLink className="w-4 h-4" />
              Ver no Blog
            </Button>

            <Button
              size="sm"
              disabled={isSaving}
              onClick={() => handleSaveArticle(false)}
              className="gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>

            <Button
              size="sm"
              disabled={isSaving}
              onClick={() => handleSaveArticle(true)}
              className="gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold"
            >
              <Sparkles className="w-4 h-4" />
              Salvar & Publicar
            </Button>
          </div>
        </header>

        {/* Layout do Editor em 2 Colunas (Paleta + Canvas) */}
        <div className="flex flex-1 overflow-hidden">
          {/* Painel Esquerdo: Metadados & Inserção de Blocos */}
          <aside className="w-80 border-r border-slate-800 bg-slate-900/60 p-5 overflow-y-auto space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                Metadados do Post
              </h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-slate-300">Título Oficial</Label>
                  <Input
                    value={currentArticle.full_title}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, full_title: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-300">Categoria Primária</Label>
                  <Select
                    value={currentArticle.category}
                    onValueChange={(val) => setCurrentArticle({ ...currentArticle, category: val })}
                  >
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-xs">
                      <SelectItem value="Fitness">Fitness (137)</SelectItem>
                      <SelectItem value="Desenvolvimento Pessoal">Desenvolvimento Pessoal (33)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-slate-300">Sub-Tema / Pilar</Label>
                  <Select
                    value={currentArticle.theme}
                    onValueChange={(val) => setCurrentArticle({ ...currentArticle, theme: val })}
                  >
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-xs">
                      <SelectItem value="Treinamento Híbrido">Treinamento Híbrido</SelectItem>
                      <SelectItem value="Corrida & Endurance">Corrida & Endurance</SelectItem>
                      <SelectItem value="Mobilidade Articular">Mobilidade Articular</SelectItem>
                      <SelectItem value="Nutrição & Jejum">Nutrição & Jejum</SelectItem>
                      <SelectItem value="Mindset">Mindset</SelectItem>
                      <SelectItem value="Hipertrofia & Força">Hipertrofia & Força</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-slate-300">Data de Publicação</Label>
                  <Input
                    value={currentArticle.date_full}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, date_full: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-300">Resumo (Excerpt / OpenGraph)</Label>
                  <Textarea
                    rows={3}
                    value={currentArticle.excerpt}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, excerpt: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Inserção de Elementos e Blocos */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                Adicionar Blocos
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock("heading")}
                  className="justify-start gap-2 text-xs border-slate-800 bg-slate-950 hover:bg-slate-800"
                >
                  <Type className="w-3.5 h-3.5 text-amber-500" />
                  + Título
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock("paragraph")}
                  className="justify-start gap-2 text-xs border-slate-800 bg-slate-950 hover:bg-slate-800"
                >
                  <AlignLeft className="w-3.5 h-3.5 text-blue-400" />
                  + Parágrafo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock("list")}
                  className="justify-start gap-2 text-xs border-slate-800 bg-slate-950 hover:bg-slate-800"
                >
                  <List className="w-3.5 h-3.5 text-emerald-400" />
                  + Lista
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock("blockquote")}
                  className="justify-start gap-2 text-xs border-slate-800 bg-slate-950 hover:bg-slate-800"
                >
                  <Quote className="w-3.5 h-3.5 text-purple-400" />
                  + Citação
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock("divider")}
                  className="justify-start gap-2 text-xs border-slate-800 bg-slate-950 hover:bg-slate-800"
                >
                  <Minus className="w-3.5 h-3.5 text-slate-400" />
                  + Divisor
                </Button>
              </div>
            </div>
          </aside>

          {/* Painel Central: Canvas de Edição dos Blocos */}
          <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-black/40">
            <div
              className={`w-full transition-all duration-300 ${
                previewDevice === "mobile"
                  ? "max-w-[400px] border-8 border-slate-800 rounded-[38px] p-6 shadow-2xl bg-black my-4"
                  : "max-w-3xl"
              }`}
            >
              {/* Cabeçalho do Artigo */}
              <div className="text-center pb-8 border-b border-slate-800 mb-8">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-3">
                  {currentArticle.category} • {currentArticle.theme}
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
                  {currentArticle.full_title}
                </h1>
                <div className="text-xs text-slate-400 flex items-center justify-center gap-3">
                  <span>📅 {currentArticle.date_full}</span>
                  <span>•</span>
                  <span>Por Coach Montanha</span>
                </div>
              </div>

              {/* Lista Interativa de Blocos */}
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="group relative p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all"
                  >
                    {/* Barra de Ações do Bloco */}
                    <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-md p-1 shadow-md transition-opacity">
                      <button
                        onClick={() => handleMoveBlock(index, "up")}
                        disabled={index === 0}
                        className="p-1 hover:text-amber-400 text-slate-400 disabled:opacity-30"
                        title="Mover para cima"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveBlock(index, "down")}
                        disabled={index === blocks.length - 1}
                        className="p-1 hover:text-amber-400 text-slate-400 disabled:opacity-30"
                        title="Mover para baixo"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateBlock(index)}
                        className="p-1 hover:text-blue-400 text-slate-400"
                        title="Duplicar bloco"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlock(block.id)}
                        className="p-1 hover:text-red-400 text-slate-400"
                        title="Excluir bloco"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Conteúdo do Bloco por Tipo */}
                    {block.type === "heading" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-amber-500 uppercase">Cabeçalho</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((lvl) => (
                              <button
                                key={lvl}
                                onClick={() => handleUpdateBlockLevel(block.id, lvl)}
                                className={`text-[10px] px-1.5 py-0.5 rounded ${block.level === lvl ? "bg-amber-500 text-black font-bold" : "bg-slate-800 text-slate-400"}`}
                              >
                                H{lvl}
                              </button>
                            ))}
                          </div>
                        </div>
                        <Input
                          value={block.content || ""}
                          onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                          className="bg-slate-950/80 border-slate-800 font-bold text-white text-lg"
                        />
                      </div>
                    )}

                    {block.type === "paragraph" && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-400 uppercase">Parágrafo de Texto</span>
                        <Textarea
                          rows={4}
                          value={block.content || ""}
                          onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                          className="bg-slate-950/80 border-slate-800 text-sm leading-relaxed text-slate-200"
                        />
                      </div>
                    )}

                    {block.type === "blockquote" && (
                      <div className="space-y-1 border-l-4 border-amber-500 pl-3">
                        <span className="text-[10px] font-bold text-purple-400 uppercase">Citação / Destaque</span>
                        <Textarea
                          rows={2}
                          value={block.content || ""}
                          onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                          className="bg-slate-950/80 border-slate-800 text-sm italic text-slate-300"
                        />
                      </div>
                    )}

                    {block.type === "list" && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Lista com Marcadores (1 item por linha)</span>
                        <Textarea
                          rows={3}
                          value={(block.items || []).join("\n")}
                          onChange={(e) => handleUpdateListItems(block.id, e.target.value)}
                          className="bg-slate-950/80 border-slate-800 text-sm text-slate-200 font-mono"
                        />
                      </div>
                    )}

                    {block.type === "divider" && (
                      <div className="py-2 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
                        <div className="h-px bg-slate-800 flex-1" />
                        <span>LINHA DIVISÓRIA</span>
                        <div className="h-px bg-slate-800 flex-1" />
                      </div>
                    )}

                    {/* Botão Flutuante de Inserção entre Blocos */}
                    <div className="pt-2 text-center opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleAddBlock("paragraph", index)}
                        className="text-[11px] text-amber-500 hover:text-amber-400 font-bold px-3 py-1 rounded bg-slate-950 border border-amber-500/30"
                      >
                        + Inserir Bloco Aqui
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bloco Fixo de Finalização */}
              <div className="mt-10 p-6 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-4">
                <Button
                  onClick={() => handleAddBlock("paragraph")}
                  className="gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  Adicionar Bloco ao Final
                </Button>
                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    onClick={() => handleSaveArticle(false)}
                    disabled={isSaving}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs border border-slate-700"
                  >
                    Salvar Rascunho
                  </Button>
                  <Button
                    onClick={() => handleSaveArticle(true)}
                    disabled={isSaving}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
                  >
                    Salvar & Publicar no Blog Oficial ➔
                  </Button>
                </div>
              </div>
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
    <div className="space-y-6 p-6">
      <PageHeader
        title="Gerenciador do Blog & Artigos"
        subtitle="Estrutura de blocos, páginas e categorização fiel ao Systeme.io"
        icon={<Newspaper className="w-6 h-6 text-amber-500" />}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/materiais", "_blank")}
              className="gap-2 text-slate-300 border-slate-700 hover:bg-slate-800"
            >
              <ExternalLink className="w-4 h-4 text-amber-500" />
              Exibir Blog
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isRebuilding}
              onClick={handleRebuildEntireBlog}
              className="gap-2 text-slate-300 border-slate-700 hover:bg-slate-800"
            >
              <RefreshCw className={`w-4 h-4 ${isRebuilding ? "animate-spin text-amber-500" : ""}`} />
              Recompilar Blog
            </Button>
          </div>
        }
      />

      {/* Abas Principais (Posts, Páginas, Categorias, Layout) */}
      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
        <TabsList className="bg-slate-900 border border-slate-800 p-1">
          <TabsTrigger value="posts" className="gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-black font-bold">
            Posts ({blogData?.total_articles || 182})
          </TabsTrigger>
          <TabsTrigger value="paginas" className="gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-black font-bold">
            Páginas ({blogData?.pages?.length || 9})
          </TabsTrigger>
          <TabsTrigger value="categorias" className="gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-black font-bold">
            Categorias ({blogData?.categories?.length || 6})
          </TabsTrigger>
          <TabsTrigger value="layout" className="gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-black font-bold">
            Layout & Configurações
          </TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* ABA POSTS (Tabela idêntica ao Systeme.io)                     */}
        {/* ============================================================== */}
        <TabsContent value="posts" className="space-y-4 mt-4">
          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <Input
                    placeholder="Pesquisar por título do artigo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-950 border-slate-800 text-xs"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-44 bg-slate-950 border-slate-800 text-xs">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-xs">
                    <SelectItem value="Todas">Todas Categorias</SelectItem>
                    <SelectItem value="Fitness">Fitness (137)</SelectItem>
                    <SelectItem value="Desenvolvimento Pessoal">Desenvolvimento Pessoal (33)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger className="w-48 bg-slate-950 border-slate-800 text-xs">
                    <SelectValue placeholder="Sub-Tema" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-xs">
                    <SelectItem value="Todos">Todos os Temas</SelectItem>
                    <SelectItem value="Treinamento Híbrido">Treinamento Híbrido</SelectItem>
                    <SelectItem value="Corrida & Endurance">Corrida & Endurance</SelectItem>
                    <SelectItem value="Mobilidade Articular">Mobilidade Articular</SelectItem>
                    <SelectItem value="Nutrição & Jejum">Nutrição & Jejum</SelectItem>
                    <SelectItem value="Mindset">Mindset</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-xs text-slate-400">
                Exibindo <strong>{filteredArticles.length}</strong> de <strong>{blogData?.total_articles || 182}</strong> artigos
              </div>
            </div>
          </Card>

          {/* Tabela de Artigos do Blog */}
          <Card className="bg-slate-900/60 border-slate-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-950/80">
                <TableRow className="border-slate-800">
                  <TableHead className="text-xs font-bold text-slate-400">TÍTULO</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400">CATEGORIAS</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400">SUB-TEMA</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400">STATUS</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400">CRIADO EM</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 text-right">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article: any) => (
                  <TableRow key={article.slug} className="border-slate-800/60 hover:bg-slate-800/40">
                    <TableCell className="font-semibold text-white text-sm">
                      <button
                        onClick={() => setEditingSlug(article.slug)}
                        className="text-left hover:text-amber-400 transition-colors"
                      >
                        {article.title}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400 bg-amber-500/10">
                        {article.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-400">{article.theme}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Ativo
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      {article.date_short}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingSlug(article.slug)}
                          className="h-8 gap-1 text-xs border-slate-700 bg-slate-900 hover:bg-slate-800 text-amber-400"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Editar Blocos
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(`/materiais/artigos/${article.slug}`, "_blank")}
                          className="h-8 p-2 text-slate-400 hover:text-white"
                          title="Visualizar Artigo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ============================================================== */}
        {/* ABA PÁGINAS (Padrão Systeme.io)                               */}
        {/* ============================================================== */}
        <TabsContent value="paginas" className="space-y-4 mt-4">
          <Card className="bg-slate-900/60 border-slate-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-950/80">
                <TableRow className="border-slate-800">
                  <TableHead className="text-xs font-bold text-slate-400">TÍTULO DA PÁGINA</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400">URL / ROTA</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400">TIPO</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400">STATUS</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400 text-right">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogData?.pages?.map((p: any) => (
                  <TableRow key={p.id} className="border-slate-800/60 hover:bg-slate-800/40">
                    <TableCell className="font-semibold text-white text-sm">
                      {p.title}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 font-mono">
                      {p.url}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs border-slate-700 text-slate-300">
                        {p.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-emerald-400 font-semibold">{p.status}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(p.url, "_blank")}
                        className="h-8 gap-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
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
        {/* ABA CATEGORIAS (Padrão Systeme.io)                            */}
        {/* ============================================================== */}
        <TabsContent value="categorias" className="space-y-4 mt-4">
          <Card className="bg-slate-900/60 border-slate-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-950/80">
                <TableRow className="border-slate-800">
                  <TableHead className="text-xs font-bold text-slate-400">NOME DA CATEGORIA</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400">SLUG</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400">TOTAL DE POSTS</TableHead>
                  <TableHead className="text-xs font-bold text-slate-400">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogData?.categories?.map((cat: any) => (
                  <TableRow key={cat.id} className="border-slate-800/60 hover:bg-slate-800/40">
                    <TableCell className="font-semibold text-white text-sm">
                      {cat.name}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 font-mono">
                      {cat.slug}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-amber-400">
                      {cat.total_posts} posts
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
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
        {/* ABA LAYOUT & CONFIGURAÇÕES                                    */}
        {/* ============================================================== */}
        <TabsContent value="layout" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-slate-900/60 border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4" />
                Estrutura do Cabeçalho Oficial
              </h3>
              <p className="text-xs text-slate-400">
                O cabeçalho do blog segue o padrão de 2 níveis extraído do Systeme.io:
              </p>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <strong>Nível 1 (Utilitários):</strong> Redes sociais (Facebook, Instagram, Twitter/X, YouTube), Logo Blog do Montanha com kettlebell centralizado, e Contador Digital de Visitas Odometer (`4575`).
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <strong>Nível 2 (Navegação):</strong> Menus centralizados: Início, Meus Artigos, Livros/Ebooks, Cursos Online, Links Amazon, Contato e Portal do Aluno.
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-900/60 border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Artigos Populares & Integrações
              </h3>
              <p className="text-xs text-slate-400">
                Configurações automáticas aplicadas em todos os 182 artigos:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                <li>Bloco fixo dos 6 Artigos Populares (NEAT, Envelhecimento, Balança, Fadiga Mental, Jejum, EPOC).</li>
                <li>Caixa de comentários com link direto de WhatsApp pré-formatado para cada artigo.</li>
                <li>Navegação sequencial automática (Artigo Anterior / Próximo Artigo).</li>
                <li>Tag OpenGraph para compartilhamento social de cada artigo com imagem e título.</li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
