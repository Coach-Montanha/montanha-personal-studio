import { useState, useEffect } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { StudentBonusTransaction } from "@/integrations/supabase/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  transaction: StudentBonusTransaction | null;
  studentId: string;
  studentName: string;
  currentBalance: number;
  onSuccess?: () => void;
}

export function EditBonusTransactionDialog({
  open,
  onOpenChange,
  transaction,
  studentId,
  studentName,
  currentBalance,
  onSuccess,
}: Props) {
  const qc = useQueryClient();
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setAmount(String(transaction.amount));
      setReason(transaction.reason || "");
    }
  }, [transaction, open]);

  if (!transaction) return null;

  const parsed = parseInt(amount, 10);
  const isValid = !isNaN(parsed) && parsed !== 0;
  const delta = isValid ? parsed - transaction.amount : 0;
  const previewBalance = currentBalance + delta;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || !transaction) return;

    if (previewBalance < 0) {
      toast.error(`O saldo do aluno não pode ficar negativo (saldo ficaria: ${previewBalance}).`);
      return;
    }

    setLoading(true);
    try {
      // 1. Atualiza a transação
      const { error: txErr } = await supabase
        .from("student_bonus_transactions")
        .update({
          amount: parsed,
          reason: reason || null,
        })
        .eq("id", transaction.id);

      if (txErr) throw txErr;

      // 2. Atualiza o saldo do aluno caso tenha havido alteração no valor
      if (delta !== 0) {
        const { error: stErr } = await supabase
          .from("students")
          .update({
            bonus_checkins_balance: previewBalance,
          })
          .eq("id", studentId);

        if (stErr) throw stErr;
      }

      toast.success(`Transação atualizada com sucesso! Novo saldo: ${previewBalance}`);
      onOpenChange(false);
      qc.invalidateQueries({ queryKey: ["bonus-transactions", studentId] });
      qc.invalidateQueries({ queryKey: ["student", studentId] });
      qc.invalidateQueries({ queryKey: ["students"] });
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar transação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <Pencil className="h-5 w-5" />
          </div>
          <DialogTitle className="text-center">Editar Transação de Bônus</DialogTitle>
          <DialogDescription className="text-center">
            Ajuste a quantidade ou motivo da premiação de <strong>{studentName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-bonus-amount">Quantidade</Label>
            <Input
              id="edit-bonus-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {isValid && delta !== 0 && (
              <p className="text-xs text-muted-foreground">
                Impacto no saldo:{" "}
                <span className={delta > 0 ? "text-emerald-500 font-semibold" : "text-rose-500 font-semibold"}>
                  {delta > 0 ? `+${delta}` : delta}
                </span>{" "}
                (novo saldo: <strong>{previewBalance}</strong>)
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-bonus-reason">Motivo / Descrição</Label>
            <Textarea
              id="edit-bonus-reason"
              placeholder="Descreva o motivo deste ajuste..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isValid || loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
