"use client";

import { memo } from "react";
// 👇 CHANGE THIS LINE: from 'reactflow' to '@xyflow/react'
import { Handle, Position, useNodeId } from "@xyflow/react"; 
import { 
  Zap, 
  Slack, 
  FileText, 
  HardDrive, 
  Mail, 
  Globe, 
  BrainCircuit, 
  Database,
  MousePointerClick
} from "lucide-react";
import { Card } from "@/components/ui/card";

const iconMap: Record<string, any> = {
  trigger: Zap,
  slack: Slack,
  "ai-agent": BrainCircuit,
  "google-drive": HardDrive,
  notion: FileText,
  "web-scraper": Globe,
  "send-email": Mail,
  browser: Globe,
  email: Mail
};

const colorMap: Record<string, string> = {
  trigger: "text-yellow-500",
  slack: "text-pink-500",
  "ai-agent": "text-violet-500",
  "google-drive": "text-green-500",
  notion: "text-zinc-500",
  "web-scraper": "text-orange-500",
  "send-email": "text-blue-500",
  browser: "text-orange-500",
  email: "text-blue-500"
};

const CustomNode = ({ data, selected }: any) => {
  const Icon = iconMap[data.type] || Zap;
  const colorClass = colorMap[data.type] || "text-zinc-500";

  return (
    <Card 
      className={`
        relative min-w-[200px] border-2 bg-white dark:bg-zinc-900 transition-all shadow-lg
        ${selected ? "border-indigo-500 shadow-indigo-500/20" : "border-transparent dark:border-zinc-800"}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 p-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className={`h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center ${colorClass}`}>
          <Icon size={16} />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none">
            {data.label || "New Node"}
          </p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
            {data.type?.replace("-", " ")}
          </p>
        </div>
      </div>

      {/* INPUT HANDLES (Left) - Not for Trigger */}
      {data.type !== "trigger" && (
        <Handle 
            type="target" 
            position={Position.Left} 
            className="w-3 h-3 bg-zinc-400 border-2 border-white dark:border-zinc-900" 
        />
      )}

      {/* OUTPUT HANDLES (Right) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-indigo-500 border-2 border-white dark:border-zinc-900" 
      />
    </Card>
  );
};

export default memo(CustomNode);