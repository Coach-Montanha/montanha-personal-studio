import { useState } from "react";
import { Gift, ArrowRightLeft, TrendingUp, TrendingDown, RotateCcw, Loader2, Pencil, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { GrantBonusDialog } from "@/components/students/dialogs/GrantBonusDialog";
import { TransferBonusDialog } from "@/components/students/dialogs/TransferBonusDialog";
import { EditBonusTransactionDialog } from "@/components/students/dialogs/EditBonusTransactionDialog";
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
  const [grantOpen, setGrantOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<StudentBonusTransaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<StudentBonusTransaction | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const { data: transactions = [], isLoading } = useQuery<StudentBonusTransaction[]>({
    queryKey: ["bonus-transactions", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_bonus_transactions")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []) as StudentBonusTransaction[];
    },
    staleTime: 30_000,
  });

  function refresh() {
    qc.invalidateQueries({ queryKey: ["bonus-transactions", studentId] });
    qc.invalidateQueries({ queryKey: ["student", studentId] });
    qc.invalidateQueries({ queryKey: ["students"] });
  }

  async function handleDeleteConfirm() {
    if (!deletingTx) return;

    // Se foi uma concessão (+2), a reversão reduz o saldo em 2
    const targetBalance = bonusBalance - deletingTx.amount;
    if (targetBalance < 0) {
      toast.error(`Não é possível excluir: o aluno já utilizou esses créditos (saldo atual: ${bonusBalance}).`);
      setDeletingTx(null);
      return;
    }

    setDeletingLoading(true);
    try {
      // 1. Deleta a transação do extrato
      const { error: delErr } = await supabase
        .from("student_bonus_transactions")
        .delete()
        .eq("id", deletingTx.id);

      if (delErr) throw delErr;

      // 2. Atualiza o saldo do aluno
      const { error: stErr } = await supabase
        .from("students")
        .update({ bonus_checkins_balance: targetBalance })
        .eq("id", studentId);

      if (stErr) throw stErr;

      toast.success("Transação excluída e saldo ajustado com sucesso!");
      setDeletingTx(null);
      refresh();
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir transação");
    } finally {
      setDeletingLoading(false);
    }
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
              <div key={tx.id} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-3 min-w-0 flex-1">
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

                {/* Ações de Edição e Exclusão */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Editar transação"
                    onClick={() => setEditingTx(tx)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title="Excluir transação"
                    onClick={() => setDeletingTx(tx)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
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
      <EditBonusTransactionDialog
        open={!!editingTx}
        onOpenChange={(open) => !open && setEditingTx(null)}
        transaction={editingTx}
        studentId={studentId}
        studentName={studentName}
        currentBalance={bonusBalance}
        onSuccess={refresh}
      />

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!deletingTx} onOpenChange={(open) => !open && setDeletingTx(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro de bônus?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingTx && (
                <>
                  Esta transação de{" "}
                  <strong>{deletingTx.amount > 0 ? `+${deletingTx.amount}` : deletingTx.amount} check-in(s)</strong>{" "}
                  será removida e o saldo atual de <strong>{studentName}</strong> será ajustado de{" "}
                  <strong>{bonusBalance}</strong> para{" "}
                  <strong>{bonusBalance - deletingTx.amount}</strong> créditos.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              disabled={deletingLoading}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deletingLoading ? "Excluindo..." : "Confirmar e Ajustar Saldo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
