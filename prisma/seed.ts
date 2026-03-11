import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const profiles = [
        {
            id: "1",
            name: "Alex Sterling",
            category: "Politician",
            image: "/profiles/alex-sterling.jpg",
            description: "A seasoned advocate for social justice and sustainable urban development.",
        },
        {
            id: "2",
            name: "Elena Vance",
            category: "Economist",
            image: "/profiles/elena-vance.jpg",
            description: "Expert in economic stability and fractional values.",
        },
        {
            id: "3",
            name: "Marcus Thorne",
            category: "Tech Leader",
            image: "/profiles/marcus-thorne.jpg",
            description: "Dedicated to individual freedoms and digital privacy rights.",
        },
        {
            id: "4",
            name: "Sarah Chen",
            category: "Community Leader",
            image: "/profiles/sarah-chen.jpg",
            description: "Focussed on bridge-building between diverse communities.",
        },
        {
            id: "5",
            name: "Julian Rivera",
            category: "Environmentalist",
            image: "/profiles/julian-rivera.jpg",
            description: "A leading voice in environmental restoration and green energy.",
        },
    ];

    for (const p of profiles) {
        await prisma.profile.upsert({
            where: { id: p.id },
            update: {},
            create: p,
        })
    }

    const pollData = [
        {
            profileId: "1",
            question: "Do you approve of the new community-led housing initiative?",
            options: ["Yes", "No", "Undecided"],
            daysOffset: 2,
        },
        {
            profileId: "3",
            question: "Should digital privacy rights be enshrined in the constitution?",
            options: ["Yes, absolutely", "No, too complex"],
            daysOffset: 5,
        }
    ];

    for (const p of pollData) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + p.daysOffset);

        await prisma.poll.create({
            data: {
                profileId: p.profileId,
                question: p.question,
                expiresAt,
                isActive: p.daysOffset > 0,
                options: {
                    create: p.options.map(label => ({ label }))
                }
            }
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
