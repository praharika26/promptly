'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LayoutDashboard, Wallet, Zap, Clock, ChevronRight } from 'lucide-react';
import { useWallet } from '@txnlab/use-wallet-react';

export default function DashboardPage() {
    const { activeAddress } = useWallet();
    const [executions, setExecutions] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalEarnings: '0 ALGO',
        reputation: '0',
        activeTasks: '0'
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!activeAddress) return;
            try {
                const res = await fetch(`/api/executions?address=${activeAddress}`);
                const data = await res.json();
                setExecutions(data);

                // Calculate local stats based on executions
                const earnings = data.reduce((acc: number, curr: any) => acc + (curr.cost || 0), 0) / 1000000;
                setStats({
                    totalEarnings: `${earnings.toFixed(2)} ALGO`,
                    reputation: (data.length * 10).toString(), // Mock reputation based on activity
                    activeTasks: data.filter((ex: any) => ex.status === 'pending').length.toString()
                });
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            }
        };
        fetchData();
    }, [activeAddress]);

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    return (
        <main className="flex flex-col min-h-screen bg-background text-on-surface">
            <Navbar />

            <section className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-20">
                <div className="flex flex-col gap-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="space-y-4">
                            <h1 className="text-6xl font-black text-gradient">Dashboard</h1>
                            <p className="text-white/30 font-bold uppercase tracking-widest text-xs">Manage your agents and track protocol earnings.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="glass px-6 py-4 rounded-3xl border border-white/5 flex flex-col items-end">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Connected Wallet</span>
                                <span className="text-sm font-black text-primary">
                                    {activeAddress ? formatAddress(activeAddress) : 'NOT CONNECTED'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Total Earnings', value: stats.totalEarnings, icon: Wallet, color: 'text-primary' },
                            { label: 'Reputation Score', value: stats.reputation, icon: Zap, color: 'text-yellow-500' },
                            { label: 'Completed Tasks', value: executions.length.toString(), icon: Clock, color: 'text-blue-500' },
                        ].map((stat) => (
                            <div key={stat.label} className="glass p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{stat.label}</span>
                                    <h2 className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.value}</h2>
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
                            <h3 className="text-xl font-black text-white uppercase tracking-widest">Recent Activities</h3>
                            <button className="text-xs font-black text-white/30 hover:text-primary transition-colors flex items-center gap-2">
                                REFRESH <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-10 space-y-4">
                            {executions.length > 0 ? (
                                executions.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-3 h-3 rounded-full ${item.status === 'success' ? 'bg-green-500 primary-glow' : item.status === 'pending' ? 'bg-primary primary-glow' : 'bg-red-500'}`} />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-white uppercase tracking-widest truncate max-w-[200px] md:max-w-md">
                                                    {item.input}
                                                </span>
                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                                    {new Date(item.executedAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-10">
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs font-black text-white">{(item.cost / 1000000).toFixed(3)} ALGO</span>
                                                <span className={`text-[10px] font-black uppercase tracking-tighter ${item.status === 'success' ? 'text-green-500' : 'text-primary'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-primary transition-all" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-sm">No activity recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
