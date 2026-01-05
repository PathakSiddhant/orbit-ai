import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { workflows } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import Editor from "@/app/dashboard/workflows/_components/editor"; // Hum ye abhi banayenge

interface Props {
  params: Promise<{ workflowId: string }>;
}

export default async function WorkflowEditorPage({ params }: Props) {
  const { workflowId } = await params;
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  // Fetch workflow securely (Ensure user owns it)
  const workflow = await db.query.workflows.findFirst({
    where: and(
        eq(workflows.id, parseInt(workflowId)),
        eq(workflows.userId, userId)
    )
  });

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return (
    <div className="h-full w-full bg-zinc-950">
       <Editor workflow={workflow} />
    </div>
  );
}