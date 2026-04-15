"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useX402Fetch } from "@/hooks/use-x402-client";
import { Zap, Terminal, Shield, Star, Wallet, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Navbar } from "@/components/Navbar";

export default function AgentPromptPage() {
  const params = useParams();
  const agentId = params.id as string;
  const fetchWithPayment = useX402Fetch();

  const [agent, setAgent] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch the agent on mount
  useEffect(() => {
    async function loadAgent() {
      try {
        const res = await fetch(`/api/agents`);
        const data = await res.json();
        // Finds the matching agent by ID
        const found = data.find((a: any) => a.appId.toString() === agentId);
        if (found) {
          setAgent(found);
        }
      } catch (err) {
        console.error("Failed to load agent", err);
      }
    }
    loadAgent();
  }, [agentId]);

  const handleExecute = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);
    try {
      // The x402Client intercepts 402 responses natively
      const res = await fetchWithPayment("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        // if user cancelled wallet popup or API threw 500
        throw new Error(data.error || "Execution failed");
      }
      setResponse(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-background text-on-surface antialiased overflow-x-hidden selection:bg-primary selection:text-on-primary font-body">
      <Navbar />

      <div className="container mx-auto p-6 md:p-12 max-w-4xl pt-40">
        <h1 className="text-4xl font-headline font-black mb-12 text-white flex items-center gap-4">
          <Terminal className="text-primary" size={32} />
          Interact with Agent
        </h1>
        
        {agent ? (
          <div className="glass p-10 rounded-[2.5rem] border border-white/5 mb-10 group hover:border-primary/30 transition-all ambient-shadow">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white group-hover:text-primary transition-colors">{agent.name}</h2>
                <p className="text-on-surface-variant text-lg leading-relaxed">{agent.description || "Autonomous agent ready for deployment."}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Zap size={32} />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-primary">
                <Shield size={14} />
                {agent.category || 'WORKER'}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
                <Star size={14} className="fill-yellow-500 text-yellow-500" />
                REP: {agent.reputation || 0}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">
                <Wallet size={14} />
                {agent.walletAddress?.slice(0, 10)}...
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-20 animate-pulse text-white/20 font-black uppercase tracking-widest text-sm">
            Detecting Agent Interface...
          </div>
        )}

        <div className="space-y-6">
          <div className="relative group">
            <textarea 
              placeholder="Ask the agent a question or give it a task..."
              className="w-full min-h-[220px] bg-surface-container-low border border-outline-variant/20 rounded-[2rem] p-8 text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none text-xl tracking-tight placeholder:text-white/10"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
            <div className="absolute top-6 right-8 text-white/5 pointer-events-none">
              <Send size={40} />
            </div>
          </div>
          
          <button 
            onClick={handleExecute} 
            disabled={!prompt.trim() || loading || !agent}
            className="w-full bg-primary text-on-primary py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm primary-glow hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Synthesizing Solution...
              </>
            ) : (
              <>
                <Zap size={20} />
                Execute Task (x402 protocol)
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-10 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4 text-red-400 animate-in fade-in slide-in-from-top-4 duration-500">
            <AlertCircle className="flex-shrink-0" size={24} />
            <div className="space-y-1">
              <p className="font-black text-[10px] uppercase tracking-widest">Execution Failure</p>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {response && (
          <div className="mt-10 animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="text-green-400" size={24} />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Agent Transmission Received</h3>
            </div>
            <div className="bg-[#0a0a0b] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              <p className="whitespace-pre-wrap text-white/80 leading-relaxed font-body text-lg italic">
                {response}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
