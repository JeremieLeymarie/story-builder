import * as z from "zod/v4";

export type LexicalContent = Record<string, unknown>;
export const lexicalContentSchema = z.custom<LexicalContent>(
  (data) => z.record(z.string(), z.any()).safeParse(data).success,
);

export const makeSimpleLexicalContent = (
  content: string,
): Record<string, unknown> => {
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
