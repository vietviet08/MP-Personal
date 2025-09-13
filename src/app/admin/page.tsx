"use client";

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Chào mừng bạn đến với Admin Panel
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        Online
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Tổng bài viết
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                24
                            </p>
                        </div>
                        <div
                            className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                        <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                        </svg>
                        +12% so với tháng trước
                    </div>
                </div>

                <div
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Dự án hoàn thành
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                18
                            </p>
                        </div>
                        <div
                            className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-green-600 dark:text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                        <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                        </svg>
                        +8% so với tháng trước
                    </div>
                </div>

                <div
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Tin nhắn mới
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                7
                            </p>
                        </div>
                        <div
                            className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-red-600 dark:text-red-400">
                        <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                            />
                        </svg>
                        -3% so với tháng trước
                    </div>
                </div>

                <div
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Lượt truy cập
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                2.4K
                            </p>
                        </div>
                        <div
                            className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-orange-600 dark:text-orange-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                        <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                        </svg>
                        +24% so với tháng trước
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Hoạt động gần đây
                    </h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {[
                            {
                                action: "Đã tạo bài viết mới",
                                time: "2 giờ trước",
                                type: "post",
                            },
                            {
                                action: "Cập nhật dự án Portfolio",
                                time: "4 giờ trước",
                                type: "project",
                            },
                            {
                                action: "Phản hồi tin nhắn từ khách hàng",
                                time: "6 giờ trước",
                                type: "message",
                            },
                            {
                                action: "Xuất bản bài viết về React",
                                time: "1 ngày trước",
                                type: "post",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        item.type === "post"
                                            ? "bg-blue-500"
                                            : item.type === "project"
                                                ? "bg-green-500"
                                                : "bg-purple-500"
                                    }`}
                                ></div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-900 dark:text-white">
                                        {item.action}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
