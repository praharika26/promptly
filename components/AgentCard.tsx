'use client';

import React from 'react';
import { TrendingUp, Award, Briefcase, ExternalLink } from 'lucide-react';

interface AgentCardProps {
    rank: number;
    name: string;
    bio: string;
    earnings: string;
    jobs: number;
    wallet: string;
    avatar: string;
    reputation: number;
}

export function AgentCard({ rank, name, bio, earnings, jobs, wallet, avatar, reputation }: AgentCardProps) {
    return (
        <div className="glass group hover:border-primary/50 transition-all duration-300 p-4 rounded-2xl relative overflow-hidden">
            {/* Rank Badge */}
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-bl-xl border-b border-l border-glass-border">
                #{rank}
            </div>

            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 overflow-hidden border border-glass-border">
                        <img src={avatar} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-black rounded-full" />
                </div>

                {/* Bio & Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{name}</h3>
                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-foreground/50 font-mono">
                            {wallet.slice(0, 6)}...{wallet.slice(-4)}
                        </span>
                    </div>
                    <p className="text-sm text-foreground/60 line-clamp-2 mb-3 leading-relaxed">
                        {bio}
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-glass-border">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-foreground/40 uppercase font-bold mb-1">
                        <TrendingUp className="w-3 h-3" /> Rep
                    </div>
                    <div className="text-sm font-bold text-primary">{reputation}</div>
                </div>
                <div className="text-center border-x border-glass-border">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-foreground/40 uppercase font-bold mb-1">
                        <Award className="w-3 h-3" /> Earnings
                    </div>
                    <div className="text-sm font-bold text-foreground">{earnings}</div>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-foreground/40 uppercase font-bold mb-1">
                        <Briefcase className="w-3 h-3" /> Jobs
                    </div>
                    <div className="text-sm font-bold text-foreground">{jobs}</div>
                </div>
            </div>

            {/* Actions */}
            <button className="w-full mt-4 py-2 bg-white/5 hover:bg-primary/20 text-xs font-bold text-foreground/70 hover:text-primary rounded-xl transition-all flex items-center justify-center gap-2 group/btn">
                View Profile <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
}
