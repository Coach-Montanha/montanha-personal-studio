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
import { matchesSearchTerms } from "@/lib/search-utils";

function limparTextoGoals(goals?: string | null): string | null {
  if (!goals) return null;
  const limpo = goals
    .replace(/Importado do Sistema Híbrido\s*[-·:]*\s*[a-zA-Z_À-ÿ]*/gi, "")
    .replace(/^[\s·\-_:]+|[\s·\-_:]+$/g, "")
    .trim();
  return limpo.length > 0 ? limpo : null;
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
  studio_student_id: string | null;
  pt_student_id: string | null;
  created_at: string;
  // Joins
  students?: { id: string; name: string; email: string | null } | null;
  pt_students?: { id: string; name: string; email: string | null; notes?: string | null } | null;
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
  const [tipoAlunoFiltro, setTipoAlunoFiltro] = useState<"todos" | "studio" | "pt" | "modelo">("todos");
  const [statusFiltro, setStatusFiltro] = useState<"ativos" | "arquivados">("ativos");
  const [modalidadeFiltro, setModalidadeFiltro] = useState<string>("todas");

  // Modais
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

  // Consulta de todos os programas com joins de alunos Studio e PT
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ["pt-programs", "all-unified", statusFiltro],
    queryFn: async () => {
      let q = supabase
        .from("pt_programs" as never)
        .select(`
          *,
          pt_students:pt_student_id (id, name, email, notes)
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
        (!p.studio_student_id && !p.pt_student_id);
      const isStudio =
        !isTemplate && (!!p.studio_student_id || (p.pt_students as any)?.notes?.includes("[Studio]") || (p.pt_students as any)?.notes?.includes("[Aluno Studio]"));
      const isPt = !isTemplate && !isStudio;

      // Filtro por tipo de aluno
      if (tipoAlunoFiltro === "studio" && !isStudio) return false;
      if (tipoAlunoFiltro === "pt" && !isPt) return false;
      if (tipoAlunoFiltro === "modelo" && !isTemplate) return false;

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
      (!!p.studio_student_id || (p.pt_students as any)?.notes?.includes("[Studio]") || (p.pt_students as any)?.notes?.includes("[Aluno Studio]"))
  ).length;
  const totalPt = programs.filter(
    (p) =>
      p.pt_student_id !== "00000000-0000-0000-0000-000000000001" &&
      !p.studio_student_id &&
      !(p.pt_students as any)?.notes?.includes("[Studio]") &&
      !(p.pt_students as any)?.notes?.includes("[Aluno Studio]")
  ).length;
  const totalModelos = programs.filter(
    (p) =>
      p.pt_student_id === "00000000-0000-0000-0000-000000000001" ||
      (!p.studio_student_id && !p.pt_student_id)
  ).length;

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
        <Card className="p-4 bg-card/70 border-border/70 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Modelos / Templates</p>
          <p className="text-2xl font-bold tracking-tight text-muted-foreground">{totalModelos}</p>
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
                <SelectTrigger className="h-9 w-[130px] text-xs bg-background">
                  <SelectValue placeholder="Tipo de Aluno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Alunos</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="pt">Personal</SelectItem>
                  <SelectItem value="modelo">Modelos</SelectItem>
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
                  (!prog.studio_student_id && !prog.pt_student_id);
                const isStudio =
                  !isTemplate && (!!prog.studio_student_id || (prog.pt_students as any)?.notes?.includes("[Studio]") || (prog.pt_students as any)?.notes?.includes("[Aluno Studio]"));
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
        <TabsContent value="calendario" className="space-y-4 m-0">
          <Card className="p-6 bg-card/80 border-border/70 text-center space-y-3">
            <Calendar className="h-10 w-10 text-primary mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Agenda de Treinos dos Alunos</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Visualize as sessões distribuídas por dia da semana para alunos do Studio e Personal Trainer.
              </p>
            </div>
          </Card>
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
    </div>
  );
}
