import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SiteShell from "@/components/SiteShell";

const inter = Inter({
    variable: "--font-sans",
    display: "swap",
    subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Nguyen Quoc Viet | Software Engineer",
    description:
        "Software Engineer specializing in backend development, DevSecOps, CI/CD pipelines, and cloud infrastructure. Building scalable, production-ready systems.",
    keywords: [
        "Nguyen Quoc Viet",
        "Software Engineer",
        "Backend Developer",
        "DevSecOps",
        "Full Stack",
        "Portfolio",
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SiteShell>{children}</SiteShell>
                </ThemeProvider>
            </body>
        </html>
    );
}
