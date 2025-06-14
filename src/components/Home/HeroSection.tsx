"use client";

import { ArrowDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

export const HeroSection = () => {
    const [isScrolling, setIsScrolling] = useState(false);
    const [showScrollIcon, setShowScrollIcon] = useState(true);

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
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isScrolling]);

    return (
        <section
            id="home"
            className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 w-full"
        >
            <div className="container max-w-4xl mx-auto text-center z-10">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        <span className="opacity-0 animate-fade-in">
                            {" "}
                            Hi, I&apos;m
                        </span>
                        <span className="text-primary opacity-0 animate-fade-in-delay-1">
                            {" "}
                            Viet
                        </span>
                        <span className="text-gradient ml-2 opacity-0 animate-fade-in-delay-2">
                            {" "}
                            Quoc
                        </span>
                    </h1>

                    <TypeAnimation
                        sequence={[
                            "Fullstack Developer",
                            2000,
                            "App Developer",
                            2000,
                            "DevOps Engineer",
                            2000,
                            "AI Enthusiast",
                            2000,
                        ]}
                        speed={{ type: "keyStrokeDelayInMs", value: 100 }}
                        deletionSpeed={{
                            type: "keyStrokeDelayInMs",
                            value: 50,
                        }}
                        cursor={true}
                        wrapper="span"
                        className="text-blue-500 text-2xl md:text-3xl font-semibold opacity-0 animate-fade-in-delay-2"
                        style={{ whiteSpace: "pre" }}
                        repeat={Infinity}
                    />

                    <p className="text-lg mt-4 md:text-xl text-muted-foreground max-2-2xl mx-auto opacity-0 animate-fade-in-delay-3">
                        I create stellar web experiences as a full stack
                        developer. From intuitive front-end interfaces to robust
                        back-end solutions, with expertise in DevOps practices
                        and a passion for AI research.
                    </p>

                    <div className="flex justify-center items-center gap-4">
                        <div className="pt-4 opacity-0 animate-fade-in-delay-4">
                            <a href="#projects" className="cosmic-button">
                                View My Work
                            </a>
                        </div>
                        <div className="pt-4 opacity-0 animate-fade-in-delay-4">
                            <a href="#contact" className="cosmic-border">
                                Download CV
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${
                    showScrollIcon
                        ? "animate-fade-in-delay-5"
                        : "animate-fade-out"
                }`}
            >
                <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground mb-2">
                        Scroll
                    </span>
                    <ArrowDown className="h-5 w-5 text-primary animate-bounce" />
                </div>
            </div>
        </section>
    );
};
