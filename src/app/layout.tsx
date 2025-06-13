import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { HeroSection } from "@/components/Home/HeroSection";
import { Skills } from "@/components/Skills/Skills";
import { About } from "@/components/About/About";
import { Projects } from "@/components/Projects/Projects";
import { Contact } from "@/components/Contact/Contact";

const geistSans = Geist({
    variable: "--font-poppins",
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal"],
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Nguyen Quoc Viet - Portfolio",
    description:
        "Portfolio of Nguyen Quoc Viet, a software engineer specializing in web development.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10">
                    </div>
                    <div className="relative flex min-h-screen flex-col">
                        <Header />
                        
                        <div className="flex-1 flex flex-col pt-16">
                            <HeroSection />
                            <About/>
                            <Skills/>
                            <Projects/>
                            <Contact/>
                            <main className="flex-1">
                                {children}
                            </main>
                        </div>
                        
                        <Footer/>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
