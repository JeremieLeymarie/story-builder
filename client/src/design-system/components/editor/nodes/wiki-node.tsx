import {
  DecoratorNode,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactNode } from "react";

// TODO: use NodeState paradigm

// const articleKeyState = createState("articleKey", {
//   parse: (v) => (typeof v === "string" ? v : ""),
// });

export type SerializedWikiNode = Spread<
  {
    articleKey: string;
    textContent: string;
    type: "wiki";
    version: 1;
  },
  SerializedLexicalNode
>;

// eslint-disable-next-line react-refresh/only-export-components
const WikiNodeComponent = ({
  articleKey,
  textContent,
}: {
  articleKey?: string;
  textContent?: string;
}) => {
  console.log({ articleKey });
  return <span className="bg-primary/50">{textContent}</span>;
};

export class WikiNode extends DecoratorNode<ReactNode> {
  private __articleKey?: string;
  private __textContent?: string;

  constructor(
    articleKey: string = "",
    textContent: string = "",
    nodeKey?: string,
  ) {
    super(nodeKey);
    this.__articleKey = articleKey;
    this.__textContent = textContent;
  }

  $config() {
    return this.config("wiki", { extends: DecoratorNode });
  }

  static clone(node: WikiNode): WikiNode {
    return new WikiNode(node.__articleKey, node.__textContent, node.__key);
  }

  static importJSON(serializedNode: SerializedWikiNode): WikiNode {
    const node = $createWikiNode(
      serializedNode.articleKey,
      serializedNode.textContent,
    );
    return node;
  }

  exportJSON(): SerializedWikiNode {
    return {
      ...super.exportJSON(),
      type: "wiki",
      articleKey: this.__articleKey ?? "",
      textContent: this.__textContent ?? "",
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(_prevNode: unknown, _dom: HTMLElement, _config: EditorConfig) {
    return false; // Tells Lexical that the element doesn't need to be re-created
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): ReactNode {
    return (
      <WikiNodeComponent
        articleKey={this.__articleKey}
        textContent={this.__textContent}
      />
    );
  }
}

export const $createWikiNode = (
  articleKey: string,
  textContent: string,
): WikiNode => {
  return new WikiNode(articleKey, textContent);
};

export const $isWikiNode = (
  node: WikiNode | LexicalNode | null | undefined,
): node is WikiNode => {
  return node instanceof WikiNode;
};
