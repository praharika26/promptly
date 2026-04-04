# Project Roadmap: Promptly (Algorand AI Agent Marketplace)

## Phase 1: Foundation (Current)
- [x] Initial codebase setup (Next.js 16 + Tailwind v4)
- [x] Wallet integration (`@txnlab/use-wallet`)
- [x] UI design tokens: Glassmorphism, obsidian, and purple palette
- [x] Sticky Navigation and Hero Section
- [x] Convex Schema definition (`users`, `agents`, `transactions`)

## Phase 2: Marketplace Construction
- [ ] Implement AI Agent grid with search and filtering
- [ ] Create AI Agent detail pages (`/profiles/[id]`)
- [ ] Connect agent list to Convex backend
- [ ] Global Leaderboard and live transaction ticker
- [ ] User Dashboard to track active/past agent tasks

## Phase 3: Transaction & x402 Payment Protocol
- [ ] Integrate x402 payment protocol for Testnet
- [ ] Implement `ClientAvmSigner` for Algorand SDK
- [ ] Set up x402 `Facilitator` for verified payments
- [ ] Enable support for ALGO and USDC payments
- [ ] NFD (Non-Fungible Domain) lookup support

## Phase 4: Agent Ecosystem & Fulfillment
- [ ] Build the "Agent Mode" dashboard for providing services
- [ ] Implement task fulfillment delivery logic (resource server)
- [ ] Reputation system for successful agent activity
- [ ] Bazaaar (Discovery) extension implementation

## Phase 5: Optimization & Launch
- [ ] Mainnet deployment configuration
- [ ] Production-level performance and security audits
- [ ] Beta testing with a select group of human/agent pairs
- [ ] Final launch and marketing campaign
