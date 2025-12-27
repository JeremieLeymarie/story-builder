import z from "zod/v4";
import { useReactFlow } from "@xyflow/react";
import { BuilderNode, SceneProps } from "../types";
import { nodeToSceneAdapter } from "../adapters";
import { isAnyInputFocused } from "./use-builder-shortcuts";
import { useDuplicateScenes } from "./use-duplicate-scenes";
import { DEFAULT_SCENE, useAddScene } from "./use-add-scene";
import {
  lexicalContentSchema,
  makeSimpleLexicalContent,
} from "@/lib/lexical-content";
import { useBuilderError } from "./use-builder-error";
import { MouseEvent as ReactMouseEvent } from "react";
import { useBuilderContext } from "./use-builder-context";
import { actionSchema } from "@/lib/action-schema";

const clipboardScenesSchema = z.array(
  z.object({
    key: z.nanoid(),
    title: z
      .string()
      .max(250, { message: "Title has to be less than 250 characters" }),
    content: lexicalContentSchema,
    actions: z.array(actionSchema),
    builderParams: z.object({
      position: z.object({ x: z.number(), y: z.number() }),
    }),
  }),
);

export const useCopyPaste = () => {
  const { duplicateScenes } = useDuplicateScenes();
  const { getNodes, setNodes } = useReactFlow<BuilderNode>();
  const { addScene } = useAddScene();
  const { handleError } = useBuilderError();
  const { story, builderService } = useBuilderContext();

  const onCopyOrCut = (ev: ClipboardEvent) => {
    if (isAnyInputFocused()) return;
    ev.preventDefault();
    const nodes = getNodes().filter((nd) => nd.selected);
    if (!nodes.length) return;
    ev.clipboardData?.setData(
      "text/plain",
      JSON.stringify(nodes.map((nd) => nodeToSceneAdapter(nd))),
    );
    if (ev.type === "cut") {
      setNodes((nds) => nds.filter((nd) => !nd.selected));
      builderService.deleteScenes({
        sceneKeys: nodes.map((nd) => nd.data.key),
        storyKey: story.key,
      });
    }
  };

  const onAuxClick = (
    ev: ReactMouseEvent<HTMLDivElement, MouseEvent>,
    data: SceneProps,
  ) => {
    ev.preventDefault();
    navigator.clipboard.writeText(JSON.stringify([data]));
    setNodes((nds) => nds.filter((nd) => nd.data.key !== data.key));
  };

  const onPaste = (ev: ClipboardEvent) => {
    if (isAnyInputFocused()) return;
    ev.preventDefault();
    const text = ev.clipboardData?.getData("text") ?? "[]";

    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        // Paste from scene payload
        const scenes = clipboardScenesSchema.parse(data);
        duplicateScenes(scenes);
      } else {
        // Paste from freeform text
        addScene({
          payload: {
            ...DEFAULT_SCENE,
            content: makeSimpleLexicalContent(text),
          },
          position: "auto",
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  return {
    onAuxClick,
    onCopyOrCut,
    onPaste,
  };
};
