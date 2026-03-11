'use client';

import React from 'react';
import Link from 'next/link';
import { WalletButton } from '@txnlab/use-wallet-ui-react';
import { Search, User, LayoutDashboard, Home } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full glass border-b border-glass-border">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center primary-glow group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-xl leading-none">P</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white italic">promptly</span>
                </Link>

                {/* Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/dashboard" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-2">
                        Dashboard
                    </Link>
                    <Link href="/leaderboard" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-2">
                        Leaderboard
                    </Link>
                    <Link href="/profiles" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-2">
                        Agents
                    </Link>
                    <Link href="/docs" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-2">
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
