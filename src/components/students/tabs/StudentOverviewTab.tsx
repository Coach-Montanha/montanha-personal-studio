import { useState } from "react";
import { Wallet, CalendarDays, TrendingUp, Receipt, Layers, Gift, ChevronDown, ChevronUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KPICard } from "@/components/edufinance/KPICard";
import { EmptyState } from "@/components/edufinance/EmptyState";
import { chartTooltip } from "@/lib/chart-theme";
import { formatBRL, formatDateBR } from "@/lib/format";
import { StudentObservationsCard } from "@/components/students/StudentObservationsCard";
import { StudentAttendanceTab } from "./StudentAttendanceTab";
import { BonusBalancePanel } from "./BonusBalancePanel";
import type { PaymentRow } from "./StudentPaymentsTab";

type MonthlyPoint = { month: string; value: number };

type StudentOverviewTabProps = {
  studentId?: string;
  studentName?: string;
  studentCreatedAt?: string;
  studentNotes?: string | null;
  bonusBalance?: number;
  payments?: PaymentRow[];
  kpis: {
    total: number;
    months: number;
    avg: number;
    lastDate?: string;
    gapMonths?: number;
  };
  currentPlan?: {
    plans?: {
      name?: string | null;
      price?: number | null;
    } | null;
  } | null;
  attendanceCount: number;
  attendancePeriod: string;
  onAttendancePeriodChange: (p: string) => void;
  monthlySeries: MonthlyPoint[];
};

export function StudentOverviewTab({
  studentId,
  studentName,
  studentCreatedAt,
  studentNotes,
  bonusBalance = 0,
  payments,
  kpis,
  currentPlan,
  attendanceCount,
  attendancePeriod,
  onAttendancePeriodChange,
  monthlySeries,
}: StudentOverviewTabProps) {
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [bonusOpen, setBonusOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Grade de KPIs Principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard
          label="💰 LTV Total"
          value={formatBRL(kpis.total)}
          icon={<Wallet className="h-5 w-5" />}
        />
        <KPICard
          label="📅 Meses Ativo"
          value={kpis.months}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <KPICard
          label="📊 Ticket Médio"
          value={formatBRL(kpis.avg)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          label="🗓️ Último Pagamento"
          value={kpis.lastDate ? formatDateBR(kpis.lastDate) : "—"}
          icon={<Receipt className="h-5 w-5" />}
        />
        <KPICard
          label="🔁 Plano Atual"
          value={currentPlan?.plans?.name ?? "—"}
          hint={currentPlan?.plans?.price ? formatBRL(Number(currentPlan.plans.price)) : undefined}
          icon={<Layers className="h-5 w-5" />}
        />
        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-medium text-muted-foreground">🏃 Aulas realizadas</div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono">{attendanceCount}</div>
          <Select value={attendancePeriod} onValueChange={onAttendancePeriodChange}>
            <SelectTrigger className="mt-2 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Total (todo o histórico)</SelectItem>
              <SelectItem value="year">Ano atual</SelectItem>
              <SelectItem value="month">Mês atual</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>

      {/* Gráfico de Evolução de Pagamentos */}
      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold">Evolução de pagamentos</h2>
        {monthlySeries.length === 0 ? (
          <EmptyState title="Sem dados" description="Sem pagamentos registrados" />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatBRL(v)} width={90} />
                <Tooltip {...chartTooltip} formatter={(v: number) => formatBRL(v)} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* CARD EXPANSÍVEL: Frequência do Aluno */}
      <Card className="overflow-hidden border border-border/70 shadow-xs transition-all duration-200">
        <div
          onClick={() => setAttendanceOpen((prev) => !prev)}
          className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setAttendanceOpen((p) => !p);
            }
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-semibold tracking-tight">Frequência & Presença do Aluno</h2>
                <Badge variant="outline" className="text-[11px] font-normal border-border/80 bg-muted/40">
                  {attendanceCount} aulas realizadas
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {attendanceOpen
                  ? "Clique para recolher o relatório de frequência"
                  : "Acesse a grade mensal de assiduidade e meses pagos diretamente aqui"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <span>{attendanceOpen ? "Recolher" : "Expandir Frequência"}</span>
              {attendanceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {attendanceOpen && (
          <div className="border-t border-border/60 p-4 sm:p-6 bg-muted/10 animate-in fade-in-50 duration-200">
            {payments ? (
              <StudentAttendanceTab
                payments={payments}
                studentCreatedAt={studentCreatedAt || new Date().toISOString()}
              />
            ) : (
              <p className="text-xs text-muted-foreground">Carregando dados de frequência...</p>
            )}
          </div>
        )}
      </Card>

      {/* CARD EXPANSÍVEL: Saldo de Bônus & Check-ins Extras */}
      <Card className="overflow-hidden border border-border/70 shadow-xs transition-all duration-200">
        <div
          onClick={() => setBonusOpen((prev) => !prev)}
          className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setBonusOpen((p) => !p);
            }
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-semibold tracking-tight">Saldo de Bônus & Check-ins Extras</h2>
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold">
                  {bonusBalance} {bonusBalance === 1 ? "crédito disponível" : "créditos disponíveis"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {bonusOpen
                  ? "Clique para recolher o painel de bônus"
                  : "Conceda, transfira ou consulte o histórico completo de check-ins bônus"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <span>{bonusOpen ? "Recolher" : "Expandir Bônus"}</span>
              {bonusOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {bonusOpen && (
          <div className="border-t border-border/60 p-4 sm:p-6 bg-muted/10 animate-in fade-in-50 duration-200">
            {studentId && studentName ? (
              <BonusBalancePanel
                studentId={studentId}
                studentName={studentName}
                bonusBalance={bonusBalance}
              />
            ) : (
              <p className="text-xs text-muted-foreground">Carregando dados de bônus...</p>
            )}
          </div>
        )}
      </Card>

      {/* Observações do Aluno */}
      {studentId && (
        <StudentObservationsCard
          studentId={studentId}
          initialNotes={studentNotes}
        />
      )}
    </div>
  );
}
