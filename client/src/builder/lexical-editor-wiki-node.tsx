import {
  DecoratorNode,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactNode } from "react";
import { EditorWikiNodeComponent } from "./components/lexical-node-wiki-article-editor";
import { DisplayWikiNodeComponent } from "./components/lexical-node-wiki-article-display";

export type SerializedWikiNode = Spread<
  {
    articleLinkKey: string;
    textContent: string;
    type: "wiki";
    version: 1;
  },
  SerializedLexicalNode
>;

export class WikiNode extends DecoratorNode<ReactNode> {
  private __articleLinkKey?: string;
  private __textContent: string;

  // This attribute is only used to update the related article links, not to represent the linked article key reliably
  private __articleKey?: string;

  constructor(
    props?: {
      articleLinkKey?: string;
      textContent: string;
      articleKey?: string;
    },
    nodeKey?: string,
  ) {
    super(nodeKey);
    this.__articleLinkKey = props?.articleLinkKey;
    this.__textContent = props?.textContent ?? "";
    this.__articleKey = props?.articleKey;
  }

  $config() {
    return this.config("wiki", { extends: DecoratorNode });
  }

  static clone(node: WikiNode): WikiNode {
    return new WikiNode(
      {
        articleLinkKey: node?.__articleLinkKey,
        textContent: node.__textContent,
        articleKey: node.__articleKey,
      },
      node.__key,
    );
  }

  static importJSON({
    articleLinkKey,
    textContent,
  }: SerializedWikiNode): WikiNode {
    const node = $createWikiNode({ articleLinkKey, textContent }); // should we add articleKey?
    return node;
  }

  exportJSON(): SerializedWikiNode {
    return {
      ...super.exportJSON(),
      type: "wiki",
      articleLinkKey: this.__articleLinkKey ?? "",
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
    if (_editor._editable) {
      return (
        <EditorWikiNodeComponent
          articleLinkKey={this.__articleLinkKey}
          textContent={this.__textContent}
        />
      );
    } else {
      return (
        <DisplayWikiNodeComponent
          articleLinkKey={this.__articleLinkKey}
          textContent={this.__textContent}
        />
      );
    }
  }

  get articleLinkKey() {
    return this.__articleLinkKey;
  }

  get articleKey() {
    return this.__articleKey;
  }
}

export const $createWikiNode = ({
  articleKey,
  articleLinkKey,
  textContent,
}: {
  articleKey?: string;
  articleLinkKey: string;
  textContent: string;
}): WikiNode => {
  return new WikiNode({ articleLinkKey, textContent, articleKey });
};

export const $isWikiNode = (
  node: WikiNode | LexicalNode | null | undefined,
): node is WikiNode => {
  return node instanceof WikiNode;
};
