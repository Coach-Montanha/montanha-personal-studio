import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UserPlus,
  Calendar,
  Loader2,
  CheckCircle2,
  Users,
  Dumbbell,
  AlertTriangle,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Archive,
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";

interface AtribuirTreinoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programId: string | null;
  programName?: string;
}

function formatDateBR(dateStr?: string | null) {
  if (!dateStr) return "";
  const parts = dateStr.split("T")[0].split("-");
  if (parts.length < 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function AtribuirTreinoDialog({
  open,
  onOpenChange,
  programId,
  programName,
}: AtribuirTreinoDialogProps) {
  const qc = useQueryClient();
  const [tipoAluno, setTipoAluno] = useState<"studio" | "pt">("studio");
  const [filtroStatusTreino, setFiltroStatusTreino] = useState<"todos" | "sem_treino" | "com_treino">("todos");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [substituirOpcao, setSubstituirOpcao] = useState<"arquivar" | "manter">("arquivar");
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [buscaMapa, setBuscaMapa] = useState("");

  // Consulta alunos ATIVOS do Studio
  const { data: studioStudents = [], isLoading: loadingStudio } = useQuery({
    queryKey: ["active-studio-students-for-assign"],
    enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students" as never)
        .select("id, name, email, phone, status, deleted_at" as never)
        .eq("status" as never, "active")
        .is("deleted_at" as never, null)
        .order("name" as never);
      if (error) throw error;
      return (data || []) as Array<{ id: string; name: string; email: string | null; phone?: string | null }>;
    },
  });

  // Consulta alunos ATIVOS de Personal Trainer
  const { data: ptStudents = [], isLoading: loadingPt } = useQuery({
    queryKey: ["active-pt-students-for-assign"],
    enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pt_students" as never)
        .select("id, name, email, phone, status, notes, deleted_at" as never)
        .eq("status" as never, "active")
        .neq("id" as never, "00000000-0000-0000-0000-000000000001")
        .is("deleted_at" as never, null)
        .order("name" as never);
      if (error) throw error;
      const raw = (data || []) as Array<{ id: string; name: string; email: string | null; phone?: string | null; notes?: string | null }>;
      return raw.filter(
        (s) => !s.notes || (!s.notes.includes("[Studio]") && !s.notes.includes("[Aluno Studio]"))
      );
    },
  });

  // Consulta TODOS os programas ativos para mapear quem já tem treino
  const { data: allActivePrograms = [] } = useQuery({
    queryKey: ["active-programs-for-all-students"],
    enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pt_programs" as never)
        .select(`
          id,
          name,
          pt_student_id,
          start_date,
          end_date,
          training_type,
          category,
          is_archived,
          is_deleted,
          pt_training_days (id)
        ` as never)
        .eq("is_archived" as never, false)
        .eq("is_deleted" as never, false)
        .not("pt_student_id" as never, "is", null)
        .neq("pt_student_id" as never, "00000000-0000-0000-0000-000000000001")
        .order("created_at" as never, { ascending: false });

      if (error) throw error;
      return (data || []) as Array<{
        id: string;
        name: string;
        pt_student_id: string;
        start_date: string | null;
        end_date: string | null;
        training_type: string | null;
        category: string | null;
        pt_training_days: Array<{ id: string }>;
      }>;
    },
  });

  // Mapeia programas ativos por ID do aluno
  const studentProgramsMap = useMemo(() => {
    const map = new Map<
      string,
      Array<{
        id: string;
        name: string;
        start_date: string | null;
        end_date: string | null;
        days_count: number;
      }>
    >();

    for (const prog of allActivePrograms) {
      if (!prog.pt_student_id) continue;
      const list = map.get(prog.pt_student_id) || [];
      list.push({
        id: prog.id,
        name: prog.name,
        start_date: prog.start_date,
        end_date: prog.end_date,
        days_count: prog.pt_training_days?.length || 0,
      });
      map.set(prog.pt_student_id, list);
    }
    return map;
  }, [allActivePrograms]);

  // Lista da categoria selecionada enriquecida com os treinos vinculados
  const currentCategoryStudents = tipoAluno === "studio" ? studioStudents : ptStudents;

  const enrichedStudents = useMemo(() => {
    return currentCategoryStudents.map((st) => {
      const programs = studentProgramsMap.get(st.id) || [];
      return {
        ...st,
        programs,
        hasProgram: programs.length > 0,
      };
    });
  }, [currentCategoryStudents, studentProgramsMap]);

  // Contadores de alunos com e sem treino
  const totalSemTreino = useMemo(() => enrichedStudents.filter((s) => !s.hasProgram).length, [enrichedStudents]);
  const totalComTreino = useMemo(() => enrichedStudents.filter((s) => s.hasProgram).length, [enrichedStudents]);

  // Alunos filtrados para o dropdown
  const filteredStudents = useMemo(() => {
    if (filtroStatusTreino === "sem_treino") {
      return enrichedStudents.filter((s) => !s.hasProgram);
    }
    if (filtroStatusTreino === "com_treino") {
      return enrichedStudents.filter((s) => s.hasProgram);
    }
    return enrichedStudents;
  }, [enrichedStudents, filtroStatusTreino]);

  // Dados do aluno atualmente selecionado
  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return enrichedStudents.find((s) => s.id === selectedStudentId) || null;
  }, [selectedStudentId, enrichedStudents]);

  // Lista unificada para o Mapa Geral de Alunos & Treinos
  const mapaUnificado = useMemo(() => {
    const todos: Array<{
      id: string;
      name: string;
      tipo: "Studio" | "Personal";
      programs: Array<{ id: string; name: string; start_date: string | null; days_count: number }>;
      hasProgram: boolean;
    }> = [];

    studioStudents.forEach((st) => {
      const progs = studentProgramsMap.get(st.id) || [];
      todos.push({ id: st.id, name: st.name, tipo: "Studio", programs: progs, hasProgram: progs.length > 0 });
    });

    ptStudents.forEach((st) => {
      const progs = studentProgramsMap.get(st.id) || [];
      todos.push({ id: st.id, name: st.name, tipo: "Personal", programs: progs, hasProgram: progs.length > 0 });
    });

    if (!buscaMapa.trim()) return todos;
    const q = buscaMapa.toLowerCase();
    return todos.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.programs.some((p) => p.name.toLowerCase().includes(q))
    );
  }, [studioStudents, ptStudents, studentProgramsMap, buscaMapa]);

  const atribuirMutation = useMutation({
    mutationFn: async () => {
      if (!programId) throw new Error("Rotina de treino não selecionada.");
      if (!selectedStudentId) throw new Error("Selecione um aluno ativo para atribuir o treino.");

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Usuário não autenticado.");

      // 1. Garante que se for aluno do Studio, ele existe em pt_students com account_user_id sincronizado
      if (tipoAluno === "studio") {
        const targetStudent = studioStudents.find((s) => s.id === selectedStudentId);
        if (targetStudent) {
          await supabase.from("pt_students" as never).upsert(
            {
              id: targetStudent.id,
              user_id: userId,
              name: targetStudent.name,
              email: targetStudent.email,
              phone: (targetStudent as any).phone ?? null,
              account_user_id: (targetStudent as any).account_user_id ?? null,
              temp_password: (targetStudent as any).temp_password ?? null,
              status: "active",
              notes: "[Aluno Studio]",
            } as never,
            { onConflict: "id" } as never
          );
        }
      }

      // 2. Proteção contra sobrescrita acidental: Arquivar programas anteriores se solicitado
      if (selectedStudent?.hasProgram && substituirOpcao === "arquivar") {
        for (const oldProg of selectedStudent.programs) {
          await supabase
            .from("pt_programs" as never)
            .update({ is_archived: true } as never)
            .eq("id" as never, oldProg.id);
        }
      }

      // 3. Busca a rotina original
      const { data: originalProg, error: progErr } = await supabase
        .from("pt_programs" as never)
        .select("*")
        .eq("id" as never, programId)
        .single();
      if (progErr || !originalProg) throw new Error("Rotina original não encontrada.");

      // 4. Busca os dias originais
      const { data: originalDays = [], error: daysErr } = await supabase
        .from("pt_training_days" as never)
        .select("*")
        .eq("program_id" as never, programId)
        .order("sort_order" as never, { ascending: true });
      if (daysErr) throw new Error(daysErr.message);

      // 5. Cria a nova rotina para o aluno ativo
      const studentName = selectedStudent?.name || "Aluno";
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

      // 6. Duplica cada dia e seus exercícios correspondentes
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
        description: "Os treinos e vídeos foram vinculados com segurança à ficha do aluno.",
      });
      qc.invalidateQueries({ queryKey: ["pt-programs"] });
      qc.invalidateQueries({ queryKey: ["active-programs-for-all-students"] });
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
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
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

        <div className="space-y-4 py-1">
          {/* Card da rotina a ser vinculada */}
          <div className="rounded-lg border border-border/80 bg-muted/30 p-3 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Rotina a ser vinculada:
            </span>
            <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Dumbbell className="h-4 w-4 text-primary" />
              {programName || "Treino"}
            </p>
          </div>

          {/* Abas Tipo de Aluno */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tipo de Aluno
              </label>
              <button
                type="button"
                onClick={() => setMostrarMapa(!mostrarMapa)}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
              >
                {mostrarMapa ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {mostrarMapa ? "Ocultar mapa de treinos" : "Ver todos os alunos vinculados"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                size="sm"
                variant={tipoAluno === "studio" ? "default" : "outline"}
                className="text-xs h-9 justify-center font-semibold"
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
                className="text-xs h-9 justify-center font-semibold"
                onClick={() => {
                  setTipoAluno("pt");
                  setSelectedStudentId(null);
                }}
              >
                Personal ({loadingPt ? "..." : ptStudents.length})
              </Button>
            </div>
          </div>

          {/* Painel Expansível: Mapa de Todos os Alunos Vinculados */}
          {mostrarMapa && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2.5 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  Mapa de Alunos & Treinos Vinculados ({mapaUnificado.length})
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {mapaUnificado.filter((a) => a.hasProgram).length} com treino • {mapaUnificado.filter((a) => !a.hasProgram).length} livres
                </span>
              </div>

              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  value={buscaMapa}
                  onChange={(e) => setBuscaMapa(e.target.value)}
                  placeholder="Pesquisar aluno ou treino no mapa..."
                  className="h-8 pl-8 text-xs bg-background"
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 divide-y divide-border/40">
                {mapaUnificado.map((aluno) => (
                  <div key={`${aluno.tipo}-${aluno.id}`} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground truncate">{aluno.name}</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 shrink-0 text-muted-foreground">
                          {aluno.tipo}
                        </Badge>
                      </div>
                      <div className="text-[11px] truncate">
                        {aluno.hasProgram ? (
                          <span className="text-amber-800 dark:text-amber-300 font-medium">
                            📌 {aluno.programs.map((p) => p.name).join(", ")}
                          </span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                            ✨ Sem treino ativo (livre)
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px] px-2 text-primary hover:bg-primary/10 shrink-0 font-semibold"
                      onClick={() => {
                        setTipoAluno(aluno.tipo === "Studio" ? "studio" : "pt");
                        setSelectedStudentId(aluno.id);
                        setMostrarMapa(false);
                      }}
                    >
                      Selecionar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filtro Rápido de Status de Treino */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Filtrar por Status de Treino
              </label>
              <span className="text-[10px] text-muted-foreground">
                {totalComTreino} com treino / {totalSemTreino} sem treino
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                size="sm"
                variant={filtroStatusTreino === "todos" ? "secondary" : "ghost"}
                className="h-7 text-xs px-2.5"
                onClick={() => setFiltroStatusTreino("todos")}
              >
                Todos ({enrichedStudents.length})
              </Button>
              <Button
                type="button"
                size="sm"
                variant={filtroStatusTreino === "sem_treino" ? "secondary" : "ghost"}
                className="h-7 text-xs px-2.5 text-emerald-800 dark:text-emerald-400 font-medium"
                onClick={() => setFiltroStatusTreino("sem_treino")}
              >
                ✨ Sem Treino ({totalSemTreino})
              </Button>
              <Button
                type="button"
                size="sm"
                variant={filtroStatusTreino === "com_treino" ? "secondary" : "ghost"}
                className="h-7 text-xs px-2.5 text-amber-800 dark:text-amber-400 font-medium"
                onClick={() => setFiltroStatusTreino("com_treino")}
              >
                ⚠️ Já com Treino ({totalComTreino})
              </Button>
            </div>
          </div>

          {/* Seletor do Aluno Ativo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Selecione o Aluno Ativo
            </label>
            {filteredStudents.length === 0 ? (
              <div className="rounded-md border border-dashed border-border/80 p-3 text-center text-xs text-muted-foreground">
                Nenhum aluno encontrado neste filtro.
              </div>
            ) : (
              <Select
                value={selectedStudentId || ""}
                onValueChange={(val) => setSelectedStudentId(val)}
              >
                <SelectTrigger className="h-10 w-full bg-background text-xs">
                  <SelectValue placeholder="Escolha um aluno ativo..." />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {filteredStudents.map((st) => (
                    <SelectItem key={st.id} value={st.id} className="text-xs py-2">
                      <div className="flex flex-col gap-0.5 text-left w-full pr-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-foreground">{st.name}</span>
                          {st.hasProgram ? (
                            <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/30 shrink-0">
                              ⚠️ Com Treino
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 shrink-0">
                              ✨ Livre
                            </Badge>
                          )}
                        </div>
                        {st.hasProgram && (
                          <span className="text-[10px] text-muted-foreground truncate">
                            Rotina: {st.programs.map((p) => p.name).join(", ")}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Alerta de Proteção Contra Sobrescrita */}
          {selectedStudent && selectedStudent.hasProgram && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 space-y-2.5 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Atenção: {selectedStudent.name} já possui treino vinculado!</span>
              </div>

              <div className="rounded-md border border-amber-500/20 bg-background/80 p-2.5 space-y-1.5 text-xs">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Rotina(s) Atual(is) do Aluno:
                </div>
                {selectedStudent.programs.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 border-b border-border/40 pb-1 last:border-0 last:pb-0">
                    <span className="font-semibold text-foreground truncate">📌 {p.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {p.days_count} sessões • Início: {p.start_date ? formatDateBR(p.start_date) : "Sem data"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-0.5">
                <span className="text-[11px] font-semibold text-foreground block">
                  Escolha como proceder para não sobrescrever:
                </span>
                <RadioGroup
                  value={substituirOpcao}
                  onValueChange={(v) => setSubstituirOpcao(v as "arquivar" | "manter")}
                  className="space-y-1.5"
                >
                  <label className="flex items-start gap-2 cursor-pointer text-xs">
                    <RadioGroupItem value="arquivar" id="opt-arquivar" className="mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground">
                        Arquivar programa anterior e ativar novo
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        Recomendado: o treino antigo é guardado no histórico sem sobrepor e o aluno vê a nova rotina.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer text-xs">
                    <RadioGroupItem value="manter" id="opt-manter" className="mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground">
                        Manter ambos os programas ativos
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        Adiciona esta rotina paralelamente à existente (útil para alunos com 2 fichas simultâneas).
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            </div>
          )}

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

