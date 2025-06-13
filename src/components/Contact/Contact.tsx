'use client';

import { TitleSection } from "@/components/ui/title-section";
import React from "react";
import {
    Mail,
    MapPin,
    Phone,
    Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
export const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const notify = () =>
        toast("Thank you for your message. I'll get back to you soon.");
    const handleSubmit = (e: any) => {
        e.preventDefault();

        setIsSubmitting(true);

        setTimeout(() => {
            notify();
            setIsSubmitting(false);
        }, 1500);
    };
    return (
        <TitleSection
            id={"contact"}
            title={"Contact"}
            description="Feel free to reach out to me for any inquiries, collaborations, or just to say hello! I'm always open to new opportunities and connections."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <h3 className="text-2xl font-semibold mb-6">
                        {" "}
                        Contact Information
                    </h3>

                    <div className="space-y-6 justify-center">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Mail className="h-6 w-6 text-primary" />{" "}
                            </div>
                            <div>
                                <h4 className="font-medium"> Email</h4>
                                <a
                                    href="mailto:vietnq.23ceb@vku.udn.vn"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    vietnq.23ceb@vku.udn.vn
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Phone className="h-6 w-6 text-primary" />{" "}
                            </div>
                            <div>
                                <h4 className="font-medium">Phone</h4>
                                <a
                                    href="tel:+11234567890"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    +84 0777 777 777
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <MapPin className="h-6 w-6 text-primary" />{" "}
                            </div>
                            <div>
                                <h4 className="font-medium"> Location</h4>
                                <a className="text-muted-foreground hover:text-primary transition-colors">
                                    Da Nang, Viet Nam
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className=" rounded-lg shadow-xs"
                    onSubmit={handleSubmit}
                >
                    <h3 className="text-2xl font-semibold mb-6">
                        {" "}
                        Send a Message
                    </h3>

                    <form className="space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium mb-2"
                            >
                                {" "}
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary"
                                placeholder="John Doe..."
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-2"
                            >
                                {" "}
                                Your Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary"
                                placeholder="john@gmail.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm font-medium mb-2"
                            >
                                {" "}
                                Your Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary resize-none"
                                placeholder="Hello, I'd like to talk about..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "cosmic-button w-full "
                            )}
                        >
                           <div className="flex items-center gap-2 justify-center">
                             <Send size={16} />
                           {isSubmitting ? "Sending..." : "Send Message"}
                           </div>
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </TitleSection>
    );
};
