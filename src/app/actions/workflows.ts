"use server";

import { db } from "@/lib/db";
import { workflows, users, workflowExecutions } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai"; 
import * as cheerio from 'cheerio'; 
import { Client } from "@notionhq/client"; 
import { google } from "googleapis"; 
import { oauth2Client } from "@/lib/google"; 
import { sendGmail, debugToken } from "@/app/actions/gmail"; // 👈 Updated Import with Debugger

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
// 4. RUN WORKFLOW (THE REAL DEAL 🚀) - With Credit System
// ==========================================================
export async function runWorkflow(flowId: number, externalUserId?: string) {
  
  // 1. Determine User ID (Session vs Automation)
  let userId = externalUserId;

  if (!userId) {
      const session = await auth();
      userId = session.userId || undefined;
  }

  if (!userId) return { success: false, message: "Unauthorized" };

  // 2. Fetch User & Check Credits 💳
  const user = await db.query.users.findFirst({ where: eq(users.clerkId, userId) });
  if (!user) return { success: false, message: "User not found" };

  // 👇 Credit Check Logic
  const currentCredits = parseInt(user.credits || "0");
  if (currentCredits <= 0) {
      return { success: false, message: "❌ Insufficient Credits. Please upgrade." };
  }

  // 3. Fetch Workflow
  const workflow = await db.query.workflows.findFirst({
    where: and(eq(workflows.id, flowId), eq(workflows.userId, userId))
  });

  if (!workflow) return { success: false, message: "Workflow not found" };

  const nodes = JSON.parse(workflow.nodes || "[]");
  const edges = JSON.parse(workflow.edges || "[]");
  
  const executionLog: string[] = [];
  let currentData: any = {}; 

  executionLog.push(`🚀 Execution Started (Mode: ${externalUserId ? 'Automated' : 'Manual'})`); 

  // --- FIND STARTING POINT ---
  const trigger = nodes.find((n: any) => n.type === 'trigger');
  if (!trigger) {
      return { success: false, message: "No Trigger node found!" };
  }

  let currentNode = trigger;
  
  // --- EXECUTION LOOP ---
  while (currentNode) {
      
      // ------------------------------------------
      // 1. WEB SCRAPER 🌐
      // ------------------------------------------
      if (currentNode.type === 'web-scraper' || currentNode.type === 'browser') {
          const url = currentNode.data.url;
          executionLog.push(`🌐 Scraper: Visiting ${url}...`);
          
          try {
              if(!url) throw new Error("No URL provided");
              
              const response = await fetch(url, { 
                  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OrbitBot/1.0)' } 
              });
              
              if(!response.ok) throw new Error(`Status ${response.status}`);
              
              const html = await response.text();
              const $ = cheerio.load(html);
              
              // Clean up junk
              $('script').remove(); $('style').remove(); $('nav').remove(); $('footer').remove();
              
              const title = $('title').text();
              const text = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 3000); 
              
              executionLog.push(`✅ Scraper: Found "${title}"`);
              currentData.context = text; 
          } catch (err: any) {
              executionLog.push(`❌ Scraper Failed: ${err.message}`);
          }
      }

      // ------------------------------------------
      // 2. GOOGLE DRIVE (REAL DOWNLOAD) 📂
      // ------------------------------------------
      else if (currentNode.type === 'google-drive') {
          const fileId = currentNode.data.fileId;
          const fileName = currentNode.data.fileName || "Unknown File";
          executionLog.push(`📂 Drive: Downloading "${fileName}"...`);

          if (!user?.googleAccessToken || !fileId) {
             executionLog.push(`❌ Drive Error: Account not connected or File not selected.`);
          } else {
             try {
                 // Setup Auth
                 oauth2Client.setCredentials({ 
                    access_token: user.googleAccessToken,
                    refresh_token: user.googleRefreshToken 
                 });
                 const drive = google.drive({ version: 'v3', auth: oauth2Client });
                 
                 let fileContent = "";
                 
                 try {
                     // Try Exporting (For Google Docs)
                     const response = await drive.files.export({
                         fileId: fileId,
                         mimeType: 'text/plain',
                     });
                     fileContent = response.data as string;
                 } catch (e) {
                     // Fallback: Download directly (For .txt, .csv, etc.)
                     const response = await drive.files.get({
                         fileId: fileId,
                         alt: 'media',
                     });
                     
                     if (typeof response.data === 'string') {
                         fileContent = response.data;
                     } else {
                         fileContent = JSON.stringify(response.data);
                     }
                 }

                 executionLog.push(`✅ File Read: Extracted ${fileContent.length} chars.`);
                 currentData.context = fileContent; // Pass content to AI
             } catch (err: any) {
                 executionLog.push(`❌ Drive Failed: ${err.message}`);
             }
          }
      }

      // ------------------------------------------
      // 3. AI AGENT (CONTEXT AWARE) 🧠
      // ------------------------------------------
      else if (currentNode.type === 'ai-agent') {
          executionLog.push(`🧠 AI Agent: Thinking...`);
          const userPrompt = currentNode.data.prompt || "Analyze this.";
          
          // Combine Prompt with Real Data from previous steps
          const contextData = currentData.context || "No context provided.";
          
          try {
              const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
              const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }); 

              const finalPrompt = `
              CONTEXT DATA (Source: Website or File):
              """${contextData.substring(0, 15000)}""" 
              
              USER INSTRUCTION:
              ${userPrompt}
              
              Task: Follow the User Instruction strictly based on the Context Data provided.
              `;

              const result = await model.generateContent(finalPrompt);
              const response = result.response.text();
              
              executionLog.push(`🤖 AI Response: "${response.substring(0, 60)}..."`);
              currentData.aiResult = response; 
          } catch (err: any) {
              executionLog.push(`❌ AI Error: ${err.message}`);
          }
      }

      // ------------------------------------------
      // 4. NOTION (REAL DATABASE WRITE) 📝
      // ------------------------------------------
      else if (currentNode.type === 'notion') {
          executionLog.push(`📝 Notion: Saving entry...`);
          
          const content = currentData.aiResult || currentData.context || "No content generated";
          const dbId = currentNode.data.databaseId;

          if (!user?.notionAccessToken || !dbId) {
              executionLog.push(`❌ Notion Error: Not connected or Database not selected.`);
          } else {
              try {
                  const notion = new Client({ auth: user.notionAccessToken });

                  await notion.pages.create({
                      parent: { database_id: dbId },
                      properties: {
                          Name: { 
                              title: [
                                  { text: { content: "Orbit Workflow Result" } }
                              ]
                          },
                      },
                      children: [
                          {
                              object: "block",
                              type: "paragraph",
                              paragraph: {
                                  rich_text: [{ type: "text", text: { content: content.substring(0, 2000) } }],
                              },
                          },
                      ],
                  });

                  executionLog.push(`✅ Notion: Page created successfully!`);
              } catch (err: any) {
                  executionLog.push(`❌ Notion API Error: ${err.message}`);
              }
          }
      }

      // ------------------------------------------
      // 5. EMAIL (VIA GMAIL API) 📧
      // ------------------------------------------
      else if (currentNode.type === 'email') {
          executionLog.push(`📧 Email: preparing to send via Gmail...`);
          
          // 👇 DEBUG CALL
          await debugToken(userId); 

          const recipient = currentNode.data.email;
          const subject = "Orbit AI Report";
          const body = currentData.aiResult || currentData.context || "No content generated.";

          if (!recipient) {
              executionLog.push(`❌ Email Error: No recipient email provided.`);
          } else {
              // Call our new Gmail Action
              const result = await sendGmail(userId, recipient, subject, `<p>${body}</p>`);
              
              if (result.success) {
                  executionLog.push(`✅ Email Sent Successfully! (ID: ${result.messageId})`);
              } else {
                  executionLog.push(`❌ Email Failed: ${result.message}`);
              }
          }
      }

      // ------------------------------------------
      // 6. SLACK (WEBHOOK) 💬
      // ------------------------------------------
      else if (currentNode.type === 'slack') {
          const message = currentData.aiResult || currentData.context || "Hello from Orbit Workflow!";
          executionLog.push(`💬 Slack: Sending message...`);
          
          if (currentNode.data.slackWebhook) {
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
             executionLog.push(`❌ Slack Error: No Webhook URL.`);
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

  // --- SAVE LOGS ---
  try {
    await db.insert(workflowExecutions).values({
      workflowId: flowId,
      userId: userId,
      trigger: externalUserId ? "Automation" : "Manual Run",
      status: "Success",
      details: JSON.stringify(executionLog),
    });

    // 💰 DEDUCT CREDITS (After successful execution)
    await db.update(users)
        .set({ credits: (currentCredits - 1).toString() })
        .where(eq(users.clerkId, userId));
        
  } catch (err) {
    console.error("Failed to save execution:", err);
  }

  return { success: true, logs: executionLog };
}

// ==========================================================
// 5. PUBLISH WORKFLOW (TOGGLE STATUS) 🚀
// ==========================================================
export const publishWorkflow = async (workflowId: number, isPublished: boolean) => {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };

  try {
    await db.update(workflows)
      .set({ status: isPublished ? "PUBLISHED" : "DRAFT" })
      .where(eq(workflows.id, workflowId));
      
    revalidatePath(`/dashboard/workflows/${workflowId}`);
    return { success: true, message: isPublished ? "Workflow Published" : "Workflow Paused" };
  } catch (error) {
    return { success: false, message: "Failed to update status" };
  }
};