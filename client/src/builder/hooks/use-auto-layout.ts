import { Edge, useReactFlow } from "@xyflow/react";
import { BuilderNode } from "../types";
import ELK from "elkjs/lib/elk.bundled.js";
import { useRef } from "react";
import { Scene } from "@/lib/storage/domain";
import { getBuilderService } from "@/services";
import { useBuilderContext } from "./use-builder-store";

// https://www.eclipse.org/elk/reference/algorithms/org-eclipse-elk-layered.html
const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.layered.spacing.edgeNodeBetweenLayers": "40",
  "elk.spacing.nodeNode": "40",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
};

const elk = new ELK(); // TODO: use with webworker? (https://github.com/kieler/elkjs?tab=readme-ov-file#usage)

const _getNodesLayout = async (nodes: BuilderNode[], edges: Edge[]) => {
  const graph = {
    id: "root",
    layoutOptions,
    children: nodes.map((n) => {
      // 'Ports' are elk's wording for 'handles'
      const targetPorts = n.data.actions.map((action) => ({
        id: `${action.sceneKey}`,
        properties: {
          side: "EAST", // handles are on the right
        },
      }));

      return {
        id: n.id,
        width: n.measured?.width ?? 375,
        height: n.measured?.height ?? 200,
        // This is needed to reduce 'edges crossing' cf (https://reactflow.dev/examples/layout/elkjs-multiple-handles)
        properties: {
          "org.eclipse.elk.portConstraints": "FIXED_ORDER",
        },
        ports: [{ id: n.id }, ...targetPorts],
      };
    }),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
  };

  const computedGraph = await elk.layout(graph);

  const computedNodes = nodes.map((node) => {
    const computedNode = computedGraph.children?.find(
      (lgNode) => lgNode.id === node.id,
    );

    return {
      ...node,
      position: {
        x: computedNode?.x ?? 0,
        y: computedNode?.y ?? 0,
      },
    };
  });

  return computedNodes;
};

export const useAutoLayout = () => {
  const { getNodes, getEdges } = useReactFlow<BuilderNode>();
  const stateBeforeChanges = useRef<Scene[]>(null);
  const { story, refresh } = useBuilderContext();
  const svc = getBuilderService();

  // TODO: some (or all?) of this logic belongs in builder service
  const organizeNodes = async () => {
    const { scenes: scenesBefore } = await svc.getBuilderStoryData(story.key);

    const orderedNodes = await _getNodesLayout(
      getNodes() as BuilderNode[],
      getEdges(),
    );

    stateBeforeChanges.current = JSON.parse(JSON.stringify(scenesBefore)); // Deep copy

    await svc.bulkUpdateScenes({
      scenes: scenesBefore.map((scene) => {
        const computedNode = orderedNodes.find((node) => node.id === scene.key);

        if (computedNode) {
          scene.builderParams.position = computedNode.position;
        }
        return scene;
      }),
    });
    refresh();
  };

  const revertChanges = async () => {
    if (!stateBeforeChanges.current) {
      throw new Error(
        "The previous state should always be set when reverting to previous state",
      );
    }
    await svc.bulkUpdateScenes({ scenes: stateBeforeChanges.current });
    refresh();
  };

  return { organizeNodes, revertChanges };
};
