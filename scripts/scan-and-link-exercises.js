import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const [k, ...v] = l.split("=");
      return [k.trim(), v.join("=").trim().replace(/^["']|["']$/g, "")];
    })
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

function normalizar(nome) {
  if (!nome) return "";
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\(.*?\)/g, " ") // remove conteúdo entre parênteses ex: (ou assistida), (pulley)
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function loadAllLibraryExercises() {
  let all = [];
  let from = 0;
  const STEP = 1000;
  while (true) {
    const { data, error } = await supabase
      .from("pt_exercises_library")
      .select("id, name, media_url, media_type, thumbnail_url")
      .range(from, from + STEP - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < STEP) break;
    from += STEP;
  }
  return all;
}

async function run() {
  const lib = await loadAllLibraryExercises();
  const candidatesWithVideo = lib.filter(x => !!x.media_url && !!x.name);

  const { data: semMedia } = await supabase
    .from("pt_training_exercises")
    .select("id, name, exercise_library_id, media_url, training_day_id")
    .is("media_url", null);

  console.log(`Exercícios ainda sem media_url: ${semMedia?.length || 0}`);

  const updates = [];
  for (const ex of (semMedia || [])) {
    const norm = normalizar(ex.name);
    if (norm.length < 3) continue;

    // Ignora termos de cardio puro / volta à calma sem movimento específico de musculação
    if (norm.includes("volta a calma") || norm.includes("descompressao") || norm.includes("esteira")) {
      continue;
    }

    let match = candidatesWithVideo.find(c => normalizar(c.name) === norm);
    if (!match) {
      match = candidatesWithVideo.find(c => {
        const cn = normalizar(c.name);
        return (norm.length >= 4 && cn.includes(norm)) || (cn.length >= 4 && norm.includes(cn));
      });
    }

    if (match) {
      updates.push({
        id: ex.id,
        name: ex.name,
        matched: match.name,
        media_url: match.media_url,
        media_type: match.media_type || "video",
        thumbnail_url: match.thumbnail_url,
        exercise_library_id: match.id,
      });
    }
  }

  console.log(`Encontrados mais ${updates.length} vínculos!`);
  for (const u of updates) {
    await supabase
      .from("pt_training_exercises")
      .update({
        media_url: u.media_url,
        media_type: u.media_type,
        thumbnail_url: u.thumbnail_url,
        exercise_library_id: u.exercise_library_id,
      })
      .eq("id", u.id);
    console.log(`- "${u.name}" -> "${u.matched}"`);
  }

  const { count: comVideo } = await supabase
    .from("pt_training_exercises")
    .select("*", { count: "exact", head: true })
    .not("media_url", "is", null);

  const { count: total } = await supabase
    .from("pt_training_exercises")
    .select("*", { count: "exact", head: true });

  console.log(`\n=== TOTAL ATUALIZADO ===`);
  console.log(`Exercícios com vídeo ativo: ${comVideo} de ${total} (${((comVideo / total) * 100).toFixed(1)}%)`);
}

run().catch(console.error);
