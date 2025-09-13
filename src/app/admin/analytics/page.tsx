"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import {
    BarChart3,
    Users,
    Eye,
    MessageSquare,
    TrendingUp,
    Globe,
    Clock,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

type AnalyticsData = {
    overview: {
        totalVisitors: number;
        totalPageViews: number;
        totalMessages: number;
        totalProjects: number;
        totalPosts: number;
        bounceRate: number;
        avgSessionDuration: string;
    };
    recentActivity: Array<{
        id: number;
        type: "visit" | "message" | "project_view" | "post_view";
        description: string;
        timestamp: string;
        metadata?: unknown;
    }>;
    topPages: Array<{
        page: string;
        views: number;
        uniqueVisitors: number;
    }>;
    monthlyStats: Array<{
        month: string;
        visitors: number;
        pageViews: number;
        messages: number;
    }>;
};

export default function AdminAnalytics() {
    const { loading: authLoading } = useAuthGuard();
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("30d");

    const fetchAnalytics = useCallback(async () => {
        if (authLoading) return;

        try {
            setIsLoading(true);
            const data = await apiClient.get(
                `/api/admin/analytics?range=${timeRange}`
            );
            setAnalytics(data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setTimeout(() => setIsLoading(false), 300);
        }
    }, [authLoading, timeRange]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "visit":
                return <Globe className="w-4 h-4 text-blue-500" />;
            case "message":
                return <MessageSquare className="w-4 h-4 text-green-500" />;
            case "project_view":
                return <Eye className="w-4 h-4 text-purple-500" />;
            case "post_view":
                return <BarChart3 className="w-4 h-4 text-orange-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case "visit":
                return "bg-blue-100 dark:bg-blue-900/30";
            case "message":
                return "bg-green-100 dark:bg-green-900/30";
            case "project_view":
                return "bg-purple-100 dark:bg-purple-900/30";
            case "post_view":
                return "bg-orange-100 dark:bg-orange-900/30";
            default:
                return "bg-gray-100 dark:bg-gray-900/30";
        }
    };

    if (authLoading || isLoading) {
        return (
            <main>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-semibold">
                            Thống kê & Phân tích
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                        >
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center space-x-3"
                                    >
                                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                    </div>
                                ))}
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
                        <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-semibold">
                        Thống kê & Phân tích
                    </h1>
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="7d">7 ngày qua</option>
                        <option value="30d">30 ngày qua</option>
                        <option value="90d">90 ngày qua</option>
                        <option value="1y">1 năm qua</option>
                    </select>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Tổng lượt truy cập
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {analytics?.overview.totalVisitors.toLocaleString() ||
                                    0}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>+12.5% so với tháng trước</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Lượt xem trang
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {analytics?.overview.totalPageViews.toLocaleString() ||
                                    0}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>+8.2% so với tháng trước</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Tin nhắn liên hệ
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {analytics?.overview.totalMessages || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>+15.3% so với tháng trước</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Tỷ lệ thoát
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {analytics?.overview.bounceRate || 0}%
                            </p>
                        </div>
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-red-600 dark:text-red-400">
                        <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                        <span>-2.1% so với tháng trước</span>
                    </div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Thời gian trung bình
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {analytics?.overview.avgSessionDuration ||
                                    "0:00"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Tổng dự án
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {analytics?.overview.totalProjects || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Tổng bài viết
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {analytics?.overview.totalPosts || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Hoạt động gần đây
                    </h3>
                    <div className="space-y-4">
                        {analytics?.recentActivity.length ? (
                            analytics.recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start space-x-3"
                                >
                                    <div
                                        className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}
                                    >
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(
                                                activity.timestamp
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Chưa có hoạt động nào
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Pages */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Trang được xem nhiều nhất
                    </h3>
                    <div className="space-y-4">
                        {analytics?.topPages.length ? (
                            analytics.topPages.map((page, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {page.page}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {page.uniqueVisitors} lượt truy
                                                cập duy nhất
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {page.views.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            lượt xem
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Globe className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Chưa có dữ liệu
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
