"use client";

import { TitleSection } from "@/components/ui/title-section";
import { Code, Cloud, Shield } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { AboutInfo, TechnicalSkillsText } from "@/constants/constant";

const iconMap: Record<string, React.ReactNode> = {
    Code: <Code className="h-5 w-5 text-primary" />,
    Cloud: <Cloud className="h-5 w-5 text-primary" />,
    Shield: <Shield className="h-5 w-5 text-primary" />,
};

export const About = () => {
    return (
        <TitleSection
            className="bg-gray-50/50 dark:bg-transparent"
            id="about"
            title="About Me"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left: Text content */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <h3 className="text-2xl font-semibold">
                        {AboutInfo.headline}
                    </h3>
                    {AboutInfo.paragraphs.map((p, i) => (
                        <motion.p
                            key={i}
                            className="text-muted-foreground leading-relaxed"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                        >
                            {p}
                        </motion.p>
                    ))}

                    {/* Technical Skills compact */}
                    <motion.div
                        className="pt-4 space-y-3"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        {TechnicalSkillsText.map((skill, i) => (
                            <div key={i} className="flex gap-2 text-sm">
                                <span className="text-primary font-medium whitespace-nowrap min-w-[160px]">
                                    {skill.category}:
                                </span>
                                <span className="text-muted-foreground">{skill.items}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right: Highlight cards */}
                <motion.div
                    className="grid grid-cols-1 gap-5"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    {AboutInfo.highlights.map((item, index) => (
                        <motion.div
                            key={index}
                            className="glass-card p-6"
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-start gap-4">
                                <motion.div
                                    className="p-3 rounded-xl bg-primary/10 flex-shrink-0"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.3 + index * 0.15,
                                    }}
                                >
                                    {iconMap[item.icon]}
                                </motion.div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </TitleSection>
    );
};
