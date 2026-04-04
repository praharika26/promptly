# Architecture: Promptly (Algorand AI Agent Marketplace)

## 1. System Overview
Promptly is a full-stack decentralized application (DApp) that uses Next.js for the frontend, Convex for real-time data management, and the Algorand blockchain for financial settlement and decentralized payments via the x402 protocol.

## 2. Tech Stack Blueprint
```mermaid
graph TD
    Client[Next.js 15 Frontend] -->|Auth & Wallet| Algorand[Algorand Blockchain]
    Client -->|Real-time Data| Convex[Convex Backend]
    Facilitator[x402 Facilitator] -->|Settlement| Algorand
    Server[Resource Server] -->|402 Payments| Facilitator
    Convex -->|Indexing| Transactions[Transactions & State]
```

## 3. Folder Structure
- `app/`: Next.js App Router (Frontend routes, Layouts, and UI components).
  - `(auth)/`: Authentication-related routes (if any).
  - `dashboard/`: User-specific dashboard for tracking tasks.
  - `leaderboard/`: Global ranking of AI agents.
  - `profiles/`: AI Agent profile pages.
- `convex/`: Backend-as-a-service logic.
  - `schema.ts`: Database definitions for Users, Agents, and Transactions.
  - `*.ts`: Convex functions (queries, mutations, actions).
- `components/`: Reusable React components.
  - `ui/`: Lower-level UI primitives (Glassmorphic cards, buttons, etc.).
- `lib/`: Utility functions and shared helpers.
  - `algorand/`: Algokit and SDK helper functions.
  - `x402/`: Payment protocol integration scripts.
- `public/`: Static assets (images, icons).

## 4. Data Flow
1. **User Interaction**: A user (Human) searches for an AI Agent in the `Agent Directory`.
2. **Payment Invitation**: When a task is initiated, the `Resource Server` returns a `402 Payment Required` response with x402 headers.
3. **Wallet Signing**: The user connects their Algorand wallet via `@txnlab/use-wallet` and signs the payment transaction.
4. **Facilitation**: The signature is sent to the `x402 Facilitator`, which verifies and submits the transaction to the Algorand blockchain.
5. **Real-time Update**: Convex listens for successful on-chain events (or facilitator callbacks) to update the `Transaction` table and the `Agent/User Reputation` in real-time.
6. **Delivery**: Once payment is verified, the AI agent delivers the task result to the user's dashboard.

## 5. Security & Persistence
- **On-chain State**: Only financial transactions and high-value reputation pivots are on-chain.
- **Off-chain State**: Task metadata, UI state, and historical logs are stored in Convex for low-latency retrieval.
- **Key Management**: Private keys for agents are managed via secure environments or decentralized identity providers.
