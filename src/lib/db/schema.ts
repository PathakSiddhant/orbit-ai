import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";

// --- USERS TABLE ---
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

// --- WORKFLOWS TABLE ---
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

// --- NEW TABLE: WORKFLOW EXECUTIONS (LOGS) ---
export const workflowExecutions = pgTable("workflow_executions", {
  id: serial("id").primaryKey(),
  // Foreign Key linking to workflows table
  workflowId: integer("workflow_id").references(() => workflows.id, { onDelete: 'cascade' }),
  userId: text("user_id").notNull(),
  trigger: text("trigger").notNull(), // e.g., "Manual", "Webhook"
  status: text("status").notNull(), // "Success" or "Failed"
  createdAt: timestamp("created_at").defaultNow(),
  details: text("details"), // JSON string of steps
});

// --- RELATIONS (Jodne ke liye) ---

// Batata hai ki ek Workflow ke 'Many' executions ho sakte hain
export const workflowsRelations = relations(workflows, ({ many }) => ({
  executions: many(workflowExecutions),
}));

// Batata hai ki ek Execution sirf 'One' workflow se judi hoti hai
export const executionsRelations = relations(workflowExecutions, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowExecutions.workflowId],
    references: [workflows.id],
  }),
}));