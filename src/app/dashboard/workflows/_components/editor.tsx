"use client";

import { workflows } from "@/lib/db/schema";
import { 
    ReactFlow, 
    Background, 
    Controls, 
    useNodesState, 
    useEdgesState,
    addEdge,
    Connection,
    ReactFlowProvider,
    useReactFlow,
    BackgroundVariant,
    MiniMap
} from "@xyflow/react";
import "@xyflow/react/dist/style.css"; 
import { useCallback, useRef, useState, useEffect } from "react"; 
import { useTheme } from "next-themes"; 
import Tray from "./Tray"; 
import { updateWorkflow, runWorkflow } from "@/app/actions/workflows";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Play } from "lucide-react";
import { toast } from "sonner"; 

import CustomNode from "./CustomNode"; 
import SettingsPanel from "./SettingsPanel";

type Workflow = typeof workflows.$inferSelect;

interface EditorProps {
  workflow: Workflow;
}

// ==================================================
// 1. NODE TYPES CONFIGURATION
// ==================================================
const nodeTypes = {
  OrbitNode: CustomNode, // Legacy support
  trigger: CustomNode,
  "google-drive": CustomNode,
  slack: CustomNode,
  notion: CustomNode,
  "ai-agent": CustomNode,
  "web-scraper": CustomNode,
  "send-email": CustomNode,
  browser: CustomNode,
  email: CustomNode
};

// ==================================================
// 2. OUTER COMPONENT (Context Provider Wrapper)
// ==================================================
export default function Editor({ workflow }: EditorProps) {
    return (
        <ReactFlowProvider>
            <div className="flex flex-col h-full w-full overflow-hidden transition-colors duration-300">
                <FlowEditor workflow={workflow} />
            </div>
        </ReactFlowProvider>
    )
}

// ==================================================
// 3. INNER COMPONENT (Logic & Canvas)
// ==================================================
function FlowEditor({ workflow }: EditorProps) {
  const { theme } = useTheme(); 
  const [mounted, setMounted] = useState(false); 

  // --------------------------------------------------------
  // 🛠️ FIX: Use CSS Variable for Edges (Instant Theme Switch)
  // --------------------------------------------------------
  const defaultEdgeOptions = {
    animated: true,
    style: { stroke: "var(--edge-color)", strokeWidth: 2 },
    type: 'default',
  };

  // Load initial data & Force CSS Variable on existing edges
  const initialNodes = workflow.nodes ? JSON.parse(workflow.nodes as string) : [];
  const initialEdges = workflow.edges 
    ? JSON.parse(workflow.edges as string).map((edge: any) => ({
        ...edge,
        style: { stroke: "var(--edge-color)", strokeWidth: 2 }, // Force style on load
        animated: true,
      })) 
    : [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [saving, setSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null); 
  const { screenToFlowPosition } = useReactFlow(); 

  // Wait for Client Mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  }, []);

  // Updated onConnect: No longer depends on 'theme' state!
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
        ...params,
        animated: true,
        style: { 
            stroke: "var(--edge-color)", // Use CSS var here too
            strokeWidth: 2 
        } 
    }, eds)),
    [setEdges], // Removed 'theme' dependency
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: crypto.randomUUID(),
        type: type, 
        position,
        data: { 
            label: type === 'trigger' ? 'Webhook Trigger' : `${type.charAt(0).toUpperCase() + type.slice(1)} Node`, 
            type: type, 
            description: "Click to configure"
        },
      };

      setNodes((nds) => nds.concat(newNode));
      toast.success(`${type} node added`); 
    },
    [screenToFlowPosition, setNodes],
  );

  const onSave = async () => {
     setSaving(true);
     try {
        await updateWorkflow(
            workflow.id, 
            JSON.stringify(nodes), 
            JSON.stringify(edges)
        );
        toast.success("Workflow Saved! 💾"); 
     } catch (err) {
        console.error(err);
        toast.error("Failed to save");
     } finally {
        setSaving(false);
     }
  };

  const onRun = async () => {
     setIsRunning(true);
     await onSave(); 
     
     try {
        const result = await runWorkflow(workflow.id);
        
        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.message("Execution Finished", {
            description: (
                <div className="flex flex-col gap-1 mt-2 max-h-[200px] overflow-y-auto p-2 bg-zinc-100 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800">
                    {result.logs?.map((log: string, i: number) => (
                        <span key={i} className="text-xs font-mono text-zinc-600 dark:text-zinc-400 break-all">
                            {log}
                        </span>
                    ))}
                </div>
            ),
            duration: 6000, 
        });

     } catch (err) {
        toast.error("Execution failed");
     } finally {
        setIsRunning(false);
     }
  };

  if (!mounted) {
    return (
        <div className="h-full w-full flex items-center justify-center bg-zinc-50 dark:bg-[#0a0a0a]">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
    );
  }

  return (
    <>
       {/* 1. TOP BAR */}
       <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black h-16 shrink-0 transition-colors duration-300">
            <h2 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                {workflow.name}
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    {workflow.status}
                </span>
            </h2>
            <div className="flex gap-2">
                <Button 
                    onClick={onRun} 
                    disabled={isRunning || saving} 
                    className="bg-green-600 text-white hover:bg-green-700 border-green-500"
                >
                    {isRunning ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2 fill-current" />}
                    Run
                </Button>

                <Button onClick={onSave} disabled={saving || isRunning} variant="outline" className="text-zinc-700 dark:text-white bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save
                </Button>
            </div>
       </div>
       
       {/* 2. MAIN CONTENT AREA */}
       <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden">
            <Tray />
            
            {/* Canvas Area */}
            <div className="flex-1 h-full w-full bg-zinc-50 dark:bg-[#0a0a0a] relative transition-colors duration-300" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onNodeClick={onNodeClick} 
                    nodeTypes={nodeTypes}
                    defaultEdgeOptions={defaultEdgeOptions} // 👈 Added default options here
                    fitView
                >
                    <Background 
                        color={theme === 'dark' ? '#333' : '#e1e1e1'} 
                        gap={20} 
                        size={1} 
                        variant={BackgroundVariant.Dots}
                    />
                    
                    <Controls className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 fill-zinc-900 dark:fill-white" />
                    <MiniMap className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                </ReactFlow>
            </div>
       </div>

       {/* SETTINGS PANEL */}
       <SettingsPanel 
            selectedNode={selectedNode} 
            setNodes={setNodes}
            onClose={() => setSelectedNode(null)}
       />
    </>
  );
}