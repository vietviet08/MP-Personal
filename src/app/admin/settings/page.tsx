"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { ToastContainer, useToast } from "@/components/ui/toast";
import {
    Settings,
    User,
    Globe,
    Shield,
    Database,
    Bell,
    Save,
    Eye,
    EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchWithAuth } from "@/lib/api-client";

type SettingsData = {
    profile: {
        name: string;
        email: string;
        avatar: string;
        bio: string;
        location: string;
        website: string;
    };
    site: {
        title: string;
        description: string;
        logo: string;
        favicon: string;
        theme: "light" | "dark" | "auto";
        language: string;
    };
    security: {
        twoFactorEnabled: boolean;
        loginNotifications: boolean;
        sessionTimeout: number;
    };
    notifications: {
        emailNotifications: boolean;
        newMessageAlerts: boolean;
        systemUpdates: boolean;
        weeklyReports: boolean;
    };
    integrations: {
        googleAnalytics: string;
        facebookPixel: string;
        mailchimpApiKey: string;
    };
};

export default function AdminSettings() {
    const { loading: authLoading } = useAuthGuard();
    const { toasts, showSuccess, showError, removeToast } = useToast();
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [showPasswords, setShowPasswords] = useState<{
        [key: string]: boolean;
    }>({});

    const fetchSettings = useCallback(async () => {
        if (authLoading) return;

        try {
            setIsLoading(true);
            const response = await fetchWithAuth("/api/admin/settings");
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            } else {
                const errorData = await response.json();
                console.error("Settings error:", errorData.error);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setTimeout(() => setIsLoading(false), 300);
        }
    }, [authLoading]);

    const saveSettings = async () => {
        if (!settings) return;

        try {
            setIsSaving(true);
            const response = await fetchWithAuth("/api/admin/settings", {
                method: "PUT",
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                showSuccess("Cài đặt đã được lưu thành công.");
            } else {
                showError("Không thể lưu cài đặt", "Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            showError(
                "Đã xảy ra lỗi",
                "Không thể lưu cài đặt. Vui lòng thử lại sau."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const updateSettings = (
        section: keyof SettingsData,
        field: string,
        value: string
    ) => {
        if (!settings) return;
        setSettings({
            ...settings,
            [section]: {
                ...settings[section],
                [field]: value,
            },
        });
    };

    const togglePasswordVisibility = (field: string) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    useEffect(() => {
        if (!authLoading) {
            fetchSettings();
        }
    }, [authLoading, fetchSettings]);

    const tabs = [
        { id: "profile", label: "Hồ sơ", icon: User },
        { id: "site", label: "Trang web", icon: Globe },
        { id: "security", label: "Bảo mật", icon: Shield },
        { id: "notifications", label: "Thông báo", icon: Bell },
        { id: "integrations", label: "Tích hợp", icon: Database },
    ];

    if (authLoading || isLoading) {
        return (
            <main>
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-semibold">Cài đặt hệ thống</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                            <div className="animate-pulse space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-10 bg-gray-200 dark:bg-gray-700 rounded"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                <div className="space-y-3">
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-semibold">Cài đặt hệ thống</h1>
                </div>
                <Button
                    onClick={saveSettings}
                    disabled={isSaving}
                    className="flex items-center space-x-2"
                >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <nav className="space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                                            activeTab === tab.id
                                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">
                                            {tab.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        {activeTab === "profile" && settings && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Thông tin cá nhân
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tên hiển thị
                                        </label>
                                        <Input
                                            value={settings.profile.name}
                                            onChange={(e) =>
                                                updateSettings(
                                                    "profile",
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Nhập tên hiển thị"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            value={settings.profile.email}
                                            onChange={(e) =>
                                                updateSettings(
                                                    "profile",
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Nhập email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Vị trí
                                        </label>
                                        <Input
                                            value={settings.profile.location}
                                            onChange={(e) =>
                                                updateSettings(
                                                    "profile",
                                                    "location",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Nhập vị trí"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Website
                                        </label>
                                        <Input
                                            value={settings.profile.website}
                                            onChange={(e) =>
                                                updateSettings(
                                                    "profile",
                                                    "website",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Giới thiệu bản thân
                                    </label>
                                    <textarea
                                        value={settings.profile.bio}
                                        onChange={(e) =>
                                            updateSettings(
                                                "profile",
                                                "bio",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Viết một vài dòng giới thiệu về bản thân..."
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "site" && settings && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Cài đặt trang web
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tiêu đề trang web
                                        </label>
                                        <Input
                                            value={settings.site.title}
                                            onChange={(e) =>
                                                updateSettings(
                                                    "site",
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Tên trang web"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Ngôn ngữ
                                        </label>
                                        <select
                                            value={settings.site.language}
                                            onChange={(e) =>
                                                updateSettings(
                                                    "site",
                                                    "language",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="vi">
                                                Tiếng Việt
                                            </option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Mô tả trang web
                                    </label>
                                    <textarea
                                        value={settings.site.description}
                                        onChange={(e) =>
                                            updateSettings(
                                                "site",
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Mô tả ngắn gọn về trang web của bạn..."
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Chủ đề
                                    </label>
                                    <select
                                        value={settings.site.theme}
                                        onChange={(e) =>
                                            updateSettings(
                                                "site",
                                                "theme",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="light">Sáng</option>
                                        <option value="dark">Tối</option>
                                        <option value="auto">Tự động</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && settings && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Bảo mật
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                Xác thực hai yếu tố
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Bảo vệ tài khoản bằng mã xác
                                                thực
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    settings.security
                                                        .twoFactorEnabled
                                                }
                                                onChange={(e) =>
                                                    updateSettings(
                                                        "security",
                                                        "twoFactorEnabled",
                                                        e.target.checked.toString()
                                                    )
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                Thông báo đăng nhập
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Nhận email khi có đăng nhập mới
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    settings.security
                                                        .loginNotifications
                                                }
                                                onChange={(e) =>
                                                    updateSettings(
                                                        "security",
                                                        "loginNotifications",
                                                        e.target.checked.toString()
                                                    )
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Thời gian hết hạn phiên (phút)
                                        </label>
                                        <Input
                                            type="number"
                                            value={
                                                settings.security.sessionTimeout
                                            }
                                            onChange={(e) =>
                                                updateSettings(
                                                    "security",
                                                    "sessionTimeout",
                                                    parseInt(
                                                        e.target.value
                                                    ).toString()
                                                )
                                            }
                                            placeholder="30"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && settings && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Thông báo
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                Thông báo email
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Nhận thông báo qua email
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    settings.notifications
                                                        .emailNotifications
                                                }
                                                onChange={(e) =>
                                                    updateSettings(
                                                        "notifications",
                                                        "emailNotifications",
                                                        e.target.checked.toString()
                                                    )
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                Cảnh báo tin nhắn mới
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Thông báo khi có tin nhắn liên
                                                hệ mới
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    settings.notifications
                                                        .newMessageAlerts
                                                }
                                                onChange={(e) =>
                                                    updateSettings(
                                                        "notifications",
                                                        "newMessageAlerts",
                                                        e.target.checked.toString()
                                                    )
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                Cập nhật hệ thống
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Thông báo về các cập nhật hệ
                                                thống
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    settings.notifications
                                                        .systemUpdates
                                                }
                                                onChange={(e) =>
                                                    updateSettings(
                                                        "notifications",
                                                        "systemUpdates",
                                                        e.target.checked.toString()
                                                    )
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                Báo cáo hàng tuần
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Nhận báo cáo thống kê hàng tuần
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    settings.notifications
                                                        .weeklyReports
                                                }
                                                onChange={(e) =>
                                                    updateSettings(
                                                        "notifications",
                                                        "weeklyReports",
                                                        e.target.checked.toString()
                                                    )
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "integrations" && settings && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Tích hợp bên thứ 3
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Google Analytics ID
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={
                                                    showPasswords.googleAnalytics
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    settings.integrations
                                                        .googleAnalytics
                                                }
                                                onChange={(e) =>
                                                    updateSettings(
                                                        "integrations",
                                                        "googleAnalytics",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="G-XXXXXXXXXX"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    togglePasswordVisibility(
                                                        "googleAnalytics"
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPasswords.googleAnalytics ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Facebook Pixel ID
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={
                                                    showPasswords.facebookPixel
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    settings.integrations
                                                        .facebookPixel
                                                }
                                                onChange={(e) =>
                                                    updateSettings(
                                                        "integrations",
                                                        "facebookPixel",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="123456789012345"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    togglePasswordVisibility(
                                                        "facebookPixel"
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPasswords.facebookPixel ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Mailchimp API Key
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={
                                                    showPasswords.mailchimpApiKey
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    settings.integrations
                                                        .mailchimpApiKey
                                                }
                                                onChange={(e) =>
                                                    updateSettings(
                                                        "integrations",
                                                        "mailchimpApiKey",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    togglePasswordVisibility(
                                                        "mailchimpApiKey"
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPasswords.mailchimpApiKey ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </main>
    );
}
