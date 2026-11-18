import { Users as PageIcon } from "lucide-react";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { createFileRoute, Link } from "@tanstack/react-router";
import { confirmDialog } from "@/lib/confirm-dialog";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight,
  Plus,
  Search,
  Trash2,
  Timer,
  Gift,
  Clock,
  ArrowRight,
  Filter,
  MessageCircle,
  Wallet,
  TrendingUp,
  Users,
} from "lucide-react";

import { toast } from "sonner";
import { TrainingTimerDialog } from "@/components/pt/TrainingTimerDialog";

import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StudentDialog } from "@/components/edufinance/StudentDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { BulkStudentEditDialog } from "@/components/edufinance/BulkStudentEditDialog";
import { BulkGrantBonusDialog } from "@/components/students/dialogs/BulkGrantBonusDialog";
import { MigrateStudentsDialog } from "@/components/MigrateStudentsDialog";
import { StudentStatusBadge, PlanBadge } from "@/components/edufinance/Badges";
import { EmptyState } from "@/components/edufinance/EmptyState";
import { formatBRL, formatDateBR, initials } from "@/lib/format";
import { useScopeFilter } from "@/hooks/use-scope-filter";
import { allocateCheckins, checkinChipClass, checkinTone } from "@/lib/checkins";
import { cn } from "@/lib/utils";
import { Ticket } from "lucide-react";
import { matchesSearchTerms } from "@/lib/search-utils";


export const Route = createFileRoute("/_authenticated/students/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Alunos — EduFinance" }] }),
  errorComponent: ({ error }) => (
    <div className="p-6 max-w-xl mx-auto my-12 text-center space-y-4">
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
        <h3 className="text-lg font-semibold">Erro ao carregar a página de alunos</h3>
        <p className="text-sm mt-2 opacity-90 break-words font-mono">
          {error?.message || "Ocorreu um erro ao renderizar os dados dos alunos."}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4"
          variant="outline"
        >
          Tentar novamente
        </Button>
      </div>
    </div>
  ),
  component: StudentsPage,
});

type Row = {
  id: string; name: string; email: string | null; phone: string | null;
  notes: string | null; status: string;
  created_at: string; birth_date: string | null;
  account_user_id: string | null;
  bonus_checkins_balance?: number;
  payments: {
    id: string;
    amount: number;
    payment_date: string;
    due_date?: string | null;
    reference_month?: string | null;
    status: string;
    checkin_quota_override: number | null;
    plans: {
      name?: string | null;
      billing_cycle?: string | null;
      price?: number | null;
      checkin_quota_type: string | null;
      checkin_quota_amount: number | null;
      package_valid_days: number | null;
    } | null;
  }[];
  student_plan_history: {
    id?: string;
    is_current: boolean;
    start_date?: string | null;
    end_date?: string | null;
    plans: { name: string; price?: number | null; billing_cycle?: string | null } | null;
  }[];
};

function getDiasParaVencer(endDateStr?: string | null): number | null {
  if (!endDateStr) return null;
  try {
    const end = new Date(endDateStr + "T23:59:59");
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

function getStudentPlanExpiration(s: Row): {
  expirationDate: string | null;
  diasParaVencer: number | null;
  planName: string;
} {
  const currentPlan = s.student_plan_history?.find((h) => h.is_current);
  const planName = currentPlan?.plans?.name ?? "Sem plano";

  // 1. Data de término explícita no histórico do plano atual
  if (currentPlan?.end_date) {
    const dias = getDiasParaVencer(currentPlan.end_date);
    return { expirationDate: currentPlan.end_date, diasParaVencer: dias, planName };
  }

  // 2. Data de vencimento da última mensalidade paga
  const paidPayments = (s.payments || [])
    .filter((p) => p && p.status === "paid")
    .sort((a, b) => (b.payment_date || "").localeCompare(a.payment_date || ""));

  const lastPayment = paidPayments[0];
  if (lastPayment?.due_date) {
    const dias = getDiasParaVencer(lastPayment.due_date);
    return { expirationDate: lastPayment.due_date, diasParaVencer: dias, planName };
  }

  // 3. Fallback: payment_date + 30 dias se houver pagamento
  if (lastPayment?.payment_date) {
    const d = new Date(lastPayment.payment_date + "T00:00:00");
    if (!isNaN(d.getTime())) {
      d.setMonth(d.getMonth() + 1);
      const estDate = d.toISOString().slice(0, 10);
      const dias = getDiasParaVencer(estDate);
      return { expirationDate: estDate, diasParaVencer: dias, planName };
    }
  }

  return { expirationDate: null, diasParaVencer: null, planName };
}

function StudentsPage() {
  const qc = useQueryClient();
  const { scopeId, scopeKey, ready } = useScopeFilter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [sortBy, setSortBy] = useState<
    "name_asc" | "name_desc" | "status" | "last_recent" | "last_old" | "ltv_desc" | "ltv_asc"
  >("name_asc");
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkPlanId, setBulkPlanId] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkBonusOpen, setBulkBonusOpen] = useState(false);
  const [migrateOpen, setMigrateOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [alertasPlanosOpen, setAlertasPlanosOpen] = useState(false);

  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);

  const { data: monthPayments = [] } = useQuery({
    queryKey: ["studio-month-payments", scopeKey, currentMonth],
    enabled: ready,
    queryFn: async () => {
      let q = supabase
        .from("payments")
        .select("id,amount,payment_date,due_date,reference_month,status,student_id")
        .is("deleted_at", null)
        .eq("status", "paid")
        .or(`reference_month.eq.${currentMonth},payment_date.gte.${currentMonth}-01`);
      if (scopeId) q = q.eq("user_id", scopeId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Array<{
        id: string;
        amount: number;
        payment_date: string;
        due_date: string | null;
        reference_month: string;
        status: string;
        student_id: string;
      }>;
    },
    staleTime: 60_000,
  });

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students-list", scopeKey],
    enabled: ready,
    queryFn: async () => {
      let q = supabase
        .from("students")
        .select("id,name,email,phone,notes,status,created_at,birth_date,account_user_id,attendance_offset,bonus_checkins_balance,payments(id,amount,payment_date,due_date,reference_month,status,checkin_quota_override,plans(name,billing_cycle,price,checkin_quota_type,checkin_quota_amount,package_valid_days)),student_plan_history(id,is_current,start_date,end_date,plans(name,price,billing_cycle))")
        .is("deleted_at", null)
        .order("name");
      if (scopeId) q = q.eq("user_id", scopeId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
    staleTime: 30_000,
    refetchInterval: 5 * 60 * 1000,
  });

  const activeStudents = useMemo(() => {
    return (students || []).filter((s) => {
      const effectiveStatus = (s.bonus_checkins_balance ?? 0) > 0 ? "active" : (s.status ?? "inactive");
      return effectiveStatus === "active";
    });
  }, [students]);

  const receitaMesAtual = useMemo(() => {
    return monthPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
  }, [monthPayments]);

  const ticketMedio = useMemo(() => {
    if (monthPayments.length > 0) {
      return receitaMesAtual / monthPayments.length;
    }
    if (activeStudents.length > 0 && receitaMesAtual > 0) {
      return receitaMesAtual / activeStudents.length;
    }
    return 0;
  }, [receitaMesAtual, monthPayments, activeStudents]);

  const alunosVencendo = useMemo(() => {
    return (students || [])
      .filter((s) => {
        const effectiveStatus = (s.bonus_checkins_balance ?? 0) > 0 ? "active" : (s.status ?? "inactive");
        if (effectiveStatus !== "active") return false;
        const info = getStudentPlanExpiration(s);
        return info.diasParaVencer !== null && info.diasParaVencer <= 8 && info.diasParaVencer >= -5;
      })
      .map((s) => ({
        student: s,
        ...getStudentPlanExpiration(s),
      }))
      .sort((a, b) => (a.diasParaVencer ?? 999) - (b.diasParaVencer ?? 999));
  }, [students]);

  // Alunos com plano por pacote — só para eles buscamos os check-ins.
  const packageStudentIds = useMemo(
    () =>
      (students || [])
        .filter((s) =>
          s &&
          (s.payments ?? []).some(
            (p) => p && p.status === "paid" && p.plans?.checkin_quota_type === "package",
          ),
        )
        .map((s) => s.id)
        .filter(Boolean),
    [students],
  );

  const { data: checkinDates = {} } = useQuery({
    queryKey: ["students-package-attendance", packageStudentIds.join(",")],
    enabled: packageStudentIds.length > 0,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await supabase
        .from("class_attendance")
        .select("student_id, class_sessions:session_id (session_date)")
        .in("student_id", packageStudentIds);
      const map: Record<string, string[]> = {};
      for (const r of (data ?? []) as any[]) {
        const d = r?.class_sessions?.session_date;
        if (!d || !r?.student_id) continue;
        (map[r.student_id] ??= []).push(d);
      }
      return map;
    },
  });

  const checkinByStudent = useMemo(() => {
    const out = new Map<string, { remaining: number; quota: number }>();
    if (!students || !packageStudentIds.length) return out;
    for (const id of packageStudentIds) {
      const s = students.find((x) => x && x.id === id);
      if (!s) continue;
      try {
        const alloc = allocateCheckins(s.payments ?? [], checkinDates[id] ?? []);
        const today = new Date().toISOString().slice(0, 10);
        const entries = [...alloc.entries()]
          .map(([pid, pkg]) => ({ pid, pkg }))
          .sort((a, b) => ((a.pkg?.validUntil ?? "9999") < (b.pkg?.validUntil ?? "9999") ? -1 : 1));
        const active =
          entries.find(
            (e) =>
              e.pkg &&
              e.pkg.quota - (e.pkg.used?.length || 0) > 0 &&
              (!e.pkg.validUntil || e.pkg.validUntil >= today),
          ) ?? entries[entries.length - 1];
        if (active && active.pkg) {
          out.set(id, {
            remaining: Math.max(0, active.pkg.quota - (active.pkg.used?.length || 0)),
            quota: active.pkg.quota || 0,
          });
        }
      } catch (err) {
        console.warn("Erro calculando checkins do aluno", id, err);
      }
    }
    return out;
  }, [students, packageStudentIds, checkinDates]);


  const { data: plans = [] } = useQuery({
    queryKey: ["plans-active"],
    queryFn: async () => {
      const { data } = await supabase.from("plans").select("id,name,price").eq("is_active", true).order("name");
      return data ?? [];
    },
  });

  const { data: birthdayStudents = [] } = useQuery({
    queryKey: ["birthday-students-page", scopeKey],
    enabled: ready,
    queryFn: async () => {
      const currentMonth = new Date().getMonth() + 1;
      let q = supabase
        .from("students")
        .select("id,name,email,phone,birth_date,status")
        .is("deleted_at", null)
        .not("birth_date", "is", null)
        .order("birth_date");
      if (scopeId) q = q.eq("user_id", scopeId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).filter((s) => {
        if (!s.birth_date) return false;
        const month = new Date(s.birth_date + "T12:00").getMonth() + 1;
        return month === currentMonth;
      });
    },
  });

  const rows = useMemo(() => {
    return (students || [])
      .filter((s) => {
        if (!s) return false;
        if (status === "all") return true;
        // Alunos com check-in de bônus ativo (> 0) possuem crédito no sistema e permanecem ativos
        const effectiveStatus = (s.bonus_checkins_balance ?? 0) > 0 ? "active" : (s.status ?? "inactive");
        return effectiveStatus === status;
      })
      .filter((s) => matchesSearchTerms([s.name, s.email, s.phone], search))
      .map((s) => {
        const paid = (s.payments || []).filter((p) => p && p.amount);
        const total = paid.reduce((a, p) => a + Number(p.amount || 0), 0);
        const dates = paid.map((p) => p.payment_date).filter(Boolean).sort();
        const current = (s.student_plan_history || []).find((h) => h && h.is_current);
        const effectiveStatus = (s.bonus_checkins_balance ?? 0) > 0 ? "active" : (s.status ?? "inactive");
        return {
          ...s,
          name: s.name || "Aluno",
          status: effectiveStatus,
          total,
          count: paid.length,
          first: dates[0] || null,
          last: dates[dates.length - 1] || null,
          avg: paid.length ? total / paid.length : 0,
          plan: current?.plans?.name ?? null,
        };
      })
      .sort((a, b) => {
        const statusRank: Record<string, number> = { active: 0, inactive: 1, churned: 2 };
        switch (sortBy) {
          case "name_desc": return (b.name || "").localeCompare(a.name || "", "pt-BR");
          case "status":    return (statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9) || (a.name || "").localeCompare(b.name || "", "pt-BR");
          case "last_recent": return (b.last ?? "").localeCompare(a.last ?? "");
          case "last_old":    return (a.last ?? "9999").localeCompare(b.last ?? "9999");
          case "ltv_desc":  return b.total - a.total;
          case "ltv_asc":   return a.total - b.total;
          case "name_asc":
          default:          return (a.name || "").localeCompare(b.name || "", "pt-BR");
        }
      });
  }, [students, search, status, sortBy]);

  async function remove(id: string) {
    const s = students.find((x) => x.id === id);
    if (!(await confirmDialog(`Excluir "${s?.name ?? "este aluno"}"? O aluno vai para a Lixeira e pode ser restaurado depois.`))) return;
    const { error, count } = await supabase
      .from("students")
      .update({ deleted_at: new Date().toISOString() }, { count: "exact" })
      .eq("id", id)
      .is("deleted_at", null);
    if (error) return toast.error(error.message);
    if (!count) {
      return toast.error("Nada foi excluído (permissão negada).");
    }
    toast.success("Aluno movido para a Lixeira");
    qc.invalidateQueries({ queryKey: ["students-list", scopeKey] });
  }

  async function handleBulkPlanChange() {
    if (!bulkPlanId) return;
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;
    const today = new Date().toISOString().slice(0, 10);
    const ids = [...selected];
    let okCount = 0;
    const errs: string[] = [];
    for (const studentId of ids) {
      await supabase
        .from("student_plan_history")
        .update({ end_date: today, is_current: false })
        .eq("student_id", studentId)
        .eq("is_current", true);
      const { error } = await supabase.from("student_plan_history").insert({
        user_id: userId,
        student_id: studentId,
        plan_id: bulkPlanId,
        start_date: today,
        is_current: true,
      });
      if (error) errs.push(error.message); else okCount++;
    }
    setBulkOpen(false);
    setSelected(new Set());
    setBulkPlanId("");
    qc.invalidateQueries({ queryKey: ["students-list", scopeKey] });
    if (okCount) toast.success(`Plano atualizado para ${okCount} aluno(s)`);
    if (errs.length) toast.error(`${errs.length} erro(s) ao atualizar plano`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={PageIcon}
        eyebrow="Studio"
        title="Alunos"
        description={`${rows.length} aluno(s) cadastrado(s)`}
        actions={
          <Button data-testid="button-new-student" className="w-full sm:w-auto" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" /> Novo aluno
          </Button>
        }
      />

      {/* KPI Cards Rápidos dos Alunos do Studio */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total de Alunos Ativos */}
        <Card className="p-4 bg-card/70 border-border/70 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total de Alunos Ativos
          </p>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {activeStudents.length}
            </p>
            <Badge variant="secondary" className="text-xs font-bold bg-primary/10 text-primary border-0">
              {students.length} CADASTRADOS
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Alunos matriculados no Studio
          </p>
        </Card>

        {/* Card 2: Receita do Mês Atual */}
        <Card className="p-4 bg-card/70 border-border/70 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Receita do Mês Atual
          </p>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {formatBRL(receitaMesAtual)}
            </p>
            <Badge variant="outline" className="text-xs font-bold text-foreground bg-muted/40">
              {monthPayments.length} PAGOS
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Mês vigente ({new Date().toLocaleDateString("pt-BR", { month: "short", year: "numeric" })})
          </p>
        </Card>

        {/* Card 3: Ticket Médio */}
        <Card className="p-4 bg-card/70 border-border/70 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Ticket Médio
          </p>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {formatBRL(ticketMedio)}
            </p>
            <Badge variant="secondary" className="text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0">
              MÉDIA
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Média por mensalidade no mês
          </p>
        </Card>

        {/* Card 4: Planos à Vencer */}
        <Card
          onClick={() => setAlertasPlanosOpen(true)}
          className={cn(
            "p-4 transition-all cursor-pointer relative overflow-hidden group space-y-1 select-none",
            alunosVencendo.length > 0
              ? "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/40 hover:border-amber-500 hover:shadow-md"
              : "bg-card/70 border-border/70 hover:border-primary/40 hover:bg-card/90"
          )}
          title="Clique para ver detalhes dos planos que vencem em menos de 8 dias"
        >
          <div className="flex items-center justify-between">
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5",
                alunosVencendo.length > 0
                  ? "text-amber-700 dark:text-amber-400 font-bold"
                  : "text-muted-foreground"
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>A Vencer (&lt; 8 dias)</span>
            </p>
            {alunosVencendo.length > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {alunosVencendo.length}
            </p>
            {alunosVencendo.length > 0 && (
              <Badge variant="outline" className="text-[10px] uppercase font-bold border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/15">
                Ver alertas
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground flex items-center justify-between pt-0.5">
            <span>Clique para abrir lista</span>
            <span className="text-primary font-medium group-hover:translate-x-0.5 transition-transform text-[10px]">
              Abrir →
            </span>
          </p>
        </Card>
      </div>

      {birthdayStudents.length > 0 && (
        <Card className="relative overflow-hidden border-accent/30 bg-gradient-to-br from-accent/10 via-card to-primary/10 p-4 sm:p-5">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/20 blur-2xl" aria-hidden />
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-base">🎂</span>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight text-foreground">
                {birthdayStudents.length} aniversariante(s) este mês
              </div>
              <div className="text-[11px] text-muted-foreground">Envie uma mensagem rápida</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {birthdayStudents.map((s) => {
              const day = new Date(s.birth_date + "T12:00").getDate();
              const isToday = day === new Date().getDate();
              const msg = encodeURIComponent(
                `Feliz aniversário, ${s.name}! 🎂 Desejamos um dia incrível!`
              );
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-2.5 py-1.5 text-xs shadow-sm backdrop-blur transition-colors duration-200 hover:border-accent/50 hover:bg-card"
                >
                  <span aria-hidden>{isToday ? "🎉" : "🎂"}</span>
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span className="text-muted-foreground">dia {day}</span>
                  {s.phone && (
                    <a
                      href={`https://wa.me/55${s.phone.replace(/\D/g, "")}?text=${msg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${s.name}`}
                      className="ml-1 grid h-7 w-7 place-items-center rounded-full bg-success/15 text-success outline-none transition-all duration-200 hover:bg-success/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background active:scale-95"
                    >
                      💬
                    </a>
                  )}
                  {s.email && (
                    <a
                      href={`mailto:${s.email}?subject=Feliz%20Anivers%C3%A1rio!&body=${msg}`}
                      aria-label={`Email ${s.name}`}
                      className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary outline-none transition-all duration-200 hover:bg-primary/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background active:scale-95"
                    >
                      📧
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card className="p-3 sm:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <div className="relative flex-1 sm:min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              data-testid="input-search-students"
              type="search"
              inputMode="search"
              placeholder="Buscar por nome ou email..."
              className="h-11 pl-9 text-base sm:h-10 sm:text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger data-testid="select-status-filter" className="h-11 w-full sm:h-10 sm:w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
              <SelectItem value="churned">Desligado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="h-11 w-full sm:h-10 sm:w-[220px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Nome (A-Z)</SelectItem>
              <SelectItem value="name_desc">Nome (Z-A)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="last_recent">Último pagto (recente)</SelectItem>
              <SelectItem value="last_old">Último pagto (antigo)</SelectItem>
              <SelectItem value="ltv_desc">LTV (maior)</SelectItem>
              <SelectItem value="ltv_asc">LTV (menor)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selected.size > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-2 text-sm">
            <span className="font-medium">{selected.size} aluno(s) selecionado(s)</span>
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setBulkBonusOpen(true)}
            >
              <Gift className="h-4 w-4" /> Conceder bônus em massa
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setBulkOpen(true)}>Alterar plano</Button>
            <Button size="sm" variant="outline" onClick={() => setBulkEditOpen(true)}>Editar informações</Button>
            <Button size="sm" variant="outline" onClick={() => setMigrateOpen(true)}>Migrar para PT</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Limpar seleção</Button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {/* Mobile skeleton cards */}
            <div className="space-y-2 md:hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-card p-3.5 shadow-card">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-44" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="ml-auto h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop skeleton table */}
            <div className="hidden md:block">
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b px-4 py-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title="Nenhum aluno encontrado"
            description="Adicione seu primeiro aluno para começar"
            action={<Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> Novo aluno</Button>}
          />
        ) : (
          <>
            {/* Mobile: cards */}
            <ul className="space-y-2 md:hidden">
              {rows.map((s) => (
                <li key={s.id} className={cn(
                  "rounded-xl border p-3.5 shadow-card transition-ui hover:shadow-float",
                  s.status === "active" ? "bg-accent/10 border-accent/20 text-foreground hover:border-accent/30" :
                  s.status === "inactive" ? "bg-state-pending-soft/40 border-state-pending/10 text-state-pending hover:border-state-pending/25" :
                  s.status === "churned" ? "bg-state-late-soft/40 border-state-late/10 text-state-late hover:border-state-late/25" :
                  s.status === "paused" ? "bg-state-frozen-soft/40 border-state-frozen/10 text-state-frozen hover:border-state-frozen/25" :
                  "bg-card border-border hover:border-primary/25"
                )}>
                  <div className="flex items-start gap-2">
                    <label className="flex min-h-[44px] min-w-[44px] -m-1.5 p-1.5 items-center justify-center cursor-pointer">
                      <input
                        type="checkbox"
                        aria-label={`Selecionar ${s.name}`}
                        className="h-4 w-4 shrink-0 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                        checked={selected.has(s.id)}
                        onChange={(e) => {
                          setSelected((prev) => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(s.id); else next.delete(s.id);
                            return next;
                          });
                        }}
                      />
                    </label>
                    <Link
                      to="/students/$id"
                      params={{ id: s.id }}
                      search={{ tab: "overview" }}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {initials(s.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-primary">{s.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{s.email ?? "—"}</div>
                      </div>
                    </Link>

                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <StudentStatusBadge status={s.status} />
                    {(s.bonus_checkins_balance ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
                        <Gift className="h-3 w-3" />
                        {s.bonus_checkins_balance} bônus
                      </span>
                    )}
                    <PlanBadge name={s.plan} />
                    <CheckinChip data={checkinByStudent.get(s.id)} />
                    <span className="text-numeric ml-auto font-semibold">{formatBRL(s.total)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
                    <span className="text-[11px] text-muted-foreground">
                      Último: {s.last ? formatDateBR(s.last) : "—"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Excluir ${s.name}`}
                      className="h-11 w-11 transition-all duration-200 active:scale-[0.95]"
                      onClick={() => remove(s.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>


                </li>
              ))}
            </ul>

            {/* Desktop: table */}
            <div className="hidden md:block">
              <Table data-testid="table-students">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <label className="flex min-h-[36px] min-w-[36px] items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          aria-label="Selecionar todos os alunos"
                          className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                          checked={rows.length > 0 && selected.size === rows.length}
                          onChange={(e) => setSelected(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set())}
                        />
                      </label>
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">LTV</TableHead>
                    <TableHead>Último</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((s) => (
                    <TableRow 
                      key={s.id}
                      data-testid={`student-row-${s.id}`}
                      className={cn(
                        "group/row transition-colors duration-200 hover:bg-muted/40",
                        s.status === "active" ? "bg-accent/5 text-foreground" :
                        s.status === "inactive" ? "bg-state-pending-soft/20 text-state-pending/90" :
                        s.status === "churned" ? "bg-state-late-soft/20 text-state-late/90" :
                        s.status === "paused" ? "bg-state-frozen-soft/20 text-state-frozen/90" :
                        ""
                      )}
                    >
                      <TableCell className="w-10">
                        <label className="flex min-h-[36px] min-w-[36px] items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            aria-label={`Selecionar ${s.name}`}
                            className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                            checked={selected.has(s.id)}
                            onChange={(e) => {
                              setSelected((prev) => {
                                const next = new Set(prev);
                                if (e.target.checked) next.add(s.id); else next.delete(s.id);
                                return next;
                              });
                            }}
                          />
                        </label>
                      </TableCell>
                      <TableCell>
                        <Link
                          to="/students/$id"
                          params={{ id: s.id }}
                          search={{ tab: "overview" }}
                          className="group flex items-center gap-3 rounded-lg text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary transition-colors duration-200 group-hover:bg-primary/15">
                            {initials(s.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-primary group-hover:underline">{s.name}</div>
                            <div className="text-xs text-muted-foreground">{s.email ?? "—"}</div>
                          </div>
                        </Link>

                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <PlanBadge name={s.plan} />
                          <CheckinChip data={checkinByStudent.get(s.id)} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <StudentStatusBadge status={s.status} />
                          {(s.bonus_checkins_balance ?? 0) > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-500/20" title={`${s.bonus_checkins_balance} check-ins bônus disponíveis`}>
                              <Gift className="h-3 w-3" />
                              {s.bonus_checkins_balance}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-numeric text-right">{formatBRL(s.total)}</TableCell>
                      <TableCell className="font-mono text-xs">{s.last ? formatDateBR(s.last) : "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to="/students/$id"
                            params={{ id: s.id }}
                            search={{ tab: "overview" }}
                            aria-label={`Abrir perfil de ${s.name}`}
                            className="rounded-md p-2 text-muted-foreground opacity-0 transition-all duration-200 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/row:opacity-100"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Excluir ${s.name}`}
                            className="transition-all duration-200 active:scale-[0.95]"
                            onClick={() => remove(s.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>



                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </Card>

      <StudentDialog open={open} onOpenChange={setOpen} student={editing} />

      <BulkStudentEditDialog
        open={bulkEditOpen}
        onOpenChange={setBulkEditOpen}
        selectedIds={[...selected]}
        onDone={() => setSelected(new Set())}
      />

      <BulkGrantBonusDialog
        open={bulkBonusOpen}
        onOpenChange={setBulkBonusOpen}
        selectedIds={[...selected]}
        onDone={() => setSelected(new Set())}
      />

      <MigrateStudentsDialog
        open={migrateOpen}
        onOpenChange={setMigrateOpen}
        ids={[...selected]}
        direction="studio_to_pt"
        onDone={() => setSelected(new Set())}
      />

      <AlertDialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterar plano em massa</AlertDialogTitle>
            <AlertDialogDescription>
              Isso encerrará o plano atual de {selected.size} aluno(s) selecionado(s) e iniciará o novo plano a partir de hoje.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Select value={bulkPlanId} onValueChange={setBulkPlanId}>
              <SelectTrigger><SelectValue placeholder="Selecione um plano" /></SelectTrigger>
              <SelectContent>
                {plans.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name} — {formatBRL(Number(p.price))}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkPlanChange} disabled={!bulkPlanId}>
              Aplicar a {selected.size} aluno(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Alertas de Planos a Vencer (< 8 dias) */}
      <Dialog open={alertasPlanosOpen} onOpenChange={setAlertasPlanosOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="p-5 pb-3 border-b border-border/70 bg-card">
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                <Clock className="h-5 w-5 text-amber-500" />
                <span>Alertas de Planos a Vencer (&lt; 8 dias)</span>
              </DialogTitle>
              <Badge variant="outline" className="text-xs font-bold border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/15">
                {alunosVencendo.length} {alunosVencendo.length === 1 ? "aluno" : "alunos"}
              </Badge>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Alunos do Studio com mensalidades ou vigência de planos com vencimento próximo ou recém-vencido.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {alunosVencendo.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-xl">
                  🎉
                </div>
                <p className="text-sm font-semibold text-foreground">Nenhum plano a vencer nos próximos 8 dias</p>
                <p className="text-xs text-muted-foreground">Todos os alunos ativos do Studio estão com seus planos em dia.</p>
              </div>
            ) : (
              alunosVencendo.map(({ student, expirationDate, diasParaVencer, planName }) => {
                const isOverdue = diasParaVencer !== null && diasParaVencer < 0;
                const isToday = diasParaVencer === 0;
                const msg = encodeURIComponent(
                  `Olá ${student.name}, tudo bem? Passando para lembrar que a vigência do seu plano "${planName}" vence ${
                    isToday ? "hoje" : expirationDate ? `em ${formatDateBR(expirationDate)}` : "em breve"
                  }. Podemos já agendar sua renovação? 💪`
                );

                return (
                  <div
                    key={student.id}
                    className="p-3.5 rounded-xl border border-border/70 bg-card/60 hover:bg-card hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {initials(student.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground truncate">
                          {student.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <span className="font-medium text-foreground/80">{planName}</span>
                          {expirationDate && (
                            <>
                              <span>•</span>
                              <span>Vencimento: <strong className="text-foreground">{formatDateBR(expirationDate)}</strong></span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {isOverdue ? (
                        <Badge variant="destructive" className="text-[11px] font-bold">
                          Venceu há {Math.abs(diasParaVencer)} d
                        </Badge>
                      ) : isToday ? (
                        <Badge className="bg-amber-600 text-white text-[11px] font-bold">
                          Vence hoje
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[11px] font-bold border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10">
                          Vence em {diasParaVencer} dias
                        </Badge>
                      )}

                      {student.phone && (
                        <a
                          href={`https://wa.me/55${student.phone.replace(/\D/g, "")}?text=${msg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-success/30 bg-success/10 text-success text-xs font-semibold hover:bg-success/20 transition-all active:scale-95"
                          title={`Enviar lembrete para ${student.name} no WhatsApp`}
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      )}

                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs px-2.5 gap-1 font-semibold hover:bg-primary/10 hover:text-primary active:scale-95"
                        onClick={() => setAlertasPlanosOpen(false)}
                      >
                        <Link to="/students/$id" params={{ id: student.id }} search={{ tab: "overview" }}>
                          <span>Ficha</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3.5 bg-muted/30 border-t border-border/70 flex items-center justify-between gap-2">
            {alunosVencendo.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => {
                  if (alunosVencendo[0]) {
                    setSearch(alunosVencendo[0].student.name);
                  }
                  setAlertasPlanosOpen(false);
                }}
              >
                <Filter className="h-3.5 w-3.5 text-primary" />
                <span>Buscar na lista</span>
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto text-xs"
              onClick={() => setAlertasPlanosOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <TrainingTimerDialog open={timerOpen} onOpenChange={setTimerOpen} />
    </div>
  );
}

/** Chip compacto de check-ins restantes do pacote vigente. */
function CheckinChip({ data }: { data?: { remaining: number; quota: number } }) {
  if (!data || data.quota <= 0) return null;
  const tone = checkinTone(data.remaining, data.quota);
  return (
    <span
      title={`${data.remaining} de ${data.quota} check-ins restantes`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5",
        "text-[11px] font-semibold leading-none tabular-nums",
        checkinChipClass(tone),
      )}
    >
      <Ticket className="h-3 w-3" />
      {data.remaining}/{data.quota}
    </span>
  );
}

