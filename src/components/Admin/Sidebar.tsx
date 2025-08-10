"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function AdminSidebar() {
    const pathname = usePathname();

    async function signOut() {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
    }

    const linkCls = (href: string) =>
        `block rounded-md px-3 py-2 text-sm hover:bg-accent ${
            pathname === href ? "bg-accent" : ""
        }`;

    return (
        <aside className="w-64 shrink-0 border-r p-4">
            <div className="mb-4 text-lg font-semibold">Admin</div>
            <nav className="space-y-1">
                <Link href="/admin" className={linkCls("/admin")}>
                    Dashboard
                </Link>
                <Link href="/admin/posts" className={linkCls("/admin/posts")}>
                    Bài viết
                </Link>
                <Link
                    href="/admin/projects"
                    className={linkCls("/admin/projects")}
                >
                    Dự án
                </Link>
                <Link
                    href="/admin/messages"
                    className={linkCls("/admin/messages")}
                >
                    Liên hệ
                </Link>
                <button
                    onClick={signOut}
                    className="mt-2 w-full rounded-md border px-3 py-2 text-left text-sm hover:bg-accent"
                >
                    Đăng xuất
                </button>
            </nav>
        </aside>
    );
}
