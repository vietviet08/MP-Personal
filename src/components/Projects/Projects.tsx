"use client";

import { TitleSection } from "@/components/ui/title-section";
import Image from "next/image";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar } from "lucide-react";
import { ProjectsInfo } from "@/constants/constant";
import { motion } from "framer-motion";

export const Projects = () => {
    return (
        <TitleSection
            className="bg-gray-50/50 dark:bg-transparent"
            id="projects"
            title="Projects"
            description="Selected projects showcasing backend, DevOps, and cloud engineering skills"
        >
            <motion.div
                className="grid grid-cols-1 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.3 }}
            >
                {ProjectsInfo.map((project, index) => (
                    <motion.div
                        className="glass-card overflow-hidden"
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.7,
                            delay: index * 0.15,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ y: -4 }}
                    >
                        <div
                            className={`flex flex-col ${
                                index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                            }`}
                        >
                            {/* Image */}
                            <motion.div
                                className="w-full md:w-2/5 p-4"
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <motion.div
                                    className="overflow-hidden rounded-lg"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Image
                                        src={Object.values(project.image)[0]}
                                        alt={project.title}
                                        width={500}
                                        height={300}
                                        className="w-full h-auto object-cover rounded-lg"
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                className="w-full md:w-3/5 p-6 flex flex-col justify-between"
                                initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold">
                                            {project.title}
                                        </h3>
                                    </div>
                                    {project.period && (
                                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {project.period}
                                        </div>
                                    )}
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {project.technologies.map((tech, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="text-xs bg-primary/5 text-foreground border border-primary/10 hover:bg-primary/10 transition-colors"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <motion.a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium w-fit"
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    View Repository
                                </motion.a>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </TitleSection>
    );
};
