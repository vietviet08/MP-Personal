"use client";

import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function DashboardPage() {
    async function signOut() {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
    }

    return (
        <main className="py-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <button
                    onClick={signOut}
                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
                >
                    Đăng xuất
                </button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Link
                    href="/admin/posts"
                    className="rounded-md border p-4 hover:bg-accent"
                >
                    <div className="text-lg font-medium">Bài viết</div>
                    <div className="text-sm text-muted-foreground">
                        Quản lý Posts
                    </div>
                </Link>
                <Link
                    href="/admin/projects"
                    className="rounded-md border p-4 hover:bg-accent"
                >
                    <div className="text-lg font-medium">Dự án</div>
                    <div className="text-sm text-muted-foreground">
                        Quản lý Projects
                    </div>
                </Link>
                <Link
                    href="/admin/messages"
                    className="rounded-md border p-4 hover:bg-accent"
                >
                    <div className="text-lg font-medium">Tin nhắn</div>
                    <div className="text-sm text-muted-foreground">
                        Quản lý Contact Messages
                    </div>
                </Link>
            </div>
        </main>
    );
}
