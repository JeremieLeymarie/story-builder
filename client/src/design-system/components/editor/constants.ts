import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical";
import { ImageNode } from "./nodes/image-node";
import { InitialConfigType } from "@lexical/react/LexicalComposer";

const NODES: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> = [
  HeadingNode,
  ParagraphNode,
  TextNode,
  QuoteNode,
  ImageNode,
];

export const BASE_EDITOR_CONFIG: InitialConfigType = {
  namespace: "Editor",
  theme: {
    heading: {
      h1: "text-3xl font-bold",
      h2: "text-2xl font-semibold",
      h3: "text-xl font-semibold",
      h4: "text-lg font-semibold",
      h5: "text-base font-semibold",
    },
    text: {
      underline: "underline",
      strikethrough: "line-through",
      underlineStrikethrough: "[text-decoration:underline_line-through]",
      bold: "bold",
      italic: "italic",
    },
  },
  nodes: NODES,
  onError: (error: Error) => {
    console.error(error);
  },
};
