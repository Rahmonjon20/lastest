import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

if (!url || !key) {
  console.warn('⚠️  .env faylida VITE_SUPABASE_URL va VITE_SUPABASE_KEY yo\'q!');
}

const supabase = createClient(url ?? '', key ?? '');

export default supabase;
