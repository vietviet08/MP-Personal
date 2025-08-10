"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type ContactMessage = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    created_at: string;
};

export default function AdminMessages() {
    const { loading } = useRequireAuth();
    const [messages, setMessages] = useState<ContactMessage[]>([]);

    useEffect(() => {
        if (loading) return;

        const fetchMessages = async () => {
            try {
                const response = await fetch("/api/admin/messages");
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data || []);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [loading]);

    return (
        <main className="py-10">
            <h1 className="text-2xl font-semibold">Contact Messages</h1>
            <div className="mt-6 divide-y rounded-md border">
                {messages.map((m) => (
                    <div key={m.id} className="p-4">
                        <div className="text-sm text-muted-foreground">
                            {new Date(m.created_at).toLocaleString()}
                        </div>
                        <div className="font-medium">
                            {m.name} &lt;{m.email}&gt;
                        </div>
                        {m.subject && (
                            <div className="text-sm">{m.subject}</div>
                        )}
                        <p className="mt-2 whitespace-pre-wrap">{m.message}</p>
                    </div>
                ))}
                {messages.length === 0 && (
                    <div className="p-4 text-sm text-muted-foreground">
                        Chưa có tin nhắn
                    </div>
                )}
            </div>
        </main>
    );
}
