"use client";

import { TitleSection } from "@/components/ui/title-section";
import React, { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { ContactInfo } from "@/constants/constant";

export const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success("Thank you! I'll get back to you soon.", {
                    position: "top-right",
                    autoClose: 5000,
                    transition: Bounce,
                });
                setFormData({ name: "", email: "", message: "" });
            } else {
                toast.error(data.error || "Failed to send message.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactItems = [
        {
            icon: <Mail className="h-5 w-5 text-primary" />,
            label: "Email",
            value: ContactInfo.email,
            href: `mailto:${ContactInfo.email}`,
        },
        {
            icon: <Phone className="h-5 w-5 text-primary" />,
            label: "Phone",
            value: ContactInfo.phone,
            href: `tel:${ContactInfo.phone.replaceAll(" ", "")}`,
        },
        {
            icon: <MapPin className="h-5 w-5 text-primary" />,
            label: "Location",
            value: ContactInfo.location,
            href: undefined,
        },
    ];

    const socialLinks = [
        { icon: <Icon icon="mdi:github" className="h-5 w-5" />, href: ContactInfo.socialLinks.github, label: "GitHub" },
        { icon: <Icon icon="mdi:linkedin" className="h-5 w-5" />, href: ContactInfo.socialLinks.linkedin, label: "LinkedIn" },
        { icon: <Icon icon="mdi:facebook" className="h-5 w-5" />, href: ContactInfo.socialLinks.facebook, label: "Facebook" },
    ];

    return (
        <TitleSection
            id="contact"
            title="Get In Touch"
            description="Feel free to reach out for collaborations, opportunities, or just to say hello!"
        >
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                {/* Left: Contact info */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <h3 className="text-xl font-semibold">Contact Information</h3>

                    <div className="space-y-4">
                        {contactItems.map((item, i) => (
                            <motion.div
                                key={i}
                                className="flex items-center gap-4 glass-card p-4"
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                                whileHover={{ x: 4 }}
                            >
                                <div className="p-2.5 rounded-xl bg-primary/10 flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        {item.label}
                                    </p>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-medium">{item.value}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Social links */}
                    <motion.div
                        className="flex items-center gap-3 pt-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        {socialLinks
                            .filter((s) => s.href)
                            .map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl glass-card hover:scale-110 transition-all text-muted-foreground hover:text-primary"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                    </motion.div>
                </motion.div>

                {/* Right: Contact form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    <h3 className="text-xl font-semibold mb-6">Send a Message</h3>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl bg-foreground/[0.03] border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
                                placeholder="John Doe..."
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                                Your Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl bg-foreground/[0.03] border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
                                placeholder="john@gmail.com"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                        >
                            <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                                Your Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full px-4 py-2.5 rounded-xl bg-foreground/[0.03] border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none text-sm"
                                placeholder="Hello, I'd like to talk about..."
                            />
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className="cosmic-button w-full flex items-center justify-center gap-2"
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Send size={16} />
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </div>
                        </motion.button>
                    </form>
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
