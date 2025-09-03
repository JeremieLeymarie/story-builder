// EXPERIMENTAL: Hard typing on scene content
// Pro:
// - Catches database corruptions
// - Good developer experience
// Cons:
// - Hard to maintain
// - Runtime overhead (although so far has not been significant)
//
// If runtime checking is a problem, it would maybe worth investing in faster validators like ArkType

import {
  SerializedEditorState,
  SerializedElementNode,
  SerializedLexicalNode,
  SerializedLineBreakNode,
  SerializedParagraphNode,
  SerializedTabNode,
  SerializedTextNode,
} from "lexical";
import * as z from "zod/v4";

type Paragraph<T extends SerializedLexicalNode> = Pick<
  SerializedParagraphNode,
  "textStyle" | "textFormat"
> &
  SerializedElementNode<T>;

// root -> paragraph -> text | linebreak | tab
export type SceneContent = SerializedEditorState<
  Paragraph<SerializedTextNode | SerializedLineBreakNode | SerializedTabNode>
>;
// export type SceneContent = Object<

const node = (name: string) =>
  z.object({
    type: z.literal(name),
    version: z.number(),
  });

const element = (name: string, t: z.ZodType) =>
  node(name).extend({
    children: t.array(),
    direction: z.literal(["ltr", "rtl", null]),
    format: z.enum(["left", "start", "center", "right", "end", "justify", ""]),
    indent: z.number(),
    textFormat: z.number().optional(),
    textStyle: z.string().optional(),
  });

const textSchema = node("text").extend({
  detail: z.number(),
  format: z.number(),
  mode: z.enum(["normal", "token", "segmented"]),
  text: z.string(),
  style: z.string(),
});
const tabSchema = textSchema.extend({
  type: z.literal("tab"),
});
const linebreakSchema = node("linebreak");

const paragraphSchema = element(
  "paragraph",
  textSchema.or(linebreakSchema).or(tabSchema),
).extend({
  textFormat: z.number(),
  textStyle: z.string(),
});

const rootSchema = z.object({
  root: element("root", paragraphSchema),
});
export const contentSchema = z.custom<SceneContent>(rootSchema.parse);

export const makeSimpleSceneContent = (content: string): SceneContent => {
  return {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: content,
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
          textFormat: 0,
          textStyle: "",
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
};
