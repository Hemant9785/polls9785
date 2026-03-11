'use client';

import React, { useState } from 'react';
import { PlusCircle, Loader2, MinusCircle, AlertCircle } from 'lucide-react';

interface CreatePollFormProps {
    profileId: string;
    onPollCreated?: () => void;
}

export default function CreatePollForm({ profileId, onPollCreated }: CreatePollFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<string[]>(['Yes', 'No']);
    const [expiresInDays, setExpiresInDays] = useState('7');

    const addOption = () => {
        if (options.length < 5) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (options.some(opt => !opt.trim())) {
            setError('All options must be filled');
            setIsLoading(false);
            return;
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));

        try {
            const res = await fetch('/api/polls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profileId,
                    question,
                    options: options.filter(opt => opt.trim()),
                    expiresAt
                })
            });

            if (res.ok) {
                setQuestion('');
                setOptions(['Yes', 'No']);
                if (onPollCreated) onPollCreated();
                // Optionally show success or trigger a refresh via parent
                window.location.reload(); // Simple refresh for now to show live data
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to create poll');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Poll Question</label>
                    <input
                        required
                        type="text"
                        placeholder="What do you want to ask?"
                        className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700">Options (Max 5)</label>
                    {options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                required
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                className="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="text-gray-300 transition-colors hover:text-red-500"
                                >
                                    <MinusCircle className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    ))}
                    {options.length < 5 && (
                        <button
                            type="button"
                            onClick={addOption}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 transition-colors hover:text-blue-700"
                        >
                            <PlusCircle className="h-3.5 w-3.5" />
                            Add Option
                        </button>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Duration</label>
                    <select
                        className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white"
                        value={expiresInDays}
                        onChange={(e) => setExpiresInDays(e.target.value)}
                    >
                        <option value="1">1 Day</option>
                        <option value="3">3 Days</option>
                        <option value="7">7 Days</option>
                        <option value="14">14 Days</option>
                        <option value="30">30 Days</option>
                    </select>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition-all hover:bg-blue-600 disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Post Poll...
                        </>
                    ) : (
                        'Publish Poll'
                    )}
                </button>
            </form>
        </div>
    );
}
