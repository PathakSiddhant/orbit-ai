"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { deleteWorkflow } from "@/app/actions/workflows";
import { toast } from "sonner";
import { useState } from "react";

export default function WorkflowCard({ workflow }: { workflow: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure? This cannot be undone.");
    if (!confirmed) return;
    setIsLoading(true);
    try {
        await deleteWorkflow(workflow.id);
        toast.success("Agent deleted");
    } catch (error) {
        toast.error("Failed to delete");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="group relative border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:shadow-xl transition-all overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <CardHeader>
            <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                    <FileText className="h-5 w-5" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${workflow.status === 'Draft' ? 'bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400' : 'bg-green-100 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400'}`}>
                    {workflow.status}
                </span>
            </div>
            <CardTitle className="text-zinc-900 dark:text-white text-lg font-bold">{workflow.name}</CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {workflow.description || "No description provided."}
            </CardDescription>
        </CardHeader>
        
        <CardFooter className="flex justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
            {/* EDIT BUTTON (FIXED VISIBILITY) */}
            <Link href={`/dashboard/workflows/${workflow.id}`} className="flex-1">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" /> Open Editor
                </Button>
            </Link>

            {/* DELETE BUTTON */}
            <Button 
                variant="destructive" 
                size="icon" 
                onClick={handleDelete} 
                disabled={isLoading}
                className="bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 border border-transparent dark:border-red-900/50"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </CardFooter>
    </Card>
  );
}