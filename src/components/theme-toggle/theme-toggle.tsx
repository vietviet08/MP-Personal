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

    if (!mounted) {
        return (
            <div style={{ width: container.width, height: container.height }}></div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {isOn ? (
               <Moon onClick={toggleSwitch} className="h-6 w-6 text-blue-300" />
            ) : (
               <Sun onClick={toggleSwitch} className="h-6 w-6 text-yellow-500" />
            )}
        </div>
    );
}
