import prisma from "@/lib/prisma";
import ProfileCard from "@/components/ProfileCard";
import { PlusCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

async function getProfileStats() {
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
        const totalVotes = p.polls.reduce((acc, poll) => acc + (poll._count?.votes || 0), 0);
        const activePolls = p.polls.filter(poll => poll.isActive && new Date() < new Date(poll.expiresAt)).length;

        return {
            ...p,
            totalVotes,
            activePolls
        };
    });
}

export default async function HomePage() {
    const profileStats = await getProfileStats();

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

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {profileStats.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                ))}
            </div>
        </div>
    );
}
