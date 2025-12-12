import { CSSProperties, RefObject, useRef } from "react";
import type { LexicalEditor } from "lexical";
import { cn } from "@/lib/style";
import { Direction, useResizeImage } from "../hooks/use-resize-image";

const ResizeHandle = ({
  className,
  onPointerDown,
}: {
  className?: string;
  onPointerDown: (
    event: React.PointerEvent<HTMLDivElement>,
    direction: Direction,
  ) => void;
}) => {
  return (
    <div
      className={cn("bg-primary absolute h-2 w-2", className)}
      onPointerDown={(event) => {
        onPointerDown(event, { vertical: "north" });
      }}
    />
  );
};

export const ImageResizer = ({
  onResizeStart,
  onResizeEnd,
  imageContainerRef,
  maxWidth,
  editor,
}: {
  editor: LexicalEditor;
  buttonRef: RefObject<HTMLButtonElement | null>;
  imageContainerRef: RefObject<HTMLDivElement | null>;
  maxWidth?: number;
  onResizeEnd: (
    width: CSSProperties["width"],
    height: CSSProperties["height"],
  ) => void;
  onResizeStart: () => void;
}) => {
  const controlWrapperRef = useRef<HTMLDivElement>(null);

  const { handlePointerDown } = useResizeImage({
    onResizeEnd,
    onResizeStart,
    editor,
    maxWidth,
    imageContainerRef,
    controlWrapperRef,
  });

  return (
    <div ref={controlWrapperRef}>
      <ResizeHandle
        className="-top-1.75 left-1/2 -translate-x-1/2 cursor-ns-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, { vertical: "north" });
        }}
      />
      <ResizeHandle
        className="-top-1.75 -right-1.75 cursor-nesw-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, { vertical: "north", horizontal: "east" });
        }}
      />
      <ResizeHandle
        className="top-1/2 -right-1.75 -translate-y-1/2 cursor-ew-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, { horizontal: "east" });
        }}
      />
      <ResizeHandle
        className="-right-1.75 -bottom-1.75 cursor-nwse-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, { vertical: "south", horizontal: "east" });
        }}
      />
      <ResizeHandle
        className="-bottom-1.75 left-1/2 -translate-x-1/2 cursor-ns-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, { vertical: "south" });
        }}
      />
      <ResizeHandle
        className="-bottom-1.75 -left-1.75 cursor-nesw-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, { vertical: "south", horizontal: "west" });
        }}
      />
      <ResizeHandle
        className="top-1/2 -left-1.75 h-2 w-2 -translate-y-1/2 cursor-ew-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, { horizontal: "west" });
        }}
      />
      <ResizeHandle
        className="-top-1.75 -left-1.75 h-2 w-2 cursor-nwse-resize"
        onPointerDown={(event) => {
          handlePointerDown(event, { vertical: "north", horizontal: "west" });
        }}
      />
    </div>
  );
};
