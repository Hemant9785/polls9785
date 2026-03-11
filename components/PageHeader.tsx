import Link from 'next/link';
import { Vote } from 'lucide-react';

export default function PageHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                        <Vote className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-gray-900 leading-none">Verdict</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Public Sentiment</span>
                    </div>
                </Link>
                <nav>
                    <ul className="flex items-center gap-6">
                        <li>
                            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="text-sm font-medium text-gray-400 cursor-not-allowed">
                                About
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
