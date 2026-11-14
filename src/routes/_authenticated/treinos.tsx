import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dumbbell,
  Sparkles,
  Plus,
  Search,
  Calendar,
  Layers,
  FileSpreadsheet,
  Download,
  Eye,
  Trash2,
  Users,
  CheckCircle2,
  CalendarDays,
  Target,
  FileText,
  Filter,
  Image as ImageIcon,
  UserPlus,
  Pencil,
  Link2,
  Archive,
  ArchiveRestore,
  Unlink,
  PenTool,
  ExternalLink,
  User,
  MoreVertical,
  Clock,
  AlertTriangle,
  MessageCircle,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrescreverIaDialog } from "@/components/programa-ia/PrescreverIaDialog";
import { AtribuirTreinoDialog } from "@/components/pt/AtribuirTreinoDialog";
import { ProgramEditorDialog } from "@/components/pt/ProgramEditorDialog";
import { SessionBuilder } from "@/components/session-builder/SessionBuilder";
import { downloadProgramPdf } from "@/lib/pt-program-pdf";
import { formatDateBR } from "@/lib/format";
import { confirmDialog } from "@/lib/confirm-dialog";
import { StudentViewDialog } from "@/components/pt/StudentViewDialog";
import { LoadProgressionDialog } from "@/components/pt/LoadProgressionDialog";
import { TrainingDayDetail } from "@/components/pt/TrainingDayDetail";
import { ProgramImageDialog } from "@/components/program-image/ProgramImageDialog";
import { DuplicateProgramDialog } from "@/components/pt/DuplicateProgramDialog";
import { matchesSearchTerms } from "@/lib/search-utils";

function limparTextoGoals(goals?: string | null): string | null {
  if (!goals) return null;
  const limpo = goals
    .replace(/Importado do Sistema Híbrido\s*[-·:]*\s*[a-zA-Z_À-ÿ]*/gi, "")
    .replace(/^[\s·\-_:]+|[\s·\-_:]+$/g, "")
    .trim();
  return limpo.length > 0 ? limpo : null;
}

function getDiasParaVencer(endDateStr?: string | null): number | null {
  if (!endDateStr) return null;
  const match = endDateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);

  const targetDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = targetDate.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export const Route = createFileRoute("/_authenticated/treinos")({
  component: TreinosPage,
});

type ProgramRow = {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  goals: string | null;
  category: string;
  level: string;
  training_type: string;
  show_to_student: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  sort_order: number;
  ai_prompt: string | null;
  ai_generated_at: string | null;
  studio_student_id?: string | null;
  pt_student_id: string | null;
  created_at: string;
  // Joins
  students?: { id: string; name: string; email: string | null; phone?: string | null } | null;
  pt_students?: { id: string; name: string; email: string | null; phone?: string | null; notes?: string | null } | null;
  pt_training_days?: Array<{ id: string; name: string; day_label?: string | null; sort_order?: number }> | null;
};

const CATEGORIA_LABELS: Record<string, string> = {
  hypertrophy: "Hipertrofia",
  conditioning: "Condicionamento",
  strength: "Força",
  cardio: "Cardio",
  general: "Geral",
  musculacao: "Musculação",
  hibrido: "Híbrido",
  kettlebell_sport: "Kettlebell Sport",
  levantamento_peso: "LPO",
  treinamento_funcional: "Funcional",
  corrida: "Corrida",
};

export function TreinosPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"programas" | "calendario" | "nova-sessao" | "ia">("programas");
  const [busca, setBusca] = useState("");
  const [tipoAlunoFiltro, setTipoAlunoFiltro] = useState<"todos" | "studio" | "pt" | "modelo" | "vencendo">("todos");
  const [statusFiltro, setStatusFiltro] = useState<"ativos" | "arquivados">("ativos");
  const [modalidadeFiltro, setModalidadeFiltro] = useState<string>("todas");

  // Modais
  const [alertasVencimentoOpen, setAlertasVencimentoOpen] = useState(false);
  const [prescreverIaOpen, setPrescreverIaOpen] = useState(false);
  const [selectedProgramForIa, setSelectedProgramForIa] = useState<any | null>(null);
  const [studentViewOpen, setStudentViewOpen] = useState(false);
  const [studentViewProgramId, setStudentViewProgramId] = useState<string | null>(null);
  const [progressionOpen, setProgressionOpen] = useState(false);
  const [progressionProgramId, setProgressionProgramId] = useState<string | null>(null);
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [imageExportOpen, setImageExportOpen] = useState(false);
  const [imageExportProgramId, setImageExportProgramId] = useState<string | null>(null);
  const [atribuirOpen, setAtribuirOpen] = useState(false);
  const [atribuirProgram, setAtribuirProgram] = useState<{ id: string; name: string } | null>(null);
  const [programEditorOpen, setProgramEditorOpen] = useState(false);
  const [selectedProgramIdForEdit, setSelectedProgramIdForEdit] = useState<string | null>(null);
  const [initialDayIdForEdit, setInitialDayIdForEdit] = useState<string | null>(null);
  const [alunoPerfilOpen, setAlunoPerfilOpen] = useState(false);
  const [selectedAlunoPerfil, setSelectedAlunoPerfil] = useState<any | null>(null);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [selectedProgramForDuplicate, setSelectedProgramForDuplicate] = useState<ProgramRow | null>(null);

  // Consulta de todos os programas com joins de alunos Studio e PT
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ["pt-programs", "all-unified", statusFiltro],
    queryFn: async () => {
      let q = supabase
        .from("pt_programs" as never)
        .select(`
          *,
          pt_students:pt_student_id (id, name, email, phone, notes),
          pt_training_days (id, name, day_label, sort_order)
        ` as never);

      if (statusFiltro === "ativos") {
        q = q.eq("is_archived" as never, false).eq("is_deleted" as never, false);
      } else {
        q = q.eq("is_archived" as never, true).eq("is_deleted" as never, false);
      }

      const { data, error } = await q.order("created_at" as never, { ascending: false });
      if (error) {
        console.error("[treinos.tsx] Erro ao carregar programas:", error);
        throw error;
      }
      return (data || []) as unknown as ProgramRow[];
    },
  });

  // Buscar lista de alunos do Studio para cruzamento de dados e identificacao precisa
  const { data: studioStudentsList = [] } = useQuery({
    queryKey: ["studio-students-list-cached"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const { data } = await supabase.from("students" as never).select("id, name, email, phone");
      return (data || []) as Array<{ id: string; name: string; email: string | null; phone?: string | null }>;
    },
  });

  // Estados especificos para a aba de Calendario
  const [calSearch, setCalSearch] = useState("");
  const [calFilterOrigin, setCalFilterOrigin] = useState<"todos" | "pt" | "studio">("todos");
  const [calFilterStatus, setCalFilterStatus] = useState<"todos" | "em_andamento" | "sem_fim" | "futuro" | "concluido">("todos");

  // Dias do programa expandido
  const { data: expandedDays = [] } = useQuery({
    queryKey: ["pt-training-days", expandedProgramId],
    enabled: !!expandedProgramId,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_training_days" as never)
        .select("*")
        .eq("program_id" as never, expandedProgramId)
        .order("sort_order" as never, { ascending: true });
      return (data || []) as any[];
    },
  });

  // Mapa rapido de alunos Studio para deteccao precisa
  const studioNamesSet = useMemo(() => {
    return new Set(studioStudentsList.map((s) => s.name.trim().toLowerCase()));
  }, [studioStudentsList]);

  const studioIdsSet = useMemo(() => {
    return new Set(studioStudentsList.map((s) => s.id));
  }, [studioStudentsList]);

  // Filtros em memória
  const programasFiltrados = useMemo(() => {
    return programs.filter((p) => {
      // Filtro de busca inteligente por nome da rotina, nome do aluno ou modalidade
      const alunoNome = p.students?.name || p.pt_students?.name || "";
      const matchesSearch = matchesSearchTerms(
        [p.name, alunoNome, p.training_type, p.category],
        busca
      );
      if (!matchesSearch) return false;

      const isTemplate =
        p.pt_student_id === "00000000-0000-0000-0000-000000000001" ||
        (!p.pt_student_id);
      const isStudio =
        !isTemplate && ( (p.pt_students as any)?.notes?.includes("[Studio]") || (p.pt_students as any)?.notes?.includes("[Aluno Studio]"));
      const isPt = !isTemplate && !isStudio;

      // Filtro por tipo de aluno
      if (tipoAlunoFiltro === "studio" && !isStudio) return false;
      if (tipoAlunoFiltro === "pt" && !isPt) return false;
      if (tipoAlunoFiltro === "modelo" && !isTemplate) return false;
      if (tipoAlunoFiltro === "vencendo") {
        if (isTemplate) return false;
        const diff = getDiasParaVencer(p.end_date);
        if (diff === null || diff >= 8) return false;
      }

      // Filtro por modalidade
      if (modalidadeFiltro !== "todas") {
        if (p.training_type !== modalidadeFiltro && p.category !== modalidadeFiltro) return false;
      }

      return true;
    });
  }, [programs, busca, tipoAlunoFiltro, modalidadeFiltro]);

  // Contadores
  const totalStudio = programs.filter(
    (p) =>
      p.pt_student_id !== "00000000-0000-0000-0000-000000000001" &&
      ( (p.pt_students as any)?.notes?.includes("[Studio]") || (p.pt_students as any)?.notes?.includes("[Aluno Studio]"))
  ).length;
  const totalPt = programs.filter(
    (p) =>
      p.pt_student_id !== "00000000-0000-0000-0000-000000000001" &&
      
      !(p.pt_students as any)?.notes?.includes("[Studio]") &&
      !(p.pt_students as any)?.notes?.includes("[Aluno Studio]")
  ).length;
  const totalModelos = programs.filter(
    (p) =>
      p.pt_student_id === "00000000-0000-0000-0000-000000000001" ||
      (!p.pt_student_id)
  ).length;

  // Treinos que vencem em menos de 8 dias (ou já expiraram) para alerta rápido
  const programasVencendo = useMemo(() => {
    return programs
      .filter((p) => {
        const isTemplate =
          p.pt_student_id === "00000000-0000-0000-0000-000000000001" || !p.pt_student_id;
        if (isTemplate || p.is_archived || p.is_deleted) return false;
        const diff = getDiasParaVencer(p.end_date);
        return diff !== null && diff < 8;
      })
      .map((p) => {
        const isTemplate =
          p.pt_student_id === "00000000-0000-0000-0000-000000000001" || !p.pt_student_id;
        const studentName = p.pt_students?.name?.trim() || p.students?.name?.trim() || "";
        const studentNotes = p.pt_students?.notes || "";
        const hasStudioTag =
          studentNotes.includes("[Studio]") || studentNotes.includes("[Aluno Studio]");
        const isInStudioTable =
          (p.pt_student_id ? studioIdsSet.has(p.pt_student_id) : false) ||
          studioNamesSet.has(studentName.toLowerCase());
        const isStudio = hasStudioTag || isInStudioTable;
        const aluno = isTemplate ? null : (p.students || p.pt_students);
        const diff = getDiasParaVencer(p.end_date) ?? 0;

        return {
          program: p,
          aluno,
          isStudio,
          diff,
        };
      })
      .sort((a, b) => a.diff - b.diff);
  }, [programs, studioIdsSet, studioNamesSet]);

  // Lista processada de alunos com treinos cadastrados para o Calendario
  const calendarStudentItems = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);

    return programs
      .filter((p) => {
        const isModel =
          p.pt_student_id === "00000000-0000-0000-0000-000000000001" || !p.pt_student_id;
        return !isModel;
      })
      .map((p) => {
        const studentName = p.pt_students?.name?.trim() || "Aluno sem nome";
        const studentNotes = p.pt_students?.notes || "";
        const studentEmail = p.pt_students?.email || "";

        const hasStudioTag =
          studentNotes.includes("[Studio]") || studentNotes.includes("[Aluno Studio]");
        const isInStudioTable =
          (p.pt_student_id ? studioIdsSet.has(p.pt_student_id) : false) ||
          studioNamesSet.has(studentName.toLowerCase());

        const isStudio = hasStudioTag || isInStudioTable;
        const origin: "Studio" | "PT" = isStudio ? "Studio" : "PT";

        const isStudioRecord = p.pt_student_id ? studioIdsSet.has(p.pt_student_id) : false;
        const studentProfileUrl = isStudioRecord
          ? `/students/${p.pt_student_id}`
          : `/personal-trainer/students/${p.pt_students?.id || p.pt_student_id}`;

        const start = p.start_date ? p.start_date.slice(0, 10) : "";
        const end = p.end_date ? p.end_date.slice(0, 10) : null;

        let statusTime: "em_andamento" | "sem_fim" | "futuro" | "concluido" = "sem_fim";
        if (start && start > todayStr) {
          statusTime = "futuro";
        } else if (end && end < todayStr) {
          statusTime = "concluido";
        } else if (end && end >= todayStr) {
          statusTime = "em_andamento";
        } else if (start && !end) {
          statusTime = "sem_fim";
        }

        const days = Array.isArray(p.pt_training_days)
          ? [...p.pt_training_days].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          : [];

        return {
          program: p,
          studentName,
          studentEmail,
          origin,
          programName: p.name,
          startDate: p.start_date,
          endDate: p.end_date,
          statusTime,
          studentProfileUrl,
          days,
          category: p.category,
        };
      })
      .filter((item) => {
        if (calSearch) {
          const match = matchesSearchTerms(
            [item.studentName, item.programName, item.origin, item.category],
            calSearch
          );
          if (!match) return false;
        }

        if (calFilterOrigin === "pt" && item.origin !== "PT") return false;
        if (calFilterOrigin === "studio" && item.origin !== "Studio") return false;

        if (calFilterStatus !== "todos" && item.statusTime !== calFilterStatus) return false;

        return true;
      });
  }, [programs, studioIdsSet, studioNamesSet, calSearch, calFilterOrigin, calFilterStatus]);

  async function handleDelete(id: string) {
    const ok = await confirmDialog({
      title: "Excluir Rotina de Treino",
      description: "Deseja realmente remover esta rotina? Os dias e exercícios vinculados serão apagados.",
      confirmText: "Sim, Excluir",
      cancelText: "Cancelar",
      variant: "danger",
    });
    if (!ok) return;

    const { error } = await supabase.from("pt_programs" as never).delete().eq("id" as never, id);
    if (error) {
      toast.error(`Falha ao excluir: ${error.message}`);
    } else {
      toast.success("Rotina excluída com sucesso");
      qc.invalidateQueries({ queryKey: ["pt-programs"] });
    }
  }

  async function handleToggleArchive(id: string, currentlyArchived: boolean, name: string) {
    const novoStatus = !currentlyArchived;
    const { error } = await supabase
      .from("pt_programs" as never)
      .update({ is_archived: novoStatus } as never)
      .eq("id" as never, id);

    if (error) {
      toast.error(`Falha ao alterar status de arquivamento: ${error.message}`);
    } else {
      toast.success(
        novoStatus
          ? `"${name}" arquivado com sucesso! Você pode visualizá-lo selecionando o filtro "Arquivados".`
          : `"${name}" desarquivado com sucesso! Ele voltou a aparecer nos treinos ativos.`
      );
      qc.invalidateQueries({ queryKey: ["pt-programs"] });
    }
  }

  async function handleUnlinkStudent(programId: string, studentName?: string) {
    const ok = await confirmDialog({
      title: "Desvincular Aluno",
      description: `Deseja desvincular este treino de ${studentName || "este aluno"}? A rotina será mantida intacta e passará a ser um Modelo no Acervo Geral.`,
      confirmText: "Sim, Desvincular",
      cancelText: "Cancelar",
      variant: "default",
    });
    if (!ok) return;

    const { error } = await supabase
      .from("pt_programs" as never)
      .update({
        pt_student_id: "00000000-0000-0000-0000-000000000001",
      } as never)
      .eq("id" as never, programId);

    if (error) {
      toast.error(`Falha ao desvincular aluno: ${error.message}`);
    } else {
      toast.success("Treino desvinculado com sucesso! Agora ele é um Modelo no Acervo Geral.");
      setAlunoPerfilOpen(false);
      qc.invalidateQueries({ queryKey: ["pt-programs"] });
    }
  }

  async function handleDownloadPdf(programId: string, studentName?: string) {
    try {
      toast.loading("Gerando PDF oficial do treino...", { id: "pdf-toast" });
      await downloadProgramPdf(programId, studentName);
      toast.success("PDF baixado com sucesso!", { id: "pdf-toast" });
    } catch (e: any) {
      toast.error(e?.message || "Falha ao gerar PDF", { id: "pdf-toast" });
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Dumbbell className="h-6 w-6" />
            </span>
            Central de Treinos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Prescrição com IA, upload de planilhas e periodização integrada para alunos do Studio e Personal Trainer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => {
              setSelectedProgramForIa(null);
              setPrescreverIaOpen(true);
            }}
            className="h-9 gap-2 shadow-sm font-semibold"
          >
            <Sparkles className="h-4 w-4" />
            <span>Prescrever com IA / Planilha</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setTab("nova-sessao")}
            className="h-9 gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Sessão Manual</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-card/70 border-border/70 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total de Rotinas</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{programs.length}</p>
        </Card>
        <Card className="p-4 bg-card/70 border-border/70 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alunos Studio</p>
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-xs font-bold bg-primary/10 text-primary border-0">
              {totalStudio} {statusFiltro === "arquivados" ? "arquivadas" : "ativas"}
            </Badge>
          </div>
        </Card>
        <Card className="p-4 bg-card/70 border-border/70 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personal Trainer</p>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-xs font-bold text-foreground">
              {totalPt} {statusFiltro === "arquivados" ? "arquivadas" : "ativas"}
            </Badge>
          </div>
        </Card>
        <Card
          onClick={() => setAlertasVencimentoOpen(true)}
          className={cn(
            "p-4 transition-all cursor-pointer relative overflow-hidden group space-y-1 select-none",
            programasVencendo.length > 0
              ? "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/40 hover:border-amber-500 hover:shadow-md"
              : "bg-card/70 border-border/70 hover:border-primary/40 hover:bg-card/90"
          )}
          title="Clique para ver detalhes das rotinas que vencem em menos de 8 dias"
        >
          <div className="flex items-center justify-between">
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5",
                programasVencendo.length > 0
                  ? "text-amber-700 dark:text-amber-400 font-bold"
                  : "text-muted-foreground"
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>A Vencer (&lt; 8 dias)</span>
            </p>
            {programasVencendo.length > 0 && (
              <span className="relative flex h-2 w-2" title="Alerta ativo">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between gap-2 pt-0.5">
            <p
              className={cn(
                "text-2xl font-bold tracking-tight",
                programasVencendo.length > 0
                  ? "text-amber-800 dark:text-amber-200"
                  : "text-foreground"
              )}
            >
              {programasVencendo.length}
            </p>
            {programasVencendo.length > 0 ? (
              <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-300 hover:bg-amber-500/30 border-amber-500/40 text-[10px] font-bold gap-1 px-1.5 py-0.5">
                <AlertTriangle className="h-3 w-3" />
                Ver Alertas
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 className="h-3 w-3 mr-0.5" />
                Em dia
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
            <span className="truncate">
              {programasVencendo.length > 0
                ? "Clique para abrir lista"
                : `${totalModelos} modelo${totalModelos === 1 ? "" : "s"} no acervo`}
            </span>
            <span className="text-primary font-medium group-hover:underline text-[10px]">
              Abrir &rarr;
            </span>
          </div>
        </Card>
      </div>

      {/* Navegação por Abas Principais */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="space-y-5">
        <TabsList className="bg-muted/40 p-1 border border-border/60">
          <TabsTrigger value="programas" className="gap-2 text-xs font-medium">
            <Layers className="h-4 w-4" />
            Programas & Rotinas
          </TabsTrigger>
          <TabsTrigger value="calendario" className="gap-2 text-xs font-medium">
            <Calendar className="h-4 w-4" />
            Calendário
          </TabsTrigger>
          <TabsTrigger value="nova-sessao" className="gap-2 text-xs font-medium">
            <Plus className="h-4 w-4" />
            Montar Sessão
          </TabsTrigger>
          <TabsTrigger
            value="ia"
            onClick={() => {
              setSelectedProgramForIa(null);
              setPrescreverIaOpen(true);
            }}
            className="gap-2 text-xs font-medium text-primary font-semibold"
          >
            <Sparkles className="h-4 w-4" />
            Gerador IA / Planilha
          </TabsTrigger>
        </TabsList>

        {/* ABA: PROGRAMAS */}
        <TabsContent value="programas" className="space-y-4 m-0">
          {/* Barra de Filtros e Busca */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/60 p-3 rounded-xl border border-border/70">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por rotina, aluno ou foco..."
                className="pl-9 h-9 text-xs bg-background"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={tipoAlunoFiltro} onValueChange={(v: any) => setTipoAlunoFiltro(v)}>
                <SelectTrigger className="h-9 w-[160px] text-xs bg-background">
                  <SelectValue placeholder="Tipo de Aluno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Alunos</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="pt">Personal</SelectItem>
                  <SelectItem value="modelo">Modelos ({totalModelos})</SelectItem>
                  <SelectItem value="vencendo" className="text-amber-700 dark:text-amber-400 font-semibold">
                    A Vencer (&lt; 8 dias)
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={modalidadeFiltro} onValueChange={setModalidadeFiltro}>
                <SelectTrigger className="h-9 w-[140px] text-xs bg-background">
                  <SelectValue placeholder="Modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Modalidades</SelectItem>
                  <SelectItem value="musculacao">Musculação</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                  <SelectItem value="kettlebell_sport">Kettlebell Sport</SelectItem>
                  <SelectItem value="levantamento_peso">LPO</SelectItem>
                  <SelectItem value="treinamento_funcional">Funcional</SelectItem>
                  <SelectItem value="corrida">Corrida</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFiltro} onValueChange={(v: any) => setStatusFiltro(v)}>
                <SelectTrigger className="h-9 w-[120px] text-xs bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativos">Ativos</SelectItem>
                  <SelectItem value="arquivados">Arquivados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de Rotinas */}
          {isLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground animate-pulse">
              Carregando programas de treino...
            </div>
          ) : programasFiltrados.length === 0 ? (
            <div className="py-12 text-center border rounded-xl border-dashed border-border/80 bg-muted/10 space-y-3">
              <Dumbbell className="h-10 w-10 text-muted-foreground/60 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {statusFiltro === "arquivados"
                    ? "Nenhum treino arquivado encontrado"
                    : "Nenhuma rotina de treino encontrada"}
                </p>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  {statusFiltro === "arquivados"
                    ? "Para arquivar um treino, basta clicar no ícone de Arquivar (caixa) na barra de ações de qualquer card ativo."
                    : "Prescreva com IA, suba uma planilha do aluno ou monte uma nova sessão."}
                </p>
              </div>
              {statusFiltro === "arquivados" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStatusFiltro("ativos")}
                  className="gap-2 text-xs"
                >
                  <ArchiveRestore className="h-4 w-4 text-primary" />
                  <span>Voltar aos Treinos Ativos</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setSelectedProgramForIa(null);
                    setPrescreverIaOpen(true);
                  }}
                  className="gap-2 text-xs"
                >
                  <Sparkles className="h-4 w-4" />
                  Prescrever Primeiro Treino
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {programasFiltrados.map((prog) => {
                const isTemplate =
                  prog.pt_student_id === "00000000-0000-0000-0000-000000000001" ||
                  (!prog.pt_student_id);
                const isStudio =
                  !isTemplate && ( (prog.pt_students as any)?.notes?.includes("[Studio]") || (prog.pt_students as any)?.notes?.includes("[Aluno Studio]"));
                const isPt = !isTemplate && !isStudio;
                const aluno = isTemplate ? null : (prog.students || prog.pt_students);
                const isExpanded = expandedProgramId === prog.id;
                const goalsLimpo = limparTextoGoals(prog.goals);

                return (
                  <Card
                    key={prog.id}
                    className="p-4 bg-card/90 border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between space-y-3 shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0 flex-1">
                          <h3 className="font-semibold text-sm text-foreground line-clamp-1">{prog.name}</h3>
                          {aluno ? (
                            <div className="flex items-center justify-between gap-1 max-w-full min-w-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAlunoPerfil({
                                    ...aluno,
                                    programId: prog.id,
                                    programName: prog.name,
                                    tipo: isStudio ? "Studio" : "Personal Trainer",
                                    url: isStudio ? `/students/${aluno.id}` : `/personal-trainer/students/${aluno.id}`,
                                  });
                                  setAlunoPerfilOpen(true);
                                }}
                                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1.5 group text-left cursor-pointer transition-colors truncate min-w-0 flex-1"
                                title="Clique para ver o perfil do aluno vinculado"
                              >
                                <Link2 className="h-3 w-3 text-primary shrink-0" />
                                <span className="truncate">Vinculado: {aluno.name}</span>
                              </button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 shrink-0 gap-1 font-medium"
                                title="Desvincular deste aluno e mover para o Acervo Geral / Modelos"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnlinkStudent(prog.id, aluno.name);
                                }}
                              >
                                <Unlink className="h-3 w-3" />
                                <span>Desvincular</span>
                              </Button>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                              <Archive className="h-3 w-3 shrink-0 text-muted-foreground/80" />
                              <span>Acervo Geral / Modelo</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Modalidade, Origem (IA/Manual) e Data */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                        <Badge variant="secondary" className="text-[10px] font-bold bg-muted text-foreground border-0 px-2 py-0.5">
                          {CATEGORIA_LABELS[prog.training_type] || CATEGORIA_LABELS[prog.category] || prog.training_type || "Musculação"}
                        </Badge>

                        {prog.ai_generated_at ? (
                          <Badge variant="secondary" className="text-[10px] font-semibold bg-primary/10 text-primary border-primary/20 flex items-center gap-1 px-1.5 py-0.5">
                            <Sparkles className="h-2.5 w-2.5" /> IA
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground border-border/80 flex items-center gap-1 px-1.5 py-0.5">
                            <PenTool className="h-2.5 w-2.5" /> Manual
                          </Badge>
                        )}

                        <span className="text-muted-foreground/60">•</span>
                        <span className="text-muted-foreground text-[10px]">Início: {formatDateBR(prog.start_date)}</span>
                        {prog.end_date && (
                          <>
                            <span className="text-muted-foreground/60">•</span>
                            <span className="text-muted-foreground text-[10px]">Fim: {formatDateBR(prog.end_date)}</span>
                          </>
                        )}
                        {(() => {
                          if (isTemplate) return null;
                          const diff = getDiasParaVencer(prog.end_date);
                          if (diff === null || diff >= 8) return null;
                          if (diff < 0) {
                            return (
                              <Badge variant="destructive" className="text-[10px] font-bold px-1.5 py-0">
                                Vencido ({Math.abs(diff)}d)
                              </Badge>
                            );
                          }
                          if (diff === 0) {
                            return (
                              <Badge className="bg-rose-600 text-white hover:bg-rose-700 text-[10px] font-bold px-1.5 py-0">
                                Vence Hoje
                              </Badge>
                            );
                          }
                          if (diff === 1) {
                            return (
                              <Badge className="bg-amber-600 text-white hover:bg-amber-700 text-[10px] font-bold px-1.5 py-0">
                                Vence Amanhã
                              </Badge>
                            );
                          }
                          return (
                            <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[10px] font-bold px-1.5 py-0">
                              Vence em {diff}d
                            </Badge>
                          );
                        })()}
                      </div>

                      {goalsLimpo && (
                        <p className="text-xs text-muted-foreground/90 line-clamp-2 bg-muted/20 p-2 rounded-lg text-[11px]">
                          {goalsLimpo}
                        </p>
                      )}
                    </div>

                    {/* Ações da Rotina — Design sem estouro com dropdown de mais ações */}
                    <div className="border-t border-border/60 pt-3 flex items-center justify-between gap-1 flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1 px-2.5 font-semibold text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 shadow-xs"
                          title="Editar Rotina, Sessões e Exercícios"
                          onClick={() => {
                            setSelectedProgramIdForEdit(prog.id);
                            setInitialDayIdForEdit(null);
                            setProgramEditorOpen(true);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5 text-primary" />
                          <span>Editar</span>
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant={isExpanded ? "secondary" : "ghost"}
                          className="h-8 text-xs gap-1 px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => setExpandedProgramId(isExpanded ? null : prog.id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{isExpanded ? "Ocultar" : "Dias"}</span>
                        </Button>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary"
                          title="Atribuir a Aluno Ativo"
                          onClick={() => {
                            setAtribuirProgram({ id: prog.id, name: prog.name });
                            setAtribuirOpen(true);
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                          title="Continuar com IA / Adicionar Dias"
                          onClick={() => {
                            setSelectedProgramForIa({ id: prog.id, titulo: prog.name, metodologia: prog.training_type });
                            setPrescreverIaOpen(true);
                          }}
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Baixar PDF"
                          onClick={() => handleDownloadPdf(prog.id, aluno?.name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                              title="Mais opções"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProgramForDuplicate(prog);
                                setDuplicateDialogOpen(true);
                              }}
                              className="gap-2 cursor-pointer text-xs font-semibold"
                            >
                              <Copy className="h-4 w-4 text-primary" />
                              <span>Duplicar Treino</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setImageExportProgramId(prog.id);
                                setImageExportOpen(true);
                              }}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <span>Exportar Imagem</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleToggleArchive(prog.id, prog.is_archived, prog.name)}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              {prog.is_archived ? (
                                <>
                                  <ArchiveRestore className="h-4 w-4 text-amber-600" />
                                  <span>Desarquivar Treino</span>
                                </>
                              ) : (
                                <>
                                  <Archive className="h-4 w-4 text-muted-foreground" />
                                  <span>Arquivar Treino</span>
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleDelete(prog.id)}
                              className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Excluir Treino</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Drawer/Gaveta expandida com dias de treino */}
                    {isExpanded && (
                      <div className="mt-2 pt-3 border-t border-border/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-foreground">
                            Sessões Programadas ({expandedDays.length})
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[11px] gap-1 px-1.5 text-primary hover:bg-primary/10"
                            onClick={() => {
                              setSelectedProgramIdForEdit(prog.id);
                              setInitialDayIdForEdit(null);
                              setProgramEditorOpen(true);
                            }}
                          >
                            <Plus className="h-3 w-3" /> Nova Sessão
                          </Button>
                        </div>

                        {expandedDays.length === 0 ? (
                          <div className="p-3 text-center rounded-lg bg-muted/20 border border-dashed border-border text-xs text-muted-foreground space-y-1.5">
                            <p className="italic">Nenhum dia cadastrado ainda.</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => {
                                setSelectedProgramIdForEdit(prog.id);
                                setInitialDayIdForEdit(null);
                                setProgramEditorOpen(true);
                              }}
                            >
                              <Plus className="h-3 w-3" /> Criar Primeira Sessão
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                            {expandedDays.map((d) => (
                              <div
                                key={d.id}
                                className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border/50 text-xs hover:border-primary/40 transition-colors"
                              >
                                <div className="space-y-0.5">
                                  <span className="font-semibold text-foreground">{d.name}</span>
                                  {d.day_label && (
                                    <Badge variant="outline" className="ml-2 text-[9px] py-0">
                                      {d.day_label}
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-[11px] gap-1 px-2 text-primary hover:bg-primary/10"
                                  onClick={() => {
                                    setSelectedProgramIdForEdit(prog.id);
                                    setInitialDayIdForEdit(d.id);
                                    setProgramEditorOpen(true);
                                  }}
                                >
                                  <Pencil className="h-3 w-3" /> Editar
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="w-full text-xs h-7.5 mt-2 gap-1.5 font-semibold text-primary hover:bg-primary/10"
                              onClick={() => {
                                setSelectedProgramIdForEdit(prog.id);
                                setInitialDayIdForEdit(null);
                                setProgramEditorOpen(true);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" /> Abrir Editor Completo de Treino
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ABA: CALENDÁRIO */}
        <TabsContent value="calendario" className="space-y-5 m-0">
          {/* Header e Barra de Filtros do Calendario */}
          <div className="bg-card/70 p-4 rounded-xl border border-border/70 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Alunos com Treinos Cadastrados
                </h3>
                <p className="text-xs text-muted-foreground">
                  Acompanhe alunos do Studio e Personal Trainer, rotinas ativas, períodos de vigência e sessões semanais.
                </p>
              </div>

              {/* Botoes de atalho rapido */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs font-semibold gap-1.5"
                  onClick={() => {
                    setSelectedProgramForIa(null);
                    setPrescreverIaOpen(true);
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Prescrever Novo Treino
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 pt-2 border-t border-border/50">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={calSearch}
                  onChange={(e) => setCalSearch(e.target.value)}
                  placeholder="Filtrar por aluno, nome do treino ou modalidade..."
                  className="pl-9 h-9 text-xs bg-background"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Filtro Origem: Todos, PT, Studio */}
                <div className="inline-flex rounded-lg border border-border/80 bg-muted/40 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setCalFilterOrigin("todos")}
                    className={cn(
                      "px-2.5 py-1 rounded-md font-semibold transition-all",
                      calFilterOrigin === "todos"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Todos ({programs.filter((p) => p.pt_student_id !== "00000000-0000-0000-0000-000000000001" && p.pt_student_id).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalFilterOrigin("pt")}
                    className={cn(
                      "px-2.5 py-1 rounded-md font-semibold transition-all inline-flex items-center gap-1",
                      calFilterOrigin === "pt"
                        ? "bg-background text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    PT
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalFilterOrigin("studio")}
                    className={cn(
                      "px-2.5 py-1 rounded-md font-semibold transition-all inline-flex items-center gap-1",
                      calFilterOrigin === "studio"
                        ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Studio
                  </button>
                </div>

                {/* Filtro Periodo / Vigencia */}
                <Select
                  value={calFilterStatus}
                  onValueChange={(v) => setCalFilterStatus(v as any)}
                >
                  <SelectTrigger className="h-9 w-[160px] text-xs bg-background">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Períodos</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="sem_fim">Contínuo / Sem Fim</SelectItem>
                    <SelectItem value="futuro">Início Futuro</SelectItem>
                    <SelectItem value="concluido">Encerrados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Listagem em Cards de Alunos com Treinos */}
          {calendarStudentItems.length === 0 ? (
            <Card className="p-10 text-center bg-card/60 border-border/70 space-y-3">
              <Calendar className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">Nenhum aluno com treino encontrado</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Tente alterar os termos da busca ou os filtros de origem e período acima.
                </p>
              </div>
              {calSearch && (
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setCalSearch("")}>
                  Limpar busca
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-3.5">
              {calendarStudentItems.map((item) => {
                const isPt = item.origin === "PT";
                const startFormatted = item.startDate ? formatDateBR(item.startDate) : "Não definida";
                const endFormatted = item.endDate ? formatDateBR(item.endDate) : "Sem data fim (Contínuo)";

                return (
                  <Card
                    key={item.program.id}
                    className="p-4 sm:p-5 bg-card/90 border-border/70 hover:border-primary/40 transition-all shadow-sm space-y-3.5"
                  >
                    {/* Linha Principal: Aluno + Tags de Origem + Treino + Periodo */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Nome do Aluno e Tags */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={item.studentProfileUrl}
                            className="text-base font-extrabold text-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                          >
                            <span>{item.studentName}</span>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-primary" />
                          </Link>

                          {/* Tag de Identificacao PT vs Studio */}
                          {isPt ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 px-2 py-0.5"
                            >
                              PT
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 px-2 py-0.5"
                            >
                              Studio
                            </Badge>
                          )}

                          {/* Tag da Modalidade */}
                          <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0.5">
                            {CATEGORIA_LABELS[item.category] || item.category}
                          </Badge>

                          {/* Tag de Status de Vigencia */}
                          {item.statusTime === "em_andamento" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Em Vigência
                            </span>
                          )}
                          {item.statusTime === "sem_fim" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              Contínuo
                            </span>
                          )}
                          {item.statusTime === "concluido" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                              Encerrado
                            </span>
                          )}
                        </div>

                        {/* Nome do Treino ao lado com Periodo de Inicio e Fim */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-0.5">
                          {/* Nome do Treino */}
                          <div className="flex items-center gap-1.5 font-bold text-foreground">
                            <Dumbbell className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="text-sm font-bold text-primary dark:text-primary-foreground tracking-tight">
                              {item.programName}
                            </span>
                          </div>

                          <span className="hidden sm:inline text-muted-foreground/40">•</span>

                          {/* Periodo de Inicio e Fim */}
                          <div className="flex items-center gap-1.5 text-xs">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="font-semibold text-foreground">Início:</span>
                            <span>{startFormatted}</span>
                            <span className="mx-1 text-muted-foreground/60">→</span>
                            <span className="font-semibold text-foreground">Fim:</span>
                            <span className={cn(item.endDate ? "text-foreground font-medium" : "italic text-muted-foreground")}>
                              {endFormatted}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botoes de Acoes do Card */}
                      <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs font-semibold text-primary hover:bg-primary/10 gap-1.5"
                          onClick={() => {
                            setSelectedProgramIdForEdit(item.program.id);
                            setInitialDayIdForEdit(null);
                            setProgramEditorOpen(true);
                          }}
                          title="Abrir editor completo para ajustar séries e exercícios"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Editar Treino</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-semibold gap-1.5"
                          onClick={() => {
                            setStudentViewProgramId(item.program.id);
                            setStudentViewOpen(true);
                          }}
                          title="Visualizar a rotina na perspectiva do aluno"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Modo Aluno</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setSelectedAlunoPerfil({
                              programId: item.program.id,
                              name: item.studentName,
                              email: item.studentEmail,
                              tipo: item.origin,
                              notes: item.program.pt_students?.notes || null,
                              url: item.studentProfileUrl,
                            });
                            setAlunoPerfilOpen(true);
                          }}
                          title="Ver detalhes do aluno"
                        >
                          <User className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Divisao Semanal / Dias Cadastrados da Rotina */}
                    {item.days.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Layers className="h-3 w-3" />
                            Sessões do Programa ({item.days.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.days.map((day) => (
                            <button
                              key={day.id}
                              type="button"
                              onClick={() => {
                                setSelectedProgramIdForEdit(item.program.id);
                                setInitialDayIdForEdit(day.id);
                                setProgramEditorOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/40 hover:bg-muted px-2.5 py-1 text-xs text-foreground transition-colors group cursor-pointer"
                              title={`Abrir ${day.name}`}
                            >
                              {day.day_label && (
                                <span className="font-extrabold text-[10px] text-primary bg-primary/10 px-1.5 py-0.2 rounded">
                                  {day.day_label}
                                </span>
                              )}
                              <span className="font-medium group-hover:text-primary transition-colors truncate max-w-[200px]">
                                {day.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ABA: NOVA SESSÃO / CONSTRUTOR MANUAL */}
        <TabsContent value="nova-sessao" className="space-y-4 m-0">
          <Card className="p-4 sm:p-6 bg-card/80 border-border/70">
            <div className="mb-4">
              <h3 className="text-base font-bold text-foreground">Construtor Manual de Sessão</h3>
              <p className="text-xs text-muted-foreground">
                Monte blocos, selecione exercícios da biblioteca e ajuste repetições, cargas e intervalos em tempo real.
              </p>
            </div>
            <SessionBuilder />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Prescrição com IA / Planilha */}
      <PrescreverIaDialog
        isOpen={prescreverIaOpen}
        programa={selectedProgramForIa}
        onOpenChange={(open) => {
          setPrescreverIaOpen(open);
          if (!open) setSelectedProgramForIa(null);
        }}
      />

      {/* Dialog de Atalho: Atribuir Treino a Aluno Ativo */}
      <AtribuirTreinoDialog
        open={atribuirOpen}
        onOpenChange={(v) => {
          setAtribuirOpen(v);
          if (!v) setAtribuirProgram(null);
        }}
        programId={atribuirProgram?.id || null}
        programName={atribuirProgram?.name}
      />

      {/* Dialog de Duplicação de Treino Completo */}
      <DuplicateProgramDialog
        open={duplicateDialogOpen}
        onOpenChange={(v) => {
          setDuplicateDialogOpen(v);
          if (!v) setSelectedProgramForDuplicate(null);
        }}
        program={selectedProgramForDuplicate}
      />

      {/* Dialog de Exportação de Imagem A4/Instagram */}
      {imageExportProgramId && (
        <ProgramImageDialog
          programId={imageExportProgramId}
          open={imageExportOpen}
          onOpenChange={(v) => {
            setImageExportOpen(v);
            if (!v) setImageExportProgramId(null);
          }}
        />
      )}

      {/* Dialog de Edição Completa da Rotina, Sessões e Exercícios */}
      <ProgramEditorDialog
        open={programEditorOpen}
        onOpenChange={(open) => {
          setProgramEditorOpen(open);
          if (!open) {
            setSelectedProgramIdForEdit(null);
            setInitialDayIdForEdit(null);
          }
        }}
        programId={selectedProgramIdForEdit}
        initialDayId={initialDayIdForEdit}
      />

      {/* Dialog de Visualização Rápida do Aluno Vinculado */}
      <Dialog open={alunoPerfilOpen} onOpenChange={setAlunoPerfilOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" />
              Perfil do Aluno Vinculado
            </DialogTitle>
            <DialogDescription className="text-xs">
              Informações do aluno atribuído a esta rotina de treino.
            </DialogDescription>
          </DialogHeader>

          {selectedAlunoPerfil && (
            <div className="space-y-4 py-2">
              <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">{selectedAlunoPerfil.name}</h4>
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    {selectedAlunoPerfil.tipo}
                  </Badge>
                </div>

                {selectedAlunoPerfil.email && (
                  <p className="text-xs text-muted-foreground">
                    Email: <span className="font-medium text-foreground">{selectedAlunoPerfil.email}</span>
                  </p>
                )}

                {selectedAlunoPerfil.notes && (
                  <div className="space-y-1 pt-1 border-t border-border/50">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Observações / Histórico:
                    </p>
                    <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md whitespace-pre-wrap max-h-36 overflow-y-auto">
                      {selectedAlunoPerfil.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                {selectedAlunoPerfil.programId && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 gap-1.5 text-xs font-semibold"
                    onClick={() => handleUnlinkStudent(selectedAlunoPerfil.programId, selectedAlunoPerfil.name)}
                  >
                    <Unlink className="h-3.5 w-3.5" />
                    <span>Desvincular deste Aluno</span>
                  </Button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAlunoPerfilOpen(false)}
                  >
                    Fechar
                  </Button>
                  {selectedAlunoPerfil.url && (
                    <Button asChild size="sm" className="gap-1.5">
                      <Link to={selectedAlunoPerfil.url}>
                        <span>Abrir Ficha Completa</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Alertas de Treinos com Vencimento Próximo (< 8 dias) */}
      <Dialog open={alertasVencimentoOpen} onOpenChange={setAlertasVencimentoOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-5 pb-3 border-b border-border/70 bg-card">
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                <Clock className="h-5 w-5 text-amber-500" />
                <span>Alertas de Vencimento de Treinos</span>
                <Badge variant="secondary" className="ml-1 text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30">
                  {programasVencendo.length} {programasVencendo.length === 1 ? "rotina" : "rotinas"}
                </Badge>
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Rotinas de treino que vencem nos próximos 7 dias ou que já encerraram o ciclo e necessitam de nova prescrição/periodização.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {programasVencendo.length === 0 ? (
              <div className="py-12 text-center space-y-3 border rounded-xl border-dashed border-border/80 bg-muted/10">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">Nenhum treino a vencer nos próximos 8 dias</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Todas as periodizações ativas dos alunos Studio e Personal Trainer estão com prazos regulares em dia.
                  </p>
                </div>
              </div>
            ) : (
              programasVencendo.map(({ program, aluno, isStudio, diff }) => {
                const phone = aluno?.phone || (program.pt_students as any)?.phone;
                const whatsAppUrl = phone
                  ? `https://wa.me/${phone.replace(/\D/g, "").startsWith("55") ? phone.replace(/\D/g, "") : `55${phone.replace(/\D/g, "")}`}?text=${encodeURIComponent(
                      `Olá, ${aluno?.name || "atleta"}! Seu programa de treino "${program.name}" ${diff < 0 ? "já encerrou seu ciclo" : diff === 0 ? "vence hoje" : `vence em ${diff} dias`}. Vamos renovar e montar a próxima fase da sua periodização?`
                    )}`
                  : null;

                const alunoUrl = isStudio
                  ? `/students/${aluno?.id}`
                  : `/personal-trainer/students/${aluno?.id}`;

                return (
                  <div
                    key={program.id}
                    className={cn(
                      "rounded-xl border p-3.5 space-y-2.5 transition-all shadow-xs",
                      diff < 0
                        ? "bg-rose-500/5 border-rose-500/30 dark:bg-rose-950/20"
                        : diff <= 2
                        ? "bg-amber-500/10 border-amber-500/40 dark:bg-amber-950/20"
                        : "bg-card border-border/80 hover:border-border"
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-foreground truncate">{program.name}</h4>
                          <Badge variant="outline" className="text-[10px] font-semibold">
                            {CATEGORIA_LABELS[program.training_type] || CATEGORIA_LABELS[program.category] || program.training_type || "Musculação"}
                          </Badge>
                        </div>
                        {aluno && (
                          <div className="flex items-center gap-2 text-xs flex-wrap">
                            <span className="font-semibold text-foreground">{aluno.name}</span>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[10px] font-bold border-0 px-1.5 py-0",
                                isStudio ? "bg-primary/10 text-primary" : "bg-muted text-foreground"
                              )}
                            >
                              {isStudio ? "Studio" : "Personal"}
                            </Badge>
                            {phone && (
                              <span className="text-[11px] font-mono text-muted-foreground">{phone}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Badge de Urgência / Dias Faltantes */}
                      <div className="shrink-0 flex sm:flex-col items-end gap-1">
                        {diff < 0 ? (
                          <Badge variant="destructive" className="text-[10px] font-bold">
                            Vencido há {Math.abs(diff)} dia{Math.abs(diff) === 1 ? "" : "s"}
                          </Badge>
                        ) : diff === 0 ? (
                          <Badge className="bg-rose-600 text-white hover:bg-rose-700 text-[10px] font-bold">
                            Vence HOJE!
                          </Badge>
                        ) : diff === 1 ? (
                          <Badge className="bg-amber-600 text-white hover:bg-amber-700 text-[10px] font-bold">
                            Vence Amanhã
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 text-[10px] font-bold">
                            Vence em {diff} dias
                          </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Término: {formatDateBR(program.end_date)}
                        </span>
                      </div>
                    </div>

                    {/* Barra de Ações Rápidas */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2.5 gap-1.5 font-semibold text-foreground hover:bg-primary/10 hover:text-primary"
                          onClick={() => {
                            setAlertasVencimentoOpen(false);
                            setSelectedProgramIdForEdit(program.id);
                            setInitialDayIdForEdit(null);
                            setProgramEditorOpen(true);
                          }}
                        >
                          <Pencil className="h-3 w-3 text-primary" />
                          <span>Prorrogar / Editar</span>
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2.5 gap-1.5 text-primary hover:bg-primary/10 font-semibold"
                          onClick={() => {
                            setAlertasVencimentoOpen(false);
                            setSelectedProgramForIa({
                              id: program.id,
                              titulo: program.name,
                              metodologia: program.training_type,
                              alunoNome: aluno?.name,
                            });
                            setPrescreverIaOpen(true);
                          }}
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Nova Periodização IA</span>
                        </Button>
                      </div>

                      <div className="flex items-center gap-1.5 ml-auto flex-wrap">
                        {whatsAppUrl && (
                          <Button asChild size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10">
                            <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="h-3 w-3" />
                              <span>WhatsApp</span>
                            </a>
                          </Button>
                        )}

                        {aluno && (
                          <Button asChild size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground">
                            <Link to={alunoUrl}>
                              <span>Ver Aluno</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 border-t border-border/70 bg-card/60 flex items-center justify-between gap-2">
            {programasVencendo.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => {
                  setTipoAlunoFiltro("vencendo");
                  setAlertasVencimentoOpen(false);
                }}
              >
                <Filter className="h-3.5 w-3.5 text-primary" />
                <span>Filtrar estes treinos na tabela</span>
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto text-xs"
              onClick={() => setAlertasVencimentoOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
