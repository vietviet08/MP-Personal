"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ModeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [isOn, setIsOn] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!theme || theme === "system") {
            setIsOn(resolvedTheme === "dark");
        } else {
            setIsOn(theme === "dark");
        }
    }, [theme, resolvedTheme]);

    const toggleSwitch = () => {
        const newTheme = isOn ? "light" : "dark";
        setTheme(newTheme);
        setIsOn(!isOn);
    };

    // Style with TailwindCSS custom properties
    const container = {
        width: 60,
        height: 30,
        backgroundColor: "var(--border)",
        borderRadius: 30,
        cursor: "pointer",
        display: "flex",
        padding: 5,
        position: "relative" as const,
        overflow: "hidden" as const,
    };

    const handle = {
        width: 20,
        height: 20,
        backgroundColor: "var(--primary)",
        borderRadius: "50%",
        zIndex: 2,
    };

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div style={{ width: container.width, height: container.height }}></div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {/* <Sun className="h-4 w-4 text-yellow-500" />
            <button
                className="toggle-container"
                style={{
                    ...container,
                    justifyContent: isOn ? "flex-end" : "flex-start",
                }}
                onClick={toggleSwitch}
                aria-label="Toggle theme"
            >
                <motion.div
                    className="toggle-handle"
                    style={handle}
                    layout
                    transition={{
                        type: "spring",
                        visualDuration: 0.2,
                        bounce: 0.2,
                    }}
                />
            </button>
            <Moon className="h-4 w-4 text-blue-300" /> */}
            {isOn ? (
               <Moon onClick={toggleSwitch} className="h-6 w-6 text-blue-300" />
            ) : (
               <Sun onClick={toggleSwitch} className="h-6 w-6 text-yellow-500" />
            )}
        </div>
    );
}
