"use server";

import { oauth2Client } from "@/lib/google";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { google } from "googleapis";

// 1. Generate Login URL
export const getGoogleAuthUrl = async () => {
  const scopes = [
    "https://www.googleapis.com/auth/drive.readonly", // Read files
    "https://www.googleapis.com/auth/userinfo.email", // Verify user
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline", // Humein Refresh Token chahiye
    scope: scopes,
    prompt: "consent", // Force consent screen to get refresh token always
  });
};

// 2. Fetch Real Files from Drive (DEBUGGING VERSION)
export const getDriveFiles = async () => {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "User not found" };

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user?.googleAccessToken) {
    return { success: false, message: "Not connected" };
  }

  // Setup Client with User's Token
  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  try {
    // 👇 LOGGING ADDED: Check token presence
    console.log("📂 Attempting to fetch files with token:", user.googleAccessToken?.substring(0, 10) + "...");

    const response = await drive.files.list({
      pageSize: 10,
      fields: "files(id, name, mimeType)",
      // 👇 Debugging ke liye filter hata diya hai (Check agar filter issue kar raha tha)
      // q: "mimeType != 'application/vnd.google-apps.folder' and trashed = false", 
    });

    console.log("✅ Files Response Length:", response.data.files?.length); // Log count
    console.log("✅ Files Data:", response.data.files); // Log actual data

    return { success: true, files: response.data.files || [] };
  } catch (error: any) {
    console.error("❌ Drive API Error:", error.message); // Log exact error
    return { success: false, message: "Failed to fetch files: " + error.message };
  }
};

// 3. Check Connection Status
export const checkGoogleConnection = async () => {
  const { userId } = await auth();
  if (!userId) return false;

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  // Agar access token exist karta hai, toh return TRUE
  return !!user?.googleAccessToken;
};