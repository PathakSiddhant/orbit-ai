"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Client } from "@notionhq/client";

// 1. Generate Auth URL
export const getNotionAuthUrl = async () => {
  const clientId = process.env.NOTION_CLIENT_ID;
  const redirectUri = process.env.NOTION_REDIRECT_URI;
  
  // Construct the URL manually
  return `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri!)}`;
};

// 2. Check Connection
export const checkNotionConnection = async () => {
  const { userId } = await auth();
  if (!userId) return false;
  const user = await db.query.users.findFirst({ where: eq(users.clerkId, userId) });
  return !!user?.notionAccessToken;
};

// 3. Fetch Everything (NO FILTER)
export const getNotionDatabases = async () => {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "User not found" };

  const user = await db.query.users.findFirst({ where: eq(users.clerkId, userId) });
  if (!user?.notionAccessToken) return { success: false, message: "Not connected" };

  const notion = new Client({ auth: user.notionAccessToken });

  try {
    console.log("🔍 Fetching All Notion Items (No Filter)...");

    const response = await notion.search({
        sort: { direction: 'descending', timestamp: 'last_edited_time' },
    });

    // 👇 FIX: Koi Filter nahi. Sab kuch return karo.
    // Hum frontend pe type dikha denge.
    console.log(`✅ Found ${response.results.length} items.`);
    
    return { success: true, databases: response.results };

  } catch (error: any) {
    console.error("❌ Notion API Error:", error.message);
    return { success: false, message: "Failed: " + (error.message || "Unknown Error") };
  }
};