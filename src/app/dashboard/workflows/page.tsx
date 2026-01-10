import { db } from "@/lib/db";
import { workflows } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";
import WorkflowCard from "./_components/WorkflowCard"; // <--- Import New Component

export default async function WorkflowsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const userWorkflows = await db
    .select()
    .from(workflows)
    .where(eq(workflows.userId, userId))
    .orderBy(desc(workflows.createdAt));

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 text-transparent bg-clip-text">
              My Agents
          </h1>
          <p className="text-zinc-400">Manage and deploy your intelligent workflows.</p>
        </div>
        <Link href="/dashboard/workflows/new">
            <Button className="bg-white text-black hover:bg-zinc-200 font-bold">
                <Plus className="mr-2 h-4 w-4" /> Create New Agent
            </Button>
        </Link>
      </div>

      {userWorkflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
          <div className="h-20 w-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-10 w-10 text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No agents yet</h2>
          <p className="text-zinc-500 mb-6 max-w-sm text-center">
            Create your first intelligent agent to automate your tasks.
          </p>
          <Link href="/dashboard/workflows/new">
             <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                Start from scratch
             </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userWorkflows.map((workflow) => (
             // Use the new Card Component
             <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}
    </div>
  );
}