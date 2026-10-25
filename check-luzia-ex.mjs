import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (m) {
    let v = (m[2] || '').trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    env[m[1]] = v;
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY);

async function checkLuziaExercises() {
  const { data: days } = await supabase
    .from('pt_training_days')
    .select('id, name, day_label, description, program_id')
    .order('created_at', { ascending: false })
    .limit(10);

  console.log('Days:', JSON.stringify(days, null, 2));

  if (days && days.length > 0) {
    const dayIds = days.map(d => d.id);
    const { data: exercises } = await supabase
      .from('pt_exercises')
      .select('id, name, media_url, media_type, thumbnail_url, pt_day_id')
      .in('pt_day_id', dayIds);

    console.log('Exercises in recent days:');
    for (const ex of exercises || []) {
      console.log('ID:', ex.id, 'Name:', ex.name, 'media_url:', ex.media_url, 'media_type:', ex.media_type);
    }
  }
}

checkLuziaExercises();
