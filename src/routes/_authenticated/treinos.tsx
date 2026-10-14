import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrescreverIaDialog } from "@/components/programa-ia/PrescreverIaDialog";
import { SessionBuilder } from "@/components/session-builder/SessionBuilder";
import { downloadProgramPdf } from "@/lib/pt-program-pdf";
import { formatDateBR } from "@/lib/format";
import { confirmDialog } from "@/lib/confirm-dialog";
import { StudentViewDialog } from "@/components/pt/StudentViewDialog";
import { LoadProgressionDialog } from "@/components/pt/LoadProgressionDialog";
import { TrainingDayDetail } from "@/components/pt/TrainingDayDetail";
import { ProgramImageDialog } from "@/components/program-image/ProgramImageDialog";

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
  pt_students?: { id: string; name: string; email: string | null } | null;
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

  // Consulta de todos os programas com joins de alunos Studio e PT
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ["pt-programs", "all-unified", statusFiltro],
    queryFn: async () => {
      let q = supabase
        .from("pt_programs" as never)
        .select(`
          *,
          students:studio_student_id (id, name, email),
          pt_students:pt_student_id (id, name, email)
        ` as never);

      if (statusFiltro === "ativos") {
        q = q.eq("is_archived" as never, false).eq("is_deleted" as never, false);
      } else {
        q = q.eq("is_archived" as never, true).eq("is_deleted" as never, false);
      }

      const { data, error } = await q.order("created_at" as never, { ascending: false });
      if (error) throw error;
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
      // Filtro de busca por nome da rotina ou nome do aluno
      const alunoNome = p.students?.name || p.pt_students?.name || "";
      const matchesSearch =
        p.name.toLowerCase().includes(busca.toLowerCase()) ||
        alunoNome.toLowerCase().includes(busca.toLowerCase());
      if (!matchesSearch) return false;

      // Filtro por tipo de aluno
      if (tipoAlunoFiltro === "studio" && !p.studio_student_id) return false;
      if (tipoAlunoFiltro === "pt" && !p.pt_student_id) return false;
      if (tipoAlunoFiltro === "modelo" && (p.studio_student_id || p.pt_student_id)) return false;

      // Filtro por modalidade
      if (modalidadeFiltro !== "todas") {
        if (p.training_type !== modalidadeFiltro && p.category !== modalidadeFiltro) return false;
      }

      return true;
    });
  }, [programs, busca, tipoAlunoFiltro, modalidadeFiltro]);

  // Contadores
  const totalStudio = programs.filter((p) => !!p.studio_student_id).length;
  const totalPt = programs.filter((p) => !!p.pt_student_id).length;
  const totalModelos = programs.filter((p) => !p.studio_student_id && !p.pt_student_id).length;

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
              {totalStudio} ativas
            </Badge>
          </div>
        </Card>
        <Card className="p-4 bg-card/70 border-border/70 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personal Trainer</p>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-xs font-bold text-foreground">
              {totalPt} ativas
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
                <p className="text-sm font-semibold text-foreground">Nenhuma rotina de treino encontrada</p>
                <p className="text-xs text-muted-foreground">
                  Prescreva com IA, suba uma planilha do aluno ou monte uma nova sessão.
                </p>
              </div>
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
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {programasFiltrados.map((prog) => {
                const aluno = prog.students || prog.pt_students;
                const isStudio = !!prog.studio_student_id;
                const isPt = !!prog.pt_student_id;
                const isExpanded = expandedProgramId === prog.id;

                return (
                  <Card
                    key={prog.id}
                    className="p-4 bg-card/90 border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between space-y-3 shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="font-semibold text-sm text-foreground line-clamp-1">{prog.name}</h3>
                          {aluno ? (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span className="font-medium text-foreground">{aluno.name}</span>
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">Modelo / Template Geral</p>
                          )}
                        </div>

                        {isStudio ? (
                          <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-0 font-semibold">
                            Studio
                          </Badge>
                        ) : isPt ? (
                          <Badge variant="outline" className="text-[10px] font-semibold">
                            Personal
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            Modelo
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                        <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-medium">
                          {CATEGORIA_LABELS[prog.training_type] || CATEGORIA_LABELS[prog.category] || prog.training_type}
                        </span>
                        <span>•</span>
                        <span>Início: {formatDateBR(prog.start_date)}</span>
                        {prog.ai_generated_at && (
                          <>
                            <span>•</span>
                            <span className="text-primary font-medium flex items-center gap-0.5">
                              <Sparkles className="h-2.5 w-2.5" /> IA
                            </span>
                          </>
                        )}
                      </div>

                      {prog.goals && (
                        <p className="text-xs text-muted-foreground/90 line-clamp-2 bg-muted/20 p-2 rounded-lg text-[11px]">
                          {prog.goals}
                        </p>
                      )}
                    </div>

                    {/* Ações da Rotina */}
                    <div className="border-t border-border/50 pt-3 flex items-center justify-between gap-1 flex-wrap">
                      <Button
                        type="button"
                        size="sm"
                        variant={isExpanded ? "secondary" : "outline"}
                        className="h-8 text-xs gap-1.5 px-2.5"
                        onClick={() => setExpandedProgramId(isExpanded ? null : prog.id)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>{isExpanded ? "Ocultar" : "Ver Dias"}</span>
                      </Button>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Exportar Imagem A4/Instagram"
                          onClick={() => {
                            setImageExportProgramId(prog.id);
                            setImageExportOpen(true);
                          }}
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Baixar PDF"
                          onClick={() => handleDownloadPdf(prog.id, aluno?.name)}
                        >
                          <Download className="h-3.5 w-3.5" />
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
                          <Sparkles className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          title="Excluir Rotina"
                          onClick={() => handleDelete(prog.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Drawer/Gaveta expandida com dias de treino */}
                    {isExpanded && (
                      <div className="mt-2 pt-3 border-t border-border/60 space-y-2">
                        <p className="text-xs font-semibold text-foreground">Sessões Programadas ({expandedDays.length})</p>
                        {expandedDays.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">Nenhum dia cadastrado ainda.</p>
                        ) : (
                          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                            {expandedDays.map((d) => (
                              <div
                                key={d.id}
                                className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border/50 text-xs"
                              >
                                <div className="space-y-0.5">
                                  <span className="font-semibold text-foreground">{d.name}</span>
                                  {d.day_label && (
                                    <Badge variant="outline" className="ml-2 text-[9px] py-0">
                                      {d.day_label}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
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
    </div>
  );
}
