"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createWorkflow } from "@/app/actions/workflows" // Ye hum abhi banayenge
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CreateWorkflowPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
        // Call Server Action
        await createWorkflow(name, description);
        router.push("/dashboard/workflows"); // Wapas list pe jao
        router.refresh(); // Data refresh karo
    } catch (error) {
        console.error("Failed to create", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-black text-white">
      <div className="w-full max-w-md p-8 border border-zinc-800 rounded-xl bg-zinc-900">
        <h1 className="text-2xl font-bold mb-2">Name your Orbit</h1>
        <p className="text-sm text-zinc-400 mb-6">Give your automation agent a clear name.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Email to Notion" className="bg-zinc-950 border-zinc-800" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input id="description" name="description" placeholder="What does this agent do?" className="bg-zinc-950 border-zinc-800" />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-white text-black hover:bg-zinc-200">
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Create Workflow"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}