"use server"; // Important! Ye code sirf server pe chalega

import { db } from "@/lib/db";
import { workflows } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

// 1. Create Workflow Function
export async function createWorkflow(name: string, description: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.insert(workflows).values({
    userId,
    name,
    description,
    status: "Draft",
    nodes: "[]", // Empty initially
    edges: "[]",
  });

  revalidatePath("/dashboard/workflows"); // Next.js cache clear karo
}

// 2. Update Workflow Function
export async function updateWorkflow(
    id: number, 
    nodes: string, 
    edges: string
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Only update if user owns it
    await db.update(workflows)
        .set({ nodes, edges, updatedAt: new Date() })
        .where(
            and(
                eq(workflows.id, id),
                eq(workflows.userId, userId)
            )
        );
    
    revalidatePath(`/dashboard/workflows/${id}`);
    return { success: true };
}

// 3. Run Workflow Function (REAL EXECUTION LOGIC)
export async function runWorkflow(flowId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // A. Fetch latest workflow data from DB
  const workflow = await db.query.workflows.findFirst({
    where: and(eq(workflows.id, flowId), eq(workflows.userId, userId))
  });

  if (!workflow) throw new Error("Workflow not found");

  const nodes = JSON.parse(workflow.nodes || "[]");
  const edges = JSON.parse(workflow.edges || "[]");

  // B. Find the STARTER (Trigger) Node
  const starterNode = nodes.find((n: any) => n.data.type === "trigger");

  if (!starterNode) {
    return { success: false, message: "No Trigger node found!" };
  }

  // --- EXECUTION START ---
  const executionLog: string[] = [];
  executionLog.push(`🚀 Execution Started`);
   
  // C. Find connected neighbors (BFS Traversal Lite)
  // Hum dhundenge ki Trigger se kaunsi line (edge) nikal rahi hai
  const connectedEdges = edges.filter((edge: any) => edge.source === starterNode.id);

  if (connectedEdges.length === 0) {
    executionLog.push("⚠️ No actions connected.");
  } else {
    for (const edge of connectedEdges) {
       const nextNodeId = edge.target;
       const nextNode = nodes.find((n: any) => n.id === nextNodeId);
       
       if (nextNode) {
          executionLog.push(`⚙️ Processing: ${nextNode.data.label}`);
          
          // --- REAL API CALLS START HERE ---
          
          if (nextNode.data.type === "slack") {
             const webhookUrl = nextNode.data.slackWebhook;
             const message = nextNode.data.message || "Hello from Orbit!";

             if (!webhookUrl) {
                executionLog.push(`❌ Error: Missing Webhook URL for ${nextNode.data.label}`);
                continue;
             }

             try {
                // Discord requires 'content', Slack requires 'text'
                // We send both to be safe
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        content: message, // For Discord
                        text: message     // For Slack
                    })
                });
                executionLog.push(`✅ Message sent successfully to Webhook!`);
             } catch (error) {
                executionLog.push(`❌ Failed to send message: ${error}`);
             }
          } 
          
          // --- FUTURE: Add Google Drive Logic here ---
          // else if (nextNode.data.type === "google-drive") { ... }

          else if (nextNode.data.type === "email") {
              executionLog.push(`📧 Simulated Email sent to ${nextNode.data.subject}`);
          }
       }
    }
  }

  return { success: true, logs: executionLog };
}