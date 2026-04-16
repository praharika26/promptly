'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LayoutDashboard, Wallet, Zap, Clock, ChevronRight, ExternalLink } from 'lucide-react';
import { useWallet } from '@txnlab/use-wallet-react';

export default function DashboardPage() {
    const { activeAddress } = useWallet();
    const [viewMode, setViewMode] = useState<'user' | 'agent'>('user');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        primary: { label: 'Total Spent', value: '0 ALGO', icon: Wallet, color: 'text-primary' },
        secondary: { label: 'Active Tasks', value: '0', icon: Clock, color: 'text-blue-500' },
        tertiary: { label: 'Success Rate', value: '100%', icon: Zap, color: 'text-yellow-500' }
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (viewMode === 'user') {
                    // Fetch jobs requested by the user
                    const url = activeAddress ? `/api/jobs?address=${activeAddress}` : '/api/jobs';
                    const res = await fetch(url);
                    const json = await res.json();
                    const jobs = json.jobs || [];
                    setData(jobs);

                    const spent = jobs.reduce((acc: number, curr: any) => acc + (curr.budget || 0.01), 0);
                    setStats({
                        primary: { label: 'Total Spent', value: `${spent.toFixed(2)} ALGO`, icon: Wallet, color: 'text-primary' },
                        secondary: { label: 'Active Requests', value: jobs.filter((j: any) => j.status === 'OPEN').length.toString(), icon: Clock, color: 'text-blue-500' },
                        tertiary: { label: 'Completed', value: jobs.filter((j: any) => j.status === 'COMPLETED').length.toString(), icon: Zap, color: 'text-yellow-500' }
                    });
                } else {
                    // Fetch executions (earnings)
                    const url = activeAddress ? `/api/executions?address=${activeAddress}` : '/api/executions';
                    const res = await fetch(url);
                    const executions = await res.json();
                    setData(executions);

                    const earnings = executions.reduce((acc: number, curr: any) => acc + (curr.cost || 0), 0) / 1000000;
                    setStats({
                        primary: { label: 'Total Earnings', value: `${earnings.toFixed(2)} ALGO`, icon: Wallet, color: 'text-primary' },
                        secondary: { label: 'Reputation', value: (executions.length * 105).toString(), icon: Zap, color: 'text-yellow-500' },
                        tertiary: { label: 'Tasks Fulfilled', value: executions.length.toString(), icon: Clock, color: 'text-blue-500' }
                    });
                }
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeAddress, viewMode]);

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
                            <p className="text-white/30 font-bold uppercase tracking-widest text-xs">Manage your autonomous operations and track protocol history.</p>
                        </div>

                        <div className="flex flex-col items-end gap-4">
                            <div className="glass px-6 py-4 rounded-3xl border border-white/5 flex flex-col items-end">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Protocol Identity</span>
                                <span className="text-sm font-black text-primary">
                                    {activeAddress ? formatAddress(activeAddress) : 'NOT CONNECTED'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* View Switcher */}
                    <div className="flex justify-start">
                        <div className="bg-surface-container-low p-1.5 rounded-2xl border border-white/5 flex items-center">
                            <button 
                                onClick={() => setViewMode('user')}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    viewMode === 'user' 
                                    ? 'bg-primary text-on-primary shadow-lg primary-glow' 
                                    : 'text-white/40 hover:text-white'
                                }`}
                            >
                                User Activity
                            </button>
                            <button 
                                onClick={() => setViewMode('agent')}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    viewMode === 'agent' 
                                    ? 'bg-primary text-on-primary shadow-lg primary-glow' 
                                    : 'text-white/40 hover:text-white'
                                }`}
                            >
                                Agent Performance
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[stats.primary, stats.secondary, stats.tertiary].map((stat) => (
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

                    {/* Content Feed */}
                    <div className="glass rounded-[3rem] border border-white/5 overflow-hidden min-h-[400px]">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-black text-white uppercase tracking-widest">
                                {viewMode === 'user' ? 'My Request History' : 'Protocol Earnings Feed'}
                            </h3>
                            <button 
                                onClick={() => window.location.reload()}
                                className="text-xs font-black text-white/30 hover:text-primary transition-colors flex items-center gap-2"
                            >
                                REFRESH <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-10 space-y-6">
                            {loading ? (
                                [1, 2, 3].map(i => <div key={i} className="h-32 rounded-3xl bg-white/5 animate-pulse" />)
                            ) : data.length > 0 ? (
                                data.map((item, i) => (
                                    <div key={i} className="flex flex-col gap-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.status === 'COMPLETED' || item.status === 'success' ? 'bg-green-500' : 'bg-primary'}`} />
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/5`}>
                                                    <Zap size={18} className={item.status === 'COMPLETED' || item.status === 'success' ? 'text-green-500' : 'text-primary'} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{viewMode === 'user' ? 'Job ID' : 'Transaction ID'}</span>
                                                    {viewMode === 'agent' ? (
                                                        <a 
                                                            href={`https://lora.algokit.io/testnet/transaction/${item.txId}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-mono text-white/60 hover:text-primary transition-colors flex items-center gap-2 group/tx"
                                                        >
                                                            {item.txId?.slice(0, 16)}...{item.txId?.slice(-8)}
                                                            <ExternalLink size={10} className="opacity-0 group-hover/tx:opacity-100 transition-opacity" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs font-mono text-white/60">{item._id?.slice(0, 18)}...</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block mb-1">Created At</span>
                                                <span className="text-xs font-bold text-white/40">{new Date(item.createdAt || item.executedAt).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{viewMode === 'user' ? 'My Prompt' : 'User Input'}</span>
                                                </div>
                                                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-sm text-white/80 font-medium leading-relaxed italic">
                                                    "{item.prompt || item.input}"
                                                </div>
                                            </div>
                                            {(item.result || item.output) && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Agent Response</span>
                                                    </div>
                                                    <div className="bg-green-500/5 p-5 rounded-2xl border border-green-500/10 text-sm text-green-100/70 font-mono leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                                                        {item.result || item.output}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-4">
                                                <span className="px-3 py-1 bg-white/5 rounded-lg font-black text-white/30 uppercase tracking-widest">
                                                    Status
                                                </span>
                                                <span className={`px-3 py-1 rounded-lg font-black uppercase tracking-widest ${item.status === 'COMPLETED' || item.status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary animate-pulse'}`}>
                                                    ● {item.status}
                                                </span>
                                            </div>
                                            <div className="font-black text-white">
                                                <span className="text-white/20 mr-2">{viewMode === 'user' ? 'BUDGET:' : 'FEE EARNED:'}</span>
                                                {viewMode === 'user' ? (item.budget || 0.01).toFixed(2) : (item.cost / 1000000).toFixed(3)} ALGO
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-40 border border-dashed border-white/5 rounded-[3rem]">
                                    <p className="text-white/20 font-black uppercase tracking-[0.4em] text-sm mb-4">No data found in this category.</p>
                                    {!activeAddress ? (
                                        <p className="text-primary text-[10px] uppercase font-black tracking-widest shadow-sm">Connect your wallet to see your operations.</p>
                                    ) : (
                                        <p className="text-white/10 text-[10px] uppercase tracking-widest">Start generating prompts on the home page to see results here.</p>
                                    )}
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
