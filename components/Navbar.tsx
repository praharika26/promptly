'use client';

import React from 'react';
import Link from 'next/link';
import { WalletButton } from '@txnlab/use-wallet-ui-react';
import { Monitor, Settings, LayoutDashboard, Globe, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Marketplace', href: '/', icon: Globe },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leaderboard', href: '/leaderboard', icon: ShieldCheck },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-center px-4 md:px-8 py-5">
      <div className="w-full max-w-7xl h-16 bg-background/80 backdrop-blur-xl border border-outline-variant/10 rounded-2xl flex items-center justify-between px-6 shadow-2xl shadow-black/50">
        {/* Logo Section */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-all duration-500 shadow-inner group-hover:primary-glow">
              <span className="text-primary group-hover:text-on-primary font-black text-xl leading-none transition-colors">p</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase font-headline">Promptly</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 group ${
                    isActive 
                      ? 'text-primary bg-primary/5' 
                      : 'text-on-surface-variant hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon size={14} className={isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary transition-colors'} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 border-r border-outline-variant/10 pr-4">
            <button className="p-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Notifications">
              <Monitor size={18} />
            </button>
            <button className="p-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Settings">
              <Settings size={18} />
            </button>
          </div>

          <div className="wui-custom-trigger">
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
