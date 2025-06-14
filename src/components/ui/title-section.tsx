"use client";

import React from "react";
import { motion } from "framer-motion";

export default interface TitleSectionProps {
    id: string;
    className?: string;
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export const TitleSection = (props: TitleSectionProps) => {
    return (
        <motion.section
            id={props.id}
            className={`relative min-h-[calc(100vh)] py-24 pb-24 px-[5vw] md:px-[7vw] lg:px-[20vw] font-sans bg-skills-gradient clip-path-custom ${props.className}`}
            viewport={{ once: true }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.h2
                    className="text-3xl md:text-4xl font-bold"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {props.title}
                </motion.h2>

                <motion.p
                    className="text-gray-400 mt-4 text-lg font-semibold"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {props.description}
                </motion.p>
            </motion.div>
            {props.children}
        </motion.section>
    );
};
