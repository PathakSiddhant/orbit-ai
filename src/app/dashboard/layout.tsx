import { Sidebar } from "@/components/sidebar";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if(!userId) return null;
  const user = await db.query.users.findFirst({ where: eq(users.clerkId, userId!) });
  const credits = parseInt(user?.credits || "0");

  return (
    // FIX: Use 'bg-background' and 'text-foreground' to respect the Theme Toggle
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
      
      {/* Sidebar Area */}
      <aside className="w-64 hidden md:block shrink-0 h-full border-r border-border">
         <Sidebar currentCredits={credits} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
        {/* Subtle Grid Pattern for Texture */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none z-0" />
        
        <div className="flex-1 overflow-y-auto relative z-10 p-6 md:p-8 scrollbar-hide">
            {children}
        </div>
      </main>
    </div>
  );
}