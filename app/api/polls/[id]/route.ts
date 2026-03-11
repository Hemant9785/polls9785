import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const pollId = params.id;

    try {
        const poll = await prisma.poll.findUnique({
            where: { id: pollId },
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
            }
        });

        if (!poll) {
            return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
        }

        // Auto-status update
        const isExpired = new Date() > new Date(poll.expiresAt);
        if (isExpired && poll.isActive) {
            await prisma.poll.update({
                where: { id: pollId },
                data: { isActive: false }
            });
            poll.isActive = false;
        }

        return NextResponse.json(poll);
    } catch (error) {
        console.error('Error fetching poll:', error);
        return NextResponse.json({ error: 'Failed to fetch poll' }, { status: 500 });
    }
}
