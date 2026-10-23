/**
 * Serviço Serverless de Notificações WhatsApp para o Treinador/Gestor
 * Executa na Vercel / Node.js sem depender do notebook estar ligado.
 */

export function sanitizeWhatsAppNumber(phone: string): string {
  let cleaned = (phone || "").replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }
  if (cleaned.length === 10 || cleaned.length === 11) {
    cleaned = "55" + cleaned;
  }
  return cleaned;
}

export type WhatsAppAlertPayload = {
  type: "checkin" | "pre_class_20m";
  studentName?: string;
  className: string;
  timeFormatted: string;
  programName?: string;
  date?: string;
  isBonus?: boolean;
  attendees?: string[];
  trainerPhone?: string;
};

export async function sendTrainerWhatsAppAlert(payload: WhatsAppAlertPayload) {
  const targetPhone = sanitizeWhatsAppNumber(
    payload.trainerPhone || process.env.TRAINER_WHATSAPP_PHONE || "5583999259385"
  );

  let messageText = "";

  if (payload.type === "checkin") {
    messageText = [
      "🔔 *NOVO CHECK-IN NO STUDIO*",
      "━━━━━━━━━━━━━━━━━━",
      `👤 *Aluno:* ${payload.studentName || "Aluno"}`,
      `🏋️ *Turma:* ${payload.className}`,
      `⏰ *Horário:* ${payload.timeFormatted}`,
      payload.programName ? `📌 *Programa:* ${payload.programName}` : null,
      payload.isBonus ? "⭐ *Tipo:* Check-in Bônus" : null,
      payload.date ? `📅 *Data:* ${payload.date}` : null,
      "━━━━━━━━━━━━━━━━━━",
      "⚡ _Aviso automático do Ecossistema Montanha_",
    ]
      .filter(Boolean)
      .join("\n");
  } else if (payload.type === "pre_class_20m") {
    const attendees = payload.attendees ?? [];
    const attendeesList =
      attendees.length > 0
        ? attendees.map((name, i) => `  ${i + 1}. ${name}`).join("\n")
        : "  (Nenhum aluno realizou check-in até o momento)";

    messageText = [
      "⏰ *LEMBRETE: AULA EM 20 MINUTOS*",
      "━━━━━━━━━━━━━━━━━━",
      `🏋️ *Turma:* ${payload.className}`,
      `⏰ *Início:* ${payload.timeFormatted}`,
      `👥 *Alunos Confirmados (${attendees.length}):*`,
      attendeesList,
      "━━━━━━━━━━━━━━━━━━",
      "📋 _Prepare a sala e os equipamentos necessários._",
    ].join("\n");
  }

  // 1. Log interno no console do servidor
  console.log(`[WhatsApp Serverless] Disparando para ${targetPhone}:`);
  console.log(messageText);

  // 2. Disparo HTTP para o Gateway configurado (Evolution API, Z-API, Baileys Cloud ou Webhook)
  const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL;
  const gatewayToken = process.env.WHATSAPP_GATEWAY_TOKEN || "";

  if (!gatewayUrl) {
    console.warn(
      "[WhatsApp Serverless] WHATSAPP_GATEWAY_URL não configurada no ambiente. Mensagem registrada no log serverless."
    );
    return { ok: true, queued: true, targetPhone, simulated: true };
  }

  try {
    let body: any;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (gatewayToken) {
      headers["apikey"] = gatewayToken;
      headers["Authorization"] = `Bearer ${gatewayToken}`;
      headers["Client-Token"] = gatewayToken;
      headers["x-api-key"] = gatewayToken;
    }

    // Auto-adaptação do payload de acordo com o endpoint
    if (gatewayUrl.includes("/send-now") || gatewayUrl.includes("/api/schedule")) {
      // Baileys / Montanha-WhatsApp-System
      body = JSON.stringify({
        contacts: [targetPhone],
        message: messageText,
        isImmediate: true,
      });
    } else if (gatewayUrl.includes("/sendText") || gatewayUrl.includes("/message/sendText")) {
      // Evolution API
      body = JSON.stringify({
        number: targetPhone,
        text: messageText,
      });
    } else if (gatewayUrl.includes("/send-text")) {
      // Z-API
      body = JSON.stringify({
        phone: targetPhone,
        message: messageText,
      });
    } else {
      // Payload universal para webhooks (n8n, Make, Custom)
      body = JSON.stringify({
        phone: targetPhone,
        number: targetPhone,
        message: messageText,
        text: messageText,
      });
    }

    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers,
      body,
    });

    const respText = await response.text();
    console.log(`[WhatsApp Serverless] Resposta do Gateway (${response.status}):`, respText);

    return { ok: response.ok, status: response.status, response: respText };
  } catch (err: any) {
    console.error("[WhatsApp Serverless] Erro no envio via gateway:", err.message);
    return { ok: false, error: err.message };
  }
}
