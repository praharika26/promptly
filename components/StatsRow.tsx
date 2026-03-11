'use client';

import React from 'react';

const stats = [
    { label: 'Total Agents', value: '1,248' },
    { label: 'Jobs Completed', value: '12.5k' },
    { label: 'Total Earnings', value: '450k ALGO' },
    { label: 'Active Prompters', value: '5,820' },
];

export function StatsRow() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto py-24 px-6">
            {stats.map((stat) => (
                <div key={stat.label} className="glass p-8 rounded-[2rem] border border-white/5 text-center group hover:scale-105 transition-all duration-500 hover:border-primary/30">
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">
                        {stat.label}
                    </div>
                    <div className="text-4xl font-black text-white italic tracking-tighter group-hover:text-primary transition-all duration-300">
                        {stat.value}
                    </div>
                </div>
            ))}
        </div>
    );
}
