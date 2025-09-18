import { RefObject, useRef } from "react";
import { calculateZoomLevel } from "@lexical/utils";
import { getEditorContainerInfo } from "@/design-system/components/editor/helpers/get-editor-container-dimensions";
import { LexicalEditor } from "lexical";

export type Direction = {
  vertical?: "north" | "south";
  horizontal?: "east" | "west";
};

export const useResizeImage = ({
  imageRef,
  onResizeEnd,
  onResizeStart,
  editor,
  maxWidth,
  controlWrapperRef,
}: {
  imageRef: { current: null | HTMLElement };
  maxWidth?: number;
  onResizeEnd: (width: "inherit" | number, height: "inherit" | number) => void;
  onResizeStart: () => void;
  editor: LexicalEditor;
  controlWrapperRef: RefObject<HTMLDivElement | null>;
}) => {
  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

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
    startX: 0,
    startY: 0,
  };

  const positioningRef = useRef<{
    currentHeight: "inherit" | number;
    currentWidth: "inherit" | number;
    direction: Direction;
    isResizing: boolean;
    ratio: number;
    startHeight: number;
    startWidth: number;
    startX: number;
    startY: number;
  }>(DEFAULT_POSITIONING);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    direction: Direction,
  ) => {
    if (!editor.isEditable()) {
      return;
    }

    const image = imageRef.current;
    const controlWrapper = controlWrapperRef.current;

    if (image !== null && controlWrapper !== null) {
      event.preventDefault();
      const { width, height } = image.getBoundingClientRect();
      const zoom = calculateZoomLevel(image);
      const positioning = positioningRef.current;
      positioning.startWidth = width;
      positioning.startHeight = height;
      positioning.ratio = width / height;
      positioning.currentWidth = width;
      positioning.currentHeight = height;
      positioning.startX = event.clientX / zoom;
      positioning.startY = event.clientY / zoom;
      positioning.isResizing = true;
      positioning.direction = direction;

      onResizeStart();

      controlWrapper.classList.add("touch-action-none");
      image.style.height = `${height}px`;
      image.style.width = `${width}px`;

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    }
  };
  const handlePointerMove = (event: PointerEvent) => {
    const image = imageRef.current;
    const positioning = positioningRef.current;
    const direction = positioning.direction;

    if (image !== null && positioning.isResizing) {
      const zoom = calculateZoomLevel(image);
      // Corner cursor
      if (direction.horizontal && direction.vertical) {
        let diff = Math.floor(positioning.startX - event.clientX / zoom);
        diff = direction.horizontal === "east" ? -diff : diff;

        const width = clamp(
          positioning.startWidth + diff,
          minWidth,
          maxWidthContainer,
        );

        const height = width / positioning.ratio;
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        positioning.currentHeight = height;
        positioning.currentWidth = width;
      } else if (direction.vertical) {
        let diff = Math.floor(positioning.startY - event.clientY / zoom);
        diff = direction.vertical === "south" ? -diff : diff;

        const height = clamp(
          positioning.startHeight + diff,
          minHeight,
          maxHeightContainer,
        );

        image.style.height = `${height}px`;
        positioning.currentHeight = height;
      } else {
        let diff = Math.floor(positioning.startX - event.clientX / zoom);
        diff = direction.horizontal === "east" ? -diff : diff;

        const width = clamp(
          positioning.startWidth + diff,
          minWidth,
          maxWidthContainer,
        );

        image.style.width = `${width}px`;
        positioning.currentWidth = width;
      }
    }
  };
  const handlePointerUp = () => {
    const image = imageRef.current;
    const positioning = positioningRef.current;
    const controlWrapper = controlWrapperRef.current;
    if (image !== null && controlWrapper !== null && positioning.isResizing) {
      const width = positioning.currentWidth;
      const height = positioning.currentHeight;
      positioningRef.current = DEFAULT_POSITIONING;

      controlWrapper.classList.remove("touch-action-none");

      onResizeEnd(width, height);

      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    }
  };

  return { handlePointerDown, handlePointerUp, handlePointerMove };
};
