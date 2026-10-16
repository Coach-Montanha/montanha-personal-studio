import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search,
  Repeat,
  Pencil,
  Calendar,
  Filter,
  DollarSign,
  Layers,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { formatBRL, formatDateBR, formatMonthLabel } from "@/lib/format";

interface ExpenseSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMonth: string; // ex: "2026-10"
  allExpenses: any[];
  onEditExpense?: (expense: any) => void;
}

export function ExpenseSearchDialog({
  open,
  onOpenChange,
  currentMonth,
  allExpenses = [],
  onEditExpense,
}: ExpenseSearchDialogProps) {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [periodo, setPeriodo] = useState<"month" | "year" | "all">("all");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const currentYear = useMemo(() => currentMonth.slice(0, 4), [currentMonth]);

  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((e) => {
      // 1. Filtro de Período
      if (periodo === "month" && e.reference_month !== currentMonth) return false;
      if (periodo === "year" && !e.reference_month?.startsWith(currentYear)) return false;

      // 2. Filtro de Segmento
      if (segmentFilter !== "all" && e.segment !== segmentFilter) return false;

      // 3. Filtro de Tipo (fixa / variável)
      if (typeFilter !== "all" && e.type !== typeFilter) return false;

      // 4. Busca por Texto (descrição, categoria, observações)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const desc = (e.description || "").toLowerCase();
        const cat = (e.expense_categories?.name || "").toLowerCase();
        const notes = (e.notes || "").toLowerCase();
        if (!desc.includes(query) && !cat.includes(query) && !notes.includes(query)) {
          return false;
        }
      }

      // 5. Filtro por Valor
      const val = Number(e.amount) || 0;
      if (minAmount && val < parseFloat(minAmount)) return false;
      if (maxAmount && val > parseFloat(maxAmount)) return false;

      return true;
    });
  }, [allExpenses, periodo, currentMonth, currentYear, segmentFilter, typeFilter, searchTerm, minAmount, maxAmount]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [filteredExpenses]);

  // Ação rápida: Clonar/Renovar despesa encontrada para o mês atual
  async function handleQuickRenew(exp: any) {
    setDuplicatingId(exp.id);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Usuário não autenticado.");

      // Calcula data com o mesmo dia no mês atual
      const day = exp.expense_date?.slice(8, 10) || "01";
      const [targetYear, targetMonthNum] = currentMonth.split("-").map(Number);
      const lastDay = new Date(targetYear, targetMonthNum, 0).getDate();
      const finalDay = Math.min(Number(day), lastDay);
      const newDate = `${currentMonth}-${String(finalDay).padStart(2, "0")}`;

      const newExpense = {
        user_id: userId,
        category_id: exp.category_id || null,
        description: exp.description,
        amount: Number(exp.amount),
        expense_date: newDate,
        reference_month: currentMonth,
        segment: exp.segment || "general",
        type: exp.type || "variable",
        recurrent: true,
        notes: exp.notes ? `${exp.notes} (Copiado de ${exp.reference_month})` : `(Copiado de ${exp.reference_month})`,
      };

      const { error } = await supabase.from("expenses").insert(newExpense as any);
      if (error) throw error;

      toast.success(
        `"${exp.description}" registrada com sucesso para o mês de ${formatMonthLabel(currentMonth)}!`
      );
      qc.invalidateQueries({ queryKey: ["expenses-all"] });
    } catch (err: any) {
      toast.error(err?.message || "Erro ao duplicar despesa.");
    } finally {
      setDuplicatingId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-5 pb-3 border-b border-border/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Busca Específica de Despesas
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Pesquise por nome, valor ou histórico no mês, ano ou todo o período.
              </DialogDescription>
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mt-4 pt-1">
            {/* Campo de Texto (Descrição/Nome) */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs bg-background"
                autoFocus
              />
            </div>

            {/* Período */}
            <div className="sm:col-span-3">
              <Select value={periodo} onValueChange={(v: any) => setPeriodo(v)}>
                <SelectTrigger className="h-9 text-xs bg-background font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month" className="text-xs">
                    📅 No mês ({formatMonthLabel(currentMonth)})
                  </SelectItem>
                  <SelectItem value="year" className="text-xs">
                    📆 No ano ({currentYear})
                  </SelectItem>
                  <SelectItem value="all" className="text-xs">
                    🌐 Todo o período
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Segmento */}
            <div className="sm:col-span-2">
              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger className="h-9 text-xs bg-background">
                  <SelectValue placeholder="Segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Todos Segm.</SelectItem>
                  <SelectItem value="studio" className="text-xs">Studio</SelectItem>
                  <SelectItem value="pt" className="text-xs">Personal</SelectItem>
                  <SelectItem value="general" className="text-xs">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo */}
            <div className="sm:col-span-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 text-xs bg-background">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Todos Tipos</SelectItem>
                  <SelectItem value="fixed" className="text-xs">Fixas</SelectItem>
                  <SelectItem value="variable" className="text-xs">Variáveis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Faixa de Valor */}
            <div className="sm:col-span-6 flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground font-medium shrink-0">Valor (R$):</span>
              <Input
                type="number"
                placeholder="Mínimo"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="h-8 text-xs bg-background"
              />
              <span className="text-xs text-muted-foreground">até</span>
              <Input
                type="number"
                placeholder="Máximo"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="h-8 text-xs bg-background"
              />
            </div>

            {/* Contadores e Resumo */}
            <div className="sm:col-span-6 flex items-center justify-end gap-3 text-xs">
              <span className="text-muted-foreground">
                Encontradas: <strong className="text-foreground">{filteredExpenses.length}</strong>
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Soma Total:{" "}
                <strong className="text-foreground font-mono">{formatBRL(totalFilteredAmount)}</strong>
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Tabela de Resultados */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredExpenses.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground space-y-2">
              <Search className="h-8 w-8 text-muted-foreground/60 mx-auto" />
              <p>Nenhuma despesa localizada com os filtros atuais.</p>
              <p className="text-xs">Tente ajustar o termo de busca, período ou faixa de valor.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border/70 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-xs">Descrição</TableHead>
                    <TableHead className="text-xs">Categoria</TableHead>
                    <TableHead className="text-xs">Mês / Data</TableHead>
                    <TableHead className="text-xs">Tipo</TableHead>
                    <TableHead className="text-xs text-right">Valor</TableHead>
                    <TableHead className="text-xs text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((exp) => (
                    <TableRow key={exp.id} className="hover:bg-muted/30">
                      <TableCell className="font-semibold text-xs text-foreground">
                        {exp.description}
                        {exp.notes && (
                          <p className="text-[10px] text-muted-foreground font-normal line-clamp-1">
                            {exp.notes}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {exp.expense_categories ? (
                          <span className="flex items-center gap-1">
                            <span>{exp.expense_categories.icon ?? "📦"}</span>
                            <span>{exp.expense_categories.name}</span>
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="space-y-0.5">
                          <span className="font-medium text-foreground">{formatDateBR(exp.expense_date)}</span>
                          <p className="text-[10px] text-muted-foreground">
                            Ref: {formatMonthLabel(exp.reference_month)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 font-medium text-muted-foreground"
                        >
                          {exp.type === "fixed" ? "🔒 Fixa" : "🔄 Variável"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-xs text-foreground">
                        {formatBRL(exp.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] gap-1 px-2 text-primary hover:bg-primary/10 hover:border-primary/40 font-semibold"
                            title={`Copiar/Renovar para o mês de ${formatMonthLabel(currentMonth)}`}
                            onClick={() => handleQuickRenew(exp)}
                            disabled={duplicatingId === exp.id}
                          >
                            <Repeat className="h-3 w-3" />
                            <span>Renovar no Mês</span>
                          </Button>

                          {onEditExpense && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              title="Editar despesa"
                              onClick={() => {
                                onEditExpense(exp);
                                onOpenChange(false);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
