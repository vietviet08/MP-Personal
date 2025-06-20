"use client";

import React, { useEffect, useState } from "react";
import { ModeToggle } from "../theme-toggle/theme-toggle";
import { GithubIcon, LinkedinIcon } from "lucide-react";
import { ContactInfo } from "@/app/constants/constant";

export const Header = () => {
    const menuItems = [
        { name: "Home", href: "#home" },
        { name: "About", href: "#about" },
        { name: "Skills", href: "#skills" },
        { name: "Projects", href: "#projects" },
        { name: "Contact", href: "#contact" },
    ];

    const [isScroll, setIsScroll] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleMenuItemClick = (sectionId: string) => {
        setIsOpen(false);

        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
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

    return (
        <header
            className={
                "fixed top-0 left-0 w-full z-50 transition duration-300 px-[2vw] md:px-[5vw] lg:px-[19vw] " +
                (isScroll
                    ? " bg-white/50 dark:bg-[#020618]/50 backdrop-filter backdrop-blur-md shadow-md "
                    : "bg-transparent")
            }
        >
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <div className="text-xl font-semibold cursor-pointer">
                        <span className="text-blue-500">&lt;</span>
                        <span className="">Viet</span>
                        <span className="text-blue-500">/</span>
                        <span className="">Quoc</span>
                        <span className="text-blue-500">&gt;</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex items-center gap-6">
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                
                                onClick={() => handleMenuItemClick(item.href.slice(1))}
                                className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            >
                                {item.name}
                            </a>
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
                                    <a
                                        className="text-lg hover:text-blue-500 transition-colors"
                                        onClick={() => {
                                            handleMenuItemClick(item.href.slice(1));
                                            setIsOpen(false);
                                        }}
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
        </header>
    );
};
