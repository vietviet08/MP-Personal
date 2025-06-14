'use client';

import { TitleSection } from "@/components/ui/title-section";
import { Briefcase, Code, User } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

export const About = () => {
    return (
        <TitleSection
            className="bg-gray-50 dark:bg-[#111827]"
            id={"about"}
            title={"About Me"}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <motion.h3 
                        className="text-2xl font-semibold"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Passionate Web Developer & Tech Creator
                    </motion.h3>

                    <motion.p 
                        className="text-muted-foreground"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        With over 5 years of experience in web development, I
                        specialize in creating responsive, accessible, and
                        performant web applications using modern technologies.
                    </motion.p>

                    <motion.p 
                        className="text-muted-foreground"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        I&apos;m passionate about creating elegant solutions to
                        complex problems, and I&apos;m constantly learning new
                        technologies and techniques to stay at the forefront of
                        the ever-evolving web landscape.
                    </motion.p>
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 gap-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <motion.div 
                        className="gradient-border p-6 card-hover"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-start gap-4">
                            <motion.div 
                                className="p-3 rounded-full bg-primary/10"
                                initial={{ scale: 0, rotate: -180 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                            >
                                <Code className="h-6 w-6 text-primary" />
                            </motion.div>
                            <div className="text-left">
                                <motion.h4 
                                    className="font-semibold text-lg"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    {" "}
                                    Web Development
                                </motion.h4>
                                <motion.p 
                                    className="text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    Creating responsive websites and web
                                    applications with modern frameworks.
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="gradient-border p-6 card-hover"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-start gap-4">
                            <motion.div 
                                className="p-3 rounded-full bg-primary/10"
                                initial={{ scale: 0, rotate: -180 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                            >
                                <User className="h-6 w-6 text-primary" />
                            </motion.div>
                            <div className="text-left">
                                <motion.h4 
                                    className="font-semibold text-lg"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    UI/UX Design
                                </motion.h4>
                                <motion.p 
                                    className="text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                    Designing intuitive user interfaces and
                                    seamless user experiences.
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="gradient-border p-6 card-hover"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-start gap-4">
                            <motion.div 
                                className="p-3 rounded-full bg-primary/10"
                                initial={{ scale: 0, rotate: -180 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.7 }}
                            >
                                <Briefcase className="h-6 w-6 text-primary" />
                            </motion.div>

                            <div className="text-left">
                                <motion.h4 
                                    className="font-semibold text-lg"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                >
                                    Project Management
                                </motion.h4>
                                <motion.p 
                                    className="text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.9 }}
                                >
                                    Leading projects from conception to
                                    completion with agile methodologies.
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </TitleSection>
    );
};
