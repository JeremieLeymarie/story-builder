import { CSSProperties, JSX, Suspense } from "react";
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { $applyNodeReplacement, DecoratorNode } from "lexical";
import React from "react";

const ImageComponent = React.lazy(
  () => import("../components/image-component"),
);

export type ImagePayload = {
  altText: string;
  height?: CSSProperties["height"];
  width?: CSSProperties["width"];
  maxWidth?: number;
  key?: NodeKey;
  src: string;
};

const $convertImageElement = (domNode: Node): null | DOMConversionOutput => {
  const img = domNode as HTMLImageElement;
  if (img.src.startsWith("file:///")) {
    return null;
  }
  const { alt: altText, src, width, height } = img;
  const node = $createImageNode({ altText, height, src, width });
  return { node };
};

export type SerializedImageNode = Spread<
  {
    altText: string;
    width?: CSSProperties["width"];
    height?: CSSProperties["height"];
    maxWidth: number;
    src: string;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: CSSProperties["width"];
  __height: CSSProperties["height"];
  __maxWidth: number;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    console.log("import", { serializedNode });
    const { altText, height, width, maxWidth, src } = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
    });
    return node;
  }

  exportJSON(): SerializedImageNode {
    console.log("export", {
      altText: this.getAltText(),
      width: this.__width,
      height: this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      type: "image",
      version: 1,
    });
    return {
      altText: this.getAltText(),
      width: this.__width,
      height: this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      type: "image",
      version: 1,
    };
  }
  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    element.setAttribute("width", this.__width?.toString() ?? "inherit");
    element.setAttribute("height", this.__height?.toString() ?? "inherit");
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: CSSProperties["width"],
    height?: CSSProperties["height"],
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
  }

  setWidthAndHeight(
    width: CSSProperties["width"],
    height: CSSProperties["height"],
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  decorate() {
    return (
      <Suspense fallback={null}>
        <ImageComponent
          src={this.__src}
          altText={this.__altText}
          width={this.__width}
          height={this.__height}
          maxWidth={this.__maxWidth}
          nodeKey={this.getKey()}
          resizable={true}
        />
      </Suspense>
    );
  }
}

export const $createImageNode = ({
  altText,
  height,
  maxWidth = 500,
  src,
  width,
  key,
}: ImagePayload): ImageNode => {
  return $applyNodeReplacement(
    new ImageNode(src, altText, maxWidth, width, height, key),
  );
};

export const $isImageNode = (
  node: LexicalNode | null | undefined,
): node is ImageNode => {
  return node instanceof ImageNode;
};
