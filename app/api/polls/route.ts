import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');

    try {
        const polls = await prisma.poll.findMany({
            where: profileId ? { profileId } : {},
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
        });

        return NextResponse.json(polls);
    } catch (error) {
        console.error('Error fetching polls:', error);
        return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { profileId, question, options, expiresAt } = body;

        const poll = await prisma.poll.create({
            data: {
                profileId,
                question,
                expiresAt: new Date(expiresAt),
                options: {
                    create: options.map((label: string) => ({ label }))
                }
            },
            include: {
                options: true
            }
        });

        return NextResponse.json(poll);
    } catch (error) {
        console.error('Error creating poll:', error);
        return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
    }
}
