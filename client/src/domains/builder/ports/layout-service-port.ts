import { BuilderNode } from "@/builder/types";
import { Edge } from "@xyflow/react";

export type LayoutServicePort = {
  computeAutoLayout: (props: {
    nodes: BuilderNode[];
    edges: Edge[];
  }) => Promise<BuilderNode[]>;
};
