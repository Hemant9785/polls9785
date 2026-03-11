import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageHeader from "@/components/PageHeader";
import SupabaseProvider from "@/components/SupabaseProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Verdict | Public Sentiment Platform',
    description: 'Vote on public sentiment for profiles in real-time.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
            <body className={`${inter.className} min-h-screen bg-transparent text-gray-900`}>
                <SupabaseProvider>
                    <PageHeader />
                    <main className="min-h-screen bg-gray-50/50">
                        {children}
                    </main>
                    <footer className="mt-20 border-t bg-white py-12">
                        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                            © {new Date().getFullYear()} Verdict. Built with Next.js & TailwindCSS.
                        </div>
                    </footer>
                </SupabaseProvider>
            </body>
        </html>
    );
}
