import AdminShell from "@/components/Admin/AdminShell";
import React from "react";

export const metadata = {
    title: "Admin | Portfolio",
};

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return <AdminShell>{children}</AdminShell>;
}
