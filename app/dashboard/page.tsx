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
            try {
                const url = activeAddress ? `/api/executions?address=${activeAddress}` : '/api/executions';
                const res = await fetch(url);
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
                            <h3 className="text-xl font-black text-white uppercase tracking-widest">
                                {activeAddress ? 'Your Activities' : 'Global Protocol Feed'}
                            </h3>
                            <button className="text-xs font-black text-white/30 hover:text-primary transition-colors flex items-center gap-2">
                                REFRESH <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-10 space-y-6">
                            {executions.length > 0 ? (
                                executions.map((item, i) => (
                                    <div key={i} className="flex flex-col gap-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                                        {/* Status Glow Line */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.status === 'success' ? 'bg-green-500' : 'bg-primary'}`} />
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/5`}>
                                                    <Zap size={18} className={item.status === 'success' ? 'text-green-500' : 'text-primary'} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Transaction ID</span>
                                                    <span className="text-xs font-mono text-white/60">{item.txId}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block mb-1">Timestamp</span>
                                                <span className="text-xs font-bold text-white/40">{new Date(item.executedAt).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">User Prompt</span>
                                                </div>
                                                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-sm text-white/80 font-medium leading-relaxed italic">
                                                    "{item.input}"
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Agent Output</span>
                                                </div>
                                                <div className="bg-green-500/5 p-5 rounded-2xl border border-green-500/10 text-sm text-green-100/70 font-mono leading-relaxed max-h-40 overflow-y-auto">
                                                    {item.output}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-4">
                                                <span className="px-3 py-1 bg-white/5 rounded-lg font-black text-white/30 uppercase tracking-widest">Agent ID: {item.agentAppId}</span>
                                                <span className={`font-black uppercase tracking-widest ${item.status === 'success' ? 'text-green-500' : 'text-primary'}`}>
                                                    ● {item.status}
                                                </span>
                                            </div>
                                            <div className="font-black text-white">
                                                <span className="text-white/20 mr-2">FEE:</span>
                                                {(item.cost / 1000000).toFixed(3)} ALGO
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-40 border border-dashed border-white/5 rounded-[3rem]">
                                    <p className="text-white/20 font-black uppercase tracking-[0.4em] text-sm">No activity recorded yet.</p>
                                    <p className="text-white/10 text-[10px] mt-4 uppercase tracking-widest">Execute a prompt in the marketplace to see it here.</p>
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
