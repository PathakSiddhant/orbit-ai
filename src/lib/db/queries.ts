import { db } from "./index"; // Humara connection
import { users } from "./schema"; // Humari table definition
import { eq } from "drizzle-orm"; // Equal operator
import "server-only"; // Sirf server pe chalega

// Function 1: Check if user exists
export const getUserFromDb = async (clerkId: string) => {
  const user = await db.select().from(users).where(eq(users.clerkId, clerkId));
  return user[0]; // Pehla match return karo
};

// Function 2: Create new user
export const createUserInDb = async (user: {
  clerkId: string;
  email: string;
  name: string;
  profileImage: string;
}) => {
  await db.insert(users).values(user);
};