import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

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