import * as z from "zod/v4";

export const contentSchema = z.custom<Record<string, unknown>>(
  z.record(z.string(), z.any()).parse,
);

export const makeSimpleSceneContent = (
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
