import { db } from "@/lib/db";
import { workflowExecutions, workflows } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollText, CheckCircle2, XCircle, Clock, Terminal } from "lucide-react";
import { formatDistanceToNow } from "date-fns"; // Run: npm i date-fns

export default async function LogsPage() {
  const { userId } = await auth();
  
  // FETCH REAL LOGS + WORKFLOW NAME
  const logs = await db.select({
      id: workflowExecutions.id,
      status: workflowExecutions.status,
      trigger: workflowExecutions.trigger,
      createdAt: workflowExecutions.createdAt,
      workflowName: workflows.name
  })
  .from(workflowExecutions)
  .leftJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
  .where(eq(workflowExecutions.userId, userId!))
  .orderBy(desc(workflowExecutions.createdAt));

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto h-full text-zinc-900 dark:text-white">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Activity Logs</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Real-time history of your agent executions.</p>
        </div>
        <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
            <ScrollText size={20} />
        </div>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <CardHeader>
              <CardTitle className="text-lg">Recent Executions</CardTitle>
          </CardHeader>
          <CardContent>
              {logs.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500">
                      No logs found. Run a workflow to see data here.
                  </div>
              ) : (
                  <div className="space-y-4">
                      {logs.map((log) => (
                          <div key={log.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/50 transition-colors gap-4">
                              <div className="flex items-center gap-4">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${log.status === 'Success' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-red-100 text-red-600 dark:bg-red-900/20'}`}>
                                      {log.status === 'Success' ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}
                                  </div>
                                  <div>
                                      <p className="font-bold text-sm">{log.workflowName || "Unknown Agent"}</p>
                                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                                          <Terminal size={10} /> Trigger: {log.trigger}
                                      </p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-zinc-400">
                                  <Clock size={12} /> 
                                  {log.createdAt ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true }) : "Just now"}
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </CardContent>
      </Card>
    </div>
  );
}