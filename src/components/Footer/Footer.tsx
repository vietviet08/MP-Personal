import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import React from "react";
import { ContactInfo } from "@/app/constants/constant";

export default function Footer() {
    return (
        <footer className="py-8 border-t transition duration-300 px-[7vw] md:px-[7vw] lg:px-[20vw]">
            <div className="container">
                <div className="flex flex-col items-center justify-between gap-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Nguyen Quoc Viet. All
                        rights reserved.
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href={ContactInfo.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                            <Facebook/>
                        </a>
                        <a
                            href={ContactInfo.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                            <Instagram/>
                        </a>
                        <a
                            href={ContactInfo.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                            <Linkedin/>
                        </a>
                         <a
                            href={ContactInfo.socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                            <Youtube/>
                        </a>
                         <a
                            href={ContactInfo.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                            <Twitter/>
                        </a>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Built with{" "}
                        <a
                            href="https://nextjs.org"
                            className="text-blue-500 dark:text-blue-400 hover:underline"
                        >
                            Next.js
                        </a>{" "}
                        and{" "}
                        <a
                            href="https://tailwindcss.com"
                            className="text-blue-500 dark:text-blue-400 hover:underline"
                        >
                            Tailwind CSS
                        </a>
                        .
                    </div>
                </div>
            </div>
        </footer>
    );
}
