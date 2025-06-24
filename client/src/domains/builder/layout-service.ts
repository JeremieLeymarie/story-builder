import { BuilderNode } from "@/builder/types";
import { Edge } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";

export type LayoutServicePort = {
  computeAutoLayout: (props: {
    nodes: BuilderNode[];
    edges: Edge[];
  }) => Promise<BuilderNode[]>;
};

// TODO: find a way to test this without ELK time out
export const _getLayoutService = (): LayoutServicePort => {
  return {
    computeAutoLayout: async ({
      nodes,
      edges,
    }: {
      nodes: BuilderNode[];
      edges: Edge[];
    }) => {
      // https://www.eclipse.org/elk/reference/algorithms/org-eclipse-elk-layered.html
      const layoutOptions = {
        "elk.algorithm": "layered",
        "elk.direction": "RIGHT",
        "elk.layered.spacing.edgeNodeBetweenLayers": "40",
        "elk.spacing.nodeNode": "40",
        "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
      };

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

      const elk = new ELK();
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
    },
  };
};
