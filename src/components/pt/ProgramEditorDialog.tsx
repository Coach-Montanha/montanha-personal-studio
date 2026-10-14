import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dumbbell,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Sparkles,
  Users,
  Target,
  Clock,
  Layers,
  ChevronRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { confirmDialog } from "@/lib/confirm-dialog";
import { TrainingDayDetail } from "./TrainingDayDetail";

interface ProgramEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programId: string | null;
  initialDayId?: string | null;
}

const CATEGORY_OPTIONS = [
  { value: "hypertrophy", label: "Hipertrofia" },
  { value: "strength", label: "Força Pura" },
  { value: "conditioning", label: "Condicionamento" },
  { value: "weight_loss", label: "Emagrecimento" },
  { value: "general", label: "Geral / Saúde" },
  { value: "kettlebell_sport", label: "Kettlebell Sport" },
  { value: "levantamento_peso", label: "LPO" },
  { value: "treinamento_funcional", label: "Funcional" },
  { value: "corrida", label: "Corrida" },
  { value: "musculacao", label: "Musculação Tradicional" },
  { value: "hibrido", label: "Híbrido" },
];

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
  { value: "athlete", label: "Atleta" },
];

export function ProgramEditorDialog({
  open,
  onOpenChange,
  programId,
  initialDayId,
}: ProgramEditorDialogProps) {
  const qc = useQueryClient();
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  // Modais internos
  const [editProgramOpen, setEditProgramOpen] = useState(false);
  const [dayDialogOpen, setDayDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<any | null>(null);

  // Estados de formulário da rotina
  const [progForm, setProgForm] = useState({
    name: "",
    category: "hypertrophy",
    level: "intermediate",
    training_type: "numeric",
    start_date: "",
    end_date: "",
    goals: "",
    show_to_student: true,
  });

  // Estados de formulário do dia
  const [dayForm, setDayForm] = useState({
    name: "",
    day_label: "",
    description: "",
  });

  // Carregar dados da rotina
  const { data: program, refetch: refetchProgram } = useQuery({
    queryKey: ["pt-program-detail", programId],
    enabled: open && !!programId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pt_programs" as never)
        .select("*, pt_students(id, name, notes)" as never)
        .eq("id" as never, programId!)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });

  // Carregar sessões / dias da rotina
  const { data: days = [], refetch: refetchDays } = useQuery({
    queryKey: ["pt-program-days", programId],
    enabled: open && !!programId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pt_training_days" as never)
        .select("*")
        .eq("program_id", programId!)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  // Sincronizar dia selecionado inicial
  useEffect(() => {
    if (initialDayId && days.some((d) => d.id === initialDayId)) {
      setSelectedDayId(initialDayId);
    } else if (days.length > 0 && (!selectedDayId || !days.some((d) => d.id === selectedDayId))) {
      setSelectedDayId(days[0].id);
    }
  }, [days, initialDayId]);

  // Sincronizar form da rotina quando dados chegam
  useEffect(() => {
    if (program) {
      setProgForm({
        name: program.name || "",
        category: program.category || "hypertrophy",
        level: program.level || "intermediate",
        training_type: program.training_type || "numeric",
        start_date: program.start_date || "",
        end_date: program.end_date || "",
        goals: program.goals || "",
        show_to_student: program.show_to_student ?? true,
      });
    }
  }, [program]);

  // Salvar alterações de metadados da rotina
  async function handleSaveProgram() {
    if (!programId || !progForm.name.trim()) {
      toast.error("O título da rotina é obrigatório.");
      return;
    }
    const { error } = await supabase
      .from("pt_programs" as never)
      .update({
        name: progForm.name.trim(),
        category: progForm.category,
        level: progForm.level,
        training_type: progForm.training_type,
        start_date: progForm.start_date || new Date().toISOString().slice(0, 10),
        end_date: progForm.end_date || null,
        goals: progForm.goals || null,
        show_to_student: progForm.show_to_student,
      } as never)
      .eq("id" as never, programId);

    if (error) {
      toast.error(`Falha ao salvar rotina: ${error.message}`);
      return;
    }

    toast.success("Rotina atualizada com sucesso!");
    setEditProgramOpen(false);
    refetchProgram();
    qc.invalidateQueries({ queryKey: ["pt-programs"] });
  }

  // Abrir modal de criação de novo dia
  function handleOpenNewDay() {
    const nextNumber = days.length + 1;
    const isAlpha = program?.training_type === "alphabetic";
    const alphaLetter = String.fromCharCode(64 + nextNumber); // A, B, C...

    setEditingDay(null);
    setDayForm({
      name: isAlpha ? `Treino ${alphaLetter}` : `Treino ${nextNumber}`,
      day_label: isAlpha ? `Dia ${alphaLetter}` : `Treino ${nextNumber}`,
      description: "",
    });
    setDayDialogOpen(true);
  }

  // Abrir modal de edição de dia existente
  function handleOpenEditDay(day: any) {
    setEditingDay(day);
    setDayForm({
      name: day.name || "",
      day_label: day.day_label || "",
      description: day.description || "",
    });
    setDayDialogOpen(true);
  }

  // Salvar novo dia ou atualizar existente
  async function handleSaveDay() {
    if (!programId || !dayForm.name.trim() || !dayForm.day_label.trim()) {
      toast.error("Nome do treino e identificação do dia são obrigatórios.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      toast.error("Usuário não autenticado.");
      return;
    }

    if (editingDay) {
      const { error } = await supabase
        .from("pt_training_days" as never)
        .update({
          name: dayForm.name.trim(),
          day_label: dayForm.day_label.trim(),
          description: dayForm.description.trim() || null,
        } as never)
        .eq("id" as never, editingDay.id);

      if (error) {
        toast.error(`Falha ao atualizar treino: ${error.message}`);
        return;
      }
      toast.success("Sessão de treino atualizada!");
    } else {
      const { data: inserted, error } = await supabase
        .from("pt_training_days" as never)
        .insert({
          user_id: userId,
          program_id: programId,
          name: dayForm.name.trim(),
          day_label: dayForm.day_label.trim(),
          description: dayForm.description.trim() || null,
          sort_order: days.length,
        } as never)
        .select("id")
        .single();

      if (error) {
        toast.error(`Falha ao criar sessão: ${error.message}`);
        return;
      }
      toast.success("Nova sessão adicionada!");
      if ((inserted as any)?.id) {
        setSelectedDayId((inserted as any).id);
      }
    }

    setDayDialogOpen(false);
    refetchDays();
    qc.invalidateQueries({ queryKey: ["pt-training-days", programId] });
  }

  // Excluir dia de treino
  async function handleDeleteDay(dayId: string, dayName: string) {
    const ok = await confirmDialog({
      title: `Excluir "${dayName}"?`,
      description:
        "Todos os exercícios prescritos nesta sessão serão removidos permanentemente. Deseja prosseguir?",
      confirmText: "Sim, Excluir Sessão",
      cancelText: "Cancelar",
      variant: "danger",
    });
    if (!ok) return;

    const { error } = await supabase
      .from("pt_training_days" as never)
      .delete()
      .eq("id" as never, dayId);

    if (error) {
      toast.error(`Erro ao excluir treino: ${error.message}`);
      return;
    }

    toast.success("Sessão excluída com sucesso!");
    if (selectedDayId === dayId) {
      const remaining = days.filter((d) => d.id !== dayId);
      setSelectedDayId(remaining.length > 0 ? remaining[0].id : null);
    }
    refetchDays();
    qc.invalidateQueries({ queryKey: ["pt-training-days", programId] });
  }

  const selectedDay = days.find((d) => d.id === selectedDayId);
  const isTemplate =
    program?.pt_student_id === "00000000-0000-0000-0000-000000000001" ||
    (!program?.studio_student_id && !program?.pt_student_id);
  const alunoNome = program?.pt_students?.name;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden">
          {/* Top Bar Header */}
          <DialogHeader className="p-4 sm:p-5 border-b border-border/80 bg-muted/20 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground line-clamp-1">
                    {program?.name || "Editar Rotina de Treino"}
                  </DialogTitle>
                  {isTemplate ? (
                    <Badge variant="outline" className="text-[11px] font-semibold text-muted-foreground">
                      Modelo / Acervo
                    </Badge>
                  ) : alunoNome ? (
                    <Badge variant="secondary" className="text-[11px] font-semibold gap-1">
                      <Users className="h-3 w-3" /> {alunoNome}
                    </Badge>
                  ) : null}
                </div>
                <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="font-medium text-foreground">
                    {CATEGORY_OPTIONS.find((c) => c.value === program?.category)?.label || program?.category || "Geral"}
                  </span>
                  <span>•</span>
                  <span>
                    Nível:{" "}
                    {LEVEL_OPTIONS.find((l) => l.value === program?.level)?.label || program?.level || "Intermediário"}
                  </span>
                  {program?.start_date && (
                    <>
                      <span>•</span>
                      <span>Início: {new Date(program.start_date + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                    </>
                  )}
                  {program?.ai_generated_at && (
                    <>
                      <span>•</span>
                      <span className="text-primary font-medium flex items-center gap-0.5">
                        <Sparkles className="h-3 w-3" /> Gerado com IA
                      </span>
                    </>
                  )}
                </DialogDescription>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditProgramOpen(true)}
                  className="gap-1.5 text-xs h-8"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Editar Dados da Rotina</span>
                </Button>
              </div>
            </div>

            {/* Metas / Orientações (se houver) */}
            {program?.goals && (
              <div className="mt-2.5 p-2 rounded-lg bg-background/60 border border-border/60 text-xs text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="line-clamp-2 italic">{program.goals}</p>
              </div>
            )}
          </DialogHeader>

          {/* Body: Seletor de Sessões e Conteúdo do Treino */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Barra de Abas / Seleção de Dias de Treino */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  Sessões de Treino ({days.length})
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleOpenNewDay}
                  className="h-7 text-xs gap-1 px-2.5 bg-primary text-primary-foreground font-semibold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Adicionar Sessão</span>
                </Button>
              </div>

              {days.length === 0 ? (
                <div className="p-8 text-center border rounded-xl border-dashed border-border/80 bg-muted/10 space-y-3">
                  <Dumbbell className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Nenhuma sessão de treino cadastrada</p>
                    <p className="text-xs text-muted-foreground">
                      Crie o primeiro dia (ex: Treino A - Peito e Tríceps) para prescrever exercícios.
                    </p>
                  </div>
                  <Button type="button" size="sm" onClick={handleOpenNewDay} className="gap-1.5 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Criar Primeira Sessão
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
                  {days.map((day) => {
                    const isSelected = selectedDayId === day.id;
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => setSelectedDayId(day.id)}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background text-foreground border-border hover:bg-muted/60"
                        }`}
                      >
                        <span>{day.name}</span>
                        {day.day_label && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {day.day_label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Painel do Dia Selecionado */}
            {selectedDay && (
              <div className="space-y-4 rounded-xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs">
                {/* Header da Sessão Ativa */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">{selectedDay.name}</h3>
                      {selectedDay.day_label && (
                        <Badge variant="outline" className="text-xs font-semibold">
                          {selectedDay.day_label}
                        </Badge>
                      )}
                    </div>
                    {selectedDay.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{selectedDay.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditDay(selectedDay)}
                      className="h-7 text-xs gap-1 px-2 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span>Editar Sessão</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDay(selectedDay.id, selectedDay.name)}
                      className="h-7 text-xs gap-1 px-2 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Excluir Sessão</span>
                    </Button>
                  </div>
                </div>

                {/* Editor Completo de Exercícios (TrainingDayDetail) */}
                <TrainingDayDetail dayId={selectedDay.id} />
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="p-3 border-t border-border/80 bg-muted/20 shrink-0 flex items-center justify-between sm:justify-between">
            <span className="text-[11px] text-muted-foreground italic">
              Todas as modificações de exercícios, cargas e repetições são gravadas em tempo real.
            </span>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Concluir & Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subdialog: Editar Metadados da Rotina */}
      <Dialog open={editProgramOpen} onOpenChange={setEditProgramOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Informações da Rotina</DialogTitle>
            <DialogDescription className="text-xs">
              Ajuste o título, categoria, nível e diretrizes desta prescrição.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Título da Rotina *</Label>
              <Input
                value={progForm.name}
                onChange={(e) => setProgForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ex: Hipertrofia Avançada — Fase 1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Categoria / Foco</Label>
                <Select
                  value={progForm.category}
                  onValueChange={(v) => setProgForm((p) => ({ ...p, category: v }))}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-xs">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nível do Aluno</Label>
                <Select
                  value={progForm.level}
                  onValueChange={(v) => setProgForm((p) => ({ ...p, level: v }))}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVEL_OPTIONS.map((l) => (
                      <SelectItem key={l.value} value={l.value} className="text-xs">
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Data de Início</Label>
                <Input
                  type="date"
                  value={progForm.start_date}
                  onChange={(e) => setProgForm((p) => ({ ...p, start_date: e.target.value }))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Data Prevista Término</Label>
                <Input
                  type="date"
                  value={progForm.end_date}
                  onChange={(e) => setProgForm((p) => ({ ...p, end_date: e.target.value }))}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Orientações Gerais / Metas</Label>
              <Textarea
                rows={3}
                value={progForm.goals}
                onChange={(e) => setProgForm((p) => ({ ...p, goals: e.target.value }))}
                placeholder="Ex: Aquecer manguito rotador antes das sessões de membros superiores..."
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditProgramOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSaveProgram}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subdialog: Adicionar / Editar Sessão (Treino/Dia) */}
      <Dialog open={dayDialogOpen} onOpenChange={setDayDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDay ? "Editar Sessão de Treino" : "Nova Sessão de Treino"}</DialogTitle>
            <DialogDescription className="text-xs">
              Configure o nome e a identificação do dia para organizar os exercícios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nome da Sessão *</Label>
              <Input
                value={dayForm.name}
                onChange={(e) => setDayForm((d) => ({ ...d, name: e.target.value }))}
                placeholder="Ex: Treino A — Peito, Ombros e Tríceps"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Identificação Curta / Rótulo *</Label>
              <Input
                value={dayForm.day_label}
                onChange={(e) => setDayForm((d) => ({ ...d, day_label: e.target.value }))}
                placeholder="Ex: Treino A ou Dia 1"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Descrição / Foco da Sessão</Label>
              <Textarea
                rows={2}
                value={dayForm.description}
                onChange={(e) => setDayForm((d) => ({ ...d, description: e.target.value }))}
                placeholder="Ex: Ênfase em deltoide lateral e tríceps corda."
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDayDialogOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSaveDay}>
              {editingDay ? "Atualizar Sessão" : "Criar Sessão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
