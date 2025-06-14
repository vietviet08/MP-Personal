"use client";

import React from "react";
import Image from "next/image";
import { SkillsInfo } from "@/app/constants/constant";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { TitleSection } from "@/components/ui/title-section";

export const Skills = () => {
    return (
        <TitleSection
            className="bg-gray-50 dark:bg-[#111827]"
            id={"skills"}
            title={"Skills"}
            description="The skills, tools and technologies I am really good at"
        >
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delayChildren: 0.3 }}
            >
                {SkillsInfo.map((skillCategory, index) => (
                    <motion.div
                        key={index}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                        viewport={{ once: true }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <motion.h3
                            className="text-2xl text-center font-semibold mb-4"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {skillCategory.title}
                        </motion.h3>
                        <Tilt
                            key={skillCategory.title}
                            tiltMaxAngleX={20}
                            tiltMaxAngleY={20}
                            perspective={500}
                            scale={1.07}
                            transitionSpeed={1000}
                            gyroscope={true}
                        >
                            <motion.div
                                className="flex items-center justify-center flex-wrap gap-4"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{
                                    staggerChildren: 0.1,
                                    delayChildren: 0.2,
                                }}
                            >
                                {skillCategory.skills.map(
                                    (skill, skillIndex) => (
                                        <motion.div
                                            key={skillIndex}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            whileInView={{
                                                opacity: 1,
                                                scale: 1,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20,
                                                delay: skillIndex * 0.05 + 0.3,
                                            }}
                                            whileHover={{
                                                scale: 1.15,
                                                rotate: [0, 5, -5, 0],
                                                transition: {
                                                    rotate: {
                                                        duration: 0.5,
                                                        ease: "easeInOut",
                                                        repeat: 0,
                                                    },
                                                },
                                            }}
                                        >
                                            <Image
                                                src={skill.logo}
                                                alt={skill.name}
                                                className="h-14 w-14 object-contain"
                                                width={60}
                                                height={60}
                                            />
                                        </motion.div>
                                    )
                                )}
                            </motion.div>
                        </Tilt>
                    </motion.div>
                ))}
            </motion.div>
        </TitleSection>
    );
};
