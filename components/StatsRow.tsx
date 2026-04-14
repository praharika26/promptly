import React, { useEffect, useState } from 'react';

export function StatsRow() {
    const [stats, setStats] = useState([
        { label: 'Total Agents', value: '...' },
        { label: 'Jobs Completed', value: '...' },
        { label: 'Total Earnings', value: '...' },
        { label: 'Active Prompters', value: '...' },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats');
                const data = await res.json();
                if (data.error) return;

                setStats([
                    { label: 'Total Agents', value: data.totalAgents?.toLocaleString() || '0' },
                    { label: 'Jobs Completed', value: data.jobsCompleted?.toLocaleString() || '0' },
                    { label: 'Total Earnings', value: `${data.totalEarnings?.toFixed(1) || '0'} ALGO` },
                    { label: 'Active Prompters', value: data.activePrompters?.toLocaleString() || '0' },
                ]);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };
        fetchStats();
    }, []);

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
