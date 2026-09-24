import { Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  balance: number;
  className?: string;
}

export function BonusBalanceCard({ balance, className }: Props) {
  if (balance <= 0) return null;

  return (
    <Card
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-emerald-500/30 bg-emerald-500/5",
        className,
      )}
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500">
        <Gift className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">Check-ins bônus disponíveis</p>
        <p className="text-lg font-bold tabular-nums text-emerald-500">
          {balance}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            {balance === 1 ? "crédito" : "créditos"}
          </span>
        </p>
      </div>
      <p className="hidden sm:block text-xs text-muted-foreground max-w-[180px] text-right leading-snug">
        Use quando quiser — eles nunca expiram
      </p>
    </Card>
  );
}
