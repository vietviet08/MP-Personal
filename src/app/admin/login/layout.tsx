import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Login | Portfolio",
    description: "Đăng nhập vào bảng điều khiển admin",
};

export default function AdminAuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
