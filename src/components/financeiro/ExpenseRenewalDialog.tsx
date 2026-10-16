import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Repeat, Calendar, Check, AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { formatBRL, formatMonthLabel, formatDateBR } from "@/lib/format";

interface ExpenseRenewalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetMonth: string; // ex: "2026-10"
  allExpenses: any[];
  onSuccess?: () => void;
}

function getPreviousMonthKey(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1 - 1, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function calculateTargetDate(originalDate: string, targetMonth: string): string {
  try {
    const day = originalDate.slice(8, 10) || "01";
    const [targetYear, targetMonthNum] = targetMonth.split("-").map(Number);
    // Último dia do mês alvo
    const lastDay = new Date(targetYear, targetMonthNum, 0).getDate();
    const finalDay = Math.min(Number(day), lastDay);
    return `${targetMonth}-${String(finalDay).padStart(2, "0")}`;
  } catch {
    return `${targetMonth}-01`;
  }
}

export function ExpenseRenewalDialog({
  open,
  onOpenChange,
  targetMonth,
  allExpenses = [],
  onSuccess,
}: ExpenseRenewalDialogProps) {
  const qc = useQueryClient();
  const defaultPrev = useMemo(() => getPreviousMonthKey(targetMonth), [targetMonth]);
  const [sourceMonth, setSourceMonth] = useState<string>(defaultPrev);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lista todos os meses distintos presentes no histórico que sejam anteriores ao targetMonth
  const availableSourceMonths = useMemo(() => {
    const set = new Set<string>();
    set.add(defaultPrev);
    for (const e of allExpenses) {
      if (e.reference_month && e.reference_month < targetMonth) {
        set.add(e.reference_month);
      }
    }
    return Array.from(set).sort().reverse();
  }, [allExpenses, targetMonth, defaultPrev]);

  // Despesas já existentes no mês alvo para detectar possíveis duplicatas
  const targetExpenses = useMemo(() => {
    return allExpenses.filter((e) => e.reference_month === targetMonth);
  }, [allExpenses, targetMonth]);

  // Despesas do mês de origem
  const sourceExpenses = useMemo(() => {
    return allExpenses.filter((e) => e.reference_month === sourceMonth);
  }, [allExpenses, sourceMonth]);

  // Ao abrir ou alterar sourceMonth, reseta seleção inteligente
  useEffect(() => {
    if (open) {
      setSourceMonth(defaultPrev);
    }
  }, [open, defaultPrev]);

  useEffect(() => {
    const newSelected = new Set<string>();
    const newAmounts: Record<string, number> = {};

    for (const exp of sourceExpenses) {
      // Se já foi lançada no mês de destino com o mesmo nome, não seleciona por padrão
      const alreadyExists = targetExpenses.some(
        (t) => t.description.trim().toLowerCase() === exp.description.trim().toLowerCase()
      );
      if (!alreadyExists) {
        newSelected.add(exp.id);
      }
      newAmounts[exp.id] = Number(exp.amount) || 0;
    }

    setSelectedIds(newSelected);
    setCustomAmounts(newAmounts);
  }, [sourceExpenses, targetExpenses]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(sourceExpenses.map((e) => e.id)));
  };

  const selectNone = () => {
    setSelectedIds(new Set());
  };

  const selectFixedOnly = () => {
    setSelectedIds(new Set(sourceExpenses.filter((e) => e.type === "fixed").map((e) => e.id)));
  };

  const totalSelectedAmount = useMemo(() => {
    return sourceExpenses
      .filter((e) => selectedIds.has(e.id))
      .reduce((sum, e) => sum + (customAmounts[e.id] ?? Number(e.amount) ?? 0), 0);
  }, [sourceExpenses, selectedIds, customAmounts]);

  async function handleConfirmRenewal() {
    if (selectedIds.size === 0) {
      toast.error("Selecione ao menos uma despesa para renovar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Usuário não autenticado.");

      const itemsToInsert = sourceExpenses
        .filter((e) => selectedIds.has(e.id))
        .map((e) => {
          const finalAmount = customAmounts[e.id] ?? Number(e.amount);
          const finalDate = calculateTargetDate(e.expense_date, targetMonth);

          return {
            user_id: userId,
            category_id: e.category_id || null,
            description: e.description,
            amount: finalAmount,
            expense_date: finalDate,
            reference_month: targetMonth,
            segment: e.segment || "general",
            type: e.type || "fixed",
            recurrent: true,
            notes: e.notes ? `${e.notes} (Renovado de ${sourceMonth})` : `(Renovado de ${sourceMonth})`,
          };
        });

      const { error } = await supabase.from("expenses").insert(itemsToInsert as any);
      if (error) throw error;

      toast.success(
        `${itemsToInsert.length} despesa(s) renovada(s) com sucesso para ${formatMonthLabel(targetMonth)}!`
      );
      qc.invalidateQueries({ queryKey: ["expenses-all"] });
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao renovar despesas.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-5 pb-3 border-b border-border/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Repeat className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Renovação de Despesas
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Copie despesas de meses anteriores para o mês atual com um clique.
              </DialogDescription>
            </div>
          </div>

          {/* Seletores de Mês Origem e Destino */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 bg-muted/30 p-3 rounded-xl border border-border/60">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Mês de Origem (Copiar de)
              </label>
              <Select value={sourceMonth} onValueChange={setSourceMonth}>
                <SelectTrigger className="h-9 text-xs bg-background font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableSourceMonths.map((m) => (
                    <SelectItem key={m} value={m} className="text-xs">
                      {formatMonthLabel(m)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Mês de Destino (Lançar em)
              </label>
              <div className="h-9 px-3 rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center justify-between text-xs font-bold">
                <span>{formatMonthLabel(targetMonth)}</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-0 text-[10px]">
                  Mês Ativo
                </Badge>
              </div>
            </div>
          </div>

          {/* Barra de Ações Rápidas de Seleção */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={selectAll}>
                Selecionar Todas
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={selectFixedOnly}>
                Apenas Fixas
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs px-2 text-muted-foreground" onClick={selectNone}>
                Limpar Seleção
              </Button>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {selectedIds.size} de {sourceExpenses.length} selecionada(s)
            </span>
          </div>
        </DialogHeader>

        {/* Lista de Despesas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sourceExpenses.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground space-y-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground/60 mx-auto" />
              <p>Nenhuma despesa encontrada no mês de {formatMonthLabel(sourceMonth)}.</p>
              <p className="text-xs">Escolha outro mês de origem acima.</p>
            </div>
          ) : (
            sourceExpenses.map((exp) => {
              const isSelected = selectedIds.has(exp.id);
              const alreadyExists = targetExpenses.some(
                (t) => t.description.trim().toLowerCase() === exp.description.trim().toLowerCase()
              );
              const targetDate = calculateTargetDate(exp.expense_date, targetMonth);

              return (
                <div
                  key={exp.id}
                  onClick={() => toggleSelect(exp.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-primary/5 border-primary/40 shadow-xs"
                      : "bg-card hover:bg-muted/30 border-border/70 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(exp.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-foreground truncate">
                          {exp.description}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] py-0 px-1.5 font-medium text-muted-foreground"
                        >
                          {exp.type === "fixed" ? "🔒 Fixa" : "🔄 Variável"}
                        </Badge>
                        {alreadyExists && (
                          <Badge
                            variant="secondary"
                            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[9px] py-0"
                          >
                            Já lançada em {formatMonthLabel(targetMonth)}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        {exp.expense_categories && (
                          <span>
                            {exp.expense_categories.icon ?? "📦"} {exp.expense_categories.name}
                          </span>
                        )}
                        <span>•</span>
                        <span>Data sugerida: {formatDateBR(targetDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Campo de Valor com Edição Opcional */}
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs text-muted-foreground font-mono">R$</span>
                    <Input
                      type="number"
                      step="0.01"
                      className="w-24 h-8 text-xs font-mono font-semibold text-right"
                      value={customAmounts[exp.id] ?? exp.amount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setCustomAmounts((prev) => ({ ...prev, [exp.id]: val }));
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé com Totalizadores e Botão de Confirmação */}
        <DialogFooter className="p-4 border-t border-border/70 bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Total selecionado:{" "}
            <span className="font-mono font-bold text-sm text-foreground">
              {formatBRL(totalSelectedAmount)}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmRenewal}
              disabled={isSubmitting || selectedIds.size === 0}
              className="gap-2 font-semibold shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Renovando...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>
                    Renovar {selectedIds.size} despesa(s) para {formatMonthLabel(targetMonth)}
                  </span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
