import { Card } from "@/components/ui/card";
import { Slack, Mail, FileText, HardDrive } from "lucide-react"; // Import Icons

export default function Tray() {
  // Logic: Jab drag start ho, browser ko batao ki "kya" drag ho raha hai
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-[200px] border-r border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="text-sm font-bold text-zinc-400 mb-2">Tools</div>
      
      {/* Draggable Node: Trigger */}
      <div
        className="cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={(e) => onDragStart(e, "trigger")}
      >
        <Card className="p-3 bg-zinc-800 border-zinc-700 hover:border-violet-500 transition flex items-center gap-2 text-white">
          <FileText className="h-4 w-4 text-violet-400" />
          <span className="text-sm">Trigger</span>
        </Card>
      </div>

      {/* Draggable Node: Google Drive */}
      <div
        className="cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={(e) => onDragStart(e, "google-drive")}
      >
        <Card className="p-3 bg-zinc-800 border-zinc-700 hover:border-green-500 transition flex items-center gap-2 text-white">
          <HardDrive className="h-4 w-4 text-green-400" />
          <span className="text-sm">Google Drive</span>
        </Card>
      </div>

      {/* Draggable Node: Slack */}
      <div
        className="cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={(e) => onDragStart(e, "slack")}
      >
        <Card className="p-3 bg-zinc-800 border-zinc-700 hover:border-pink-500 transition flex items-center gap-2 text-white">
          <Slack className="h-4 w-4 text-pink-400" />
          <span className="text-sm">Slack</span>
        </Card>
      </div>
      
       {/* Draggable Node: Email */}
       <div
        className="cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={(e) => onDragStart(e, "email")}
      >
        <Card className="p-3 bg-zinc-800 border-zinc-700 hover:border-blue-500 transition flex items-center gap-2 text-white">
          <Mail className="h-4 w-4 text-blue-400" />
          <span className="text-sm">Send Email</span>
        </Card>
      </div>

      {/* Draggable Node: AI Agent (New Addition) */}
      <div
        className="cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={(e) => onDragStart(e, "ai-agent")}
      >
        <Card className="p-3 bg-zinc-800 border-zinc-700 hover:border-violet-500 transition flex items-center gap-2 text-white">
          <div className="h-4 w-4 bg-violet-600 rounded-full flex items-center justify-center text-[10px]">AI</div>
          <span className="text-sm">AI Agent</span>
        </Card>
      </div>

    </aside>
  );
}