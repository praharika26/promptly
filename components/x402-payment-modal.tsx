"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Shield, Wallet, ArrowRight, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface PaymentRequirements {
  scheme: string;
  network: string;
  amount: string;
  asset: string;
  payTo: string;
  maxTimeoutSeconds: number;
  extra?: {
    name: string;
    decimals: number;
    asset: string;
    feePayer: string;
  };
}

interface X402PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirements: PaymentRequirements | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function X402PaymentModal({
  open,
  onOpenChange,
  requirements,
  onConfirm,
  isLoading = false,
  error = null,
}: X402PaymentModalProps) {
  const [step, setStep] = useState<"confirm" | "processing" | "success">("confirm");

  const handleConfirm = async () => {
    setStep("processing");
    try {
      await onConfirm();
      setStep("success");
    } catch (err) {
      setStep("confirm");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep("confirm");
    }
    onOpenChange(newOpen);
  };

  if (!requirements) return null;

  const amountUSDC = parseInt(requirements.amount) / 1e6;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50">
          <div className="bg-[#0a0a0f] border border-primary/30 rounded-3xl overflow-hidden shadow-2xl shadow-primary/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 border-b border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <Shield className="text-primary" size={24} />
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-black text-white uppercase tracking-wider">
                      x402 Payment
                    </Dialog.Title>
                    <Dialog.Description className="text-primary/70 text-xs font-bold uppercase tracking-widest">
                      HTTP 402 Protocol
                    </Dialog.Description>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="p-2 text-white/30 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {step === "confirm" && (
                <>
                  {/* Payment Details */}
                  <div className="space-y-4">
                    <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">
                        Payment Details
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white/50 text-sm">Amount</span>
                          <span className="text-primary font-black text-xl">
                            ${amountUSDC.toFixed(2)} USDC
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/50 text-sm">Asset</span>
                          <span className="text-white font-mono text-sm">
                            USDC (ASA {requirements.asset})
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/50 text-sm">Network</span>
                          <span className="text-white font-mono text-sm">
                            Algorand Testnet
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Worker Address */}
                    <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Wallet className="text-primary" size={16} />
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                          Payment Goes To (Worker)
                        </span>
                      </div>
                      <div className="font-mono text-xs text-white/70 break-all bg-black/30 p-3 rounded-xl">
                        {requirements.payTo}
                      </div>
                    </div>

                    {/* Network Info */}
                    <div className="bg-blue-500/10 rounded-2xl p-4 border border-blue-500/30">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
                        <div className="text-white/60 text-sm">
                          <span className="font-bold text-blue-400">x402 Protocol:</span> Payment will be 
                          sent directly to the worker agent&apos;s wallet after you approve the transaction.
                          This is a real on-chain transfer using Algorand&apos;s atomic transaction groups.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Dialog.Close asChild>
                      <button className="flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-sm text-white/50 border border-outline-variant/20 hover:bg-white/5 transition-all">
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      onClick={handleConfirm}
                      disabled={isLoading}
                      className="flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-sm bg-primary text-on-primary hover:bg-primary-container transition-all primary-glow flex items-center justify-center gap-2"
                    >
                      <ArrowRight size={18} />
                      Pay ${amountUSDC.toFixed(2)} USDC
                    </button>
                  </div>
                </>
              )}

              {step === "processing" && (
                <div className="py-12 text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                  <div className="space-y-2">
                    <p className="text-white font-black text-lg">Processing Payment</p>
                    <p className="text-white/50 text-sm">
                      Please approve the transaction in your wallet...
                    </p>
                  </div>
                </div>
              )}

              {step === "success" && (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="text-primary" size={32} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-black text-xl">Payment Successful!</p>
                    <p className="text-white/50 text-sm">
                      $0.01 USDC sent to worker agent
                    </p>
                    <p className="text-primary/70 text-xs font-mono mt-4">
                      {requirements.payTo.slice(0, 10)}...
                    </p>
                  </div>
                  <Dialog.Close asChild>
                    <button className="mt-4 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm bg-primary text-on-primary hover:bg-primary-container transition-all">
                      Done
                    </button>
                  </Dialog.Close>
                </div>
              )}

              {error && step === "confirm" && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 text-sm font-bold">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-black/30 border-t border-outline-variant/10 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                Powered by x402 Protocol
              </span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}