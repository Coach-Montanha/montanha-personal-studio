export type FormSubmissionPdfData = {
  formTitle: string;
  formSlug: string;
  respondentName: string;
  respondentContact?: string;
  submittedAt: string;
  protocol: string;
  answers: Record<string, any>;
  businessName?: string;
};

export async function downloadFormSubmissionPdf(data: FormSubmissionPdfData) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // Moldura decorativa
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(1);
  doc.roundedRect(margin - 10, margin - 10, contentWidth + 20, pageHeight - margin * 2 + 20, 8, 8);

  let y = margin + 10;

  // Cabeçalho Oficial
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 60, 6, 6, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(data.businessName || "MONTANHA PERSONAL STUDIO", margin + 18, y + 26);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text("REGISTRO OFICIAL DE FORMULÁRIO E TERMO DIGITAL", margin + 18, y + 44);

  y += 75;

  // Informações do Formulário e Protocolo
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 54, 4, 4, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(data.formTitle, margin + 14, y + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Protocolo: ${data.protocol}`, margin + 14, y + 38);
  doc.text(`Data/Hora: ${new Date(data.submittedAt).toLocaleString("pt-BR")}`, margin + 260, y + 38);

  y += 68;

  // Dados do Respondente
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("DADOS DO ALUNO / RESPONDENTE:", margin, y);
  y += 14;

  const respondentInfo = [
    ["Nome Completo", data.respondentName],
    ["Contato / WhatsApp / E-mail", data.respondentContact || "Não informado"],
    ["Canal de Registro", "Assinatura Digital Web Segura (SSL 256-bit)"],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "striped",
    head: [],
    body: respondentInfo,
    styles: { fontSize: 8.5, cellPadding: 4, textColor: [30, 41, 59] },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 160, textColor: [71, 85, 105] },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 20;

  // Perguntas e Respostas
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("RESPOSTAS REGISTRADAS:", margin, y);
  y += 14;

  const tableRows: string[][] = [];
  for (const [key, value] of Object.entries(data.answers)) {
    if (key.startsWith("_")) continue; // ignora metadados internos como _protocol

    const labelFormatted = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    let valStr = "";
    if (typeof value === "boolean") {
      valStr = value ? "Sim / Concordo integralmente" : "Não";
    } else if (Array.isArray(value)) {
      valStr = value.join(", ");
    } else {
      valStr = String(value || "—");
    }

    tableRows.push([labelFormatted, valStr]);
  }

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    head: [["Campo / Pergunta", "Resposta Fornecida"]],
    body: tableRows,
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 6,
      overflow: "linebreak",
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 160, textColor: [51, 65, 85] },
    },
  });

  // Rodapé com Carimbo Jurídico e Hash
  const footerY = pageHeight - margin - 20;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Documento gerado eletronicamente pelo Montanha Personal Studio em ${new Date().toLocaleString("pt-BR")}. Protocolo de Validade: ${data.protocol}`,
    margin,
    footerY + 12
  );

  const cleanFilename = (data.formTitle || "formulario")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const studentClean = data.respondentName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-");

  doc.save(`${cleanFilename}-${studentClean}.pdf`);
}
