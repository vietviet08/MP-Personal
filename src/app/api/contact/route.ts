import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { ContactInfo } from "@/constants/constant";
import { ContactRepo } from "@/lib/supabase";

const emailService = process.env.EMAIL_SERVICE || "gmail";

let resend: Resend | null = null;
if (emailService === "resend") {
    resend = new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
    try {
        const { name, email, message, subject } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email and message are required" },
                { status: 400 }
            );
        }

        // Persist message to Supabase (RLS allows anonymous insert)
        try {
            await ContactRepo.createContactMessage({
                name,
                email,
                message,
                subject,
            });
        } catch (persistError) {
            console.error(
                "Failed to store contact message in Supabase:",
                persistError
            );
            // Do not fail the request solely due to persistence error; continue to email
        }

        if (emailService === "resend" && resend) {
            return await sendWithResend(name, email, message, subject);
        } else {
            return await sendWithGmail(name, email, message, subject);
        }
    } catch (error) {
        console.error("Error processing contact request:", error);
        return NextResponse.json(
            {
                error: "Failed to process your request. Please try again later.",
            },
            { status: 500 }
        );
    }
}

async function sendWithGmail(
    name: string,
    email: string,
    message: string,
    subject?: string
) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER as string,
            replyTo: email,
            to: ContactInfo.email,
            subject: subject || `Portfolio Contact: Message from ${name}`,
            text: `
        Name: ${name}
        Email: ${email}
        
        Message: 
        ${message}
      `,
            html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true, messageId: info.messageId });
    } catch (emailError) {
        console.error("Detailed Gmail sending error:", emailError);
        return NextResponse.json(
            { error: "Failed to send message. Email service error." },
            { status: 500 }
        );
    }
}

async function sendWithResend(
    name: string,
    email: string,
    message: string,
    subject?: string
) {
    try {
        if (!resend) {
            throw new Error("Resend is not initialized");
        }

        const { data, error } = await resend.emails.send({
            from: `Contact Form <onboarding@resend.dev>`,
            to: [ContactInfo.email],
            subject: subject || `Portfolio Contact: Message from ${name}`,
            replyTo: email,
            text: `Name: ${name}\nEmail: ${email}\n${subject ? `Subject: ${subject}\n` : ""}\nMessage:\n${message}`,
            html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
        });

        if (error) {
            console.error("Error sending email with Resend:", error);
            return NextResponse.json(
                { error: "Failed to send message. Please try again later." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, id: data?.id });
    } catch (emailError) {
        console.error("Detailed Resend sending error:", emailError);
        return NextResponse.json(
            { error: "Failed to send message. Email service error." },
            { status: 500 }
        );
    }
}
