import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseServiceRoleKey } from "./config";

export function getSupabaseAdminClient(): SupabaseClient {
    if (!supabaseServiceRoleKey) {
        throw new Error(
            "SUPABASE_SERVICE_ROLE_KEY is required for admin client"
        );
    }
    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false },
        global: { headers: { "X-Client-Info": "my-portfolio-admin" } },
    });
}
