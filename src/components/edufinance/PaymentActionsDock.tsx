import { FileText, RefreshCw, Plus, ArrowRightLeft, Pencil, Trash2 } from "lucide-react";
import { TooltipRoot, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PaymentActionsDockProps {
  canReceipt?: boolean;
  onReceipt?: () => void;
  isRenewable?: boolean;
  onToggleAutoRenew?: () => void;
  canRenew?: boolean;
  isRenewing?: boolean;
  onRenew?: () => void;
  onTransfer?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function PaymentActionsDock({
  canReceipt,
  onReceipt,
  isRenewable,
  onToggleAutoRenew,
  canRenew,
  isRenewing,
  onRenew,
  onTransfer,
  onEdit,
  onDelete,
  className,
}: PaymentActionsDockProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border/40 bg-card/90 dark:bg-zinc-900/80 p-0.5 shadow-2xs backdrop-blur-xs select-none transition-colors",
        className
      )}
    >
      {/* 1. Recibo em PDF */}
      {canReceipt && onReceipt && (
        <TooltipRoot delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onReceipt}
              aria-label="Gerar recibo em PDF"
              className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-blue-500 hover:bg-blue-500/15 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} className="text-[10px] px-2 py-0.5 font-medium">
            Recibo
          </TooltipContent>
        </TooltipRoot>
      )}

      {/* 2. Auto-Renovação */}
      {onToggleAutoRenew && (
        <TooltipRoot delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onToggleAutoRenew}
              aria-label={isRenewable ? "Desativar auto-renovação" : "Ativar auto-renovação"}
              className={cn(
                "relative flex h-6.5 w-6.5 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                isRenewable
                  ? "text-emerald-500 hover:bg-emerald-500/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <RefreshCw className="h-3.5 w-3.5 shrink-0" />
              {isRenewable && (
                <span className="absolute bottom-0.5 right-0.5 h-1 w-1 rounded-full bg-emerald-500" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} className="text-[10px] px-2 py-0.5 font-medium">
            {isRenewable ? "Auto-Renovação: Ativa" : "Ativar Auto-Renovação"}
          </TooltipContent>
        </TooltipRoot>
      )}

      {/* 3. Renovar Pagamento */}
      {onRenew && (
        <TooltipRoot delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onRenew}
              disabled={!canRenew && !isRenewing}
              aria-label="Renovar pagamento"
              className={cn(
                "flex h-6.5 w-6.5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xs transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                canRenew
                  ? "hover:bg-primary/90 hover:scale-105"
                  : "opacity-40 cursor-not-allowed hover:scale-100"
              )}
            >
              {isRenewing ? (
                <RefreshCw className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5 shrink-0" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} className="text-[10px] px-2 py-0.5 font-medium">
            {canRenew ? "Renovar" : "Apenas Pagos"}
          </TooltipContent>
        </TooltipRoot>
      )}

      {/* 4. Transferir */}
      {onTransfer && (
        <TooltipRoot delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onTransfer}
              aria-label="Transferir pagamento"
              className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-purple-500 hover:bg-purple-500/15 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} className="text-[10px] px-2 py-0.5 font-medium">
            Transferir
          </TooltipContent>
        </TooltipRoot>
      )}

      {/* 5. Editar */}
      {onEdit && (
        <TooltipRoot delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onEdit}
              aria-label="Editar pagamento"
              className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Pencil className="h-3.5 w-3.5 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} className="text-[10px] px-2 py-0.5 font-medium">
            Editar
          </TooltipContent>
        </TooltipRoot>
      )}

      {/* 6. Excluir */}
      {onDelete && (
        <TooltipRoot delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onDelete}
              aria-label="Excluir pagamento"
              className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-rose-500 hover:bg-rose-500/15 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} className="text-[10px] px-2 py-0.5 font-medium">
            Excluir
          </TooltipContent>
        </TooltipRoot>
      )}
    </div>
  );
}
