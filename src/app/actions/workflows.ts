"use server"; // Important! Ye code sirf server pe chalega

import { db } from "@/lib/db";
import { workflows } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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