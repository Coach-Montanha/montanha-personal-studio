import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  Calendar,
  Loader2,
  CheckCircle2,
  Users,
  Dumbbell,
  Sparkles,
  Layers,
  UserCheck,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface DuplicateProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: {
    id: string;
    name: string;
    category?: string;
    level?: string;
    training_type?: string;
    goals?: string | null;
    start_date?: string;
    pt_student_id?: string | null;
    students?: { id: string; name: string } | null;
    pt_students?: { id: string; name: string } | null;
    pt_training_days?: Array<{ id: string; name: string }> | null;
  } | null;
  onSuccess?: (newProgramId: string) => void;
}

export function DuplicateProgramDialog({
  open,
  onOpenChange,
  program,
  onSuccess,
}: DuplicateProgramDialogProps) {
  const qc = useQueryClient();

  const [newName, setNewName] = useState("");
  const [destinationType, setDestinationType] = useState<"template" | "same_student" | "another_student">("template");
  const [tipoAluno, setTipoAluno] = useState<"studio" | "pt">("studio");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Inicializa o nome do treino duplicado quando o programa abre
  useEffect(() => {
    if (program) {
      const baseName = program.name.replace(/\s*\(Cópia(\s*\d+)?\)$/i, "").trim();
      setNewName(`${baseName} (Cópia)`);
      if (program.pt_student_id && program.pt_student_id !== "00000000-0000-0000-0000-000000000001") {
        setDestinationType("same_student");
      } else {
        setDestinationType("template");
      }
      setSelectedStudentId("");
      setStartDate(new Date().toISOString().slice(0, 10));
    }
  }, [program, open]);

  // Alunos ATIVOS do Studio
  const { data: studioStudents = [], isLoading: loadingStudio } = useQuery({
    queryKey: ["active-studio-students-for-duplicate"],
    enabled: open && destinationType === "another_student",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students" as never)
        .select("id, name, email, status, deleted_at" as never)
        .eq("status" as never, "active")
        .is("deleted_at" as never, null)
        .order("name" as never);
      if (error) throw error;
      return (data || []) as Array<{ id: string; name: string; email: string | null }>;
    },
  });

  // Alunos ATIVOS de Personal Trainer
  const { data: ptStudents = [], isLoading: loadingPt } = useQuery({
    queryKey: ["active-pt-students-for-duplicate"],
    enabled: open && destinationType === "another_student",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pt_students" as never)
        .select("id, name, email, status, notes, deleted_at" as never)
        .eq("status" as never, "active")
        .neq("id" as never, "00000000-0000-0000-0000-000000000001")
        .is("deleted_at" as never, null)
        .order("name" as never);
      if (error) throw error;
      const raw = (data || []) as Array<{ id: string; name: string; email: string | null; notes?: string | null }>;
      return raw.filter(
        (s) => !s.notes || (!s.notes.includes("[Studio]") && !s.notes.includes("[Aluno Studio]"))
      );
    },
  });

  const activeStudents = tipoAluno === "studio" ? studioStudents : ptStudents;

  const originalStudentName =
    program?.pt_students?.name?.trim() || program?.students?.name?.trim() || null;

  const totalDays = program?.pt_training_days?.length ?? 0;

  const duplicateMutation = useMutation({
    mutationFn: async () => {
      if (!program) throw new Error("Nenhum treino selecionado.");
      const cleanName = newName.trim();
      if (!cleanName) throw new Error("Informe o nome do novo treino.");

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Usuário não autenticado.");

      // 1. Resolve o ID do aluno destino
      let targetStudentId: string | null = null;
      if (destinationType === "same_student") {
        targetStudentId = program.pt_student_id || null;
      } else if (destinationType === "another_student") {
        if (!selectedStudentId) {
          throw new Error("Selecione o aluno que receberá a cópia do treino.");
        }
        targetStudentId = selectedStudentId;

        // Se for aluno Studio, sincroniza em pt_students para acesso ao app
        if (tipoAluno === "studio") {
          const target = studioStudents.find((s) => s.id === selectedStudentId);
          if (target) {
            await supabase.from("pt_students" as never).upsert(
              {
                id: target.id,
                user_id: userId,
                name: target.name,
                email: target.email,
                phone: (target as any).phone ?? null,
                account_user_id: (target as any).account_user_id ?? null,
                temp_password: (target as any).temp_password ?? null,
                status: "active",
                notes: "[Aluno Studio]",
              } as never,
              { onConflict: "id" } as never
            );
          }
        }
      } else {
        // Modelo no Acervo Geral
        targetStudentId = null;
      }

      // 2. Busca os dados completos da rotina original
      const { data: originalProg, error: progErr } = await supabase
        .from("pt_programs" as never)
        .select("*")
        .eq("id" as never, program.id)
        .single();

      if (progErr || !originalProg) throw new Error("Treino original não encontrado no banco.");

      // 3. Busca todos os dias da rotina original
      const { data: originalDays = [], error: daysErr } = await supabase
        .from("pt_training_days" as never)
        .select("*")
        .eq("program_id" as never, program.id)
        .order("sort_order" as never, { ascending: true });

      if (daysErr) throw new Error(daysErr.message);

      // 4. Cria o novo programa duplicado
      const { data: newProg, error: newProgErr } = await supabase
        .from("pt_programs" as never)
        .insert({
          user_id: userId,
          pt_student_id: targetStudentId,
          name: cleanName,
          category: (originalProg as any).category ?? "hypertrophy",
          level: (originalProg as any).level ?? "intermediate",
          training_type: (originalProg as any).training_type ?? "musculacao",
          start_date: startDate || new Date().toISOString().slice(0, 10),
          goals: (originalProg as any).goals ?? null,
          show_to_student: targetStudentId ? true : false,
          auto_archive: (originalProg as any).auto_archive ?? true,
          ai_prompt: (originalProg as any).ai_prompt ?? null,
          ai_generated_at: (originalProg as any).ai_generated_at ?? null,
        } as never)
        .select("id")
        .single();

      if (newProgErr || !newProg) {
        throw new Error(`Falha ao criar cópia do treino: ${newProgErr?.message}`);
      }

      const newProgramId = (newProg as any).id as string;
      let totalExercisesCopied = 0;

      // 5. Duplica cada sessão e seus respectivos exercícios
      for (const day of originalDays as any[]) {
        const { data: newDay, error: newDayErr } = await supabase
          .from("pt_training_days" as never)
          .insert({
            user_id: userId,
            program_id: newProgramId,
            name: day.name,
            day_label: day.day_label,
            description: day.description ?? null,
            sort_order: day.sort_order ?? 0,
          } as never)
          .select("id")
          .single();

        if (newDayErr || !newDay) throw new Error(newDayErr?.message);
        const newDayId = (newDay as any).id as string;

        // Busca exercícios do dia original
        const { data: originalExs = [] } = await supabase
          .from("pt_training_exercises" as never)
          .select("*")
          .eq("training_day_id" as never, day.id)
          .order("sort_order" as never, { ascending: true });

        if (originalExs.length > 0) {
          const exRows = (originalExs as any[]).map((ex) => ({
            user_id: userId,
            training_day_id: newDayId,
            exercise_library_id: ex.exercise_library_id ?? null,
            name: ex.name,
            media_url: ex.media_url ?? null,
            media_type: ex.media_type ?? null,
            thumbnail_url: ex.thumbnail_url ?? null,
            sets_reps: ex.sets_reps ?? null,
            load: ex.load ?? null,
            rest_seconds: ex.rest_seconds ?? null,
            observations: ex.observations ?? null,
            sort_order: ex.sort_order ?? 0,
            is_superset: ex.is_superset ?? false,
            superset_group: ex.superset_group ?? null,
            series_type: ex.series_type ?? "reps_load",
            time_seconds: ex.time_seconds ?? null,
            inclination: ex.inclination ?? null,
            pace: ex.pace ?? null,
            cadence: ex.cadence ?? null,
            substitute_exercise_id: ex.substitute_exercise_id ?? null,
          }));

          const { error: insExErr } = await supabase
            .from("pt_training_exercises" as never)
            .insert(exRows as never);

          if (insExErr) {
            console.warn("[DuplicateProgram] Aviso ao clonar exercícios:", insExErr.message);
          } else {
            totalExercisesCopied += exRows.length;
          }
        }
      }

      return {
        newProgramId,
        daysCount: originalDays.length,
        exercisesCount: totalExercisesCopied,
      };
    },
    onSuccess: ({ newProgramId, daysCount, exercisesCount }) => {
      qc.invalidateQueries({ queryKey: ["pt-programs"] });
      toast.success(
        `Treino duplicado com sucesso! (${daysCount} sessões e ${exercisesCount} exercícios clonados)`,
        {
          duration: 6000,
        }
      );
      onOpenChange(false);
      if (onSuccess) onSuccess(newProgramId);
    },
    onError: (err: any) => {
      toast.error(`Erro ao duplicar treino: ${err?.message || "falha inesperada"}`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border-border shadow-2xl">
        <DialogHeader className="p-5 pb-4 bg-muted/20 border-b border-border/70 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Copy className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Duplicar Programa de Treino
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Clona todas as sessões, séries, repetições, cargas e vídeos deste treino
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-4">
          {/* Card Resumo do Treino Original */}
          {program && (
            <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Treino Original
                </span>
                <p className="font-extrabold text-foreground truncate">{program.name}</p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3 text-primary" />
                    {totalDays} {totalDays === 1 ? "sessão" : "sessões"}
                  </span>
                  {originalStudentName && (
                    <span>• Vinculado a: <strong className="text-foreground">{originalStudentName}</strong></span>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold shrink-0">
                {program.category || "Musculação"}
              </Badge>
            </div>
          )}

          {/* Nome do Novo Treino */}
          <div className="space-y-1.5">
            <Label htmlFor="new-name" className="text-xs font-bold text-foreground">
              Nome do Novo Treino
            </Label>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Treino Hipertrofia - Fase 2"
              className="text-xs h-9"
              autoFocus
            />
          </div>

          {/* Data de Início */}
          <div className="space-y-1.5">
            <Label htmlFor="start-date" className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Data de Início do Novo Treino
            </Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          {/* Destino da Cópia */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">Destino da Duplicação</Label>
            <div className="grid grid-cols-1 gap-2">
              {/* Opção 1: Modelo Acervo Geral */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  destinationType === "template"
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border bg-card/40 hover:bg-muted/40"
                }`}
              >
                <input
                  type="radio"
                  name="destType"
                  checked={destinationType === "template"}
                  onChange={() => setDestinationType("template")}
                  className="mt-0.5 text-primary focus:ring-primary"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FolderOpen className="h-3.5 w-3.5 text-primary" />
                    Salvar como Modelo no Acervo Geral
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Fica disponível como template na biblioteca para atribuir a qualquer aluno futuramente.
                  </p>
                </div>
              </label>

              {/* Opção 2: Mesmo Aluno (se o original tiver aluno) */}
              {originalStudentName && (
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    destinationType === "same_student"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border bg-card/40 hover:bg-muted/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="destType"
                    checked={destinationType === "same_student"}
                    onChange={() => setDestinationType("same_student")}
                    className="mt-0.5 text-primary focus:ring-primary"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                      Manter vinculado a {originalStudentName}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Ideal para criar uma Fase 2, mesociclo de progressão ou treino alternativo para este aluno.
                    </p>
                  </div>
                </label>
              )}

              {/* Opção 3: Outro Aluno */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  destinationType === "another_student"
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border bg-card/40 hover:bg-muted/40"
                }`}
              >
                <input
                  type="radio"
                  name="destType"
                  checked={destinationType === "another_student"}
                  onChange={() => setDestinationType("another_student")}
                  className="mt-0.5 text-primary focus:ring-primary"
                />
                <div className="space-y-0.5 flex-1">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-indigo-500" />
                    Atribuir cópia a outro aluno cadastrado
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Aproveite a montagem completa deste treino para outro aluno do Studio ou Personal.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Seletor de Aluno quando 'another_student' estiver ativo */}
          {destinationType === "another_student" && (
            <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-3">
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant={tipoAluno === "studio" ? "default" : "outline"}
                  className="h-7 text-xs flex-1 font-bold"
                  onClick={() => {
                    setTipoAluno("studio");
                    setSelectedStudentId("");
                  }}
                >
                  Alunos Studio ({studioStudents.length})
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={tipoAluno === "pt" ? "default" : "outline"}
                  className="h-7 text-xs flex-1 font-bold"
                  onClick={() => {
                    setTipoAluno("pt");
                    setSelectedStudentId("");
                  }}
                >
                  Personal Trainer ({ptStudents.length})
                </Button>
              </div>

              <div className="space-y-1">
                <Label htmlFor="select-student" className="text-xs font-semibold text-foreground">
                  Selecione o Aluno
                </Label>
                <select
                  id="select-student"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  <option value="">Selecione um aluno ativo...</option>
                  {activeStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} {st.email ? `(${st.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 bg-muted/20 border-t border-border flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={duplicateMutation.isPending}
            className="text-xs"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => duplicateMutation.mutate()}
            disabled={duplicateMutation.isPending || !newName.trim()}
            className="text-xs font-bold gap-1.5 shadow-sm"
          >
            {duplicateMutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Duplicando Treino...
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Duplicar Treino Agora
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
