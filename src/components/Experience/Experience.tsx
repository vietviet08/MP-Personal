"use client";

import React from "react";
import { motion } from "framer-motion";
import { TitleSection } from "@/components/ui/title-section";
import { ExperienceInfo, EducationInfo } from "@/constants/constant";
import { Briefcase, GraduationCap, ExternalLink, Calendar, MapPin } from "lucide-react";

export const Experience = () => {
    return (
        <TitleSection
            id="experience"
            title="Experience & Education"
            description="My professional journey and academic background"
            className="bg-gray-50/50 dark:bg-transparent"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Work Experience - Takes 2/3 */}
                <div className="lg:col-span-2">
                    <motion.div
                        className="flex items-center gap-3 mb-8"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="p-2.5 rounded-xl bg-primary/10">
                            <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">Work Experience</h3>
                    </motion.div>

                    <div className="relative pl-8">
                        {/* Timeline line */}
                        <div className="timeline-line" />

                        {ExperienceInfo.map((exp, index) => (
                            <motion.div
                                key={index}
                                className="relative mb-10 last:mb-0"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                            >
                                {/* Timeline dot */}
                                <div className="timeline-dot" style={{ top: "0.15rem" }} />

                                <div className="glass-card p-6 ml-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                        <div>
                                            <h4 className="text-lg font-semibold text-foreground">
                                                {exp.role}
                                            </h4>
                                            <p className="text-primary font-medium text-sm">
                                                {exp.company}
                                            </p>
                                            <p className="text-muted-foreground text-sm mt-0.5">
                                                {exp.project}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm whitespace-nowrap">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {exp.period}
                                        </div>
                                    </div>

                                    <ul className="space-y-2 mb-4">
                                        {exp.highlights.map((item, i) => (
                                            <motion.li
                                                key={i}
                                                className="text-sm text-muted-foreground flex gap-2"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                                            >
                                                <span className="text-primary mt-1.5 flex-shrink-0">▹</span>
                                                <span>{item}</span>
                                            </motion.li>
                                        ))}
                                    </ul>

                                    <div className="flex flex-wrap gap-1.5">
                                        {exp.technologies.map((tech, i) => (
                                            <span key={i} className="skill-pill text-xs">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {exp.repoUrl && (
                                        <a
                                            href={exp.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:underline"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            View Repository
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Education - Takes 1/3 */}
                <div>
                    <motion.div
                        className="flex items-center gap-3 mb-8"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="p-2.5 rounded-xl bg-primary/10">
                            <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">Education</h3>
                    </motion.div>

                    {EducationInfo.map((edu, index) => (
                        <motion.div
                            key={index}
                            className="glass-card p-6 gradient-border-animated"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <h4 className="text-lg font-semibold text-foreground mb-1">
                                {edu.degree}
                            </h4>
                            <p className="text-primary font-medium text-sm mb-1">
                                {edu.school}
                            </p>
                            <div className="flex-col items-center gap-6 text-muted-foreground text-sm mb-2">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {edu.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {edu.period}
                                </span>
                            </div>
                            <ul className="space-y-2">
                                {edu.highlights.map((item, i) => (
                                    <motion.li
                                        key={i}
                                        className="text-sm text-muted-foreground flex gap-2"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                                    >
                                        <span className="text-primary mt-0.5 flex-shrink-0">▹</span>
                                        <span>{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </TitleSection>
    );
};
