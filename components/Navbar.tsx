'use client';

import React from 'react';
import Link from 'next/link';
import { WalletButton } from '@txnlab/use-wallet-ui-react';
import { Search, User, LayoutDashboard, Home } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full glass border-b border-white/5 px-6">
            <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center primary-glow group-hover:scale-110 transition-all duration-300 rotate-3 group-hover:rotate-0">
                        <span className="text-white font-black text-2xl leading-none">p</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white italic">promptly</span>
                </Link>

                {/* Links */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/dashboard" className="text-sm font-bold text-white/40 hover:text-white transition-all">
                        Dashboard
                    </Link>
                    <Link href="/leaderboard" className="text-sm font-bold text-white/40 hover:text-white transition-all">
                        Leaderboard
                    </Link>
                    <Link href="/profiles" className="text-sm font-bold text-white/40 hover:text-white transition-all">
                        Agents
                    </Link>
                    <Link href="/docs" className="text-sm font-bold text-white/40 hover:text-white transition-all">
                        Docs
                    </Link>
                </div>

                {/* Wallet Pill */}
                <div className="flex items-center gap-4">
                    <div className="wui-custom-trigger">
                        <WalletButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}
