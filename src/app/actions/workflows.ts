"use server"; // Important! Ye code sirf server pe chalega

import { db } from "@/lib/db";
import { workflows } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { generateAIContent } from "@/lib/gemini"; // AI Helper Import

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

  revalidatePath("/dashboard/workflows"); 
}

// 2. Update Workflow Function
export async function updateWorkflow(
    id: number, 
    nodes: string, 
    edges: string
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

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

// 3. Run Workflow Function (UPDATED LINEAR CHAIN LOGIC 🔗)
export async function runWorkflow(flowId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // A. Fetch latest workflow data
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
  
  // --- LINEAR CHAIN EXECUTION ---
  // Ye logic seedha ek line mein chalega: Trigger -> Node 1 -> Node 2
  
  let currentNode = starterNode;
  let aiOutput = ""; // Store data between steps

  // Run maximum 5 steps to prevent infinite loops
  for (let i = 0; i < 5; i++) {
      // Find the edge connecting FROM current node
      const edge = edges.find((e: any) => e.source === currentNode.id);
      
      if (!edge) {
          executionLog.push("🏁 End of chain (No more connections).");
          break; 
      }

      const nextNode = nodes.find((n: any) => n.id === edge.target);
      if (!nextNode) break;

      executionLog.push(`⚙️ Step ${i+1}: ${nextNode.data.label}`);

      // --- EXECUTE NODE LOGIC ---

      // 1. AI AGENT
      if (nextNode.data.type === "ai-agent") {
           const prompt = nextNode.data.prompt;
           if(!prompt) {
               executionLog.push(`❌ Error: No prompt provided.`);
           } else {
               executionLog.push(`🧠 Generating AI response...`);
               try {
                   aiOutput = await generateAIContent(prompt);
                   executionLog.push(`✅ AI Output generated.`);
               } catch (err) {
                   executionLog.push(`❌ AI Failed: ${err}`);
               }
           }
      } 
      
      // 2. SLACK / DISCORD
      else if (nextNode.data.type === "slack") {
           const webhookUrl = nextNode.data.slackWebhook;
           
           // Use AI Output if available, else use static message
           const message = aiOutput 
                ? `🤖 **Orbit AI:** ${aiOutput}` 
                : (nextNode.data.message || "Hello from Orbit!");
           
           if(!webhookUrl) {
               executionLog.push(`❌ Error: Missing Webhook URL.`);
           } else {
               try {
                   await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            content: message, // Discord
                            text: message     // Slack
                        })
                    });
                   executionLog.push(`✅ Message sent to Discord/Slack.`);
               } catch (err) {
                   executionLog.push(`❌ Failed to send message: ${err}`);
               }
           }
      }

      // 3. EMAIL (Simulation)
      else if (nextNode.data.type === "email") {
           executionLog.push(`📧 Simulated Email sent to ${nextNode.data.subject}`);
      }

      // Move to next node for the next loop iteration
      currentNode = nextNode;
  }

  return { success: true, logs: executionLog };
}