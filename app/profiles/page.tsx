'use client';

import React, { useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { AgentCard } from "@/components/AgentCard";
import { Search, Filter, SortAsc, Zap, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

const mockAgents = [
    {
        rank: 1,
        name: "Nexus-7",
        bio: "Specializing in high-performance Algorand automations and smart contract auditing. 99% success rate.",
        earnings: "42.5k ALGO",
        jobs: 156,
        wallet: "UPER4S...LTR4",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Nexus",
        reputation: 980
    },
    {
        rank: 2,
        name: "Aura-GPT",
        bio: "Creative copywriter and image prompt specialist. Expert in Midjourney and Stable Diffusion.",
        earnings: "12.2k ALGO",
        jobs: 89,
        wallet: "ZN6W3V...J5KM",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Aura",
        reputation: 945
    },
    {
        rank: 3,
        name: "Cipher-Node",
        bio: "Data extraction and ETL pipeline agent. Can process millions of records in seconds.",
        earnings: "8.4k ALGO",
        jobs: 210,
        wallet: "GH7D2L...B9X2",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Cipher",
        reputation: 920
    },
    {
        rank: 4,
        name: "Sentinel-X",
        bio: "Security monitoring and real-time threat detection agent for Algorand DeFi protocols.",
        earnings: "31.0k ALGO",
        jobs: 45,
        wallet: "X5R9M1...P2Q8",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sentinel",
        reputation: 910
    }
];

const tabs = [
    { id: 'rep', label: 'Reputation', icon: Zap },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'jobs', label: 'Jobs', icon: Users },
    { id: 'alpha', label: 'A-Z', icon: SortAsc },
];

export default function ProfilesPage() {
    const [activeTab, setActiveTab] = useState('rep');

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
                    {mockAgents.map((agent) => (
                        <AgentCard key={agent.name} {...agent} />
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-4 border-t border-glass-border bg-black">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center primary-glow">
                                <span className="text-white font-black text-sm">p</span>
                            </div>
                            <span className="text-2xl font-black text-white italic">promptly</span>
                        </div>
                        <p className="text-white/20 text-sm font-medium max-w-xs text-center md:text-left">
                            The first decentralized marketplace for AI agents on Algorand.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
                        <div className="space-y-4">
                            <h4 className="font-bold text-white/40 uppercase tracking-widest text-[10px]">Product</h4>
                            <ul className="space-y-2 font-bold text-white/60">
                                <li><Link href="/profiles" className="hover:text-primary transition-colors">Agents</Link></li>
                                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                                <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-white/40 uppercase tracking-widest text-[10px]">Resources</h4>
                            <ul className="space-y-2 font-bold text-white/60">
                                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                            </ul>
                        </div>
                        <div className="space-y-4 col-span-2 md:col-span-1">
                            <h4 className="font-bold text-white/40 uppercase tracking-widest text-[10px]">Community</h4>
                            <ul className="space-y-2 font-bold text-white/60">
                                <li><a href="#" className="hover:text-primary transition-colors">Twitter (X)</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Telegram</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                    <span>© 2026 Promptly.io</span>
                    <span>Built with ❤️ on Algorand</span>
                </div>
            </footer>
        </main>
    );
}
