"use client";

import { ArrowDown, FileDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { PersonalInfo} from "@/constants/constant";

export const HeroSection = () => {
    const [showScrollIcon, setShowScrollIcon] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!isScrolling) {
                setIsScrolling(true);
                setShowScrollIcon(false);
                setTimeout(() => {
                    setIsScrolling(false);
                    setShowScrollIcon(true);
                }, 2000);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isScrolling]);

    return (
        <section
            id="home"
            className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 w-full overflow-hidden"
        >
            {/* Floating orbs background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                    className="absolute w-72 h-72 rounded-full bg-primary/5 blur-3xl"
                    animate={{
                        x: [0, 50, -30, 0],
                        y: [0, -40, 30, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ top: "10%", right: "15%" }}
                />
                <motion.div
                    className="absolute w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"
                    animate={{
                        x: [0, -60, 40, 0],
                        y: [0, 50, -20, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    style={{ bottom: "10%", left: "10%" }}
                />
            </div>

            <div className="container max-w-4xl mx-auto text-center z-10">
                <div className="space-y-6">
                    {/* Status badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                            </span>
                            Available for opportunities
                        </div>
                    </motion.div>

                    {/* Name */}
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                    >
                        <span>👋Hi, I&apos;m </span>
                        <span className="text-gradient">{PersonalInfo.shortName}</span>
                        <span className="text-gradient"> {PersonalInfo.lastName}</span>
                    </motion.h1>

                    {/* Type animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <TypeAnimation
                            sequence={[
                                "Backend Developer",
                                2500,
                                "DevSecOps Enthusiast",
                                2500,
                                "Cloud Infrastructure",
                                2500,
                                "Full Stack Engineer",
                                2500,
                            ]}
                            speed={{ type: "keyStrokeDelayInMs", value: 80 }}
                            deletionSpeed={{ type: "keyStrokeDelayInMs", value: 40 }}
                            cursor={true}
                            wrapper="span"
                            className="text-primary text-xl sm:text-2xl md:text-3xl font-semibold"
                            style={{ whiteSpace: "pre" }}
                            repeat={Infinity}
                        />
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        {PersonalInfo.description}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-wrap justify-center items-center gap-4 pt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                    >
                        <a href="#projects" className="cosmic-button flex items-center gap-2">
                            View My Work
                        </a>
                        <a
                            href={PersonalInfo.resumeUrl}
                            download
                            className="cosmic-border"
                        ><div className="flex items-center gap-2">
                            <FileDown className="h-4 w-4" />
                            <div>Download CV</div>
                        </div>
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${
                    showScrollIcon ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500`}
                initial={{ opacity: 0 }}
                animate={{ opacity: showScrollIcon ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
            >
                <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-2 tracking-widest uppercase">
                        Scroll
                    </span>
                    <ArrowDown className="h-4 w-4 text-primary animate-bounce" />
                </div>
            </motion.div>
        </section>
    );
};
