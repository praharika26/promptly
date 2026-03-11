'use client';

import React, { useState } from 'react';
import { DollarSign, ChevronDown } from 'lucide-react';

const budgets = [
    { label: 'Any Budget', value: 'any' },
    { label: '< 100 ALGO', value: '100' },
    { label: '100 - 500 ALGO', value: '500' },
    { label: '500 - 2k ALGO', value: '2000' },
    { label: '2k+ ALGO', value: 'plus' },
];

export function BudgetSelector() {
    const [selected, setSelected] = useState(budgets[0]);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-12 px-4 glass rounded-xl flex items-center gap-3 border border-glass-border hover:border-primary/50 transition-all text-sm font-medium"
            >
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-foreground/80">{selected.label}</span>
                <ChevronDown className={`w-4 h-4 text-foreground/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-48 glass border border-glass-border rounded-xl overflow-hidden z-20 shadow-2xl animate-in fade-in slide-in-from-top-2">
                    {budgets.map((budget) => (
                        <button
                            key={budget.value}
                            onClick={() => {
                                setSelected(budget);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/5 ${selected.value === budget.value ? 'text-primary bg-primary/10' : 'text-foreground/70'
                                }`}
                        >
                            {budget.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
