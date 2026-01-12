"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNodes } from "@xyflow/react"; 
import { HardDrive, CheckCircle2, FileText, Folder, Lock, Globe, Mail, Bot, MessageSquare, Database, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getGoogleAuthUrl, getDriveFiles, checkGoogleConnection } from "@/app/actions/google"; // 👈 Added checkGoogleConnection

interface SettingsPanelProps {
  selectedNode: { id: string; type: string; data: any } | null;
  setNodes: any; 
  onClose: () => void; 
}

export default function SettingsPanel({ selectedNode, setNodes, onClose }: SettingsPanelProps) {
  const [isConnected, setIsConnected] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); // 👈 New Loading State
  
  // STATE FOR REAL FILES
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // 1. Get ALL current nodes from React Flow state
  const nodes = useNodes();

  // 2. Find the LIVE version of the selected node to ensure real-time updates
  const currentNode = nodes.find((n) => n.id === selectedNode?.id);

  // Helper function defined early so useEffect can use it
  const fetchFiles = async () => {
    setLoadingFiles(true);
    const result = await getDriveFiles();
    if (result.success && result.files) {
        setDriveFiles(result.files);
    } else {
        toast.error(result.message || "Failed to fetch files");
    }
    setLoadingFiles(false);
  };

  // 👇 NEW: Check Connection on Mount or Node Change
  useEffect(() => {
    const init = async () => {
      // Agar node Google Drive hai, tabhi check karo
      if (selectedNode?.data.type === "google-drive") {
        setIsLoading(true);
        try {
          const connected = await checkGoogleConnection(); // Server Action
          setIsConnected(connected);
          
          if (connected) {
            await fetchFiles(); // Agar connected hai, files load kar lo
          }
        } catch (error) {
          console.error("Connection check failed", error);
        }
        setIsLoading(false);
      } else {
        // Reset states for other nodes
        setIsConnected(false);
        setDriveFiles([]);
      }
    };

    if (selectedNode) {
      init();
    }
  }, [selectedNode?.id]); // Run whenever node changes

  // 3. Handle Google Connection (Popup)
  const handleConnectGoogle = async () => {
      try {
        const url = await getGoogleAuthUrl();
        if (url) {
            window.open(url, "_blank", "width=600,height=600");
        }
      } catch (error) {
        toast.error("Failed to start Google Auth");
      }
  };

  // 4. Listen for Success Message from Popup
  useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
          if (event.data === "google-connected") {
              setIsConnected(true);
              toast.success("Drive Connected!");
              fetchFiles(); // Auto fetch files immediately
          }
      };
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!selectedNode || !currentNode) return null;

  // Universal Handler
  const handleChange = (e: any, field: string) => {
    setNodes((nds: any[]) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: { ...node.data, [field]: e.target.value },
          };
        }
        return node;
      })
    );
  };

  // Specific Handler for File Selection
  const handleSelectFile = (fileId: string, fileName: string) => {
      setNodes((nds: any[]) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: { ...node.data, fileId, fileName }, // Save Name too
            };
          }
          return node;
        })
      );
      toast.success(`Selected: ${fileName}`);
  };

  // Helper to get Icon based on type
  const getNodeIcon = (type: string) => {
      switch(type) {
          case 'google-drive': return <HardDrive size={20} />;
          case 'ai-agent': return <Bot size={20} />;
          case 'slack': return <MessageSquare size={20} />;
          case 'email': 
          case 'send-email': return <Mail size={20} />;
          case 'web-scraper': return <Globe size={20} />;
          case 'notion': return <Database size={20} />;
          default: return <Folder size={20} />;
      }
  }

  return (
    <Sheet open={!!selectedNode} onOpenChange={() => onClose()}>
      <SheetContent className="bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 w-[400px] sm:w-[500px] overflow-y-auto shadow-2xl">
        
        {/* --- HEADER --- */}
        <SheetHeader className="mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                 {getNodeIcon(currentNode.data.type)}
             </div>
             <div>
                 <SheetTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                    {currentNode.data.label || currentNode.data.type}
                 </SheetTitle>
                 <SheetDescription className="text-zinc-500 dark:text-zinc-400">
                    Configure your {currentNode.data.type.replace('-', ' ')} settings.
                 </SheetDescription>
             </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          
          {/* Universal Name Input */}
          <div>
            <Label className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Step Name</Label>
            <Input 
                value={currentNode.data.label || ""}
                onChange={(e) => handleChange(e, 'label')}
                className="mt-1.5 bg-white dark:bg-black/40"
            />
          </div>
          
          {/* =======================
              GOOGLE DRIVE SETTINGS
             ======================= */}
          {currentNode.data.type === "google-drive" && (
             <div className="space-y-4">
                 {/* 👇 LOADING STATE UI */}
                 {isLoading ? (
                     <div className="flex flex-col items-center justify-center py-8 space-y-3 text-zinc-500">
                         <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                         <span className="text-sm">Checking connection...</span>
                     </div>
                 ) : !isConnected ? (
                     <div className="p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center gap-4 bg-zinc-50 dark:bg-zinc-900/50">
                         <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600">
                             <HardDrive size={24} />
                         </div>
                         <div>
                             <p className="font-bold text-zinc-900 dark:text-white">Connect Google Drive</p>
                             <p className="text-xs text-zinc-500">Access your docs and sheets.</p>
                         </div>
                         <Button 
                           onClick={handleConnectGoogle} 
                           className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90"
                         >
                             Sign in with Google
                         </Button>
                     </div>
                 ) : (
                     <>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900 rounded-lg">
                            <span className="text-xs font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                                <CheckCircle2 size={14} /> Account Connected
                            </span>
                            <span className="text-[10px] text-green-600 cursor-pointer hover:underline" onClick={() => setIsConnected(false)}>Disconnect</span>
                        </div>

                        <div>
                            {/* Header with Refresh Button */}
                            <div className="flex justify-between items-center mb-2">
                                <Label className="text-xs text-zinc-500 uppercase tracking-wider">Recent Files</Label>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-[10px]"
                                    onClick={fetchFiles} 
                                    disabled={loadingFiles}
                                >
                                    {loadingFiles ? <Loader2 className="animate-spin h-3 w-3" /> : "Refresh"}
                                </Button>
                            </div>

                            {/* REAL FILES LIST */}
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                {driveFiles.length === 0 && !loadingFiles && (
                                    <p className="text-xs text-zinc-500 text-center py-4 italic">No files found or access denied.</p>
                                )}
                                
                                {driveFiles.map((file) => (
                                    <div 
                                        key={file.id} 
                                        onClick={() => handleSelectFile(file.id, file.name)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${currentNode.data.fileId === file.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
                                    >
                                        <FileText size={18} className="text-zinc-400" />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium truncate text-zinc-900 dark:text-white">{file.name}</p>
                                            <p className="text-[10px] text-zinc-500 uppercase">{file.mimeType?.split('.').pop() || 'FILE'}</p>
                                        </div>
                                        {currentNode.data.fileId === file.id && <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                     </>
                 )}
             </div>
          )}

          {/* =======================
              AI AGENT SETTINGS
             ======================= */}
          {currentNode.data.type === "ai-agent" && (
             <div className="space-y-4">
                 <div>
                     <Label className="text-xs text-zinc-500 uppercase tracking-wider">Role</Label>
                     <div className="grid grid-cols-3 gap-2 mt-2">
                         {['Assistant', 'Researcher', 'Coder'].map(role => (
                             <div 
                                key={role}
                                onClick={() => handleChange({ target: { value: role.toLowerCase() } }, 'role')}
                                className={`border rounded-md p-2 text-center text-xs font-medium cursor-pointer transition-all ${currentNode.data.role === role.toLowerCase() ? 'bg-violet-100 dark:bg-violet-900/30 border-violet-500 text-violet-700 dark:text-violet-300' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
                             >
                                 {role}
                             </div>
                         ))}
                     </div>
                 </div>
                 <div>
                     <Label>Prompt</Label>
                     <Textarea 
                        value={currentNode.data.prompt || ""}
                        onChange={(e) => handleChange(e, 'prompt')}
                        placeholder="e.g. Summarize the connected file..." 
                        className="min-h-[150px] mt-2 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:border-violet-500"
                     />
                 </div>
             </div>
          )}

          {/* =======================
              SLACK / EMAIL
             ======================= */}
          {(currentNode.data.type === "slack" || currentNode.data.type === "send-email" || currentNode.data.type === "email") && (
             <div className="space-y-4">
                 <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg flex items-start gap-3">
                     <Lock className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                     <div>
                         <p className="text-xs font-bold text-yellow-700 dark:text-yellow-500">Secure Credential</p>
                         <p className="text-[10px] text-yellow-600 dark:text-yellow-400 mt-1">We encrypt your webhooks and keys. Never share them publicly.</p>
                     </div>
                 </div>
                 
                 {currentNode.data.type === "slack" ? (
                     <div>
                         <Label>Webhook URL</Label>
                         <Input 
                           type="password"
                           value={currentNode.data.slackWebhook || ""}
                           onChange={(e) => handleChange(e, 'slackWebhook')}
                           placeholder="https://hooks.slack.com/services/..." 
                           className="mt-2"
                         />
                     </div>
                 ) : (
                     <>
                        <div>
                            <Label>To Email</Label>
                            <Input 
                                value={currentNode.data.emailTo || ""}
                                onChange={(e) => handleChange(e, 'emailTo')}
                                placeholder="boss@company.com" 
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label>Subject</Label>
                            <Input 
                                value={currentNode.data.emailSubject || ""}
                                onChange={(e) => handleChange(e, 'emailSubject')}
                                placeholder="Summary Report" 
                                className="mt-2"
                            />
                        </div>
                     </>
                 )}
             </div>
          )}

          {/* =======================
              WEB SCRAPER
             ======================= */}
          {(currentNode.data.type === "web-scraper" || currentNode.data.type === "browser") && (
             <div className="space-y-4">
                 <Label>Target URL</Label>
                 <div className="flex gap-2">
                     <div className="flex-1">
                        <Input 
                            value={currentNode.data.url || ""}
                            onChange={(e) => handleChange(e, 'url')}
                            placeholder="https://en.wikipedia.org/wiki/..." 
                        />
                     </div>
                     <Button size="icon" variant="outline" onClick={() => window.open(currentNode.data.url, '_blank')}>
                         <Globe size={16} />
                     </Button>
                 </div>
                 <p className="text-[10px] text-zinc-500">
                     Note: Some sites block scrapers. Wikipedia, news sites, and blogs work best.
                 </p>
             </div>
          )}
          
          {/* =======================
              NOTION
             ======================= */}
           {currentNode.data.type === "notion" && (
             <div className="space-y-4">
                 <div>
                    <Label className="text-xs text-zinc-500">Database ID</Label>
                    <Input 
                        value={currentNode.data.databaseId || ""}
                        onChange={(e) => handleChange(e, 'databaseId')}
                        placeholder="e.g. 8a3b..."
                        className="mt-1"
                    />
                 </div>
                 <div>
                    <Label className="text-xs text-zinc-500">Page Content</Label>
                    <Input 
                        value={currentNode.data.todo || ""}
                        onChange={(e) => handleChange(e, 'todo')}
                        placeholder="e.g. New Entry"
                        className="mt-1"
                    />
                 </div>
             </div>
           )}

        </div>
      </SheetContent>
    </Sheet>
  );
}