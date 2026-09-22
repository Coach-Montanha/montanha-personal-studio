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
        "inline-flex items-center gap-1 rounded-full bg-zinc-950/90 dark:bg-zinc-900/95 border border-zinc-800/90 px-1.5 py-1 shadow-lg backdrop-blur-md select-none",
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
              className="relative group/btn flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:text-blue-400 hover:bg-blue-500/15 transition-all duration-150 ease-out hover:scale-125 hover:z-30 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
            >
              <FileText className="h-3.5 w-3.5 shrink-0 transition-transform duration-150" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-200 border border-zinc-800 shadow-xl"
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
                "relative group/btn flex h-7 w-7 items-center justify-center rounded-full transition-all duration-150 ease-out hover:scale-125 hover:z-30 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400",
                isRenewable
                  ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80"
              )}
            >
              <RefreshCw className="h-3.5 w-3.5 shrink-0 transition-transform duration-150" />
              {isRenewable && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-emerald-400 ring-1 ring-emerald-400/50" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-200 border border-zinc-800 shadow-xl"
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
                "relative group/btn flex h-7 w-7 items-center justify-center rounded-full transition-all duration-150 ease-out hover:scale-125 hover:z-30 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                canRenew
                  ? "text-primary hover:text-primary-foreground hover:bg-primary/90"
                  : "text-zinc-600 cursor-not-allowed opacity-40 hover:scale-100"
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
            className="rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-200 border border-zinc-800 shadow-xl"
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
              className="relative group/btn flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:text-purple-400 hover:bg-purple-500/15 transition-all duration-150 ease-out hover:scale-125 hover:z-30 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 shrink-0 transition-transform duration-150" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-200 border border-zinc-800 shadow-xl"
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
              className="relative group/btn flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:text-amber-400 hover:bg-amber-500/15 transition-all duration-150 ease-out hover:scale-125 hover:z-30 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
            >
              <Pencil className="h-3.5 w-3.5 shrink-0 transition-transform duration-150" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-200 border border-zinc-800 shadow-xl"
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
              className="relative group/btn flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:text-rose-400 hover:bg-rose-500/15 transition-all duration-150 ease-out hover:scale-125 hover:z-30 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0 transition-transform duration-150" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-400 border border-rose-950/50 shadow-xl"
          >
            Excluir
          </TooltipContent>
        </TooltipRoot>
      )}
    </div>
  );
}
