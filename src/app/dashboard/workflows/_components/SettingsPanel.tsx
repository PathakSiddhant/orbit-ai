"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNodes } from "@xyflow/react"; 

interface SettingsPanelProps {
  selectedNode: { id: string; type: string; data: any } | null;
  setNodes: any; 
  onClose: () => void; 
}

export default function SettingsPanel({ selectedNode, setNodes, onClose }: SettingsPanelProps) {
  // 1. Get ALL current nodes from React Flow state
  const nodes = useNodes();

  // 2. Find the LIVE version of the selected node
  const currentNode = nodes.find((n) => n.id === selectedNode?.id);

  // Updated handler to support Select (Dropdown) as well
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: string) => {
    if (!selectedNode) return;

    setNodes((nds: any[]) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              [field]: e.target.value,
            },
          };
        }
        return node;
      })
    );
  };

  // Agar node select nahi hai ya delete ho gaya hai, toh band kar do
  if (!selectedNode || !currentNode) return null;

  return (
    <Sheet open={!!selectedNode} onOpenChange={() => onClose()}>
      {/* Updated Sheet Background for Light/Dark Mode */}
      <SheetContent className="bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-[400px] sm:w-[540px] shadow-2xl overflow-y-auto">
        
        <SheetHeader className="mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <SheetTitle className="text-zinc-900 dark:text-white text-xl flex items-center gap-2">
            <span className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 shadow-sm">
                {/* Node type dikhao */}
                {currentNode.data.type?.toUpperCase() || "NODE"}
            </span>
            Configuration
          </SheetTitle>
          <SheetDescription className="text-zinc-500 dark:text-zinc-400">
            Configure the properties for this specific step.
          </SheetDescription>
        </SheetHeader>

        {/* --- FORM FIELDS (Using currentNode instead of selectedNode) --- */}
        <div className="grid gap-6 py-4">
          
          {/* Universal Field: Name/Label */}
          <div className="grid gap-3">
            <Label htmlFor="label" className="text-zinc-700 dark:text-zinc-300 font-medium">Step Name</Label>
            <Input 
                id="label" 
                value={currentNode.data.label || ""} 
                onChange={(e) => handleChange(e, 'label')}
                className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-violet-500 transition-colors h-10"
            />
          </div>

          {/* --- TRIGGER NODE (New) --- */}
          {currentNode.data.type === "trigger" && (
             <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                 <Label className="text-zinc-500 text-xs uppercase tracking-wider">Webhook URL</Label>
                 <Input 
                    disabled 
                    value="Coming Soon: Custom Webhooks" 
                    className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                 />
                 <p className="text-[10px] text-zinc-400">You will be able to trigger this workflow externally soon.</p>
             </div>
          )}

          {/* --- GOOGLE DRIVE (Updated) --- */}
          {currentNode.data.type === "google-drive" && (
             <div className="space-y-4 p-5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <Label className="text-green-700 dark:text-green-400 font-semibold text-base">Drive Settings</Label>
                </div>
                
                <div className="grid gap-4">
                    {/* File ID Input */}
                    <div>
                        <Label htmlFor="fileId" className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">File ID / URL</Label>
                        <Input 
                            id="fileId" 
                            placeholder="e.g. 1A2b3C..." 
                            value={currentNode.data.fileId || ""}
                            onChange={(e) => handleChange(e, 'fileId')}
                            className="bg-white dark:bg-black/40 border-green-200 dark:border-green-900/30 text-green-900 dark:text-green-100 mt-1"
                        />
                        <p className="text-[10px] text-zinc-500 mt-1">Make sure the file is "Anyone with link" for now.</p>
                    </div>

                    {/* Operation Select */}
                    <div>
                         <Label className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Operation</Label>
                         <select 
                            className="w-full mt-1 p-2 rounded-md bg-white dark:bg-black/40 border border-green-200 dark:border-green-900/30 text-sm focus:ring-2 focus:ring-green-500 outline-none text-zinc-900 dark:text-zinc-200"
                            onChange={(e) => handleChange(e, 'operation')}
                            value={currentNode.data.operation || "Read Text Content"}
                         >
                             <option>Read Text Content</option>
                             <option disabled>Create New Doc (Pro)</option>
                         </select>
                    </div>
                </div>
             </div>
          )}

          {/* --- SLACK / DISCORD --- */}
          {currentNode.data.type === "slack" && (
             <div className="space-y-4 p-5 bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/50 rounded-xl">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                    <Label className="text-pink-700 dark:text-pink-400 font-semibold text-base">Slack/Discord Webhook</Label>
                </div>

                <div className="grid gap-3">
                    <div>
                        <Label htmlFor="webhook" className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Webhook URL</Label>
                        <Input 
                            id="webhook" 
                            placeholder="https://discord.com/api/webhooks/..."
                            value={currentNode.data.slackWebhook || ""} 
                            onChange={(e) => handleChange(e, 'slackWebhook')}
                            className="bg-white dark:bg-black/40 border-pink-200 dark:border-pink-900/30 mt-1.5 focus:border-pink-500/50 text-xs font-mono"
                        />
                    </div>
                    <div>
                        <Label htmlFor="message" className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Message</Label>
                        <Textarea 
                            id="message" 
                            placeholder="Hello World from Orbit!"
                            value={currentNode.data.message || ""}
                            onChange={(e) => handleChange(e, 'message')}
                            className="bg-white dark:bg-black/40 border-pink-200 dark:border-pink-900/30 min-h-[100px] mt-1.5 focus:border-pink-500/50 resize-none"
                        />
                    </div>
                </div>
             </div>
          )}

           {/* --- SEND EMAIL (Updated: Supports 'send-email' and legacy 'email') --- */}
           {(currentNode.data.type === "email" || currentNode.data.type === "send-email") && (
             <div className="space-y-4 p-5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <Label className="text-blue-700 dark:text-blue-400 font-semibold text-base">Email Bot</Label>
                </div>
                
                <div className="grid gap-4">
                    {/* Recipient */}
                    <div>
                        <Label htmlFor="emailTo" className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">To (Recipient)</Label>
                        <Input 
                            id="emailTo" 
                            placeholder="client@example.com"
                            value={currentNode.data.emailTo || ""}
                            onChange={(e) => handleChange(e, 'emailTo')}
                            className="bg-white dark:bg-black/40 border-blue-200 dark:border-blue-900/30 mt-1"
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <Label htmlFor="emailSubject" className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Subject</Label>
                        <Input 
                            id="emailSubject" 
                            placeholder="New Lead Alert"
                            value={currentNode.data.emailSubject || ""}
                            onChange={(e) => handleChange(e, 'emailSubject')}
                            className="bg-white dark:bg-black/40 border-blue-200 dark:border-blue-900/30 mt-1"
                        />
                    </div>

                    {/* Body */}
                    <div>
                        <Label htmlFor="emailBody" className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Body</Label>
                        <Textarea 
                            id="emailBody" 
                            placeholder="Hi, we found a new lead..."
                            value={currentNode.data.emailBody || ""}
                            onChange={(e) => handleChange(e, 'emailBody')}
                            className="bg-white dark:bg-black/40 border-blue-200 dark:border-blue-900/30 min-h-[100px] mt-1 resize-none"
                        />
                    </div>
                </div>
             </div>
          )}

          {/* --- AI AGENT --- */}
          {currentNode.data.type === "ai-agent" && (
             <div className="space-y-4 p-5 bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/50 rounded-xl">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-violet-500"></div>
                    <Label className="text-violet-600 dark:text-violet-400 font-semibold text-base">AI Configuration</Label>
                </div>

                <div className="grid gap-4">
                    {/* Role Select */}
                    <div>
                        <Label className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Agent Role</Label>
                        <select 
                            value={currentNode.data.role || "assistant"}
                            className="w-full mt-1.5 p-2 rounded-md bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm focus:ring-2 focus:ring-violet-500 outline-none text-zinc-900 dark:text-zinc-200"
                            onChange={(e) => handleChange(e, 'role')}
                        >
                            <option value="assistant">General Assistant</option>
                            <option value="researcher">Web Researcher (CrewAI)</option>
                            <option value="writer">Content Writer</option>
                            <option value="coder">Code Reviewer</option>
                        </select>
                    </div>

                    {/* Prompt */}
                    <div>
                        <Label htmlFor="prompt" className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Goal / Prompt</Label>
                        <Textarea 
                            id="prompt" 
                            placeholder="e.g. Summarize this text..."
                            value={currentNode.data.prompt || ""}
                            onChange={(e) => handleChange(e, 'prompt')}
                            className="bg-white dark:bg-black border-zinc-200 dark:border-violet-900/30 min-h-[150px] mt-1.5 focus:border-violet-500 resize-none text-zinc-900 dark:text-zinc-100"
                        />
                    </div>
                </div>
             </div>
          )}

          {/* --- NOTION (Updated: Added Page ID) --- */}
          {currentNode.data.type === "notion" && (
             <div className="space-y-4 p-5 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-black dark:bg-white"></div>
                    <Label className="text-black dark:text-white font-semibold text-base">Notion Configuration</Label>
                </div>
                <div className="grid gap-3">
                    <div>
                        <Label className="text-xs text-zinc-500 dark:text-zinc-400">Database ID</Label>
                        <Input 
                            value={currentNode.data.databaseId || ""}
                            onChange={(e) => handleChange(e, 'databaseId')}
                            placeholder="e.g. 8a3b..."
                            className="bg-white dark:bg-black border-zinc-200 dark:border-zinc-700 mt-1"
                        />
                    </div>
                    {/* Added Page ID as per instructions */}
                    <div>
                        <Label className="text-xs text-zinc-500 dark:text-zinc-400">Page ID (Optional)</Label>
                        <Input 
                            value={currentNode.data.pageId || ""}
                            onChange={(e) => handleChange(e, 'pageId')}
                            placeholder="e.g. 1234abcd..."
                            className="bg-white dark:bg-black border-zinc-200 dark:border-zinc-700 mt-1"
                        />
                    </div>
                    <div>
                         <Label className="text-xs text-zinc-500 dark:text-zinc-400">Content (Page Title)</Label>
                         <Input 
                            value={currentNode.data.todo || ""}
                            onChange={(e) => handleChange(e, 'todo')}
                            placeholder="e.g. New Task from Orbit"
                            className="bg-white dark:bg-black border-zinc-200 dark:border-zinc-700 mt-1"
                        />
                    </div>
                </div>
             </div>
          )}

          {/* --- BROWSER / SCRAPER (Updated: Supports both 'browser' and 'web-scraper') --- */}
          {(currentNode.data.type === "browser" || currentNode.data.type === "web-scraper") && (
             <div className="space-y-4 p-5 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-xl">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    <Label className="text-orange-700 dark:text-orange-400 font-semibold text-base">Web Scraper</Label>
                </div>
                <div className="grid gap-3">
                    <div>
                        <Label className="text-xs text-zinc-500 dark:text-zinc-400">Target URL</Label>
                        <Input 
                            value={currentNode.data.url || ""}
                            onChange={(e) => handleChange(e, 'url')}
                            placeholder="https://en.wikipedia.org/wiki/AI"
                            className="bg-white dark:bg-black border-orange-200 dark:border-orange-900/30 text-zinc-900 dark:text-white mt-1"
                        />
                         <p className="text-[10px] text-zinc-500 mt-1">The agent will visit this page and extract text.</p>
                    </div>
                </div>
             </div>
          )}

        </div>
      </SheetContent>
    </Sheet>
  );
}