import { BuilderNode, BuilderEdge } from "@/builder/types";

export type LayoutServicePort = {
  computeAutoLayout: (props: {
    nodes: BuilderNode[];
    edges: BuilderEdge[];
  }) => Promise<BuilderNode[]>;
};
