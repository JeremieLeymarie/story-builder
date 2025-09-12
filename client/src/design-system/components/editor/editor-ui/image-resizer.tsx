import { useRef } from "react";
import type { LexicalEditor } from "lexical";
import { useResizePointer } from "../helpers/use-resize-image";

const Direction = {
  east: 1 << 0,
  north: 1 << 3,
  south: 1 << 1,
  west: 1 << 2,
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

  const { handlePointerDown } = useResizePointer({
    imageRef,
    onResizeEnd,
    onResizeStart,
    editor,
    maxWidth,
    Direction,
    controlWrapperRef,
  });

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
