import { chartTooltip } from "@/lib/chart-theme";
import {
  Receipt,
  FileSpreadsheet,
  FileText,
  Download,
  Activity,
  BarChart3,
  Dumbbell,
} from "lucide-react";

import { Wallet as PageIcon } from "lucide-react";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { createFileRoute } from "@tanstack/react-router";
import { confirmDialog } from "@/lib/confirm-dialog";
import { exportDreToExcel, exportDreToPdf } from "@/lib/dre-export";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Scale,
  Wallet,
  Search,
  Repeat,
  Building2,
  Store,
  UserCheck,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KPICard } from "@/components/edufinance/KPICard";
import { useModules } from "@/hooks/use-modules";
import { StudioAnalyticsPanel } from "@/components/financeiro/StudioAnalyticsPanel";
import { PtAnalyticsPanel } from "@/components/financeiro/PtAnalyticsPanel";
import { Skeleton } from "@/components/ui/skeleton";

import { EmptyState } from "@/components/edufinance/EmptyState";
import { ExpenseDialog } from "@/components/financeiro/ExpenseDialog";
import { ExpenseRenewalDialog } from "@/components/financeiro/ExpenseRenewalDialog";
import { ExpenseSearchDialog } from "@/components/financeiro/ExpenseSearchDialog";
import { ExportExpensesDialog } from "@/components/financeiro/ExportExpensesDialog";
import { MonthYearPicker } from "@/components/edufinance/MonthYearPicker";
import {
  formatBRL,
  formatDateBR,
  currentMonthKey,
  addMonths,
  formatMonthLabel,
} from "@/lib/format";
import { useScopeFilter } from "@/hooks/use-scope-filter";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye } from "lucide-react";
import { SortableChartCard, HiddenChartChips } from "@/components/edufinance/SortableChartCard";

type FinanceTab = "overview" | "expenses" | "dre" | "cashflow" | "studio" | "pt";

export const Route = createFileRoute("/_authenticated/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro — EduFinance" }] }),
  validateSearch: (s: Record<string, unknown>): { tab?: FinanceTab } => {
    const t = s.tab;
    const allowed: FinanceTab[] = ["overview", "expenses", "dre", "cashflow", "studio", "pt"];
    return typeof t === "string" && (allowed as string[]).includes(t)
      ? { tab: t as FinanceTab }
      : {};
  },
  component: FinanceiroPage,
});


const SEGMENT_LABELS: Record<string, string> = {
  general: "Geral",
  studio: "Studio",
  pt: "Personal Trainer",
};

// Paleta dos gráficos vinda dos tokens do design system (dark mode de graça).
const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-6)",
  "var(--color-chart-8)",
  "var(--color-chart-7)",
  "var(--color-muted-foreground)",
];

type ExpenseRow = {
  id: string;
  category_id: string | null;
  description: string;
  amount: number;
  expense_date: string;
  reference_month: string;
  segment: string;
  type: string;
  expense_categories: {
    name: string;
    icon: string | null;
    color: string | null;
    segment: string;
    type: string;
  } | null;
};

function SortableKPICard({ id, onHide, ...props }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="min-w-0 max-w-full">
      <KPICard
        {...props}
        onHide={onHide}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

function FinanceiroPage() {
  const qc = useQueryClient();
  const navigate = Route.useNavigate();
  const { tab: tabParam } = Route.useSearch();
  const { hasModule, loading: modulesLoading } = useModules();
  const tab: FinanceTab = tabParam ?? "overview";
  const setTab = (v: string) =>
    navigate({ search: { tab: v as FinanceTab }, replace: true });
  const { scopeId, scopeKey, ready } = useScopeFilter();

  const [month, setMonth] = useState(currentMonthKey());
  const [segment, setSegment] = useState("all");
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [renewalOpen, setRenewalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [exportExpensesOpen, setExportExpensesOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseRow | null>(null);

  async function handleDuplicateExpense(exp: ExpenseRow) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Usuário não autenticado.");

      // Data presente exata em que o botão é apertado
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonthStr = String(today.getMonth() + 1).padStart(2, "0");
      const currentDayStr = String(today.getDate()).padStart(2, "0");
      const todayIso = `${currentYear}-${currentMonthStr}-${currentDayStr}`;
      const targetRefMonth = `${currentYear}-${currentMonthStr}`;

      const newExpense = {
        user_id: userId,
        category_id: exp.category_id,
        description: exp.description,
        amount: Number(exp.amount),
        expense_date: todayIso,
        reference_month: targetRefMonth,
        segment: exp.segment || "general",
        type: exp.type || "variable",
        recurrent: true,
        notes: exp.notes ? `${exp.notes} (Renovado de ${exp.reference_month})` : `(Renovado de ${exp.reference_month})`,
      };

      const { error } = await supabase.from("expenses").insert(newExpense as any);
      if (error) throw error;

      toast.success(
        `"${exp.description}" renovada com sucesso para hoje (${formatDateBR(todayIso)}) em ${formatMonthLabel(targetRefMonth)}!`
      );
      qc.invalidateQueries({ queryKey: ["expenses-all"] });
    } catch (err: any) {
      toast.error(err?.message || "Erro ao renovar despesa.");
    }
  }

  const [kpiOrder, setKpiOrder] = useLocalStorage<string[]>(
    "financeiro.kpiOrder",
    ["revenue", "expenses", "fixed", "variable", "profit", "margin"]
  );
  const [hiddenKpis, setHiddenKpis] = useLocalStorage<string[]>(
    "financeiro.hiddenKpis",
    []
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setKpiOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function toggleKpi(id: string) {
    setHiddenKpis((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  const [chartOrder, setChartOrder] = useLocalStorage<string[]>(
    "financeiro.chartOrder",
    ["rev-exp", "profit", "categories", "balance"]
  );
  const [hiddenCharts, setHiddenCharts] = useLocalStorage<string[]>(
    "financeiro.hiddenCharts",
    []
  );

  function handleChartDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setChartOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        if (oldIndex < 0 || newIndex < 0) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function toggleChart(id: string) {
    setHiddenCharts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }


  const { data: allExpenses = [] } = useQuery({
    queryKey: ["expenses-all", scopeKey],
    enabled: ready,
    queryFn: async () => {
      let all: ExpenseRow[] = [];
      let from = 0;
      let pages = 0;
      while (pages < 20) {
        pages++;
        let q = supabase
          .from("expenses")
          .select("*,expense_categories(name,icon,color,segment,type)")
          .order("expense_date", { ascending: false })
          .range(from, from + 999);
        if (scopeId) q = q.eq("user_id", scopeId);
        const { data, error } = await q;
        if (error) throw error;
        all = all.concat((data ?? []) as unknown as ExpenseRow[]);
        if (!data || data.length < 1000) break;
        from += 1000;
      }
      return all;
    },
  });

  const { data: allPayments = [] } = useQuery({
    queryKey: ["payments-financeiro", scopeKey],
    enabled: ready,
    queryFn: async () => {
      let all: { amount: number; reference_month: string | null; payment_date: string | null }[] = [];
      let from = 0;
      let pages = 0;
      while (pages < 20) {
        pages++;
        let q = supabase
          .from("payments")
          .select("amount,reference_month,payment_date,status")
          .is("deleted_at", null)
          .eq("status", "paid")
          .range(from, from + 999);
        if (scopeId) q = q.eq("user_id", scopeId);
        const { data, error } = await q;
        if (error) throw error;
        all = all.concat((data ?? []) as any[]);
        if (!data || data.length < 1000) break;
        from += 1000;
      }
      return all;
    },
  });

  const { data: allPtPayments = [] } = useQuery({
    queryKey: ["pt-payments-financeiro", scopeKey],
    enabled: ready,
    queryFn: async () => {
      let all: { amount: number; reference_month: string | null; payment_date: string | null }[] = [];
      let from = 0;
      let pages = 0;
      while (pages < 20) {
        pages++;
        let q = supabase
          .from("pt_payments")
          .select("amount,reference_month,payment_date,status")
          .eq("status", "paid")
          .is("deleted_at", null)
          .range(from, from + 999);
        if (scopeId) q = q.eq("user_id", scopeId);
        const { data, error } = await q;
        if (error) throw error;
        all = all.concat((data ?? []) as any[]);
        if (!data || data.length < 1000) break;
        from += 1000;
      }
      return all;
    },
  });


  const monthExpenses = useMemo(
    () =>
      allExpenses.filter((e) => {
        if (e.reference_month !== month) return false;
        if (segment !== "all" && e.segment !== segment) return false;
        return true;
      }),
    [allExpenses, month, segment],
  );

  // Despesas puras do mês de referência para a visualização segmentada por cards
  const rawMonthExpenses = useMemo(
    () => allExpenses.filter((e) => e.reference_month === month),
    [allExpenses, month],
  );

  const segmentExpenses = useMemo(() => {
    const general = rawMonthExpenses.filter((e) => e.segment === "general" || !e.segment);
    const studio = rawMonthExpenses.filter((e) => e.segment === "studio");
    const pt = rawMonthExpenses.filter((e) => e.segment === "pt");

    const sumAmt = (list: ExpenseRow[]) => list.reduce((s, e) => s + Number(e.amount || 0), 0);
    const sumFix = (list: ExpenseRow[]) => list.filter((e) => e.type === "fixed").reduce((s, e) => s + Number(e.amount || 0), 0);
    const sumVar = (list: ExpenseRow[]) => list.filter((e) => e.type === "variable").reduce((s, e) => s + Number(e.amount || 0), 0);

    const totalGen = sumAmt(general);
    const totalStu = sumAmt(studio);
    const totalPt = sumAmt(pt);
    const totalAll = totalGen + totalStu + totalPt;

    const pctGen = totalAll > 0 ? (totalGen / totalAll) * 100 : 0;
    const pctStu = totalAll > 0 ? (totalStu / totalAll) * 100 : 0;
    const pctPt = totalAll > 0 ? (totalPt / totalAll) * 100 : 0;

    const segmentsMeta = [
      {
        key: "general" as const,
        label: "Gerais",
        title: "Despesas Gerais",
        subtitle: "Custos corporativos, softwares, contabilidade e despesas não atribuídas",
        icon: Building2,
        color: "text-sky-500",
        badgeBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
        barColor: "bg-sky-500",
        expenses: general,
        total: totalGen,
        pct: pctGen,
        fixas: sumFix(general),
        variaveis: sumVar(general),
        count: general.length,
      },
      {
        key: "studio" as const,
        label: "Studio",
        title: "Despesas do Studio",
        subtitle: "Aluguel, manutenção de maquinários, energia, limpeza e custos do espaço físico",
        icon: Store,
        color: "text-emerald-500",
        badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        barColor: "bg-emerald-500",
        expenses: studio,
        total: totalStu,
        pct: pctStu,
        fixas: sumFix(studio),
        variaveis: sumVar(studio),
        count: studio.length,
      },
      {
        key: "pt" as const,
        label: "Personal Trainer",
        title: "Despesas Personal Trainer",
        subtitle: "Equipamentos individuais, cursos, capacitação técnica e consultoria",
        icon: UserCheck,
        color: "text-amber-500",
        badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
        barColor: "bg-amber-500",
        expenses: pt,
        total: totalPt,
        pct: pctPt,
        fixas: sumFix(pt),
        variaveis: sumVar(pt),
        count: pt.length,
      },
    ];

    const bottleneck = [...segmentsMeta].sort((a, b) => b.total - a.total)[0] || segmentsMeta[0];

    return {
      general,
      studio,
      pt,
      totalAll,
      segmentsMeta,
      bottleneckKey: bottleneck.total > 0 ? bottleneck.key : null,
      bottleneck,
    };
  }, [rawMonthExpenses]);

  // Para pagamentos do Studio, priorizamos reference_month.
  // Para PT, usamos estritamente payment_date para bater 100% com o Dashboard PT.
  const getStudioMonth = (p: any) => p.reference_month || (p.payment_date ? p.payment_date.slice(0, 7) : null);
  const getPtMonth = (p: any) => (p.payment_date ? p.payment_date.slice(0, 7) : p.reference_month);

  const monthRevenue = useMemo(() => {
    const studio = allPayments
      .filter((p) => getStudioMonth(p) === month)
      .reduce((s, p) => s + Number(p.amount), 0);
    const pt = allPtPayments
      .filter((p) => getPtMonth(p) === month)
      .reduce((s, p) => s + Number(p.amount), 0);
    return { studio, pt, total: studio + pt };
  }, [allPayments, allPtPayments, month]);

  const kpis = useMemo(() => {
    const totalExpenses = monthExpenses.reduce((s, e) => s + Number(e.amount), 0);
    const fixedExpenses = monthExpenses
      .filter((e) => e.type === "fixed")
      .reduce((s, e) => s + Number(e.amount), 0);
    const variableExpenses = monthExpenses
      .filter((e) => e.type === "variable")
      .reduce((s, e) => s + Number(e.amount), 0);

    const revenue =
      segment === "pt"
        ? monthRevenue.pt
        : segment === "studio"
          ? monthRevenue.studio
          : monthRevenue.total;

    const profit = revenue - totalExpenses;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return { revenue, totalExpenses, fixedExpenses, variableExpenses, profit, margin };
  }, [monthExpenses, monthRevenue, segment]);

  const monthlySeries = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const m = addMonths(month, i - 11);
      
      let revenue = 0;
      if (segment === "pt" || segment === "all") {
        revenue += allPtPayments
          .filter((p) => getPtMonth(p) === m)
          .reduce((s, p) => s + Number(p.amount), 0);
      }
      if (segment === "studio" || segment === "all") {
        revenue += allPayments
          .filter((p) => getStudioMonth(p) === m)
          .reduce((s, p) => s + Number(p.amount), 0);
      }
      
      const expenses = allExpenses
        .filter(
          (e) => e.reference_month === m && (segment === "all" || e.segment === segment),
        )
        .reduce((s, e) => s + Number(e.amount), 0);
      return {
        label: formatMonthLabel(m),
        receita: revenue,
        despesas: expenses,
        lucro: revenue - expenses,
      };
    });
  }, [month, allPayments, allPtPayments, allExpenses, segment]);

  const byCategory = useMemo(() => {
    const map = new Map<string, { name: string; icon: string; color: string; total: number }>();
    for (const e of monthExpenses) {
      const key = e.category_id ?? "sem-categoria";
      const cur = map.get(key) ?? {
        name: e.expense_categories?.name ?? "Sem categoria",
        icon: e.expense_categories?.icon ?? "📦",
        color: e.expense_categories?.color ?? "var(--color-muted-foreground)",
        total: 0,
      };
      cur.total += Number(e.amount);
      map.set(key, cur);
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [monthExpenses]);

  const dreData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const m = addMonths(month, i - 11);
      const studioRev = allPayments
        .filter((p) => getStudioMonth(p) === m)
        .reduce((s, p) => s + Number(p.amount), 0);
      const ptRev = allPtPayments
        .filter((p) => getPtMonth(p) === m)
        .reduce((s, p) => s + Number(p.amount), 0);
      const totalRev = studioRev + ptRev;
      const fixedExp = allExpenses
        .filter((e) => e.reference_month === m && e.type === "fixed")
        .reduce((s, e) => s + Number(e.amount), 0);
      const varExp = allExpenses
        .filter((e) => e.reference_month === m && e.type === "variable")
        .reduce((s, e) => s + Number(e.amount), 0);
      const totalExp = fixedExp + varExp;
      const profit = totalRev - totalExp;
      const margin = totalRev > 0 ? (profit / totalRev) * 100 : 0;
      return {
        month: m,
        label: formatMonthLabel(m),
        studioRev,
        ptRev,
        totalRev,
        fixedExp,
        varExp,
        totalExp,
        profit,
        margin,
      };
    }).reverse();
  }, [month, allPayments, allPtPayments, allExpenses]);

  async function remove(id: string) {
    if (!(await confirmDialog("Excluir esta despesa?"))) return;
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Despesa excluída");
    qc.invalidateQueries({ queryKey: ["expenses-all", scopeKey] });
  }

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-hidden">
      <PageHeader
        icon={PageIcon}
        eyebrow="Gestão"
        title="Financeiro"
        description="Balanço completo de receitas e despesas"
        actions={
          <div className="flex w-full min-w-0 flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <div className="w-full sm:w-auto min-w-0">
              <MonthYearPicker value={month} onChange={setMonth} />
            </div>
            <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger className="h-11 w-full sm:h-10 sm:w-[190px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🏢 Todos os segmentos</SelectItem>
                  <SelectItem value="studio">🎯 Studio</SelectItem>
                  <SelectItem value="pt">🏋️ Personal Trainer</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="h-11 w-full sm:h-10 sm:w-auto gap-1.5"
                onClick={() => setSearchOpen(true)}
                title="Busca específica de despesas por nome, valor ou período"
              >
                <Search className="h-4 w-4" />
                <span>Buscar</span>
              </Button>
              <Button
                className="h-11 w-full sm:h-10 sm:w-auto"
                onClick={() => {
                  setEditing(null);
                  setExpenseOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Nova despesa
              </Button>
            </div>
            {hiddenKpis.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2 sm:border-l sm:border-t-0 sm:pl-2 sm:pt-0">
                <span className="text-xs font-medium text-muted-foreground">Ocultos:</span>
                {hiddenKpis.map((id) => (
                  <Button
                    key={id}
                    variant="secondary"
                    size="sm"
                    className="h-7 gap-1 px-2 text-[10px]"
                    onClick={() => toggleKpi(id)}
                  >
                    <Eye className="h-3 w-3" />
                    {id === "revenue"
                      ? "Receita"
                      : id === "expenses"
                      ? "Despesas"
                      : id === "fixed"
                      ? "Fixas"
                      : id === "variable"
                      ? "Variáveis"
                      : id === "profit"
                      ? "Lucro"
                      : "Margem"}
                  </Button>
                ))}
              </div>
            )}
          </div>
        }
      />

      {/* KPI Cards */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={kpiOrder} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-6 min-w-0 max-w-full">
            {kpiOrder.map((id) => {
              if (hiddenKpis.includes(id)) return null;

              if (id === "revenue")
                return (
                  <SortableKPICard
                    key={id}
                    id={id}
                    label="Receita"
                    value={formatBRL(kpis.revenue)}
                    icon={<TrendingUp className="h-4 w-4" />}
                    hint={
                      segment === "all" ? "Studio + PT" : SEGMENT_LABELS[segment]
                    }
                    onHide={() => toggleKpi(id)}
                  />
                );

              if (id === "expenses")
                return (
                  <SortableKPICard
                    key={id}
                    id={id}
                    label="Despesas totais"
                    value={formatBRL(kpis.totalExpenses)}
                    icon={<TrendingDown className="h-4 w-4" />}
                    onHide={() => toggleKpi(id)}
                  />
                );

              if (id === "fixed")
                return (
                  <SortableKPICard
                    key={id}
                    id={id}
                    label="Despesas fixas"
                    value={formatBRL(kpis.fixedExpenses)}
                    icon={<Wallet className="h-4 w-4" />}
                    onHide={() => toggleKpi(id)}
                  />
                );

              if (id === "variable")
                return (
                  <SortableKPICard
                    key={id}
                    id={id}
                    label="Despesas variáveis"
                    value={formatBRL(kpis.variableExpenses)}
                    icon={<Wallet className="h-4 w-4" />}
                    onHide={() => toggleKpi(id)}
                  />
                );

              if (id === "profit")
                return (
                  <SortableKPICard
                    key={id}
                    id={id}
                    label={kpis.profit >= 0 ? "Lucro líquido" : "Prejuízo"}
                    value={formatBRL(Math.abs(kpis.profit))}
                    icon={<DollarSign className="h-4 w-4" />}
                    hint={`Margem: ${kpis.margin.toFixed(1)}%`}
                    onHide={() => toggleKpi(id)}
                  />
                );

              if (id === "margin")
                return (
                  <SortableKPICard
                    key={id}
                    id={id}
                    label="Margem"
                    value={`${kpis.margin.toFixed(1)}%`}
                    icon={<Scale className="h-4 w-4" />}
                    hint={kpis.margin >= 0 ? "Positiva" : "Negativa"}
                    onHide={() => toggleKpi(id)}
                  />
                );

              return null;
            })}
          </div>
        </SortableContext>
      </DndContext>

      <Tabs value={tab} onValueChange={setTab} className="min-w-0 max-w-full">
        <div className="w-full max-w-full overflow-x-auto pb-1 [touch-action:pan-x] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="h-auto w-max gap-1 rounded-xl border border-border/60 bg-muted/40 p-1">
            {[
              { v: "overview", label: "Visão Geral", short: "Visão", icon: Wallet },
              { v: "expenses", label: "Despesas", short: "Despesas", icon: Receipt },
              { v: "dre", label: "DRE", short: "DRE", icon: FileSpreadsheet },
              { v: "cashflow", label: "Fluxo de Caixa", short: "Fluxo", icon: Activity },
              ...(!modulesLoading && hasModule("studio")
                ? [{ v: "studio", label: "Análise Studio", short: "Studio", icon: BarChart3 }]
                : []),
              ...(!modulesLoading && hasModule("pt")
                ? [{ v: "pt", label: "Análise PT", short: "PT", icon: Dumbbell }]
                : []),
            ].map((t) => (
              <TabsTrigger
                key={t.v}
                value={t.v}
                className="gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <t.icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.short}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>


        {/* TAB: Visão Geral */}
        <TabsContent value="overview">
          {(() => {
            const chartLabels: Record<string, string> = {
              "rev-exp": "Receita vs Despesas",
              profit: "Lucro líquido",
              categories: "Despesas por categoria",
              balance: "Balanço do mês",
            };

            const renderChart = (id: string) => {
              if (id === "rev-exp")
                return (
                  <SortableChartCard
                    key={id}
                    id={id}
                    title="Receita vs Despesas (12 meses)"
                    onHide={() => toggleChart(id)}
                  >
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlySeries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                          <Tooltip {...chartTooltip} formatter={(v: number) => formatBRL(v)} />
                          <Legend />
                          <Bar dataKey="receita" fill="var(--color-state-paid)" name="Receita" />
                          <Bar dataKey="despesas" fill="var(--color-state-late)" name="Despesas" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </SortableChartCard>
                );

              if (id === "profit")
                return (
                  <SortableChartCard
                    key={id}
                    id={id}
                    title="Lucro líquido (12 meses)"
                    onHide={() => toggleChart(id)}
                  >
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlySeries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                          <Tooltip {...chartTooltip} formatter={(v: number) => formatBRL(v)} />
                          <Line
                            type="monotone"
                            dataKey="lucro"
                            stroke="var(--color-chart-1)"
                            strokeWidth={2}
                            name="Lucro"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </SortableChartCard>
                );

              if (id === "categories")
                return (
                  <SortableChartCard
                    key={id}
                    id={id}
                    title={`Despesas por categoria — ${formatMonthLabel(month)}`}
                    onHide={() => toggleChart(id)}
                  >
                    {byCategory.length === 0 ? (
                      <EmptyState title="Sem despesas neste mês" />
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={byCategory}
                                dataKey="total"
                                nameKey="name"
                                innerRadius={50}
                                outerRadius={90}
                              >
                                {byCategory.map((_c, i) => (
                                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip {...chartTooltip} formatter={(v: number) => formatBRL(v)} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-2">
                          {byCategory.map((c, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-md border p-2 text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <span>{c.icon}</span>
                                <span>{c.name}</span>
                              </div>
                              <span className="font-mono font-medium">{formatBRL(c.total)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </SortableChartCard>
                );

              if (id === "balance")
                return (
                  <SortableChartCard
                    key={id}
                    id={id}
                    title={`Balanço do mês — ${formatMonthLabel(month)}`}
                    onHide={() => toggleChart(id)}
                  >
                    <div className="space-y-1 text-sm">
                      {[
                        { label: "Receita Studio", value: monthRevenue.studio, color: "text-state-paid" },
                        { label: "Receita PT", value: monthRevenue.pt, color: "text-state-paid" },
                        {
                          label: "Total receita",
                          value: monthRevenue.total,
                          color: "text-state-paid",
                          bold: true,
                        },
                        {
                          label: "Despesas fixas",
                          value: -kpis.fixedExpenses,
                          color: "text-destructive",
                        },
                        {
                          label: "Despesas variáveis",
                          value: -kpis.variableExpenses,
                          color: "text-destructive",
                        },
                        {
                          label: "Total despesas",
                          value: -kpis.totalExpenses,
                          color: "text-state-late",
                          bold: true,
                        },
                        {
                          label: "Lucro líquido",
                          value: kpis.profit,
                          color: kpis.profit >= 0 ? "text-state-paid" : "text-destructive",
                          bold: true,
                          separator: true,
                        },
                      ].map((row, i) => (
                        <div key={i}>
                          {row.separator && <hr className="my-2" />}
                          <div className="flex items-center justify-between py-1">
                            <span>{row.label}</span>
                            <span
                              className={`font-mono ${row.color} ${row.bold ? "font-semibold" : ""}`}
                            >
                              {formatBRL(Math.abs(row.value))}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="mt-2 border-t pt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Margem líquida</span>
                          <span
                            className={`font-mono font-semibold ${
                              kpis.margin >= 0 ? "text-state-paid" : "text-destructive"
                            }`}
                          >
                            {kpis.margin.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </SortableChartCard>
                );

              return null;
            };

            return (
              <div className="space-y-3">
                <HiddenChartChips hidden={hiddenCharts} labels={chartLabels} onRestore={toggleChart} />
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleChartDragEnd}>
                  <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {chartOrder.filter((id) => !hiddenCharts.includes(id)).map(renderChart)}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            );
          })()}
        </TabsContent>


        {/* TAB: Despesas com Separação por Cards Próprios e Análise de Gargalos */}
        <TabsContent value="expenses" className="space-y-4">
          {/* Painel Superior: Diagnóstico de Gargalos Financeiros */}
          <Card className="p-3.5 sm:p-5 min-w-0 max-w-full overflow-hidden border-primary/20 bg-card">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    Despesas & Gargalos Financeiros — {formatMonthLabel(month)}
                  </h3>
                  {segmentExpenses.bottleneckKey && (
                    <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 gap-1 text-[11px] font-medium">
                      <AlertTriangle className="h-3 w-3" />
                      Maior Gargalo: {segmentExpenses.bottleneck.label} ({segmentExpenses.bottleneck.pct.toFixed(0)}%)
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Avaliação individual e comparativa de custos entre Gerais, Studio e Personal Trainer para controle preciso de fluxo e gargalos.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8"
                  onClick={() => {
                    setExportDefaultSegment("all");
                    setExportExpensesOpen(true);
                  }}
                  title="Exportar despesas em Excel, PDF, CSV, TXT, Markdown ou JSON"
                >
                  <Download className="h-3.5 w-3.5 text-primary" />
                  <span>Exportar Relatório</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8"
                  onClick={() => setSearchOpen(true)}
                  title="Busca específica por nome, valor ou histórico"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Buscar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8"
                  onClick={() => setRenewalOpen(true)}
                  title="Renovar despesas recorrentes do mês anterior"
                >
                  <Repeat className="h-3.5 w-3.5 text-primary" />
                  <span>Renovar do mês anterior</span>
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 text-xs h-8"
                  onClick={() => {
                    setEditing(null);
                    setExpenseOpen(true);
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Nova despesa</span>
                </Button>
              </div>
            </div>

            {/* 3 Cards de Indicadores de Gargalo por Centro de Custo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {segmentExpenses.segmentsMeta.map((s) => {
                const isBottleneck = segmentExpenses.bottleneckKey === s.key && s.total > 0;
                const isSelected = expenseCardFilter === s.key;
                return (
                  <div
                    key={s.key}
                    onClick={() => setExpenseCardFilter((prev) => (prev === s.key ? "all" : s.key))}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                        : isBottleneck
                        ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60"
                        : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <s.icon className={`h-4 w-4 ${s.color}`} />
                        {s.label}
                      </span>
                      {isBottleneck ? (
                        <Badge variant="destructive" className="text-[10px] py-0 px-1.5 gap-1">
                          <AlertTriangle className="h-3 w-3" /> Gargalo Principal
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                          {s.count} {s.count === 1 ? "item" : "itens"}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-lg font-bold font-mono text-foreground">
                        {formatBRL(s.total)}
                      </span>
                      <span className="text-xs font-semibold font-mono text-muted-foreground">
                        {s.pct.toFixed(1)}% do total
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Fixas: <strong className="font-mono text-foreground">{formatBRL(s.fixas)}</strong></span>
                      <span>Var: <strong className="font-mono text-foreground">{formatBRL(s.variaveis)}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Barra de Distribuição Visual Proporcional dos Gargalos */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-medium">Distribuição Proporcional dos Custos:</span>
                <span>Total Consolidado: <strong className="font-mono text-foreground">{formatBRL(segmentExpenses.totalAll)}</strong></span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden flex">
                {segmentExpenses.totalAll > 0 ? (
                  segmentExpenses.segmentsMeta.map((s) => (
                    <div
                      key={s.key}
                      style={{ width: `${s.pct}%` }}
                      className={`${s.barColor} transition-all duration-300`}
                      title={`${s.label}: ${s.pct.toFixed(1)}% (${formatBRL(s.total)})`}
                    />
                  ))
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-sky-500" /> Gerais ({segmentExpenses.segmentsMeta[0].pct.toFixed(1)}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Studio ({segmentExpenses.segmentsMeta[1].pct.toFixed(1)}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> Personal Trainer ({segmentExpenses.segmentsMeta[2].pct.toFixed(1)}%)
                  </span>
                </div>

                {/* Filtro de Exibição dos Cards */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground mr-1">Exibir:</span>
                  <Button
                    variant={expenseCardFilter === "all" ? "default" : "ghost"}
                    size="sm"
                    className="h-6 text-[10px] px-2"
                    onClick={() => setExpenseCardFilter("all")}
                  >
                    Todos os 3 Cards
                  </Button>
                  <Button
                    variant={expenseCardFilter === "general" ? "default" : "ghost"}
                    size="sm"
                    className="h-6 text-[10px] px-2"
                    onClick={() => setExpenseCardFilter("general")}
                  >
                    📦 Gerais
                  </Button>
                  <Button
                    variant={expenseCardFilter === "studio" ? "default" : "ghost"}
                    size="sm"
                    className="h-6 text-[10px] px-2"
                    onClick={() => setExpenseCardFilter("studio")}
                  >
                    🎯 Studio
                  </Button>
                  <Button
                    variant={expenseCardFilter === "pt" ? "default" : "ghost"}
                    size="sm"
                    className="h-6 text-[10px] px-2"
                    onClick={() => setExpenseCardFilter("pt")}
                  >
                    🏋️ PT
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Renderização dos Cards Individuais de Despesas */}
          <div className="space-y-4">
            {segmentExpenses.segmentsMeta
              .filter((s) => expenseCardFilter === "all" || expenseCardFilter === s.key)
              .map((s) => {
                const isBottleneck = segmentExpenses.bottleneckKey === s.key && s.total > 0;
                return (
                  <Card key={s.key} className="p-3.5 sm:p-5 min-w-0 max-w-full overflow-hidden">
                    <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${s.badgeBg}`}>
                            <s.icon className="h-4 w-4" />
                          </div>
                          <h3 className="text-sm sm:text-base font-semibold text-foreground">
                            {s.title}
                          </h3>
                          <Badge variant="outline" className={`font-mono text-xs font-semibold ${s.badgeBg}`}>
                            {formatBRL(s.total)}
                          </Badge>
                          <Badge variant="secondary" className="text-[11px] font-mono">
                            {s.pct.toFixed(1)}% do total
                          </Badge>
                          {isBottleneck && (
                            <Badge variant="destructive" className="gap-1 text-[11px]">
                              <AlertTriangle className="h-3 w-3" /> Maior Gargalo
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {s.subtitle} · Fixas: <strong className="font-mono text-foreground">{formatBRL(s.fixas)}</strong> · Variáveis: <strong className="font-mono text-foreground">{formatBRL(s.variaveis)}</strong>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => {
                            setExportDefaultSegment(s.key);
                            setExportExpensesOpen(true);
                          }}
                          title={`Exportar somente despesas de ${s.label}`}
                        >
                          <Download className="h-3.5 w-3.5 text-primary" />
                          <span>Exportar {s.label}</span>
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => {
                            setEditing({ segment: s.key } as any);
                            setExpenseOpen(true);
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Nova em {s.label}</span>
                        </Button>
                      </div>
                    </div>

                    {s.expenses.length === 0 ? (
                      <EmptyState
                        icon={<s.icon className="h-5 w-5" />}
                        title={`Nenhuma despesa de ${s.label} neste mês`}
                        description={`Cadastre lançamentos dedicados para ${s.label.toLowerCase()} para monitorar seu impacto financeiro.`}
                        action={
                          <Button
                            size="sm"
                            onClick={() => {
                              setEditing({ segment: s.key } as any);
                              setExpenseOpen(true);
                            }}
                          >
                            <Plus className="mr-1.5 h-4 w-4" /> Registrar em {s.label}
                          </Button>
                        }
                      />
                    ) : (
                      <div className="w-full max-w-full overflow-x-auto [touch-action:pan-x]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Descrição</TableHead>
                              <TableHead>Categoria</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Data</TableHead>
                              <TableHead className="text-right">Valor</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {s.expenses.map((e) => (
                              <TableRow key={e.id}>
                                <TableCell className="font-medium">{e.description}</TableCell>
                                <TableCell>
                                  {e.expense_categories
                                    ? `${e.expense_categories.icon ?? "📦"} ${e.expense_categories.name}`
                                    : "—"}
                                </TableCell>
                                <TableCell>
                                  <span className="text-xs">
                                    {e.type === "fixed" ? "🔒 Fixa" : "🔄 Variável"}
                                  </span>
                                </TableCell>
                                <TableCell>{formatDateBR(e.expense_date)}</TableCell>
                                <TableCell className="text-right font-mono font-medium">
                                  {formatBRL(e.amount)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-primary hover:bg-primary/10 hover:text-primary"
                                      title="Renovar esta despesa para hoje (data presente)"
                                      onClick={() => handleDuplicateExpense(e)}
                                    >
                                      <Repeat className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setEditing(e);
                                        setExpenseOpen(true);
                                      }}
                                      title="Editar despesa"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => remove(e.id)}
                                      title="Excluir despesa"
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="bg-muted/30 font-semibold">
                              <TableCell colSpan={4}>
                                Subtotal {s.title} ({s.count} itens)
                              </TableCell>
                              <TableCell className="text-right font-mono font-semibold text-foreground">
                                {formatBRL(s.total)}
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </Card>
                );
              })}
          </div>

          {/* Card Resumo Consolidado do Mês */}
          <Card className="p-3.5 sm:p-4 bg-muted/20 border-border/60">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Total Geral de Despesas ({formatMonthLabel(month)}):</span>
                <span className="font-mono font-bold text-sm text-foreground">{formatBRL(segmentExpenses.totalAll)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-mono">
                <span>Gerais: <strong className="text-foreground">{formatBRL(segmentExpenses.segmentsMeta[0].total)}</strong></span>
                <span>Studio: <strong className="text-foreground">{formatBRL(segmentExpenses.segmentsMeta[1].total)}</strong></span>
                <span>PT: <strong className="text-foreground">{formatBRL(segmentExpenses.segmentsMeta[2].total)}</strong></span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB: DRE */}
        <TabsContent value="dre">
          <Card className="p-3.5 sm:p-5 min-w-0 max-w-full overflow-hidden">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">
                  DRE — Demonstrativo de Resultado (últimos 12 meses)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Visão contábil detalhada de receitas, despesas e margens operacionais.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={async () => {
                    try {
                      await exportDreToExcel(dreData);
                      toast.success("DRE exportado em Excel (.xlsx) com sucesso!");
                    } catch (err: any) {
                      toast.error("Erro ao exportar Excel: " + err.message);
                    }
                  }}
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Exportar Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={async () => {
                    try {
                      await exportDreToPdf(dreData);
                      toast.success("DRE exportado em PDF com sucesso!");
                    } catch (err: any) {
                      toast.error("Erro ao exportar PDF: " + err.message);
                    }
                  }}
                >
                  <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  Exportar PDF
                </Button>
              </div>
            </div>
            <div className="w-full max-w-full overflow-x-auto [touch-action:pan-x]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead className="text-right">Rec. Studio</TableHead>
                    <TableHead className="text-right">Rec. PT</TableHead>
                    <TableHead className="text-right">Total Receita</TableHead>
                    <TableHead className="text-right">Desp. Fixas</TableHead>
                    <TableHead className="text-right">Desp. Variáveis</TableHead>
                    <TableHead className="text-right">Total Despesas</TableHead>
                    <TableHead className="text-right">Lucro</TableHead>
                    <TableHead className="text-right">Margem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dreData.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="font-medium">{row.label}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatBRL(row.studioRev)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatBRL(row.ptRev)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatBRL(row.totalRev)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatBRL(row.fixedExp)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatBRL(row.varExp)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatBRL(row.totalExp)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-mono ${
                          row.profit >= 0 ? "text-state-paid" : "text-destructive"
                        }`}
                      >
                        {formatBRL(row.profit)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-mono ${
                          row.margin >= 0 ? "text-state-paid" : "text-destructive"
                        }`}
                      >
                        {row.margin.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB: Fluxo de Caixa */}
        <TabsContent value="cashflow">
          <Card className="p-3.5 sm:p-5 min-w-0 max-w-full overflow-hidden">
            <h3 className="mb-3 text-sm font-semibold">Fluxo de Caixa (últimos 12 meses)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip {...chartTooltip} formatter={(v: number) => formatBRL(v)} />
                  <Legend />
                  <Bar dataKey="receita" fill="var(--color-state-paid)" name="Entradas" />
                  <Bar dataKey="despesas" fill="var(--color-state-late)" name="Saídas" />
                  <Bar dataKey="lucro" fill="var(--color-chart-1)" name="Saldo" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 w-full max-w-full overflow-x-auto [touch-action:pan-x]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead className="text-right">Entradas</TableHead>
                    <TableHead className="text-right">Saídas</TableHead>
                    <TableHead className="text-right">Saldo do mês</TableHead>
                    <TableHead className="text-right">Saldo acumulado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    let accumulated = 0;
                    return [...dreData].reverse().map((row) => {
                      accumulated += row.profit;
                      return (
                        <TableRow key={row.month}>
                          <TableCell className="font-medium">{row.label}</TableCell>
                          <TableCell className="text-right font-mono">
                            {formatBRL(row.totalRev)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatBRL(row.totalExp)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-mono ${
                              row.profit >= 0 ? "text-state-paid" : "text-destructive"
                            }`}
                          >
                            {formatBRL(row.profit)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-mono ${
                              accumulated >= 0 ? "text-state-paid" : "text-destructive"
                            }`}
                          >
                            {formatBRL(accumulated)}
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })()}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB: Análise Studio */}
        {!modulesLoading && hasModule("studio") && (
          <TabsContent value="studio" className="mt-6">
            <StudioAnalyticsPanel />
          </TabsContent>
        )}

        {/* TAB: Análise PT */}
        {!modulesLoading && hasModule("pt") && (
          <TabsContent value="pt" className="mt-6">
            <PtAnalyticsPanel />
          </TabsContent>
        )}

        {modulesLoading && (tab === "studio" || tab === "pt") && (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-8 w-56" />
            <div className="grid gap-4 lg:grid-cols-2">
              <Skeleton className="h-72 rounded-xl" />
              <Skeleton className="h-72 rounded-xl" />
            </div>
          </div>
        )}
      </Tabs>


      <ExpenseDialog open={expenseOpen} onOpenChange={setExpenseOpen} expense={editing} />

      <ExpenseRenewalDialog
        open={renewalOpen}
        onOpenChange={setRenewalOpen}
        targetMonth={month}
        allExpenses={allExpenses}
      />

      <ExpenseSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        currentMonth={month}
        allExpenses={allExpenses}
        onEditExpense={(exp) => {
          setEditing(exp);
          setExpenseOpen(true);
        }}
      />

      <ExportExpensesDialog
        open={exportExpensesOpen}
        onOpenChange={setExportExpensesOpen}
        currentMonth={month}
        allExpenses={allExpenses}
        defaultSegment={exportDefaultSegment}
      />
    </div>
  );
}
