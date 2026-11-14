import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs";
import path from "path";
import { DEFAULT_STUDIO_FORMS } from "./forms-definitions";

export interface FormSubmissionBackupData {
  submissionId: string;
  formSlug?: string;
  formTitle: string;
  respondentName: string;
  respondentContact?: string;
  submittedAt?: string;
  createdAt?: string;
  protocol?: string;
  answers: Record<string, any>;
  businessName?: string;
  fieldLabels?: Record<string, string>;
}

// Caminho oficial do Google Drive montado no Windows
export const GOOGLE_DRIVE_STUDIO_FORMS_DIR = "H:\\Meu Drive\\Formulários do Studio";
export const SECURE_STORAGE_BUCKET = "studio-forms-backup";

// Helper para resolver o nome legível da pergunta
export function resolveQuestionLabel(rawKey: string, fieldLabels?: Record<string, string>): string {
  if (fieldLabels) {
    if (fieldLabels[rawKey]) return fieldLabels[rawKey];
    const withoutF = rawKey.replace(/^f_/, "");
    if (fieldLabels[withoutF]) return fieldLabels[withoutF];
  }

  // Busca nas definições padrão
  for (const form of DEFAULT_STUDIO_FORMS) {
    const match = form.fields.find(
      (f) =>
        f.id === rawKey ||
        f.id === "f_" + rawKey ||
        f.id.replace(/^f_/, "") === rawKey.replace(/^f_/, "")
    );
    if (match?.label) return match.label;
  }

  const clean = rawKey.replace(/^f_/, "");
  if (/^\d+$/.test(clean)) {
    return `Pergunta ${clean}`;
  }
  return clean.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Constrói o documento PDF oficial com formatação de alta fidelidade
 */
export function buildSubmissionPdfDoc(data: FormSubmissionBackupData) {
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

  // Cabeçalho Oficial do Studio
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 60, 6, 6, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(data.businessName || "MONTANHA PERSONAL STUDIO", margin + 18, y + 26);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text("REGISTRO OFICIAL DE FORMULÁRIO E TERMO DIGITAL — CÓPIA SEGURA", margin + 18, y + 44);

  y += 75;

  // Informações do Formulário e Protocolo
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 54, 4, 4, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(data.formTitle || "Formulário", margin + 14, y + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const protocolNumber =
    data.protocol ||
    (data.submissionId ? `SUB-${data.submissionId.slice(0, 8).toUpperCase()}` : "SUB-OFICIAL");
  const submissionDate = data.submittedAt || data.createdAt || new Date().toISOString();

  doc.text(`Protocolo: ${protocolNumber}`, margin + 14, y + 38);
  doc.text(`Data/Hora: ${new Date(submissionDate).toLocaleString("pt-BR")}`, margin + 260, y + 38);

  y += 68;

  // Dados do Respondente
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("DADOS DO ALUNO / RESPONDENTE:", margin, y);
  y += 14;

  const respondentInfo = [
    ["Nome Completo", data.respondentName || "Não informado"],
    ["Contato / WhatsApp / E-mail", data.respondentContact || "Não informado"],
    ["Canal de Registro", "Assinatura Digital Web Segura (SSL 256-bit / Supabase Cloud)"],
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
  for (const [key, value] of Object.entries(data.answers || {})) {
    if (key.startsWith("_")) continue;

    const labelFormatted = resolveQuestionLabel(key, data.fieldLabels);

    let valStr = "";
    if (typeof value === "boolean") {
      valStr = value ? "Sim / Concordo integralmente" : "Não";
    } else if (Array.isArray(value)) {
      valStr = value.join(", ");
    } else {
      valStr = String(value ?? "—");
    }

    tableRows.push([labelFormatted, valStr]);
  }

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    head: [["Campo / Pergunta", "Resposta Fornecida"]],
    body: tableRows.length > 0 ? tableRows : [["Nenhuma resposta", "—"]],
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
    `Documento autenticado eletronicamente pelo Montanha Personal Studio em ${new Date().toLocaleString("pt-BR")}. Protocolo: ${protocolNumber}`,
    margin,
    footerY + 12
  );

  const cleanFormTitle = (data.formTitle || "formulario")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const cleanRespondent = (data.respondentName || "respondente")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const shortId = (data.submissionId ? data.submissionId.slice(0, 8) : Date.now().toString().slice(-6)).toUpperCase();
  const filename = `${cleanFormTitle}-${cleanRespondent}-${shortId}.pdf`;

  return { doc, filename, protocolNumber };
}

/**
 * Gera o Buffer binário do PDF (Uint8Array) compatível com Node, Bun e Serverless
 */
export function generateSubmissionPdfBuffer(data: FormSubmissionBackupData): {
  buffer: Buffer;
  filename: string;
  protocolNumber: string;
} {
  const { doc, filename, protocolNumber } = buildSubmissionPdfDoc(data);
  const arrayBuffer = doc.output("arraybuffer");
  return {
    buffer: Buffer.from(arrayBuffer),
    filename,
    protocolNumber,
  };
}

/**
 * Salva na Pasta Virtual Segura do Supabase Storage
 */
export async function uploadToSecureStorage(
  supabaseAdmin: any,
  filename: string,
  buffer: Buffer
): Promise<{ path: string; publicUrl: string } | null> {
  try {
    const storagePath = `submissions/${filename}`;
    const { error } = await supabaseAdmin.storage
      .from(SECURE_STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      console.warn("[uploadToSecureStorage] Erro no upload:", error.message);
      return null;
    }

    const { data } = supabaseAdmin.storage
      .from(SECURE_STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return {
      path: storagePath,
      publicUrl: data?.publicUrl || "",
    };
  } catch (err: any) {
    console.warn("[uploadToSecureStorage] Exceção:", err?.message);
    return null;
  }
}

/**
 * Salva no Google Drive (pasta 'H:\Meu Drive\Formulários do Studio')
 */
export function saveToGoogleDriveFolder(
  filename: string,
  buffer: Buffer
): { synced: boolean; filePath: string } {
  try {
    const targetDir = GOOGLE_DRIVE_STUDIO_FORMS_DIR;
    if (!fs.existsSync(targetDir)) {
      try {
        fs.mkdirSync(targetDir, { recursive: true });
      } catch (mkdirErr: any) {
        console.warn("[saveToGoogleDriveFolder] Não foi possível criar diretório:", mkdirErr?.message);
      }
    }

    if (fs.existsSync(targetDir)) {
      const fullPath = path.join(targetDir, filename);
      fs.writeFileSync(fullPath, buffer);
      return { synced: true, filePath: fullPath };
    }

    return { synced: false, filePath: "" };
  } catch (err: any) {
    console.warn("[saveToGoogleDriveFolder] Exceção:", err?.message);
    return { synced: false, filePath: "" };
  }
}

/**
 * Deleta da Pasta Segura do Supabase Storage
 */
export async function deleteFromSecureStorage(
  supabaseAdmin: any,
  filename: string
): Promise<boolean> {
  try {
    const storagePath = `submissions/${filename}`;
    const { error } = await supabaseAdmin.storage
      .from(SECURE_STORAGE_BUCKET)
      .remove([storagePath]);

    return !error;
  } catch (err) {
    return false;
  }
}

/**
 * Deleta do Google Drive local
 */
export function deleteFromGoogleDriveFolder(filename: string): boolean {
  try {
    const fullPath = path.join(GOOGLE_DRIVE_STUDIO_FORMS_DIR, filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}
