import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
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
import { useEditorContext } from "../hooks/use-editor-context";
import { useQuery } from "@tanstack/react-query";
import { getWikiService } from "@/domains/wiki/wiki-service";

export type SerializedWikiNode = Spread<
  {
    articleLinkKey: string;
    textContent: string;
    type: "wiki";
    version: 1;
  },
  SerializedLexicalNode
>;

// TODO: move this file out of the design system

// eslint-disable-next-line react-refresh/only-export-components
const EditorWikiNodeComponent = ({
  articleLinkKey,
  textContent,
}: {
  articleLinkKey?: string;
  textContent?: string;
}) => {
  const { entityKey } = useEditorContext();

  const { data: _articleKey } = useQuery({
    queryKey: ["get-article-link", articleLinkKey],
    queryFn: async () =>
      getWikiService().getArticleLink(articleLinkKey!, entityKey!),
    enabled: !!entityKey && !!articleLinkKey,
    select: (data) => data?.articleKey,
  });

  return (
    <span className="inline-flex translate-y-0.5 items-center gap-1 rounded-xl bg-green-600/60 px-2">
      <ScrollTextIcon size={18} className="opacity-75" />
      {textContent}
    </span>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
const DisplayWikiNodeComponent = ({
  articleLinkKey,
  textContent,
}: {
  articleLinkKey?: string;
  textContent?: string;
}) => {
  const { entityKey } = useEditorContext();

  const { data: article } = useQuery({
    queryKey: ["get-article-link", articleLinkKey],
    queryFn: async () => {
      const wikiService = getWikiService();
      const articleLink = await wikiService.getArticleLink(
        articleLinkKey!,
        entityKey!,
      );
      if (!articleLink) throw new Error("Article key not found");
      const article = await wikiService.getArticle(articleLink?.articleKey);
      return article;
    },
    enabled: !!entityKey && !!articleLinkKey,
  });

  const linkContent = (
    <span className="cursor-pointer underline decoration-emerald-600 decoration-3 underline-offset-4">
      {textContent}
    </span>
  );

  if (!article) return linkContent;

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Link
            to="/wikis/$wikiKey/$articleKey"
            params={{ articleKey: article.key, wikiKey: article.wikiKey }}
            target="_blank"
          >
            {linkContent}
          </Link>
        </TooltipTrigger>
        <TooltipContent className="h-2xs w-2xs">
          <p className="pt-3 text-slate-400">Wiki</p>
          <p className="py-3 text-lg font-semibold text-emerald-600 capitalize">
            {article.title}
          </p>
          <img src={article.image} className="rounded object-scale-down" />
          <RichText
            editable={false}
            initialState={article.content}
            editorNodes={[WikiNode]}
            textDisplayMode="full"
          />
        </TooltipContent>
      </Tooltip>
    </>
  );
};

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
