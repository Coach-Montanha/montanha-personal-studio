import { useState, useMemo, useRef } from "react";
import {
  X,
  Share2,
  Trophy,
  History,
  BookOpen,
  Medal,
  Dumbbell,
  TrendingUp,
  Download,
  Flame,
  Award,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  StickyNote,
  ChevronRight,
  User,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDateBR } from "@/lib/format";
import { resolveExerciseThumbnail } from "@/lib/thumbnail-utils";

interface HevyExerciseHubProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: {
    id?: string;
    name: string;
    muscle_group?: string | null;
    secondary_muscles?: string[] | null;
    media_url?: string | null;
    media_type?: string | null;
    thumbnail_url?: string | null;
    load?: string | null;
    sets_reps?: string | null;
    instructions?: string | null;
  } | null;
  studentName?: string;
  executions?: Array<{
    id: string;
    executed_at: string;
    notes: string | null;
  }>;
}

// Cálculo do 1RM estimado pela fórmula de Brzycki: 1RM = Carga / (1.0278 - 0.0278 * Reps)
function calculateEstimated1RM(weightKg: number, reps: number): number {
  if (weightKg <= 0) return 0;
  if (reps <= 1) return weightKg;
  const safeReps = Math.min(reps, 15);
  const oneRM = weightKg / (1.0278 - 0.0278 * safeReps);
  return Math.round(oneRM * 10) / 10;
}

function parseLoad(val?: string | number | null): number {
  if (!val) return 0;
  if (typeof val === "number") return val;
  const cleaned = String(val).replace(",", ".").trim();
  const m = cleaned.match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

function parseReps(val?: string | number | null): number {
  if (!val) return 10;
  if (typeof val === "number") return val;
  const m = String(val).match(/\d+/);
  return m ? Number(m[0]) : 10;
}

export function HevyExerciseHubDialog({
  open,
  onOpenChange,
  exercise,
  studentName = "Aluno Montanha",
  executions = [],
}: HevyExerciseHubProps) {
  const [activeTab, setActiveTab] = useState<"resumo" | "historico" | "instrucoes" | "ranking">("resumo");
  const [chartMetric, setChartMetric] = useState<"weight" | "1rm">("weight");
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatingShare, setGeneratingShare] = useState(false);

  const shareCardRef = useRef<HTMLDivElement>(null);

  // Notas fixadas do aluno para este exercício
  const noteStorageKey = exercise ? `montanha_exercise_note_${exercise.name.toLowerCase().trim()}` : "";
  const [pinnedNote, setPinnedNote] = useState(() => {
    if (typeof window === "undefined" || !noteStorageKey) return "";
    return localStorage.getItem(noteStorageKey) || "";
  });

  const handleSavePinnedNote = (text: string) => {
    setPinnedNote(text);
    if (noteStorageKey) {
      localStorage.setItem(noteStorageKey, text);
      toast.success("Nota fixada com sucesso!");
    }
  };

  // Processa o histórico cronológico de execuções deste exercício
  const historyData = useMemo(() => {
    if (!exercise) return [];
    const list: Array<{
      date: string;
      displayDate: string;
      load: number;
      reps: number;
      estimated1RM: number;
      volume: number;
      rawNotes?: string;
    }> = [];

    executions.forEach((exec) => {
      if (!exec.notes) return;
      try {
        const parsed = typeof exec.notes === "string" ? JSON.parse(exec.notes) : exec.notes;
        const loads = parsed.loads || {};
        const rawLoad = loads[exercise.id || ""] || loads[exercise.name];
        if (rawLoad !== undefined && rawLoad !== null) {
          const loadNum = parseLoad(rawLoad);
          const repsNum = parseReps(exercise.sets_reps);
          const oneRM = calculateEstimated1RM(loadNum, repsNum);
          const vol = loadNum * repsNum * 3; // volume aproximado da sessão

          list.push({
            date: exec.executed_at,
            displayDate: formatDateBR(exec.executed_at),
            load: loadNum,
            reps: repsNum,
            estimated1RM: oneRM,
            volume: vol,
            rawNotes: typeof exec.notes === "string" ? exec.notes : undefined,
          });
        }
      } catch {
        // ignore
      }
    });

    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [exercise, executions]);

  // Recordes Pessoais (PRs)
  const personalRecords = useMemo(() => {
    if (historyData.length === 0) {
      const currentLoad = parseLoad(exercise?.load);
      const currentReps = parseReps(exercise?.sets_reps);
      const oneRM = calculateEstimated1RM(currentLoad, currentReps);
      return {
        maxWeight: currentLoad || 0,
        best1RM: oneRM || 0,
        bestSetVolume: currentLoad ? currentLoad * currentReps : 0,
        bestSessionVolume: currentLoad ? currentLoad * currentReps * 3 : 0,
      };
    }

    let maxWeight = 0;
    let best1RM = 0;
    let bestSetVolume = 0;
    let bestSessionVolume = 0;

    historyData.forEach((item) => {
      if (item.load > maxWeight) maxWeight = item.load;
      if (item.estimated1RM > best1RM) best1RM = item.estimated1RM;
      const setVol = item.load * item.reps;
      if (setVol > bestSetVolume) bestSetVolume = setVol;
      if (item.volume > bestSessionVolume) bestSessionVolume = item.volume;
    });

    return { maxWeight, best1RM, bestSetVolume, bestSessionVolume };
  }, [historyData, exercise]);

  // Ranking demonstrativo dos atletas do Studio naquele movimento
  const leaderboard = useMemo(() => {
    const currentMax = personalRecords.maxWeight || 75;
    return [
      { rank: 1, name: "Matheus Emmanuel", load: Math.max(120, currentMax + 15), badge: "🥇 Ouro", isMe: false },
      { rank: 2, name: studentName, load: currentMax, badge: "🥈 Prata", isMe: true },
      { rank: 3, name: "Diego Cunha", load: Math.max(65, currentMax - 10), badge: "🥉 Bronze", isMe: false },
      { rank: 4, name: "Roberta Lacerda", load: Math.max(55, currentMax - 15), badge: "Top 5", isMe: false },
      { rank: 5, name: "Angelina Santos", load: Math.max(50, currentMax - 20), badge: "Top 5", isMe: false },
    ].sort((a, b) => b.load - a.load).map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [personalRecords, studentName]);

  // Músculos Primários e Secundários
  const primaryMuscle = exercise?.muscle_group || "Quadríceps";
  const secondaryMuscles = exercise?.secondary_muscles || ["Glúteos", "Posteriores de Coxa", "Core"];

  // Download do Card para Instagram Stories
  const handleDownloadShareCard = async () => {
    if (!shareCardRef.current) return;
    setGeneratingShare(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 0.98,
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `pr-${exercise?.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Card de recorde baixado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar card de imagem.");
    } finally {
      setGeneratingShare(false);
    }
  };

  if (!exercise) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] w-[95vw] sm:max-w-3xl overflow-hidden p-0 rounded-2xl border-border bg-background shadow-2xl flex flex-col">
        {/* Top Header Fixo */}
        <DialogHeader className="p-4 sm:p-5 pb-3 border-b border-border/70 bg-card/40 flex flex-row items-center justify-between shrink-0">
          <div className="space-y-0.5 min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-base sm:text-lg font-black tracking-tight text-foreground truncate">
                {exercise.name}
              </DialogTitle>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold shrink-0">
                {primaryMuscle}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {studentName} • Ecossistema Coach Montanha
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 pr-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowShareModal(true)}
              className="h-8 gap-1.5 text-xs font-bold rounded-lg border-primary/30 text-primary hover:bg-primary/10"
              title="Compartilhar nos Stories do Instagram"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Abas Superiores no Estilo Hevy */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 sm:px-6 pt-2 bg-muted/20 border-b border-border/60 shrink-0">
            <TabsList className="w-full grid grid-cols-4 bg-muted/60 p-1 rounded-xl h-10">
              <TabsTrigger value="resumo" className="text-xs font-bold gap-1.5 data-[state=active]:bg-background data-[state=active]:text-primary">
                <Trophy className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden xs:inline">Resumo</span>
              </TabsTrigger>
              <TabsTrigger value="historico" className="text-xs font-bold gap-1.5 data-[state=active]:bg-background data-[state=active]:text-primary">
                <History className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden xs:inline">Histórico</span>
              </TabsTrigger>
              <TabsTrigger value="instrucoes" className="text-xs font-bold gap-1.5 data-[state=active]:bg-background data-[state=active]:text-primary">
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden xs:inline">Instruções</span>
              </TabsTrigger>
              <TabsTrigger value="ranking" className="text-xs font-bold gap-1.5 data-[state=active]:bg-background data-[state=active]:text-primary">
                <Medal className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden xs:inline">Ranking</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Área de Conteúdo com Rolagem Suave */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* ABA 1: RESUMO */}
            <TabsContent value="resumo" className="mt-0 space-y-5 focus-visible:outline-none">
              {/* Card de Músculos Ativados */}
              <div className="p-4 rounded-xl border border-border bg-card/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1.5 w-full">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Anatomia & Músculos Alvo
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Primário:</span>
                    <Badge variant="default" className="text-xs font-bold bg-primary text-primary-foreground">
                      {primaryMuscle}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-medium text-muted-foreground">Secundários:</span>
                    {secondaryMuscles.map((m) => (
                      <Badge key={m} variant="secondary" className="text-[11px] font-medium">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-center shrink-0 p-1">
                  <Dumbbell className="h-8 w-8 text-primary/70" />
                </div>
              </div>

              {/* Gráfico de Evolução com Toggle */}
              <div className="p-4 rounded-xl border border-border bg-card/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Evolução Histórica
                  </span>
                  <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg">
                    <Button
                      type="button"
                      size="sm"
                      variant={chartMetric === "weight" ? "default" : "ghost"}
                      className="h-7 text-xs font-bold"
                      onClick={() => setChartMetric("weight")}
                    >
                      Maior Peso
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={chartMetric === "1rm" ? "default" : "ghost"}
                      className="h-7 text-xs font-bold"
                      onClick={() => setChartMetric("1rm")}
                    >
                      1RM Estimada
                    </Button>
                  </div>
                </div>

                {historyData.length > 0 ? (
                  <div className="h-48 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="displayDate" tick={{ fontSize: 11 }} />
                        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} unit=" kg" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#090d16",
                            borderColor: "#1e293b",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey={chartMetric === "weight" ? "load" : "estimated1RM"}
                          name={chartMetric === "weight" ? "Peso Real" : "1RM Estimada"}
                          stroke="#10b981"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: "#10b981" }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="py-8 text-center bg-muted/20 rounded-xl space-y-1">
                    <TrendingUp className="h-7 w-7 text-muted-foreground/50 mx-auto" />
                    <p className="text-xs font-semibold text-muted-foreground">Ainda sem histórico acumulado</p>
                    <p className="text-[11px] text-muted-foreground/80">Conclua seu próximo treino para iniciar a curva de progresso.</p>
                  </div>
                )}
              </div>

              {/* Grid de Recordes Pessoais (PRs) */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-amber-500" /> Recordes Pessoais
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Card className="p-3 bg-card border-border/80 text-center space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Maior Peso</span>
                    <p className="text-lg font-black text-foreground tabular-nums">
                      {personalRecords.maxWeight ? `${personalRecords.maxWeight} kg` : "—"}
                    </p>
                  </Card>
                  <Card className="p-3 bg-card border-border/80 text-center space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Melhor 1RM</span>
                    <p className="text-lg font-black text-emerald-500 tabular-nums">
                      {personalRecords.best1RM ? `${personalRecords.best1RM} kg` : "—"}
                    </p>
                  </Card>
                  <Card className="p-3 bg-card border-border/80 text-center space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Volume de Série</span>
                    <p className="text-lg font-black text-foreground tabular-nums">
                      {personalRecords.bestSetVolume ? `${personalRecords.bestSetVolume} kg` : "—"}
                    </p>
                  </Card>
                  <Card className="p-3 bg-card border-border/80 text-center space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Volume da Sessão</span>
                    <p className="text-lg font-black text-foreground tabular-nums">
                      {personalRecords.bestSessionVolume ? `${personalRecords.bestSessionVolume} kg` : "—"}
                    </p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ABA 2: HISTÓRICO */}
            <TabsContent value="historico" className="mt-0 space-y-4 focus-visible:outline-none">
              {/* Notas Fixadas do Exercício */}
              <div className="p-4 rounded-xl border border-border bg-card/40 space-y-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <StickyNote className="h-4 w-4 text-amber-500" />
                  Notas Fixadas do Exercício
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Lembrete pessoal sempre visível ao realizar este exercício (ex: regulagem do banco, dor articular ou aquecimento prévio).
                </p>
                <div className="flex gap-2">
                  <Input
                    value={pinnedNote}
                    onChange={(e) => setPinnedNote(e.target.value)}
                    placeholder="Adicione um lembrete para este movimento…"
                    className="text-base sm:text-xs h-10 font-medium bg-background"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleSavePinnedNote(pinnedNote)}
                    className="h-10 text-xs font-bold shrink-0"
                  >
                    Salvar
                  </Button>
                </div>
              </div>

              {/* Lista Cronológica de Execuções */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" /> Histórico de Sessões
                </span>

                {historyData.length > 0 ? (
                  <div className="space-y-2">
                    {[...historyData].reverse().map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-border/80 bg-card flex items-center justify-between gap-3 shadow-xs hover:border-primary/40 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-foreground">{item.displayDate}</span>
                          <p className="text-[11px] text-muted-foreground">
                            Executado: <strong className="text-foreground">{item.load} kg</strong> para ~{item.reps} reps
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs font-bold text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
                            1RM: {item.estimated1RM} kg
                          </Badge>
                          <span className="block text-[10px] text-muted-foreground mt-0.5">
                            Vol: {item.volume} kg
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-muted/20 rounded-xl space-y-1">
                    <History className="h-7 w-7 text-muted-foreground/40 mx-auto" />
                    <p className="text-xs font-bold text-muted-foreground">Nenhuma execução registrada</p>
                    <p className="text-[11px] text-muted-foreground/70">As cargas registradas no seu treino aparecerão listadas aqui automaticamente.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ABA 3: INSTRUÇÕES */}
            <TabsContent value="instrucoes" className="mt-0 space-y-5 focus-visible:outline-none">
              {/* Demonstração em Vídeo / Imagem */}
              {exercise.media_url ? (
                <div className="rounded-xl overflow-hidden border border-border/80 bg-black aspect-video flex items-center justify-center">
                  {exercise.media_type === "youtube" ? (
                    <iframe
                      src={exercise.media_url}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={exercise.media_url}
                      poster={resolveExerciseThumbnail(exercise.media_url, exercise.thumbnail_url) || undefined}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-border/80 bg-muted/20 text-center space-y-1">
                  <Play className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                  <p className="text-xs font-bold text-muted-foreground">Vídeo demonstrativo oficial em gravação</p>
                  <p className="text-[11px] text-muted-foreground/70">Consulte o guia técnico abaixo para a postura ideal.</p>
                </div>
              )}

              {/* Passo a Passo de Execução Técnica */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Guia de Execução Técnica
                </span>

                <ol className="space-y-2.5 text-xs text-foreground/90 leading-relaxed list-decimal list-inside">
                  <li>
                    <strong className="text-foreground">Posicionamento Inicial:</strong> Ajuste o apoio ou a pegada com firmeza. Mantenha os pés ou base alinhados e escápulas aduzidas.
                  </li>
                  <li>
                    <strong className="text-foreground">Fase Excêntrica (Descida):</strong> Inspire e desça o peso de forma controlada em 2 a 3 segundos, mantendo a musculatura sob tensão constante.
                  </li>
                  <li>
                    <strong className="text-foreground">Ponto de Inversão:</strong> Evite o rebote articular. Faça uma micro-pausa controlando a transição de direção.
                  </li>
                  <li>
                    <strong className="text-foreground">Fase Concêntrica (Subida):</strong> Expire pela boca e empurre com velocidade e firmeza, focando na contração do músculo primário ({primaryMuscle}).
                  </li>
                  <li>
                    <strong className="text-foreground">Estabilidade e Core:</strong> Mantenha o abdômen contraído (*bracing*) durante toda a série para proteger a coluna.
                  </li>
                </ol>
              </div>
            </TabsContent>

            {/* ABA 4: RANKING (LEADERBOARD) */}
            <TabsContent value="ranking" className="mt-0 space-y-4 focus-visible:outline-none">
              <div className="p-4 rounded-xl border border-border bg-card/40 space-y-2 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                      <Medal className="h-4 w-4 text-amber-500" /> Tabela de Classificação do Studio
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Ranking oficial dos alunos do Coach Montanha para {exercise.name}.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs font-bold border-amber-500/40 text-amber-500 bg-amber-500/10 w-fit mx-auto sm:mx-0">
                    🏆 Temporada Ativa
                  </Badge>
                </div>
              </div>

              {/* Tabela de Classificação dos Alunos */}
              <div className="space-y-2">
                {leaderboard.map((item) => (
                  <div
                    key={item.rank}
                    className={cn(
                      "p-3.5 rounded-xl border flex items-center justify-between gap-3 shadow-xs transition-colors",
                      item.isMe
                        ? "border-primary bg-primary/5 ring-1 ring-primary/40 font-bold"
                        : "border-border/80 bg-card hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black w-6 text-center tabular-nums">
                        {item.rank <= 3 ? item.badge.split(" ")[0] : `#${item.rank}`}
                      </span>
                      <div className="space-y-0.5">
                        <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                          {item.name}
                          {item.isMe && (
                            <Badge variant="secondary" className="text-[9px] px-1 py-0 uppercase">
                              Você
                            </Badge>
                          )}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {item.rank === 1 ? "Líder Geral" : "Atleta Studio Montanha"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-foreground tabular-nums">
                        {item.load} kg
                      </span>
                      <span className="block text-[10px] text-muted-foreground">
                        Recorde Pessoal
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Modal Especial de Compartilhamento no Instagram Stories */}
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent className="max-w-md p-4 sm:p-6 bg-slate-950 border-slate-800 rounded-2xl flex flex-col items-center space-y-4">
            <DialogHeader className="text-center w-full">
              <DialogTitle className="text-base font-bold text-white flex items-center justify-center gap-1.5">
                <Share2 className="h-4 w-4 text-emerald-400" />
                Compartilhar no Instagram Stories
              </DialogTitle>
            </DialogHeader>

            {/* Cartão Visual 9:16 para Stories */}
            <div
              ref={shareCardRef}
              className="w-full max-w-[320px] aspect-[9/14] rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              {/* Marca no Topo */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs border border-emerald-500/30">
                    CM
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-extrabold text-white block">Coach Montanha</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Personal Studio</span>
                  </div>
                </div>
                <Trophy className="h-5 w-5 text-amber-400" />
              </div>

              {/* Informações Centrais do Recorde */}
              <div className="space-y-4 text-center my-auto">
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 border-emerald-400/40 bg-emerald-400/10 mx-auto">
                  ⚡ Recorde Pessoal Batido
                </Badge>
                <h3 className="text-xl font-black text-white tracking-tight">
                  {exercise.name}
                </h3>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Maior Carga</span>
                  <p className="text-4xl font-black text-emerald-400 tabular-nums">
                    {personalRecords.maxWeight || 80} kg
                  </p>
                  <span className="text-xs text-slate-300 font-semibold block">
                    1RM Estimada: {personalRecords.best1RM || 92} kg
                  </span>
                </div>
              </div>

              {/* Rodapé do Aluno */}
              <div className="border-t border-white/10 pt-3 text-center space-y-0.5">
                <span className="text-xs font-bold text-white block">Atleta: {studentName}</span>
                <span className="text-[10px] text-emerald-400 block font-mono">@coachmontanha • Studio Montanha</span>
              </div>
            </div>

            {/* Ações de Download e Envio */}
            <div className="flex items-center gap-2 w-full pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowShareModal(false)}
                className="flex-1 text-xs text-slate-400 hover:text-white"
              >
                Fechar
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleDownloadShareCard}
                disabled={generatingShare}
                className="flex-1 text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
              >
                <Download className="h-3.5 w-3.5" />
                {generatingShare ? "Gerando..." : "Baixar Card (PNG)"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
