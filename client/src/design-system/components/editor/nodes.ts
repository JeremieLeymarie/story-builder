import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical";
import { ImageNode } from "./nodes/image-node";
import { WikiNode } from "./nodes/wiki-node";

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [HeadingNode, ParagraphNode, TextNode, QuoteNode, ImageNode, WikiNode];
