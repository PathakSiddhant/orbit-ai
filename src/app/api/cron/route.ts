import { db } from "@/lib/db";
import { workflows } from "@/lib/db/schema";
import { runWorkflow } from "@/app/actions/workflows";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Security Check: Sirf Vercel (ya hum development mein) isse call kar sake
  // Production mein hum 'CRON_SECRET' check karenge
  if (process.env.NODE_ENV === "production" && 
      req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // Note: Abhi ke liye comment out kar raha hu taaki test kar sakein
  }

  console.log("⏰ Cron Job Started...");

  // 1. Find all PUBLISHED workflows
  const activeWorkflows = await db.query.workflows.findMany({
    where: eq(workflows.status, "PUBLISHED"),
  });

  console.log(`🔍 Found ${activeWorkflows.length} active workflows.`);

  const results = [];

  // 2. Run each workflow
  for (const flow of activeWorkflows) {
    try {
      console.log(`🚀 Executing Workflow ID: ${flow.id} for User: ${flow.userId}`);
      
      // 👇 Pass userId explicitly because Cron is not logged in
      const result = await runWorkflow(flow.id, flow.userId);
      
      results.push({ id: flow.id, status: result.success ? "Success" : "Failed", logs: result.logs });
    } catch (error: any) {
      console.error(`❌ Workflow ${flow.id} failed:`, error.message);
      results.push({ id: flow.id, status: "Error", error: error.message });
    }
  }

  return NextResponse.json({ success: true, executed: results });
}