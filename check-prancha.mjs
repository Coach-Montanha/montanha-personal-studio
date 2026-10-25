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

async function checkExercises() {
  const { data: exercises } = await supabase
    .from('pt_exercises')
    .select('id, name, media_url, media_type, thumbnail_url')
    .ilike('name', '%Prancha%');

  console.log('Exercises matching Prancha:');
  console.log(JSON.stringify(exercises, null, 2));

  // Check in mfit catalog if available
  const { data: libraryEx } = await supabase
    .from('exercise_library')
    .select('id, name, media_url, media_type, thumbnail_url')
    .ilike('name', '%Prancha%')
    .limit(5);
  console.log('exercise_library:', JSON.stringify(libraryEx, null, 2));
}

checkExercises();
