import { useState } from "react";
import { Gift, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
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
import { adjustStudentBonus } from "@/lib/bonus.functions";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  studentId: string;
  studentName: string;
  currentBalance: number;
  onSuccess?: () => void;
}

export function GrantBonusDialog({
  open,
  onOpenChange,
  studentId,
  studentName,
  currentBalance,
  onSuccess,
}: Props) {
  const adjust = useServerFn(adjustStudentBonus);
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const parsed = parseInt(amount, 10);
  const isValid = !isNaN(parsed) && parsed !== 0;
  const previewBalance = isValid ? currentBalance + parsed : currentBalance;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      const result = await adjust({
        data: { studentId, amount: parsed, reason: reason || undefined },
      });
      toast.success(
        parsed > 0
          ? `+${parsed} check-in(s) bônus adicionado(s). Saldo: ${(result as any)?.new_balance ?? previewBalance}`
          : `${parsed} check-in(s) bônus removido(s). Saldo: ${(result as any)?.new_balance ?? previewBalance}`,
      );
      setAmount("");
      setReason("");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
            <Gift className="h-5 w-5" />
          </div>
          <DialogTitle className="text-center">Conceder / Ajustar Bônus</DialogTitle>
          <DialogDescription className="text-center">
            Aluno: <strong>{studentName}</strong> · Saldo atual:{" "}
            <strong>{currentBalance}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="amount">
              Quantidade{" "}
              <span className="text-muted-foreground font-normal">(positivo = conceder, negativo = remover)</span>
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Ex: 3 ou -1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {isValid && (
              <p className="text-xs text-muted-foreground">
                Novo saldo estimado:{" "}
                <span className="font-semibold text-foreground">{previewBalance}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reason">Motivo (opcional)</Label>
            <Textarea
              id="reason"
              placeholder="Ex: Sorteio de outubro, premiação por frequência…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || loading} className="gap-1.5">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
