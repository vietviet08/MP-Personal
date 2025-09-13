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
    Database,
    Award,
    GraduationCap,
    Briefcase,
    Code,
    Tag,
    Quote,
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
            href: "/admin/certificates",
            label: "Chứng chỉ",
            icon: Award,
            description: "Quản lý chứng chỉ",
        },
        {
            href: "/admin/educations",
            label: "Học vấn",
            icon: GraduationCap,
            description: "Quản lý học vấn",
        },
        {
            href: "/admin/experiences",
            label: "Kinh nghiệm",
            icon: Briefcase,
            description: "Quản lý kinh nghiệm",
        },
        {
            href: "/admin/skills",
            label: "Kỹ năng",
            icon: Code,
            description: "Quản lý kỹ năng",
        },
        {
            href: "/admin/tags",
            label: "Thẻ",
            icon: Tag,
            description: "Quản lý thẻ",
        },
        {
            href: "/admin/testimonials",
            label: "Đánh giá",
            icon: Quote,
            description: "Quản lý đánh giá",
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
        {
            href: "/admin/setup",
            label: "Setup DB",
            icon: Database,
            description: "Thiết lập database",
        },
    ];

    return (
        <>
            <aside
                className={`${styles.sidebar} fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-xl z-40 transition-all duration-300 ease-in-out ${
                    isCollapsed ? "w-16" : "w-72"
                } ${isCollapsed ? styles.collapsed : styles.expanded}`}
            >
                {/* Header */}
                <div
                    className={`border-b border-slate-200 dark:border-slate-700 relative ${isCollapsed ? "p-4" : "p-6"}`}
                >
                    <div
                        className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}
                    >
                        <div
                            className={`rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
                                isCollapsed
                                    ? "w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600"
                                    : "w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600"
                            }`}
                        >
                            <User
                                className={`transition-all duration-300 text-white ${
                                    isCollapsed ? "w-6 h-6" : "w-5 h-5"
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
                </div>

                {/* Navigation */}
                <nav
                    className={`overflow-y-auto flex-1 ${isCollapsed ? "p-2 space-y-1" : "p-4 space-y-2"}`}
                >
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                ${styles.menuItem} group relative flex items-center rounded-xl transition-all duration-300 ease-in-out
                                ${
                                    isActive
                                        ? `bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 ${styles.activeMenuItem}`
                                        : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:scale-[1.02]"
                                }
                                ${isCollapsed ? "justify-center p-3" : "space-x-3 px-4 py-3"}
                            `}
                                title={
                                    isCollapsed
                                        ? `${item.label} - ${item.description}`
                                        : undefined
                                }
                            >
                                {/* Active indicator */}
                                {isActive && !isCollapsed && (
                                    <div
                                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full ${styles.activeIndicator}`}
                                    />
                                )}

                                <div
                                    className={`
                                ${styles.iconContainer} transition-all duration-300
                                ${
                                    isActive
                                        ? "bg-white/20"
                                        : "bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
                                }
                                    ${isCollapsed ? "p-0" : "p-2 rounded-lg"}
                            `}
                                >
                                    <Icon
                                        className={`transition-all duration-300 ${
                                            isActive
                                                ? "text-white"
                                                : "text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                        } ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`}
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
                <div
                    className={`border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm ${isCollapsed ? "p-2" : "p-4"}`}
                >
                    <button
                        onClick={signOut}
                        className={`w-full flex items-center justify-center rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                            isCollapsed
                                ? "p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 hover:shadow-lg hover:shadow-red-500/25 focus:ring-red-500"
                                : "px-4 py-3 space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 hover:shadow-lg hover:shadow-red-500/25 focus:ring-red-500"
                        }`}
                        title={isCollapsed ? "Đăng xuất" : undefined}
                    >
                        <LogOut
                            className={`transition-all duration-300 text-white ${
                                isCollapsed ? "w-6 h-6" : "w-4 h-4"
                            }`}
                        />
                        {!isCollapsed && <span>Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* Enhanced Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer z-50 backdrop-blur-sm ${
                    isCollapsed ? "left-[3.5rem]" : "left-[17.5rem]"
                }`}
                title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
                <div className="relative">
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform duration-300" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform duration-300" />
                    )}
                </div>
            </button>
        </>
    );
}
