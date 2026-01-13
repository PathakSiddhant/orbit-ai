'use server'

import { google } from 'googleapis';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { oauth2Client } from '@/lib/google'; // Ensure this exists (Setup in Step 3 if missing)

export const sendGmail = async (userId: string, to: string, subject: string, body: string) => {
  try {
    // 1. Get User Tokens
    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, userId)
    });

    if (!user?.googleAccessToken) return { success: false, message: "Google account not connected" };

    // 2. Setup Google Client
    oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // 3. Create Raw Email (Base64 Encoded)
    // Gmail API needs a raw string with headers
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `To: <${to}>`,
      `Subject: ${utf8Subject}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      ``,
      body
    ];
    const message = messageParts.join('\n');
    
    // Encode to Base64URL (Required by Gmail API)
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // 4. Send Email
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return { success: true, messageId: res.data.id };

  } catch (error: any) {
    console.error("Gmail API Error:", error.message);
    return { success: false, message: error.message };
  }
};

// 👇 Add this temporary debug function
export const debugToken = async (userId: string) => {
  const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId)
  });

  if (!user?.googleAccessToken) return "No token found";

  // Check Token Info from Google
  const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${user.googleAccessToken}`);
  const data = await response.json();
  
  console.log("🔍 TOKEN SCOPES:", data.scope);
  return data;
};