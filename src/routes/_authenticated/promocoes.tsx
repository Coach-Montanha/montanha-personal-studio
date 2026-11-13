import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Gift,
  Trophy,
  Flame,
  Award,
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Coins,
  Users,
  MessageCircle,
  ShoppingBag,
  Clock,
  ChevronRight,
  Filter,
  Check,
  Send,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useScopeFilter } from "@/hooks/use-scope-filter";
import { matchesSearchTerms } from "@/lib/search-utils";

import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/promocoes")({
  head: () => ({
    meta: [{ title: "Promoções & Pontos — Montanha Personal Studio" }],
  }),
  component: PromocoesPage,
});

// Tipos locais para promoções e gamificação
interface Reward {
  id: string;
  title: string;
  pointsCost: number;
  category: "brinde" | "desconto" | "servico" | "suplemento";
  description: string;
  stock: number;
  isActive: boolean;
}

interface PointBonus {
  studentId: string;
  points: number;
  reason: string;
  date: string;
}

interface Redemption {
  id: string;
  studentId: string;
  studentName: string;
  rewardTitle: string;
  pointsSpent: number;
  redeemedAt: string;
  status: "pendente" | "entregue";
}

const DEFAULT_REWARDS: Reward[] = [
  {
    id: "rew-1",
    title: "Camisa Oficial Montanha Team",
    pointsCost: 150,
    category: "brinde",
    description: "Camisa dry-fit de alta performance com a estampa oficial do Studio.",
    stock: 12,
    isActive: true,
  },
  {
    id: "rew-2",
    title: "Coqueteleira Premium Pro",
    pointsCost: 80,
    category: "brinde",
    description: "Shaker anti-vazamento 700ml com grade misturadora.",
    stock: 25,
    isActive: true,
  },
  {
    id: "rew-3",
    title: "10% de Desconto na Próxima Mensalidade",
    pointsCost: 200,
    category: "desconto",
    description: "Cupom de 10% aplicado automaticamente na sua renovação do plano.",
    stock: 99,
    isActive: true,
  },
  {
    id: "rew-4",
    title: "Avaliação Física Completa / Bioimpedância",
    pointsCost: 120,
    category: "servico",
    description: "Sessão extra de bioimpedância e análise de composição corporal.",
    stock: 30,
    isActive: true,
  },
  {
    id: "rew-5",
    title: "Dose Dupla Whey + Creatina no Lounge",
    pointsCost: 40,
    category: "suplemento",
    description: "Shake gelado pós-treino preparado na hora no balcão do studio.",
    stock: 50,
    isActive: true,
  },
];

const LS_REWARDS_KEY = "montanha:promocoes:rewards";
const LS_BONUS_KEY = "montanha:promocoes:bonuses";
const LS_REDEMPTIONS_KEY = "montanha:promocoes:redemptions";
const LS_MANUAL_CHECKINS_KEY = "montanha:promocoes:manual_checkins";

export function PromocoesPage() {
  const queryClient = useQueryClient();
  const { scopeId, scopeKey, ready } = useScopeFilter();

  // Estados locais
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "meta_batida" | "em_andamento">("all");

  // Modais
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const [selectedStudentForBonus, setSelectedStudentForBonus] = useState<{ id: string; name: string } | null>(null);
  const [bonusPoints, setBonusPoints] = useState<number>(5);
  const [bonusReason, setBonusReason] = useState("");

  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [newRewardTitle, setNewRewardTitle] = useState("");
  const [newRewardCost, setNewRewardCost] = useState(100);
  const [newRewardCategory, setNewRewardCategory] = useState<Reward["category"]>("brinde");
  const [newRewardDesc, setNewRewardDesc] = useState("");
  const [newRewardStock, setNewRewardStock] = useState(10);

  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [redeemStudentId, setRedeemStudentId] = useState("");
  const [redeemRewardId, setRedeemRewardId] = useState("");

  // Storage reativo de Recompensas, Bônus e Resgates
  const [rewards, setRewards] = useState<Reward[]>(() => {
    try {
      const stored = localStorage.getItem(LS_REWARDS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_REWARDS;
  });

  const [bonuses, setBonuses] = useState<PointBonus[]>(() => {
    try {
      const stored = localStorage.getItem(LS_BONUS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [];
  });

  const [redemptions, setRedemptions] = useState<Redemption[]>(() => {
    try {
      const stored = localStorage.getItem(LS_REDEMPTIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [];
  });

  const [manualCheckins, setManualCheckins] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem(LS_MANUAL_CHECKINS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {};
  });

  // Salvar no localStorage sempre que houver mutação
  const saveRewards = (items: Reward[]) => {
    setRewards(items);
    try {
      localStorage.setItem(LS_REWARDS_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Falha ao salvar rewards:", e);
    }
  };

  const saveBonuses = (items: PointBonus[]) => {
    setBonuses(items);
    try {
      localStorage.setItem(LS_BONUS_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Falha ao salvar bônus:", e);
    }
  };

  const saveRedemptions = (items: Redemption[]) => {
    setRedemptions(items);
    try {
      localStorage.setItem(LS_REDEMPTIONS_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Falha ao salvar resgates:", e);
    }
  };

  const saveManualCheckins = (items: Record<string, number>) => {
    setManualCheckins(items);
    try {
      localStorage.setItem(LS_MANUAL_CHECKINS_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Falha ao salvar checkins manuais:", e);
    }
  };

  // 1. Carregar Alunos do Supabase
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["promocoes-students", scopeKey],
    enabled: ready,
    queryFn: async () => {
      let q = supabase
        .from("students")
        .select("id, name, email, phone, status, created_at, bonus_checkins_balance")
        .is("deleted_at", null)
        .order("name");

      if (scopeId) {
        q = q.eq("user_id", scopeId);
      }

      const { data, error } = await q;
      if (error) {
        console.warn("Erro ao carregar alunos do Supabase:", error);
        return [];
      }
      return data ?? [];
    },
  });

  // 2. Carregar Presenças de Turmas / Aulas
  const { data: attendances = [] } = useQuery({
    queryKey: ["promocoes-attendance", scopeKey, selectedMonth],
    enabled: ready,
    queryFn: async () => {
      try {
        const [yearStr, monthStr] = selectedMonth.split("-");
        const start = `${yearStr}-${monthStr}-01T00:00:00.000Z`;
        const lastDay = new Date(Number(yearStr), Number(monthStr), 0).getDate();
        const end = `${yearStr}-${monthStr}-${String(lastDay).padStart(2, "0")}T23:59:59.999Z`;

        const { data, error } = await supabase
          .from("class_attendance")
          .select("id, student_id, created_at, status")
          .gte("created_at", start)
          .lte("created_at", end);

        if (error) {
          console.warn("class_attendance não retornou dados:", error);
          return [];
        }
        return data ?? [];
      } catch {
        return [];
      }
    },
  });

  // 3. Processamento & Cálculo de Pontuação dos Alunos
  const studentRows = useMemo(() => {
    const metaPadrao = 16; // Meta recomendada de 16 treinos por mês (4x na semana)

    return students.map((st) => {
      // Contagem de treinos do Supabase + Check-ins Manuais rápidos desta tela
      const dbCheckins = attendances.filter((a) => a.student_id === st.id).length;
      const keyMonthStudent = `${selectedMonth}:${st.id}`;
      const manualCount = manualCheckins[keyMonthStudent] || 0;
      const totalTreinos = dbCheckins + manualCount;

      // Estimativa de Streaks Semanais (cada 4 treinos representam uma semana com consistência)
      const streaks = Math.floor(totalTreinos / 4);

      // Regras cravadas:
      // +1 ponto por treino
      const pontosTreino = totalTreinos * 1;
      // +3 pontos por semana perfeita (streak)
      const pontosStreak = streaks * 3;
      // +10 pontos ao atingir a meta mensal
      const bateuMeta = totalTreinos >= metaPadrao;
      const pontosMeta = bateuMeta ? 10 : 0;

      // Bônus manuais concedidos pelo coach
      const studentBonuses = bonuses.filter((b) => b.studentId === st.id);
      const pontosBonus = studentBonuses.reduce((acc, b) => acc + b.points, 0);

      // Resgates realizados (pontos gastos)
      const studentRedemptions = redemptions.filter((r) => r.studentId === st.id);
      const pontosGastos = studentRedemptions.reduce((acc, r) => acc + r.pointsSpent, 0);

      // Saldo do Mês e Saldo Total Disponível
      const pontosMes = pontosTreino + pontosStreak + pontosMeta + pontosBonus;
      const saldoFinal = Math.max(0, pontosMes - pontosGastos);

      const percentMeta = Math.min(100, Math.round((totalTreinos / metaPadrao) * 100));

      return {
        id: st.id,
        name: st.name || "Aluno sem nome",
        email: st.email,
        phone: st.phone,
        status: st.status,
        totalTreinos,
        metaPadrao,
        bateuMeta,
        percentMeta,
        streaks,
        pontosTreino,
        pontosStreak,
        pontosMeta,
        pontosBonus,
        pontosMes,
        pontosGastos,
        saldoFinal,
      };
    });
  }, [students, attendances, manualCheckins, selectedMonth, bonuses, redemptions]);

  // Filtros de busca e status
  const filteredStudents = useMemo(() => {
    return studentRows.filter((item) => {
      if (search.trim()) {
        const matches = matchesSearchTerms(item.name, search) || (item.email && matchesSearchTerms(item.email, search));
        if (!matches) return false;
      }
      if (filterStatus === "meta_batida") return item.bateuMeta;
      if (filterStatus === "em_andamento") return !item.bateuMeta;
      return true;
    });
  }, [studentRows, search, filterStatus]);

  // Métricas Consolidadas do Mês
  const kpis = useMemo(() => {
    const totalAlunos = studentRows.length;
    const totalTreinos = studentRows.reduce((acc, s) => acc + s.totalTreinos, 0);
    const totalMetasBatidas = studentRows.filter((s) => s.bateuMeta).length;
    const totalStreaks = studentRows.reduce((acc, s) => acc + s.streaks, 0);
    const totalPontosDistribuidos = studentRows.reduce((acc, s) => acc + s.pontosMes, 0);

    return {
      totalAlunos,
      totalTreinos,
      totalMetasBatidas,
      totalStreaks,
      totalPontosDistribuidos,
    };
  }, [studentRows]);

  // Ação: Adicionar +1 Treino Manual Rápido
  const handleAddQuickCheckin = (studentId: string, studentName: string) => {
    const key = `${selectedMonth}:${studentId}`;
    const current = manualCheckins[key] || 0;
    const updated = { ...manualCheckins, [key]: current + 1 };
    saveManualCheckins(updated);
    toast.success(`+1 Treino registrado para ${studentName}! (+1 ponto adicionado)`);
  };

  // Ação: Conceder Bônus Manual do Coach
  const handleConfirmBonus = () => {
    if (!selectedStudentForBonus) return;
    if (bonusPoints <= 0) {
      toast.error("Informe uma pontuação maior que zero");
      return;
    }
    const newBonus: PointBonus = {
      studentId: selectedStudentForBonus.id,
      points: Number(bonusPoints),
      reason: bonusReason.trim() || "Bônus por mérito do Personal Trainer",
      date: new Date().toLocaleDateString("pt-BR"),
    };

    saveBonuses([newBonus, ...bonuses]);
    toast.success(`+${bonusPoints} pontos concedidos para ${selectedStudentForBonus.name}!`);
    setBonusModalOpen(false);
    setBonusPoints(5);
    setBonusReason("");
  };

  // Ação: Criar Novo Prêmio
  const handleCreateReward = () => {
    if (!newRewardTitle.trim()) {
      toast.error("Informe o título da premiação");
      return;
    }
    const newReward: Reward = {
      id: `rew-${Date.now()}`,
      title: newRewardTitle.trim(),
      pointsCost: Number(newRewardCost) || 50,
      category: newRewardCategory,
      description: newRewardDesc.trim() || "Recompensa exclusiva do Studio Montanha",
      stock: Number(newRewardStock) || 1,
      isActive: true,
    };

    saveRewards([newReward, ...rewards]);
    toast.success(`Prêmio "${newReward.title}" cadastrado com sucesso!`);
    setRewardModalOpen(false);
    setNewRewardTitle("");
    setNewRewardCost(100);
    setNewRewardDesc("");
  };

  // Ação: Realizar Resgate de Prêmio
  const handleConfirmRedemption = () => {
    if (!redeemStudentId || !redeemRewardId) {
      toast.error("Selecione o aluno e o prêmio para resgate");
      return;
    }

    const student = studentRows.find((s) => s.id === redeemStudentId);
    const reward = rewards.find((r) => r.id === redeemRewardId);

    if (!student || !reward) {
      toast.error("Dados inválidos para o resgate");
      return;
    }

    if (student.saldoFinal < reward.pointsCost) {
      toast.error(
        `Saldo insuficiente! ${student.name} possui ${student.saldoFinal} pts e o prêmio custa ${reward.pointsCost} pts.`
      );
      return;
    }

    if (reward.stock <= 0) {
      toast.error("Prêmio sem estoque no momento!");
      return;
    }

    // Criar o registro de resgate
    const newRedemption: Redemption = {
      id: `red-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      rewardTitle: reward.title,
      pointsSpent: reward.pointsCost,
      redeemedAt: new Date().toLocaleDateString("pt-BR"),
      status: "entregue",
    };

    // Atualizar estoque
    const updatedRewards = rewards.map((r) =>
      r.id === reward.id ? { ...r, stock: Math.max(0, r.stock - 1) } : r
    );

    saveRedemptions([newRedemption, ...redemptions]);
    saveRewards(updatedRewards);

    toast.success(`Resgate de "${reward.title}" confirmado para ${student.name}! (-${reward.pointsCost} pts)`);
    setRedeemModalOpen(false);
    setRedeemStudentId("");
    setRedeemRewardId("");
  };

  // Enviar Mensagem de Felicitações via WhatsApp
  const handleSendWhatsAppCongrats = (student: typeof studentRows[0]) => {
    const cleanPhone = (student.phone || "").replace(/\D/g, "");
    if (!cleanPhone) {
      toast.error(`O aluno ${student.name} não possui telefone cadastrado.`);
      return;
    }

    let texto = `Fala ${student.name}, aqui é do Montanha Personal Studio! 💪🔥%0A%0A`;
    if (student.bateuMeta) {
      texto += `Passando para dar os PARABÉNS! Você bateu sua meta mensal de ${student.totalTreinos} treinos e faturou +10 pontos bônus! Seu saldo atual é de ${student.saldoFinal} pontos para trocar por prêmios no Studio. Bora pra cima! 🏆`;
    } else {
      texto += `Você já completou ${student.totalTreinos} de ${student.metaPadrao} treinos este mês! Faltam apenas ${Math.max(0, student.metaPadrao - student.totalTreinos)} para bater a meta e garantir +10 pontos de fidelidade. Seu saldo é de ${student.saldoFinal} pontos. Te esperamos no treino!`;
    }

    window.open(`https://wa.me/55${cleanPhone}?text=${texto}`, "_blank");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header com Ações Rápidas */}
      <PageHeader
        title="Promoções & Pontos"
        subtitle="Registro de treinos mensais, pontuação de consistência e catálogo de prêmios do Montanha Club."
        icon={Gift}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Seletor do Mês */}
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-1.5 shadow-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm font-medium text-foreground focus:outline-none"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setRedeemModalOpen(true)}
            className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
          >
            <ShoppingBag className="h-4 w-4" />
            Resgatar Prêmio
          </Button>

          <Button onClick={() => setRewardModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Prêmio
          </Button>
        </div>
      </PageHeader>

      {/* Régua de Regras Oficiais no Topo */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Treino Concluído</p>
              <p className="text-lg font-bold text-foreground">+1 Ponto</p>
              <p className="text-[11px] text-muted-foreground/80">Por cada treino ou check-in</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Semana Perfeita</p>
              <p className="text-lg font-bold text-foreground">+3 Pontos</p>
              <p className="text-[11px] text-muted-foreground/80">Bônus por consistência semanal</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Meta Mensal (16 Treinos)</p>
              <p className="text-lg font-bold text-foreground">+10 Pontos</p>
              <p className="text-[11px] text-muted-foreground/80">Ao bater a meta no mês</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Bônus do Coach</p>
              <p className="text-lg font-bold text-foreground">Avulso</p>
              <p className="text-[11px] text-muted-foreground/80">Mérito, PRs ou indicação</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de KPIs do Mês */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Alunos Ativos</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{kpis.totalAlunos}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Treinos no Mês</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-blue-500">{kpis.totalTreinos}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Streaks Semanas</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-amber-500">{kpis.totalStreaks}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Metas Batidas</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-500">{kpis.totalMetasBatidas}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pontos Gerados</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-purple-500">
              {kpis.totalPontosDistribuidos} <span className="text-xs font-normal text-muted-foreground">pts</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Abas Principais */}
      <Tabs defaultValue="alunos" className="space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="alunos" className="gap-2">
            <Users className="h-4 w-4" />
            Frequência & Pontuação ({studentRows.length})
          </TabsTrigger>
          <TabsTrigger value="premios" className="gap-2">
            <Gift className="h-4 w-4" />
            Catálogo de Prêmios ({rewards.length})
          </TabsTrigger>
          <TabsTrigger value="resgates" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Histórico de Resgates ({redemptions.length})
          </TabsTrigger>
          <TabsTrigger value="regras" className="gap-2">
            <Award className="h-4 w-4" />
            Manual de Gamificação
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ALUNOS & PONTUAÇÃO */}
        <TabsContent value="alunos" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-lg">Extrato Mensal de Alunos</CardTitle>
                  <CardDescription>
                    Apuração de treinos do mês de {selectedMonth}, pontuação acumulada e ações de fidelidade.
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar aluno por nome..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>

                  <Select
                    value={filterStatus}
                    onValueChange={(v: "all" | "meta_batida" | "em_andamento") => setFilterStatus(v)}
                  >
                    <SelectTrigger className="w-[160px] h-9">
                      <SelectValue placeholder="Filtrar meta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Alunos</SelectItem>
                      <SelectItem value="meta_batida">🏆 Meta Batida (100%)</SelectItem>
                      <SelectItem value="em_andamento">⏳ Em Andamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {isLoadingStudents ? (
                <div className="py-12 text-center text-sm text-muted-foreground">Carregando dados de alunos...</div>
              ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Nenhum aluno encontrado para os critérios selecionados.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aluno</TableHead>
                        <TableHead className="w-[180px]">Treinos no Mês</TableHead>
                        <TableHead className="text-center">Progresso</TableHead>
                        <TableHead className="text-center">Pontos do Mês</TableHead>
                        <TableHead className="text-center font-bold">Saldo Disponível</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((st) => (
                        <TableRow key={st.id} className="hover:bg-muted/40">
                          <TableCell>
                            <div className="font-medium text-foreground">{st.name}</div>
                            <div className="text-xs text-muted-foreground">{st.email || "Sem e-mail"}</div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">
                                {st.totalTreinos}
                              </span>
                              <span className="text-xs text-muted-foreground">/ {st.metaPadrao} treinos</span>
                              {st.bateuMeta && (
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] px-1.5 py-0">
                                  Meta Batida!
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="w-[160px]">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] text-muted-foreground">
                                <span>{st.percentMeta}%</span>
                                <span>{st.streaks > 0 ? `${st.streaks}x streak` : "Iniciando"}</span>
                              </div>
                              <Progress value={st.percentMeta} className="h-1.5" />
                            </div>
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="inline-flex flex-col items-center">
                              <span className="font-semibold text-foreground">+{st.pontosMes} pts</span>
                              <span className="text-[10px] text-muted-foreground">
                                ({st.pontosTreino}t + {st.pontosStreak}s {st.bateuMeta ? "+ 10m" : ""}{st.pontosBonus > 0 ? ` +${st.pontosBonus}b` : ""})
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="text-center">
                            <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs px-2.5 py-0.5">
                              <Coins className="mr-1 h-3 w-3 inline" />
                              {st.saldoFinal} pts
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Check-in Rápido +1 Treino */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAddQuickCheckin(st.id, st.name)}
                                title="Registrar +1 Treino hoje (+1 pt)"
                                className="h-8 px-2 text-xs gap-1"
                              >
                                <Zap className="h-3.5 w-3.5 text-amber-500" />
                                +1 Treino
                              </Button>

                              {/* Atribuir Bônus */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedStudentForBonus({ id: st.id, name: st.name });
                                  setBonusModalOpen(true);
                                }}
                                title="Atribuir bônus avulso"
                                className="h-8 px-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-500/10"
                              >
                                <Sparkles className="h-3.5 w-3.5" />
                                Bônus
                              </Button>

                              {/* Notificar no WhatsApp */}
                              {st.phone && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSendWhatsAppCongrats(st)}
                                  title="Enviar mensagem pelo WhatsApp"
                                  className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                                >
                                  <MessageCircle className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: CATÁLOGO DE PRÊMIOS */}
        <TabsContent value="premios" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Vitrine de Recompensas do Studio</h3>
              <p className="text-sm text-muted-foreground">
                Prêmios que os alunos podem resgatar utilizando os pontos acumulados por treino e consistência.
              </p>
            </div>
            <Button onClick={() => setRewardModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Prêmio
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map((rew) => (
              <Card key={rew.id} className="relative overflow-hidden border-border/60 hover:border-primary/40 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="capitalize text-xs">
                      {rew.category}
                    </Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/20 font-bold">
                      <Coins className="mr-1 h-3 w-3 inline" />
                      {rew.pointsCost} Pontos
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{rew.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">{rew.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>Estoque disponível:</span>
                    <span className="font-semibold text-foreground">{rew.stock} unidades</span>
                  </div>

                  <Button
                    className="w-full gap-2 text-xs"
                    variant="outline"
                    onClick={() => {
                      setRedeemRewardId(rew.id);
                      setRedeemModalOpen(true);
                    }}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Resgatar para Aluno
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: HISTÓRICO DE RESGATES */}
        <TabsContent value="resgates" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Extrato de Premiações Resgatadas</CardTitle>
              <CardDescription>
                Histórico de itens trocados por pontos pelos alunos do estúdio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {redemptions.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Nenhum resgate de prêmio realizado ainda. Quando um aluno acumular pontos e trocar por itens, o registro aparecerá aqui.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Prêmio Resgatado</TableHead>
                      <TableHead className="text-center">Pontos Gastos</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {redemptions.map((red) => (
                      <TableRow key={red.id}>
                        <TableCell className="text-xs text-muted-foreground">{red.redeemedAt}</TableCell>
                        <TableCell className="font-medium text-foreground">{red.studentName}</TableCell>
                        <TableCell>{red.rewardTitle}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-purple-600 border-purple-500/30">
                            -{red.pointsSpent} pts
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-xs">
                            <Check className="mr-1 h-3 w-3 inline" />
                            Entregue
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: MANUAL DE GAMIFICAÇÃO */}
        <TabsContent value="regras" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Como Funciona a Gamificação do Montanha Studio</CardTitle>
              <CardDescription>
                Metodologia para impulsionar a assiduidade, reduzir o churn e engajar os alunos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-relaxed text-muted-foreground">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 text-xs">1</span>
                    Consistência Diária (+1 pt)
                  </div>
                  <p className="text-xs">
                    Cada treino realizado no estúdio vale 1 ponto. Isso valoriza a presença diária e estimula o aluno a não deixar o treino para depois.
                  </p>
                </div>

                <div className="rounded-lg border border-border/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 text-xs">2</span>
                    Semana Perfeita (+3 pts)
                  </div>
                  <p className="text-xs">
                    O bônus de streak premia quem mantém a disciplina contínua durante a semana. 4 treinos na mesma semana garantem +3 pontos extras.
                  </p>
                </div>

                <div className="rounded-lg border border-border/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 text-xs">3</span>
                    Meta Mensal Batida (+10 pts)
                  </div>
                  <p className="text-xs">
                    Bater a meta de 16 treinos no mês confere o troféu do mês e uma pontuação maciça de +10 pontos direto no saldo do aluno.
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-muted/40 p-4 border border-border/40 space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Dica de Retenção do Coach
                </h4>
                <p className="text-xs">
                  Aproveite a virada de mês para enviar um relatório via WhatsApp parabenizando os alunos com maiores pontuações e estimulando o resgate de prêmios. Aluno que vê progresso e recompensa palpável não cancela a consultoria.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL: CONCEDER BÔNUS MANUAL */}
      <Dialog open={bonusModalOpen} onOpenChange={setBonusModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Conceder Bônus para {selectedStudentForBonus?.name}
            </DialogTitle>
            <DialogDescription>
              Atribua pontos manuais por merecimento, novo PR de carga, pontualidade ou indicação de amigo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="bonus-pts">Quantidade de Pontos</Label>
              <Input
                id="bonus-pts"
                type="number"
                min="1"
                max="100"
                value={bonusPoints}
                onChange={(e) => setBonusPoints(Number(e.target.value))}
                className="text-base"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bonus-reason">Motivo / Justificativa</Label>
              <Input
                id="bonus-reason"
                placeholder="Ex: Novo PR no levantamento terra (180kg)"
                value={bonusReason}
                onChange={(e) => setBonusReason(e.target.value)}
                className="text-base"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBonusModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmBonus} className="bg-purple-600 hover:bg-purple-700 text-white">
              Conceder Bônus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: CRIAR NOVO PRÊMIO */}
      <Dialog open={rewardModalOpen} onOpenChange={setRewardModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Cadastrar Nova Premiação
            </DialogTitle>
            <DialogDescription>
              Defina o nome, custo em pontos e estoque do item a ser disponibilizado no catálogo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="rew-title">Título do Prêmio</Label>
              <Input
                id="rew-title"
                placeholder="Ex: Garrafa Térmica 1L Montanha"
                value={newRewardTitle}
                onChange={(e) => setNewRewardTitle(e.target.value)}
                className="text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="rew-cost">Custo em Pontos</Label>
                <Input
                  id="rew-cost"
                  type="number"
                  min="5"
                  value={newRewardCost}
                  onChange={(e) => setNewRewardCost(Number(e.target.value))}
                  className="text-base"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rew-stock">Estoque Inicial</Label>
                <Input
                  id="rew-stock"
                  type="number"
                  min="1"
                  value={newRewardStock}
                  onChange={(e) => setNewRewardStock(Number(e.target.value))}
                  className="text-base"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select
                value={newRewardCategory}
                onValueChange={(v: Reward["category"]) => setNewRewardCategory(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brinde">Brinde / Acessório</SelectItem>
                  <SelectItem value="desconto">Desconto em Mensalidade</SelectItem>
                  <SelectItem value="servico">Serviço / Avaliação</SelectItem>
                  <SelectItem value="suplemento">Suplemento / Shake</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rew-desc">Descrição Curta</Label>
              <Input
                id="rew-desc"
                placeholder="Detalhes ou regras de uso do prêmio"
                value={newRewardDesc}
                onChange={(e) => setNewRewardDesc(e.target.value)}
                className="text-base"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRewardModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateReward}>Salvar Prêmio</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: RESGATAR PRÊMIO PARA ALUNO */}
      <Dialog open={redeemModalOpen} onOpenChange={setRedeemModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Resgatar Prêmio para Aluno
            </DialogTitle>
            <DialogDescription>
              Selecione o aluno e o prêmio desejado. Os pontos serão abatidos do saldo do aluno.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Selecione o Aluno</Label>
              <Select value={redeemStudentId} onValueChange={setRedeemStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um aluno..." />
                </SelectTrigger>
                <SelectContent>
                  {studentRows.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.saldoFinal} pts disponíveis)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Selecione o Prêmio</Label>
              <Select value={redeemRewardId} onValueChange={setRedeemRewardId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha a recompensa..." />
                </SelectTrigger>
                <SelectContent>
                  {rewards.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.title} — {r.pointsCost} pts (Estoque: {r.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRedeemModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmRedemption}>Confirmar Resgate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
