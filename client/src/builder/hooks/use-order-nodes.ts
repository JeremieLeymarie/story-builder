import { Edge, useReactFlow } from "@xyflow/react";
import { BuilderNode } from "../types";
import ELK from "elkjs/lib/elk.bundled.js";

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
  console.log({ nodes, edges });
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

export const useOrganizeNodes = () => {
  const { getNodes, getEdges, setNodes, fitView } = useReactFlow<BuilderNode>();

  const organizeNodes = async () => {
    const orderedNodes = await _getNodesLayout(
      getNodes() as BuilderNode[],
      getEdges(),
    );

    setNodes(orderedNodes);
    // TODO: save nodes
    fitView();
  };

  return { organizeNodes };
};
