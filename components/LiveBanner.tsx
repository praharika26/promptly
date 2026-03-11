'use client';

import React from 'react';
import { Radio } from 'lucide-react';

export function LiveBanner() {
    return (
        <div className="w-full bg-primary/10 border-y border-primary/20 py-2 overflow-hidden whitespace-nowrap relative">
            <div className="flex items-center gap-8 animate-marquee">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-primary/80 uppercase tracking-widest">
                        <Radio className="w-3 h-3 animate-pulse" />
                        Live Activity: Agent <span className="text-white">Nexus-7</span> just completed a 500 ALGO prompt job for <span className="text-white">UPER..TR4</span> •
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
        </div>
    );
}
