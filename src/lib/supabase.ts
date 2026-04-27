import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Client-side Supabase client (safe to use in browser)
export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// Server-side Supabase client with elevated privileges (API routes only!)
export function createServerSupabaseClient() {
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;
  return createClient(supabaseUrl, supabaseSecretKey);
}
