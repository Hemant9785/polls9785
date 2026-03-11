'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, BarChart3, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSocket } from './SocketProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Option, Poll } from '@/types';
import { getBrowserFingerprint } from '@/lib/fingerprint';

dayjs.extend(relativeTime);

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface PollCardProps {
    initialPoll: Poll;
}

export default function PollCard({ initialPoll }: PollCardProps) {
    const [poll, setPoll] = useState<Poll>(initialPoll);
    const [isVoted, setIsVoted] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { socket } = useSocket();

    const fetchPoll = useCallback(async () => {
        try {
            const res = await fetch(`/api/polls/${poll.id}`);
            if (res.ok) {
                const data = await res.json();
                setPoll(data);
            }
        } catch (err) {
            console.error('Failed to fetch poll', err);
        }
    }, [poll.id]);

    useEffect(() => {
        if (!socket) return;

        const handleUpdate = (data: { pollId: string }) => {
            if (data.pollId === poll.id) {
                fetchPoll();
            }
        };

        socket.on('pollUpdated', handleUpdate);
        return () => {
            socket.off('pollUpdated', handleUpdate);
        };
    }, [socket, poll.id, fetchPoll]);

    const handleVote = async (optionId: string) => {
        if (isVoting || isVoted || !poll.isActive) return;

        setIsVoting(true);
        setError(null);

        try {
            const res = await fetch(`/api/polls/${poll.id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    optionId,
                    fingerprint: getBrowserFingerprint()
                }),
            });

            if (res.ok) {
                setIsVoted(true);
                fetchPoll(); // Refresh to get latest numbers immediately
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to vote');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsVoting(false);
        }
    };

    const totalVotes = poll.options.reduce((acc, opt) => acc + (opt._count?.votes || 0), 0);
    const isExpired = new Date() > new Date(poll.expiresAt);
    const isActive = poll.isActive && !isExpired;

    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-gray-900 leading-tight">
                            {poll.question}
                        </h4>
                        {!isActive && (
                            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                Closed
                            </span>
                        )}
                    </div>
                    <p className="text-[12px] text-gray-400 capitalize">
                        {dayjs(poll.createdAt).fromNow()}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600">
                    <Clock className="h-3 w-3" />
                    {isActive ? `Ends ${dayjs(poll.expiresAt).fromNow()}` : 'Ended'}
                </div>
            </div>

            <div className="mt-8 space-y-4">
                {poll.options.map((option) => {
                    const votes = option._count?.votes || 0;
                    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

                    return (
                        <div key={option.id} className="group relative">
                            <button
                                onClick={() => handleVote(option.id)}
                                disabled={!isActive || isVoted || isVoting}
                                className={cn(
                                    "relative w-full overflow-hidden rounded-xl border p-4 text-left transition-all",
                                    isActive && !isVoted ? "hover:border-blue-200 hover:bg-blue-25/30" : "cursor-default",
                                    isVoted && "border-gray-100 bg-gray-50/50"
                                )}
                            >
                                {/* Progress Background */}
                                {(isVoted || !isActive) && (
                                    <div
                                        className="absolute inset-0 bg-blue-50/50 transition-all duration-1000 ease-out"
                                        style={{ width: `${percentage}%` }}
                                    />
                                )}

                                <div className="relative flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors",
                                            isVoted ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white text-gray-400 group-hover:border-blue-400"
                                        )}>
                                            {isVoted ? <CheckCircle2 className="h-3 w-3" /> : null}
                                        </div>
                                        <span className={cn(
                                            "font-semibold transition-colors",
                                            isVoted ? "text-blue-900" : "text-gray-700"
                                        )}>
                                            {option.label}
                                        </span>
                                    </div>
                                    {(isVoted || !isActive) && (
                                        <span className="text-sm font-bold text-blue-600">{percentage}%</span>
                                    )}
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2 text-[12px] font-medium text-gray-400">
                    <BarChart3 className="h-3.5 w-3.5 text-gray-400" />
                    <span className="flex items-center gap-1">
                        <strong className="text-gray-600">{totalVotes.toLocaleString()}</strong>
                        total votes
                    </span>
                </div>

                {error && (
                    <div className="flex items-center gap-1 text-[11px] font-medium text-red-500 animate-in fade-in slide-in-from-right-2">
                        <AlertCircle className="h-3 w-3" />
                        {error}
                    </div>
                )}

                {isVoted && !error && (
                    <div className="flex items-center gap-1 text-[11px] font-medium text-green-600 uppercase tracking-tight">
                        <CheckCircle2 className="h-3 w-3" />
                        Voted
                    </div>
                )}
            </div>
        </div>
    );
}
