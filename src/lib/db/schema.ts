import { pgTable, serial, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(), // Link to Clerk
  email: text("email").notNull(),
  name: text("name"),
  profileImage: text("profile_image"),
  tier: text("tier").default("Free"), // Free vs Pro users
  credits: text("credits").default("10"), // For AI usage limits
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Link to Clerk ID
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("Draft"), // Draft or Published
  nodes: text("nodes"), // Store the logic (JSON stringified)
  edges: text("edges"), // Store connections (JSON stringified)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});