export type Profile = {
    id: string;
    name: string;
    category: string;
    image: string;
    description: string;
};

export type Option = {
    id: string;
    pollId: string;
    label: string;
    _count?: {
        votes: number;
    };
};

export type Poll = {
    id: string;
    profileId: string;
    question: string;
    isActive: boolean;
    options: Option[];
    createdAt: string;
    expiresAt: string;
    _count?: {
        votes: number;
    };
};

export type Vote = {
    id: string;
    pollId: string;
    optionId: string;
    ipAddress: string;
    userAgent: string;
    fingerprint?: string;
    createdAt: string;
};
