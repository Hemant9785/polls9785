import { notFound } from 'next/navigation';
import Image from 'next/image';
import PollCard from '@/components/PollCard';
import CreatePollForm from '@/components/CreatePollForm';
import { PlusCircle, History, User } from 'lucide-react';
import prisma from '@/lib/prisma';
import { Poll } from '@/types';

interface PageProps {
    params: {
        id: string;
    };
}

async function getProfileData(profileId: string) {
    const profile = await prisma.profile.findUnique({
        where: { id: profileId },
        include: {
            polls: {
                include: {
                    options: {
                        include: {
                            _count: {
                                select: { votes: true }
                            }
                        }
                    },
                    _count: {
                        select: { votes: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!profile) return null;
    return JSON.parse(JSON.stringify(profile));
}

export default async function ProfilePage({ params }: PageProps) {
    const profile = await getProfileData(params.id);

    if (!profile) {
        return notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <section className="flex flex-col items-center gap-12 rounded-3xl bg-white p-8 shadow-sm lg:flex-row lg:p-12">
                <div className="relative h-64 w-64 flex-shrink-0 overflow-hidden rounded-2xl border shadow-lg lg:h-80 lg:w-80">
                    <Image
                        src={profile.image || '/profiles/default.jpg'}
                        alt={profile.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="flex-1 text-center lg:text-left">
                    <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                        {profile.category}
                    </span>
                    <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        {profile.name}
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-gray-600 max-w-2xl">
                        {profile.description}
                    </p>
                </div>
            </section>

            <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Create Poll Section */}
                <div className="lg:col-span-1">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                        <PlusCircle className="h-6 w-6 text-blue-600" />
                        Create Poll
                    </h2>
                    <CreatePollForm profileId={profile.id} />
                </div>

                {/* Poll Timeline Section */}
                <div className="lg:col-span-2">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                        <History className="h-6 w-6 text-blue-600" />
                        Active Verdicts
                    </h2>
                    <div className="mt-6 space-y-6">
                        {profile.polls.length > 0 ? (
                            profile.polls.map((poll: any) => (
                                <PollCard key={poll.id} initialPoll={poll} />
                            ))
                        ) : (
                            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                                <p className="text-gray-500 font-medium">No polls available for this profile yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
