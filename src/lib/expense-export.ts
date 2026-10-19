import { formatBRL, formatDateBR } from "@/lib/format";

export type ExpenseExportItem = {
  id: string;
  description: string;
  amount: number;
  expense_date: string;
  reference_month: string;
  segment: string;
  type: string;
  notes?: string | null;
  category_name?: string;
};

export type ExportOptions = {
  title?: string;
  subtitle?: string;
  filename?: string;
  businessName?: string;
};

const SEGMENT_LABELS: Record<string, string> = {
  general: "Geral",
  studio: "Studio",
  pt: "Personal Trainer",
  all: "Todos",
};

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w.-]+/g, "_");
}

function calculateTotals(expenses: ExpenseExportItem[]) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const fixas = expenses
    .filter((e) => e.type === "fixed")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const variaveis = expenses
    .filter((e) => e.type === "variable")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  return { total, fixas, variaveis, count: expenses.length };
}

/** Exportação para Excel (.xlsx) */
export async function exportExpensesToExcel(
  expenses: ExpenseExportItem[],
  options: ExportOptions = {}
) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();

  const businessName = options.businessName || "Studio Coach Montanha";
  const title = options.title || "Relatório Detalhado de Despesas";
  const subtitle = options.subtitle || `Emitido em: ${new Date().toLocaleDateString("pt-BR")}`;
  const totals = calculateTotals(expenses);

  const aoa: any[][] = [
    [businessName],
    [title.toUpperCase()],
    [subtitle],
    [],
    [
      "Total Geral:",
      totals.total,
      "Fixas:",
      totals.fixas,
      "Variáveis:",
      totals.variaveis,
      "Qtd Lançamentos:",
      totals.count,
    ],
    [],
    [
      "Data",
      "Mês Ref.",
      "Descrição",
      "Categoria",
      "Segmento",
      "Tipo",
      "Valor (R$)",
      "Observações",
    ],
  ];

  for (const exp of expenses) {
    aoa.push([
      formatDateBR(exp.expense_date),
      exp.reference_month,
      exp.description,
      exp.category_name || "Sem categoria",
      SEGMENT_LABELS[exp.segment] || exp.segment,
      exp.type === "fixed" ? "Fixa" : "Variável",
      Number(exp.amount),
      exp.notes || "",
    ]);
  }

  // Linha de totais
  aoa.push([]);
  aoa.push([
    "TOTAL",
    "",
    "",
    "",
    "",
    "",
    totals.total,
    `Fixas: ${formatBRL(totals.fixas)} | Variáveis: ${formatBRL(totals.variaveis)}`,
  ]);

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Largura das colunas
  ws["!cols"] = [
    { wch: 12 }, // Data
    { wch: 10 }, // Mês Ref.
    { wch: 35 }, // Descrição
    { wch: 22 }, // Categoria
    { wch: 16 }, // Segmento
    { wch: 12 }, // Tipo
    { wch: 15 }, // Valor
    { wch: 40 }, // Observações
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Despesas");

  const today = new Date().toISOString().slice(0, 10);
  const defaultFilename = `Despesas_${sanitizeFilename(businessName)}_${today}.xlsx`;
  XLSX.writeFile(wb, options.filename || defaultFilename);
}

/** Exportação para PDF (.pdf) */
export async function exportExpensesToPdf(
  expenses: ExpenseExportItem[],
  options: ExportOptions = {}
) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 36;
  let y = margin + 5;

  const businessName = options.businessName || "Studio Coach Montanha";
  const title = options.title || "Relatório Detalhado de Despesas";
  const subtitle = options.subtitle || `Emitido em: ${new Date().toLocaleDateString("pt-BR")}`;
  const totals = calculateTotals(expenses);

  // Header Banner
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 48, 4, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(businessName, margin + 14, y + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`${title.toUpperCase()} · ${subtitle}`, margin + 14, y + 36);

  doc.setFontSize(8.5);
  doc.text(
    `Total: ${formatBRL(totals.total)}`,
    pageWidth - margin - 14,
    y + 28,
    { align: "right" }
  );

  y += 60;

  // Mini Cards de Resumo
  const cardW = (pageWidth - margin * 2 - 16) / 3;
  const cardH = 34;

  // Total
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, cardW, cardH, 3, 3, "FD");
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.text("TOTAL GERAL", margin + 8, y + 12);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(formatBRL(totals.total), margin + 8, y + 26);

  // Fixas
  const x2 = margin + cardW + 8;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(x2, y, cardW, cardH, 3, 3, "FD");
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("DESPESAS FIXAS", x2 + 8, y + 12);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(formatBRL(totals.fixas), x2 + 8, y + 26);

  // Variáveis
  const x3 = x2 + cardW + 8;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(x3, y, cardW, cardH, 3, 3, "FD");
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("DESPESAS VARIÁVEIS", x3 + 8, y + 12);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(formatBRL(totals.variaveis), x3 + 8, y + 26);

  y += cardH + 14;

  const tableHead = [
    ["Data", "Descrição", "Categoria", "Seg.", "Tipo", "Valor"]
  ];

  const tableBody = expenses.map((exp) => [
    formatDateBR(exp.expense_date),
    exp.description,
    exp.category_name || "—",
    SEGMENT_LABELS[exp.segment] || exp.segment,
    exp.type === "fixed" ? "Fixa" : "Var.",
    formatBRL(exp.amount),
  ]);

  const tableFoot = [
    [
      "TOTAL",
      `${totals.count} lançamento(s)`,
      "",
      "",
      "",
      formatBRL(totals.total),
    ]
  ];

  autoTable(doc, {
    startY: y,
    head: tableHead,
    body: tableBody,
    foot: tableFoot,
    styles: { fontSize: 8, cellPadding: 5 },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [51, 65, 85],
      fontStyle: "bold",
    },
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      fontSize: 8.5,
    },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 95 },
      3: { cellWidth: 50 },
      4: { cellWidth: 40 },
      5: { halign: "right", fontStyle: "bold", cellWidth: 70 },
    },
    margin: { left: margin, right: margin },
  });

  const today = new Date().toISOString().slice(0, 10);
  const defaultFilename = `Despesas_${sanitizeFilename(businessName)}_${today}.pdf`;
  doc.save(options.filename || defaultFilename);
}

/** Gera texto em Markdown (Gfm/Obsidian) */
export function generateExpensesMarkdownText(
  expenses: ExpenseExportItem[],
  options: ExportOptions = {}
): string {
  const businessName = options.businessName || "Studio Coach Montanha";
  const title = options.title || "Relatório Detalhado de Despesas";
  const subtitle = options.subtitle || `Emitido em: ${new Date().toLocaleDateString("pt-BR")}`;
  const totals = calculateTotals(expenses);

  const lines: string[] = [];

  // Frontmatter para Obsidian / ferramentas de análise
  lines.push("---");
  lines.push(`tipo: relatorio_despesas`);
  lines.push(`empresa: "${businessName}"`);
  lines.push(`emissao: "${new Date().toISOString()}"`);
  lines.push(`total_despesas: ${totals.total}`);
  lines.push(`total_fixas: ${totals.fixas}`);
  lines.push(`total_variaveis: ${totals.variaveis}`);
  lines.push(`quantidade_lancamentos: ${totals.count}`);
  lines.push("---");
  lines.push("");

  lines.push(`# ${title}`);
  lines.push(`**${businessName}** · *${subtitle}*`);
  lines.push("");

  lines.push("## Resumo Financeiro");
  lines.push(`- **Total Geral:** ${formatBRL(totals.total)}`);
  lines.push(`- **Despesas Fixas:** ${formatBRL(totals.fixas)} (${totals.total > 0 ? ((totals.fixas / totals.total) * 100).toFixed(1) : 0}%)`);
  lines.push(`- **Despesas Variáveis:** ${formatBRL(totals.variaveis)} (${totals.total > 0 ? ((totals.variaveis / totals.total) * 100).toFixed(1) : 0}%)`);
  lines.push(`- **Lançamentos Analisados:** ${totals.count}`);
  lines.push("");

  lines.push("## Detalhamento das Despesas");
  lines.push("| Data | Mês Ref. | Descrição | Categoria | Segmento | Tipo | Valor | Observações |");
  lines.push("| :--- | :---: | :--- | :--- | :---: | :---: | ---: | :--- |");

  for (const exp of expenses) {
    const dataBr = formatDateBR(exp.expense_date);
    const cat = exp.category_name || "—";
    const seg = SEGMENT_LABELS[exp.segment] || exp.segment;
    const tipo = exp.type === "fixed" ? "Fixa" : "Variável";
    const val = formatBRL(exp.amount);
    const obs = (exp.notes || "").replace(/\|/g, "/").replace(/\n/g, " ");
    const desc = exp.description.replace(/\|/g, "/");

    lines.push(`| ${dataBr} | ${exp.reference_month} | ${desc} | ${cat} | ${seg} | ${tipo} | ${val} | ${obs} |`);
  }

  lines.push(`| **TOTAL** | — | **${totals.count} itens** | — | — | — | **${formatBRL(totals.total)}** | Fixas: ${formatBRL(totals.fixas)} / Var: ${formatBRL(totals.variaveis)} |`);
  lines.push("");

  return lines.join("\n");
}

/** Exportação para Markdown (.md) */
export function exportExpensesToMarkdown(
  expenses: ExpenseExportItem[],
  options: ExportOptions = {}
) {
  const content = generateExpensesMarkdownText(expenses, options);
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const today = new Date().toISOString().slice(0, 10);
  const defaultFilename = `Despesas_${sanitizeFilename(options.businessName || "Studio")}_${today}.md`;
  triggerDownload(blob, options.filename || defaultFilename);
}

/** Exportação para CSV (.csv) compatível com Excel brasileiro (ponto e vírgula) */
export function exportExpensesToCsv(
  expenses: ExpenseExportItem[],
  options: ExportOptions = {}
) {
  const totals = calculateTotals(expenses);
  const rows: string[] = [];

  // BOM para Excel reconhecer acentos em UTF-8
  const BOM = "\uFEFF";

  rows.push("Data;Mês Referência;Descrição;Categoria;Segmento;Tipo;Valor Numérico;Valor Formatado;Observações");

  for (const exp of expenses) {
    const dataBr = formatDateBR(exp.expense_date);
    const cat = (exp.category_name || "").replace(/;/g, ",");
    const seg = SEGMENT_LABELS[exp.segment] || exp.segment;
    const tipo = exp.type === "fixed" ? "Fixa" : "Variável";
    const valorNum = Number(exp.amount).toFixed(2).replace(".", ",");
    const valorFmt = formatBRL(exp.amount).replace(/;/g, ",");
    const desc = (exp.description || "").replace(/;/g, ",");
    const obs = (exp.notes || "").replace(/;/g, ",").replace(/\n/g, " ");

    rows.push(`"${dataBr}";"${exp.reference_month}";"${desc}";"${cat}";"${seg}";"${tipo}";${valorNum};"${valorFmt}";"${obs}"`);
  }

  // Linha total
  const totalNum = totals.total.toFixed(2).replace(".", ",");
  rows.push(`"TOTAL";"";"${totals.count} lançamentos";"";"";"";${totalNum};"${formatBRL(totals.total)}";"Fixas: ${formatBRL(totals.fixas)} | Variáveis: ${formatBRL(totals.variaveis)}"`);

  const csvContent = BOM + rows.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const today = new Date().toISOString().slice(0, 10);
  const defaultFilename = `Despesas_${sanitizeFilename(options.businessName || "Studio")}_${today}.csv`;
  triggerDownload(blob, options.filename || defaultFilename);
}

/** Exportação para Texto simples (.txt) para visualização rápida ou logs */
export function exportExpensesToTxt(
  expenses: ExpenseExportItem[],
  options: ExportOptions = {}
) {
  const businessName = options.businessName || "Studio Coach Montanha";
  const title = options.title || "RELATÓRIO DE DESPESAS";
  const subtitle = options.subtitle || `Emitido em: ${new Date().toLocaleDateString("pt-BR")}`;
  const totals = calculateTotals(expenses);

  const lines: string[] = [];
  lines.push("=".repeat(78));
  lines.push(businessName.toUpperCase().center(78));
  lines.push(title.toUpperCase().center(78));
  lines.push(subtitle.center(78));
  lines.push("=".repeat(78));
  lines.push("");
  lines.push(`TOTAL GERAL:       ${formatBRL(totals.total)}`);
  lines.push(`DESPESAS FIXAS:    ${formatBRL(totals.fixas)}`);
  lines.push(`DESPESAS VARIÁVEIS:${formatBRL(totals.variaveis)}`);
  lines.push(`QUANTIDADE:        ${totals.count} lançamentos`);
  lines.push("-".repeat(78));
  lines.push(
    "DATA".padEnd(12) +
    "TIPO".padEnd(8) +
    "SEGMENTO".padEnd(12) +
    "DESCRIÇÃO".padEnd(30) +
    "VALOR".padStart(16)
  );
  lines.push("-".repeat(78));

  for (const exp of expenses) {
    const data = formatDateBR(exp.expense_date).padEnd(12);
    const tipo = (exp.type === "fixed" ? "Fixa" : "Var.").padEnd(8);
    const seg = (SEGMENT_LABELS[exp.segment] || exp.segment).slice(0, 10).padEnd(12);
    const desc = exp.description.slice(0, 28).padEnd(30);
    const val = formatBRL(exp.amount).padStart(16);

    lines.push(`${data}${tipo}${seg}${desc}${val}`);
    if (exp.notes) {
      lines.push(`   Obs: ${exp.notes}`);
    }
  }

  lines.push("-".repeat(78));
  lines.push("TOTAL GERAL:".padEnd(62) + formatBRL(totals.total).padStart(16));
  lines.push("=".repeat(78));

  const blob = new Blob([lines.join("\r\n")], { type: "text/plain;charset=utf-8" });
  const today = new Date().toISOString().slice(0, 10);
  const defaultFilename = `Despesas_${sanitizeFilename(businessName)}_${today}.txt`;
  triggerDownload(blob, options.filename || defaultFilename);
}

/** Exportação para JSON (.json) para análise técnica / BI */
export function exportExpensesToJson(
  expenses: ExpenseExportItem[],
  options: ExportOptions = {}
) {
  const totals = calculateTotals(expenses);
  const payload = {
    metadata: {
      businessName: options.businessName || "Studio Coach Montanha",
      title: options.title || "Relatório de Despesas",
      subtitle: options.subtitle || null,
      exportedAt: new Date().toISOString(),
      summary: totals,
    },
    expenses: expenses.map((e) => ({
      id: e.id,
      date: e.expense_date,
      referenceMonth: e.reference_month,
      description: e.description,
      category: e.category_name || null,
      segment: e.segment,
      type: e.type,
      amount: Number(e.amount),
      notes: e.notes || null,
    })),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const today = new Date().toISOString().slice(0, 10);
  const defaultFilename = `Despesas_${sanitizeFilename(options.businessName || "Studio")}_${today}.json`;
  triggerDownload(blob, options.filename || defaultFilename);
}

// Auxiliar para centralizar strings
declare global {
  interface String {
    center(width: number, fillChar?: string): string;
  }
}

if (!String.prototype.center) {
  String.prototype.center = function (width: number, fillChar = " "): string {
    const str = this.toString();
    if (str.length >= width) return str;
    const leftPadding = Math.floor((width - str.length) / 2);
    const rightPadding = width - str.length - leftPadding;
    return fillChar.repeat(leftPadding) + str + fillChar.repeat(rightPadding);
  };
}
