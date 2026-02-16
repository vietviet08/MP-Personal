"use client";

import React from "react";
import Image from "next/image";
import { SkillsInfo } from "@/constants/constant";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { TitleSection } from "@/components/ui/title-section";

export const Skills = () => {
    return (
        <TitleSection
            id="skills"
            title="Skills & Technologies"
            description="The tools, frameworks and technologies I work with"
        >
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delayChildren: 0.3 }}
            >
                {SkillsInfo.map((skillCategory, index) => (
                    <motion.div
                        key={index}
                        className="glass-card p-6"
                        viewport={{ once: true }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                    >
                        <motion.h3
                            className="text-lg font-semibold mb-5 text-center text-foreground"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {skillCategory.title}
                        </motion.h3>
                        <Tilt
                            key={skillCategory.title}
                            tiltMaxAngleX={12}
                            tiltMaxAngleY={12}
                            perspective={800}
                            scale={1.03}
                            transitionSpeed={1500}
                            gyroscope={true}
                        >
                            <motion.div
                                className="flex items-center justify-center flex-wrap gap-5"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    staggerChildren: 0.1,
                                    delayChildren: 0.2,
                                }}
                            >
                                {skillCategory.skills.map((skill, skillIndex) => (
                                    <motion.div
                                        key={skillIndex}
                                        className="flex flex-col items-center gap-1.5 group"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: skillIndex * 0.05 + 0.3,
                                        }}
                                        whileHover={{
                                            scale: 1.2,
                                            transition: { duration: 0.2 },
                                        }}
                                    >
                                        <div className="p-2 rounded-xl bg-foreground/[0.03] group-hover:bg-primary/10 transition-colors">
                                            <Image
                                                src={skill.logo}
                                                alt={skill.name}
                                                className="h-10 w-10 object-contain"
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors font-medium">
                                            {skill.name}
                                        </span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </Tilt>
                    </motion.div>
                ))}
            </motion.div>
        </TitleSection>
    );
};
