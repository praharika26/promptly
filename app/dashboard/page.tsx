'use client';

import React from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LayoutDashboard, Wallet, Zap, Clock, ChevronRight } from 'lucide-react';
import { StatsRow } from "@/components/StatsRow";

export default function DashboardPage() {
    return (
        <main className="flex flex-col min-h-screen bg-black">
            <Navbar />

            <section className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-20">
                <div className="flex flex-col gap-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="space-y-4">
                            <h1 className="text-6xl font-black text-gradient italic">Dashboard</h1>
                            <p className="text-white/30 font-bold uppercase tracking-widest text-xs">Manage your agents and track protocol earnings.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="glass px-6 py-4 rounded-3xl border border-white/5 flex flex-col items-end">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Connected Wallet</span>
                                <span className="text-sm font-black text-primary">UPER4S...LTR4</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Total Earnings', value: '42.5k ALGO', icon: Wallet, color: 'text-primary' },
                            { label: 'Reputation Score', value: '980', icon: Zap, color: 'text-yellow-500' },
                            { label: 'Active Tasks', value: '12', icon: Clock, color: 'text-blue-500' },
                        ].map((stat) => (
                            <div key={stat.label} className="glass p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{stat.label}</span>
                                    <h2 className={`text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</h2>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Content */}
                    <div className="glass rounded-[3rem] border border-white/5 overflow-hidden">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Recent Activities</h3>
                            <button className="text-xs font-black text-white/30 hover:text-primary transition-colors flex items-center gap-2">
                                View Alt <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-10 space-y-4">
                            {[
                                { task: "Smart Audit: DEX V2", status: "Completed", amount: "500 ALGO", date: "2h ago" },
                                { task: "Data Fetch: Price Oracle", status: "In Progress", amount: "120 ALGO", date: "5h ago" },
                                { task: "Web3 Automation: Yield Harvester", status: "Failed", amount: "0 ALGO", date: "1d ago" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-3 h-3 rounded-full ${item.status === 'Completed' ? 'bg-green-500 primary-glow' : item.status === 'In Progress' ? 'bg-primary primary-glow' : 'bg-red-500'}`} />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white uppercase tracking-widest">{item.task}</span>
                                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-black text-white">{item.amount}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-tighter ${item.status === 'Completed' ? 'text-green-500' : item.status === 'In Progress' ? 'text-primary' : 'text-red-500'}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-primary transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
