'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Tag, FileText, ImageIcon, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        image: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const profile = await res.json();
                router.push(`/profile/${profile.id}`);
            } else {
                alert('Failed to create profile');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl px-4 py-12">
            <Link
                href="/"
                className="group mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-blue-600"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
            </Link>

            <div className="rounded-3xl border bg-white p-8 shadow-sm md:p-12">
                <h1 className="text-3xl font-black text-gray-900">Create New Profile</h1>
                <p className="mt-2 text-gray-500">Add a public figure, leader, or any person to start community polls.</p>

                <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <User className="h-4 w-4 text-blue-500" />
                            Full Name
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Jane Doe"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <Tag className="h-4 w-4 text-blue-500" />
                            Category
                        </label>
                        <select
                            required
                            className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="">Select a category</option>
                            <option value="Politician">Politician</option>
                            <option value="Athlete">Athlete</option>
                            <option value="Tech Leader">Tech Leader</option>
                            <option value="Creator">Creator</option>
                            <option value="Community Leader">Community Leader</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <FileText className="h-4 w-4 text-blue-500" />
                            Description / Bio
                        </label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Describe this person and their impact..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <ImageIcon className="h-4 w-4 text-blue-500" />
                            Image URL (Optional)
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-4 text-sm font-bold text-white transition-all hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating Profile...
                            </>
                        ) : (
                            'Create Profile'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
