import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  Copy,
  Calendar,
  Layers,
  Filter,
  DollarSign,
  Check,
  CheckCircle2,
} from "lucide-react";
import { formatBRL, formatMonthLabel } from "@/lib/format";
import {
  exportExpensesToExcel,
  exportExpensesToPdf,
  exportExpensesToCsv,
  exportExpensesToMarkdown,
  exportExpensesToTxt,
  exportExpensesToJson,
  generateExpensesMarkdownText,
  ExpenseExportItem,
} from "@/lib/expense-export";

interface ExportExpensesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMonth: string; // Ex: "2026-10"
  allExpenses: any[];
  defaultSegment?: string;
}

type PeriodPreset =
  | "current_month"
  | "prev_month"
  | "last_3_months"
  | "last_6_months"
  | "current_year"
  | "custom"
  | "all";

export function ExportExpensesDialog({
  open,
  onOpenChange,
  currentMonth,
  allExpenses = [],
  defaultSegment = "all",
}: ExportExpensesDialogProps) {
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>("current_month");
  const [selectedSegments, setSelectedSegments] = useState<string[]>(["general", "studio", "pt"]);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    if (open) {
      if (defaultSegment === "general" || defaultSegment === "studio" || defaultSegment === "pt") {
        setSelectedSegments([defaultSegment]);
      } else if (defaultSegment === "studio_pt") {
        setSelectedSegments(["studio", "pt"]);
      } else {
        setSelectedSegments(["general", "studio", "pt"]);
      }
    }
  }, [open, defaultSegment]);

  function toggleSegment(seg: string) {
    setSelectedSegments((prev) => {
      if (prev.includes(seg)) {
        if (prev.length === 1) return prev; // Mantém pelo menos um
        return prev.filter((s) => s !== seg);
      }
      return [...prev, seg];
    });
  }

  // Custom date range
  const [customStartMonth, setCustomStartMonth] = useState<string>(currentMonth);
  const [customEndMonth, setCustomEndMonth] = useState<string>(currentMonth);

  const [copied, setCopied] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);

  // Calcula meses para os presets
  const { currentYear, prevMonthKey } = useMemo(() => {
    const [yearStr, monthStr] = currentMonth.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);

    let prevY = year;
    let prevM = month - 1;
    if (prevM < 1) {
      prevM = 12;
      prevY -= 1;
    }
    const prevMonthKey = `${prevY}-${String(prevM).padStart(2, "0")}`;

    return {
      currentYear: yearStr,
      prevMonthKey,
    };
  }, [currentMonth]);

  // Lista normalizada e filtrada
  const filteredExpenses: ExpenseExportItem[] = useMemo(() => {
    return allExpenses
      .filter((exp) => {
        const refMonth = exp.reference_month || (exp.expense_date ? exp.expense_date.slice(0, 7) : "");

        // Filtro de Período
        if (periodPreset === "current_month") {
          if (refMonth !== currentMonth) return false;
        } else if (periodPreset === "prev_month") {
          if (refMonth !== prevMonthKey) return false;
        } else if (periodPreset === "last_3_months") {
          // Últimos 3 meses incluindo o mês atual
          const [curY, curM] = currentMonth.split("-").map(Number);
          const [refY, refM] = refMonth.split("-").map(Number);
          const diffMonths = (curY - refY) * 12 + (curM - refM);
          if (diffMonths < 0 || diffMonths >= 3) return false;
        } else if (periodPreset === "last_6_months") {
          const [curY, curM] = currentMonth.split("-").map(Number);
          const [refY, refM] = refMonth.split("-").map(Number);
          const diffMonths = (curY - refY) * 12 + (curM - refM);
          if (diffMonths < 0 || diffMonths >= 6) return false;
        } else if (periodPreset === "current_year") {
          if (!refMonth.startsWith(currentYear)) return false;
        } else if (periodPreset === "custom") {
          if (customStartMonth && refMonth < customStartMonth) return false;
          if (customEndMonth && refMonth > customEndMonth) return false;
        }

        // Filtro de Segmento (individual ou mesclado)
        const expSeg = exp.segment || "general";
        if (selectedSegments.length > 0 && selectedSegments.length < 3) {
          if (!selectedSegments.includes(expSeg)) return false;
        }

        // Filtro de Tipo (fixa ou variável)
        if (typeFilter !== "all" && exp.type !== typeFilter) {
          return false;
        }

        return true;
      })
      .map((e) => ({
        id: e.id,
        description: e.description,
        amount: Number(e.amount || 0),
        expense_date: e.expense_date,
        reference_month: e.reference_month,
        segment: e.segment || "general",
        type: e.type || "variable",
        notes: e.notes || null,
        category_name: e.expense_categories?.name || undefined,
      }))
      .sort((a, b) => (b.expense_date || "").localeCompare(a.expense_date || ""));
  }, [
    allExpenses,
    periodPreset,
    currentMonth,
    prevMonthKey,
    currentYear,
    customStartMonth,
    customEndMonth,
    selectedSegments,
    typeFilter,
  ]);

  // Totais do conjunto filtrado
  const totals = useMemo(() => {
    const total = filteredExpenses.reduce((s, e) => s + e.amount, 0);
    const fixas = filteredExpenses
      .filter((e) => e.type === "fixed")
      .reduce((s, e) => s + e.amount, 0);
    const variaveis = filteredExpenses
      .filter((e) => e.type === "variable")
      .reduce((s, e) => s + e.amount, 0);

    return { total, fixas, variaveis, count: filteredExpenses.length };
  }, [filteredExpenses]);

  // Título e subtítulo do relatório
  const reportMetadata = useMemo(() => {
    let periodLabel = "";
    if (periodPreset === "current_month") periodLabel = `Mês ${formatMonthLabel(currentMonth)}`;
    else if (periodPreset === "prev_month") periodLabel = `Mês Anterior (${formatMonthLabel(prevMonthKey)})`;
    else if (periodPreset === "last_3_months") periodLabel = "Últimos 3 Meses";
    else if (periodPreset === "last_6_months") periodLabel = "Últimos 6 Meses";
    else if (periodPreset === "current_year") periodLabel = `Ano ${currentYear}`;
    else if (periodPreset === "custom") periodLabel = `Período ${customStartMonth} a ${customEndMonth}`;
    else periodLabel = "Histórico Completo";

    let segmentLabel = "";
    if (selectedSegments.length === 3) {
      segmentLabel = " · Consolidado (Geral, Studio, PT)";
    } else if (selectedSegments.length === 1) {
      const s = selectedSegments[0];
      segmentLabel = s === "studio" ? " · Studio" : s === "pt" ? " · Personal Trainer" : " · Geral";
    } else {
      segmentLabel = ` · Mesclado (${selectedSegments.map((s) => (s === "studio" ? "Studio" : s === "pt" ? "PT" : "Geral")).join(" + ")})`;
    }

    let typeLabel = "";
    if (typeFilter === "fixed") typeLabel = " · Fixas";
    else if (typeFilter === "variable") typeLabel = " · Variáveis";

    const title = `Relatório de Despesas (${periodLabel}${segmentLabel}${typeLabel})`;
    const subtitle = `Gerado em ${new Date().toLocaleDateString("pt-BR")}`;
    const filenameBase = `Despesas_${periodLabel.replace(/[^\w.-]+/g, "_")}`;

    return { title, subtitle, filenameBase };
  }, [
    periodPreset,
    currentMonth,
    prevMonthKey,
    currentYear,
    customStartMonth,
    customEndMonth,
    selectedSegments,
    typeFilter,
  ]);

  // Totais por segmento do conjunto selecionado
  const segmentTotals = useMemo(() => {
    const s = {
      general: { total: 0, count: 0 },
      studio: { total: 0, count: 0 },
      pt: { total: 0, count: 0 },
    };
    for (const exp of filteredExpenses) {
      const k = (exp.segment === "studio" || exp.segment === "pt") ? exp.segment : "general";
      s[k].total += Number(exp.amount || 0);
      s[k].count += 1;
    }
    return s;
  }, [filteredExpenses]);

  async function handleExport(format: "excel" | "pdf" | "csv" | "md" | "txt" | "json") {
    if (filteredExpenses.length === 0) {
      toast.error("Nenhuma despesa encontrada para os filtros selecionados.");
      return;
    }

    setExportingFormat(format);
    const opts = {
      title: reportMetadata.title,
      subtitle: reportMetadata.subtitle,
      filename: `${reportMetadata.filenameBase}.${format === "excel" ? "xlsx" : format}`,
      businessName: "Studio Coach Montanha",
    };

    try {
      if (format === "excel") {
        await exportExpensesToExcel(filteredExpenses, opts);
        toast.success("Planilha Excel (.xlsx) gerada com sucesso!");
      } else if (format === "pdf") {
        await exportExpensesToPdf(filteredExpenses, opts);
        toast.success("Relatório PDF (.pdf) gerado com sucesso!");
      } else if (format === "csv") {
        exportExpensesToCsv(filteredExpenses, opts);
        toast.success("Arquivo CSV (.csv) baixado!");
      } else if (format === "md") {
        exportExpensesToMarkdown(filteredExpenses, opts);
        toast.success("Documento Markdown (.md) baixado!");
      } else if (format === "txt") {
        exportExpensesToTxt(filteredExpenses, opts);
        toast.success("Arquivo de Texto (.txt) baixado!");
      } else if (format === "json") {
        exportExpensesToJson(filteredExpenses, opts);
        toast.success("Arquivo JSON (.json) baixado!");
      }
    } catch (err: any) {
      toast.error(err?.message || `Falha ao exportar em formato ${format.toUpperCase()}`);
    } finally {
      setExportingFormat(null);
    }
  }

  function handleCopyMarkdown() {
    if (filteredExpenses.length === 0) {
      toast.error("Nenhuma despesa para copiar.");
      return;
    }
    const md = generateExpensesMarkdownText(filteredExpenses, {
      title: reportMetadata.title,
      subtitle: reportMetadata.subtitle,
      businessName: "Studio Coach Montanha",
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    toast.success("Tabela e resumo em Markdown copiados para a área de transferência!");
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg">
                Exportar Informações de Despesas
              </DialogTitle>
              <DialogDescription className="text-xs">
                Exporte dados completos para análise técnica contábil, planilhas ou prompts de IA.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Parâmetros de Filtro */}
        <div className="space-y-4 rounded-xl border border-border/60 bg-muted/30 p-3.5 sm:p-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Período */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Período
              </Label>
              <Select
                value={periodPreset}
                onValueChange={(v: PeriodPreset) => setPeriodPreset(v)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_month">
                    Mês Atual ({formatMonthLabel(currentMonth)})
                  </SelectItem>
                  <SelectItem value="prev_month">
                    Mês Anterior ({formatMonthLabel(prevMonthKey)})
                  </SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                  <SelectItem value="last_6_months">Últimos 6 Meses</SelectItem>
                  <SelectItem value="current_year">Ano Corrente ({currentYear})</SelectItem>
                  <SelectItem value="custom">Personalizado (Mês a Mês)</SelectItem>
                  <SelectItem value="all">Todo o Histórico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Segmento / Modo Mesclado */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" /> Segmentos (Individual ou Mesclado)
                </Label>
                <span className="text-[10px] text-muted-foreground">
                  {selectedSegments.length === 3 ? "Todos" : `${selectedSegments.length} selecionado(s)`}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  variant={selectedSegments.includes("general") ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs gap-1 px-2.5"
                  onClick={() => toggleSegment("general")}
                >
                  <span>📦 Geral</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedSegments.includes("studio") ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs gap-1 px-2.5"
                  onClick={() => toggleSegment("studio")}
                >
                  <span>🎯 Studio</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedSegments.includes("pt") ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs gap-1 px-2.5"
                  onClick={() => toggleSegment("pt")}
                >
                  <span>🏋️ Personal Trainer</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-[11px] px-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedSegments(["general", "studio", "pt"])}
                >
                  Todos
                </Button>
              </div>
            </div>

            {/* Tipo */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-primary" /> Tipo de Custo
              </Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas (Fixas + Variáveis)</SelectItem>
                  <SelectItem value="fixed">🔒 Apenas Fixas</SelectItem>
                  <SelectItem value="variable">🔄 Apenas Variáveis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Seletor Customizado caso o usuário escolha período customizado */}
          {periodPreset === "custom" && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Do Mês (AAAA-MM)</Label>
                <Input
                  type="month"
                  value={customStartMonth}
                  onChange={(e) => setCustomStartMonth(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Até o Mês (AAAA-MM)</Label>
                <Input
                  type="month"
                  value={customEndMonth}
                  onChange={(e) => setCustomEndMonth(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Resumo do Filtro Selecionado */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Resultado da seleção:
            </span>
            <Badge variant="outline" className="border-primary/30 text-primary text-[11px] font-mono">
              {totals.count} despesa(s) selecionada(s)
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-primary/10">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Geral</div>
              <div className="text-sm sm:text-base font-bold font-mono text-foreground mt-0.5">
                {formatBRL(totals.total)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Fixas</div>
              <div className="text-sm sm:text-base font-semibold font-mono text-muted-foreground mt-0.5">
                {formatBRL(totals.fixas)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Variáveis</div>
              <div className="text-sm sm:text-base font-semibold font-mono text-muted-foreground mt-0.5">
                {formatBRL(totals.variaveis)}
              </div>
            </div>
          </div>

          {/* Breakdown por Segmento na Exportação */}
          {selectedSegments.length > 1 && (
            <div className="mt-3 pt-2.5 border-t border-primary/10">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                Distribuição por Centro de Custo no Relatório:
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                <div className={`p-1.5 rounded-lg border ${selectedSegments.includes("general") ? "bg-background/80 border-border/80" : "opacity-40 border-dashed"}`}>
                  <div className="text-[10px] text-muted-foreground">📦 Geral</div>
                  <div className="font-mono font-semibold text-[11px]">{formatBRL(segmentTotals.general.total)}</div>
                  <div className="text-[9px] text-muted-foreground">{segmentTotals.general.count} itens</div>
                </div>
                <div className={`p-1.5 rounded-lg border ${selectedSegments.includes("studio") ? "bg-background/80 border-border/80" : "opacity-40 border-dashed"}`}>
                  <div className="text-[10px] text-muted-foreground">🎯 Studio</div>
                  <div className="font-mono font-semibold text-[11px]">{formatBRL(segmentTotals.studio.total)}</div>
                  <div className="text-[9px] text-muted-foreground">{segmentTotals.studio.count} itens</div>
                </div>
                <div className={`p-1.5 rounded-lg border ${selectedSegments.includes("pt") ? "bg-background/80 border-border/80" : "opacity-40 border-dashed"}`}>
                  <div className="text-[10px] text-muted-foreground">🏋️ PT</div>
                  <div className="font-mono font-semibold text-[11px]">{formatBRL(segmentTotals.pt.total)}</div>
                  <div className="text-[9px] text-muted-foreground">{segmentTotals.pt.count} itens</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção de Formatos para Análise Técnica */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Formatos de Exportação Disponíveis</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyMarkdown}
              className="h-7 text-xs text-primary hover:text-primary gap-1 px-2"
              title="Copia a tabela em Markdown para colar em chats de IA ou Obsidian"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copiado!" : "Copiar p/ IA (Markdown)"}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Excel */}
            <Button
              variant="outline"
              className="h-auto py-2.5 px-3 flex items-start gap-3 justify-start hover:border-emerald-500 hover:bg-emerald-500/5 transition-colors"
              onClick={() => handleExport("excel")}
              disabled={totals.count === 0 || exportingFormat === "excel"}
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 mt-0.5">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                  Excel (.xlsx)
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 bg-emerald-500/15 text-emerald-700">
                    Recomendado
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  Planilha com fórmulas, valores numéricos e totais para análise contábil.
                </div>
              </div>
            </Button>

            {/* PDF */}
            <Button
              variant="outline"
              className="h-auto py-2.5 px-3 flex items-start gap-3 justify-start hover:border-rose-500 hover:bg-rose-500/5 transition-colors"
              onClick={() => handleExport("pdf")}
              disabled={totals.count === 0 || exportingFormat === "pdf"}
            >
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 mt-0.5">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs text-foreground">PDF (.pdf)</div>
                <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  Relatório executivo formatado para impressão, arquivo ou auditoria.
                </div>
              </div>
            </Button>

            {/* Markdown */}
            <Button
              variant="outline"
              className="h-auto py-2.5 px-3 flex items-start gap-3 justify-start hover:border-sky-500 hover:bg-sky-500/5 transition-colors"
              onClick={() => handleExport("md")}
              disabled={totals.count === 0 || exportingFormat === "md"}
            >
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 mt-0.5">
                <FileCode className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                  Markdown (.md)
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 bg-sky-500/15 text-sky-700">
                    Obsidian / IA
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  Tabela limpa GFM com frontmatter YAML, pronta para análise em IA.
                </div>
              </div>
            </Button>

            {/* CSV */}
            <Button
              variant="outline"
              className="h-auto py-2.5 px-3 flex items-start gap-3 justify-start hover:border-amber-500 hover:bg-amber-500/5 transition-colors"
              onClick={() => handleExport("csv")}
              disabled={totals.count === 0 || exportingFormat === "csv"}
            >
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 mt-0.5">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs text-foreground">CSV (.csv)</div>
                <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  Padrão separado por ponto e vírgula com UTF-8 BOM para planilhas e Python/R.
                </div>
              </div>
            </Button>

            {/* Texto */}
            <Button
              variant="outline"
              className="h-auto py-2.5 px-3 flex items-start gap-3 justify-start hover:border-slate-500 hover:bg-slate-500/5 transition-colors"
              onClick={() => handleExport("txt")}
              disabled={totals.count === 0 || exportingFormat === "txt"}
            >
              <div className="p-2 rounded-lg bg-slate-500/10 text-slate-600 mt-0.5">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs text-foreground">Texto (.txt)</div>
                <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  Relatório monoespaçado em texto puro para visualização rápida.
                </div>
              </div>
            </Button>

            {/* JSON */}
            <Button
              variant="outline"
              className="h-auto py-2.5 px-3 flex items-start gap-3 justify-start hover:border-purple-500 hover:bg-purple-500/5 transition-colors"
              onClick={() => handleExport("json")}
              disabled={totals.count === 0 || exportingFormat === "json"}
            >
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 mt-0.5">
                <FileCode className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs text-foreground">JSON (.json)</div>
                <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  Dados brutos estruturados com metadados para scripts e ferramentas de BI.
                </div>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
