import { createClient } from '@supabase/supabase-js'
import localSupabase from './localSupabase.js'

const useLocal = process.env.USE_LOCAL_DB === 'true'

const supabase = useLocal
  ? localSupabase
  : createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    )

export { supabase }
