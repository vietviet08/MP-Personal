import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "./config";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
    if (typeof window === "undefined") {
        throw new Error(
            "getSupabaseBrowserClient must be called on the client"
        );
    }
    if (!browserClient) {
        browserClient = createBrowserClient(
            supabaseUrl,
            supabaseAnonKey
        ) as unknown as SupabaseClient;
    }
    return browserClient;
}
