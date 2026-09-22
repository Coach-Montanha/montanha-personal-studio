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
        "inline-flex items-center gap-0.5 rounded-full border border-border/80 bg-muted/60 hover:bg-muted/90 dark:bg-zinc-900/85 dark:border-zinc-800/80 p-0.5 shadow-xs backdrop-blur-md select-none transition-colors",
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
              className="relative group/btn flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/15 transition-all duration-150 ease-out hover:scale-125 hover:z-30 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <FileText className="h-3.5 w-3.5 shrink-0 transition-transform duration-150" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-full bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-lg pointer-events-none"
          >
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
                "relative group/btn flex h-7 w-7 items-center justify-center rounded-full transition-all duration-150 ease-out hover:scale-125 hover:z-30 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                isRenewable
                  ? "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-500/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-zinc-800/80"
              )}
            >
              <RefreshCw className="h-3.5 w-3.5 shrink-0 transition-transform duration-150" />
              {isRenewable && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-emerald-500 ring-1 ring-emerald-500/40" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-full bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-lg pointer-events-none"
          >
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
                "relative group/btn flex h-7 w-7 items-center justify-center rounded-full transition-all duration-150 ease-out hover:scale-125 hover:z-30 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                canRenew
                  ? "text-muted-foreground hover:text-primary hover:bg-primary/15"
                  : "text-muted-foreground/30 cursor-not-allowed hover:scale-100"
              )}
            >
              {isRenewing ? (
                <RefreshCw className="h-3.5 w-3.5 shrink-0 animate-spin text-primary" />
              ) : (
                <Plus className="h-3.5 w-3.5 shrink-0 transition-transform duration-150" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-full bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-lg pointer-events-none"
          >
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
              aria-label="Transferir pagamento para outro aluno"
              className="relative group/btn flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/15 transition-all duration-150 ease-out hover:scale-125 hover:z-30 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 shrink-0 transition-transform duration-150" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-full bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-lg pointer-events-none"
          >
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
              className="relative group/btn flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/15 transition-all duration-150 ease-out hover:scale-125 hover:z-30 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Pencil className="h-3.5 w-3.5 shrink-0 transition-transform duration-150" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-full bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-lg pointer-events-none"
          >
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
              className="relative group/btn flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/15 transition-all duration-150 ease-out hover:scale-125 hover:z-30 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0 transition-transform duration-150" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-full bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-lg pointer-events-none"
          >
            Excluir
          </TooltipContent>
        </TooltipRoot>
      )}
    </div>
  );
}
