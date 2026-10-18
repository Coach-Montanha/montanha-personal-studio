/**
 * Utilitário de busca e autocompletar inteligente para biblioteca de exercícios.
 * - Remove diacríticos/acentos ("tríceps" -> "triceps", "elevação" -> "elevacao")
 * - Suporta busca por múltiplos componentes/palavras em qualquer ordem ("rosca w", "triceps cor")
 * - Calcula pontuação de relevância para posicionar os melhores resultados no topo
 */

import { normalizeSearchText } from "./search-utils";
export { normalizeSearchText };

export interface MatchResult {
  matched: boolean;
  score: number;
}

export function matchExerciseQuery(
  name: string,
  muscleGroup: string | null | undefined,
  query: string
): MatchResult {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) {
    return { matched: true, score: 0 };
  }

  const normName = normalizeSearchText(name);
  const normGroup = normalizeSearchText(muscleGroup);
  const fullTarget = `${normName} ${normGroup}`;

  // 1. Se for substring contígua direta no nome (prioridade máxima)
  if (normName.includes(normQuery)) {
    const isPrefix = normName.startsWith(normQuery);
    return {
      matched: true,
      score: 100 + (isPrefix ? 50 : 0) - (normName.length - normQuery.length) * 0.1,
    };
  }

  // 2. Tokenização por palavras
  const terms = normQuery.split(/\s+/).filter(Boolean);
  if (terms.length === 0) {
    return { matched: true, score: 0 };
  }

  // Analisa cada termo
  let matchedNameTerms = 0;
  let matchedGroupTerms = 0;

  for (const term of terms) {
    if (normName.includes(term)) {
      matchedNameTerms++;
    } else if (normGroup.includes(term)) {
      matchedGroupTerms++;
    }
  }

  const totalMatched = matchedNameTerms + matchedGroupTerms;

  // Se TODOS os termos digitados estão presentes no nome ou grupo
  if (totalMatched === terms.length) {
    return {
      matched: true,
      score: 80 + matchedNameTerms * 10 + matchedGroupTerms * 5,
    };
  }

  // Se o usuário digitou mais de 1 termo e acertou quase todos ou ao menos 1 termo longo (>= 3 chars)
  if (terms.length > 1 && totalMatched > 0) {
    const matchRatio = totalMatched / terms.length;
    if (matchRatio >= 0.5) {
      return {
        matched: true,
        score: Math.round(matchRatio * 50),
      };
    }
  }

  return { matched: false, score: 0 };
}

export function filterAndRankExercises<T extends { name: string; muscle_group?: string | null }>(
  items: T[],
  query: string,
  selectedMuscleGroup: string = "Todos"
): T[] {
  const normQuery = normalizeSearchText(query);
  const normSelectedGroup = normalizeSearchText(selectedMuscleGroup);
  const filterByGroup = selectedMuscleGroup !== "Todos" && normSelectedGroup.length > 0;

  return items
    .filter((item) => {
      // Filtro de grupo muscular
      if (filterByGroup) {
        const itemGroup = normalizeSearchText(item.muscle_group);
        if (!itemGroup.includes(normSelectedGroup)) return false;
      }

      if (!normQuery) return true;
      const { matched } = matchExerciseQuery(item.name, item.muscle_group, normQuery);
      return matched;
    })
    .map((item) => {
      if (!normQuery) return { item, score: 0 };
      const { score } = matchExerciseQuery(item.name, item.muscle_group, normQuery);
      return { item, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.item.name.localeCompare(b.item.name);
    })
    .map((wrapper) => wrapper.item);
}
