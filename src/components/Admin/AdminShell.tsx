"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import AdminSidebar from "@/components/Admin/Sidebar";

// Context for sidebar state
interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within SidebarProvider");
    }
    return context;
};

export default function AdminShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLogin = pathname.startsWith("/admin/login");
    const { loading, isAuthenticated, isReady } = useAuthGuard();
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (isLogin) {
        return children;
    }

    if (loading || !isReady) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Đang tải...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-foreground flex items-center justify-center">
                <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Vui lòng đăng nhập để tiếp tục
                    </p>
                </div>
            </div>
        );
    }

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-foreground">
                <AdminSidebar />
                <main
                    className={`p-8 overflow-auto transition-all duration-300 ease-in-out ${
                        isCollapsed ? "ml-16" : "ml-72"
                    }`}
                >
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </SidebarContext.Provider>
    );
}
