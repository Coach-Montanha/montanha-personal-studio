import type { AiDay, AiExercise, AiPrescription } from "@/lib/prescricao-ia.server";

/**
 * Converte determinísticamente o texto extraído de uma planilha (.xlsx, .csv, .txt, markdown)
 * em uma estrutura de treino (AiPrescription) sem passar pela IA e sem gastar tokens.
 */
export function parsePlanilhaParaTreino(
  texto: string,
  defaultTitle?: string | null
): AiPrescription {
  if (!texto || !texto.trim()) {
    return { days: [], notes: "" };
  }

  const lines = texto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const days: AiDay[] = [];
  let currentDay: AiDay | null = null;
  let dayIndex = 1;

  const startNewDay = (name: string, label?: string) => {
    const cleanLabel = (label || `T${dayIndex}`).trim().toUpperCase();
    currentDay = {
      name: name.trim() || `Treino ${cleanLabel}`,
      day_label: cleanLabel,
      description: "",
      week_number: 1,
      exercises: [],
    };
    days.push(currentDay);
    dayIndex++;
  };

  const isHeaderRow = (line: string): boolean => {
    const l = line.toLowerCase();
    const hasEx =
      l.includes("exercício") ||
      l.includes("exercicio") ||
      l.includes("nome") ||
      l.includes("exercise") ||
      l.includes("movimento");
    const hasSetsOrReps =
      l.includes("série") ||
      l.includes("serie") ||
      l.includes("reps") ||
      l.includes("carga") ||
      l.includes("sets") ||
      l.includes("descanso");
    return hasEx && hasSetsOrReps;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Ignora linhas puramente decorativas
    if (!line || /^[-=_*~]{3,}$/.test(line)) continue;

    // Ignora mensagens de instrução de arquivos de imagem/pdf que não contêm dados
    if (line.startsWith("[Arquivo") || line.startsWith("A IA analisará visualmente") || line.startsWith("A IA interpretará")) {
      continue;
    }

    // 1. Detectar cabeçalho de aba do Excel ou divisão de treino
    // Exemplos:
    // "=== ABA: Treino A ==="
    // "=== Treino A ==="
    // "# Treino A - Peito"
    // "Treino A - Peito e Tríceps"
    // "Dia 1: Costas e Bíceps"
    // "Sessão 2"
    const abaMatch = line.match(/^={2,}\s*(?:ABA:\s*)?([^=]+)\s*={2,}$/i);
    const hashMatch = line.match(/^#{1,3}\s+(.+)$/);
    const dayPrefixMatch = line.match(/^(?:treino|dia|sess[ãa]o|ficha|bloco)\s*([a-z0-9\-_ ]+)/i);

    if (abaMatch) {
      const title = abaMatch[1].trim();
      const labelMatch = title.match(/(?:treino|dia|sess[ãa]o|ficha)?\s*([a-z0-9]+)/i);
      startNewDay(title, labelMatch ? labelMatch[1] : undefined);
      continue;
    }

    if (hashMatch) {
      const title = hashMatch[1].trim();
      const labelMatch = title.match(/(?:treino|dia|sess[ãa]o|ficha)?\s*([a-z0-9]+)/i);
      startNewDay(title, labelMatch ? labelMatch[1] : undefined);
      continue;
    }

    // Se a linha começar com "Treino A", "Dia 1" e NÃO contiver separadores de tabela/exercício
    if (
      dayPrefixMatch &&
      !line.includes(",") &&
      !line.includes(";") &&
      !line.includes("|") &&
      !line.includes("\t") &&
      !/\d+\s*[xX]\s*\d+/.test(line)
    ) {
      startNewDay(line, dayPrefixMatch[1].trim());
      continue;
    }

    // Se for cabeçalho de colunas (Exercício, Séries...), pula
    if (isHeaderRow(line)) continue;

    // Se for linha de tabela markdown separadora (|---|---|)
    if (/^\|?\s*[-:]+[-| :]*$/.test(line)) continue;

    // Se ainda não temos um dia iniciado, cria o Treino A padrão
    if (!currentDay) {
      const initialTitle = defaultTitle
        ? defaultTitle.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ")
        : "Treino A";
      startNewDay(initialTitle, "A");
    }

    // 2. Extrair dados do exercício
    let cols: string[] = [];
    if (line.includes("\t")) {
      cols = line.split("\t").map((c) => c.trim()).filter((c) => c.length > 0);
    } else if (line.includes("|")) {
      cols = line.split("|").map((c) => c.trim()).filter((c) => c.length > 0);
    } else if (line.includes(";")) {
      cols = line.split(";").map((c) => c.trim()).filter((c) => c.length > 0);
    } else if (line.includes(",") && (line.match(/,/g) || []).length >= 2) {
      cols = line.split(",").map((c) => c.trim()).filter((c) => c.length > 0);
    }

    let exName = "";
    let setsReps = "3x10";
    let load = "";
    let restSec: number | null = 60;
    let obs = "";

    if (cols.length >= 2) {
      exName = cols[0].replace(/^[\d.)\s-]+/, "").trim();

      // Caso 1: Coluna 1 contém Séries x Reps (ex: "4x10", "3 x 12-15")
      if (/\d+\s*[xX]\s*[\d\-]+/.test(cols[1])) {
        setsReps = cols[1];
        if (cols[2]) load = cols[2];
        if (cols[3]) {
          const restNum = parseInt(cols[3].replace(/\D/g, ""), 10);
          if (!isNaN(restNum)) restSec = restNum;
        }
        if (cols[4]) obs = cols[4];
        if (cols[5]) obs = `${obs} ${cols[5]}`.trim();
      } else if (/^\d+$/.test(cols[1].trim()) && cols[2] && /^\d+/.test(cols[2].trim())) {
        // Caso 2: Coluna 1 = Séries (ex: 4), Coluna 2 = Repetições (ex: 10)
        setsReps = `${cols[1].trim()}x${cols[2].trim()}`;
        if (cols[3]) load = cols[3];
        if (cols[4]) {
          const restNum = parseInt(cols[4].replace(/\D/g, ""), 10);
          if (!isNaN(restNum)) restSec = restNum;
        }
        if (cols[5]) obs = cols[5];
      } else {
        // Caso 3: Colunas genéricas
        setsReps = cols[1] || "3x10";
        if (cols[2]) load = cols[2];
        if (cols[3]) obs = cols[3];
      }
    } else {
      // Linha de texto simples: ex "1. Supino reto 4x10 60kg descanso 60s" ou "Agachamento - 3x12 - 40kg"
      let clean = line.replace(/^[\d.)\s-]+/, "").trim();

      // Procura descanso (ex: 60s, 90 seg, descanso: 60)
      const restMatch = clean.match(/(?:descanso|pausa|rest)?\s*(\d+)\s*(?:s|seg|segundos?|min|m\b)/i);
      if (restMatch) {
        const val = parseInt(restMatch[1], 10);
        if (!isNaN(val)) {
          restSec = restMatch[0].includes("min") ? val * 60 : val;
        }
        clean = clean.replace(restMatch[0], "").trim();
      }

      // Procura carga (ex: 60kg, 15 kg, 20kilos, 45 lbs)
      const loadMatch = clean.match(/(\d+(?:[.,]\d+)?\s*(?:kg|kilos?|lbs?))/i);
      if (loadMatch) {
        load = loadMatch[1].trim();
        clean = clean.replace(loadMatch[0], "").trim();
      }

      // Procura padrão de séries x repetições (ex: 4x10, 3 x 12, 4X8-10, 3x15reps)
      const setsMatch = clean.match(/(\d+\s*[xX]\s*[\d\-]+(?:\s*(?:reps?|repeti[çc][õo]es))?)/i);
      if (setsMatch) {
        setsReps = setsMatch[1].trim();
        const parts = clean.split(setsMatch[0]);
        exName = parts[0].trim().replace(/[-–:,|]+$/, "").trim();
        obs = parts.slice(1).join(" ").trim().replace(/^[-–:,|]+/, "").trim();
      } else {
        // Caso não encontre padrão de repetições, usa a linha como nome se tiver mais de 2 letras
        exName = clean.replace(/[-–:,|]+$/, "").trim();
      }
    }

    // Valida se temos um nome de exercício razoável
    if (exName && exName.length >= 2) {
      currentDay.exercises.push({
        name: exName,
        sets_reps: setsReps || "3x10",
        load: load || "",
        rest_seconds: restSec,
        observations: obs || "",
        group: "",
        group_type: "individual",
      });
    }
  }

  // Filtra dias vazios
  const validDays = days.filter((d) => d.exercises.length > 0);

  return {
    days: validDays,
    notes: validDays.length > 0
      ? `Treino importado diretamente da planilha (${validDays.length} sessão/sessões, total de ${validDays.reduce((acc, d) => acc + d.exercises.length, 0)} exercícios) sem modificações de IA.`
      : "",
  };
}
