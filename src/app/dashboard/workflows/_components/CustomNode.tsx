"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handle, Position } from "@xyflow/react";
import { FileText, HardDrive, Mail, Slack, BrainCircuit } from "lucide-react"; // Added BrainCircuit

// Icon Map: Node ke type ke hisab se icon choose karega
const iconMap: Record<string, any> = {
  "trigger": FileText,
  "google-drive": HardDrive,
  "slack": Slack,
  "email": Mail,
  "ai-agent": BrainCircuit, // New AI Icon
};

const colorMap: Record<string, string> = {
  "trigger": "text-violet-400",
  "google-drive": "text-green-400",
  "slack": "text-pink-400",
  "email": "text-blue-400",
  "ai-agent": "text-violet-500", // New AI Color
};

export default function CustomNode({ data }: { data: any }) {
  const Icon = iconMap[data.type] || FileText; // Default icon
  const color = colorMap[data.type] || "text-zinc-400"; // Default color

  return (
    <div className="relative">
      {/* INPUT HANDLE (Top) - Connect from previous node */}
      {/* Trigger node ko input nahi chahiye, baaki sabko chahiye */}
      {data.type !== "trigger" && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-zinc-400 !w-3 !h-3 !-top-2 !border-2 !border-black"
        />
      )}

      {/* THE CARD UI */}
      <Card className="w-[250px] border-zinc-700 bg-zinc-900 shadow-xl transition-all hover:border-zinc-500 hover:shadow-2xl hover:shadow-violet-500/10">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <div className={`p-2 rounded-lg bg-zinc-800 ${color} shadow-inner`}>
             <Icon className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-md font-bold text-white">
                {data.label}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
                {data.description || "Configure this action"}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* OUTPUT HANDLE (Bottom) - Connect to next node */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-zinc-400 !w-3 !h-3 !-bottom-2 !border-2 !border-black"
      />
    </div>
  );
}