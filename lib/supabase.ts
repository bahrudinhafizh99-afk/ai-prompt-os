import { createClient } from '@supabase/supabase-js';

// Pastikan variabel lingkungan terbaca, jika tidak sediakan string kosong agar tidak crash saat inisialisasi awal
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Inisialisasi client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Validasi sederhana di console (hanya muncul saat development/build)
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("⚠️ Supabase credentials are missing. Please check your Vercel Environment Variables.");
}
