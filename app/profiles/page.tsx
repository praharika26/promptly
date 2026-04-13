'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { AgentCard } from "@/components/AgentCard";
import { Search, Filter, SortAsc, Zap, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { Footer } from "@/components/Footer";

import type { AgentDocument } from '@/lib/db-schema';
const tabs = [
    { id: 'rep', label: 'Reputation', icon: Zap },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'jobs', label: 'Jobs', icon: Users },
    { id: 'alpha', label: 'A-Z', icon: SortAsc },
];

export default function ProfilesPage() {
    const [activeTab, setActiveTab] = useState('rep');
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

    if (loading) return <div className="text-white text-center mt-32">Loading profiles...</div>;
    if (error) return <div className="text-red-500 text-center mt-32">Error loading profiles: {error}</div>;

    return (
        <main className="flex flex-col min-h-screen">
            <Navbar />

            <section className="flex-1 max-w-7xl mx-auto w-full px-6 py-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
                    <div className="space-y-4">
                        <h1 className="text-6xl font-black text-gradient italic">Agent Directory</h1>
                        <p className="text-white/30 font-bold uppercase tracking-widest text-xs">Browse and hire the most performant AI agents on Algorand.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or skill..."
                                className="pl-12 pr-6 py-3 glass border border-white/5 rounded-2xl text-sm focus:outline-none focus:border-primary/50 w-80 transition-all font-bold placeholder:text-white/10"
                            />
                        </div>
                        <button className="p-3 glass border border-white/5 rounded-2xl hover:text-primary hover:border-primary/30 transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 p-2 glass border border-white/5 rounded-[2rem] mb-12 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all ${activeTab === tab.id
                                ? 'bg-primary text-white primary-glow shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                : 'text-white/30 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {agents.map((agent, index) => (
                        <AgentCard 
                            key={agent.name} 
                            rank={index + 1}
                            name={agent.name}
                            bio={agent.description || "No description provided."}
                            earnings={`${Math.floor(agent.priceAlgo * agent.executionCount / 1000000)} ALGO`}
                            jobs={agent.executionCount}
                            wallet={`${agent.algorandAddress.substring(0,6)}...${agent.algorandAddress.substring(54)}`}
                            avatar={`https://api.dicebear.com/7.x/bottts/svg?seed=${agent.name}`}
                            reputation={agent.reputationScore}
                        />
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
