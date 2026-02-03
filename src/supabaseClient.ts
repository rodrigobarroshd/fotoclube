import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ou ANON KEY não definida no .env')
}

// Exporta o client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
