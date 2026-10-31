import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StudioFormItem,
  FormCategory,
  FormFieldDefinition,
  FormFieldType,
  saveStudioForm,
} from "@/lib/forms-store";
import { DEFAULT_STUDIO_FORMS } from "@/lib/forms-definitions";
import { saveFormServerFn } from "@/lib/forms.functions";
import { toast } from "sonner";
import {
  Link2,
  Sparkles,
  Globe,
  UserCheck,
  Plus,
  Trash2,
  Sliders,
  Type,
  AlignLeft,
  ListOrdered,
  CheckSquare,
  Hash,
  Archive,
} from "lucide-react";

interface FormEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formToEdit?: StudioFormItem | null;
  onSaved: (saved: StudioFormItem) => void;
  tenantId?: string;
}

const FIELD_TYPE_OPTIONS: Array<{ value: FormFieldType; label: string; icon: any }> = [
  { value: "text", label: "Texto Curto", icon: Type },
  { value: "textarea", label: "Texto Longo / Parágrafo", icon: AlignLeft },
  { value: "tel", label: "WhatsApp / Telefone", icon: Hash },
  { value: "radio", label: "Múltipla Escolha (1 opção)", icon: ListOrdered },
  { value: "checkbox", label: "Caixas de Seleção (várias)", icon: CheckSquare },
  { value: "select", label: "Menu Suspenso (Dropdown)", icon: Sliders },
];

export function FormEditDialog({
  open,
  onOpenChange,
  formToEdit,
  onSaved,
  tenantId,
}: FormEditDialogProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<FormCategory>("geral");
  const [description, setDescription] = useState("");
  const [googleFormUrl, setGoogleFormUrl] = useState("");
  const [badge, setBadge] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(2);
  const [visibleToStudents, setVisibleToStudents] = useState(true);
  const [isPublicLead, setIsPublicLead] = useState(true);
  const [isArchived, setIsArchived] = useState(false);
  const [fields, setFields] = useState<FormFieldDefinition[]>([]);

  useEffect(() => {
    if (formToEdit) {
      setTitle(formToEdit.title || "");
      setSlug(formToEdit.slug || "");
      setCategory(formToEdit.category || "geral");
      setDescription(formToEdit.description || "");
      setGoogleFormUrl(formToEdit.googleFormUrl || "");
      setBadge(formToEdit.badge || "");
      setEstimatedMinutes(formToEdit.estimatedMinutes || 2);
      setVisibleToStudents(formToEdit.visibleToStudents ?? true);
      setIsPublicLead(formToEdit.isPublicLead ?? true);
      setIsArchived((formToEdit as any).isArchived ?? false);

      // Se o formulário já tem campos customizados, usa eles
      if (formToEdit.fields && formToEdit.fields.length > 0) {
        setFields(JSON.parse(JSON.stringify(formToEdit.fields)));
      } else {
        // Se for um dos formulários modelo padrão (ex: termo-de-imagem, anamnese, par-q, feedback, camiseta), hidrata com as perguntas oficiais correspondentes
        const normSlug = (formToEdit.slug || formToEdit.id || "").toLowerCase();
        const defMatch = DEFAULT_STUDIO_FORMS.find(
          (d) => d.slug.toLowerCase() === normSlug || d.id.toLowerCase() === normSlug
        );
        if (defMatch?.fields && defMatch.fields.length > 0) {
          setFields(JSON.parse(JSON.stringify(defMatch.fields)));
        } else {
          setFields([
            {
              id: "nome_completo",
              label: "Nome Completo",
              type: "text",
              required: true,
              placeholder: "Digite o nome e sobrenome",
            },
            {
              id: "telefone_whatsapp",
              label: "WhatsApp de Contato",
              type: "tel",
              required: true,
              placeholder: "(00) 00000-0000",
            },
          ]);
        }
      }
    } else {
      setTitle("");
      setSlug("");
      setCategory("geral");
      setDescription("");
      setGoogleFormUrl("");
      setBadge("Oficial");
      setEstimatedMinutes(2);
      setVisibleToStudents(true);
      setIsPublicLead(true);
      setIsArchived(false);
      // Blocos padrão para novo formulário
      setFields([
        {
          id: "nome_completo",
          label: "Nome Completo",
          type: "text",
          required: true,
          placeholder: "Digite o nome e sobrenome",
        },
        {
          id: "telefone_whatsapp",
          label: "WhatsApp de Contato",
          type: "tel",
          required: true,
          placeholder: "(00) 00000-0000",
        },
      ]);
    }
  }, [formToEdit, open]);

  // Auto-gera slug baseado no título
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!formToEdit && (!slug || slug === "")) {
      const generated = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  // Gerenciamento de blocos de perguntas
  const addField = () => {
    const newId = `campo_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 5)}`;
    setFields((prev) => [
      ...prev,
      {
        id: newId,
        label: "Nova Pergunta / Informação",
        type: "text",
        required: true,
        placeholder: "Digite aqui...",
      },
    ]);
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<FormFieldDefinition>) => {
    setFields((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return toast.error("Informe um título para o formulário.");
    }

    try {
      const payload: any = {
        id: formToEdit?.id,
        title: title.trim(),
        slug: slug.trim(),
        category,
        description: description.trim(),
        googleFormUrl: googleFormUrl.trim(),
        badge: badge.trim(),
        estimatedMinutes: Number(estimatedMinutes) || 2,
        visibleToStudents,
        isPublicLead,
        isArchived,
        fields,
        userId: tenantId,
      };

      // 1. Salva localmente como cache imediato
      const saved = saveStudioForm(payload, tenantId);

      // 2. Salva no banco de dados na nuvem via server function (sincronização global)
      try {
        await saveFormServerFn({ data: payload });
      } catch (cloudErr) {
        console.warn("Aviso ao sincronizar na nuvem:", cloudErr);
      }

      toast.success(
        formToEdit ? "Formulário atualizado com sucesso!" : "Novo formulário cadastrado!"
      );
      onSaved(saved);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(`Erro ao salvar formulário: ${err?.message || "Tente novamente"}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[96vw] max-h-[92vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-5 border-b border-border/80 bg-muted/20 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            {formToEdit ? "Editar Formulário & Questionário" : "Criar Novo Formulário"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Personalize título, visibilidade e edite diretamente as perguntas, alternativas e campos do questionário.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Dados Gerais do Formulário */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="form-title" className="text-xs font-semibold">
                Título do Formulário *
              </Label>
              <Input
                id="form-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Pedido de Camiseta Oficial do Studio"
                required
                className="h-9 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="form-slug" className="text-xs font-semibold">
                  Link na URL (Slug)
                </Label>
                <div className="flex items-center rounded-md border border-input bg-muted/40 px-2 h-9 text-xs">
                  <span className="text-muted-foreground mr-1">/f/</span>
                  <input
                    id="form-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="camiseta-studio"
                    className="w-full bg-transparent outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="form-category" className="text-xs font-semibold">
                  Categoria
                </Label>
                <Select
                  value={category}
                  onValueChange={(val) => setCategory(val as FormCategory)}
                >
                  <SelectTrigger id="form-category" className="h-9 text-xs">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">👕 Geral & Pedidos / Loja</SelectItem>
                    <SelectItem value="anamnese">📋 Anamnese Clínica</SelectItem>
                    <SelectItem value="parq">🩺 Prontidão PAR-Q</SelectItem>
                    <SelectItem value="objetivos">🎯 Alinhamento de Metas</SelectItem>
                    <SelectItem value="feedback">⭐ Feedback & Satisfação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="form-desc" className="text-xs font-semibold">
                Descrição ou Instruções aos Alunos
              </Label>
              <Textarea
                id="form-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Escolha o modelo e tamanho ideal da sua camiseta do Studio..."
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="form-badge" className="text-xs font-semibold">
                  Tag / Selo Visual
                </Label>
                <Input
                  id="form-badge"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Ex: Loja & Uniforme"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="form-minutes" className="text-xs font-semibold">
                  Tempo Estimado (minutos)
                </Label>
                <Input
                  id="form-minutes"
                  type="number"
                  min="1"
                  max="60"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="form-url" className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Google Forms (Opcional - caso queira espelhar)</span>
                <span className="text-[10px]">docs.google.com/forms/...</span>
              </Label>
              <div className="relative">
                <Link2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="form-url"
                  value={googleFormUrl}
                  onChange={(e) => setGoogleFormUrl(e.target.value)}
                  placeholder="Deixe em branco para usar o formulário interativo nativo"
                  className="pl-9 h-9 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Seção Dinâmica de Perguntas & Blocos do Questionário */}
          <div className="pt-3 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Perguntas & Campos do Questionário ({fields.length})
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Adicione, altere enunciados, configure tamanhos, opções de escolha ou remova campos.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addField}
                className="h-8 gap-1.5 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10"
              >
                <Plus className="h-3.5 w-3.5" />
                Nova Pergunta
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((f, idx) => (
                <div
                  key={f.id}
                  className="rounded-xl border border-border bg-card p-3.5 shadow-2xs space-y-2.5 transition-all hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary font-mono">
                        {idx + 1}
                      </span>
                      <span>Pergunta #{idx + 1}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!f.required}
                          onChange={(e) => updateField(idx, { required: e.target.checked })}
                          className="h-3.5 w-3.5 rounded border-border text-primary accent-primary"
                        />
                        <span>Obrigatória</span>
                      </label>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(idx)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Remover esta pergunta"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-7 space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Enunciado da Pergunta / Campo</Label>
                      <Input
                        value={f.label}
                        onChange={(e) => updateField(idx, { label: e.target.value })}
                        placeholder="Ex: Tamanho da Camiseta ou Horário preferido"
                        className="h-8 text-xs font-medium"
                      />
                    </div>

                    <div className="sm:col-span-5 space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Tipo de Resposta</Label>
                      <Select
                        value={f.type}
                        onValueChange={(val) => {
                          const newType = val as FormFieldType;
                          const updates: Partial<FormFieldDefinition> = { type: newType };
                          if (["radio", "checkbox", "select"].includes(newType) && (!f.options || f.options.length === 0)) {
                            updates.options = ["Opção 1", "Opção 2", "Opção 3"];
                          }
                          updateField(idx, updates);
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Opções configuráveis se for radio, select ou checkbox */}
                  {["radio", "checkbox", "select"].includes(f.type) && (
                    <div className="space-y-1.5 pt-1 bg-muted/20 p-2.5 rounded-lg border border-border/60">
                      <Label className="text-[11px] font-semibold text-foreground flex items-center justify-between">
                        <span>Alternativas de Escolha (separadas por vírgula)</span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          Ex: PP, P, M, G, GG, XGG
                        </span>
                      </Label>
                      <Input
                        value={(f.options || []).join(", ")}
                        onChange={(e) => {
                          const opts = e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          updateField(idx, { options: opts });
                        }}
                        placeholder="PP, P, M, G, GG, XGG"
                        className="h-8 text-xs"
                      />
                    </div>
                  )}

                  {/* Dica interna e Orientação */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      value={f.placeholder || ""}
                      onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                      placeholder="Texto de dica dentro do campo..."
                      className="h-7 text-[11px] text-muted-foreground"
                    />
                    <Input
                      value={f.helperText || ""}
                      onChange={(e) => updateField(idx, { helperText: e.target.value })}
                      placeholder="Orientação explicativa abaixo da pergunta..."
                      className="h-7 text-[11px] text-muted-foreground"
                    />
                  </div>
                </div>
              ))}

              {fields.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-6 text-center bg-muted/10">
                  <p className="text-xs text-muted-foreground">
                    Nenhuma pergunta neste formulário. Clique no botão acima para adicionar.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Configurações de Visibilidade & Arquivamento */}
          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-border p-2.5 bg-muted/20">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                  Exibir no Portal do Aluno
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Alunos logados veem este formulário na área do portal.
                </p>
              </div>
              <Switch checked={visibleToStudents} onCheckedChange={setVisibleToStudents} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-2.5 bg-muted/20">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                  <Globe className="h-3.5 w-3.5" />
                  Link Público Aberto
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Permite responder pelo link público /f/{slug || "slug"}.
                </p>
              </div>
              <Switch checked={isPublicLead} onCheckedChange={setIsPublicLead} />
            </div>

            {/* Controle de Arquivamento / Ocultação Total */}
            <div className="flex items-center justify-between rounded-lg border border-amber-500/30 p-2.5 bg-amber-500/5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Archive className="h-3.5 w-3.5" />
                  Arquivar Formulário (Deixar Invisível)
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Oculta este formulário da listagem principal ativa e bloqueia novos envios sem apagá-lo.
                </p>
              </div>
              <Switch checked={isArchived} onCheckedChange={setIsArchived} />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="font-bold">
              Salvar Formulário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
