"use server"; // Important! Ye code sirf server pe chalega

import { db } from "@/lib/db";
import { workflows } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

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