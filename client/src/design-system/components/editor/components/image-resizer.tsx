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
      className={cn(
        "border-primary absolute h-4 w-4 border-4 transition-all hover:scale-125",
        className,
      )}
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
  editor,
}: {
  editor: LexicalEditor;
  buttonRef: RefObject<HTMLButtonElement | null>;
  imageContainerRef: RefObject<HTMLDivElement | null>;
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
    imageContainerRef,
    controlWrapperRef,
  });

  return (
    <div ref={controlWrapperRef}>
      <ResizeHandle
        className="-top-2.5 -right-2.5 cursor-nesw-resize border-b-0 border-l-0"
        onPointerDown={(event) => {
          handlePointerDown(event, { vertical: "north", horizontal: "east" });
        }}
      />
      <ResizeHandle
        className="-right-2.5 -bottom-2.5 cursor-nwse-resize border-t-0 border-l-0"
        onPointerDown={(event) => {
          handlePointerDown(event, { vertical: "south", horizontal: "east" });
        }}
      />
      <ResizeHandle
        className="-bottom-2.5 -left-2.5 cursor-nesw-resize border-t-0 border-r-0"
        onPointerDown={(event) => {
          handlePointerDown(event, { vertical: "south", horizontal: "west" });
        }}
      />
      <ResizeHandle
        className="-top-2.5 -left-2.5 cursor-nwse-resize border-r-0 border-b-0"
        onPointerDown={(event) => {
          handlePointerDown(event, { vertical: "north", horizontal: "west" });
        }}
      />
    </div>
  );
};
