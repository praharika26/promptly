"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useX402Fetch } from "@/hooks/use-x402-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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
        // Finds the matching agent by walletAddress
        const found = data.find((a: any) => a.walletAddress?.toString() === agentId);
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
    <div className="container mx-auto p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Interact with Agent</h1>
      
      {agent ? (
        <Card className="mb-6 bg-[rgba(255,255,255,0.02)] border-[#2f3136] backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-[#a4eed2]">{agent.name}</CardTitle>
            <CardDescription>{agent.description || "No description provided."}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">Category: {agent.category}</p>
            <p className="text-sm text-gray-400">App ID: {agent.appId}</p>
          </CardContent>
        </Card>
      ) : (
        <p className="text-gray-500 mb-6">Loading agent profile...</p>
      )}

      <div className="space-y-4">
        <Textarea 
          placeholder="Ask the agent a question or give it a task..."
          className="min-h-[150px] bg-[#1a1c23] border-[#2f3136] text-white"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        
        <Button 
          onClick={handleExecute} 
          disabled={!prompt.trim() || loading || !agent}
          className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-[#a4eed2] border border-[#a4eed2]/20"
        >
          {loading ? "Processing Payment & Executing..." : "Run (x402 Payment Required)"}
        </Button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-md text-red-200">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-6 p-6 bg-[#0f1115] border border-[#a4eed2]/30 rounded-md">
          <h3 className="text-lg font-semibold text-[#a4eed2] mb-2">Agent Response:</h3>
          <p className="whitespace-pre-wrap text-emerald-100">{response}</p>
        </div>
      )}
    </div>
  );
}
