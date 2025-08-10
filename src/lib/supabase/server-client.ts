import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "./config";

let serverClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
    if (!serverClient) {
        serverClient = createClient(supabaseUrl, supabaseAnonKey, {
            auth: { persistSession: false },
            global: { headers: { "X-Client-Info": "my-portfolio-server" } },
        });
    }
    return serverClient;
}
