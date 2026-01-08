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
  // (Ye line magic karegi: Ye ensure karegi ki hum hamesha latest data dekh rahe hain)
  const currentNode = nodes.find((n) => n.id === selectedNode?.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
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
      <SheetContent className="bg-zinc-900 border-l border-zinc-800 text-white w-[400px] sm:w-[540px] shadow-2xl">
        <SheetHeader className="mb-6 border-b border-zinc-800 pb-4">
          <SheetTitle className="text-white text-xl flex items-center gap-2">
            <span className="p-2 bg-zinc-800 rounded-lg text-sm border border-zinc-700 shadow-sm">
                {/* Node type dikhao */}
                {currentNode.data.type?.toUpperCase() || "NODE"}
            </span>
            Configuration
          </SheetTitle>
          <SheetDescription className="text-zinc-400">
            Configure the properties for this specific step.
          </SheetDescription>
        </SheetHeader>

        {/* --- FORM FIELDS (Using currentNode instead of selectedNode) --- */}
        <div className="grid gap-6 py-4">
          
          {/* Universal Field: Name/Label */}
          <div className="grid gap-3">
            <Label htmlFor="label" className="text-zinc-300 font-medium">Step Name</Label>
            <Input 
                id="label" 
                // IMPORTANT: Use currentNode here
                value={currentNode.data.label || ""} 
                onChange={(e) => handleChange(e, 'label')}
                className="bg-zinc-950 border-zinc-800 focus:border-violet-500 transition-colors h-10"
            />
          </div>

          {/* --- GOOGLE DRIVE --- */}
          {currentNode.data.type === "google-drive" && (
             <div className="space-y-4 p-5 bg-green-950/20 border border-green-900/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <Label className="text-green-400 font-semibold text-base">Drive Settings</Label>
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="folder" className="text-xs text-zinc-400 uppercase tracking-wider">Folder ID</Label>
                    <Input 
                        id="folder" 
                        placeholder="Paste Folder ID here..." 
                        value={currentNode.data.folderId || ""}
                        onChange={(e) => handleChange(e, 'folderId')}
                        className="bg-black/40 border-green-900/30 text-green-100 placeholder:text-green-900/50 focus:border-green-500/50"
                    />
                </div>
             </div>
          )}

          {/* --- SLACK / DISCORD (Updated Section) --- */}
          {currentNode.data.type === "slack" && (
             <div className="space-y-4 p-5 bg-pink-950/20 border border-pink-900/50 rounded-xl">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                    <Label className="text-pink-400 font-semibold text-base">Slack/Discord Webhook</Label>
                </div>

                <div className="grid gap-3">
                    <div>
                        <Label htmlFor="webhook" className="text-xs text-zinc-400 uppercase tracking-wider">Webhook URL</Label>
                        <Input 
                            id="webhook" 
                            placeholder="https://discord.com/api/webhooks/..."
                            value={currentNode.data.slackWebhook || ""} // New Field
                            onChange={(e) => handleChange(e, 'slackWebhook')}
                            className="bg-black/40 border-pink-900/30 mt-1.5 focus:border-pink-500/50 text-xs font-mono"
                        />
                        <p className="text-[10px] text-zinc-500 mt-1">Paste your Slack or Discord Webhook URL here.</p>
                    </div>
                    <div>
                        <Label htmlFor="message" className="text-xs text-zinc-400 uppercase tracking-wider">Message</Label>
                        <Textarea 
                            id="message" 
                            placeholder="Hello World from Orbit!"
                            value={currentNode.data.message || ""}
                            onChange={(e) => handleChange(e, 'message')}
                            className="bg-black/40 border-pink-900/30 min-h-[100px] mt-1.5 focus:border-pink-500/50 resize-none"
                        />
                    </div>
                </div>
             </div>
          )}

           {/* --- EMAIL --- */}
           {currentNode.data.type === "email" && (
             <div className="space-y-4 p-5 bg-blue-950/20 border border-blue-900/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <Label className="text-blue-400 font-semibold text-base">Email Configuration</Label>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="subject" className="text-xs text-zinc-400 uppercase tracking-wider">Subject</Label>
                    <Input 
                        id="subject" 
                        placeholder="Subject Line"
                        value={currentNode.data.subject || ""}
                        onChange={(e) => handleChange(e, 'subject')}
                        className="bg-black/40 border-blue-900/30 focus:border-blue-500/50"
                    />
                </div>
             </div>
          )}

        </div>
      </SheetContent>
    </Sheet>
  );
}