import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-gray-200/70 dark:bg-gray-700/50",
                className
            )}
            {...props}
        />
    );
}

export { Skeleton };
