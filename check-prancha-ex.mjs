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

async function checkPranchaTrainingExercise() {
  const { data: exs } = await supabase
    .from('pt_training_exercises')
    .select('id, name, media_url, media_type, thumbnail_url')
    .ilike('name', '%Prancha%');

  console.log('Prancha exercises in pt_training_exercises:');
  console.log(JSON.stringify(exs, null, 2));
}

checkPranchaTrainingExercise();
