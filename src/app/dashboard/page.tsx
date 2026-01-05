import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserFromDb, createUserInDb } from "@/lib/db/queries";
import { Button } from "@/components/ui/button";
import { Zap, Bot, TrendingUp } from "lucide-react"; // Icons import kiye

export default async function DashboardPage() {
  const authUser = await currentUser();
  const { userId } = await auth();

  if (!userId || !authUser) {
    redirect("/sign-in");
  }

  const dbUser = await getUserFromDb(userId);

  if (!dbUser) {
    await createUserInDb({
      clerkId: userId,
      email: authUser.emailAddresses[0].emailAddress,
      name: (authUser.firstName || "") + " " + (authUser.lastName || ""),
      profileImage: authUser.imageUrl,
    });
  }

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-zinc-400">Overview of your AI activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition flex flex-col justify-between">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-zinc-200">Active Agents</h3>
              <Bot className="h-5 w-5 text-violet-500" />
           </div>
           <p className="text-3xl font-bold mb-1">0</p>
           <p className="text-xs text-zinc-500">Ready to deploy</p>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition flex flex-col justify-between">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-zinc-200">Total Runs</h3>
              <Zap className="h-5 w-5 text-pink-500" />
           </div>
           <p className="text-3xl font-bold mb-1">0</p>
           <p className="text-xs text-zinc-500">Workflows executed</p>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition flex flex-col justify-between">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-zinc-200">Efficiency</h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
           </div>
           <p className="text-3xl font-bold mb-1">100%</p>
           <p className="text-xs text-zinc-500">System health</p>
        </div>

      </div>
      
      {/* Quick Action */}
      <div className="mt-8">
        <div className="p-8 rounded-xl border border-zinc-800 bg-gradient-to-r from-violet-900/20 to-blue-900/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h3 className="text-xl font-bold text-white mb-2">Create your first Orbit</h3>
                <p className="text-zinc-400">Connect Gmail, Notion, and AI to automate your life.</p>
            </div>
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
                Start Automation
            </Button>
        </div>
      </div>
    </div>
  );
}