import { Skeleton } from "@/components/ui/skeleton";

export function MessageSkeleton() {
    return (
        <div className="p-6">
            <div className="flex items-start space-x-4">
                {/* Avatar skeleton */}
                <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />

                {/* Content skeleton */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Header skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                    </div>

                    {/* Subject skeleton */}
                    <Skeleton className="h-6 w-40 rounded-md" />

                    {/* Message content skeleton */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function MessagesSkeleton() {
    return (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Multiple message skeletons with staggered animations */}
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="relative animate-in fade-in-0 duration-500"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        <MessageSkeleton />

                        {/* Enhanced shimmer overlay effect */}
                        <div
                            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent animate-[shimmer_2s_infinite] pointer-events-none"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function EmptyMessagesSkeleton() {
    return (
        <div className="mt-6 p-12 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col items-center space-y-4 animate-in fade-in-0 duration-500">
                {/* Icon skeleton */}
                <Skeleton className="h-16 w-16 rounded-full" />

                {/* Text skeletons */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
        </div>
    );
}
