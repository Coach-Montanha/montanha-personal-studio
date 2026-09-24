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
    <div className={cn("inline-flex items-center gap-1 justify-end select-none", className)}>
      {/* 1. Recibo em PDF */}
      {canReceipt && onReceipt && (
        <TooltipRoot delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onReceipt}
              aria-label="Gerar recibo em PDF"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <FileText className="h-4 w-4 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="text-xs">
            Recibo PDF
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
                "relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                isRenewable
                  ? "text-emerald-500 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <RefreshCw className="h-4 w-4 shrink-0" />
              {isRenewable && (
                <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="text-xs">
            {isRenewable ? "Auto-Renovação: Ativa" : "Ativar Auto-Renovação"}
          </TooltipContent>
        </TooltipRoot>
      )}

      {/* 3. Renovar Pagamento (Destaque roxo Lovable) */}
      {onRenew && (
        <TooltipRoot delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onRenew}
              disabled={!canRenew && !isRenewing}
              aria-label="Renovar pagamento"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                canRenew
                  ? "hover:bg-primary/90 hover:scale-105"
                  : "opacity-40 cursor-not-allowed hover:scale-100"
              )}
            >
              {isRenewing ? (
                <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 shrink-0" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="text-xs">
            {canRenew ? "Renovar Pagamento" : "Apenas Pagos"}
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
              className="flex h-8 w-8 items-center justify-center rounded-lg text-purple-500 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <ArrowRightLeft className="h-4 w-4 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="text-xs">
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
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Pencil className="h-4 w-4 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="text-xs">
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
              className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Trash2 className="h-4 w-4 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="text-xs">
            Excluir
          </TooltipContent>
        </TooltipRoot>
      )}
    </div>
  );
}
