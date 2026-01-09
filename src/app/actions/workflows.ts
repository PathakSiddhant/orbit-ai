"use server"; // Important! Ye code sirf server pe chalega

import { db } from "@/lib/db";
import { workflows, users, workflowExecutions } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { generateAIContent } from "@/lib/gemini"; // AI Helper Import
import * as cheerio from 'cheerio'; // Scraping ke liye

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

// 3. Run Workflow Function (WITH SMART AI & CONTEXT INJECTION 🧠)
export async function runWorkflow(flowId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // --- 1. CHECK CREDITS (The Gatekeeper) ---
  const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId)
  });

  if (!user) throw new Error("User not found");
  
  // Credits ko number mein convert karke check karo
  const currentCredits = parseInt(user.credits || "0");
  
  if (currentCredits <= 0) {
      return { success: false, message: "❌ Not enough credits! Please upgrade." };
  }

  // --- 2. FETCH WORKFLOW DATA ---
  const workflow = await db.query.workflows.findFirst({
    where: and(eq(workflows.id, flowId), eq(workflows.userId, userId))
  });

  if (!workflow) throw new Error("Workflow not found");

  const nodes = JSON.parse(workflow.nodes || "[]");
  const edges = JSON.parse(workflow.edges || "[]");

  // Find the STARTER (Trigger) Node
  const starterNode = nodes.find((n: any) => n.data.type === "trigger");

  if (!starterNode) {
    return { success: false, message: "No Trigger node found!" };
  }

  // --- 3. EXECUTION START ---
  const executionLog: string[] = [];
  executionLog.push(`🚀 Execution Started (Credits: ${currentCredits})`);
  
  // --- LINEAR CHAIN EXECUTION ---
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

      // A. AI AGENT (UPDATED: SMART CONTEXT LOGIC) 🧠
      if (nextNode.data.type === "ai-agent") {
            const userPrompt = nextNode.data.prompt;
            
            if(!userPrompt) {
                executionLog.push(`❌ Error: No prompt provided.`);
            } else {
                // MAGIC FIX: Combine Scraped Data with User Prompt
                // Agar pichle node se koi data aaya hai (jaise Scraper se), toh usse context banao.
                let finalPrompt = userPrompt;
                
                if (aiOutput && aiOutput.length > 5) {
                    finalPrompt = `
                    CONTEXT FROM WEBSITE/FILE:
                    """
                    ${aiOutput}
                    """

                    USER INSTRUCTION:
                    ${userPrompt}

                    Task: Answer the user instruction strictly based on the context above. If the context doesn't have the answer, say "I couldn't find that info on the page."
                    `;
                }

                executionLog.push(`🧠 Sending to AI: "${userPrompt}"...`);
                
                try {
                    // Call Gemini with the SMART Prompt
                    const aiResponse = await generateAIContent(finalPrompt);
                    
                    executionLog.push(`✅ AI Answered: "${aiResponse.substring(0, 50)}..."`);
                    
                    // Store specific answer for next steps (like Slack)
                    aiOutput = aiResponse; 
                } catch (err) {
                    executionLog.push(`❌ AI Failed: ${err}`);
                }
            }
      } 
      
      // B. SLACK / DISCORD
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

      // C. EMAIL (Simulation)
      else if (nextNode.data.type === "email") {
            executionLog.push(`📧 Simulated Email sent to ${nextNode.data.subject}`);
      }

      // D. BROWSER / SCRAPER (REAL LOGIC)
      else if (nextNode.data.type === "browser") {
            const url = nextNode.data.url;
            executionLog.push(`🌐 Visiting Website: ${url}`);
            
            try {
                // REAL SCRAPING LOGIC
                const response = await fetch(url);
                const html = await response.text();
                const $ = cheerio.load(html);
                
                // Extract visible text (body text only, remove scripts/styles)
                $('script').remove();
                $('style').remove();
                const textContent = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 1000); // Limit to 1000 chars for AI
                
                aiOutput = textContent; // Store for next node (AI)
                
                executionLog.push(`✅ Scraped ${textContent.length} chars from page.`);
                executionLog.push(`📄 Content Preview: "${textContent.substring(0, 50)}..."`);
            } catch (err: any) {
                executionLog.push(`❌ Failed to scrape: ${err.message}`);
                aiOutput = "Failed to scrape content.";
            }
      }

      // Move to next node for the next loop iteration
      currentNode = nextNode;
  }

  // --- 4. SAVE LOG TO DB ---
  try {
    await db.insert(workflowExecutions).values({
      workflowId: flowId,
      userId: userId,
      trigger: "Manual Run",
      status: "Success",
      details: JSON.stringify(executionLog),
    });
  } catch (err) {
    console.error("Failed to save logs:", err);
  }

  // --- 5. DEDUCT CREDIT ---
  await db.update(users)
      .set({ credits: (currentCredits - 1).toString() })
      .where(eq(users.clerkId, userId));

  return { success: true, logs: executionLog };
}

// 4. Delete Workflow Function
export async function deleteWorkflow(workflowId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.delete(workflows)
    .where(and(eq(workflows.id, workflowId), eq(workflows.userId, userId)));

  revalidatePath("/dashboard/workflows"); 
}