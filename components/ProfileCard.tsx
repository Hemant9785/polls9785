import Link from 'next/link';
import Image from 'next/image';
import { Profile } from '@/types';
import { ChevronRight, BarChart2, Users } from 'lucide-react';

interface ProfileCardProps {
    profile: Profile & { totalVotes?: number, activePolls?: number };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                    src={profile.image}
                    alt={profile.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block rounded-full bg-blue-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        {profile.category}
                    </span>
                </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {profile.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500 leading-relaxed">
                    {profile.description}
                </p>

                <div className="mt-6 flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-gray-900">
                            <BarChart2 className="h-3 w-3 text-blue-500" />
                            {profile.totalVotes?.toLocaleString() || 0}
                        </span>
                        <span>Votes Cast</span>
                    </div>
                    <div className="h-8 w-px bg-gray-100" />
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-gray-900">
                            <Users className="h-3 w-3 text-green-500" />
                            {profile.activePolls || 0}
                        </span>
                        <span>Active Polls</span>
                    </div>
                </div>

                <div className="mt-6">
                    <Link
                        href={`/profile/${profile.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                        View Profile & Polls
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
