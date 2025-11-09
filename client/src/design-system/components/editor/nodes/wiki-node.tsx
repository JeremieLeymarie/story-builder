import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { getWikiService } from "@/domains/wiki/wiki-service";
import { useQuery } from "@tanstack/react-query";
import {
  DecoratorNode,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ScrollTextIcon } from "lucide-react";
import { ReactNode } from "react";
import { RichText } from "../components/rich-text-editor";
import { Link } from "@tanstack/react-router";
import { SimpleLoader } from "../../simple-loader";

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
const EditorWikiNodeComponent = ({
  articleKey,
  textContent,
}: {
  articleKey?: string;
  textContent?: string;
}) => {
  console.log({ articleKey });
  return (
    <span className="inline-flex translate-y-0.5 items-center gap-1 rounded-xl bg-green-600/60 px-2">
      <ScrollTextIcon size={18} className="opacity-75" />
      {textContent}
    </span>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
const DisplayWikiNodeComponent = ({
  articleKey,
  textContent,
}: {
  articleKey?: string;
  textContent?: string;
}) => {
  const wiki = getWikiService();
  const { data, isLoading } = useQuery({
    queryKey: ["get-article", articleKey],
    queryFn: async () => wiki.getArticle(articleKey!),
    enabled: !!articleKey,
  });
  if (isLoading || !data) {
    return <SimpleLoader />;
  }
  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Link
            to="/wikis/$wikiKey/$articleKey"
            params={{ articleKey: articleKey!, wikiKey: data.wikiKey }}
            target="_blank"
            className="cursor-pointer underline decoration-emerald-600 decoration-3 underline-offset-4"
          >
            {textContent}
          </Link>
        </TooltipTrigger>
        <TooltipContent className="h-2xs w-2xs">
          <p className="pt-3 text-slate-400">Wiki</p>
          <p className="py-3 text-lg font-semibold text-emerald-600 capitalize">
            {data.title}
          </p>
          <img src={data.image} className="rounded object-scale-down" />
          <RichText
            editable={false}
            initialState={data.content}
            editorNodes={[WikiNode]}
            textDisplayMode="full"
          />
        </TooltipContent>
      </Tooltip>
    </>
  );
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
    if (_editor._editable) {
      return (
        <EditorWikiNodeComponent
          articleKey={this.__articleKey}
          textContent={this.__textContent}
        />
      );
    } else {
      return (
        <DisplayWikiNodeComponent
          articleKey={this.__articleKey}
          textContent={this.__textContent}
        />
      );
    }
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
