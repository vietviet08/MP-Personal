"use client";

import { TitleSection } from "@/components/ui/title-section";
import React from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";

import { ContactInfo } from "@/app/constants/constant";

export const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(
                    "Thank you for your message. I'll get back to you soon.",
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        transition: Bounce,
                    }
                );
                setFormData({
                    name: "",
                    email: "",
                    message: "",
                });
            } else {
                toast.error(data.error || "Failed to send message. Please try again later.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <TitleSection
            id={"contact"}
            title={"Contact"}
            description="Feel free to reach out to me for any inquiries, collaborations, or just to say hello! I'm always open to new opportunities and connections."
        >
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <motion.h3
                        className="text-2xl font-semibold mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {" "}
                        Contact Information
                    </motion.h3>

                    <motion.div
                        className="space-y-6 justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.5,
                            delay: 0.4,
                            staggerChildren: 0.2,
                        }}
                    >
                        <motion.div
                            className="flex items-start space-x-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            whileHover={{ x: 5 }}
                        >
                            <motion.div
                                className="p-3 rounded-full bg-primary/10"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.6,
                                }}
                                whileHover={{ scale: 1.1, rotate: 10 }}
                            >
                                <Mail className="h-6 w-6 text-primary" />{" "}
                            </motion.div>
                            <div>
                                <motion.h4
                                    className="font-medium"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                    Email
                                </motion.h4>
                                <motion.a
                                    href={`mailto:` + ContactInfo.email}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                >
                                    {ContactInfo.email}
                                </motion.a>
                            </div>
                        </motion.div>
                        <motion.div
                            className="flex items-start space-x-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            whileHover={{ x: 5 }}
                        >
                            <motion.div
                                className="p-3 rounded-full bg-primary/10"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.8,
                                }}
                                whileHover={{ scale: 1.1, rotate: 10 }}
                            >
                                <Phone className="h-6 w-6 text-primary" />{" "}
                            </motion.div>
                            <div>
                                <motion.h4
                                    className="font-medium"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.9 }}
                                >
                                    Phone
                                </motion.h4>
                                <motion.a
                                    href="tel:+11234567890"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 1.0 }}
                                >
                                    {ContactInfo.phone}
                                </motion.a>
                            </div>
                        </motion.div>
                        <motion.div
                            className="flex items-start space-x-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            whileHover={{ x: 5 }}
                        >
                            <motion.div
                                className="p-3 rounded-full bg-primary/10"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 1.0,
                                }}
                                whileHover={{ scale: 1.1, rotate: 10 }}
                            >
                                <MapPin className="h-6 w-6 text-primary" />{" "}
                            </motion.div>
                            <div>
                                <motion.h4
                                    className="font-medium"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 1.1 }}
                                >
                                    Location
                                </motion.h4>
                                <motion.a
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 1.2 }}
                                >
                                    {ContactInfo.location}
                                </motion.a>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="rounded-lg shadow-xs"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    <motion.h3
                        className="text-2xl font-semibold mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        {" "}
                        Send a Message
                    </motion.h3>

                    <motion.form
                        className="space-y-6"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium mb-2"
                            >
                                {" "}
                                Your Name
                            </label>
                            <motion.input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary"
                                placeholder="John Doe..."
                                whileFocus={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-2"
                            >
                                {" "}
                                Your Email
                            </label>
                            <motion.input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary"
                                placeholder="john@gmail.com"
                                whileFocus={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <label
                                htmlFor="message"
                                className="block text-sm font-medium mb-2"
                            >
                                {" "}
                                Your Message
                            </label>
                            <motion.textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary resize-none"
                                placeholder="Hello, I'd like to talk about..."
                                whileFocus={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                            />
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn("cosmic-button w-full ")}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className="flex items-center gap-2 justify-center">
                                <Send size={16} />
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </div>
                        </motion.button>
                    </motion.form>
                </motion.div>
            </motion.div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Bounce}
            />
        </TitleSection>
    );
};
