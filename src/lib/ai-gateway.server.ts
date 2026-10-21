/**
 * Adaptador único do Lovable AI Gateway.
 *
 * Todos os motores (tradução individual, tradução em massa, Híbrido,
 * Kettlebell Fitness e continuação de programas) devem passar por aqui.
 * Regras:
 *  - modelo resolvido em um único lugar (LOVABLE_AI_MODEL quando existir);
 *  - nunca expor a chave ao navegador (arquivo *.server.ts);
 *  - telemetria sem Authorization / API key / prompt completo;
 *  - erros HTTP classificados em códigos estáveis, nunca convertidos em sucesso.
 */

export type AiErrorCode =
  | "AI_NOT_CONFIGURED"
  | "AI_REQUEST_INVALID"
  | "AI_MODEL_INVALID"
  | "AI_RESPONSE_FORMAT_UNSUPPORTED"
  | "AI_PAYLOAD_TOO_LARGE"
  | "AI_UNAUTHORIZED"
  | "AI_RATE_LIMITED"
  | "AI_NO_CREDITS"
  | "AI_UPSTREAM_ERROR"
  | "AI_EMPTY_CONTENT"
  | "AI_INVALID_JSON";

export class AiGatewayError extends Error {
  code: AiErrorCode;
  status: number | null;
  detail: string;
  constructor(code: AiErrorCode, message: string, status: number | null = null, detail = "") {
    super(message);
    this.name = "AiGatewayError";
    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

/** Limite conservador de caracteres do prompt antes de considerar payload grande demais. */
export const MAX_PROMPT_CHARS = 120_000;

export function resolveAiModel(): string {
  const configured = process.env.LOVABLE_AI_MODEL;
  if (configured && configured.trim().length > 0) return configured.trim();
  return process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
}

function sanitize(body: string): string {
  return body.replace(/(sk-|Bearer\s+)[A-Za-z0-9._-]+/gi, "[redacted]").slice(0, 600);
}

function classify(status: number, body: string): AiGatewayError {
  const lower = body.toLowerCase();
  if (status === 400) {
    if (lower.includes("response_format") || lower.includes("json_object")) {
      return new AiGatewayError(
        "AI_RESPONSE_FORMAT_UNSUPPORTED",
        "O modelo não aceitou o formato de resposta estruturada.",
        status,
        sanitize(body),
      );
    }
    if (lower.includes("model")) {
      return new AiGatewayError(
        "AI_MODEL_INVALID",
        "O modelo de IA configurado não é aceito pelo gateway.",
        status,
        sanitize(body),
      );
    }
    if (lower.includes("token") || lower.includes("too large") || lower.includes("length")) {
      return new AiGatewayError(
        "AI_PAYLOAD_TOO_LARGE",
        "O conteúdo enviado excedeu o limite do modelo.",
        status,
        sanitize(body),
      );
    }
    return new AiGatewayError("AI_REQUEST_INVALID", "Requisição inválida para a IA.", status, sanitize(body));
  }
  if (status === 401 || status === 403) {
    return new AiGatewayError("AI_UNAUTHORIZED", "Acesso à IA bloqueado ou não autorizado.", status, sanitize(body));
  }
  if (status === 429) {
    return new AiGatewayError("AI_RATE_LIMITED", "Limite de uso da IA atingido, tente em instantes.", status, sanitize(body));
  }
  if (status === 402) {
    return new AiGatewayError("AI_NO_CREDITS", "Créditos de IA esgotados.", status, sanitize(body));
  }
  return new AiGatewayError("AI_UPSTREAM_ERROR", `Falha temporária da IA (erro ${status}).`, status, sanitize(body));
}

export function stripFences(raw: string): string {
  return raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
}

/** Extração defensiva de JSON que lida com markdown fences, preâmbulos e trailing commas */
export function parseJsonDefensive<T = any>(raw: string): T {
  const trimmed = raw.trim();
  // 1. Tenta parse direto
  try {
    return JSON.parse(trimmed);
  } catch {}

  // 2. Tenta extrair bloco de markdown ```json ... ```
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {}
  }

  // 3. Tenta extrair o maior bloco de chaves { ... }
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = trimmed.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {}
  }

  // 4. Tenta extrair o maior bloco de colchetes [ ... ]
  const firstBracket = trimmed.indexOf("[");
  const lastBracket = trimmed.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const candidate = trimmed.slice(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(candidate);
    } catch {}
  }

  try {
    return JSON.parse(stripFences(trimmed));
  } catch {
    throw new AiGatewayError("AI_INVALID_JSON", "A IA retornou um JSON inválido.", 200, sanitize(raw));
  }
}

export type CallAiJsonArgs = {
  /** Nome curto do fluxo, só para telemetria (ex.: "traducao-individual"). */
  scope: string;
  system?: string;
  prompt: string;
  inlineData?: { mimeType: string; data: string };
  temperature?: number;
  apiKey?: string;
};

export type CallAiJsonResult<T = any> = {
  json: T;
  raw: string;
  model: string;
  finishReason: string | null;
  requestId: string | null;
};

/** Chamada direta à API oficial do Google Gemini com responseMimeType: "application/json" */
async function callGeminiDirect<T = any>(apiKey: string, args: CallAiJsonArgs): Promise<CallAiJsonResult<T>> {
  const primaryModel = (process.env.GEMINI_MODEL || "gemini-3.5-flash-lite").replace(/^google\//, "");
  const candidateModels = Array.from(new Set([primaryModel, "gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"]));

  let lastError: any = null;

  for (const modelName of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const userParts: any[] = [];
    if (args.inlineData) {
      userParts.push({
        inlineData: {
          mimeType: args.inlineData.mimeType,
          data: args.inlineData.data,
        },
      });
    }
    userParts.push({ text: args.prompt });

    const body: any = {
      contents: [{ role: "user", parts: userParts }],
      generationConfig: {
        temperature: args.temperature ?? 0.7,
        responseMimeType: "application/json",
      },
    };

    if (args.system) {
      body.systemInstruction = { parts: [{ text: args.system }] };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        // Se der 404 (modelo descontinuado) ou 503 (sobrecarregado), tenta próximo modelo
        if (res.status === 404 || res.status === 503) {
          console.warn(`[callGeminiDirect] Modelo ${modelName} retornou ${res.status}, tentando próximo candidato...`);
          lastError = classify(res.status, errText);
          continue;
        }
        throw classify(res.status, errText);
      }

      const data: any = await res.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw || typeof raw !== "string" || raw.trim().length === 0) {
        throw new AiGatewayError("AI_EMPTY_CONTENT", "A IA não retornou conteúdo.", 200);
      }

      const json = parseJsonDefensive<T>(raw);
      return {
        json,
        raw,
        model: `gemini/${modelName}`,
        finishReason: data?.candidates?.[0]?.finishReason ?? "STOP",
        requestId: null,
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}

/** Chamada ao Lovable AI Gateway */
async function callLovableGateway<T = any>(apiKey: string, args: CallAiJsonArgs): Promise<CallAiJsonResult<T>> {
  const model = resolveAiModel();

  const attempt = async (useResponseFormat: boolean) => {
    const messages: Array<{ role: string; content: string }> = [];
    if (args.system) messages.push({ role: "system", content: args.system });
    messages.push({
      role: "user",
      content: useResponseFormat ? args.prompt : `${args.prompt}\n\nResponda SOMENTE com JSON válido, sem texto extra.`,
    });

    const res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model,
        messages,
        ...(useResponseFormat ? { response_format: { type: "json_object" } } : {}),
        ...(args.temperature != null ? { temperature: args.temperature } : {}),
      }),
    });

    const requestId = res.headers.get("x-request-id");

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const err = classify(res.status, body);
      console.error("[ai-gateway] falha", {
        scope: args.scope,
        model,
        status: res.status,
        code: err.code,
        requestId,
        detail: err.detail,
      });
      throw err;
    }

    const payload: any = await res.json();
    const conteudo = payload?.choices?.[0]?.message?.content;
    const finishReason = payload?.choices?.[0]?.finish_reason ?? null;

    if (typeof conteudo !== "string" || conteudo.trim().length === 0) {
      throw new AiGatewayError("AI_EMPTY_CONTENT", "A IA não retornou conteúdo.", 200);
    }

    const json = parseJsonDefensive<T>(conteudo);
    return { json, raw: conteudo, model, finishReason, requestId } as CallAiJsonResult<T>;
  };

  try {
    return await attempt(true);
  } catch (err) {
    if (err instanceof AiGatewayError && err.code === "AI_RESPONSE_FORMAT_UNSUPPORTED") {
      console.warn("[ai-gateway] repetindo sem response_format", { scope: args.scope, model });
      return await attempt(false);
    }
    throw err;
  }
}

/**
 * Lê chaves de IA via computed-property access para impedir que Nitro/Rollup
 * substitua `process.env.GEMINI_API_KEY` por `undefined` durante o build.
 * process.env["KEY"] não é tree-shaken; process.env.KEY pode ser.
 */
function getAiKey(): { geminiKey?: string; lovableKey?: string } {
  let geminiKey =
    (typeof process !== "undefined" && process.env
      ? process.env.GEMINI_API_KEY ||
        process.env.VITE_GEMINI_API_KEY ||
        process.env["GEMINI_API_KEY"] ||
        process.env["VITE_GEMINI_API_KEY"]
      : undefined) ||
    (typeof globalThis !== "undefined" && (globalThis as any).process?.env
      ? (globalThis as any).process.env.GEMINI_API_KEY || (globalThis as any).process.env["GEMINI_API_KEY"]
      : undefined);

  if (!geminiKey) {
    try {
      const metaEnv = (import.meta as any)?.env ?? {};
      geminiKey = metaEnv.VITE_GEMINI_API_KEY || metaEnv.GEMINI_API_KEY;
    } catch {}
  }

  let lovableKey =
    (typeof process !== "undefined" && process.env
      ? process.env.LOVABLE_API_KEY ||
        process.env.VITE_LOVABLE_API_KEY ||
        process.env["LOVABLE_API_KEY"] ||
        process.env["VITE_LOVABLE_API_KEY"]
      : undefined) ||
    (typeof globalThis !== "undefined" && (globalThis as any).process?.env
      ? (globalThis as any).process.env.LOVABLE_API_KEY || (globalThis as any).process.env["LOVABLE_API_KEY"]
      : undefined);

  if (!lovableKey) {
    try {
      const metaEnv = (import.meta as any)?.env ?? {};
      lovableKey = metaEnv.VITE_LOVABLE_API_KEY || metaEnv.LOVABLE_API_KEY;
    } catch {}
  }

  return {
    geminiKey: geminiKey?.trim() || undefined,
    lovableKey: lovableKey?.trim() || undefined,
  };
}

/**
 * Chamada única de JSON estruturado ao ecossistema de IA.
 * Tenta automaticamente:
 *  1. Google Gemini API direto (GEMINI_API_KEY ou VITE_GEMINI_API_KEY ou args.apiKey)
 *  2. Lovable AI Gateway (LOVABLE_API_KEY)
 *  3. Ecosystem Fallback Router (Groq, Cerebras, OpenRouter, SambaNova)
 */
export async function callLovableAiJson<T = any>(args: CallAiJsonArgs): Promise<CallAiJsonResult<T>> {
  const { geminiKey, lovableKey } = getAiKey();
  const effectiveGeminiKey = args.apiKey?.trim() || geminiKey;

  const promptChars = args.prompt.length + (args.system?.length ?? 0);
  if (promptChars > MAX_PROMPT_CHARS) {
    throw new AiGatewayError(
      "AI_PAYLOAD_TOO_LARGE",
      `As instruções/histórico excedem o limite (${promptChars} caracteres, máximo ${MAX_PROMPT_CHARS}).`,
    );
  }

  let lastError: any = null;

  // 1. Prioriza Gemini direto quando GEMINI_API_KEY ou chave personalizada está configurada
  if (effectiveGeminiKey && effectiveGeminiKey.length > 0) {
    try {
      return await callGeminiDirect<T>(effectiveGeminiKey, args);
    } catch (err) {
      console.warn("[ai-gateway] Gemini direto falhou, tentando fallback:", err);
      lastError = err;
    }
  }

  // 2. Tenta Lovable Gateway se configurado
  if (lovableKey && lovableKey.length > 0) {
    try {
      return await callLovableGateway<T>(lovableKey, args);
    } catch (err) {
      console.warn("[ai-gateway] Lovable Gateway falhou, tentando fallback:", err);
      lastError = err;
    }
  }

  // 3. Fallback: Ecosystem LLM Router (Groq, Cerebras, OpenRouter, SambaNova)
  try {
    const { generateEcosystemCompletion } = await import("@/lib/ecosystem-llm-router");
    const ecoRes = await generateEcosystemCompletion({
      prompt: args.prompt,
      systemInstruction: args.system,
      temperature: args.temperature ?? 0.7,
      excludeProviders: effectiveGeminiKey ? ["gemini"] : undefined,
    });
    const json = parseJsonDefensive<T>(ecoRes.text);
    return {
      json,
      raw: ecoRes.text,
      model: `${ecoRes.providerUsed}/${ecoRes.modelUsed}`,
      finishReason: "STOP",
      requestId: null,
    };
  } catch (ecoErr: any) {
    console.warn("[ai-gateway] Ecosystem router fallback falhou:", ecoErr);
    if (!lastError) lastError = ecoErr;
  }

  if (lastError instanceof AiGatewayError) {
    throw lastError;
  }

  if (!effectiveGeminiKey && !lovableKey) {
    throw new AiGatewayError(
      "AI_NOT_CONFIGURED",
      "Chave da IA não configurada no servidor (GEMINI_API_KEY ou LOVABLE_API_KEY). Adicione GEMINI_API_KEY no painel da Vercel ou insira sua chave do Google Gemini.",
    );
  }

  throw new AiGatewayError(
    "AI_UPSTREAM_ERROR",
    `Falha ao comunicar com os provedores de IA: ${lastError?.message || lastError}`,
  );
}
