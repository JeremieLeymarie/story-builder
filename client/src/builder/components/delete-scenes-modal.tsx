import { ConfirmDialog } from "@/design-system/components";
import { useDeleteSceneStore } from "../hooks/use-delete-scenes-store";
import { useBuilderContext } from "../hooks/use-builder-context";
import { useBuilderEditorStore } from "../hooks/use-builder-editor-store";
import { useErrorToast } from "../hooks/use-error-toast";
import { useReactFlow } from "@xyflow/react";
import { BuilderNode } from "../types";
import { isSceneVisitCondition } from "@/lib/storage/domain";

const useAffectedScenes = (deletedKeys: string[]) => {
  const { getNodes } = useReactFlow<BuilderNode>();
  if (deletedKeys.length === 0) return [];

  const deletedSceneKeysSet = new Set(deletedKeys);

  return getNodes()
    .filter((node) => {
      if (deletedSceneKeysSet.has(node.data.key)) return false;
      return node.data.actions.some(
        (action) =>
          action.type === "conditional" &&
          isSceneVisitCondition(action.condition) &&
          deletedSceneKeysSet.has(action.condition.sceneKey),
      );
    })
    .map((node) => node.data.title || "Untitled scene");
};

export const DeleteSceneModal = () => {
  const { isOpen, keys, close } = useDeleteSceneStore();
  const { story, builderService } = useBuilderContext();
  const { handleError } = useErrorToast();
  const { setNodes } = useReactFlow<BuilderNode>();
  const closeEditor = useBuilderEditorStore((state) => state.close);

  const affectedScenes = useAffectedScenes(keys);
  const isPlural = keys.length > 1;

  const handleConfirm = () => {
    builderService
      .deleteScenes({ sceneKeys: keys, storyKey: story.key })
      .catch(handleError);
    setNodes((nodes) => nodes.filter((n) => !keys.includes(n.data.key)));
    closeEditor();
    close();
  };

  const description =
    affectedScenes.length > 0 ? (
      <>
        {isPlural ? "These scenes are" : "This scene is"} referenced in
        conditional actions of{" "}
        <span className="font-semibold">{affectedScenes.join(", ")}</span>.
        Deleting {isPlural ? "them" : "it"} will break those conditions.
      </>
    ) : (
      `This action cannot be undone. ${isPlural ? "These scenes and their connections" : "The scene and its connections"} will be permanently deleted.`
    );

  return (
    <ConfirmDialog
      title={
        keys.length > 1 ? `Delete ${keys.length} scenes?` : "Delete this scene?"
      }
      description={description}
      confirmLabel="Delete"
      open={isOpen}
      setOpen={(open) => {
        if (!open) close();
      }}
      onConfirm={handleConfirm}
      onCancel={close}
    />
  );
};
