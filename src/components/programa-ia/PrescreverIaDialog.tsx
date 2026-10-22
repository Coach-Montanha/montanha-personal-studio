import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ChevronDown,
  Info,
  ListOrdered,
  Loader2,
  Sparkles,
  Timer,
  Weight,
  Plus,
  Minus,
  Download,
  Brain,
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  Settings2,
  Key,
  Users,
  Save,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { prescribeTrainingWithAi, gerarUploadTreinoUrl } from "@/lib/prescricao-ia.functions";
import { useSetTypeRegistry } from "@/lib/set-type-registry";
import { useFormatRegistry } from "@/lib/format-registry";
import { METHODOLOGY_LABEL, type Methodology } from "@/lib/methodology";
import type { AiDay, AiPrescription } from "@/lib/prescricao-ia.server";
import type { KbSportPayload } from "@/lib/kb-sport-ia.server";
import type { WlPayload } from "@/lib/weightlifting-ia.server";
import type { TfPayload } from "@/lib/funcional-ia.server";
import type {
  HibridoPayload,
  PrescricaoHibrido,
} from "@/lib/hibrido-ia.server";
import { parseAthleteMemory } from "@/lib/athlete-memory";
import { parsePlanilhaParaTreino } from "@/lib/parse-planilha";


const PLACEHOLDER = `Ex.: Próxima fase focada em força máxima, mantendo a divisão A/B anterior mas reduzindo as repetições para 4-6 e aumentando o descanso.
Priorizar exercícios básicos; manter o agachamento e o supino como primeiros movimentos da sessão.`;

function isPrescricaoHibrido(value: unknown): value is PrescricaoHibrido {
  return Boolean(value && Array.isArray((value as { sessoes?: unknown }).sessoes));
}

const EXEMPLOS = [
  {
    chip: "Hipertrofia 4x/semana",
    texto:
      "Divisão A/B/C/D para hipertrofia, 4 treinos por semana. 4x8-12 nos compostos e 3x12 nos isoladores, 90s de descanso.",
  },
  {
    chip: "Full body 3x/semana",
    texto:
      "Full body 3 vezes por semana, 5 a 6 exercícios por treino, 3x10, 60s de descanso, foco em barra e halteres.",
  },
  {
    chip: "Foco em membros inferiores",
    texto:
      "Divisão de 3 treinos com ênfase em membros inferiores (2 de perna e 1 de superiores), 4x8, 120s de descanso nos compostos.",
  },
] as const;

const LIMITACOES = [
  "Exclusivo da modalidade Musculação.",
  "A IA monta a prescrição com exercícios sugeridos de musculação.",
  "Suporta exercícios individuais e combinados (bi-set, tri-set).",
  "Até 4.000 caracteres por prompt.",
  "A IA gera uma prévia — nada é salvo até você confirmar.",
  "Os treinos entram na última semana da rotina, seguindo a numeração de dias existente.",
  "Cargas e observações são sugestões: revise antes de publicar.",
];

const COMBINACAO_LABEL: Record<string, string> = {
  biset: "Bi-set",
  triset: "Tri-set",
  superset: "Superset",
};

/** "4x10" -> { series: 4, reps: "10" } */
function parseSetsReps(v: string): { series: number | null; reps: string | null } {
  const m = v.match(/^\s*(\d+)\s*[xX×]\s*(.+)$/);
  if (m) return { series: Number(m[1]), reps: m[2].trim() };
  const t = v.trim();
  return { series: null, reps: t.length ? t : null };
}

type CargaClassificada =
  | { tipo: "kg"; valor: number }
  | { tipo: "pct_1rm"; valor: number }
  | { tipo: "texto"; valor: string };

/** Classifica o texto de "load" da IA: kg, %1RM, ou texto livre (ritmo/pace/outro). */
function classificarCarga(v: string): CargaClassificada | null {
  const raw = v.trim();
  if (!raw) return null;

  // Ritmo de corrida: "4:30/km", "4:30 min/km", "Ritmo T (limiar)" — nunca é peso.
  if (/:\d{2}/.test(raw) || /\/\s*km/i.test(raw) || /ritmo/i.test(raw)) {
    return { tipo: "texto", valor: raw };
  }

  // Percentual de 1RM: "80% 1RM", "80%"
  const pct = raw.match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (pct) {
    const n = Number(pct[1].replace(",", "."));
    return Number.isFinite(n) ? { tipo: "pct_1rm", valor: n } : { tipo: "texto", valor: raw };
  }

  // Peso em kg: "60kg", "2x24kg", "100 kg"
  const kg = raw.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
  if (kg) {
    const n = Number(kg[1].replace(",", "."));
    return Number.isFinite(n) ? { tipo: "kg", valor: n } : { tipo: "texto", valor: raw };
  }

  // Número solto sem unidade (ex.: "60") — assume kg por compatibilidade com o comportamento atual.
  const solto = raw.match(/^(\d+(?:[.,]\d+)?)$/);
  if (solto) {
    const n = Number(solto[1].replace(",", "."));
    return Number.isFinite(n) ? { tipo: "kg", valor: n } : { tipo: "texto", valor: raw };
  }

  return { tipo: "texto", valor: raw };
}

function juntarObs(...partes: (string | null | undefined)[]) {
  const s = partes.filter((p) => p && p.trim().length > 0).join(" · ");
  return s.length ? s : null;
}

/**
 * Converte os grupos da IA ("A1"/"A2") no mapa `grupos` por ordem que o
 * construtor de sessão já lê do config do bloco.
 */
function gruposDoDia(dia: AiDay): Record<string, Record<string, string>> {
  const grupos: Record<string, string> = {};
  dia.exercises.forEach((e, i) => {
    if (e.group_type !== "individual" && e.group) {
      grupos[String(i + 1)] = e.group.charAt(0).toUpperCase();
    }
  });
  return Object.keys(grupos).length ? { grupos } : {};
}

const DiaCard = memo(function DiaCard({ dia, index }: { dia: AiDay; index: number }) {
  return (
    <article className="rounded-xl border border-border/70 bg-card p-4">
      <header className="flex flex-wrap items-center gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          {dia.name || `Treino ${index + 1}`}
        </h4>
        {dia.day_label && (
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
            {dia.day_label}
          </Badge>
        )}
      </header>
      {dia.description && (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {dia.description}
        </p>
      )}
      <ul className="mt-3 space-y-2">
        {dia.exercises.map((e, i) => (
          <li
            key={`${e.name}-${i}`}
            className="rounded-lg border border-border/50 bg-muted/25 px-3 py-2"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="flex flex-wrap items-center gap-2 text-sm font-medium">
                {e.name}
                {e.group_type !== "individual" && e.group && (
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/10 text-[10px] uppercase tracking-wide text-primary"
                  >
                    {COMBINACAO_LABEL[e.group_type] ?? "Combinado"} · {e.group}
                  </Badge>
                )}
              </span>
              <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                {e.sets_reps && (
                  <span className="inline-flex items-center gap-1">
                    <ListOrdered className="h-3 w-3" />
                    {e.sets_reps}
                  </span>
                )}
                {e.load && (
                  <span className="inline-flex items-center gap-1">
                    <Weight className="h-3 w-3" />
                    {e.load}
                  </span>
                )}
                {e.rest_seconds != null && (
                  <span className="inline-flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {e.rest_seconds}s
                  </span>
                )}
              </span>
            </div>
            {e.observations && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground/80">
                {e.observations}
              </p>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
});

const HibridoPreview = memo(function HibridoPreview({
  prescricao,
  template,
}: {
  prescricao: PrescricaoHibrido;
  template: HibridoPayload["sessaoTemplate"];
}) {
  const labels = new Map(template.map((b) => [b.chave, b.titulo || b.formato]));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-bold tracking-tight">
          Sessões Geradas ({prescricao.sessoes.length})
        </h5>
        <Badge variant="outline" className="text-[10px] uppercase">
          Modo: Híbrido por molde
        </Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {prescricao.sessoes.map((sessao, i) => (
          <article key={i} className="rounded-xl border border-border/70 bg-card p-4">
            <h4 className="text-sm font-semibold">Sessão {i + 1}</h4>
            <div className="mt-3 space-y-2">
              {sessao.blocos.map((bloco) => (
                <div key={bloco.chave} className="rounded-lg border border-border/50 bg-muted/25 px-3 py-2">
                  <p className="text-xs font-semibold text-primary">
                    {labels.get(bloco.chave) ?? bloco.chave}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {bloco.exerciciosIds.length} exercício(s) vinculado(s) por ID real.
                  </p>
                  <p className="mt-1 break-all text-[10px] text-muted-foreground/80">
                    {bloco.exerciciosIds.join(", ") || "Nenhum ID selecionado"}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
});

async function salvarPrescricaoHibrida(args: {
  programaId: string;
  diasPorSemana: number;
  prescricao: PrescricaoHibrido;
  template: HibridoPayload["sessaoTemplate"];
}): Promise<number> {
  const { programaId, diasPorSemana, prescricao, template } = args;
  if (template.length === 0) {
    throw new Error("O molde da continuação está vazio. Feche e abra o programa novamente.");
  }

  const { data: semanasExistentes, error: we } = await supabase
    .from("program_weeks")
    .select("numero_semana")
    .eq("program_id", programaId)
    .order("numero_semana", { ascending: false })
    .limit(1);
  if (we) throw we;

  const ultimaSemana = semanasExistentes?.[0]?.numero_semana ?? 0;
  const weekMap = new Map<number, string>();
  const dias = Math.max(1, diasPorSemana);

  for (const [index, sessao] of prescricao.sessoes.entries()) {
    const semanaNumero = ultimaSemana + Math.floor(index / dias) + 1;
    if (!weekMap.has(semanaNumero)) {
      const { data: semanaExistente, error: se } = await supabase
        .from("program_weeks")
        .select("id")
        .eq("program_id", programaId)
        .eq("numero_semana", semanaNumero)
        .maybeSingle();
      if (se) throw se;

      if (semanaExistente) {
        weekMap.set(semanaNumero, semanaExistente.id);
      } else {
        const { data: novaSemana, error: ne } = await supabase
          .from("program_weeks")
          .insert({ program_id: programaId, numero_semana: semanaNumero })
          .select("id")
          .single();
        if (ne || !novaSemana) throw ne ?? new Error("Falha ao criar semana da continuação");
        weekMap.set(semanaNumero, novaSemana.id);
      }
    }

    const weekId = weekMap.get(semanaNumero)!;
    const { data: ultimaSessao, error: le } = await supabase
      .from("sessions")
      .select("numero_dia")
      .eq("program_week_id", weekId)
      .order("numero_dia", { ascending: false })
      .limit(1);
    if (le) throw le;

    const numeroDia = (ultimaSessao?.[0]?.numero_dia ?? 0) + 1;
    const { data: sessaoRow, error: sessaoError } = await supabase
      .from("sessions")
      .insert({
        program_week_id: weekId,
        numero_dia: numeroDia,
        titulo: `Sessão ${index + 1}`,
        status: "rascunho",
      })
      .select("id")
      .single();
    if (sessaoError || !sessaoRow) throw sessaoError ?? new Error("Falha ao criar sessão");

    for (const [ordem, blocoTemplate] of template.entries()) {
      const blocoResultado = sessao.blocos.find((b) => b.chave === blocoTemplate.chave);
      const ids = blocoResultado?.exerciciosIds ?? [];
      if (ids.length === 0) continue;

      const { data: blocoRow, error: blocoError } = await supabase
        .from("session_blocks")
        .insert({
          session_id: sessaoRow.id,
          ordem: ordem + 1,
          formato: blocoTemplate.formato,
          titulo: blocoTemplate.titulo ?? null,
          duracao_min: blocoTemplate.duracaoMin,
          config: {
            chave: blocoTemplate.chave,
            modo_execucao: blocoTemplate.modoExecucao,
            descanso_apos_seg: blocoTemplate.descansoAposSeg,
          },
        })
        .select("id")
        .single();
      if (blocoError || !blocoRow) throw blocoError ?? new Error("Falha ao criar bloco");

      const rows = ids.map((exerciseId, exerciseIndex) => ({
        session_block_id: blocoRow.id,
        exercise_id: exerciseId,
        nome_livre: null,
        ordem: exerciseIndex + 1,
        series: blocoTemplate.seriesMin,
        reps: blocoTemplate.repsPorExercicio == null ? null : String(blocoTemplate.repsPorExercicio),
        pct_1rm: blocoTemplate.percentual1rm ?? null,
        descanso_seg: blocoTemplate.descansoEntreSeriesSeg ?? null,
      }));
      const { error: exerciseError } = await supabase
        .from("session_block_exercises")
        .insert(rows);
      if (exerciseError) throw exerciseError;
    }
  }

  return prescricao.sessoes.length;
}

export function PrescreverIaDialog({
  programa,
  isOpen,
  escopo: escopoInicial,
  kb: kbInicial,
  wl: wlInicial,
  tf: tfInicial,
  co: coInicial,
  studentId,
  studioStudentId,
  initialStudentType = "studio",
  onOpenChange,
}: {
  programa?: { id?: string; titulo?: string | null; name?: string | null; metodologia?: string | null } | null;
  isOpen?: boolean;
  escopo?: {
    label?: string | null;
    semanas?: number | null;
    diasPorSemana?: number | null;
    dataInicio?: string | null;
    hibrido?: HibridoPayload | null;
  } | null;
  /** Configuração do Kettlebell Sport (quando a rotina é dessa modalidade). */
  kb?: KbSportPayload | null;
  /** Configuração do Levantamento de Peso (quando a rotina é dessa modalidade). */
  wl?: WlPayload | null;
  /** Configuração do Treinamento Funcional (quando a rotina é dessa modalidade). */
  tf?: TfPayload | null;
  /** Configuração da Corrida (quando a rotina é dessa modalidade). */
  co?: import("@/lib/corrida-ia.server").CorridaPayload | null;
  studentId?: string | null;
  studioStudentId?: string | null;
  initialStudentType?: "studio" | "pt" | "none";
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const gerar = useServerFn(prescribeTrainingWithAi);
  const prepararUpload = useServerFn(gerarUploadTreinoUrl);

  // Estados para criação avulsa / sem programa prévio
  const [nomePrograma, setNomePrograma] = useState(programa?.titulo || (programa as any)?.name || "Nova Rotina de Treino");
  const [alunoTipo, setAlunoTipo] = useState<"studio" | "pt" | "none">(
    studioStudentId ? "studio" : studentId ? "pt" : initialStudentType
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    studioStudentId || studentId || null
  );

  // Lista de alunos Studio
  const { data: studioStudents = [] } = useQuery({
    queryKey: ["dialog-all-studio-students"],
    queryFn: async () => {
      const { data } = await supabase
        .from("students" as never)
        .select("id, name, email, status")
        .is("deleted_at" as never, null)
        .order("name" as never);
      return (data || []) as Array<{ id: string; name: string; email: string | null }>;
    },
  });

  // Lista de alunos PT
  const { data: ptStudents = [] } = useQuery({
    queryKey: ["dialog-all-pt-students"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_students" as never)
        .select("id, name, email, status")
        .is("deleted_at" as never, null)
        .neq("id" as never, "00000000-0000-0000-0000-000000000001")
        .order("name" as never);
      return (data || []) as Array<{ id: string; name: string; email: string | null }>;
    },
  });

  // Consulta automática da memória persistente do aluno vinculado
  const { data: assignedStudent } = useQuery({
    queryKey: ["dialog-athlete-memory", programa?.id, selectedStudentId, alunoTipo],
    queryFn: async () => {
      const targetId = selectedStudentId;
      if (targetId) {
        if (alunoTipo === "pt") {
          const { data } = await supabase
            .from("pt_students" as never)
            .select("id, name, email, notes")
            .eq("id" as never, targetId)
            .maybeSingle();
          return data ? { id: (data as any).id, nome: (data as any).name, email: (data as any).email, observacoes: (data as any).notes } : null;
        } else {
          const { data } = await supabase
            .from("students" as never)
            .select("id, name, email, notes")
            .eq("id" as never, targetId)
            .maybeSingle();
          return data ? { id: (data as any).id, nome: (data as any).name, email: (data as any).email, observacoes: (data as any).notes } : null;
        }
      }
      return null;
    },
    enabled: !!selectedStudentId,
  });

  const athleteMemory = useMemo(() => {
    return assignedStudent?.observacoes ? parseAthleteMemory(assignedStudent.observacoes) : null;
  }, [assignedStudent?.observacoes]);

  const [prompt, setPrompt] = useState("");
  const [metodologia, setMetodologia] = useState<Methodology | string>(programa?.metodologia || "musculacao");
  const [escola, setEscola] = useState<string>("auto");
  // Parâmetros Kettlebell Sport
  const [kbDisciplina, setKbDisciplina] = useState<"long_cycle" | "biathlon" | "ambas">(kbInicial?.disciplina || "long_cycle");
  const [kbPesoSino, setKbPesoSino] = useState<number>(kbInicial?.cargas?.longCycle?.pesoKettlebellKg || 16);
  const [kbNivel, setKbNivel] = useState<"iniciante" | "intermediario" | "avancado" | "elite">(kbInicial?.nivelAtleta || "intermediario");
  const [semanas, setSemanas] = useState(escopoInicial?.semanas || 1);
  const [diasPorSemana, setDiasPorSemana] = useState(escopoInicial?.diasPorSemana || 3);
  const [historicoSessoes, setHistoricoSessoes] = useState(6);
  const [cooldownSessoes, setCooldownSessoes] = useState(3);
  const [previa, setPrevia] = useState<AiPrescription | PrescricaoHibrido | null>(null);
  const [progresso, setProgresso] = useState<string[]>([]);
  const { presets: setTypes } = useSetTypeRegistry();
  const { presets: customFormats } = useFormatRegistry();
  const [moldeSelecionado, setMoldeSelecionado] = useState<string>("auto");
  const isHibrido = metodologia === "hibrido" || metodologia === "kettlebell_fitness";

  // Estados para Upload de Planilha / Treino Prévia
  const [planilhaTexto, setPlanilhaTexto] = useState("");
  const [planilhaArquivoNome, setPlanilhaArquivoNome] = useState<string | null>(null);
  const [planilhaImagem, setPlanilhaImagem] = useState<{ mimeType: string; data: string } | null>(null);
  const [planilhaFileUrl, setPlanilhaFileUrl] = useState<string | null>(null);
  const [planilhaModo, setPlanilhaModo] = useState<"direto" | "ajustar" | "continuar">("direto");
  const [isExtractingPlanilha, setIsExtractingPlanilha] = useState(false);
  const [showPlanilhaPreview, setShowPlanilhaPreview] = useState(false);

  // Chave local do Google Gemini (BYOK - Bring Your Own Key para casos sem chave no servidor)
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("montanha_gemini_api_key") ||
        (import.meta as any)?.env?.VITE_GEMINI_API_KEY ||
        ""
      );
    }
    return "";
  });
  const [tempApiKey, setTempApiKey] = useState(geminiApiKey);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const salvarApiKey = (novaChave: string) => {
    const limpa = novaChave.trim();
    setGeminiApiKey(limpa);
    if (typeof window !== "undefined") {
      if (limpa) {
        localStorage.setItem("montanha_gemini_api_key", limpa);
        toast.success("Chave Gemini salva localmente com sucesso!");
      } else {
        localStorage.removeItem("montanha_gemini_api_key");
        toast.info("Chave Gemini removida.");
      }
    }
    setShowApiKeyInput(false);
  };

  // Dias existentes da rotina (caso esteja continuando prescrição de pt_programs)
  const { data: existingPtDays = [] } = useQuery({
    queryKey: ["dialog-existing-days", programa?.id],
    enabled: !!programa?.id && !!isOpen,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_training_days" as never)
        .select("id, name, day_label, sort_order")
        .eq("program_id" as never, programa!.id)
        .order("sort_order" as never, { ascending: true });
      return (data || []) as Array<{ id: string; name: string; day_label: string; sort_order: number }>;
    },
  });

  // Sincroniza nome, metodologia, aluno e prompt quando programa é selecionado ou aberto
  useEffect(() => {
    if (isOpen) {
      if (studioStudentId) {
        setAlunoTipo("studio");
        setSelectedStudentId(studioStudentId);
      } else if (studentId) {
        setAlunoTipo("pt");
        setSelectedStudentId(studentId);
      }
      if (programa) {
        const title = programa.titulo || (programa as any)?.name;
        if (title) setNomePrograma(title);
        const validTypes = ["musculacao", "hibrido", "kettlebell_fitness", "kettlebell_sport", "levantamento_peso", "treinamento_funcional", "corrida"];
        if (programa.metodologia && validTypes.includes(programa.metodologia)) {
          setMetodologia(programa.metodologia);
        } else {
          setMetodologia("musculacao");
        }
      }
    }
  }, [programa, isOpen, studentId, studioStudentId]);

  // Efeito para carregar as regras persistidas do programa E preferências globais
  useEffect(() => {
    async function carregarConfiguracoes() {
      if (!programa?.id) return;
      
      // 1. Carregar preferências da modalidade (Geração Automática)
      const { data: coach } = await supabase.from("coaches").select("id").maybeSingle();
      if (coach && isHibrido) {
        const { data: pref } = await supabase
          .from("generator_preferences")
          .select("blocos")
          .eq("coach_id", coach.id)
          .eq("metodologia", metodologia)
          .maybeSingle();
      }

      // 2. Carregar regras específicas do programa (seja de pt_programs ou programs)
      const { data: ptData } = await supabase
        .from("pt_programs" as never)
        .select("name, training_type, goals")
        .eq("id" as never, programa.id)
        .maybeSingle();

      if (ptData) {
        const rawType = (ptData as any).training_type;
        const validTypes = ["musculacao", "hibrido", "kettlebell_fitness", "kettlebell_sport", "levantamento_peso", "treinamento_funcional", "corrida"];
        if (rawType && validTypes.includes(rawType)) {
          setMetodologia(rawType);
        } else {
          setMetodologia("musculacao");
        }
        if ((ptData as any).name) setNomePrograma((ptData as any).name);
      }

      const { data } = await supabase
        .from("programs")
        .select("regras_progressao")
        .eq("id", programa.id)
        .maybeSingle();
      
      if (data?.regras_progressao) {
        const r = data.regras_progressao as any;
        if (r.metodologia) setMetodologia(r.metodologia);
        if (r.escola) setEscola(r.escola);
        if (r.dias_por_semana) setDiasPorSemana(r.dias_por_semana);
        if (r.semanas) setSemanas(r.semanas);
        if (r.historico_sessoes !== undefined) setHistoricoSessoes(r.historico_sessoes);
        if (r.cooldown_sessoes !== undefined) setCooldownSessoes(r.cooldown_sessoes);
        if (r.prompt) setPrompt(r.prompt);
      }
    }
    carregarConfiguracoes();
  }, [programa?.id, metodologia, isHibrido]);

  // Moldes únicos extraídos do histórico
  const moldesHistoricos = useMemo(() => {
    if (!escopoInicial?.hibrido?.historicoSessoes) return [];
    
    // Agrupa por número do dia (Segunda=1, Terça=2, etc) e pega a ÚLTIMA ocorrência estrutural de cada dia
    const porDia = new Map<number, any>();
    escopoInicial.hibrido.historicoSessoes.forEach((s: any) => {
      porDia.set(s.numero_dia, s);
    });
    
    return Array.from(porDia.values()).sort((a, b) => (a.numero_dia ?? 0) - (b.numero_dia ?? 0));
  }, [escopoInicial?.hibrido?.historicoSessoes]);

  // Constrói um payload estável sem mutar `escopoInicial.hibrido`.
  // A continuação precisa sempre enviar um molde real para o servidor.
  const hibridoPayload = useMemo(() => {
    const base = escopoInicial?.hibrido;
    if (!base) return null;

    let template = base.sessaoTemplate;
    if (moldeSelecionado !== "auto") {
      const molde = moldesHistoricos.find((m) => String(m.id) === moldeSelecionado);
      if (molde?.blocks) {
        template = molde.blocks;
      }
    }

    return {
      ...base,
      sessaoTemplate: template ?? [],
    };
  }, [escopoInicial?.hibrido, moldeSelecionado, moldesHistoricos]);

  // Mapeamento de escolas por metodologia
  const ESCOLAS_DISPONIVEIS: Record<string, { value: string; label: string }[]> = useMemo(() => ({
    musculacao: [
      { value: "auto", label: "Automático (IA decide)" },
      { value: "bro_split", label: "Bro-Split (Bodybuilding Clássico)" },
      { value: "upper_lower", label: "Upper/Lower" },
      { value: "ppl", label: "PPL (Push/Pull/Legs)" },
      { value: "full_body", label: "Full Body" },
      { value: "heavy_duty", label: "Heavy Duty / HIT" },
    ],
    treinamento_funcional: [
      { value: "auto", label: "Automático (IA decide)" },
      { value: "exos", label: "EXOS / Core Performance" },
      { value: "crossfit", label: "CrossFit" },
      { value: "boyle", label: "Joint-by-Joint (Boyle)" },
      { value: "fms_sfma", label: "FMS/SFMA" },
      { value: "dns", label: "DNS (Praga)" },
      { value: "original_strength", label: "Original Strength" },
    ],
    levantamento_peso: [
      { value: "auto", label: "Automático (IA decide)" },
      { value: "bulgara", label: "Búlgara" },
      { value: "russa_classica", label: "Russa Clássica" },
      { value: "chinesa", label: "Chinesa" },
      { value: "cubana", label: "Cubana" },
      { value: "colombiana", label: "Colombiana" },
      { value: "pendlay", label: "Takano / Pendlay" },
    ],
    kettlebell_sport: [
      { value: "auto", label: "Automático (IA decide)" },
      { value: "fedorenko", label: "Fedorenko / WKC" },
      { value: "rudnev", label: "Rudnev" },
      { value: "vorotyntsev", label: "Vorotyntsev" },
      { value: "denisov", label: "Denisov" },
      { value: "vasilev", label: "Vasilev" },
      { value: "gomonov", label: "Gomonov" },
    ],
    corrida: [
      { value: "auto", label: "Automático (IA decide)" },
      { value: "daniels", label: "Daniels / VDOT" },
      { value: "lydiard", label: "Lydiard (Base)" },
      { value: "canova", label: "Canova (Elite)" },
      { value: "hansons", label: "Hansons" },
      { value: "pfitzinger", label: "Pfitzinger" },
      { value: "horwill", label: "Horwill" },
      { value: "koop", label: "Koop (Ultra)" },
    ],
    hibrido: [
      { value: "auto", label: "Híbrido Clássico" },
      { value: "performance", label: "Híbrido Performance" },
      { value: "saude", label: "Híbrido Saúde/Longevidade" },
    ],
    kettlebell_fitness: [
      { value: "auto", label: "KB Fitness Padrão" },
      { value: "fluxo", label: "KB Flows / Complexos" },
    ],
  }), []);

  // Resetar escola ao mudar metodologia
  useEffect(() => {
    // Para Híbrido e KB Fitness, o seletor é importante, então deixamos o valor atual se for compatível
    const disponiveis = ESCOLAS_DISPONIVEIS[metodologia] || [];
    const aindaValido = disponiveis.some(e => e.value === escola);
    if (!aindaValido) {
      setEscola("auto");
    }
  }, [metodologia, escola, ESCOLAS_DISPONIVEIS]);

  const limpar = useCallback(() => {
    setPrompt("");
    setPrevia(null);
    setPlanilhaTexto("");
    setPlanilhaArquivoNome(null);
    setPlanilhaImagem(null);
    setPlanilhaFileUrl(null);
    setShowPlanilhaPreview(false);
  }, []);

  // Helper para comprimir fotos client-side antes de enviar (evita limite 4.5MB da Vercel)
  const comprimirImagem = useCallback(async (file: File, maxDim = 1280, quality = 0.75): Promise<{ mimeType: string; data: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Não foi possível processar a imagem"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          const base64Data = dataUrl.split(",")[1];
          resolve({ mimeType: "image/jpeg", data: base64Data });
        };
        img.onerror = () => reject(new Error("Erro ao carregar imagem para compressão"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
      reader.readAsDataURL(file);
    });
  }, []);

  // Extração inteligente de arquivos de treino (.txt, .csv, .xlsx, .pdf, imagens)
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;
    setIsExtractingPlanilha(true);
    setPlanilhaArquivoNome(file.name);

    try {
      const fileNameLower = file.name.toLowerCase();

      // 1. Imagens (PNG, JPG, JPEG, WEBP) -> Comprime client-side para evitar payload 413
      if (file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(fileNameLower)) {
        try {
          const compressed = await comprimirImagem(file);
          setPlanilhaImagem(compressed);
          setPlanilhaFileUrl(null);
          setPlanilhaTexto(`[Arquivo de imagem anexo: ${file.name}]\nA IA analisará visualmente esta ficha de treino/planilha.`);
          setShowPlanilhaPreview(true);
          toast.success(`Ficha em imagem otimizada (${file.name})!`);
        } catch {
          // Fallback simples se falhar o canvas
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.split(",")[1];
            const mimeType = file.type || "image/jpeg";
            setPlanilhaImagem({ mimeType, data: base64Data });
            setPlanilhaFileUrl(null);
            setPlanilhaTexto(`[Arquivo de imagem anexo: ${file.name}]\nA IA analisará visualmente esta ficha de treino/planilha.`);
            setShowPlanilhaPreview(true);
            toast.success(`Ficha em imagem carregada (${file.name})!`);
          };
          reader.readAsDataURL(file);
        }
        setIsExtractingPlanilha(false);
        return;
      }

      // 2. Planilhas Excel (.xlsx, .xls) -> Leitura client-side com SheetJS (xlsx)
      if (/\.(xlsx|xls)$/i.test(fileNameLower)) {
        const { read, utils } = await import("xlsx");
        const arrayBuffer = await file.arrayBuffer();
        const workbook = read(arrayBuffer, { type: "array" });
        let extractedText = "";

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const csv = utils.sheet_to_csv(sheet, { blankrows: false });
          if (csv && csv.trim().length > 0) {
            extractedText += `=== ABA: ${sheetName} ===\n${csv}\n\n`;
          }
        });

        if (!extractedText.trim()) {
          throw new Error("A planilha parece estar vazia.");
        }

        setPlanilhaTexto(extractedText.trim());
        setPlanilhaImagem(null);
        setPlanilhaFileUrl(null);
        setShowPlanilhaPreview(true);
        toast.success(`Planilha ${file.name} processada com sucesso!`);
        setIsExtractingPlanilha(false);
        return;
      }

      // 3. Arquivos de Texto (.txt, .csv)
      if (file.type === "text/plain" || file.type === "text/csv" || /\.(txt|csv)$/i.test(fileNameLower)) {
        const text = await file.text();
        if (!text.trim()) {
          throw new Error("O arquivo de texto está vazio.");
        }
        setPlanilhaTexto(text.trim());
        setPlanilhaImagem(null);
        setPlanilhaFileUrl(null);
        setShowPlanilhaPreview(true);
        toast.success(`Texto de ${file.name} carregado com sucesso!`);
        setIsExtractingPlanilha(false);
        return;
      }

      // 4. PDFs -> Upload via Signed Upload URL no bucket treinos-anexos (contorna RLS e evita limite da Vercel)
      if (file.type === "application/pdf" || fileNameLower.endsWith(".pdf")) {
        try {
          const { filePath, token, publicUrl } = await prepararUpload({
            data: { fileName: file.name, fileType: file.type || "application/pdf" },
          });

          const { error: upError } = await supabase.storage
            .from("treinos-anexos")
            .uploadToSignedUrl(filePath, token, file, {
              contentType: file.type || "application/pdf",
            });

          if (upError) throw upError;

          setPlanilhaFileUrl(publicUrl);
          setPlanilhaImagem(null);
          setPlanilhaTexto(`[Documento PDF anexo: ${file.name}]\nA IA interpretará o conteúdo estruturado deste PDF.`);
          setShowPlanilhaPreview(true);
          toast.success(`PDF ${file.name} carregado com sucesso!`);
          setIsExtractingPlanilha(false);
          return;
        } catch (uploadErr: any) {
          console.warn("[handleFileUpload] Falha no upload assinado do PDF, tentando fallback:", uploadErr);
          // Se for menor que 1.5MB, fallback em base64
          if (file.size < 1.5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              const base64Data = result.split(",")[1];
              setPlanilhaImagem({ mimeType: "application/pdf", data: base64Data });
              setPlanilhaFileUrl(null);
              setPlanilhaTexto(`[Documento PDF anexo: ${file.name}]\nA IA interpretará o conteúdo deste PDF.`);
              setShowPlanilhaPreview(true);
              toast.success(`PDF ${file.name} anexado para análise!`);
              setIsExtractingPlanilha(false);
            };
            reader.readAsDataURL(file);
            return;
          }
          throw new Error(`Erro ao enviar PDF: ${uploadErr?.message || "falha no upload seguro"}`);
        }
      }

      // Fallback: tenta ler como texto
      const rawText = await file.text();
      setPlanilhaTexto(rawText.slice(0, 30000));
      setPlanilhaImagem(null);
      setPlanilhaFileUrl(null);
      setShowPlanilhaPreview(true);
      toast.success(`Arquivo ${file.name} importado!`);
    } catch (err: any) {
      console.error("[handleFileUpload] Erro:", err);
      toast.error(`Erro ao processar arquivo: ${err?.message || "formato não suportado"}`);
    } finally {
      setIsExtractingPlanilha(false);
    }
  }, [comprimirImagem]);

  const gerarMut = useMutation({
    mutationFn: async () => {
      setProgresso(["Analisando perfil e histórico de treino..."]);
      
      const totalSessoes = semanas * diasPorSemana;
      
      setProgresso(prev => [...prev, `Projetando periodização para ${semanas} semana(s) (${totalSessoes} treinos)...`]);
      
      try {
        const res = await gerar({
          data: {
            apiKey: geminiApiKey.trim() || undefined,
            programId: programa?.id || "novo-programa",
            studentId: selectedStudentId || assignedStudent?.id || null,
            prompt: prompt.trim(),
            diasPorSemana: diasPorSemana,
            escopoLabel: `${semanas} semanas`,
            metodologiaOverride: metodologia as Methodology,
            escolaOverride: escola,
            historicoSessoes: historicoSessoes,
            cooldownSessoes: cooldownSessoes,
            semanasNovas: semanas,
            planilhaBase: planilhaTexto.trim() || undefined,
            planilhaModo: planilhaTexto.trim() && planilhaModo !== "direto" ? (planilhaModo as "ajustar" | "continuar") : undefined,
            planilhaImagem: planilhaImagem || undefined,
            fileUrl: planilhaFileUrl || undefined,
            setTypes: setTypes.map((t) => ({ id: t.id, label: t.label, fields: t.fields })),
            formatRegistry: customFormats.map((f) => ({
              id: f.id,
              label: f.label,
              base: f.base,
              set_type_id: f.set_type_id,
              field_labels: f.field_labels,
            })),
            kb: kbInicial || (metodologia === "kettlebell_sport" ? {
              escolaMetodologica: (escola !== "auto" ? escola : "fedorenko") as any,
              nivelAtleta: kbNivel,
              disciplina: kbDisciplina,
              pesoCorporalKg: athleteMemory?.pesoKg || null,
              cargas: {
                longCycle: { pesoKettlebellKg: kbPesoSino, repsAtuais10min: 50 },
                snatch: { pesoKettlebellKg: kbPesoSino, repsAtuais10min: 100 },
                jerk: { pesoKettlebellKg: kbPesoSino, repsAtuais10min: 60 },
              },
            } : null),
            wl: wlInicial || (metodologia === "levantamento_peso" ? {
              escolaMetodologica: (escola !== "auto" ? escola : "russa_classica") as any,
              nivelAtleta: (athleteMemory?.nivelAtleta as any) || "intermediario",
              pesoCorporalKg: athleteMemory?.pesoKg || null,
              classificacaoOficial: null,
              pontoFracoIdentificado: null,
              capacidadeRecuperacao: "media",
              suporteTotalDeclarado: false,
              cargas: {},
            } : null),
            tf: tfInicial || (metodologia === "treinamento_funcional" ? {
              escolaMetodologica: (escola !== "auto" ? escola : "boyle") as any,
              nivelAtleta: (athleteMemory?.nivelAtleta as any) || "intermediario",
              objetivo: "condicionamento_geral",
              equipamento: "academia_completa",
              sedentarismoProlongado: false,
              lesoes: [],
            } : null),
            co: coInicial || (metodologia === "corrida" ? {
              escolaMetodologica: (escola !== "auto" ? escola : "daniels") as any,
              nivelAtleta: (athleteMemory?.nivelAtleta as any) || "intermediario",
              distanciaAlvo: "10k",
              volumeSemanalKm: 25,
              frequenciaSemanalAtual: diasPorSemana || 3,
              marcaRecenteDistancia: null,
              marcaRecenteTempo: null,
              dataProvaAlvo: null,
              terreno: "estrada",
              preferenciaAltaFrequencia: false,
              lesoes: [],
            } : null),
            hibrido: (metodologia === "hibrido" || metodologia === "kettlebell_fitness")
              ? {
                  ...(hibridoPayload || {}),
                  sessaoTemplate: hibridoPayload?.sessaoTemplate ?? [],
                  modalidade: metodologia,
                  tituloPrograma: programa?.titulo || (programa as any)?.name || nomePrograma || "Continuar Progressão",
                  numeroSessoes: totalSessoes,
                  diasPorSemana: diasPorSemana,
                  dataInicio: escopoInicial?.dataInicio ?? new Date().toISOString().slice(0, 10),
                  escola: escola !== "auto" ? escola : null,
                  set_types: setTypes.map(t => ({ id: t.id, label: t.label })),
                  custom_formats: customFormats.map(f => ({
                    id: f.id,
                    label: f.label,
                    base: f.base,
                    set_type_id: f.set_type_id,
                    field_labels: f.field_labels
                  }))
                }
              : null,
          },
        });
        setProgresso(prev => [...prev, "Gerando relatório de evolução...", "Finalizando prescrição em bloco!"]);
        return res;
      } catch (e: any) {
        setProgresso([]);
        console.error("Erro na geração de IA:", e);
        throw e;
      }
    },
    onSuccess: (res: any) => {
      // Normalização do contrato de dados Híbrido (sessoes -> days)
      if (res && res.sessoes && !res.days) {
        res.days = res.sessoes.map((s: any, idx: number) => {
          const week_number = res.week_numbers?.[idx] || Math.floor(idx / (diasPorSemana || 1)) + 1;
          
          return {
            name: s.titulo || `Sessão ${idx + 1}`,
            day_label: `S${week_number}D${(idx % (diasPorSemana || 1)) + 1}`,
            week_number,
            exercises: s.blocos.flatMap((b: any) => {
              const ids = Array.isArray(b.exerciciosIds) ? b.exerciciosIds : (Array.isArray(b.exercicios_ids) ? b.exercicios_ids : []);
              return ids.map((id: string) => ({
                id,
                name: res.exercise_names_map?.[id] || b.titulo || "Exercício Prescrito", 
                group_type: "individual",
                group: ""
              }));
            })
          };
        });
      }
      setPrevia(res as AiPrescription | PrescricaoHibrido);
      setTimeout(() => setProgresso([]), 1000);
    },

    onError: (e: any) => {
      setProgresso([]);
      const errorStr = String(e?.message || e || "");
      let msg = errorStr.replace(/^(Error:\s*)+/i, "").trim();

      if (errorStr.includes("POOL_VAZIO")) {
        msg = "O pool de exercícios da biblioteca não atende aos filtros de equipamento/metodologia do molde.";
      } else if (errorStr.includes("AI_NOT_CONFIGURED")) {
        msg = "Chave da IA não configurada. Insira sua chave gratuita do Google Gemini no campo abaixo.";
        setShowApiKeyInput(true);
      } else if (errorStr.includes("AI_UNAUTHORIZED")) {
        msg = "Chave da API não autorizada ou inválida. Por favor, confira sua chave do Google Gemini.";
        setShowApiKeyInput(true);
      } else if (errorStr.includes("AI_NO_CREDITS")) {
        msg = "Créditos da IA esgotados no gateway.";
      } else if (errorStr.includes("AI_EMPTY_CONTENT") || errorStr.includes("AI_INVALID_JSON")) {
        msg = "A IA retornou uma resposta inválida. Tente gerar novamente.";
      } else if (errorStr.includes("AI_SCHEMA_MISMATCH")) {
        msg = "A estrutura do treino gerado pela IA é incompatível com o molde.";
      } else if (errorStr.includes("400") || errorStr.includes("token") || errorStr.includes("AI_PAYLOAD_TOO_LARGE")) {
        msg = "Histórico muito longo. Tente reduzir o número de semanas ou o histórico analisado.";
      }

      if (!msg || msg === "undefined") {
        msg = "Não foi possível gerar a prescrição.";
      }

      toast.error("Falha na Prescrição", {
        description: msg,
      });
    }
  });

  const salvarMut = useMutation({
    mutationFn: async (dadosOverride?: AiPrescription | PrescricaoHibrido | null) => {
      const dadosParaSalvar = dadosOverride || previa;
      if (!dadosParaSalvar) throw new Error("Nada para salvar");

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Usuário não autenticado");

      let targetProgramId = programa?.id;

      // Se não há programa existente, cria um novo em pt_programs
      if (!targetProgramId) {
        const TEMPLATE_STUDENT_ID = "00000000-0000-0000-0000-000000000001";
        const finalStudentId = selectedStudentId || TEMPLATE_STUDENT_ID;

        // Se for aluno do Studio, garante upsert preventivo em pt_students para respeitar a foreign key
        if (selectedStudentId) {
          const st = studioStudents.find((s) => s.id === selectedStudentId);
          if (st) {
            await supabase.from("pt_students" as never).upsert({
              id: st.id,
              user_id: userId,
              name: st.name,
              email: st.email,
              status: "active",
              notes: "[Aluno Studio]",
            } as never, { onConflict: "id" } as never);
          }
        }

        const progTitle =
          nomePrograma.trim() ||
          planilhaArquivoNome?.replace(/\.[^/.]+$/, "") ||
          `Treino IA - ${METHODOLOGY_LABEL[metodologia as Methodology] || "Musculação"}`;

        const isStudioStudent =
          alunoTipo === "studio" ||
          !!studioStudentId ||
          (selectedStudentId ? !!studioStudents.find((s) => s.id === selectedStudentId) : false);

        const newProgPayload: any = {
          user_id: userId,
          pt_student_id: finalStudentId,
          name: progTitle,
          category: "hypertrophy",
          level: "intermediate",
          training_type: metodologia || "musculacao",
          start_date: new Date().toISOString().slice(0, 10),
          show_to_student: true,
          ai_prompt: prompt.trim() || (planilhaTexto ? `Planilha: ${planilhaArquivoNome}` : null),
          ai_generated_at: new Date().toISOString(),
        };

        const { data: createdProg, error: errProg } = await supabase
          .from("pt_programs" as never)
          .insert(newProgPayload as never)
          .select("id")
          .single();
        if (errProg) throw new Error(`Falha ao criar rotina: ${errProg.message}`);
        targetProgramId = (createdProg as any).id as string;
      }

      // Obtém os dias gerados
      const diasPrevia: AiDay[] = (dadosParaSalvar as any).days || [];
      if (!diasPrevia.length) throw new Error("A prescrição não contém dias de treino estruturados");

      // Descobre a ordem inicial
      const { data: ultimosDias } = await supabase
        .from("pt_training_days" as never)
        .select("sort_order")
        .eq("program_id" as never, targetProgramId)
        .order("sort_order" as never, { ascending: false })
        .limit(1);

      const baseOrder = ((ultimosDias as any)?.[0]?.sort_order ?? -1) + 1;

      // Se a IA gerou apenas semana-modelo mas o programa tem semanas > 1, expande
      const hasMultiWeek = diasPrevia.some((d) => (d.week_number || 1) > 1);
      const itensParaSalvar: Array<{ dia: AiDay; labelSuffix: string }> = [];

      if (!hasMultiWeek && semanas > 1) {
        for (let w = 1; w <= semanas; w++) {
          for (const dia of diasPrevia) {
            itensParaSalvar.push({
              dia,
              labelSuffix: ` (Sem. ${w})`,
            });
          }
        }
      } else {
        for (const dia of diasPrevia) {
          itensParaSalvar.push({ dia, labelSuffix: "" });
        }
      }

      // Carrega catálogo de exercícios da biblioteca para correlacionar vídeos e mídias
      const { data: libraryExercises } = await supabase
        .from("pt_exercises_library" as never)
        .select("id, name, media_url, media_type, thumbnail_url");

      const libraryMap = new Map<string, any>();
      (libraryExercises || []).forEach((item: any) => {
        if (!item?.name) return;
        const key = item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        libraryMap.set(key, item);
      });

      for (const [i, item] of itensParaSalvar.entries()) {
        const dia = item.dia;
        const dayName = `${dia.name || `Treino ${i + 1}`}${item.labelSuffix}`;
        const dayLabel = dia.day_label || `T${i + 1}`;

        const { data: insertedDay, error: dErr } = await supabase
          .from("pt_training_days" as never)
          .insert({
            user_id: userId,
            program_id: targetProgramId,
            name: dayName,
            day_label: dayLabel,
            description: dia.description ?? null,
            sort_order: baseOrder + i,
          } as never)
          .select("id")
          .single();
        if (dErr) throw new Error(dErr.message);
        const dayId = (insertedDay as any).id as string;

        if (dia.exercises?.length) {
          const rows = dia.exercises.map((ex, idx) => {
            const cleanExName = ex.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            let matched = libraryMap.get(cleanExName);

            // Se não deu match exato, busca por correspondência de substring
            if (!matched) {
              for (const [libKey, libItem] of libraryMap.entries()) {
                if (cleanExName.length > 3 && (libKey.includes(cleanExName) || cleanExName.includes(libKey))) {
                  matched = libItem;
                  break;
                }
              }
            }

            return {
              user_id: userId,
              training_day_id: dayId,
              exercise_library_id: matched?.id ?? null,
              media_url: matched?.media_url ?? null,
              media_type: matched?.media_type ?? (matched?.media_url ? "video" : null),
              thumbnail_url: matched?.thumbnail_url ?? null,
              name: matched?.name ?? ex.name,
              series_type: (ex as any).series_type ?? "reps_load",
              sets_reps: ex.sets_reps ?? null,
              load: ex.load ?? null,
              rest_seconds: ex.rest_seconds ?? null,
              observations: ex.observations ?? null,
              sort_order: idx,
            };
          });

          const { error: exErr } = await supabase
            .from("pt_training_exercises" as never)
            .insert(rows as never);
          if (exErr) throw new Error(exErr.message);
        }
      }

      // Salva prompt no pt_programs se já existia
      if (programa?.id) {
        await supabase
          .from("pt_programs" as never)
          .update({
            ai_prompt: prompt.trim() || (planilhaTexto ? `Planilha: ${planilhaArquivoNome}` : null),
            ai_generated_at: new Date().toISOString(),
          } as never)
          .eq("id", programa.id);
      }

      return itensParaSalvar.length;
    },
    onSuccess: (n) => {
      toast.success(`${n} treino(s) salvo(s) na rotina com sucesso!`);
      qc.invalidateQueries({ queryKey: ["pt-programs"] });
      qc.invalidateQueries({ queryKey: ["pt-training-days"] });
      qc.invalidateQueries({ queryKey: ["studio-student-programs"] });
      if (selectedStudentId) {
        qc.invalidateQueries({ queryKey: ["pt-programs", selectedStudentId] });
      }
      if (studentId) {
        qc.invalidateQueries({ queryKey: ["pt-programs", studentId] });
      }
      if (studioStudentId) {
        qc.invalidateQueries({ queryKey: ["pt-programs", studioStudentId] });
      }
      limpar();
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e?.message ?? "Falha ao adicionar os treinos"),
  });

  const baixarTxt = useCallback(async () => {
    if (!previa) return;

    let txt = `PROGRAMA DE TREINAMENTO: ${programa?.titulo || "SEM TÍTULO"}\n`;
    txt += `MODALIDADE: ${METHODOLOGY_LABEL[metodologia as Methodology] || metodologia}\n`;
    txt += `DATA DE GERAÇÃO: ${new Date().toLocaleDateString("pt-BR")}\n`;
    txt += `================================================================================\n\n`;

    if (isPrescricaoHibrido(previa)) {
      // Híbrido
      const template = hibridoPayload?.sessaoTemplate ?? [];
      const labels = new Map(template.map((b) => [b.chave, b.titulo || b.formato]));

      for (let i = 0; i < previa.sessoes.length; i++) {
        const sessao = previa.sessoes[i];
        txt += `SESSÃO ${i + 1}\n`;
        txt += `--------------------------------------------------------------------------------\n`;

        for (const bloco of sessao.blocos) {
          const titulo = labels.get(bloco.chave) || bloco.chave;
          txt += `[${titulo.toUpperCase()}]\n`;
          
          if (bloco.exerciciosIds.length > 0) {
            // Como temos apenas os IDs no preview híbrido antes de salvar, a IA retorna nomes nos logs de progresso ou podemos buscar. 
            // Mas no preview atual da UI para Híbrido, exibimos apenas contagem.
            // Para o TXT ser útil, vamos listar o que temos.
            txt += `Exercícios selecionados (${bloco.exerciciosIds.length})\n`;
            bloco.exerciciosIds.forEach((id, idx) => {
               txt += `${idx + 1}. ID: ${id}\n`;
            });
          } else {
            txt += `Nenhum exercício selecionado.\n`;
          }
          txt += `\n`;
        }
        txt += `\n`;
      }
    } else {
      // Musculação / KB Sport / WL / Funcional / Corrida
      const p = previa as AiPrescription;
      for (const dia of p.days) {
        txt += `${dia.name || "TREINO"} ${dia.day_label ? `(${dia.day_label})` : ""}\n`;
        if (dia.description) txt += `DESCRIÇÃO: ${dia.description}\n`;
        txt += `--------------------------------------------------------------------------------\n`;

        dia.exercises.forEach((e, i) => {
          let linha = `${i + 1}. ${e.name}`;
          if (e.group_type !== "individual" && e.group) {
            linha += ` [${COMBINACAO_LABEL[e.group_type] || e.group_type} ${e.group}]`;
          }
          txt += `${linha}\n`;
          
          const detalhes = [];
          if (e.sets_reps) detalhes.push(`Séries/Reps: ${e.sets_reps}`);
          if (e.load) detalhes.push(`Carga: ${e.load}`);
          if (e.rest_seconds) detalhes.push(`Descanso: ${e.rest_seconds}s`);
          
          if (detalhes.length > 0) {
            txt += `   ${detalhes.join(" | ")}\n`;
          }
          
          if (e.observations) {
            txt += `   OBS: ${e.observations}\n`;
          }
          txt += `\n`;
        });
        txt += `\n`;
      }
    }

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `programa-${programa?.titulo?.toLowerCase().replace(/\s+/g, "-") || "treino"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Arquivo .txt gerado com sucesso");
  }, [previa, programa, metodologia, hibridoPayload]);

  const podeGerar = useMemo(

    () => !gerarMut.isPending,
    [gerarMut.isPending],
  );

  return (
    <Dialog
      open={isOpen !== undefined ? isOpen : !!programa}
      onOpenChange={(o) => {
        if (!o) limpar();
        onOpenChange(o);
      }}
    >
      <DialogContent className="flex max-h-[90dvh] max-w-2xl flex-col gap-0 p-0">
        <DialogHeader className="border-b border-border/60 px-5 py-4 text-left sm:px-6">
          <DialogTitle className="flex items-center gap-2 text-base">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            Prescrever com IA & Planilha
            <Badge variant="secondary" className="ml-1 text-[10px] uppercase tracking-wide">
              {METHODOLOGY_LABEL[metodologia as Methodology] || metodologia} - {escola === "auto" ? "IA" : escola}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-xs">
            {programa?.titulo
              ? `Prescrevendo para "${programa.titulo}".`
              : "Crie ou importe treinos para alunos do Studio ou Personal Trainer com IA e Planilhas."}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          {/* Informações da Rotina sendo Continuada */}
          {programa?.id && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Continuando Prescrição da Rotina
                </span>
                <Badge variant="outline" className="text-[10px] font-semibold border-primary/30 text-primary">
                  {existingPtDays.length} {existingPtDays.length === 1 ? "sessão cadastrada" : "sessões cadastradas"}
                </Badge>
              </div>
              <p className="text-sm font-bold text-foreground">{nomePrograma}</p>
              {existingPtDays.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Sessões Cadastradas (a IA continuará a periodização adicionando os próximos treinos):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {existingPtDays.map((d, i) => (
                      <span
                        key={d.id}
                        className="text-[11px] bg-background/90 border border-border/70 px-2 py-0.5 rounded-md font-medium text-foreground flex items-center gap-1"
                      >
                        <span className="font-semibold text-primary">{d.day_label || `T${i + 1}`}:</span> {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Seletor de Programa / Aluno se não veio pré-definido */}
          {!programa?.id && (
            <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Nome da Rotina / Programa
                  </label>
                  <input
                    type="text"
                    value={nomePrograma}
                    onChange={(e) => setNomePrograma(e.target.value)}
                    placeholder="Ex: Hipertrofia A/B/C/D"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Destino da Prescrição
                  </label>
                  <div className="flex gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant={alunoTipo === "studio" ? "default" : "outline"}
                      className="text-xs flex-1 h-9"
                      onClick={() => {
                        setAlunoTipo("studio");
                        if (studioStudentId) setSelectedStudentId(studioStudentId);
                        else setSelectedStudentId(null);
                      }}
                    >
                      Aluno Studio
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={alunoTipo === "pt" ? "default" : "outline"}
                      className="text-xs flex-1 h-9"
                      onClick={() => {
                        setAlunoTipo("pt");
                        if (studentId) setSelectedStudentId(studentId);
                        else setSelectedStudentId(null);
                      }}
                    >
                      Aluno Personal
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={alunoTipo === "none" ? "default" : "outline"}
                      className="text-xs h-9 px-2.5"
                      onClick={() => { setAlunoTipo("none"); setSelectedStudentId(null); }}
                    >
                      Modelo
                    </Button>
                  </div>
                </div>
              </div>

              {alunoTipo !== "none" && (
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {alunoTipo === "studio" ? "Selecione o Aluno do Studio" : "Selecione o Aluno de Personal Trainer"}
                  </label>
                  <Select
                    value={selectedStudentId || "none"}
                    onValueChange={(v) => setSelectedStudentId(v === "none" ? null : v)}
                  >
                    <SelectTrigger className="h-9 w-full bg-background text-xs">
                      <SelectValue placeholder="Escolha um aluno cadastrado..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum aluno selecionado</SelectItem>
                      {(alunoTipo === "studio" ? studioStudents : ptStudents).map((st) => (
                        <SelectItem key={st.id} value={st.id}>
                          {st.name} {st.email ? `(${st.email})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Rotina alvo", value: programa?.titulo ?? nomePrograma },
              { label: "Escola Metodológica", value: escola === "auto" ? "Automático" : (ESCOLAS_DISPONIVEIS[metodologia]?.find(e => e.value === escola)?.label ?? escola) },
              {
                label: "Duração",
                value: `${semanas} semana(s)`,
              },
              {
                label: "Dias/semana",
                value: `${diasPorSemana}`,
              },
            ].map((k) => (
              <div
                key={k.label}
                className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
              >
                <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {k.label}
                </p>
                <p title={k.value} className="mt-0.5 truncate text-sm font-medium tabular-nums">
                  {k.value}
                </p>
              </div>
            ))}
          </div>

          {/* Memória Persistente do Atleta (Context Engine) */}
          {assignedStudent && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    Memória IA Ativa: <span className="text-primary">{assignedStudent.nome}</span>
                  </span>
                </div>
                <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
                  Context Engine V3
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                {athleteMemory?.lesoes && athleteMemory.lesoes.length > 0 ? (
                  <span className="text-amber-500 font-medium">
                    ⚠️ {athleteMemory.lesoes.length} restrições protegidas ({athleteMemory.lesoes.slice(0, 2).join(", ")}{athleteMemory.lesoes.length > 2 ? "..." : ""})
                  </span>
                ) : (
                  <span>Nenhuma restrição articular</span>
                )}
                <span>•</span>
                <span>{athleteMemory?.equipamentos?.length || 0} equipamentos disponíveis</span>
                <span>•</span>
                <span>Nível: <strong className="text-foreground capitalize">{athleteMemory?.nivelAtleta || "intermediário"}</strong></span>
              </div>
            </div>
          )}

          {/* SEÇÃO DE UPLOAD DE PLANILHA / TREINO DO ALUNO (DESTAQUE MÁXIMO) */}
          <div className="rounded-xl border-2 border-primary/40 bg-card/90 shadow-sm p-4 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    Subir Planilha / Treino do Aluno
                    <Badge variant="outline" className="text-[10px] px-2 py-0 uppercase bg-primary/10 text-primary border-primary/30 font-medium">
                      Recomendado
                    </Badge>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Suba Excel (.xlsx), CSV, TXT, PDF ou Foto/Print da ficha. A IA analisa tudo automaticamente.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="upload-planilha-input"
                  className="hidden"
                  accept=".txt,.csv,.xlsx,.xls,.pdf,image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                    e.target.value = "";
                  }}
                  disabled={gerarMut.isPending || isExtractingPlanilha}
                />
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  disabled={gerarMut.isPending || isExtractingPlanilha}
                  onClick={() => document.getElementById("upload-planilha-input")?.click()}
                  className="h-9 gap-2 text-xs font-semibold px-4 shadow-sm w-full sm:w-auto"
                >
                  {isExtractingPlanilha ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Extraindo...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      <span>{planilhaArquivoNome ? "Trocar Arquivo" : "Subir Planilha / Foto"}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {planilhaArquivoNome && (
              <div className="space-y-2.5 pt-2 border-t border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="truncate max-w-[220px] sm:max-w-[320px]">{planilhaArquivoNome}</span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                      {planilhaImagem ? "Multimodal / Imagem" : "Texto Extraído"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPlanilhaPreview(!showPlanilhaPreview)}
                      className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {showPlanilhaPreview ? "Ocultar" : "Ver / Editar Conteúdo"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPlanilhaTexto("");
                        setPlanilhaArquivoNome(null);
                        setPlanilhaImagem(null);
                        setShowPlanilhaPreview(false);
                      }}
                      className="h-7 px-2.5 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Remover
                    </Button>
                  </div>
                </div>

                {/* SELETOR DE MODO DE OPERAÇÃO DA PLANILHA */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPlanilhaModo("direto");
                      if (planilhaTexto.trim()) {
                        const parsed = parsePlanilhaParaTreino(planilhaTexto, planilhaArquivoNome || nomePrograma);
                        if (parsed.days.length > 0) setPrevia(parsed);
                      }
                    }}
                    className={`text-left p-3 rounded-lg border text-xs transition-all ${
                      planilhaModo === "direto"
                        ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs ring-1 ring-primary/30"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1.5">💾 Salvar Direto</span>
                      {planilhaModo === "direto" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-[11px] leading-relaxed font-normal text-muted-foreground">
                      Importa os treinos exatamente como estão na planilha, sem modificações e sem IA.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlanilhaModo("ajustar")}
                    className={`text-left p-3 rounded-lg border text-xs transition-all ${
                      planilhaModo === "ajustar"
                        ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs ring-1 ring-primary/30"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1.5">🔄 Reorganizar IA</span>
                      {planilhaModo === "ajustar" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-[11px] leading-relaxed font-normal text-muted-foreground">
                      Reformule os treinos existentes corrigindo volume, exercícios, ordem e descansos.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlanilhaModo("continuar")}
                    className={`text-left p-3 rounded-lg border text-xs transition-all ${
                      planilhaModo === "continuar"
                        ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs ring-1 ring-primary/30"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1.5">📈 Continuar IA</span>
                      {planilhaModo === "continuar" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-[11px] leading-relaxed font-normal text-muted-foreground">
                      Usa a planilha como histórico prévio e projeta as próximas semanas com IA.
                    </p>
                  </button>
                </div>

                {/* ÁREA EDITÁVEL DO CONTEÚDO EXTRAÍDO */}
                {showPlanilhaPreview && (
                  <div className="space-y-1.5 pt-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Conteúdo da planilha extraído (editável):</span>
                      <span className="tabular-nums">{planilhaTexto.length} caracteres</span>
                    </div>
                    <Textarea
                      value={planilhaTexto}
                      onChange={(e) => setPlanilhaTexto(e.target.value)}
                      rows={6}
                      disabled={gerarMut.isPending}
                      className="font-mono text-xs leading-relaxed resize-y bg-slate-900 border-slate-800"
                      placeholder="Cole ou edite os dados do treino aqui..."
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* INSTRUÇÕES DO TREINADOR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="prompt-ia"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Instruções & Orientações para a IA
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
                >
                  <Key className="h-3 w-3" />
                  {geminiApiKey ? "Chave Gemini Ativa" : "Configurar Chave Gemini"}
                </button>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {prompt.trim().length}/4000
                </span>
              </div>
            </div>

            {/* PAINEL DE CONFIGURAÇÃO DE CHAVE GEMINI BYOK */}
            {showApiKeyInput && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Key className="h-3.5 w-3.5 text-primary" />
                      <span>Chave do Google Gemini API (BYOK)</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Sua chave fica salva no seu navegador e permite prescrever treinos sem limites diretamente pelo Gemini 2.5 Flash oficial.
                    </p>
                  </div>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-primary hover:underline font-medium shrink-0"
                  >
                    Obter Chave Grátis ↗
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="Cole sua chave AIzaSy..."
                    className="flex-1 h-8 rounded-lg border border-border bg-background px-2.5 text-xs font-mono"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    onClick={() => salvarApiKey(tempApiKey)}
                    className="h-8 px-3 text-xs"
                  >
                    Salvar
                  </Button>
                  {geminiApiKey && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setTempApiKey("");
                        salvarApiKey("");
                      }}
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                      title="Remover Chave"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {EXEMPLOS.map((ex) => (
                <Button
                  key={ex.chip}
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={gerarMut.isPending || salvarMut.isPending}
                  onClick={() => setPrompt(ex.texto)}
                  className="h-7 rounded-full px-3 text-[11px] font-medium"
                >
                  {ex.chip}
                </Button>
              ))}
            </div>
            <Textarea
              id="prompt-ia"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                planilhaArquivoNome
                  ? "Explique para a IA o que você quer modificar, retirar, ajustar ou dar ênfase a partir da planilha subida..."
                  : PLACEHOLDER
              }
              rows={4}
              maxLength={4000}
              disabled={gerarMut.isPending || salvarMut.isPending}
              className="resize-y text-sm leading-relaxed transition-colors duration-200"
            />

            {planilhaModo === "direto" && (planilhaArquivoNome || planilhaTexto.trim()) ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (!planilhaTexto.trim()) {
                      toast.error("Nenhum texto de treino encontrado. Cole ou suba uma planilha.");
                      return;
                    }
                    const parsed = parsePlanilhaParaTreino(planilhaTexto, planilhaArquivoNome || nomePrograma);
                    if (!parsed.days.length) {
                      toast.error("Não foram encontrados exercícios no texto da planilha.");
                      return;
                    }
                    setPrevia(parsed);
                    toast.success(`${parsed.days.length} sessão/sessões estruturada(s) para pré-visualização!`);
                  }}
                  disabled={salvarMut.isPending || isExtractingPlanilha}
                  className="flex-1 gap-2 h-10 text-xs font-semibold"
                >
                  <Eye className="h-4 w-4" />
                  Pré-visualizar Treino da Planilha
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    if (!planilhaTexto.trim()) {
                      toast.error("Nenhum texto de treino encontrado.");
                      return;
                    }
                    let dadosParaSalvar = previa;
                    if (!dadosParaSalvar || !(dadosParaSalvar as any).days?.length) {
                      const parsed = parsePlanilhaParaTreino(planilhaTexto, planilhaArquivoNome || nomePrograma);
                      if (!parsed.days.length) {
                        toast.error("Não foram identificados exercícios na planilha.");
                        return;
                      }
                      setPrevia(parsed);
                      dadosParaSalvar = parsed;
                    }
                    salvarMut.mutate(dadosParaSalvar);
                  }}
                  disabled={salvarMut.isPending || isExtractingPlanilha}
                  className="flex-1 gap-2 h-10 font-semibold"
                >
                  {salvarMut.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando na rotina...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar Planilha Direto no Banco
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => gerarMut.mutate()}
                disabled={!podeGerar}
                className="w-full gap-2 transition-all duration-200 h-10 font-semibold"
              >
                {gerarMut.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gerando {semanas} semana(s)...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {planilhaArquivoNome && planilhaModo === "ajustar"
                      ? "Reorganizar & Ajustar Treino com IA"
                      : `Gerar Periodização com IA (${semanas} sem)`}
                  </>
                )}
              </Button>
            )}
          </div>

          {/* PARÂMETROS AVANÇADOS / ESTRUTURA */}
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="group flex w-full items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3.5 py-2.5 text-left text-xs font-medium transition-colors duration-200 hover:bg-muted/40">
              <Settings2 className="h-4 w-4 text-primary" />
              <span>
                Parâmetros Avançados & Linha Metodológica ({METHODOLOGY_LABEL[metodologia as Methodology] || metodologia} · {semanas} sem · {diasPorSemana} dias/sem)
              </span>
              <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-3">
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-2">
                {(metodologia === "hibrido" || metodologia === "kettlebell_fitness") && moldesHistoricos.length > 0 && (
                  <div className="col-span-full space-y-2 border-b border-border/40 pb-4">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Recuperação de Estrutura (Molde)
                    </label>
                    <Select value={moldeSelecionado} onValueChange={setMoldeSelecionado} disabled={gerarMut.isPending}>
                      <SelectTrigger className="h-9 bg-background border-primary/30">
                        <SelectValue placeholder="Escolha qual estrutura repetir..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">
                          {escopoInicial?.hibrido?.sessaoTemplate?.length ? "Manter molde atual" : "Selecionar molde histórico..."}
                        </SelectItem>
                        {moldesHistoricos.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.titulo} ({m.blocks.length} blocos)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground italic">
                      * A IA usará esta estrutura para prescrever novos exercícios.
                    </p>
                  </div>
                )}

                <div className="col-span-full space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Base Técnica (Motor)
                      </label>
                      <Select value={metodologia} onValueChange={setMetodologia} disabled={gerarMut.isPending}>
                        <SelectTrigger className="h-9 border-primary/20 bg-background/50">
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="musculacao">Musculação</SelectItem>
                          <SelectItem value="hibrido">Treinamento Híbrido</SelectItem>
                          <SelectItem value="kettlebell_fitness">Kettlebell Fitness</SelectItem>
                          <SelectItem value="kettlebell_sport">Kettlebell Sport</SelectItem>
                          <SelectItem value="levantamento_peso">LPO</SelectItem>
                          <SelectItem value="treinamento_funcional">Funcional</SelectItem>
                          <SelectItem value="corrida">Corrida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Escola Metodológica
                      </label>
                      <Select value={escola} onValueChange={setEscola} disabled={gerarMut.isPending}>
                        <SelectTrigger className="h-9 border-primary/20 bg-background/50">
                          <SelectValue placeholder="Padrão do Sistema" />
                        </SelectTrigger>
                        <SelectContent>
                          {(ESCOLAS_DISPONIVEIS[metodologia] || [{ value: "auto", label: "Automático" }]).map((e) => (
                            <SelectItem key={e.value} value={e.value}>
                              {e.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {metodologia === "kettlebell_sport" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5 animate-in fade-in-50 duration-200">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Disciplina
                        </label>
                        <Select value={kbDisciplina} onValueChange={(v: any) => setKbDisciplina(v)} disabled={gerarMut.isPending}>
                          <SelectTrigger className="h-8 text-xs bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="long_cycle">Long Cycle (Ciclo Longo)</SelectItem>
                            <SelectItem value="biathlon">Biathlon (Jerk + Snatch)</SelectItem>
                            <SelectItem value="ambas">Ambas / Misto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Peso do Sino Base
                        </label>
                        <Select value={String(kbPesoSino)} onValueChange={(v) => setKbPesoSino(Number(v))} disabled={gerarMut.isPending}>
                          <SelectTrigger className="h-8 text-xs bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12 kg (Iniciação)</SelectItem>
                            <SelectItem value="16">16 kg (Amarelo / Base)</SelectItem>
                            <SelectItem value="20">20 kg (Roxo)</SelectItem>
                            <SelectItem value="24">24 kg (Verde / Profissional)</SelectItem>
                            <SelectItem value="28">28 kg (Laranja)</SelectItem>
                            <SelectItem value="32">32 kg (Vermelho / Elite)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Nível no Esporte
                        </label>
                        <Select value={kbNivel} onValueChange={(v: any) => setKbNivel(v)} disabled={gerarMut.isPending}>
                          <SelectTrigger className="h-8 text-xs bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="iniciante">Iniciante</SelectItem>
                            <SelectItem value="intermediario">Intermediário</SelectItem>
                            <SelectItem value="avancado">Avançado</SelectItem>
                            <SelectItem value="elite">Elite / CMS / MS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Semanas (Volume)
                      </label>
                      <div className="flex h-9 items-center justify-between rounded-md border bg-background px-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setSemanas(Math.max(1, semanas - 1))}
                          disabled={gerarMut.isPending || semanas <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium tabular-nums">{semanas}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setSemanas(Math.min(12, semanas + 1))}
                          disabled={gerarMut.isPending || semanas >= 12}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Frequência (Dias/Sem)
                      </label>
                      <div className="flex h-9 items-center justify-between rounded-md border bg-background px-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setDiasPorSemana(Math.max(1, diasPorSemana - 1))}
                          disabled={gerarMut.isPending || diasPorSemana <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium tabular-nums">{diasPorSemana}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setDiasPorSemana(Math.min(7, diasPorSemana + 1))}
                          disabled={gerarMut.isPending || diasPorSemana >= 7}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Histórico considerado (sessões)
                    </label>
                    <div className="flex h-9 items-center justify-between rounded-md border bg-background px-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setHistoricoSessoes(Math.max(0, historicoSessoes - 1))}
                        disabled={gerarMut.isPending || historicoSessoes <= 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium tabular-nums">
                        {historicoSessoes === 0 ? "Sem histórico" : historicoSessoes}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setHistoricoSessoes(Math.min(12, historicoSessoes + 1))}
                        disabled={gerarMut.isPending || historicoSessoes >= 12}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Reduza se aparecer o aviso de histórico muito longo.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Bloqueio de repetição (Cooldown)
                    </label>
                    <div className="flex h-9 items-center justify-between rounded-md border bg-background px-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setCooldownSessoes(Math.max(0, cooldownSessoes - 1))}
                        disabled={gerarMut.isPending || cooldownSessoes <= 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium tabular-nums">
                        {cooldownSessoes === 0 ? "Sem bloqueio" : `${cooldownSessoes} sessões`}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setCooldownSessoes(Math.min(10, cooldownSessoes + 1))}
                        disabled={gerarMut.isPending || cooldownSessoes >= 10}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Evita repetir exercícios usados nas últimas N sessões.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border/60 p-3 bg-muted/20">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Como usar e limitações:</p>
                <ul className="space-y-1">
                  {LIMITACOES.map((l) => (
                    <li
                      key={l}
                      className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
                    >
                      <span aria-hidden className="text-primary">•</span>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {gerarMut.isPending && progresso.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Processando evolução...
                </div>
                <div className="space-y-1">
                  {progresso.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground animate-in fade-in slide-in-from-left-1">
                      <div className="h-1 w-1 rounded-full bg-primary/40" />
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {previa ? (
            <div className="space-y-4">
              {!programa?.id && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      Destino do Treino ao Salvar:
                    </span>
                    <div className="flex gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        variant={alunoTipo === "studio" ? "default" : "outline"}
                        className="text-xs h-7 px-2.5"
                        onClick={() => {
                          setAlunoTipo("studio");
                          if (studioStudentId) setSelectedStudentId(studioStudentId);
                          else setSelectedStudentId(null);
                        }}
                      >
                        Aluno Studio
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={alunoTipo === "pt" ? "default" : "outline"}
                        className="text-xs h-7 px-2.5"
                        onClick={() => {
                          setAlunoTipo("pt");
                          if (studentId) setSelectedStudentId(studentId);
                          else setSelectedStudentId(null);
                        }}
                      >
                        Aluno Personal
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={alunoTipo === "none" ? "default" : "outline"}
                        className="text-xs h-7 px-2.5"
                        onClick={() => { setAlunoTipo("none"); setSelectedStudentId(null); }}
                      >
                        Modelo / Acervo
                      </Button>
                    </div>
                  </div>

                  {alunoTipo !== "none" ? (
                    <Select
                      value={selectedStudentId || "none"}
                      onValueChange={(v) => setSelectedStudentId(v === "none" ? null : v)}
                    >
                      <SelectTrigger className="h-8 w-full bg-background text-xs">
                        <SelectValue placeholder={alunoTipo === "studio" ? "Selecione o aluno do Studio..." : "Selecione o aluno de Personal..."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Salvar como Modelo Geral (Sem aluno vinculado)</SelectItem>
                        {(alunoTipo === "studio" ? studioStudents : ptStudents).map((st) => (
                          <SelectItem key={st.id} value={st.id}>
                            {st.name} {st.email ? `(${st.email})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-[11px] text-muted-foreground italic">
                      O treino será salvo no Acervo Geral como Modelo para ser atribuído a alunos posteriormente.
                    </p>
                  )}
                </div>
              )}
              {previa.notes && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <h5 className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
                    <Sparkles className="h-4 w-4" />
                    Estratégia de Periodização do Bloco
                  </h5>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {previa.notes}
                  </p>
                </div>
              )}

              {isPrescricaoHibrido(previa) ? (
                <HibridoPreview
                  prescricao={previa}
                  template={hibridoPayload?.sessaoTemplate ?? []}
                />
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold tracking-tight">
                      Sessões Geradas ({previa.days.length})
                    </h5>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      Modo: Evolução em Bloco
                    </Badge>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {previa.days.map((dia, i) => (
                      <DiaCard key={i} dia={dia} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            !gerarMut.isPending && (
              <div className="rounded-xl border border-dashed border-border/70 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhuma prescrição gerada ainda.
                </p>
                <p className="mt-1 text-xs text-muted-foreground/80">
                  Descreva a divisão desejada e clique em “Gerar periodização em bloco”.
                </p>
              </div>
            )
          )}
        </div>

        <DialogFooter className="gap-2 border-t border-border/60 px-5 py-4 sm:px-6">
          <Button
            variant="ghost"
            onClick={() => {
              limpar();
              onOpenChange(false);
            }}
            disabled={salvarMut.isPending}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          {previa && (
            <Button
              variant="outline"
              onClick={baixarTxt}
              className="w-full gap-2 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Baixar .txt
            </Button>
          )}
          <Button
            onClick={() => salvarMut.mutate()}
            disabled={!previa || salvarMut.isPending}
            className="w-full gap-2 sm:w-auto"
          >
            {salvarMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {salvarMut.isPending ? "Adicionando..." : "Adicionar treinos à rotina"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PrescreverIaDialog;
