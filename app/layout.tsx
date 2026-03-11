import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageHeader from "@/components/PageHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "PolliSphere | Political Polling Platform",
    description: "A modern, transparent platform for tracking political sentiment and engagement.",
};

import { SocketProvider } from "@/components/SocketProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
            <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900`}>
                <SocketProvider>
                    <PageHeader />
                    <main>{children}</main>
                    <footer className="mt-20 border-t bg-white py-12">
                        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                            © {new Date().getFullYear()} PolliSphere. Built with Next.js & TailwindCSS.
                        </div>
                    </footer>
                </SocketProvider>
            </body>
        </html>
    );
}
