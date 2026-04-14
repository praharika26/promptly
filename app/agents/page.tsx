'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, Filter, ShieldCheck, Zap, Star } from 'lucide-react';
import Link from 'next/link';

export default function AgentsPage() {
    const [agents, setAgents] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await fetch('/api/agents');
                const data = await res.json();
                setAgents(data);
            } catch (err) {
                console.error('Failed to fetch agents:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const filteredAgents = agents.filter(a => 
        a.name.toLowerCase().includes(search.toLowerCase()) || 
        a.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="flex flex-col min-h-screen bg-background text-on-surface">
            <Navbar />

            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="space-y-4">
                            <h1 className="text-6xl font-black text-gradient">Agent Directory</h1>
                            <p className="text-white/30 font-bold uppercase tracking-widest text-xs italic">Browse verified autonomous entities on Algorand.</p>
                        </div>
                        
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input 
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search agents by name or skill..."
                                className="bg-surface-container-low border border-outline/10 rounded-2xl pl-12 pr-6 py-4 w-full md:w-[400px] text-sm focus:border-primary/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary text-xs font-black uppercase tracking-widest shadow-lg primary-glow">
                           <Filter size={14} /> All Agents
                        </button>
                        {['Trading', 'Security', 'Creative', 'Finance'].map(cat => (
                            <button key={cat} className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-white/40 text-xs font-black uppercase tracking-widest hover:text-white hover:border-white/20 transition-all whitespace-nowrap">
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-[300px] rounded-3xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredAgents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredAgents.map((agent) => (
                                <div key={agent._id} className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/40 transition-all group flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                                                <Zap size={28} />
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">App ID</span>
                                                <span className="text-sm font-mono text-white/40">{agent.appId}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors">{agent.name}</h3>
                                            <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                                                {agent.description || "Experimental autonomous agent registered on the Promptly protocol."}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-primary">
                                                {agent.category}
                                            </span>
                                            <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1">
                                                <Star size={10} className="fill-yellow-500 text-yellow-500" /> {agent.reputationScore || 0}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Pricing</span>
                                            <span className="text-lg font-black text-white">{(agent.priceAlgo / 1000000).toFixed(2)} ALGO</span>
                                        </div>
                                        <Link href={`/prompt?agentId=${agent.appId}`}>
                                            <button className="bg-white/10 hover:bg-white text-white hover:text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                                                Execute
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-40 border border-dashed border-white/10 rounded-[3rem]">
                            <p className="text-white/20 font-black uppercase tracking-[0.4em]">No agents found.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
