import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  listStudioForms,
  StudioFormItem,
  FormCategory,
  deleteStudioForm,
} from "@/lib/forms-store";
import { listFormsServerFn, listSubmissionsServerFn } from "@/lib/forms.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  ExternalLink,
  Copy,
  Check,
  Edit,
  Trash2,
  Share2,
  Sparkles,
  Eye,
  Globe,
  UserCheck,
  Clock,
  MessageCircle,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";
import { FormEmbedDialog } from "@/components/forms/FormEmbedDialog";
import { FormEditDialog } from "@/components/forms/FormEditDialog";
import {
  FormSubmissionsDialog,
  FormSubmissionItem,
} from "@/components/forms/FormSubmissionsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/formularios")({
  component: FormulariosAdminPage,
});

function FormulariosAdminPage() {
  const { user } = useAuth();
  const [forms, setForms] = useState<StudioFormItem[]>(() => listStudioForms(user?.id));
  const [submissions, setSubmissions] = useState<FormSubmissionItem[]>([]);
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [embedTarget, setEmbedTarget] = useState<StudioFormItem | null>(null);
  const [editTarget, setEditTarget] = useState<StudioFormItem | null | undefined>(undefined);
  const [submissionsOpen, setSubmissionsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refreshList = async () => {
    try {
      const [formsData, subsData] = await Promise.all([
        listFormsServerFn(),
        listSubmissionsServerFn(),
      ]);
      if (Array.isArray(formsData) && formsData.length > 0) {
        setForms(formsData);
      }
      if (Array.isArray(subsData)) {
        setSubmissions(subsData as FormSubmissionItem[]);
      }
    } catch {}
    setForms((prev) => (prev.length > 0 ? prev : listStudioForms(user?.id)));
  };

  useEffect(() => {
    refreshList();
    // Carrega alunos para vinculação rápida
    (async () => {
      try {
        const { data } = await supabase
          .from("students")
          .select("id, name")
          .is("deleted_at", null)
          .order("name");
        if (data) {
          setStudents(data);
        }
      } catch {}
    })();
  }, [user?.id]);

  const filteredForms = useMemo(() => {
    return forms.filter((f) => {
      const matchSearch =
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase()) ||
        f.slug.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "all" || f.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [forms, search, categoryFilter]);

  const getPublicUrl = (form: StudioFormItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/f/${form.slug || form.id}`;
  };

  const handleCopyLink = async (form: StudioFormItem) => {
    try {
      const url = getPublicUrl(form);
      await navigator.clipboard.writeText(url);
      setCopiedId(form.id);
      toast.success("Link público copiado!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Erro ao copiar link.");
    }
  };

  const handleCopyWhatsApp = async (form: StudioFormItem) => {
    try {
      const url = getPublicUrl(form);
      const text = `Olá! Tudo bem? Segue o link para preenchimento: *${form.title}*:\n👉 ${url}\n\nLeva menos de ${form.estimatedMinutes || 3} minutinhos e já registra diretamente no nosso sistema do Studio!`;
      await navigator.clipboard.writeText(text);
      setCopiedId(form.id + "_wa");
      toast.success("Mensagem formatada para WhatsApp copiada!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Erro ao copiar mensagem.");
    }
  };

  const handleDelete = (form: StudioFormItem) => {
    if (confirm(`Tem certeza que deseja remover o formulário "${form.title}"?`)) {
      deleteStudioForm(form.id, user?.id);
      refreshList();
      toast.success("Formulário removido com sucesso.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Central de Formulários
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              Google Forms Hub
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Conecte e gerencie seus formulários, compartilhe links públicos para WhatsApp/Instagram ou exiba no portal dos alunos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setSubmissionsOpen(true)}
            size="sm"
            variant="outline"
            className="gap-2 font-bold shrink-0 shadow-sm relative border-primary/30 hover:bg-primary/10 text-primary"
          >
            <FileCheck2 className="h-4 w-4" />
            Respostas Recebidas
            {submissions.length > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.2 text-[10px] text-primary-foreground font-black">
                {submissions.length}
              </span>
            )}
          </Button>

          <Button
            onClick={() => setEditTarget(null)}
            size="sm"
            className="gap-2 font-bold shrink-0 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Novo Formulário
          </Button>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, objetivo ou link..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "Todos" },
            { id: "anamnese", label: "Anamnese" },
            { id: "parq", label: "PAR-Q" },
            { id: "objetivos", label: "Metas" },
            { id: "feedback", label: "Feedback" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-card/40">
          <div className="mx-auto h-12 w-12 rounded-xl bg-muted/70 grid place-items-center text-muted-foreground mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Nenhum formulário encontrado</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            Adicione um formulário do Google ou altere os termos da sua busca.
          </p>
          <Button
            size="sm"
            onClick={() => setEditTarget(null)}
            variant="outline"
            className="mt-4 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Cadastrar Primeiro Formulário
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredForms.map((item) => {
            const publicUrl = getPublicUrl(item);
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200"
              >
                <div>
                  {/* Card Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                      <Sparkles className="h-3 w-3" />
                      {item.badge || item.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      ~{item.estimatedMinutes || 3} min
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {item.description || "Sem descrição informada."}
                  </p>

                  {/* Flags (Portal & Public) */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/60">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        item.visibleToStudents
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <UserCheck className="h-3 w-3" />
                      {item.visibleToStudents ? "No Portal do Aluno" : "Oculto no Portal"}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        item.isPublicLead
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Globe className="h-3 w-3" />
                      {item.isPublicLead ? "Público para Leads" : "Apenas Logados"}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1 font-semibold"
                    >
                      <a href={`/f/${item.slug || item.id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        Visualizar
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyWhatsApp(item)}
                      className="h-8 text-xs gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                      title="Copiar mensagem pronta para enviar no WhatsApp"
                    >
                      {copiedId === item.id + "_wa" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <MessageCircle className="h-3.5 w-3.5" />
                      )}
                      WhatsApp
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyLink(item)}
                      className="h-8 px-2 text-xs"
                      title="Copiar link público direto"
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditTarget(item)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      title="Editar formulário"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Excluir formulário"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog de Visualização Embutida */}
      <FormEmbedDialog
        form={embedTarget}
        open={!!embedTarget}
        onOpenChange={(open) => !open && setEmbedTarget(null)}
      />

      {/* Dialog de Criação / Edição */}
      <FormEditDialog
        open={editTarget !== undefined}
        onOpenChange={(open) => !open && setEditTarget(undefined)}
        formToEdit={editTarget}
        tenantId={user?.id}
        onSaved={refreshList}
      />

      {/* Dialog de Respostas & Submissões */}
      <FormSubmissionsDialog
        open={submissionsOpen}
        onOpenChange={setSubmissionsOpen}
        submissions={submissions}
        students={students}
        onRefresh={refreshList}
      />
    </div>
  );
}
