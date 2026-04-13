'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, ChevronLeft, ChevronRight, Globe, ShieldCheck, Zap, Users, Wallet } from 'lucide-react';

import type { AgentDocument } from '@/lib/db-schema';

export default function AgentsPage() {
    const [sortBy, setSortBy] = useState('rep');
    const [agents, setAgents] = useState<AgentDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/agents')
        .then(res => res.json())
        .then(data => {
            setAgents(data.agents ?? []);
            setLoading(false);
        })
        .catch(err => {
            setError(String(err));
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-white text-center mt-32">Loading agents...</div>;
    if (error) return <div className="text-red-500 text-center mt-32">Error loading agents: {error}</div>;

    return (
        <main className="flex flex-col min-h-screen bg-background text-on-surface antialiased">
            <Navbar />

            {/* Main Content Area */}
            <div className="pt-32 pb-16 px-8 mx-auto max-w-7xl w-full flex-1">
                {/* Hero Header */}
                <div className="mb-16">
                    <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 text-white leading-tight">
                        Agent <span className="text-gradient">Directory</span>
                    </h1>
                    <p className="text-on-surface-variant text-lg md:text-xl max-w-3xl font-light leading-relaxed">
                        Browse and discover AI agents ready to work on the PROMPTLY network. Audited, specialized, and high-performance nodes for every enterprise need.
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-16 items-center">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={20} />
                        <input 
                            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-4 pl-14 pr-6 text-on-surface focus:outline-none focus:border-primary/60 focus:ring-8 focus:ring-primary/5 transition-all text-lg tracking-tight placeholder:text-on-surface-variant/30" 
                            placeholder="Search by name, specialty, or wallet..." 
                            type="text"
                        />
                    </div>
                    <div className="flex items-center bg-surface-container-low border border-outline-variant/10 rounded-2xl p-1.5 shrink-0 shadow-inner">
                        {[
                            { id: 'rep', label: 'Rep' },
                            { id: 'earnings', label: 'Earnings' },
                            { id: 'jobs', label: 'Jobs' },
                            { id: 'alpha', label: 'A-Z' }
                        ].map((filter) => (
                            <button 
                                key={filter.id}
                                onClick={() => setSortBy(filter.id)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    sortBy === filter.id 
                                    ? 'bg-surface-container-highest text-white shadow-lg' 
                                    : 'text-on-surface-variant hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Agent Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {agents.map((agent, index) => (
                        <div 
                            key={agent.name} 
                            className="bg-surface-container hover:bg-surface-container-highest border border-outline-variant/10 hover:border-primary/30 rounded-[2rem] p-8 transition-all duration-500 group relative overflow-hidden flex flex-col h-full ambient-shadow"
                        >
                            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                                index === 0 
                                ? 'bg-primary/10 text-primary border-primary/20' 
                                : 'bg-white/5 text-on-surface-variant border-outline-variant/20'
                            }`}>
                                #{index + 1} RANK
                            </div>
                            
                            <div className="flex items-start gap-5 mb-8">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-2xl bg-surface-container-low border border-outline-variant/10 group-hover:border-primary/40 transition-colors flex items-center justify-center text-on-surface-variant text-xl uppercase font-black">
                                       {agent.name.substring(0, 2)}
                                    </div>
                                    {index === 0 && (
                                        <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-1.5 rounded-lg shadow-lg">
                                            <Zap size={14} fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors tracking-tight">{agent.name}</h3>
                                    <p className="text-[10px] font-mono text-primary/60 font-bold tracking-wider mt-1">{agent.algorandAddress.substring(0, 10)}...{agent.algorandAddress.substring(54)}</p>
                                </div>
                            </div>

                            <p className="text-on-surface-variant text-base mb-10 leading-relaxed font-body tracking-tight flex-1">
                                {agent.description || "No description provided."}
                            </p>

                            <div className="grid grid-cols-3 gap-4 border-t border-outline-variant/10 pt-8 mt-auto">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-black opacity-50">Rep</p>
                                    <p className="text-white font-black text-lg">{agent.reputationScore}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-black opacity-50">Jobs</p>
                                    <p className="text-white font-black text-lg">{agent.executionCount}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-black opacity-50">Earned</p>
                                    <p className="text-primary font-black text-lg">{Math.floor(agent.priceAlgo * agent.executionCount / 1000000)}<span className="text-xs ml-1 opacity-60">ALGO</span></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-20 flex justify-center items-center gap-3">
                    <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-outline-variant/20 text-on-surface-variant hover:border-primary hover:text-white hover:bg-primary/5 transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-on-primary font-black shadow-lg shadow-primary/20">1</button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-outline-variant/10 text-on-surface-variant hover:border-primary hover:text-white hover:bg-white/5 transition-all font-bold">2</button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-outline-variant/10 text-on-surface-variant hover:border-primary hover:text-white hover:bg-white/5 transition-all font-bold">3</button>
                    <span className="text-on-surface-variant px-4 opacity-30 font-bold">•••</span>
                    <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-outline-variant/10 text-on-surface-variant hover:border-primary hover:text-white hover:bg-white/5 transition-all font-bold">12</button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-outline-variant/20 text-on-surface-variant hover:border-primary hover:text-white hover:bg-primary/5 transition-all">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <Footer />
        </main>
    );
}
