import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Trophy,
  Plus,
  Users,
  Calendar,
  Flame,
  Award,
  Share2,
  Target,
  TrendingUp,
  MoreVertical,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  UserPlus,
  Medal,
  Dumbbell,
  Search,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_authenticated/desafios/")({
  component: DesafiosPage,
});

interface Participant {
  id: string;
  name: string;
  type: "studio" | "pt" | "lead";
  score: number;
  checkins: number;
  lastActivity: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  audience: "all" | "studio" | "pt" | "leads";
  goalType: "checkins" | "workouts" | "tonnage" | "points";
  goalTarget: number;
  startDate: string;
  endDate: string;
  prize: string;
  maxParticipants?: number;
  status: "active" | "draft" | "completed";
  createdAt: string;
  participants: Participant[];
}

const STORAGE_KEY = "eduflow_challenges_v2";

const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: "ch-1",
    title: "Desafio Projeto Verão 30 Dias",
    description: "Acumule pelo menos 20 presenças/treinos nos próximos 30 dias para concorrer a prêmios e superar seus limites!",
    audience: "all",
    goalType: "checkins",
    goalTarget: 20,
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    prize: "🏆 1 Mês Grátis de Mensalidade + Kit Exclusivo Studio",
    maxParticipants: 30,
    status: "active",
    createdAt: new Date().toISOString(),
    participants: [
      { id: "p-1", name: "Carlos Silva", type: "studio", score: 18, checkins: 18, lastActivity: "Hoje" },
      { id: "p-2", name: "Mariana Oliveira", type: "pt", score: 16, checkins: 16, lastActivity: "Hoje" },
      { id: "p-3", name: "Felipe Santos", type: "studio", score: 15, checkins: 15, lastActivity: "Ontem" },
      { id: "p-4", name: "Ana Beatriz", type: "pt", score: 12, checkins: 12, lastActivity: "Há 2 dias" },
      { id: "p-5", name: "Rodrigo Costa", type: "lead", score: 9, checkins: 9, lastActivity: "Há 3 dias" },
    ],
  },
  {
    id: "ch-2",
    title: "Desafio Tonelagem Kettlebell",
    description: "Exclusivo para alunos de Personal e Kettlebell Fitness. Qual aluno vai levantar a maior tonelagem acumulada este mês?",
    audience: "studio",
    goalType: "tonnage",
    goalTarget: 50000,
    startDate: "2026-09-10",
    endDate: "2026-10-10",
    prize: "🥇 Troféu Kettlebell Master + Blusão Personalizado",
    maxParticipants: 15,
    status: "active",
    createdAt: new Date().toISOString(),
    participants: [
      { id: "p-6", name: "Lucas Mendes", type: "studio", score: 34500, checkins: 10, lastActivity: "Hoje" },
      { id: "p-7", name: "Camila Fernandes", type: "studio", score: 28900, checkins: 8, lastActivity: "Ontem" },
      { id: "p-8", name: "Bruno Souza", type: "pt", score: 21000, checkins: 6, lastActivity: "Há 2 dias" },
    ],
  },
];

export function DesafiosPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      /* fallback */
    }
    return DEFAULT_CHALLENGES;
  });

  // Modals state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [leaderboardDialogOpen, setLeaderboardDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audience: "all" as Challenge["audience"],
    goalType: "checkins" as Challenge["goalType"],
    goalTarget: 20,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    prize: "",
    maxParticipants: 30,
  });

  // Participant Form
  const [newParticipantName, setNewParticipantName] = useState("");
  const [newParticipantType, setNewParticipantType] = useState<"studio" | "pt" | "lead">("studio");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
    } catch {
      /* ignore */
    }
  }, [challenges]);

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("O título do desafio é obrigatório!");
      return;
    }

    const newChallenge: Challenge = {
      id: `ch-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      audience: formData.audience,
      goalType: formData.goalType,
      goalTarget: Number(formData.goalTarget) || 20,
      startDate: formData.startDate,
      endDate: formData.endDate,
      prize: formData.prize || "Premiação a definir",
      maxParticipants: Number(formData.maxParticipants) || 0,
      status: "active",
      createdAt: new Date().toISOString(),
      participants: [],
    };

    setChallenges([newChallenge, ...challenges]);
    setCreateDialogOpen(false);
    resetForm();
    toast.success("Grupo de Desafio criado com sucesso! 🎉");
  };

  const handleEditChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge || !formData.title.trim()) return;

    const updated = challenges.map((ch) =>
      ch.id === selectedChallenge.id
        ? {
            ...ch,
            title: formData.title,
            description: formData.description,
            audience: formData.audience,
            goalType: formData.goalType,
            goalTarget: Number(formData.goalTarget) || 20,
            startDate: formData.startDate,
            endDate: formData.endDate,
            prize: formData.prize,
            maxParticipants: Number(formData.maxParticipants) || 0,
          }
        : ch
    );

    setChallenges(updated);
    setEditDialogOpen(false);
    setSelectedChallenge(null);
    toast.success("Desafio atualizado com sucesso!");
  };

  const handleDeleteChallenge = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este desafio?")) {
      setChallenges(challenges.filter((ch) => ch.id !== id));
      toast.success("Desafio removido.");
    }
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge || !newParticipantName.trim()) return;

    const newP: Participant = {
      id: `p-${Date.now()}`,
      name: newParticipantName.trim(),
      type: newParticipantType,
      score: 0,
      checkins: 0,
      lastActivity: "Recém adicionado",
    };

    const updated = challenges.map((ch) =>
      ch.id === selectedChallenge.id
        ? { ...ch, participants: [newP, ...ch.participants] }
        : ch
    );

    setChallenges(updated);
    setSelectedChallenge((prev) => prev ? { ...prev, participants: [newP, ...prev.participants] } : null);
    setNewParticipantName("");
    toast.success(`${newP.name} adicionado ao desafio!`);
  };

  const handleIncrementScore = (participantId: string, delta: number) => {
    if (!selectedChallenge) return;

    const updatedParticipants = selectedChallenge.participants.map((p) =>
      p.id === participantId
        ? {
            ...p,
            score: Math.max(0, p.score + delta),
            checkins: Math.max(0, p.checkins + (delta > 0 ? 1 : -1)),
            lastActivity: "Agora mesmo",
          }
        : p
    );

    const updated = challenges.map((ch) =>
      ch.id === selectedChallenge.id ? { ...ch, participants: updatedParticipants } : ch
    );

    setChallenges(updated);
    setSelectedChallenge((prev) => prev ? { ...prev, participants: updatedParticipants } : null);
  };

  const handleShareWhatsApp = (challenge: Challenge) => {
    const text = `🔥 *${challenge.title}*\n\n${challenge.description}\n\n🏆 *Prêmio:* ${challenge.prize}\n📅 *Período:* ${new Date(challenge.startDate).toLocaleDateString("pt-BR")} até ${new Date(challenge.endDate).toLocaleDateString("pt-BR")}\n\nGaranta sua vaga e participe no nosso app!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const openEditModal = (ch: Challenge) => {
    setSelectedChallenge(ch);
    setFormData({
      title: ch.title,
      description: ch.description,
      audience: ch.audience,
      goalType: ch.goalType,
      goalTarget: ch.goalTarget,
      startDate: ch.startDate,
      endDate: ch.endDate,
      prize: ch.prize,
      maxParticipants: ch.maxParticipants || 30,
    });
    setEditDialogOpen(true);
  };

  const openLeaderboardModal = (ch: Challenge) => {
    setSelectedChallenge(ch);
    setLeaderboardDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      audience: "all",
      goalType: "checkins",
      goalTarget: 20,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      prize: "",
      maxParticipants: 30,
    });
  };

  // Filtered challenges
  const activeChallenges = challenges.filter((c) => c.status === "active");
  const totalParticipants = challenges.reduce((acc, curr) => acc + curr.participants.length, 0);

  const filterChallenges = (statusFilter?: string) => {
    return challenges.filter((ch) => {
      const matchesStatus = !statusFilter || statusFilter === "all" || ch.status === statusFilter;
      const matchesSearch =
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };

  const getAudienceLabel = (aud: Challenge["audience"]) => {
    switch (aud) {
      case "all":
        return "Híbrido (Studio & PT)";
      case "studio":
        return "Alunos Studio";
      case "pt":
        return "Alunos Personal";
      case "leads":
        return "Público & Novos Alunos";
    }
  };

  const getGoalTypeLabel = (gt: Challenge["goalType"]) => {
    switch (gt) {
      case "checkins":
        return "Presenças / Check-ins";
      case "workouts":
        return "Treinos Concluídos";
      case "tonnage":
        return "Tonelagem Total (kg)";
      case "points":
        return "Pontuação Acumulada";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        icon={Trophy}
        eyebrow="Gestão & Engajamento"
        title="Grupos de Desafio"
        description="Crie e gerencie grupos de desafio interativos para motivar seus alunos do Studio e Personal Trainer."
        actions={
          <Button
            onClick={() => {
              resetForm();
              setCreateDialogOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20 gap-2"
          >
            <Plus className="h-4 w-4" /> Criar novo desafio
          </Button>
        }
      />

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Desafios Ativos
            </CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeChallenges.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Em andamento neste mês</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Alunos Participantes
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground mt-1">Engajados em desafios</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Premiações Ativas
            </CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{challenges.filter((c) => c.prize).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Prêmios em disputa</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Taxa de Conclusão
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground mt-1">Média de presenças nos desafios</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs and Search */}
      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="active" className="text-xs font-semibold">
              Ativos ({activeChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs font-semibold">
              Todos ({challenges.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs font-semibold">
              Concluídos ({challenges.filter((c) => c.status === "completed").length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar desafio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </div>

        {/* Tab: Ativos */}
        <TabsContent value="active" className="space-y-4">
          {filterChallenges("active").length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
              <h3 className="text-base font-semibold">Nenhum desafio ativo no momento</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
                Crie um novo desafio para engajar seus alunos do Studio e Personal Trainer com metas, troféus e rankings.
              </p>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Criar Novo Desafio
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filterChallenges("active").map((ch) => (
                <ChallengeCard
                  key={ch.id}
                  challenge={ch}
                  onOpenLeaderboard={() => openLeaderboardModal(ch)}
                  onOpenEdit={() => openEditModal(ch)}
                  onDelete={() => handleDeleteChallenge(ch.id)}
                  onShare={() => handleShareWhatsApp(ch)}
                  getAudienceLabel={getAudienceLabel}
                  getGoalTypeLabel={getGoalTypeLabel}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab: Todos */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {filterChallenges("all").map((ch) => (
              <ChallengeCard
                key={ch.id}
                challenge={ch}
                onOpenLeaderboard={() => openLeaderboardModal(ch)}
                onOpenEdit={() => openEditModal(ch)}
                onDelete={() => handleDeleteChallenge(ch.id)}
                onShare={() => handleShareWhatsApp(ch)}
                getAudienceLabel={getAudienceLabel}
                getGoalTypeLabel={getGoalTypeLabel}
              />
            ))}
          </div>
        </TabsContent>

        {/* Tab: Concluídos */}
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {filterChallenges("completed").map((ch) => (
              <ChallengeCard
                key={ch.id}
                challenge={ch}
                onOpenLeaderboard={() => openLeaderboardModal(ch)}
                onOpenEdit={() => openEditModal(ch)}
                onDelete={() => handleDeleteChallenge(ch.id)}
                onShare={() => handleShareWhatsApp(ch)}
                getAudienceLabel={getAudienceLabel}
                getGoalTypeLabel={getGoalTypeLabel}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* DIALOG: Criar Novo Desafio */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" /> Criar Novo Grupo de Desafio
            </DialogTitle>
            <DialogDescription>
              Defina os parâmetros do desafio. Alunos poderão acompanhar suas colocações em tempo real.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateChallenge} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="title">Título do Desafio *</Label>
              <Input
                id="title"
                placeholder="Ex: Desafio Projeto Verão 30 Dias"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descrição & Regras do Desafio</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Descreva as regras, como acumular pontos e as orientações para os alunos..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Público Alvo</Label>
                <Select
                  value={formData.audience}
                  onValueChange={(val: Challenge["audience"]) => setFormData({ ...formData, audience: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Híbrido (Studio & Personal)</SelectItem>
                    <SelectItem value="studio">Alunos do Studio</SelectItem>
                    <SelectItem value="pt">Alunos de Personal</SelectItem>
                    <SelectItem value="leads">Aberto ao Público (Novos Leads)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Tipo de Meta</Label>
                <Select
                  value={formData.goalType}
                  onValueChange={(val: Challenge["goalType"]) => setFormData({ ...formData, goalType: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkins">Total de Check-ins / Presenças</SelectItem>
                    <SelectItem value="workouts">Treinos Concluídos</SelectItem>
                    <SelectItem value="tonnage">Tonelagem Total Acumulada (kg)</SelectItem>
                    <SelectItem value="points">Pontuação por Desempenho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="goalTarget">Meta Alvo</Label>
                <Input
                  id="goalTarget"
                  type="number"
                  placeholder="20"
                  value={formData.goalTarget}
                  onChange={(e) => setFormData({ ...formData, goalTarget: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prize">Premiação / Recompensa</Label>
              <Input
                id="prize"
                placeholder="Ex: 🏆 1 Mês Grátis de Mensalidade + Camiseta"
                value={formData.prize}
                onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="maxParticipants">Limite Máximo de Vagas</Label>
              <Input
                id="maxParticipants"
                type="number"
                placeholder="30 (ou 0 para sem limite)"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 font-semibold">
                Criar Desafio
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Editar Desafio */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Desafio</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditChallenge} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-title">Título do Desafio</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-desc">Descrição & Regras</Label>
              <Textarea
                id="edit-desc"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Público Alvo</Label>
                <Select
                  value={formData.audience}
                  onValueChange={(val: Challenge["audience"]) => setFormData({ ...formData, audience: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Híbrido (Studio & Personal)</SelectItem>
                    <SelectItem value="studio">Alunos do Studio</SelectItem>
                    <SelectItem value="pt">Alunos de Personal</SelectItem>
                    <SelectItem value="leads">Aberto ao Público (Novos Leads)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Premiação</Label>
                <Input
                  value={formData.prize}
                  onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 font-semibold">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Ranking & Participantes */}
      <Dialog open={leaderboardDialogOpen} onOpenChange={setLeaderboardDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedChallenge && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10">
                    <Trophy className="mr-1 h-3.5 w-3.5" /> Ranking do Desafio
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareWhatsApp(selectedChallenge)}
                    className="gap-1.5 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Convidar via WhatsApp
                  </Button>
                </div>
                <DialogTitle className="text-xl mt-2">{selectedChallenge.title}</DialogTitle>
                <DialogDescription className="text-xs">
                  {selectedChallenge.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-2">
                {/* Add participant form */}
                <form onSubmit={handleAddParticipant} className="p-3 bg-muted/40 rounded-xl border border-border/50 flex flex-col sm:flex-row gap-2 items-end">
                  <div className="flex-1 space-y-1 w-full">
                    <Label className="text-xs">Increver Novo Aluno</Label>
                    <Input
                      placeholder="Nome do aluno..."
                      value={newParticipantName}
                      onChange={(e) => setNewParticipantName(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>
                  <div className="w-full sm:w-36 space-y-1">
                    <Label className="text-xs">Tipo</Label>
                    <Select
                      value={newParticipantType}
                      onValueChange={(v: "studio" | "pt" | "lead") => setNewParticipantType(v)}
                    >
                      <SelectTrigger className="text-xs h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="pt">Personal</SelectItem>
                        <SelectItem value="lead">Novo Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" size="sm" className="h-9 gap-1 font-semibold">
                    <UserPlus className="h-3.5 w-3.5" /> Adicionar
                  </Button>
                </form>

                {/* Leaderboard Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Medal className="h-4 w-4 text-amber-500" /> Tabela de Classificação ({selectedChallenge.participants.length})
                  </h4>

                  {selectedChallenge.participants.length === 0 ? (
                    <div className="text-center p-6 bg-muted/20 rounded-lg text-xs text-muted-foreground">
                      Nenhum aluno inscrito ainda neste desafio. Adicione acima para iniciar o ranking!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedChallenge.participants
                        .sort((a, b) => b.score - a.score)
                        .map((p, index) => {
                          const isTop3 = index < 3;
                          const medalColor =
                            index === 0
                              ? "text-amber-500 bg-amber-500/10 border-amber-500/30"
                              : index === 1
                              ? "text-slate-400 bg-slate-400/10 border-slate-400/30"
                              : index === 2
                              ? "text-amber-700 bg-amber-700/10 border-amber-700/30"
                              : "text-muted-foreground bg-muted border-border/50";

                          const pct = Math.min(100, Math.round((p.score / (selectedChallenge.goalTarget || 1)) * 100));

                          return (
                            <div
                              key={p.id}
                              className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card hover:bg-accent/40 transition-colors gap-3"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold ${medalColor}`}>
                                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                                </div>
                                <Avatar className="h-8 w-8 shrink-0">
                                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                    {p.name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="truncate text-xs font-bold flex items-center gap-1.5">
                                    {p.name}
                                    <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                                      {p.type === "studio" ? "Studio" : p.type === "pt" ? "Personal" : "Lead"}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1 w-36 sm:w-48">
                                    <Progress value={pct} className="h-1.5" />
                                    <span className="text-[10px] text-muted-foreground shrink-0">{pct}%</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <div className="text-right">
                                  <div className="text-xs font-bold">
                                    {p.score} <span className="text-[10px] font-normal text-muted-foreground">pts</span>
                                  </div>
                                  <div className="text-[10px] text-muted-foreground">{p.checkins} presenças</div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7 text-xs"
                                    onClick={() => handleIncrementScore(p.id, 1)}
                                    title="Adicionar ponto/presença"
                                  >
                                    +1
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-xs text-muted-foreground hover:text-destructive"
                                    onClick={() => handleIncrementScore(p.id, -1)}
                                    title="Remover ponto"
                                  >
                                    -1
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-component: Challenge Card
function ChallengeCard({
  challenge,
  onOpenLeaderboard,
  onOpenEdit,
  onDelete,
  onShare,
  getAudienceLabel,
  getGoalTypeLabel,
}: {
  challenge: Challenge;
  onOpenLeaderboard: () => void;
  onOpenEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
  getAudienceLabel: (aud: Challenge["audience"]) => string;
  getGoalTypeLabel: (gt: Challenge["goalType"]) => string;
}) {
  const isCompleted = challenge.status === "completed";
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <Card className="relative overflow-hidden border-border/70 shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-primary to-orange-500" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-[10px] font-bold">
                {getAudienceLabel(challenge.audience)}
              </Badge>
              {daysLeft > 0 ? (
                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/10">
                  <Clock className="mr-1 h-3 w-3" /> Faltam {daysLeft} dias
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  Encerrado
                </Badge>
              )}
            </div>
            <CardTitle className="text-base font-bold leading-tight">{challenge.title}</CardTitle>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onOpenEdit} className="gap-2 text-xs">
                <Edit3 className="h-3.5 w-3.5" /> Editar Desafio
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare} className="gap-2 text-xs text-emerald-600">
                <Share2 className="h-3.5 w-3.5" /> Compartilhar Convite
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="gap-2 text-xs text-destructive">
                <Trash2 className="h-3.5 w-3.5" /> Excluir Desafio
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardDescription className="text-xs line-clamp-2 mt-1">
          {challenge.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-xs pb-4">
        <div className="grid grid-cols-2 gap-3 p-2.5 rounded-lg bg-muted/50">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Meta / Tipo</span>
            <span className="font-semibold text-foreground truncate block">
              {challenge.goalTarget} {getGoalTypeLabel(challenge.goalType)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Participantes</span>
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Users className="h-3 w-3 text-primary" /> {challenge.participants.length}{" "}
              {challenge.maxParticipants ? `/ ${challenge.maxParticipants}` : ""}
            </span>
          </div>
        </div>

        {challenge.prize && (
          <div className="flex items-center gap-2 p-2 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-300">
            <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="font-medium text-xs truncate">{challenge.prize}</span>
          </div>
        )}
      </CardContent>

      <div className="border-t border-border/50 p-3 bg-muted/20 flex items-center justify-between gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onShare}
          className="gap-1.5 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Convidar
        </Button>

        <Button
          size="sm"
          onClick={onOpenLeaderboard}
          className="gap-1.5 text-xs bg-primary hover:bg-primary/90 font-bold"
        >
          <Trophy className="h-3.5 w-3.5" /> Ver Ranking ({challenge.participants.length})
        </Button>
      </div>
    </Card>
  );
}
