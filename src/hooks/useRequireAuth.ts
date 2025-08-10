"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

export function useRequireAuth() {
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );

    useEffect(() => {
        let isMounted = true;
        const supabase = getSupabaseBrowserClient();

        async function init() {
            const { data } = await supabase.auth.getSession();
            if (!isMounted) return;

            const hasSession = !!data.session;
            setSession(data.session);
            setUser(data.session?.user ?? null);
            setIsAuthenticated(hasSession);
            setLoading(false);

            if (!hasSession) {
                router.replace("/admin/login");
            }
        }

        init();

        const { data: authSub } = supabase.auth.onAuthStateChange(
            (_event, sess) => {
                if (!isMounted) return;
                const hasSession = !!sess;
                setSession(sess);
                setUser(sess?.user ?? null);
                setIsAuthenticated(hasSession);

                if (!hasSession) {
                    router.replace("/admin/login");
                }
            }
        );

        return () => {
            isMounted = false;
            authSub.subscription.unsubscribe();
        };
    }, [router]);

    return { session, user, loading, isAuthenticated };
}
