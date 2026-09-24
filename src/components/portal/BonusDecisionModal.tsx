import { Gift, Ticket } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sessionLabel: string;
  bonusBalance: number;
  /** Called with useBonus = true → use bonus credit */
  onConfirm: (useBonus: boolean) => void;
  loading?: boolean;
  /** Whether the student also has a valid plan quota available */
  hasPlanQuota: boolean;
}

/**
 * BonusDecisionModal
 *
 * Shown when the student has bonus credits AND taps the Check-in button.
 * Lets them choose: use 1 bonus credit OR use their plan quota (if available).
 */
export function BonusDecisionModal({
  open,
  onOpenChange,
  sessionLabel,
  bonusBalance,
  onConfirm,
  loading,
  hasPlanQuota,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
            <Gift className="h-5 w-5" />
          </div>
          <DialogTitle className="text-center">Você tem check-ins bônus!</DialogTitle>
          <DialogDescription className="text-center space-y-1">
            <span className="block font-medium text-foreground">{sessionLabel}</span>
            <span className="block">
              Saldo de bônus:{" "}
              <strong className="text-emerald-500">{bonusBalance}</strong>{" "}
              {bonusBalance === 1 ? "crédito" : "créditos"}
            </span>
            <span className="block text-xs">
              Deseja usar 1 check-in bônus para garantir esta vaga?
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            className="w-full gap-2"
            onClick={() => onConfirm(true)}
            disabled={loading}
          >
            <Gift className="h-4 w-4" />
            Usar 1 bônus (resta {bonusBalance - 1})
          </Button>

          {hasPlanQuota ? (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => onConfirm(false)}
              disabled={loading}
            >
              <Ticket className="h-4 w-4" />
              Usar cota do meu plano
            </Button>
          ) : (
            <p className="text-center text-xs text-muted-foreground px-2">
              Você não possui cota disponível no plano atual. Apenas o bônus está disponível.
            </p>
          )}

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
