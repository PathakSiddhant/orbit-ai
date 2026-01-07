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

// 3. Run Workflow Function (New Logic Added)
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
    return { success: false, message: "No Trigger node found! Add a 'Trigger' to start." };
  }

  // --- EXECUTION SIMULATION (The Brain) ---
  const executionLog: string[] = [];
  executionLog.push(`🚀 Starting execution for Orbit: ${workflow.name}`);
  executionLog.push(`✅ Trigger fired: ${starterNode.data.label}`);

  // C. Find connected neighbors (BFS Traversal Lite)
  // Hum dhundenge ki Trigger se kaunsi line (edge) nikal rahi hai
  const connectedEdges = edges.filter((edge: any) => edge.source === starterNode.id);

  if (connectedEdges.length === 0) {
    executionLog.push("⚠️ Workflow ended: No actions connected to trigger.");
  } else {
    for (const edge of connectedEdges) {
       const nextNodeId = edge.target;
       const nextNode = nodes.find((n: any) => n.id === nextNodeId);
       
       if (nextNode) {
          // Yahan hum future mein Real API Call karenge (Google/Slack)
          executionLog.push(`⚙️ Executing Step: ${nextNode.data.label}`);
          
          // Simulation of processing
          if (nextNode.data.type === "google-drive") {
             executionLog.push(`📂 Checking Google Drive Folder: ${nextNode.data.folderId || "N/A"}`);
          } else if (nextNode.data.type === "slack") {
             executionLog.push(`💬 Sending Slack Message to: ${nextNode.data.channel || "N/A"}`);
          } else if (nextNode.data.type === "email") {
             executionLog.push(`📧 Sending Email: ${nextNode.data.subject || "No Subject"}`);
          }
       }
    }
  }

  executionLog.push("🏁 Workflow completed successfully.");

  // Return the logs so we can show them to the user
  return { success: true, logs: executionLog };
}