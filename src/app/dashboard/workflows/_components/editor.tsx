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
    useReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css"; 
import { useCallback, useRef, useState, useEffect, useMemo } from "react"; 
import Tray from "./Tray"; 
// UPDATED IMPORT: Added runWorkflow
import { updateWorkflow, runWorkflow } from "@/app/actions/workflows";
import { Button } from "@/components/ui/button";
// UPDATED IMPORT: Added Play icon
import { Save, Loader2, Play } from "lucide-react";
import { toast } from "sonner"; 

import CustomNode from "./CustomNode"; 
import SettingsPanel from "./SettingsPanel";


type Workflow = typeof workflows.$inferSelect;

interface EditorProps {
  workflow: Workflow;
}

export default function Editor({ workflow }: EditorProps) {
    return (
        // Provider ko height de di taaki wo collapse na ho
        <ReactFlowProvider>
            <div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden">
                <FlowEditor workflow={workflow} />
            </div>
        </ReactFlowProvider>
    )
}

function FlowEditor({ workflow }: EditorProps) {
  // Load initial data safely
  const initialNodes = workflow.nodes ? JSON.parse(workflow.nodes as string) : [];
  const initialEdges = workflow.edges ? JSON.parse(workflow.edges as string) : [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [saving, setSaving] = useState(false);
  
  // NEW: State for running simulation
  const [isRunning, setIsRunning] = useState(false);

  // NEW: State for selected node
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null); 
  const { screenToFlowPosition } = useReactFlow(); 

  // DEFINE CUSTOM NODE TYPES
  // React Flow ko batao ki humara custom node use kare
  const nodeTypes = useMemo(() => ({
    OrbitNode: CustomNode, 
  }), []);

  // Debugging: Check if component mounted
  useEffect(() => {
    console.log("Editor Mounted. Initial Nodes:", nodes);
  }, []);

  // NEW: Handle Click on Node
  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    // console.log("Dragging over canvas..."); // Uncomment to debug drag
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const type = event.dataTransfer.getData('application/reactflow');
      console.log("Dropped Item Type:", type); // <--- CHECK CONSOLE FOR THIS

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: crypto.randomUUID(),
        type: 'OrbitNode', // <--- CHANGED from 'default' to 'OrbitNode'
        position,
        data: { 
            label: type === 'trigger' ? 'Webhook Trigger' : `${type} Action`, // Better names
            type: type, // Pass the type (google-drive, slack) so CustomNode can pick icon
            description: "Not configured yet"
        },
      };

      setNodes((nds) => nds.concat(newNode));
      toast.success("Node added!"); 
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

  // NEW: Run Workflow Function
  const onRun = async () => {
     setIsRunning(true);
     // 1. Pehle Save karo (taaki latest changes run hon)
     await onSave(); 
     
     try {
        // 2. Run Server Action
        const result = await runWorkflow(workflow.id);
        
        if (!result.success) {
            toast.error(result.message);
            return;
        }

        // 3. Show Logs (Hacker Style)
        toast.message("Execution Finished", {
            description: (
                <div className="flex flex-col gap-1 mt-2 p-2 bg-zinc-900 rounded-md border border-zinc-800">
                    {result.logs?.map((log: string, i: number) => (
                        <span key={i} className="text-xs font-mono text-zinc-400">
                            {log}
                        </span>
                    ))}
                </div>
            ),
            duration: 5000, // 5 seconds tak dikhao
        });

     } catch (err) {
        toast.error("Execution failed");
        console.error(err);
     } finally {
        setIsRunning(false);
     }
  };

  return (
    <>
       {/* Top Bar */}
       <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900 h-16 shrink-0">
            <h2 className="font-bold text-white">{workflow.name}</h2>
            <div className="flex gap-2">
                {/* RUN BUTTON */}
                <Button 
                    onClick={onRun} 
                    disabled={isRunning || saving} 
                    className="bg-green-600 text-white hover:bg-green-700 border-green-500"
                >
                    {isRunning ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2 fill-current" />}
                    Run
                </Button>

                {/* SAVE BUTTON */}
                <Button onClick={onSave} disabled={saving || isRunning} variant="outline" className="text-black bg-white hover:bg-zinc-200">
                    {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save
                </Button>
            </div>
       </div>
       
       {/* Main Content Area */}
       <div className="flex flex-1 h-[calc(100vh-64px)] w-full">
            <Tray />
            
            {/* Canvas Area */}
            <div className="flex-1 h-full w-full bg-zinc-950 relative" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onNodeClick={onNodeClick} // <--- ADDED THIS PROP
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Background color="#555" gap={20} size={1} />
                    <Controls className="bg-white text-black" />
                </ReactFlow>
            </div>
       </div>

       {/* THE SETTINGS PANEL (Renders on top or side depending on CSS) */}
       <SettingsPanel 
            selectedNode={selectedNode} 
            setNodes={setNodes}
            onClose={() => setSelectedNode(null)}
       />
    </>
  );
}