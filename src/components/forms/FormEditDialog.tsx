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
import { StudioFormItem, FormCategory, saveStudioForm } from "@/lib/forms-store";
import { toast } from "sonner";
import { Link2, Sparkles, Globe, UserCheck } from "lucide-react";

interface FormEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formToEdit?: StudioFormItem | null;
  onSaved: (saved: StudioFormItem) => void;
  tenantId?: string;
}

export function FormEditDialog({
  open,
  onOpenChange,
  formToEdit,
  onSaved,
  tenantId,
}: FormEditDialogProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<FormCategory>("anamnese");
  const [description, setDescription] = useState("");
  const [googleFormUrl, setGoogleFormUrl] = useState("");
  const [badge, setBadge] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(3);
  const [visibleToStudents, setVisibleToStudents] = useState(true);
  const [isPublicLead, setIsPublicLead] = useState(true);

  useEffect(() => {
    if (formToEdit) {
      setTitle(formToEdit.title || "");
      setSlug(formToEdit.slug || "");
      setCategory(formToEdit.category || "anamnese");
      setDescription(formToEdit.description || "");
      setGoogleFormUrl(formToEdit.googleFormUrl || "");
      setBadge(formToEdit.badge || "");
      setEstimatedMinutes(formToEdit.estimatedMinutes || 3);
      setVisibleToStudents(formToEdit.visibleToStudents ?? true);
      setIsPublicLead(formToEdit.isPublicLead ?? true);
    } else {
      setTitle("");
      setSlug("");
      setCategory("anamnese");
      setDescription("");
      setGoogleFormUrl("");
      setBadge("Novos Alunos");
      setEstimatedMinutes(3);
      setVisibleToStudents(true);
      setIsPublicLead(true);
    }
  }, [formToEdit, open]);

  // Auto-gera slug baseado no título se slug estiver vazio
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return toast.error("Informe um título para o formulário.");
    }
    if (!googleFormUrl.trim()) {
      return toast.error("Cole o link do seu Google Forms.");
    }

    try {
      const saved = saveStudioForm(
        {
          id: formToEdit?.id,
          title,
          slug,
          category,
          description,
          googleFormUrl,
          badge,
          estimatedMinutes: Number(estimatedMinutes) || 3,
          visibleToStudents,
          isPublicLead,
        },
        tenantId
      );

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
      <DialogContent className="max-w-xl w-[95vw] p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              {formToEdit ? "Editar Formulário" : "Cadastrar Novo Formulário"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Conecte qualquer Google Formulários à vitrine profissional do Studio e gere links públicos para WhatsApp e Instagram.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-1">
            <div className="space-y-1">
              <Label htmlFor="form-title" className="text-xs font-semibold">
                Título do Formulário *
              </Label>
              <Input
                id="form-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Anamnese Inicial & Histórico de Saúde"
                required
                className="h-9 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="form-slug" className="text-xs font-semibold">
                  Identificador na URL (Slug)
                </Label>
                <div className="flex items-center rounded-md border border-input bg-muted/40 px-2 h-9 text-xs">
                  <span className="text-muted-foreground mr-1">/f/</span>
                  <input
                    id="form-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="anamnese"
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
                    <SelectItem value="anamnese">📋 Anamnese Clínica</SelectItem>
                    <SelectItem value="parq">🩺 Prontidão PAR-Q</SelectItem>
                    <SelectItem value="objetivos">🎯 Alinhamento de Metas</SelectItem>
                    <SelectItem value="feedback">⭐ Feedback & Satisfação</SelectItem>
                    <SelectItem value="geral">📄 Formulário Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="form-url" className="text-xs font-semibold flex items-center justify-between">
                <span>Link do Google Forms *</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  docs.google.com/forms/...
                </span>
              </Label>
              <div className="relative">
                <Link2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="form-url"
                  value={googleFormUrl}
                  onChange={(e) => setGoogleFormUrl(e.target.value)}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  required
                  className="pl-9 h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="form-desc" className="text-xs font-semibold">
                Descrição Curta
              </Label>
              <Textarea
                id="form-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve orientação para o aluno entender o objetivo do questionário..."
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
                  placeholder="Ex: Novos Alunos"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="form-minutes" className="text-xs font-semibold">
                  Tempo Estimado (min)
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

            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-border p-2.5 bg-muted/20">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    Exibir no Portal do Aluno
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Alunos conectados veem este formulário na área do portal.
                  </p>
                </div>
                <Switch
                  checked={visibleToStudents}
                  onCheckedChange={setVisibleToStudents}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-2.5 bg-muted/20">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Globe className="h-3.5 w-3.5 text-emerald-500" />
                    Link Público (Captação de Leads / Instagram)
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Permite abrir sem login nem senha pelo link público /f/{slug || "slug"}.
                  </p>
                </div>
                <Switch
                  checked={isPublicLead}
                  onCheckedChange={setIsPublicLead}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
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
