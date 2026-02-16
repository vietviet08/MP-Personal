"use client";

import { Header } from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { usePathname } from "next/navigation";

export default function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <div className="relative flex min-h-screen flex-col">
            {/* Aurora background blobs */}
            <div className="aurora-bg" />
            {/* Noise texture overlay */}
            <div className="noise-overlay" />
            {/* Grid pattern */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

            <Header />
            <div className="flex-1 flex flex-col pt-14">{children}</div>
            <Footer />
        </div>
    );
}
