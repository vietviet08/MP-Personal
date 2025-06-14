'use client';

import { TitleSection } from "@/components/ui/title-section";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { ProjectsInfo } from "@/app/constants/constant";
import { motion } from "framer-motion";

export const Projects = () => {
    return (
        <TitleSection
            className="bg-gray-50 dark:bg-[#111827]"
            id={"projects"}
            title={"Projects"}
            description="Here are some of my projects that showcase my skills and creativity. Each project reflects my passion for coding and problem-solving."
        >
            <motion.div 
                className="grid grid-cols-1 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.3 }}
            >
                {ProjectsInfo.map((project, index) => (
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                            duration: 0.7,
                            delay: index * 0.2,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div
                            className={cn("flex flex-col", {
                                "md:flex-row-reverse": index % 2 === 0,
                                "md:flex-row": index % 2 !== 0,
                            })}
                        >
                            <motion.div 
                                className="w-full md:w-1/2 p-4"
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <motion.div 
                                    className="overflow-hidden rounded-md"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Image
                                        src={Object.values(project.image)[0]}
                                        alt="Project Thumbnail"
                                        width={500}
                                        height={300}
                                        className="w-full h-auto object-cover rounded-md hover:scale-105 transition-transform duration-300"
                                    />
                                </motion.div>
                            </motion.div>
                            <motion.div 
                                className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-gray-50 dark:bg-gray-900/30"
                                initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <div>
                                    <motion.h3 
                                        className="text-2xl font-semibold mb-3"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.6 }}
                                    >
                                        {project.title}
                                    </motion.h3>
                                    <motion.p 
                                        className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-4"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.7 }}
                                    >
                                        {project.description}
                                    </motion.p>
                                    <motion.div 
                                        className="flex flex-wrap gap-2 mb-6"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.8 }}
                                    >
                                        {project.technologies.map((tech, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.3, delay: 0.8 + idx * 0.05 }}
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                                >
                                                    {tech}
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 1 }}
                                >
                                    <motion.a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-primary hover:underline font-medium"
                                        whileHover={{ scale: 1.05, x: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <ExternalLink className="mr-2" /> View Project
                                    </motion.a>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </TitleSection>
    );
};
