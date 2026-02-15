import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pvdrsavwmgwuugxcbijx.supabase.co";

/**
 * ⚠️ USE *PUBLISHABLE* KEY ONLY
 * starts with: sb_publishable_
 */
const supabaseAnonKey =
  "sb_publishable_xZaHr8anXzNFQUdYhKJwEQ_hAPUFpEa";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
