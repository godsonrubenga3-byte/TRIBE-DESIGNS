import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key are required. Check your .env file or Vercel Environment Variables.')
}

// Singleton instance
// Note: createSupabaseClient will still throw if URL is missing, 
// but we've logged a clear error above.
export const supabase = createSupabaseClient(supabaseUrl || '', supabaseAnonKey || '')

export const createClient = () => supabase
