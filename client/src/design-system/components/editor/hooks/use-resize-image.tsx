import { CSSProperties, RefObject, useRef } from "react";
import { calculateZoomLevel } from "@lexical/utils";
import { getEditorContainerInfo } from "@/design-system/components/editor/lib/get-editor-container-dimensions";
import { LexicalEditor } from "lexical";
import { useEditorContext } from "./use-editor-context";

export type Direction = {
  vertical?: "north" | "south";
  horizontal?: "east" | "west";
};

export const useResizeImage = ({
  onResizeEnd,
  onResizeStart,
  editor,
  maxWidth,
  imageContainerRef,
  controlWrapperRef,
}: {
  maxWidth?: number;
  onResizeEnd: (
    width: CSSProperties["width"],
    height: CSSProperties["height"],
  ) => void;
  onResizeStart: () => void;
  editor: LexicalEditor;
  imageContainerRef: RefObject<HTMLDivElement | null>;
  controlWrapperRef: RefObject<HTMLDivElement | null>;
}) => {
  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };
  const { contentEditableRef } = useEditorContext();

  const { maxWidthContainer, maxHeightContainer } = getEditorContainerInfo(
    editor,
    maxWidth,
  );
  const minWidth = 100;
  const minHeight = 100;

  const DEFAULT_POSITIONING = {
    currentHeight: 0,
    currentWidth: 0,
    direction: {},
    isResizing: false,
    ratio: 0,
    startHeight: 0,
    startWidth: 0,
    startMousePosX: 0,
    startMousePosY: 0,
  };

  const positioningRef = useRef<{
    direction: Direction;
    isResizing: boolean;
    ratio: number;
    startHeight: number;
    startWidth: number;
    startMousePosX: number;
    startMousePosY: number;
  }>(DEFAULT_POSITIONING);

  const ratio = (size: number, containerSize: number) =>
    (size / containerSize) * 100;

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
    if (!editor.isEditable()) return;
    const positioning = positioningRef.current;
    const image = imageContainerRef.current;
    const controlWrapper = controlWrapperRef.current;
    const container = contentEditableRef.current;

    if (!image || !controlWrapper || !container) return;
    const { width: pxWidth, height: pxHeight } = image.getBoundingClientRect();

    event.preventDefault();

    const zoom = calculateZoomLevel(image);
    // const positioning = positioningRef.current;
    positioning.startWidth = pxWidth;
    positioning.startHeight = pxHeight;
    positioning.ratio = pxWidth / pxHeight;
    // positioning.currentWidth = width;
    // positioning.currentHeight = height;
    positioning.startMousePosX = event.clientX / zoom;
    positioning.startMousePosY = event.clientY / zoom;
    // positioning.isResizing = true;
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

    const { width: containerWidth, height: containerHeight } =
      container.getBoundingClientRect();

    // Corner cursor
    if (direction.horizontal && direction.vertical) {
      let diff = Math.floor(positioning.startMousePosX - event.clientX / zoom);
      diff = direction.horizontal === "east" ? -diff : diff;

      const width = ratio(positioning.startWidth + diff, containerWidth);
      const height = width / positioning.ratio;
      updateSizeInDOM({ width, height });
    } else if (direction.vertical) {
      let diff = Math.floor(positioning.startMousePosY - event.clientY / zoom);
      diff = direction.vertical === "south" ? -diff : diff;

      const height = ratio(positioning.startHeight + diff, containerHeight);
      updateSizeInDOM({ height });
    } else {
      let diff = Math.floor(positioning.startMousePosX - event.clientX / zoom);
      diff = direction.horizontal === "east" ? -diff : diff;

      const width = ratio(positioning.startWidth + diff, containerWidth);
      updateSizeInDOM({ width });
    }
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
