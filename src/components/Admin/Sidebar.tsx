"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import {
    LayoutDashboard,
    FileText,
    FolderOpen,
    MessageSquare,
    LogOut,
    Settings,
    User,
    BarChart3,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import styles from "./Sidebar.module.css";
import { useSidebar } from "./AdminShell";

export default function AdminSidebar() {
    const pathname = usePathname();
    const { isCollapsed, setIsCollapsed } = useSidebar();

    async function signOut() {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
    }

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const menuItems = [
        {
            href: "/admin",
            label: "Dashboard",
            icon: LayoutDashboard,
            description: "Tổng quan hệ thống",
        },
        {
            href: "/admin/posts",
            label: "Bài viết",
            icon: FileText,
            description: "Quản lý bài viết",
        },
        {
            href: "/admin/projects",
            label: "Dự án",
            icon: FolderOpen,
            description: "Quản lý dự án",
        },
        {
            href: "/admin/messages",
            label: "Liên hệ",
            icon: MessageSquare,
            description: "Tin nhắn liên hệ",
        },
        {
            href: "/admin/analytics",
            label: "Thống kê",
            icon: BarChart3,
            description: "Báo cáo và phân tích",
        },
        {
            href: "/admin/settings",
            label: "Cài đặt",
            icon: Settings,
            description: "Cấu hình hệ thống",
        },
    ];

    return (
        <aside
            className={`${styles.sidebar} fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-xl z-40 transition-all duration-300 ease-in-out ${
                isCollapsed ? "w-16" : "w-72"
            }`}
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 relative">
                <div
                    className={`flex items-center space-x-3 ${isCollapsed ? "justify-center" : ""}`}
                >
                    <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
                            isCollapsed
                                ? "bg-slate-200 dark:bg-slate-700"
                                : "bg-gradient-to-br from-blue-500 to-purple-600"
                        }`}
                    >
                        <User
                            className={`w-5 h-5 transition-all duration-300 ${
                                isCollapsed
                                    ? "text-slate-600 dark:text-slate-400"
                                    : "text-white"
                            }`}
                        />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                Admin Panel
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Quản trị hệ thống
                            </p>
                        </div>
                    )}
                </div>

                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className={`absolute -right-3 top-24 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 ${
                        isCollapsed ? "right-2" : "-right-3"
                    }`}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2 overflow-y-auto flex-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                ${styles.menuItem} group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out
                                ${
                                    isActive
                                        ? `bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 ${styles.activeMenuItem}`
                                        : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:scale-[1.02]"
                                }
                                ${isCollapsed ? "justify-center px-2" : ""}
                            `}
                            title={isCollapsed ? item.label : undefined}
                        >
                            {/* Active indicator */}
                            {isActive && !isCollapsed && (
                                <div
                                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full ${styles.activeIndicator}`}
                                />
                            )}

                            <div
                                className={`
                                ${styles.iconContainer} p-2 rounded-lg transition-all duration-300
                                ${
                                    isActive
                                        ? "bg-white/20"
                                        : "bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
                                }
                            `}
                            >
                                <Icon
                                    className={`w-5 h-5 transition-all duration-300 ${
                                        isActive
                                            ? "text-white"
                                            : "text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                    }`}
                                />
                            </div>

                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <div
                                        className={`font-medium transition-all duration-300 ${
                                            isActive
                                                ? "text-white"
                                                : "text-slate-900 dark:text-white"
                                        }`}
                                    >
                                        {item.label}
                                    </div>
                                    <div
                                        className={`text-xs transition-all duration-300 ${
                                            isActive
                                                ? "text-blue-100"
                                                : "text-slate-500 dark:text-slate-400"
                                        }`}
                                    >
                                        {item.description}
                                    </div>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <button
                    onClick={signOut}
                    className={`w-full flex items-center justify-center rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                        isCollapsed
                            ? "p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 focus:ring-blue-500"
                            : "px-4 py-3 space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 hover:shadow-lg hover:shadow-red-500/25 focus:ring-red-500"
                    }`}
                    title={isCollapsed ? "Đăng xuất" : undefined}
                >
                    <LogOut
                        className={`transition-all duration-300 ${
                            isCollapsed
                                ? "w-5 h-5 text-white"
                                : "w-4 h-4 text-white"
                        }`}
                    />
                    {!isCollapsed && <span>Đăng xuất</span>}
                </button>
            </div>
        </aside>
    );
}
