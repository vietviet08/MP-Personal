"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ModeToggle } from "../theme-toggle/theme-toggle";
import { GithubIcon, LinkedinIcon } from "lucide-react";
import { ContactInfo } from "@/constants/constant";

export const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const menuItems = [
        { name: "Home", href: "#home", type: "scroll" },
        { name: "About", href: "#about", type: "scroll" },
        { name: "Skills", href: "#skills", type: "scroll" },
        { name: "Projects", href: "#projects", type: "scroll" },
        { name: "Blogs", href: "/blogs", type: "link" },
        { name: "Contact", href: "#contact", type: "scroll" },
    ];

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
            // If we're not on home page, go to home first
            if (window.location.pathname !== "/") {
                router.push("/" + item.href);
                return;
            }

            // Scroll to section on current page
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
        const handleScroll = () => {
            setIsScroll(window.scrollY > 50);
        };

        setIsOpen(false);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Listen for route changes
    useEffect(() => {
        setIsBlogsPage(pathname.startsWith("/blogs"));
    }, [pathname]);

    return (
        <header
            className={
                "fixed top-0 left-0 w-full z-50 transition duration-300 px-[2vw] md:px-[5vw] lg:px-[19vw] " +
                (isBlogsPage
                    ? isScroll
                        ? " bg-white/90 dark:bg-gray-800/90 backdrop-filter backdrop-blur-md shadow-md "
                        : " bg-gradient-to-br bg-white/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-filter backdrop-blur-md "
                    : isScroll
                      ? " bg-white/50 dark:bg-[#020618]/50 backdrop-filter backdrop-blur-md shadow-md "
                      : "bg-transparent")
            }
        >
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <Link
                        href="/"
                        className="text-xl font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <span className="text-blue-500">&lt;</span>
                        <span className="">Viet</span>
                        <span className="text-blue-500">/</span>
                        <span className="">Quoc</span>
                        <span className="text-blue-500">&gt;</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex items-center gap-6">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleMenuItemClick(item)}
                                className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <a
                        href={ContactInfo.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                        aria-label="GitHub"
                    >
                        <GithubIcon className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
                    </a>
                    <a
                        href={ContactInfo.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                        aria-label="LinkedIn"
                    >
                        <LinkedinIcon className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
                    </a>
                    <ModeToggle />
                </div>

                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                    isOpen
                                        ? "M6 18L18 6M6 6l12 12"
                                        : "M4 6h16M4 12h16M4 18h16"
                                }
                            />
                        </svg>
                    </button>
                </div>

                {isOpen && (
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-11/12 bg-white/50 dark:bg-[#020618]/50 backdrop-filter backdrop-blur-md z-50 rounded-lg shadow-lg md:hidden">
                        <ul className="flex flex-col items-center space-y-4 py-4 text-gray-700 dark:text-gray-300">
                            {menuItems.map((item) => (
                                <li key={item.name}>
                                    <button
                                        className="text-lg hover:text-blue-500 transition-colors cursor-pointer"
                                        onClick={() =>
                                            handleMenuItemClick(item)
                                        }
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center justify-center gap-4 py-4">
                            <a
                                href="https://github.com/vietviet08"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center"
                                aria-label="GitHub"
                            >
                                <GithubIcon className="h-6 w-6 text-gray-300 hover:text-blue-500 transition-colors" />
                            </a>
                            <a
                                href="https://linkedin.com/i/viequoc08"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center"
                                aria-label="LinkedIn"
                            >
                                <LinkedinIcon className="h-6 w-6 text-gray-300 hover:text-blue-500 transition-colors" />
                            </a>
                            <ModeToggle />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
