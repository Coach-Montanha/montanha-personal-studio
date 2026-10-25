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

async function checkLib() {
  const { data: libEx } = await supabase
    .from('pt_exercises_library')
    .select('*')
    .eq('id', 'a4692b2d-50aa-422a-b9c5-4c4576ea08d8')
    .single();
  console.log('pt_exercises_library:', libEx);

  const { data: allCmv } = await supabase
    .from('pt_exercises_library')
    .select('id, name, media_url')
    .ilike('media_url', '%cmv%');
  console.log('allCmv count:', allCmv?.length);
  if (allCmv && allCmv.length > 0) {
    console.log('sample cmv in lib:', allCmv.slice(0, 5));
  }
}

checkLib();
