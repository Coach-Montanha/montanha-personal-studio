import fs from "fs";
import path from "path";

const raw = JSON.parse(fs.readFileSync("src/data/mfit-exercises-extracted.json", "utf8"));
console.log("Total extraídos:", raw.length);

const groupMapping = {
  "Abdômen": "Core",
  "Funcional": "Corpo inteiro",
  "Inferiores": "Pernas",
  "Dorsal": "Costas",
  "Ombro": "Ombros",
  "Aeróbio": "Cardio",
  "Mobilidade": "Mobilidade",
  "Alongamento": "Mobilidade",
  "Peitoral": "Peito",
  "Tríceps": "Braços",
  "Outros": "Outro"
};

const processed = [];
const seenNames = new Map();

for (const ex of raw) {
  const cleanName = ex.name.trim();
  const targetGroup = groupMapping[ex.exerciseGroup?.nome] || "Outro";
  const isVideo = ex.mediaType === 3 || (ex.urlMedia && ex.urlMedia.includes(".mp4"));
  const mediaType = isVideo ? "video" : (ex.urlMedia ? "image" : null);

  let finalName = cleanName;
  if (seenNames.has(cleanName.toLowerCase())) {
    const count = seenNames.get(cleanName.toLowerCase()) + 1;
    seenNames.set(cleanName.toLowerCase(), count);
    finalName = `${cleanName} (Variação ${count})`;
  } else {
    seenNames.set(cleanName.toLowerCase(), 1);
  }

  processed.push({
    name: finalName,
    muscle_group: targetGroup,
    description: `MFIT Personal · Grupo: ${ex.exerciseGroup?.nome ?? 'Geral'}${ex.exerciseCategory?.name ? ` · Categoria: ${ex.exerciseCategory.name}` : ''}`,
    media_url: ex.urlMedia || null,
    thumbnail_url: ex.urlPoster || null,
    media_type: mediaType,
  });
}

console.log("Processados com sucesso:", processed.length);

// Escreve arquivo JSON processado para consumo do app
fs.writeFileSync("src/data/mfit-exercises-normalized.json", JSON.stringify(processed, null, 2));

// Gera o script SQL de migração para o Supabase
let sql = `-- Migração com 100% dos exercícios reais extraídos do MFIT Personal
-- Inserção idempotente com mesclagem de metadados e vídeos na public.pt_exercises_library

DO $$
DECLARE
  ex record;
  exercises_data jsonb := '${JSON.stringify(processed).replace(/'/g, "''")}'::jsonb;
  existing_id uuid;
  item_name text;
  item_group text;
  item_desc text;
  item_media text;
  item_thumb text;
  item_type text;
BEGIN
  FOR ex IN SELECT * FROM jsonb_to_recordset(exercises_data) AS x(
    name text,
    muscle_group text,
    description text,
    media_url text,
    thumbnail_url text,
    media_type text
  )
  LOOP
    item_name := TRIM(ex.name);
    item_group := ex.muscle_group;
    item_desc := ex.description;
    item_media := ex.media_url;
    item_thumb := ex.thumbnail_url;
    item_type := ex.media_type;

    -- Busca se já existe por nome semelhante ou idêntico
    SELECT id INTO existing_id
    FROM public.pt_exercises_library
    WHERE LOWER(TRIM(name)) = LOWER(item_name)
    LIMIT 1;

    IF existing_id IS NOT NULL THEN
      -- Atualiza/Mescla informações faltantes sem sobrescrever customizações
      UPDATE public.pt_exercises_library
      SET
        muscle_group = COALESCE(muscle_group, item_group),
        description = CASE 
          WHEN description IS NULL OR description = '' THEN item_desc 
          ELSE description 
        END,
        media_url = COALESCE(media_url, item_media),
        thumbnail_url = COALESCE(thumbnail_url, item_thumb),
        media_type = CASE 
          WHEN media_url IS NULL AND item_media IS NOT NULL THEN item_type 
          ELSE media_type 
        END
      WHERE id = existing_id;
    ELSE
      -- Insere como movimento global da biblioteca
      INSERT INTO public.pt_exercises_library (
        name,
        muscle_group,
        description,
        media_url,
        thumbnail_url,
        media_type,
        is_global
      ) VALUES (
        item_name,
        item_group,
        item_desc,
        item_media,
        item_thumb,
        item_type,
        true
      );
    END IF;
  END LOOP;
END $$;
`;

fs.writeFileSync("supabase/migrations/20261011210000_seed_mfit_exercises_library.sql", sql);
console.log("Migração SQL gerada com sucesso!");
