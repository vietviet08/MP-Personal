"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ModeToggle } from "../theme-toggle/theme-toggle";
import { Menu, X } from "lucide-react";
import { Icon } from "@iconify/react";
import { ContactInfo, NavItems } from "@/constants/constant";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [isScroll, setIsScroll] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isBlogsPage, setIsBlogsPage] = useState(false);

    const handleMenuItemClick = (item: {
        name: string;
        href: string;
        type: string;
    }) => {
        setIsOpen(false);

        if (item.type === "scroll") {
            if (globalThis.location.pathname !== "/") {
                router.push("/" + item.href);
                return;
            }
            const sectionId = item.href.slice(1);
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        } else if (item.type === "link") {
            router.push(item.href);
        }
    };

    useEffect(() => {
        const handleScroll = () => setIsScroll(window.scrollY > 50);
        setIsOpen(false);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsBlogsPage(pathname.startsWith("/blogs"));
    }, [pathname]);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-[2vw] md:px-[5vw] lg:px-[19vw] ${
                isScroll || isBlogsPage
                    ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
                    : "bg-transparent"
            }`}
        >
            <div className="flex items-center justify-between py-3 px-2">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <span className="text-primary">&lt;</span>
                    <span>Viet</span>
                    <span className="text-primary">/</span>
                    <span>Quoc</span>
                    <span className="text-primary">&gt;</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {NavItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleMenuItemClick(item)}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer"
                        >
                            {item.name}
                        </button>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center gap-3">
                    <a
                        href={ContactInfo.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                        aria-label="GitHub"
                    >
                        <Icon icon="mdi:github" className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </a>
                    <a
                        href={ContactInfo.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                        aria-label="LinkedIn"
                    >
                        <Icon icon="mdi:linkedin" className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </a>
                    <div className="w-px h-5 bg-border" />
                    <ModeToggle />
                </div>

                {/* Mobile hamburger */}
                <div className="md:hidden flex items-center gap-2">
                    <ModeToggle />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                    >
                        {isOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border/50 rounded-b-xl"
                    >
                        <div className="flex flex-col py-3 px-4">
                            {NavItems.map((item) => (
                                <button
                                    key={item.name}
                                    className="py-2.5 text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    onClick={() => handleMenuItemClick(item)}
                                >
                                    {item.name}
                                </button>
                            ))}
                            <div className="flex items-center gap-3 pt-3 mt-2 border-t border-border/50">
                                <a
                                    href={ContactInfo.socialLinks.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                >
                                    <Icon icon="mdi:github" className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </a>
                                <a
                                    href={ContactInfo.socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                >
                                    <Icon icon="mdi:linkedin" className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};
