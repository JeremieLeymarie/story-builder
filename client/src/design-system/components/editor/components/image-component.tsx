import { CSSProperties, Suspense, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { NodeKey } from "lexical";
import { $isNodeSelection } from "lexical";

import { SimpleLoader } from "../../simple-loader";
import { getEditorContainerInfo } from "../lib/get-editor-container-dimensions";
import { useImageCommands } from "../hooks/use-image-commands";
import { ImageResizer } from "./image-resizer";
import { cn } from "@/lib/style";

const LazyImage = ({
  altText,
  src,
  onError,
}: {
  altText: string;
  src: string;
  onError: () => void;
}) => {
  return (
    <img
      className="w-full"
      src={src}
      alt={altText}
      onError={onError}
      draggable="false"
    />
  );
};

const BrokenImage = () => {
  return (
    <img
      src=""
      style={{
        height: 200,
        opacity: 0.2,
        width: 200,
      }}
      draggable="false"
    />
  );
};

export const ImageComponent = ({
  src,
  altText,
  nodeKey,
  width,
  height,
  resizable,
}: {
  altText: string;
  height: CSSProperties["width"];
  width: CSSProperties["height"];
  nodeKey: NodeKey;
  resizable: boolean;
  src: string;
}) => {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [editor] = useLexicalComposerContext();
  const [isLoadError, setIsLoadError] = useState<boolean>(false);
  const { draggable, isFocused, selection, onResizeEnd, onResizeStart } =
    useImageCommands({ nodeKey, imageContainerRef });
  const { maxWidthContainer } = getEditorContainerInfo(editor);

  const isSelected = isFocused && $isNodeSelection(selection);

  return (
    <Suspense fallback={<SimpleLoader />}>
      <span className="relative inline-block w-full cursor-default">
        <div
          draggable={draggable}
          className={cn(
            "relative block cursor-default",
            isSelected &&
              "focused ring-primary draggable cursor-grab ring-2 ring-offset-2 active:cursor-grabbing",
          )}
          style={{
            height,
            maxWidth: maxWidthContainer,
            minWidth: 100,
            width,
          }}
          ref={imageContainerRef}
        >
          {isLoadError ? (
            <BrokenImage />
          ) : (
            <LazyImage
              src={src}
              altText={altText}
              onError={() => setIsLoadError(true)}
            />
          )}
          {resizable && isSelected && (
            <ImageResizer
              editor={editor}
              buttonRef={buttonRef}
              imageContainerRef={imageContainerRef}
              onResizeStart={onResizeStart}
              onResizeEnd={onResizeEnd}
            />
          )}
        </div>
      </span>
    </Suspense>
  );
};

export default ImageComponent;
