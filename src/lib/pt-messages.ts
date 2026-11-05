/**
 * Centralized generator for WhatsApp check-in and workout proof messages.
 * Guarantees zero duplication, accurate deficit calculation, and smart status handling.
 */

export type StudentBalanceSummary = {
  contracted: number;
  used: number;
  remaining: number;
  packagesWithBalance?: any[];
};

export type PaymentPackageSummary = {
  id?: string;
  contracted: number;
  used: number;
  remaining: number;
  planName?: string | null;
};

export function buildCheckinWhatsAppMessage({
  studentName,
  dateLabel,
  timeLabel,
  durationLabel = "60 min",
  bal,
  chosen,
  isAlreadyRecorded = false,
  customTemplate,
}: {
  studentName: string;
  dateLabel: string;
  timeLabel: string;
  durationLabel?: string;
  bal?: StudentBalanceSummary | null;
  chosen?: PaymentPackageSummary | null;
  isAlreadyRecorded?: boolean;
  customTemplate?: string;
}): string {
  // Se a aula acabou de ser registrada neste check-in, o saldo pós-aula diminui em 1.
  // Se a aula já foi registrada no banco (ex: comprovante do calendário), o saldo atual no banco já a inclui.
  const currentRemaining = bal?.remaining ?? 0;
  const totalRemainingAfter = isAlreadyRecorded ? currentRemaining : currentRemaining - 1;

  const currentUsed = chosen ? chosen.used : (bal?.used ?? 0);
  const usedAfter = isAlreadyRecorded ? currentUsed : currentUsed + 1;
  const contracted = chosen?.contracted ?? bal?.contracted ?? 0;

  // CASO 1: ALUNO EM DÉBITO / SALDO NEGATIVO (Treinou sem pacote ativo ou além do contratado)
  if (totalRemainingAfter < 0) {
    return [
      `Olá ${studentName}! ✅`,
      ``,
      `Seu check-in foi registrado com sucesso!`,
      ``,
      `📅 *Data:* ${dateLabel}`,
      `🕐 *Horário:* ${timeLabel}`,
      ``,
      `ℹ️ Check-in registrado, mas você está sem aulas em aberto. Fale com seu treinador para renovar.`,
      ``,
      `Aula registrada: ${totalRemainingAfter}`,
      ``,
      `Bom treino! 💪`,
    ].join("\n");
  }

  // CASO 2: PACOTE CONCLUÍDO / ESGOTADO (Exatamente 0 aulas restantes)
  if (totalRemainingAfter === 0) {
    return [
      `Olá ${studentName}! ✅`,
      ``,
      `Seu check-in foi registrado com sucesso!`,
      ``,
      `📅 *Data:* ${dateLabel}`,
      `🕐 *Horário:* ${timeLabel}`,
      ``,
      `📦 *Saldo restante:* 0 aula(s)`,
      `   • ${contracted} de ${contracted} aulas utilizadas`,
      ``,
      `ℹ️ Pacote concluído! Você completou todas as ${contracted} aulas. Fale com seu treinador para renovar.`,
      ``,
      `Bom treino! 💪`,
    ].join("\n");
  }

  // CASO 3: PACOTE ATIVO COM SALDO POSITIVO (> 0)
  // Se o treinador configurou um modelo customizado e o aluno tem saldo positivo, aplica as variáveis
  if (customTemplate && customTemplate.trim()) {
    return customTemplate
      .replace(/\{\{aluno\}\}/gi, studentName)
      .replace(/\{\{data\}\}/gi, dateLabel)
      .replace(/\{\{hora\}\}/gi, timeLabel)
      .replace(/\{\{duracao\}\}/gi, durationLabel)
      .replace(/\{\{saldo\}\}/gi, String(totalRemainingAfter))
      .replace(/\{\{utilizadas\}\}/gi, String(usedAfter))
      .replace(/\{\{contratadas\}\}/gi, String(contracted))
      .replace(/\{\{plano\}\}/gi, chosen?.planName ?? "");
  }

  // Padrão do sistema quando há saldo positivo
  const openPackages = bal?.packagesWithBalance?.length ?? 1;
  const lines: string[] = [
    `Olá ${studentName}! ✅`,
    ``,
    `Seu check-in foi registrado com sucesso!`,
    ``,
    `📅 *Data:* ${dateLabel}`,
    `🕐 *Horário:* ${timeLabel}`,
    ``,
  ];

  if (openPackages > 1) {
    lines.push(`📦 *Saldo restante:* ${totalRemainingAfter} aula(s) em ${openPackages} pacote(s)`);
  } else {
    lines.push(`📦 *Saldo restante:* ${totalRemainingAfter} aula(s)`);
  }
  lines.push(`   • ${usedAfter} de ${contracted} aulas utilizadas`);

  const otherRemaining = (bal?.packagesWithBalance ?? [])
    .filter((p: any) => p.id !== chosen?.id)
    .reduce((acc: number, p: any) => acc + (p.remaining ?? 0), 0);
  const otherCount = (bal?.packagesWithBalance ?? [])
    .filter((p: any) => p.id !== chosen?.id && (p.remaining ?? 0) > 0).length;
  if (otherCount > 0) {
    lines.push(`   • Outros pacotes em aberto: ${otherCount} pacote(s), ${otherRemaining} aula(s)`);
  }

  lines.push(``);
  lines.push(`Bom treino! 💪`);
  const finalMsg = lines.join("\n");
  return finalMsg.replace(
    /https?:\/\/[a-zA-Z0-9.-]*lovable\.app[^\s]*/gi,
    "https://montanha-personal-studio.vercel.app"
  );
}
