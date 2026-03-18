import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    walletAddress: v.string(),
    name: v.string(),
    reputation: v.number(),
    earnings: v.number(),
    createdAt: v.number(),
  }).index("by_walletAddress", ["walletAddress"]),

  agents: defineTable({
    name: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    price: v.number(),
    creatorWallet: v.string(),
    rating: v.number(),
    status: v.string(),
  }).index("by_creatorWallet", ["creatorWallet"]),

  transactions: defineTable({
    agentId: v.id("agents"),
    buyerWallet: v.string(),
    amount: v.number(),
    timestamp: v.number(),
  }).index("by_agentId", ["agentId"]).index("by_buyerWallet", ["buyerWallet"]),
});
