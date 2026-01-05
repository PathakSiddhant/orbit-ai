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
    Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css"; // CSS Import zaroori hai
import { useCallback } from "react";

type Workflow = typeof workflows.$inferSelect;

interface EditorProps {
  workflow: Workflow;
}

// Initial dummy nodes (baad mein DB se aayenge)
const initialNodes = [
  { 
    id: '1', 
    position: { x: 100, y: 100 }, 
    data: { label: 'Start (Trigger)' },
    type: 'input' // Input node
  },
  { 
    id: '2', 
    position: { x: 100, y: 300 }, 
    data: { label: 'Action (Google Drive)' },
  },
];

export default function Editor({ workflow }: EditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Wire connect karne ka logic
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="h-[calc(100vh-100px)] w-full text-black"> 
      {/* React Flow Container */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="#555" gap={25} />
        <Controls />
      </ReactFlow>
    </div>
  );
}