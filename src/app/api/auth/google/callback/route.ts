import { google } from "googleapis";
import { oauth2Client } from "@/lib/google";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server"; // Import currentUser
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const { userId } = await auth();
  const user = await currentUser(); // Get full user details for email/name

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }
  if (!userId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("🔄 Exchanging code for tokens...");
    const { tokens } = await oauth2Client.getToken(code);
    console.log("✅ Tokens received. Access Token length:", tokens.access_token?.length);

    // Check if user exists in OUR database
    const existingUser = await db.query.users.findFirst({
        where: eq(users.clerkId, userId)
    });

    if (existingUser) {
        // UPDATE existing user
        console.log("👤 Updating existing user tokens...");
        await db.update(users)
          .set({
            googleAccessToken: tokens.access_token,
            googleRefreshToken: tokens.refresh_token,
          })
          .where(eq(users.clerkId, userId));
    } else {
        // CREATE new user (Backup plan)
        console.log("🆕 User not found in DB. Creating new record...");
        await db.insert(users).values({
            clerkId: userId,
            email: user.emailAddresses[0].emailAddress,
            name: user.firstName + " " + user.lastName,
            googleAccessToken: tokens.access_token,
            googleRefreshToken: tokens.refresh_token,
            credits: "10" // Default credits
        });
    }

    // Success Response
    return new NextResponse(
      `<html>
        <body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
          <div style="text-align:center;">
            <h1 style="color:#4ade80;">✅ Connected Successfully!</h1>
            <p>Database updated. Closing...</p>
            <script>
               window.opener.postMessage("google-connected", "*");
               setTimeout(() => window.close(), 1000);
            </script>
          </div>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );

  } catch (error: any) {
    console.error("❌ Token Exchange Error:", error.message);
    return NextResponse.json({ error: "Failed to exchange token" }, { status: 500 });
  }
}