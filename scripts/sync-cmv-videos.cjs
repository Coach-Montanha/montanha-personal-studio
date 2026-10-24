const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const s = createClient(
  'https://muryznvaxzszcffrbxpv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cnl6bnZheHpzemNmZnJieHB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDQ0MTE2OSwiZXhwIjoyMTAwMDE3MTY5fQ.SpYzAP5ej1jUKyIPGSowyZrG_eeox50HmKnP1r81a24'
);

const dir = 'C:\\Users\\Administrator\\Documents\\Projetos\\Backup-Instagram-VideosCoachMontanha';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'));

console.log('Total de vídeos MP4 para sincronizar:', files.length);

async function run() {
  let uploaded = 0;
  const cmvUrlMap = {};

  // 1. Upload dos arquivos limpos
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const match = file.match(/#CMV(\d+)/i);
    if (!match) continue;
    const num = match[1];
    const targetKey = `cmv/cmv_${num}.mp4`;
    const fullPath = path.join(dir, file);
    const buf = fs.readFileSync(fullPath);

    const { error } = await s.storage.from('exercise-media').upload(targetKey, buf, {
      contentType: 'video/mp4',
      upsert: true
    });

    if (error) {
      console.error(`Erro no upload de ${file}:`, error.message);
    } else {
      uploaded++;
      const publicUrl = `https://muryznvaxzszcffrbxpv.supabase.co/storage/v1/object/public/exercise-media/${targetKey}`;
      cmvUrlMap[num] = publicUrl;
      if (uploaded % 25 === 0) {
        console.log(`Progresso: ${uploaded}/${files.length} vídeos enviados...`);
      }
    }
  }

  console.log(`Upload concluído! Total: ${uploaded}`);

  // 2. Atualizar pt_exercises_library
  const { data: libRows } = await s.from('pt_exercises_library').select('id, name, media_url');
  let libUpdated = 0;
  for (const row of libRows || []) {
    const match = (row.media_url || '').match(/#CMV(\d+)/i);
    if (match && cmvUrlMap[match[1]]) {
      await s.from('pt_exercises_library').update({
        media_url: cmvUrlMap[match[1]],
        media_type: 'video'
      }).eq('id', row.id);
      libUpdated++;
    }
  }
  console.log(`pt_exercises_library atualizada: ${libUpdated} exercícios com vídeos limpos e corretos.`);

  // 3. Atualizar pt_training_exercises
  const { data: trainRows } = await s.from('pt_training_exercises').select('id, name, media_url');
  let trainUpdated = 0;
  for (const row of trainRows || []) {
    const match = (row.media_url || '').match(/#CMV(\d+)/i);
    if (match && cmvUrlMap[match[1]]) {
      await s.from('pt_training_exercises').update({
        media_url: cmvUrlMap[match[1]],
        media_type: 'video'
      }).eq('id', row.id);
      trainUpdated++;
    }
  }
  console.log(`pt_training_exercises atualizada: ${trainUpdated} exercícios com vídeos limpos e corretos.`);
}

run().catch(console.error);
