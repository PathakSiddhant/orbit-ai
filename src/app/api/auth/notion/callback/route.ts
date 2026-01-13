import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const { userId } = await auth();
  const user = await currentUser();

  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });
  if (!userId || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const clientId = process.env.NOTION_CLIENT_ID;
    const clientSecret = process.env.NOTION_CLIENT_SECRET;
    const redirectUri = process.env.NOTION_REDIRECT_URI;

    // Notion requires Basic Auth Header for Token Exchange
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to exchange token");
    }

    // Upsert User with Notion Token
    const existingUser = await db.query.users.findFirst({
        where: eq(users.clerkId, userId)
    });

    if (existingUser) {
        await db.update(users)
          .set({
            notionAccessToken: data.access_token,
            notionWorkspaceId: data.workspace_id,
          })
          .where(eq(users.clerkId, userId));
    } else {
        await db.insert(users).values({
            clerkId: userId,
            email: user.emailAddresses[0].emailAddress,
            name: user.firstName + " " + user.lastName,
            notionAccessToken: data.access_token,
            notionWorkspaceId: data.workspace_id,
        });
    }

    return new NextResponse(
      `<html>
        <body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
          <div style="text-align:center;">
            <h1 style="color:#4ade80;">✅ Notion Connected!</h1>
            <p>You can close this window.</p>
            <script>
               window.opener.postMessage("notion-connected", "*");
               setTimeout(() => window.close(), 1000);
            </script>
          </div>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}