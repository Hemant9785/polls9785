import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const profiles = await prisma.profile.findMany({
            include: {
                _count: {
                    select: { polls: true }
                }
            }
        });
        return NextResponse.json(profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
    }
}

import { auth } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await auth();

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, category, description, image } = body;

        const profile = await prisma.profile.create({
            data: {
                userId: session.user.id,
                name,
                category,
                description,
                image: image || '/profiles/default.jpg',
            }
        });

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error creating profile:', error);
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
    }
}
