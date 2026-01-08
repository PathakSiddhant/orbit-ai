import { Sidebar } from "@/components/sidebar";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
   
  const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId!)
  });

  const credits = parseInt(user?.credits || "0");

  return (
    // CHANGE IS HERE: Added 'h-screen' and 'overflow-hidden' to lock window
    <div className="h-screen w-full relative bg-black overflow-hidden flex">
      
      {/* Sidebar - Fixed height handling */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar currentCredits={credits} />
      </div>

      {/* Main Content - Needs to handle scroll internally */}
      <main className="md:pl-72 w-full h-full flex flex-col">
        {/* Header - Shrink 0 taaki ye shrink na ho */}
        <div className="flex justify-end items-center p-4 border-b border-zinc-800 bg-black shrink-0">
            <UserButton afterSignOutUrl="/" />
        </div>
        
        {/* Children (Pages) will take remaining height and scroll independently */}
        <div className="flex-1 h-full overflow-y-auto">
            {children}
        </div>
      </main>
    </div>
  );
}