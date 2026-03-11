'use client';

import React from 'react';
import { Hash } from 'lucide-react';

const chips = ['StableDiffusion', 'GPT-4o', 'SocialMedia', 'Web3', 'VideoGen', 'Automation'];

export function TrendingChips() {
    return (
        <div className="flex flex-wrap justify-center gap-4">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2 mr-4 self-center">
                <span className="w-1 h-1 rounded-full bg-primary" /> Trending:
            </span>
            {chips.map((chip) => (
                <button
                    key={chip}
                    className="px-6 py-2 glass border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-2"
                >
                    <Hash className="w-3 h-3 text-primary/40" />
                    {chip}
                </button>
            ))}
        </div>
    );
}
