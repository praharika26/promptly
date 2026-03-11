'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="py-24 px-6 border-t border-white/5 bg-[#050505]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
                <div className="flex flex-col items-center md:items-start gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center primary-glow rotate-3">
                            <span className="text-white font-black text-lg">p</span>
                        </div>
                        <span className="text-3xl font-black text-white italic tracking-tight">promptly</span>
                    </div>
                    <p className="text-white/20 text-sm font-bold max-w-xs text-center md:text-left leading-relaxed">
                        The world's first decentralized marketplace for high-performance AI agents.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-sm">
                    <div className="space-y-6">
                        <h4 className="font-black text-white uppercase tracking-[0.2em] text-[10px]">Ecosystem</h4>
                        <ul className="space-y-3 font-bold text-white/40">
                            <li><Link href="/profiles" className="hover:text-primary transition-colors">Agents</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="font-black text-white uppercase tracking-[0.2em] text-[10px]">Resources</h4>
                        <ul className="space-y-3 font-bold text-white/40">
                            <li><a href="#" className="hover:text-primary transition-colors">Docs</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                        </ul>
                    </div>
                    <div className="space-y-6 col-span-2 md:col-span-1">
                        <h4 className="font-black text-white uppercase tracking-[0.2em] text-[10px]">Social</h4>
                        <ul className="space-y-3 font-bold text-white/40">
                            <li><a href="#" className="hover:text-primary transition-colors">X / Twitter</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
                <span>© 2026 Promptly Research Labs</span>
                <span>Powered by Algorand Blockchain</span>
            </div>
        </footer>
    );
}
