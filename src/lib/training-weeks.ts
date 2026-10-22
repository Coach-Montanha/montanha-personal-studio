/**
 * Helpers para organização semanal de treinos e distinção
 * entre treinos realizados com o Coach vs realizados sozinho.
 */

export type TrainingDayMeta = {
  weekNumber: number;
  isWithCoach: boolean;
  cleanDescription: string;
};

/**
 * Extrai os metadados de semana e tipo de acompanhamento de um dia de treino.
 */
export function parseDayMeta(
  day: {
    name?: string | null;
    day_label?: string | null;
    description?: string | null;
    sort_order?: number | null;
  },
  index: number = 0,
  totalDays: number = 1
): TrainingDayMeta {
  const desc = day.description || "";
  const label = day.day_label || "";
  const name = day.name || "";

  // 1. Identificar se é treino com o Coach (Presencial / Acompanhado)
  const isWithCoach =
    desc.includes("[COM_COACH]") ||
    desc.includes("[SUPERVISIONADO]") ||
    desc.includes("[PRESENCIAL]") ||
    /\[COACH\]/i.test(desc) ||
    /com\s+(o\s+)?(coach|personal|professor)/i.test(name) ||
    /com\s+(o\s+)?(coach|personal|professor)/i.test(label) ||
    /presencial/i.test(name) ||
    /presencial/i.test(label);

  const cleanDescription = desc
    .replace(/\[COM_COACH\]/gi, "")
    .replace(/\[SUPERVISIONADO\]/gi, "")
    .replace(/\[PRESENCIAL\]/gi, "")
    .replace(/\[COACH\]/gi, "")
    .replace(/\[SEMANA:\d+\]/gi, "")
    .trim();

  // 2. Identificar o número da Semana
  let weekNumber = 1;
  const weekMatchDesc = desc.match(/\[SEMANA:(\d+)\]/i);
  const weekMatchLabel = label.match(/S(\d+)D\d+/i) || label.match(/semana\s*(\d+)/i) || label.match(/W(\d+)/i);
  const weekMatchName = name.match(/semana\s*(\d+)/i);

  if (weekMatchDesc) {
    weekNumber = parseInt(weekMatchDesc[1], 10);
  } else if (weekMatchLabel) {
    weekNumber = parseInt(weekMatchLabel[1], 10);
  } else if (weekMatchName) {
    weekNumber = parseInt(weekMatchName[1], 10);
  } else {
    // Se o dia não possui rótulo explícito de semana,
    // inferimos a semana através da repetição cíclica de dias.
    // Ex: Dia 1, Dia 2, Dia 1, Dia 2... a cada repetição de Dia 1, avança a semana.
    // Ou pelo índice relativo (blocos de 2, 3 ou 4 treinos).
    if (totalDays > 4) {
      // Padrão muito comum: rotinas de 2 ou 3 dias/semana
      const daysPerCycle = totalDays % 3 === 0 ? 3 : 2;
      weekNumber = Math.floor(index / daysPerCycle) + 1;
    } else {
      weekNumber = 1;
    }
  }

  return {
    weekNumber: Math.max(1, weekNumber),
    isWithCoach,
    cleanDescription,
  };
}

/**
 * Agrupa uma lista de dias de treino por semana, ordenados logicamente.
 */
export function groupDaysByWeek<T extends {
  id: string;
  name?: string | null;
  day_label?: string | null;
  description?: string | null;
  sort_order?: number | null;
}>(days: T[]): { weekNumber: number; days: T[] }[] {
  if (!days || days.length === 0) return [];

  // Mapear primeiro para detectar reinícios de ciclo (ex: Dia 1, Dia 2, Dia 1, Dia 2)
  const labeledDays: { day: T; week: number }[] = [];
  let currentWeek = 1;
  let seenLabelsInWeek = new Set<string>();

  days.forEach((day, idx) => {
    const rawLabel = (day.day_label || day.name || `Dia ${idx + 1}`).toLowerCase().trim();
    const explicitMeta = parseDayMeta(day, idx, days.length);

    // Se tiver semana explícita no label ou tag, respeita
    if (
      day.description?.match(/\[SEMANA:(\d+)\]/i) ||
      day.day_label?.match(/S(\d+)D\d+/i) ||
      day.day_label?.match(/semana\s*(\d+)/i) ||
      day.name?.match(/semana\s*(\d+)/i)
    ) {
      currentWeek = explicitMeta.weekNumber;
      seenLabelsInWeek.clear();
      seenLabelsInWeek.add(rawLabel);
      labeledDays.push({ day, week: currentWeek });
      return;
    }

    // Se o rótulo já apareceu nesta semana (ex: viu "Dia 1" de novo), avança para a próxima semana!
    if (seenLabelsInWeek.has(rawLabel) && seenLabelsInWeek.size > 0) {
      currentWeek++;
      seenLabelsInWeek.clear();
    }

    seenLabelsInWeek.add(rawLabel);
    labeledDays.push({ day, week: currentWeek });
  });

  // Agrupar
  const groupsMap = new Map<number, T[]>();
  for (const { day, week } of labeledDays) {
    const arr = groupsMap.get(week) || [];
    arr.push(day);
    groupsMap.set(week, arr);
  }

  return Array.from(groupsMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([weekNumber, daysInWeek]) => ({ weekNumber, days: daysInWeek }));
}

/**
 * Formata a tag de metadados para salvar em pt_training_days.description
 */
export function buildDayDescription(options: {
  description?: string | null;
  isWithCoach?: boolean;
  weekNumber?: number;
}): string {
  const parts: string[] = [];

  if (options.isWithCoach) {
    parts.push("[COM_COACH]");
  }
  if (options.weekNumber && options.weekNumber > 0) {
    parts.push(`[SEMANA:${options.weekNumber}]`);
  }

  const clean = (options.description || "")
    .replace(/\[COM_COACH\]/gi, "")
    .replace(/\[SUPERVISIONADO\]/gi, "")
    .replace(/\[PRESENCIAL\]/gi, "")
    .replace(/\[COACH\]/gi, "")
    .replace(/\[SEMANA:\d+\]/gi, "")
    .trim();

  if (clean) {
    parts.push(clean);
  }

  return parts.join(" ");
}


/**
 * Aplica progressão ou variação de carga matemática a uma string de carga (ex: '60kg', '20 kg').
 */
export function applyLoadVariation(
  load: string | null | undefined,
  variationType: "none" | "add_2kg" | "add_5pct" | "deload_15pct"
): string | null {
  if (!load || variationType === "none") return load ?? null;

  // Procura padrão numérico + unidade (ex: 60kg, 12.5 kg, 20)
  const match = load.trim().match(/^(\d+(?:[.,]\d+)?)\s*(kg|kilos?|lbs?|barras?|placas?)?$/i);
  if (!match) return load;

  const num = parseFloat(match[1].replace(",", "."));
  if (isNaN(num)) return load;

  const unit = match[2] || "kg";
  let newNum = num;

  if (variationType === "add_2kg") {
    newNum = num + 2;
  } else if (variationType === "add_5pct") {
    newNum = Math.round((num * 1.05) * 2) / 2;
  } else if (variationType === "deload_15pct") {
    newNum = Math.round((num * 0.85) * 2) / 2;
  }

  return `${newNum}${unit ? ` ${unit}` : ""}`.trim();
}
