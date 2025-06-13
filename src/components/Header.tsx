"use client";

import React, { useEffect, useState } from "react";
import { ModeToggle } from "./theme-toggle/theme-toggle";
import { GithubIcon, LinkedinIcon } from "lucide-react";

export const Header = () => {
    const menuItems = [
        { name: "Home", href: "#" },
        { name: "About", href: "#" },
        { name: "Projects", href: "#" },
        { name: "Contact", href: "#" },
    ];

    const [isScroll, setIsScroll] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScroll(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav
            className={
                "fixed top-0 left-0 w-full z-50 transition duration-300 px-[7vw] md:px-[7vw] lg:px-[20vw]" +
                (isScroll
                    ? " bg-[#050414] bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-md"
                    : "bg-transparent")
            }
        >
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <div className="text-lg font-semibold cursor-pointer">
                        <span className="text-blue-700">&lt;</span>
                        <span className="">Viet</span>
                        <span className="text-blue-700">/</span>
                        <span className="">Quoc</span>
                        <span className="text-blue-700">&gt;</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex items-center gap-6">
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            >
                                {item.name}
                            </a>
                        ))}
                    </nav>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <a
                        href="https://github.com/vietviet08"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                        aria-label="GitHub"
                    >
                        <GithubIcon className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
                    </a>
                    <a
                        href="https://linkedin.com/i/viequoc08"
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
                {/* Mobile Menu Items */}
                {isOpen && (
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4/5 bg-white/40 dark:bg-black/40 bg-opacity-50 backdrop-filter backdrop-blur-lg z-50 rounded-lg shadow-lg md:hidden">
                        <ul className="flex flex-col items-center space-y-4 py-4 text-gray-700 dark:text-gray-300">
                            {menuItems.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="text-lg hover:text-blue-500 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </a>
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
        </nav>
    );
};
