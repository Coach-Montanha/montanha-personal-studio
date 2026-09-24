import { useState } from "react";
import { Gift, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
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
import { bulkAdjustStudentBonus } from "@/lib/bonus.functions";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedIds: string[];
  onDone?: () => void;
}

export function BulkGrantBonusDialog({
  open,
  onOpenChange,
  selectedIds,
  onDone,
}: Props) {
  const qc = useQueryClient();
  const bulkAdjust = useServerFn(bulkAdjustStudentBonus);
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const parsed = parseInt(amount, 10);
  const isValid = !isNaN(parsed) && parsed !== 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || selectedIds.length === 0) return;
    setLoading(true);
    try {
      const res = await bulkAdjust({
        data: {
          studentIds: selectedIds,
          amount: parsed,
          reason: reason || undefined,
        },
      });

      if (res.successCount > 0) {
        toast.success(
          parsed > 0
            ? `+${parsed} check-in(s) bônus concedido(s) para ${res.successCount} aluno(s)!`
            : `${parsed} check-in(s) bônus debitado(s) de ${res.successCount} aluno(s)!`,
        );
      }
      if (res.errors.length > 0) {
        toast.error(`${res.errors.length} erro(s) durante o processamento.`);
      }

      setAmount("");
      setReason("");
      onOpenChange(false);
      qc.invalidateQueries();
      onDone?.();
    } catch (err: any) {
      toast.error(err.message || "Erro ao processar bônus em massa");
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
          <DialogTitle className="text-center">Conceder Bônus em Massa</DialogTitle>
          <DialogDescription className="text-center">
            Adicione ou ajuste check-ins premiados para os{" "}
            <strong>{selectedIds.length}</strong> alunos selecionados.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bulk-bonus-amount">
              Quantidade por aluno{" "}
              <span className="text-muted-foreground font-normal">
                (ex: 1, 2, 5 para conceder)
              </span>
            </Label>
            <Input
              id="bulk-bonus-amount"
              type="number"
              placeholder="Ex: 2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bulk-bonus-reason">
              Motivo da premiação{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea
              id="bulk-bonus-reason"
              placeholder="Ex: Sorteio do mês, Campanha de indicações, Premiação..."
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
              disabled={!isValid || loading || selectedIds.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Conceder a {selectedIds.length} aluno(s)
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
