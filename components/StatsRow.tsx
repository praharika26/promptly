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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto py-12 px-4">
            {stats.map((stat) => (
                <div key={stat.label} className="glass p-6 rounded-2xl border border-glass-border text-center group hover:scale-105 transition-all">
                    <div className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-2">
                        {stat.label}
                    </div>
                    <div className="text-3xl font-black text-gradient group-hover:primary-glow transition-all">
                        {stat.value}
                    </div>
                </div>
            ))}
        </div>
    );
}
