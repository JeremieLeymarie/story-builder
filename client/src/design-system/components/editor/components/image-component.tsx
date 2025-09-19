import { Suspense, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { NodeKey } from "lexical";
import { $isNodeSelection } from "lexical";

import { SimpleLoader } from "../../simple-loader";
import { getEditorContainerInfo } from "../lib/get-editor-container-dimensions";
import { useImageCommands } from "../hooks/use-image-commands";
import { ImageResizer } from "./image-resizer";

const LazyImage = ({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
  onError,
}: {
  altText: string;
  className: string | null;
  height: "inherit" | number;
  imageRef: { current: null | HTMLImageElement };
  maxWidth: number;
  src: string;
  width: "inherit" | number;
  onError: () => void;
}) => {
  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      style={{
        height,
        maxWidth,
        width,
      }}
      onError={onError}
      draggable="false"
    />
  );
};

const BrokenImage = () => {
  return (
    <img
      src={""}
      style={{
        height: 200,
        opacity: 0.2,
        width: 200,
      }}
      draggable="false"
    />
  );
};

const ImageComponent = ({
  src,
  altText,
  nodeKey,
  width,
  height,
  resizable,
}: {
  altText: string;
  height: "inherit" | number;
  maxWidth: number;
  nodeKey: NodeKey;
  resizable: boolean;
  src: string;
  width: "inherit" | number;
}) => {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [editor] = useLexicalComposerContext();
  const [isLoadError, setIsLoadError] = useState<boolean>(false);
  const { draggable, isFocused, selection, onResizeEnd, onResizeStart } =
    useImageCommands({ nodeKey, imageRef });
  const { maxWidthContainer } = getEditorContainerInfo(editor);

  return (
    <Suspense fallback={<SimpleLoader />}>
      <span className="user-select-none editor-image relative inline-block cursor-default">
        <div draggable={draggable}>
          {isLoadError ? (
            <BrokenImage />
          ) : (
            <LazyImage
              className={`max-w-full cursor-default ${
                isFocused
                  ? `${$isNodeSelection(selection) ? "draggable cursor-grab active:cursor-grabbing" : ""} focused ring-primary ring-2 ring-offset-2`
                  : null
              }`}
              src={src}
              altText={altText}
              imageRef={imageRef}
              width={width}
              height={height}
              maxWidth={maxWidthContainer}
              onError={() => setIsLoadError(true)}
            />
          )}
        </div>

        {resizable && $isNodeSelection(selection) && isFocused && (
          <ImageResizer
            editor={editor}
            buttonRef={buttonRef}
            imageRef={imageRef}
            maxWidth={maxWidthContainer}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
          />
        )}
      </span>
    </Suspense>
  );
};
export default ImageComponent;
