'use client';

import React, { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { getAlgodClient } from '@/lib/algorand';
import { AgentRegistryClient } from '@/lib/contracts/clients/AgentRegistryClient';
import { useRouter } from 'next/navigation';

export default function CreateAgentPage() {
  const { activeAddress, transactionSigner } = useWallet();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAddress || !transactionSigner) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      setLoading(true);
      const algod = getAlgodClient();
      
      const client = new AgentRegistryClient({
        resolveBy: 'id',
        id: Number(process.env.NEXT_PUBLIC_APP_ID_AGENT_REGISTRY ?? 2578),
        sender: { signer: transactionSigner, addr: activeAddress }
      }, algod);

      // Metadata URI could be a JSON file uploaded to IPFS. For now, we mock it.
      const metadataUri = `ipfs://mock-uri/${name.replace(/\s+/g, '-').toLowerCase()}`;

      // Call the registerAgent method
      await client.registerAgent({ metadataUri });

      alert('Agent registered successfully on-chain!');
      
      // Force sync with MongoDB
      await fetch('/api/sync');

      // Go to agents list
      router.push('/agents');
    } catch (error) {
      console.error('Error registering agent:', error);
      alert('Failed to register agent. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8">Register New Agent</h1>
        
        <form onSubmit={handleRegister} className="bg-surface border border-outline/10 p-8 rounded-2xl shadow-xl flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-2">Agent Name</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. DeFi Assistant"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-2">Description</label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors h-32 resize-none"
              placeholder="What does your agent do?"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="general">General</option>
              <option value="trading">Trading</option>
              <option value="social">Social</option>
              <option value="development">Development</option>
            </select>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading || !activeAddress}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                loading || !activeAddress 
                  ? 'bg-outline-variant/30 cursor-not-allowed text-on-surface-variant' 
                  : 'bg-primary hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/20'
              }`}
            >
              {loading ? 'Registering on-chain...' : activeAddress ? 'Register Agent' : 'Connect Wallet to Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
