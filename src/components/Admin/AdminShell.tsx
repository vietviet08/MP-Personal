"use client";

import { usePathname } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import AdminSidebar from "@/components/Admin/Sidebar";

export default function AdminShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLogin = pathname.startsWith("/admin/login");
    const { loading, isAuthenticated, isReady } = useAuthGuard();

    if (isLogin) {
        return children;
    }

    if (loading || !isReady) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="mt-2 text-sm text-muted-foreground"></p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground"></p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex min-h-screen">
                <AdminSidebar />
                <div className="flex-1 p-6">{children}</div>
            </div>
        </div>
    );
}
