import { useState } from "react";
import { Gift, ArrowRightLeft, TrendingUp, TrendingDown, RotateCcw, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStudentBonusTransactions } from "@/lib/bonus.functions";
import { GrantBonusDialog } from "@/components/students/dialogs/GrantBonusDialog";
import { TransferBonusDialog } from "@/components/students/dialogs/TransferBonusDialog";
import { cn } from "@/lib/utils";
import type { StudentBonusTransaction } from "@/integrations/supabase/types";

interface Props {
  studentId: string;
  studentName: string;
  /** Current bonus balance from the student row — kept in sync via invalidateQueries */
  bonusBalance: number;
}

const TX_ICONS: Record<string, React.ReactNode> = {
  grant: <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />,
  adjustment: <TrendingUp className="h-3.5 w-3.5 text-blue-500" />,
  usage: <TrendingDown className="h-3.5 w-3.5 text-rose-500" />,
  checkin: <TrendingDown className="h-3.5 w-3.5 text-rose-500" />,
  refund: <RotateCcw className="h-3.5 w-3.5 text-amber-500" />,
  transfer_in: <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />,
  transfer_out: <TrendingDown className="h-3.5 w-3.5 text-rose-500" />,
};

const TX_LABELS: Record<string, string> = {
  grant: "Concessão",
  adjustment: "Ajuste",
  usage: "Uso",
  checkin: "Check-in",
  refund: "Estorno",
  transfer_in: "Recebido",
  transfer_out: "Transferido",
};

export function BonusBalancePanel({ studentId, studentName, bonusBalance }: Props) {
  const qc = useQueryClient();
  const fetchTxs = useServerFn(getStudentBonusTransactions);
  const [grantOpen, setGrantOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const { data: transactions = [], isLoading } = useQuery<StudentBonusTransaction[]>({
    queryKey: ["bonus-transactions", studentId],
    queryFn: () => fetchTxs({ data: { studentId, limit: 30 } }),
    staleTime: 30_000,
  });

  function refresh() {
    qc.invalidateQueries({ queryKey: ["bonus-transactions", studentId] });
    qc.invalidateQueries({ queryKey: ["student", studentId] });
  }

  return (
    <div className="space-y-4">
      {/* Balance card */}
      <Card className="p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Saldo de check-ins bônus</p>
            <p className="text-2xl font-bold tabular-nums">
              {bonusBalance}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                {bonusBalance === 1 ? "crédito" : "créditos"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setGrantOpen(true)}
          >
            <Gift className="h-3.5 w-3.5" />
            Conceder / Ajustar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setTransferOpen(true)}
            disabled={bonusBalance === 0}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Transferir
          </Button>
        </div>
      </Card>

      {/* Transaction history */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Histórico de transações</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : transactions.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhuma transação de bônus ainda.
          </p>
        ) : (
          <div className="divide-y divide-border rounded-lg border">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-start gap-3 px-4 py-3">
                <div className="mt-0.5 shrink-0">
                  {TX_ICONS[tx.transaction_type] ?? <Gift className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      {TX_LABELS[tx.transaction_type] ?? tx.transaction_type}
                    </Badge>
                    <span
                      className={cn(
                        "text-sm font-semibold tabular-nums",
                        tx.amount > 0 ? "text-emerald-500" : "text-rose-500",
                      )}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount}
                    </span>
                    {tx.reason && (
                      <span className="text-xs text-muted-foreground truncate">{tx.reason}</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GrantBonusDialog
        open={grantOpen}
        onOpenChange={setGrantOpen}
        studentId={studentId}
        studentName={studentName}
        currentBalance={bonusBalance}
        onSuccess={refresh}
      />
      <TransferBonusDialog
        open={transferOpen}
        onOpenChange={setTransferOpen}
        sourceStudentId={studentId}
        sourceStudentName={studentName}
        currentBalance={bonusBalance}
        onSuccess={refresh}
      />
    </div>
  );
}
