export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
export const supabaseAnonKey = process.env
    .NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as
    | string
    | undefined;

function assertEnv(name: string, value: unknown) {
    if (
        process.env.NODE_ENV !== "development" &&
        (!value || String(value).trim() === "")
    ) {
        console.warn(`[supabase/config] Missing env variable: ${name}`);
    }
}

assertEnv("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl);
assertEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseAnonKey);
// service role is optional; used only on trusted server contexts
