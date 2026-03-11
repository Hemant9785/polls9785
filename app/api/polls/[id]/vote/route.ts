import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import requestIp from 'request-ip';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const pollId = params.id;

    try {
        const body = await request.json();
        const { optionId, fingerprint } = body;

        // Get IP address
        const headers = Object.fromEntries(request.headers.entries());
        const ip = requestIp.getClientIp({ headers } as any) || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Duplicate check
        const existingVote = await prisma.vote.findFirst({
            where: {
                pollId,
                ipAddress: ip,
                userAgent,
            }
        });

        if (existingVote) {
            return NextResponse.json({ error: 'Already voted from this device/IP' }, { status: 403 });
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
                optionId,
                ipAddress: ip,
                userAgent,
                fingerprint,
            }
        });

        // Notify via socket (triggering a broadcast from the server)
        // We'll need a way to tell the socket server to emit.
        // In a serverless/worker environment, we might use a webhook or a shared store.
        // Since this is Next.js, we can try to hit the socket initialization route or similar.
        // For now, let's assume we'll trigger it via a separate internal call or use a pub/sub.

        // Simplest approach for this demo:
        // If the socket server is running in-process, we can try to access it.
        // But in App Router, the API routes are isolated.
        // We can use an internal API call to the Pages route to emit the event.

        try {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            await fetch(`${siteUrl}/api/socket/emit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event: 'pollUpdated', data: { pollId } })
            });
        } catch (e) {
            console.warn('Socket emit failed', e);
        }

        return NextResponse.json(vote);
    } catch (error) {
        console.error('Error voting:', error);
        return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 });
    }
}
