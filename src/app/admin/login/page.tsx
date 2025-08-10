"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Shield, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = getSupabaseBrowserClient();
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                router.replace("/admin");
            }
        };
        checkAuth();
    }, [router]);

    async function onLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setLoading(false);
            setError(error.message);
            return;
        }

        setTimeout(() => {
            router.replace("/admin");
        }, 100);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl admin-float"></div>
                <div
                    className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl admin-float"
                    style={{ animationDelay: "3s" }}
                ></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8 animate-in fade-in-0 duration-500">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 admin-glow admin-shimmer">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Đăng nhập để truy cập bảng điều khiển
                    </p>
                </div>

                {/* Form card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl login-card-shadow border border-gray-200/50 dark:border-gray-700/50 p-8 animate-in slide-in-from-bottom-4 duration-500 delay-100 admin-shimmer">
                    <form onSubmit={onLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                </div>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mật khẩu
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                </div>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="pl-10 pr-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-top-2 duration-300">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl admin-shimmer"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Đang đăng nhập...
                                </div>
                            ) : (
                                "Đăng nhập"
                            )}
                        </Button>
                    </form>
                </div>

                <div className="text-center mt-6 animate-in fade-in-0 duration-500 delay-300">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        🔒 Được bảo vệ bởi xác thực an toàn
                    </p>
                </div>
            </div>
        </div>
    );
}
