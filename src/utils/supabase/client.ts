import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Singleton instance
export const supabase = createSupabaseClient(supabaseUrl!, supabaseAnonKey!)

export const createClient = () => supabase
