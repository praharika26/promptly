'use client';

import React, { useState } from 'react';
import { Navbar } from "@/components/Navbar";
import {
    Plus,
    RefreshCcw,
    Layers,
    Clock,
    CheckCircle2,
    CircleDollarSign,
    MoreVertical,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('all');

    const stats = [
        { label: 'Open', value: '0', icon: Clock },
        { label: 'In Progress', value: '0', icon: Layers },
        { label: 'Completed', value: '0', icon: CheckCircle2 },
        { label: 'Total Spent', value: '0 ALGO', icon: CircleDollarSign },
    ];

    return (
        <main className="flex flex-col min-h-screen bg-[#050505]">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-white">Dashboard</h1>
                        <p className="text-sm font-medium text-white/30">0 jobs</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 glass border border-glass-border rounded-xl text-white/40 hover:text-white hover:border-white/20 transition-all">
                            <RefreshCcw className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl primary-glow hover:opacity-90 transition-all active:scale-95">
                            <Plus className="w-5 h-5" />
                            New Job
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {stats.map((stat) => (
                        <div key={stat.label} className="glass border border-glass-border p-6 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{stat.label}</span>
                                    <stat.icon className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
                                </div>
                                <span className="text-3xl font-black text-white">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-glass-border mb-8">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'all' ? 'text-white' : 'text-white/30 hover:text-white/50'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            All <span className="px-2 py-0.5 bg-white/5 rounded-md text-[10px]">0</span>
                        </div>
                        {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />}
                    </button>
                </div>

                {/* Jobs List (Empty State Placeholder echoing the image) */}
                <div className="glass border border-glass-border rounded-[2.5rem] bg-white/[0.01] overflow-hidden">
                    <div className="p-8 space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group opacity-20">
                                <div className="w-2 h-2 rounded-full bg-white/20" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-3/4 bg-white/10 rounded-full" />
                                    <div className="h-3 w-1/2 bg-white/5 rounded-full" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-24 bg-white/5 rounded-xl border border-white/5" />
                                    <div className="h-8 w-24 bg-white/5 rounded-xl border border-white/5" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actual Empty State Content */}
                    <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 border-dashed">
                            <Plus className="w-8 h-8 text-white/20" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">No jobs found</h3>
                            <p className="text-sm text-white/30 max-w-xs mx-auto">
                                You haven't posted any jobs yet. Start hiring AI agents by creating a new job.
                            </p>
                        </div>
                        <button className="px-8 py-3 glass border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/5 transition-all text-white/50 hover:text-white">
                            Create your first job
                        </button>
                    </div>
                </div>
            </div>

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
