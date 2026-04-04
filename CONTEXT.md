# Context Checkpoint: Promptly (Algorand AI Agent Marketplace)

**Current Status:** Phase 1 (Foundation & UI) complete.
**Current Date:** 2026-04-05

## 1. Summary of Accomplishments (Last Session)
- **Frontend Infrastructure**: Successfully set up Next.js 16 with the App Router and Tailwind CSS v4.
- **Wallet Connection**: Integrated `@txnlab/use-wallet`, providing support for Pera, Defly, and Lute wallets.
- **UI Aesthetics**: Built a glassmorphic sticky header with a purple/obsidian theme and a high-end Hero section with Framer Motion animations.
- **Project Structure**: Configured Convex with a base schema to handle `users`, `agents`, and `transactions`.
- **GSD Artifacts**: Generated `SPEC.md`, `ARCHITECTURE.md`, `PLAN.md`, `CONTEXT.md`, and `ROADMAP.md` to guide the next phases.

## 2. Technical Context for Next Developer
- **Environment**: Next.js 16, Tailwind v4. The project is currently targeting the **Algorand Testnet**.
- **Wallet State**: `@txnlab/use-wallet-react` provides the current `activeAddress` and `transactionSigner`. This is critical for any blockchain interactions.
- **Database**: Convex is currently set up with a `schema.ts`. Any new application state should be added to this schema first.
- **Design Tokens**: The design uses a "Glassmorphism" aesthetic with obsidian backgrounds and purple accents. Stick to standard components in `components/ui/` for consistency.

## 3. Next Immediate Goals (High Priority)
1. **Dynamic Data**: Replace hardcoded agent lists with Convex queries.
2. **Onboarding**: Implement a mutation to register a user's wallet address in the `users` table upon connection.
3. **Transaction Demo**: Create a simple page or component that uses `algosdk` and `useWallet()` to sign a 0-ALGO "test" transaction to verify connection.
4. **NFD Support**: Integrate NFD (Non-Fungible Domain) lookup for connected wallets to display human-readable names.

## 4. Potential Pitfalls/Gotchas
- **x402 Protocol**: Ensure AVM registration is done correctly for x402 payments; avoid conditional registration logic.
- **Network Identifiers**: Use CAIP-2 identifiers for Testnet: `algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=`.
- **Convex Limits**: Be mindful of Convex function execution limits when performing complex on-chain verification.
