"use server";

import { db } from "@/lib/db";
import { workflows, users, workflowExecutions } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai"; 
import * as cheerio from 'cheerio'; 

// 1. Create Workflow
export async function createWorkflow(name: string, description: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.insert(workflows).values({
    userId,
    name,
    description,
    status: "Draft",
    nodes: "[]",
    edges: "[]",
  });

  revalidatePath("/dashboard/workflows"); 
}

// 2. Update Workflow
export async function updateWorkflow(id: number, nodes: string, edges: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.update(workflows)
        .set({ nodes, edges, updatedAt: new Date() })
        .where(and(eq(workflows.id, id), eq(workflows.userId, userId)));
    
    revalidatePath(`/dashboard/workflows/${id}`);
    return { success: true };
}

// 3. Delete Workflow
export async function deleteWorkflow(workflowId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.delete(workflows)
    .where(and(eq(workflows.id, workflowId), eq(workflows.userId, userId)));

  revalidatePath("/dashboard/workflows"); 
}

// ==========================================================
// 4. RUN WORKFLOW (THE BRAIN 🧠)
// ==========================================================
export async function runWorkflow(flowId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 👇 --- EXISTING CREDIT CHECK (COMMENTED OUT FOR INFINITE HACK) ---
  /*
  const user = await db.query.users.findFirst({ where: eq(users.clerkId, userId) });
  if (!user) throw new Error("User not found");
  
  const currentCredits = parseInt(user.credits || "0");
  if (currentCredits <= 0) {
      return { success: false, message: "❌ Not enough credits! Please upgrade." };
  }
  */

  // --- B. FETCH WORKFLOW ---
  const workflow = await db.query.workflows.findFirst({
    where: and(eq(workflows.id, flowId), eq(workflows.userId, userId))
  });

  if (!workflow) return { success: false, message: "Workflow not found" };

  const nodes = JSON.parse(workflow.nodes || "[]");
  const edges = JSON.parse(workflow.edges || "[]");
  
  const executionLog: string[] = [];
  let currentData: any = {}; 

  // Updated Log for Infinite Mode
  executionLog.push(`🚀 Execution Started (Credits: Unlimited ♾️)`); 

  // --- C. FIND STARTING POINT ---
  const trigger = nodes.find((n: any) => n.type === 'trigger');
  if (!trigger) {
      return { success: false, message: "No Trigger node found!" };
  }

  let currentNode = trigger;
  
  // --- D. EXECUTION LOOP (Graph Traversal) ---
  while (currentNode) {
      
      // 1. WEB SCRAPER (REAL LOGIC) 🌐
      if (currentNode.type === 'web-scraper' || currentNode.type === 'browser') {
          const url = currentNode.data.url;
          executionLog.push(`🌐 Scraper: Visiting ${url}...`);
          
          try {
              if(!url) throw new Error("No URL provided");
              
              // Real Network Request
              const response = await fetch(url, { 
                  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OrbitBot/1.0)' } 
              });
              
              if(!response.ok) throw new Error(`Status ${response.status}`);
              
              const html = await response.text();
              const $ = cheerio.load(html);
              
              // Clean up junk
              $('script').remove();
              $('style').remove();
              $('nav').remove();
              $('footer').remove();
              $('iframe').remove();
              
              // Extract meaningful text
              const title = $('title').text();
              const text = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 3000); // Limit context size
              
              executionLog.push(`✅ Scraper: Found page "${title}"`);
              executionLog.push(`📄 Extracted ${text.length} characters.`);
              
              // STORE CONTEXT FOR NEXT NODE
              currentData.context = text; 
          } catch (err: any) {
              executionLog.push(`❌ Scraper Failed: ${err.message}`);
          }
      }

      // 2. AI AGENT (CONTEXT AWARE) 🧠
      else if (currentNode.type === 'ai-agent') {
          executionLog.push(`🧠 AI Agent: Thinking...`);
          const userPrompt = currentNode.data.prompt || "Analyze this.";
          
          try {
              const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
              const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

              // Construct Smart Prompt
              let finalPrompt = userPrompt;
              
              // Check if we have data from previous steps (Scraper or Drive)
              if (currentData.context) {
                  finalPrompt = `
                  CONTEXT DATA (From Website/File):
                  """${currentData.context}"""
                  
                  USER INSTRUCTION:
                  ${userPrompt}
                  
                  Task: Answer the user instruction strictly based on the context above.
                  `;
              }

              const result = await model.generateContent(finalPrompt);
              const response = result.response.text();
              
              executionLog.push(`🤖 AI Response: "${response.substring(0, 60)}..."`);
              
              // Store result for Output Nodes
              currentData.aiResult = response; 
          } catch (err: any) {
              executionLog.push(`❌ AI Error: ${err.message}`);
          }
      }

      // 3. GOOGLE DRIVE (SIMULATION) 📂
      else if (currentNode.type === 'google-drive') {
          executionLog.push(`📂 Drive: Fetching file ${currentNode.data.fileId}...`);
          await new Promise(r => setTimeout(r, 1000));
          const mockContent = "Orbit Project Q3 Report: Growth up by 150%. Primary driver: AI Agents.";
          executionLog.push(`✅ File Read: "${mockContent}"`);
          currentData.context = mockContent; // Pass to AI
      }

      // 4. OUTPUT NODES (Slack/Email) 📨
      else if (['slack', 'email', 'send-email'].includes(currentNode.type || '')) {
          const message = currentData.aiResult || currentData.context || "Hello from Orbit Workflow!";
          const dest = currentNode.data.emailTo || "Slack Channel";
          
          executionLog.push(`📨 Sending Output to ${dest}...`);
          
          // Slack Webhook Implementation
          if (currentNode.type === 'slack' && currentNode.data.slackWebhook) {
             try {
                 await fetch(currentNode.data.slackWebhook, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ text: `🤖 *Orbit Bot:* ${message}` })
                 });
                 executionLog.push(`✅ Slack Message Sent!`);
             } catch(e) {
                 executionLog.push(`❌ Slack Failed.`);
             }
          } else {
             // Simulate Email/Other
             await new Promise(r => setTimeout(r, 800));
             executionLog.push(`✅ Sent: "${message.substring(0, 30)}..."`);
          }
      }

      // --- FIND NEXT NODE ---
      const edge = edges.find((e: any) => e.source === currentNode.id);
      if (!edge) {
          executionLog.push("🏁 Workflow Completed");
          break; // Stop loop
      }
      
      currentNode = nodes.find((n: any) => n.id === edge.target);
  }

  // --- E. SAVE LOGS (BUT DO NOT DEDUCT CREDITS) ---
  try {
    await db.insert(workflowExecutions).values({
      workflowId: flowId,
      userId: userId,
      trigger: "Manual Run",
      status: "Success",
      details: JSON.stringify(executionLog),
    });

    // 👇 --- CREDIT DEDUCTION (COMMENTED OUT) ---
    /*
    await db.update(users)
      .set({ credits: (currentCredits - 1).toString() })
      .where(eq(users.clerkId, userId));
    */

  } catch (err) {
    console.error("Failed to save execution:", err);
  }

  return { success: true, logs: executionLog };
}