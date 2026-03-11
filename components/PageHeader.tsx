import Link from 'next/link';
import { Vote, User, LogOut, PlusCircle } from 'lucide-react';
import { auth, signOut } from '@/lib/auth';

export default async function PageHeader() {
    const session = await auth();

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
                <nav className="flex items-center gap-6">
                    <ul className="flex items-center gap-6 border-r pr-6 border-gray-100">
                        <li>
                            <Link href="/" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
                                Browse
                            </Link>
                        </li>
                    </ul>

                    <div className="flex items-center gap-4">
                        {session?.user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/profile/new"
                                    className="hidden items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm font-bold text-gray-900 transition-all hover:bg-gray-100 sm:flex"
                                >
                                    <PlusCircle className="h-4 w-4 text-blue-600" />
                                    Create
                                </Link>
                                <div className="h-8 w-px bg-gray-100 hidden sm:block" />
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end hidden lg:flex">
                                        <span className="text-xs font-black text-gray-900 leading-none">{session.user.name || 'User'}</span>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Member</span>
                                    </div>
                                    <form action={async () => {
                                        "use server";
                                        await signOut();
                                    }}>
                                        <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-gray-100 bg-white text-gray-500 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-600">
                                            <LogOut className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors px-4"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
