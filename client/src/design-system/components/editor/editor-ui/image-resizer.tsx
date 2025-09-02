import { useRef } from "react";
import { calculateZoomLevel } from "@lexical/utils";
import type { LexicalEditor } from "lexical";
import { getEditorContainerInfo } from "@/design-system/components/editor/helpers/getEditorContainerDimensions";
import { setResizeCursor } from "@/design-system/components/editor/helpers/setResizeCursor";

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const Direction = {
  east: 1 << 0,
  north: 1 << 3,
  south: 1 << 1,
  west: 1 << 2,
};

const DEFAULT_POSITIONING = {
  currentHeight: 0,
  currentWidth: 0,
  direction: 0,
  isResizing: false,
  ratio: 0,
  startHeight: 0,
  startWidth: 0,
  startX: 0,
  startY: 0,
};

export const ImageResizer = ({
  onResizeStart,
  onResizeEnd,
  imageRef,
  maxWidth,
  editor,
}: {
  editor: LexicalEditor;
  buttonRef: { current: null | HTMLButtonElement };
  imageRef: { current: null | HTMLElement };
  maxWidth?: number;
  onResizeEnd: (width: "inherit" | number, height: "inherit" | number) => void;
  onResizeStart: () => void;
}) => {
  const controlWrapperRef = useRef<HTMLDivElement>(null);
  const userSelect = useRef({
    priority: "",
    value: "default",
  });
  const positioningRef = useRef<{
    currentHeight: "inherit" | number;
    currentWidth: "inherit" | number;
    direction: number;
    isResizing: boolean;
    ratio: number;
    startHeight: number;
    startWidth: number;
    startX: number;
    startY: number;
  }>(DEFAULT_POSITIONING);
  const { maxWidthContainer, maxHeightContainer, editorRootElement } =
    getEditorContainerInfo(editor, maxWidth);
  const minWidth = 100;
  const minHeight = 100;
  const setEndCursor = () => {
    if (editorRootElement !== null) {
      editorRootElement.style.setProperty("cursor", "text");
    }
    if (document.body !== null) {
      document.body.style.setProperty("cursor", "default");
      document.body.style.setProperty(
        "-webkit-user-select",
        userSelect.current.value,
        userSelect.current.priority,
      );
    }
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    direction: number,
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

      setResizeCursor(direction, editorRootElement, userSelect.current);
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

    const isHorizontal =
      positioning.direction & (Direction.east | Direction.west);
    const isVertical =
      positioning.direction & (Direction.south | Direction.north);

    if (image !== null && positioning.isResizing) {
      const zoom = calculateZoomLevel(image);
      // Corner cursor
      if (isHorizontal && isVertical) {
        let diff = Math.floor(positioning.startX - event.clientX / zoom);
        diff = positioning.direction & Direction.east ? -diff : diff;

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
      } else if (isVertical) {
        let diff = Math.floor(positioning.startY - event.clientY / zoom);
        diff = positioning.direction & Direction.south ? -diff : diff;

        const height = clamp(
          positioning.startHeight + diff,
          minHeight,
          maxHeightContainer,
        );

        image.style.height = `${height}px`;
        positioning.currentHeight = height;
      } else {
        let diff = Math.floor(positioning.startX - event.clientX / zoom);
        diff = positioning.direction & Direction.east ? -diff : diff;

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

      setEndCursor();
      onResizeEnd(width, height);

      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    }
  };
  return (
    <div ref={controlWrapperRef}>
      <div
        className="image-resizer image-resizer-n bg-primary absolute -top-1.75 left-1/2 h-2 w-2 -translate-x-1/2 cursor-ns-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.north);
        }}
      />
      <div
        className="image-resizer image-resizer-ne bg-primary absolute -top-1.75 -right-1.75 h-2 w-2 cursor-nesw-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.north | Direction.east);
        }}
      />
      <div
        className="image-resizer image-resizer-e bg-primary absolute top-1/2 -right-1.75 h-2 w-2 -translate-y-1/2 cursor-ew-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.east);
        }}
      />
      <div
        className="image-resizer image-resizer-se bg-primary absolute -right-1.75 -bottom-1.75 h-2 w-2 cursor-nwse-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.south | Direction.east);
        }}
      />
      <div
        className="image-resizer image-resizer-s bg-primary absolute -bottom-1.75 left-1/2 h-2 w-2 -translate-x-1/2 cursor-ns-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.south);
        }}
      />
      <div
        className="image-resizer image-resizer-sw bg-primary absolute -bottom-1.75 -left-1.75 h-2 w-2 cursor-nesw-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.south | Direction.west);
        }}
      />
      <div
        className="image-resizer image-resizer-w bg-primary absolute top-1/2 -left-1.75 h-2 w-2 -translate-y-1/2 cursor-ew-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.west);
        }}
      />
      <div
        className="image-resizer image-resizer-nw bg-primary absolute -top-1.75 -left-1.75 h-2 w-2 cursor-nwse-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.north | Direction.west);
        }}
      />
    </div>
  );
};
