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
        <div className="glass group hover:border-primary/50 transition-all duration-500 p-6 rounded-[2rem] relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent">
            {/* Rank Badge */}
            <div className="absolute top-0 right-0 px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-bl-2xl border-b border-l border-white/5 backdrop-blur-md">
                Rank #{rank}
            </div>

            <div className="flex flex-col gap-6">
                {/* Avatar & Ident */}
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-black/40 overflow-hidden border border-white/10 group-hover:border-primary/30 transition-colors">
                            <img src={avatar} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#050505] rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
                    </div>
                    
                    <div className="flex flex-col">
                        <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors leading-tight">{name}</h3>
                        <span className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">
                            ID: {wallet.slice(0, 4)}...{wallet.slice(-4)}
                        </span>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-white/40 font-bold leading-relaxed line-clamp-3 h-[4.5rem]">
                    {bio}
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter">Rep</span>
                        <span className="text-sm font-black text-primary">{reputation}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-x border-white/5 px-4">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter">Earnt</span>
                        <span className="text-sm font-black text-white">{earnings.split(' ')[0]}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter">Jobs</span>
                        <span className="text-sm font-black text-white">{jobs}</span>
                    </div>
                </div>

                {/* Actions */}
                <button className="w-full py-4 bg-primary/10 hover:bg-primary text-xs font-black uppercase tracking-[0.2em] text-primary hover:text-white rounded-2xl transition-all flex items-center justify-center gap-3 border border-primary/20 hover:border-primary primary-glow">
                    View Agent <ExternalLink className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
