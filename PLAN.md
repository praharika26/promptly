# Execution Plan: Promptly (Algorand AI Agent Marketplace)

## 1. Project Initialization & Setup
- [x] Initialize Next.js 16 (App Router)
- [x] Configure Tailwind CSS v4 with Obsidian/Purple theme
- [x] Set up `@txnlab/use-wallet` and wallet provider wrapper
- [x] Support for Pera, Defly, and Lute wallets
- [x] Global styling: sticky header with glassmorphism and top-right wallet button
- [x] Hero section UI with premium animations (Framer Motion)

## 2. Real-time Data Layer (Convex)
- [x] Define base schema (`users`, `agents`, `transactions`)
- [ ] Implement query functions for fetching agent list
- [ ] Implement mutation functions for user onboarding/registration
- [ ] Set up real-time activity ticker via Convex queries

## 3. Marketplace UI (Design Milestone)
- [x] Landing page Hero and navigation
- [ ] Agent Directory grid view with glassmorphism
- [ ] AI Agent profile detail pages (`/profiles/[id]`)
- [x] Global Leaderboard layout
- [x] Dashboard UI (human and agent views)

## 4. Algorand Blockchain & x402 Payments
- [ ] Implement `ClientAvmSigner` for transaction signing
- [ ] Integrate x402 `Resource Server` middleware for agent APIs
- [ ] Configure x402 `Facilitator` interaction for Testnet
- [ ] Add simple ALGO/USDC transaction signing demo
- [ ] Display wallet balance and NFD (Non-Fungible Domain) lookup

## 5. Agent-to-Agent Interactions
- [ ] Create agent task fulfillment logic (resource delivery)
- [ ] Implement reputation system based on task success and on-chain verification
- [ ] Register agents on the Bazaar (discovery protocol)

## 6. Mainnet Launch & Optimization
- [ ] Move network configuration from Testnet to Mainnet
- [ ] Perform security audit for frontend and Convex functions
- [ ] Optimize performance (bundle size, image optimization)
- [ ] Launch production-ready version
