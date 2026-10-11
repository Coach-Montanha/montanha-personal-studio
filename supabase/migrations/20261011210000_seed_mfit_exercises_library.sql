-- Migração para adicionar e mesclar os exercícios extraídos da rotina e acervo MFIT
-- Tabela: public.pt_exercises_library (is_global = true para disponibilização no catálogo geral)

DO $$
DECLARE
  ex record;
  exercises_data jsonb := '[
    {
      "name": "Abdominal Canivete",
      "muscle_group": "Core",
      "description": "Abdominal Canivete no solo para fortalecimento de retos e flexores do quadril. Tags: Abdômen, Musculação.",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Abdominal Canivete Alternado",
      "muscle_group": "Core",
      "description": "Variação unilateral alternada do abdominal canivete com foco em oblíquos e controle lombo-pélvico. Tags: Abdômen, Musculação.",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Abdominal com Rodinha Solo com Apoio",
      "muscle_group": "Core",
      "description": "Abdominal com roda de exercícios no solo com apoio de joelhos. Ênfase em anti-extensão lombar. Tags: Abdômen, Musculação.",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Mobilidade Torácica IV",
      "muscle_group": "Mobilidade",
      "description": "Trabalho de rotação e extensão torácica para liberação articular da cintura escapular e coluna torácica.",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Barra Horizontal no Smith",
      "muscle_group": "Costas",
      "description": "Puxada horizontal invertida na barra do Smith com apoio dos calcanhares no solo.",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Agachamento Livre",
      "muscle_group": "Pernas",
      "description": "Padrão fundamental de agachamento joelho-dominante com peso corporal ou sobrecarga livre.",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Agachamento Goblet com Kettlebell",
      "muscle_group": "Pernas",
      "description": "Agachamento frontal segurando kettlebell junto ao peito, promovendo alinhamento vertical do tronco.",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Elevação de Pernas (S)",
      "muscle_group": "Core",
      "description": "Elevação de pernas suspensa ou no solo para ativação infra-abdominal e controle de pelve.",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Carregamento Unilateral de Kettlebell",
      "muscle_group": "Core",
      "description": "Suitcase carry / caminhada unilateral com kettlebell para força de pegada e anti-flexão lateral do core.",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Agachamento Frontal Smith",
      "muscle_group": "Pernas",
      "description": "Agachamento frontal guiado no Smith. Séries de referência: Pirâmide 1x12 (leve) + 1x10 (moderada) + 1x8 (pesada), intervalo 60s.",
      "media_url": "https://vd.mfitpersonal.com.br/331/mp4/331.mp4",
      "media_type": "video"
    },
    {
      "name": "Cardio (Bicicleta/Esteira/Escada/Elíptico)",
      "muscle_group": "Cardio",
      "description": "7 a 10 minutos de deslocamento contínuo em ergômetros (Escada, Bicicleta, Esteira ou Elíptico).",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Cadeira Flexora",
      "muscle_group": "Pernas",
      "description": "Flexão de joelhos na máquina com ênfase em isquiotibiais. Prescrição de referência: 2x15 pesadas, carga ~50kg, intervalo 60s.",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Abdução de Quadril Máquina",
      "muscle_group": "Glúteos",
      "description": "Afastamento de pernas na cadeira abdutora com foco no glúteo médio. Prescrição de referência: 2x35 pesadas, carga ~100kg, intervalo 60s.",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Peck Deck",
      "muscle_group": "Peito",
      "description": "Voador peitoral na máquina para isolamento de peitoral maior. Prescrição de referência: 2x12, carga ~35kg, intervalo 60s.",
      "media_url": null,
      "media_type": "image"
    },
    {
      "name": "Remada Baixa Supinada",
      "muscle_group": "Costas",
      "description": "Puxada no cabo baixo com pegada supinada para latíssimo do dorso e romboides. Prescrição de referência: 2x12, carga ~6 placas, intervalo 60s.",
      "media_url": null,
      "media_type": "image"
    }
  ]'::jsonb;
  existing_id uuid;
  item_name text;
  item_group text;
  item_desc text;
  item_media text;
  item_type text;
BEGIN
  FOR ex IN SELECT * FROM jsonb_to_recordset(exercises_data) AS x(
    name text,
    muscle_group text,
    description text,
    media_url text,
    media_type text
  )
  LOOP
    item_name := TRIM(ex.name);
    item_group := ex.muscle_group;
    item_desc := ex.description;
    item_media := ex.media_url;
    item_type := ex.media_type;

    -- Verifica se já existe exercício com nome semelhante ou idêntico
    SELECT id INTO existing_id
    FROM public.pt_exercises_library
    WHERE LOWER(TRIM(name)) = LOWER(item_name)
    LIMIT 1;

    IF existing_id IS NOT NULL THEN
      -- Mescla dados faltantes no registro existente
      UPDATE public.pt_exercises_library
      SET
        muscle_group = COALESCE(muscle_group, item_group),
        description = CASE 
          WHEN description IS NULL OR description = '' THEN item_desc 
          ELSE description 
        END,
        media_url = COALESCE(media_url, item_media),
        media_type = CASE 
          WHEN media_url IS NULL AND item_media IS NOT NULL THEN item_type 
          ELSE media_type 
        END
      WHERE id = existing_id;
    ELSE
      -- Insere como novo movimento global no catálogo
      INSERT INTO public.pt_exercises_library (
        name,
        muscle_group,
        description,
        media_url,
        media_type,
        is_global
      ) VALUES (
        item_name,
        item_group,
        item_desc,
        item_media,
        item_type,
        true
      );
    END IF;
  END LOOP;
END $$;
