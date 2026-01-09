import { CSSProperties, RefObject, useRef } from "react";
import { calculateZoomLevel } from "@lexical/utils";
import { LexicalEditor } from "lexical";
import { useEditorContext } from "./use-editor-context";

export type Direction = {
  vertical?: "north" | "south";
  horizontal?: "east" | "west";
};

type Positioning = {
  direction: Direction;
  ratio: number;
  startHeight: number;
  startWidth: number;
  startMousePosX: number;
  startMousePosY: number;
};

const DEFAULT_POSITIONING = {
  direction: {},
  ratio: 0,
  startHeight: 0,
  startWidth: 0,
  startMousePosX: 0,
  startMousePosY: 0,
} satisfies Positioning;

const ratio = (size: number, containerSize: number) =>
  (size / containerSize) * 100;

export const useResizeImage = ({
  onResizeEnd,
  onResizeStart,
  editor,
  imageContainerRef,
  controlWrapperRef,
}: {
  onResizeEnd: (
    width: CSSProperties["width"],
    height: CSSProperties["height"],
  ) => void;
  onResizeStart: () => void;
  editor: LexicalEditor;
  imageContainerRef: RefObject<HTMLDivElement | null>;
  controlWrapperRef: RefObject<HTMLDivElement | null>;
}) => {
  const { contentEditableRef } = useEditorContext();

  const positioningRef = useRef<Positioning>(DEFAULT_POSITIONING);

  const updateSizeInDOM = ({
    width,
    height,
  }: {
    width?: number;
    height?: number;
  }) => {
    if (!imageContainerRef.current) return;
    if (width) imageContainerRef.current.style.width = `${width}%`;
    if (height) imageContainerRef.current.style.height = `${height}%`;
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    direction: Direction,
  ) => {
    event.preventDefault();

    if (!editor.isEditable()) return;
    const positioning = positioningRef.current;
    const image = imageContainerRef.current;
    const controlWrapper = controlWrapperRef.current;
    const container = contentEditableRef.current;

    if (!image || !controlWrapper || !container) return;
    const { width: pxWidth, height: pxHeight } = image.getBoundingClientRect();

    const zoom = calculateZoomLevel(image);
    positioning.startWidth = pxWidth;
    positioning.startHeight = pxHeight;
    positioning.ratio = pxWidth / pxHeight;
    positioning.startMousePosX = event.clientX / zoom;
    positioning.startMousePosY = event.clientY / zoom;
    positioning.direction = direction;

    onResizeStart();
    controlWrapperRef.current?.classList.add("touch-action-none");

    const { width: containerWidth, height: containerHeight } =
      container.getBoundingClientRect();
    const width = ratio(pxWidth, containerWidth);
    const height = ratio(pxHeight, containerHeight);
    updateSizeInDOM({ width, height });

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const image = imageContainerRef.current;
    const positioning = positioningRef.current;
    const container = contentEditableRef.current;
    const direction = positioning.direction;

    if (!image || !container) return;
    const zoom = calculateZoomLevel(image);

    const { width: containerWidth } = container.getBoundingClientRect();

    // Corner cursor - resize height & width
    if (direction.horizontal && direction.vertical) {
      let diff = Math.floor(positioning.startMousePosX - event.clientX / zoom);
      diff = direction.horizontal === "east" ? -diff : diff;

      const width = ratio(positioning.startWidth + diff, containerWidth);
      const height = width / positioning.ratio;
      return updateSizeInDOM({ width, height });
    }

    throw new Error("Vertical or horizontal resizing is not supported");
  };

  const handlePointerUp = () => {
    const image = imageContainerRef.current;
    const controlWrapper = controlWrapperRef.current;

    if (!image || !controlWrapper) return;

    positioningRef.current = DEFAULT_POSITIONING;

    controlWrapper.classList.remove("touch-action-none");

    onResizeEnd(image.style.width, image.style.height);

    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  };

  return { handlePointerDown };
};
