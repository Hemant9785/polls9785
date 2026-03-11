import prisma from "@/lib/prisma";
import ProfileCard from "@/components/ProfileCard";
import { PlusCircle, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getProfileStats() {
    try {
        const profiles = await prisma.profile.findMany({
            include: {
                polls: {
                    include: {
                        _count: {
                            select: { votes: true }
                        }
                    }
                }
            }
        });

        return profiles.map(p => {
            const totalVotes = p.polls?.reduce((acc: number, poll: any) => acc + (poll._count?.votes || 0), 0) || 0;
            const activePolls = p.polls?.filter((poll: any) => poll.isActive && new Date() < new Date(poll.expiresAt)).length || 0;

            return {
                ...p,
                totalVotes,
                activePolls
            };
        });
    } catch (error) {
        console.error("Database connection error:", error);
        return null; // Signal error to the UI
    }
}

export default async function HomePage() {
    const profileStats = await getProfileStats();

    if (profileStats === null) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Connection Issue</h2>
                <p className="mt-2 text-gray-600 max-w-md">
                    We're having trouble connecting to the database. Please check your environment variables in Vercel.
                </p>
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
                <div className="mb-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-600">
                    <TrendingUp className="h-4 w-4" />
                    Public Sentiment Tracker
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                    Voice of the <span className="text-blue-600">People</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
                    Participate in the democratic process. Explore leaders, track sentiment, and make your voice heard in real-time.
                </p>

                <div className="mt-10 flex items-center justify-center gap-12 border-y bg-white/50 py-8 backdrop-blur-sm">
                    <div className="text-center">
                        <p className="text-3xl font-black text-gray-900">
                            {profileStats.reduce((acc, p) => acc + p.totalVotes, 0).toLocaleString()}
                        </p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Total Votes Cast</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200" />
                    <div className="text-center">
                        <p className="text-3xl font-black text-gray-900">
                            {profileStats.reduce((acc, p) => acc + p.activePolls, 0)}
                        </p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Active Polls</p>
                    </div>
                </div>
            </div>

            <div className="mb-10 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Featured Profiles</h2>
                <Link
                    href="/profile/new"
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                >
                    <PlusCircle className="h-4 w-4" />
                    Create Profile
                </Link>
            </div>

            {profileStats.length > 0 ? (
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {profileStats.map((profile) => (
                        <ProfileCard key={profile.id} profile={profile as any} />
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl border-2 border-dashed bg-white/50 p-20 text-center backdrop-blur-sm">
                    <p className="text-lg font-medium text-gray-500">No profiles created yet. Be the first to add someone!</p>
                </div>
            )}
        </div>
    );
}
