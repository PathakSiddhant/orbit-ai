import { db } from "@/lib/db";
import { workflows } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Play } from "lucide-react";
import Link from "next/link";

export default async function WorkflowsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  // Fetch workflows from DB sorted by newest first
  const userWorkflows = await db
    .select()
    .from(workflows)
    .where(eq(workflows.userId, userId))
    .orderBy(desc(workflows.createdAt));

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-zinc-400">Manage your automation agents.</p>
        </div>
        {/* New Button leads to Create Page */}
        <Link href="/dashboard/workflows/new">
            <Button className="bg-white text-black hover:bg-zinc-200">
            <Plus className="mr-2 h-4 w-4" /> Create Workflow
            </Button>
        </Link>
      </div>

      {userWorkflows.length === 0 ? (
        // Empty State (Agar koi workflow nahi hai)
        <div className="flex flex-col items-center justify-center h-[60vh] border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
          <div className="h-20 w-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-10 w-10 text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No workflows yet</h2>
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
        // List of Workflows
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userWorkflows.map((workflow) => (
  <Link
    key={workflow.id}
    href={`/dashboard/workflows/${workflow.id}`}
  >
    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 rounded-lg bg-violet-900/20 flex items-center justify-center text-violet-400">
          <Play className="h-5 w-5" />
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
          {workflow.status}
        </span>
      </div>

      <h3 className="font-bold text-lg mb-1 group-hover:text-blue-400 transition">
        {workflow.name}
      </h3>

      <p className="text-sm text-zinc-500 line-clamp-2">
        {workflow.description || "No description provided."}
      </p>
    </div>
  </Link>
))}

        </div>
      )}
    </div>
  );
}