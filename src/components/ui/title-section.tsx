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
            className={`relative py-20 pb-20 px-[5vw] md:px-[7vw] lg:px-[20vw] font-sans ${props.className || ""}`}
            viewport={{ once: true }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.h2
                    className="text-3xl md:text-4xl font-bold"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {props.title}
                </motion.h2>
                <motion.div
                    className="h-1 w-16 mx-auto mt-3 rounded-full bg-gradient-to-r from-primary to-purple-500"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                />
                {props.description && (
                    <motion.p
                        className="text-muted-foreground mt-4 text-base max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        {props.description}
                    </motion.p>
                )}
            </motion.div>
            {props.children}
        </motion.section>
    );
};
