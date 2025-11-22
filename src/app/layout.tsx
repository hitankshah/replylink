import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ReplyLink - Link-in-Bio + Auto-Reply Platform",
    description: "Create beautiful link-in-bio pages and automate replies for Instagram, Facebook, and WhatsApp",
    keywords: ["link in bio", "linktree", "auto reply", "instagram", "facebook", "whatsapp", "social media automation"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
