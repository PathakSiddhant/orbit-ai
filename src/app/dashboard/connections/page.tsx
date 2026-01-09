"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Slack, FileText, HardDrive, Zap, ArrowUpRight, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Mock Apps List
const APPS = [
    { name: "Google Drive", desc: "Read/Write files.", icon: HardDrive, color: "from-green-500 to-emerald-700", connected: false },
    { name: "Notion", desc: "Sync databases.", icon: FileText, color: "from-zinc-500 to-black", connected: false },
    { name: "Slack", desc: "Send alerts.", icon: Slack, color: "from-pink-500 to-purple-700", connected: false }, // Initially false for demo
    { name: "Discord", desc: "Community bot.", icon: Zap, color: "from-indigo-500 to-blue-700", connected: false },
];

export default function ConnectionsPage() {
  const [apps, setApps] = useState(APPS);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [apiKey, setApiKey] = useState("");

  const handleConnect = () => {
    // Simulate API Connection
    if (!apiKey) return toast.error("Please enter an API Key");
    
    setTimeout(() => {
        setApps(apps.map(a => a.name === selectedApp.name ? { ...a, connected: true } : a));
        toast.success(`${selectedApp.name} Connected Successfully!`);
        setSelectedApp(null);
        setApiKey("");
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Connections</h1>
        <p className="text-muted-foreground">Manage your API keys and integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, i) => (
            <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative group h-64 rounded-3xl border overflow-hidden flex flex-col justify-between p-6 transition-all ${app.connected ? 'bg-background border-green-500/50' : 'bg-card hover:border-indigo-500/50'}`}
            >
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg`}>
                            <app.icon size={24} />
                        </div>
                        {app.connected && (
                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold border border-green-500/20 flex items-center gap-1">
                                <CheckCircle2 size={12} /> Connected
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{app.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{app.desc}</p>
                </div>

                <Button 
                    onClick={() => !app.connected && setSelectedApp(app)}
                    className={`w-full ${app.connected ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}
                    disabled={app.connected}
                >
                    {app.connected ? "Connected" : "Connect App"} 
                </Button>
            </motion.div>
        ))}
      </div>

      {/* CONNECTION DIALOG (MODAL) */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect {selectedApp?.name}</DialogTitle>
            <DialogDescription>
              Enter your API Key / Webhook URL to authorize Orbit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key / Webhook</Label>
              <Input 
                id="apiKey" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                type="password"
                placeholder={`sk_prod_...`} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleConnect}>Save & Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}