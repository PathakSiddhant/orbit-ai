"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getUserCredits = async () => {
  const { userId } = await auth();
  if (!userId) return -1;

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  return parseInt(user?.credits || "0");
};