/**
 * Utilitário Universal de Busca e Autocompletar Inteligente
 * - Remoção determinística de acentos e diacríticos em toda a aplicação (á -> a, ç -> c, õ -> o, etc.)
 * - Busca multi-termo tokenizada: encontrar "carlos silva" ao digitar "carlos silva", mesmo que o nome seja "Carlos Eduardo da Silva"
 * - Suporta múltiplos campos (nome, email, telefone, observações, etc.)
 */

export function normalizeSearchText(text?: string | null): string {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Verifica se um texto-alvo (ou lista de campos) contém todos os termos de uma consulta,
 * ignorando acentuação, maiúsculas/minúsculas e ordem das palavras.
 */
export function matchesSearchTerms(
  target: string | (string | null | undefined)[],
  query: string
): boolean {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return true;

  const fullTarget = Array.isArray(target)
    ? target.map(normalizeSearchText).join(" ")
    : normalizeSearchText(target);

  if (!fullTarget) return false;

  // Se a consulta inteira for substring contígua
  if (fullTarget.includes(normQuery)) {
    return true;
  }

  // Fragmenta a consulta em termos/palavras individuais
  const terms = normQuery.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  // Exige que TODOS os termos digitados estejam presentes no alvo
  return terms.every((term) => fullTarget.includes(term));
}

/**
 * Calcula pontuação de relevância para ordenação inteligente (matches mais próximos aparecem primeiro).
 */
export function getSearchScore(
  primaryText: string,
  query: string,
  secondaryText?: string | null
): number {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return 0;

  const normPrimary = normalizeSearchText(primaryText);
  const normSecondary = normalizeSearchText(secondaryText);

  // 1. Prefixo exato no campo principal
  if (normPrimary.startsWith(normQuery)) {
    return 150 - (normPrimary.length - normQuery.length) * 0.1;
  }

  // 2. Substring contígua no campo principal
  if (normPrimary.includes(normQuery)) {
    return 100 - (normPrimary.length - normQuery.length) * 0.1;
  }

  // 3. Multi-termo
  const terms = normQuery.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return 0;

  let score = 0;
  for (const term of terms) {
    if (normPrimary.includes(term)) {
      score += 30;
      if (normPrimary.startsWith(term)) score += 10;
    } else if (normSecondary.includes(term)) {
      score += 15;
    }
  }

  return score;
}
