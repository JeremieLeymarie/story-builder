import { useCallback, useEffect, useMemo, MouseEvent } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { BuilderNode } from "./types";
import { SceneNode } from "./nodes/scene/scene";
import { Toolbar } from "./toolbar";
import { Scene } from "@/lib/storage/dexie-db";
import { getRepository } from "@/lib/storage/indexed-db-repository";

const nodeTypes = { scene: SceneNode };

type BuilderProps = { storyId: number; scenes: Scene[] };

export const Builder = ({ storyId, scenes }: BuilderProps) => {
  // TODO: add position to db
  // TODO: use adapter
  const sceneNodes: BuilderNode[] = useMemo(
    () =>
      scenes.map((scene) => ({
        id: scene.id.toString(),
        position: scene.builderParams.position,
        type: "scene",
        data: scene,
      })),
    [scenes]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(sceneNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(sceneNodes);
  }, [sceneNodes, setNodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // TODO: use better typing
  const onNodeMove = useCallback((_: MouseEvent, node: Node) => {
    getRepository().updateScene({
      ...node.data,
      builderParams: { position: node.position },
    });
  }, []);

  return (
    <div className="w-full h-full border flex">
      <Toolbar storyId={storyId} />
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeMove}
        minZoom={0.05}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
