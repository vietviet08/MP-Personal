"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import * as motion from "motion/react-client";
import { useEffect, useState } from "react";

export function ModeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [isOn, setIsOn] = useState(false);
    
    // Set initial state based on theme
    useEffect(() => {
        // Default theme is system
        if (!theme || theme === "system") {
            // Check the resolved theme (what system actually sets)
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

    // Style definitions
    const container = {
        width: 60,
        height: 30,
        backgroundColor: "var(--border)",
        borderRadius: 30,
        cursor: "pointer",
        display: "flex",
        padding: 5,
    };

    const handle = {
        width: 20,
        height: 20,
        backgroundColor: "var(--primary)",
        borderRadius: "50%",
    };

    return (
        <div className="flex items-center gap-2">
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
        </div>
    );
}
