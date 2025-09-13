"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

export function useAuthGuard() {
    const router = useRouter();
    const pathname = usePathname();
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );

    const isAdminPage =
        pathname.startsWith("/admin") && !pathname.includes("/login");

    useEffect(() => {
        let isMounted = true;
        const supabase = getSupabaseBrowserClient();

        async function initAuth() {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (!isMounted) return;

                if (error || !data.session) {
                    setSession(null);
                    setUser(null);
                    setIsAuthenticated(false);
                    setLoading(false);

                    if (isAdminPage) {
                        router.replace("/admin/login");
                    }
                    return;
                }

                setSession(data.session);
                setUser(data.session.user);
                setIsAuthenticated(true);
                setLoading(false);
            } catch {
                if (!isMounted) return;
                setSession(null);
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);

                if (isAdminPage) {
                    router.replace("/admin/login");
                }
            }
        }

        initAuth().then(() => {
            if (!isMounted) return;
            setLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, sess) => {
                if (!isMounted) return;

                const hasSession = !!sess;
                setSession(sess);
                setUser(sess?.user ?? null);
                setIsAuthenticated(hasSession);

                if (!hasSession && event === "SIGNED_OUT") {
                    if (isAdminPage) {
                        router.replace("/admin/login");
                    }
                }

                if (hasSession && pathname === "/admin/login") {
                    router.replace("/admin");
                }
            }
        );

        return () => {
            isMounted = false;
            authListener.subscription.unsubscribe();
        };
    }, [router, isAdminPage, pathname]);

    return {
        session,
        user,
        loading,
        isAuthenticated,
        isReady: !loading && isAuthenticated !== null,
    };
}
