import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Calendar, Loader2, CheckCircle2, Users, Dumbbell } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface AtribuirTreinoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programId: string | null;
  programName?: string;
}

export function AtribuirTreinoDialog({
  open,
  onOpenChange,
  programId,
  programName,
}: AtribuirTreinoDialogProps) {
  const qc = useQueryClient();
  const [tipoAluno, setTipoAluno] = useState<"studio" | "pt">("studio");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Consulta apenas alunos ATIVOS do Studio
  const { data: studioStudents = [], isLoading: loadingStudio } = useQuery({
    queryKey: ["active-studio-students-for-assign"],
    enabled: open,
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

  // Consulta apenas alunos ATIVOS de Personal Trainer
  const { data: ptStudents = [], isLoading: loadingPt } = useQuery({
    queryKey: ["active-pt-students-for-assign"],
    enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pt_students" as never)
        .select("id, name, email, status, deleted_at" as never)
        .eq("status" as never, "active")
        .neq("id" as never, "00000000-0000-0000-0000-000000000001")
        .is("deleted_at" as never, null)
        .order("name" as never);
      if (error) throw error;
      return (data || []) as Array<{ id: string; name: string; email: string | null }>;
    },
  });

  const activeStudents = tipoAluno === "studio" ? studioStudents : ptStudents;

  const atribuirMutation = useMutation({
    mutationFn: async () => {
      if (!programId) throw new Error("Rotina de treino não selecionada.");
      if (!selectedStudentId) throw new Error("Selecione um aluno ativo para atribuir o treino.");

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Usuário não autenticado.");

      // 1. Garante que se for aluno do Studio, ele existe em pt_students
      if (tipoAluno === "studio") {
        const targetStudent = studioStudents.find((s) => s.id === selectedStudentId);
        if (targetStudent) {
          await supabase.from("pt_students" as never).upsert(
            {
              id: targetStudent.id,
              user_id: userId,
              name: targetStudent.name,
              email: targetStudent.email,
              status: "active",
              notes: "[Aluno Studio]",
            } as never,
            { onConflict: "id" } as never
          );
        }
      }

      // 2. Busca a rotina original
      const { data: originalProg, error: progErr } = await supabase
        .from("pt_programs" as never)
        .select("*")
        .eq("id" as never, programId)
        .single();
      if (progErr || !originalProg) throw new Error("Rotina original não encontrada.");

      // 3. Busca os dias originais
      const { data: originalDays = [], error: daysErr } = await supabase
        .from("pt_training_days" as never)
        .select("*")
        .eq("program_id" as never, programId)
        .order("sort_order" as never, { ascending: true });
      if (daysErr) throw new Error(daysErr.message);

      // 4. Cria a nova rotina para o aluno ativo
      const studentName = activeStudents.find((s) => s.id === selectedStudentId)?.name || "Aluno";
      const cleanProgName = (originalProg as any).name?.replace(/^Modelo:\s*/i, "") || "Treino";

      const { data: newProg, error: newProgErr } = await supabase
        .from("pt_programs" as never)
        .insert({
          user_id: userId,
          pt_student_id: selectedStudentId,
          name: cleanProgName,
          category: (originalProg as any).category ?? "hypertrophy",
          level: (originalProg as any).level ?? "intermediate",
          training_type: (originalProg as any).training_type ?? "musculacao",
          start_date: startDate || new Date().toISOString().slice(0, 10),
          goals: (originalProg as any).goals ?? null,
          show_to_student: true,
          auto_archive: true,
          ai_prompt: (originalProg as any).ai_prompt ?? null,
          ai_generated_at: (originalProg as any).ai_generated_at ?? null,
        } as never)
        .select("id")
        .single();

      if (newProgErr || !newProg) throw new Error(`Falha ao criar rotina do aluno: ${newProgErr?.message}`);
      const newProgramId = (newProg as any).id as string;

      // 5. Duplica cada dia e seus exercícios correspondentes
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
            series_type: ex.series_type ?? "reps_load",
            sort_order: ex.sort_order ?? 0,
          }));

          const { error: insExErr } = await supabase
            .from("pt_training_exercises" as never)
            .insert(exRows as never);
          if (insExErr) throw new Error(insExErr.message);
        }
      }

      return { studentName, cleanProgName };
    },
    onSuccess: ({ studentName, cleanProgName }) => {
      toast.success(`Rotina "${cleanProgName}" atribuída a ${studentName}!`, {
        description: "Os treinos e vídeos foram vinculados à ficha do aluno.",
      });
      qc.invalidateQueries({ queryKey: ["pt-programs"] });
      onOpenChange(false);
      setSelectedStudentId(null);
    },
    onError: (err: any) => {
      toast.error("Falha ao atribuir treino", {
        description: err?.message || "Ocorreu um erro ao vincular a rotina.",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="p-1.5 rounded-lg bg-primary/10">
              <UserPlus className="h-5 w-5" />
            </span>
            <DialogTitle>Atribuir Treino a Aluno Ativo</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Apenas alunos com status <span className="font-semibold text-emerald-600 dark:text-emerald-400">ATIVO</span> podem receber novas rotinas de treino.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Card com a rotina selecionada */}
          <div className="rounded-lg border border-border/80 bg-muted/30 p-3 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Rotina a ser vinculada:
            </span>
            <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Dumbbell className="h-4 w-4 text-primary" />
              {programName || "Treino"}
            </p>
          </div>

          {/* Abas de Tipo de Aluno */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tipo de Aluno
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                size="sm"
                variant={tipoAluno === "studio" ? "default" : "outline"}
                className="text-xs h-9 justify-center"
                onClick={() => {
                  setTipoAluno("studio");
                  setSelectedStudentId(null);
                }}
              >
                Studio ({loadingStudio ? "..." : studioStudents.length})
              </Button>
              <Button
                type="button"
                size="sm"
                variant={tipoAluno === "pt" ? "default" : "outline"}
                className="text-xs h-9 justify-center"
                onClick={() => {
                  setTipoAluno("pt");
                  setSelectedStudentId(null);
                }}
              >
                Personal ({loadingPt ? "..." : ptStudents.length})
              </Button>
            </div>
          </div>

          {/* Seletor do Aluno Ativo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Selecione o Aluno Ativo
            </label>
            {activeStudents.length === 0 ? (
              <div className="rounded-md border border-dashed border-border/80 p-3 text-center text-xs text-muted-foreground">
                Nenhum aluno ativo encontrado nesta categoria.
              </div>
            ) : (
              <Select
                value={selectedStudentId || ""}
                onValueChange={(val) => setSelectedStudentId(val)}
              >
                <SelectTrigger className="h-9 w-full bg-background text-xs">
                  <SelectValue placeholder="Escolha um aluno ativo..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {activeStudents.map((st) => (
                    <SelectItem key={st.id} value={st.id} className="text-xs">
                      <div className="flex items-center justify-between w-full gap-2">
                        <span>{st.name}</span>
                        <Badge variant="secondary" className="text-[9px] bg-emerald-500/10 text-emerald-600 border-0">
                          Ativo
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Data de Início */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Data de Início da Rotina
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={atribuirMutation.isPending}
            className="text-xs"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => atribuirMutation.mutate()}
            disabled={!selectedStudentId || atribuirMutation.isPending}
            className="text-xs gap-1.5 font-semibold"
          >
            {atribuirMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {atribuirMutation.isPending ? "Atribuindo..." : "Confirmar Atribuição"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
