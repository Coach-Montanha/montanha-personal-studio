import fs from "fs";

async function fetchPage(page, perPage = 100) {
  const url = `https://api.mfitpersonal.com.br/exercise/search?locale=pt-BR&page=${page}&hitsPerPage=${perPage}&q=*`;
  const res = await fetch(url, {
    headers: {
      "accept": "*/*",
      "origin": "https://user.mfitpersonal.com.br",
      "referer": "https://user.mfitpersonal.com.br/",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0"
    }
  });

  if (!res.ok) {
    throw new Error(`Erro na página ${page}: status ${res.status}`);
  }
  return res.json();
}

async function run() {
  console.log("Iniciando varredura completa da API do MFIT...");
  const first = await fetchPage(1, 100);
  const total = first.total;
  const perPage = first.perPage || 100;
  const totalPages = Math.ceil(total / perPage);
  console.log(`Total de exercícios encontrados: ${total} distribuídos em ${totalPages} páginas.`);

  let allItems = [...(first.items || [])];

  for (let p = 2; p <= totalPages; p++) {
    process.stdout.write(`Baixando página ${p}/${totalPages}... `);
    const data = await fetchPage(p, perPage);
    if (data.items && data.items.length) {
      allItems.push(...data.items);
      console.log(`OK (+${data.items.length} itens, total: ${allItems.length})`);
    } else {
      console.log("Vazio.");
    }
    // pequeno delay de 100ms para gentileza na rede
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\nDownload concluído! Total de exercícios coletados: ${allItems.length}`);

  // Salva raw completo
  fs.writeFileSync("src/data/mfit-catalog-full.json", JSON.stringify(allItems, null, 2));

  // Mapeamento dos grupos musculares do MFIT para o app Montanha
  // No MFIT: 1=Peito, 2=Dorsal, 3=Bíceps, 4=Tríceps, 5=Inferiores, 6=Ombro, 7=Abdômen, 9=Aeróbio, 11=Funcional, 5448=Mobilidade, etc.
  const groupMap = {
    1: "Peito",
    2: "Costas",
    3: "Braços",
    4: "Braços",
    5: "Pernas",
    6: "Ombros",
    7: "Core",
    9: "Cardio",
    11: "Corpo inteiro",
    14: "Mobilidade",
    5448: "Mobilidade"
  };

  const normalized = [];
  const seen = new Set();

  for (const item of allItems) {
    const rawName = (item.nome || "").trim();
    if (!rawName) continue;

    const group = groupMap[item.group] || "Outro";
    const videoUrl = item.url_media || null;
    const thumbUrl = item.url_poster || null;
    const isVideo = item.mediaType === 3 || (videoUrl && videoUrl.includes(".mp4"));

    // Deduplicação inteligente
    const key = rawName.toLowerCase();
    let finalName = rawName;
    if (seen.has(key)) {
      finalName = `${rawName} (ID ${item.objectID || item.id})`;
    } else {
      seen.add(key);
    }

    normalized.push({
      name: finalName,
      muscle_group: group,
      description: `MFIT Personal · ID: ${item.objectID || item.id}`,
      media_url: videoUrl,
      thumbnail_url: thumbUrl,
      media_type: isVideo ? "video" : (videoUrl ? "image" : null)
    });
  }

  console.log(`Total de exercícios normalizados para o ecossistema: ${normalized.length}`);
  fs.writeFileSync("src/data/mfit-exercises-normalized.json", JSON.stringify(normalized, null, 2));

  // Copia também para Montanha Hybrid Training
  const hybridDataDir = "../Montanha Hybrid Training/src/data";
  if (fs.existsSync(hybridDataDir)) {
    fs.writeFileSync(`${hybridDataDir}/mfit-exercises.json`, JSON.stringify(normalized, null, 2));
    console.log("Sincronizado também com Montanha Hybrid Training/src/data/mfit-exercises.json!");
  }

  // Gera migração SQL em batches de 200 para inserção rápida e sem estouro de tamanho
  const batches = [];
  const batchSize = 200;
  for (let i = 0; i < normalized.length; i += batchSize) {
    batches.push(normalized.slice(i, i + batchSize));
  }

  let sql = `-- Migração do Catálogo Completo do MFIT Personal (${normalized.length} exercícios com vídeos MP4)
DO $$
DECLARE
  ex record;
  batch_data jsonb;
  existing_id uuid;
  item_name text;
  item_group text;
  item_desc text;
  item_media text;
  item_thumb text;
  item_type text;
BEGIN
`;

  batches.forEach((batch, bIdx) => {
    sql += `
  -- Lote ${bIdx + 1} de ${batches.length}
  batch_data := '${JSON.stringify(batch).replace(/'/g, "''")}'::jsonb;
  FOR ex IN SELECT * FROM jsonb_to_recordset(batch_data) AS x(
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

    SELECT id INTO existing_id
    FROM public.pt_exercises_library
    WHERE LOWER(TRIM(name)) = LOWER(item_name)
    LIMIT 1;

    IF existing_id IS NOT NULL THEN
      UPDATE public.pt_exercises_library
      SET
        muscle_group = COALESCE(muscle_group, item_group),
        media_url = COALESCE(media_url, item_media),
        thumbnail_url = COALESCE(thumbnail_url, item_thumb),
        media_type = CASE WHEN media_url IS NULL AND item_media IS NOT NULL THEN item_type ELSE media_type END
      WHERE id = existing_id;
    ELSE
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
`;
  });

  sql += `
END $$;
`;

  fs.writeFileSync("supabase/migrations/20261011210000_seed_mfit_exercises_library.sql", sql);
  console.log("Migração SQL gerada com sucesso!");
}

run().catch(console.error);
