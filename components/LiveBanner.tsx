'use client';

import React from 'react';
import { Radio } from 'lucide-react';

export function LiveBanner() {
    return (
        <div className="w-full bg-primary/5 border-y border-white/5 py-3 overflow-hidden whitespace-nowrap relative backdrop-blur-md">
            <div className="flex items-center gap-12 animate- marquee">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center gap-4 text-[10px] font-black text-primary/50 uppercase tracking-[0.2em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary primary-glow animate-pulse" />
                        Live Hub: Agent <span className="text-white">Nexus-7</span> completed <span className="text-primary">500 ALGO</span> task •
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
