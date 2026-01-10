import { db } from "@/lib/db";
import { workflows } from "@/lib/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { 
  ArrowUpRight, Zap, PlayCircle, Plus, 
  Activity, Users, Clock, ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId) return null;

  const userWorkflows = await db
    .select()
    .from(workflows)
    .where(eq(workflows.userId, userId))
    .orderBy(desc(workflows.createdAt))
    .limit(5);

  return (
    <div className="flex flex-col gap-8 h-full w-full max-w-7xl mx-auto">
      
      {/* 1. GREETING HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-violet-400 text-transparent bg-clip-text">
                  Welcome back, {user?.firstName || "Builder"}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">Here is what's happening with your agents today.</p>
          </div>
          <Link href="/dashboard/workflows/new">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105">
                  <Plus className="mr-2 h-4 w-4" /> Create New Agent
              </Button>
          </Link>
      </div>

      {/* 2. BENTO GRID STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border bg-card/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Workflows</CardTitle>
                  <Zap className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                  <div className="text-3xl font-bold">{userWorkflows.length}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <span className="text-green-500 font-bold flex items-center"><ArrowUpRight className="h-3 w-3"/> +2</span> from last week
                  </p>
              </CardContent>
          </Card>

          <Card className="border-border bg-card/50 hover:bg-card hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Executions</CardTitle>
                  <Activity className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                  <div className="text-3xl font-bold">1,240</div> {/* Placeholder for now, later dynamic */}
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <span className="text-green-500 font-bold flex items-center"><ArrowUpRight className="h-3 w-3"/> +12%</span> efficiency rate
                  </p>
              </CardContent>
          </Card>

          <Card className="border-border bg-card/50 hover:bg-card hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Time Saved</CardTitle>
                  <Clock className="h-4 w-4 text-orange-500 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                  <div className="text-3xl font-bold">42h</div>
                  <p className="text-xs text-muted-foreground mt-1">Auto-pilot active</p>
              </CardContent>
          </Card>
      </div>

      {/* 3. RECENT ACTIVITY & QUICK START */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Agents List */}
          <Card className="lg:col-span-2 border-border bg-card">
              <CardHeader>
                  <CardTitle>Your Agents</CardTitle>
              </CardHeader>
              <CardContent>
                  {userWorkflows.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-border rounded-xl">
                          <Zap className="h-10 w-10 text-muted-foreground mb-3 opacity-20" />
                          <p className="text-muted-foreground font-medium">No agents yet.</p>
                          <p className="text-xs text-muted-foreground max-w-xs mt-1">Build your first AI workforce today.</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {userWorkflows.map((flow) => (
                              <Link key={flow.id} href={`/dashboard/workflows/${flow.id}`}>
                                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 hover:border-primary/30 transition-all group cursor-pointer">
                                      <div className="flex items-center gap-4">
                                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                              <PlayCircle size={20} />
                                          </div>
                                          <div>
                                              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{flow.name}</h4>
                                              <p className="text-xs text-muted-foreground line-clamp-1">{flow.description || "No description"}</p>
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${flow.status === 'Draft' ? 'bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:border-zinc-700' : 'bg-green-100 border-green-200 text-green-600 dark:bg-green-900/30 dark:border-green-800'}`}>
                                              {flow.status}
                                          </span>
                                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                      </div>
                                  </div>
                              </Link>
                          ))}
                      </div>
                  )}
              </CardContent>
          </Card>

          {/* Quick Actions / Templates */}
          <div className="flex flex-col gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
                  <h3 className="text-lg font-bold relative z-10">New to Orbit?</h3>
                  <p className="text-indigo-100 text-sm mt-2 relative z-10">Watch our 2-minute crash course on building AI agents.</p>
                  <Button variant="secondary" className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md relative z-10">
                      Watch Tutorial
                  </Button>
              </div>

              <Card className="border-border bg-card">
                  <CardHeader>
                      <CardTitle className="text-sm">Quick Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      {["Web Scraper -> Slack", "Email Auto-Reply", "Notion Summarizer"].map((t, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/50 cursor-pointer transition-colors text-sm font-medium text-muted-foreground hover:text-foreground">
                              {t}
                              <Plus className="h-3 w-3" />
                          </div>
                      ))}
                  </CardContent>
              </Card>
          </div>

      </div>
    </div>
  );
}