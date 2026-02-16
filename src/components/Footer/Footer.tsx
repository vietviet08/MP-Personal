"use client";

import { Mail, Heart } from "lucide-react";
import { Icon } from "@iconify/react";
import React from "react";
import { ContactInfo } from "@/constants/constant";
import { motion } from "framer-motion";

export default function Footer() {
    const socialLinks = [
        {
            icon: <Icon icon="mdi:github" className="h-4 w-4" />,
            href: ContactInfo.socialLinks.github,
            label: "GitHub",
        },
        {
            icon: <Icon icon="mdi:linkedin" className="h-4 w-4" />,
            href: ContactInfo.socialLinks.linkedin,
            label: "LinkedIn",
        },
        {
            icon: <Icon icon="mdi:facebook" className="h-4 w-4" />,
            href: ContactInfo.socialLinks.facebook,
            label: "Facebook",
        },
        {
            icon: <Mail className="h-4 w-4" />,
            href: `mailto:${ContactInfo.email}`,
            label: "Email",
        },
    ];

    return (
        <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
            <div className="px-[5vw] md:px-[7vw] lg:px-[20vw] py-8">
                <div className="flex flex-col items-center gap-4">
                    {/* Social links */}
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {socialLinks
                            .filter((s) => s.href)
                            .map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-lg glass-card hover:scale-110 transition-all"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                    </motion.div>

                    {/* Divider */}
                    <div className="section-glow-line w-32" />

                    {/* Copyright */}
                    <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                        <p>
                            &copy; {new Date().getFullYear()} Nguyen Quoc Viet. All rights reserved.
                        </p>
                        <p className="flex items-center gap-1">
                            Built with <Heart className="h-3 w-3 text-red-400" /> using{" "}
                            <a
                                href="https://nextjs.org"
                                className="text-primary hover:underline"
                            >
                                Next.js
                            </a>{" "}
                            &{" "}
                            <a
                                href="https://tailwindcss.com"
                                className="text-primary hover:underline"
                            >
                                Tailwind CSS
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
