import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const saveAiKeyServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw: unknown) => {
    const obj = raw as { apiKey?: string };
    return { apiKey: (obj?.apiKey || "").trim() };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const keyVal = data.apiKey;

    // 1. Persiste em studio_settings (campo logo_studio_base64 com prefixo AI_KEY:)
    if (keyVal) {
      await supabase
        .from("studio_settings" as never)
        .update({ logo_studio_base64: `AI_KEY:${keyVal}` } as never)
        .eq("user_id", userId);
    } else {
      await supabase
        .from("studio_settings" as never)
        .update({ logo_studio_base64: null } as never)
        .eq("user_id", userId);
    }

    // 2. Persiste também em ai_image_cache como redundância
    const promptHash = "gemini_api_key";
    if (keyVal) {
      await supabase.from("ai_image_cache" as never).delete().eq("user_id", userId).eq("prompt_hash", promptHash);
      await supabase.from("ai_image_cache" as never).insert({
        user_id: userId,
        prompt_hash: promptHash,
        prompt: "CONFIG_GEMINI_KEY",
        model: "gemini",
        aspect: "default",
        image_path: keyVal,
      } as never);
    } else {
      await supabase.from("ai_image_cache" as never).delete().eq("user_id", userId).eq("prompt_hash", promptHash);
    }

    return { ok: true };
  });

export const getAiKeyServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // 1. Tenta studio_settings
    const { data: studioRow } = await supabase
      .from("studio_settings" as never)
      .select("logo_studio_base64")
      .eq("user_id", userId)
      .maybeSingle();

    const val = (studioRow as any)?.logo_studio_base64;
    if (typeof val === "string" && val.startsWith("AI_KEY:")) {
      return { apiKey: val.replace("AI_KEY:", "").trim() };
    }

    // 2. Tenta ai_image_cache
    const { data: cacheRow } = await supabase
      .from("ai_image_cache" as never)
      .select("image_path")
      .eq("user_id", userId)
      .eq("prompt_hash", "gemini_api_key")
      .maybeSingle();

    const cacheVal = (cacheRow as any)?.image_path;
    if (typeof cacheVal === "string" && cacheVal.trim().length > 0) {
      return { apiKey: cacheVal.trim() };
    }

    // 3. Fallback para variáveis de ambiente do servidor
    const envKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (envKey && envKey.trim().length > 0) {
      return { apiKey: envKey.trim() };
    }

    return { apiKey: null };
  });
