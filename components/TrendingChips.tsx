'use client';

import React from 'react';
import { Hash } from 'lucide-react';

const chips = ['StableDiffusion', 'GPT-4o', 'SocialMedia', 'Web3', 'VideoGen', 'Automation'];

export function TrendingChips() {
    return (
        <div className="flex flex-wrap justify-center gap-3">
            <span className="text-xs font-bold text-foreground/40 uppercase tracking-tight flex items-center gap-2 mr-2 self-center">
                Trending:
            </span>
            {chips.map((chip) => (
                <button
                    key={chip}
                    className="px-4 py-1.5 glass border border-glass-border rounded-full text-xs font-medium text-foreground/60 hover:text-primary hover:border-primary/40 transition-all flex items-center gap-1.5"
                >
                    <Hash className="w-3 h-3 opacity-40" />
                    {chip}
                </button>
            ))}
        </div>
    );
}
