import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import requestIp from 'request-ip';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const pollId = params.id;
    const session = await auth();

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'You must be signed in to vote' }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const body = await request.json();
        const { optionId, fingerprint } = body;

        // Get IP address for audit/logging
        const headers = Object.fromEntries(request.headers.entries());
        const ip = requestIp.getClientIp({ headers } as any) || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Duplicate check using User ID
        const existingVote = await prisma.vote.findUnique({
            where: {
                pollId_userId: {
                    pollId,
                    userId,
                }
            }
        });

        if (existingVote) {
            return NextResponse.json({ error: 'You have already voted on this poll' }, { status: 403 });
        }

        // Check if poll is active
        const poll = await prisma.poll.findUnique({
            where: { id: pollId }
        });

        if (!poll || !poll.isActive || new Date() > new Date(poll.expiresAt)) {
            if (poll && poll.isActive) {
                await prisma.poll.update({
                    where: { id: pollId },
                    data: { isActive: false }
                });
            }
            return NextResponse.json({ error: 'Poll is closed' }, { status: 403 });
        }

        // Create vote
        const vote = await prisma.vote.create({
            data: {
                pollId,
                userId,
                optionId,
                ipAddress: ip,
                userAgent,
                fingerprint,
            }
        });

        // Notify via Supabase Realtime
        try {
            const channel = supabase.channel(`poll_updates_${pollId}`);
            await channel.send({
                type: 'broadcast',
                event: 'pollUpdated',
                payload: { pollId }
            });
            await supabase.removeChannel(channel);
        } catch (e) {
            console.warn('Supabase Realtime broadcast failed', e);
        }

        return NextResponse.json(vote);
    } catch (error) {
        console.error('Error voting:', error);
        return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 });
    }
}
