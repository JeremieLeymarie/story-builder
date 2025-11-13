import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/design-system/primitives";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getWikiService } from "@/domains/wiki/wiki-service";
import { ScrollTextIcon } from "lucide-react";
import { WikiSectionArticle } from "@/domains/wiki/types";
import { mergeRegister } from "@lexical/utils";
import { useUpdateArticleLinks } from "./hooks/use-update-article-links";
import { $createWikiNode, WikiNode } from "@/builder/lexical-wiki-node";

// eslint-disable-next-line react-refresh/only-export-components
export const INSERT_WIKI_COMMAND: LexicalCommand<string> = createCommand();

export const WikiPlugin = ({ wikiKey }: { wikiKey: string | null }) => {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const { data: articles } = useQuery({
    queryKey: ["wiki-articles", wikiKey],
    queryFn: async () => getWikiService().getWikiData(wikiKey!),
    select: (data) => data?.sections.flatMap((section) => section.articles),
    enabled: !!wikiKey,
  });
  const articlesByKey = articles?.reduce(
    (acc, article) => ({ ...acc, [article.key]: article }),
    {} as Record<string, WikiSectionArticle>,
  );
  const currentTextSelection = useRef<string>(null);
  const [searchValue, setSearchValue] = useState<string>();
  const wikiService = getWikiService();

  if (!editor.hasNodes([WikiNode]))
    throw new Error(
      "WikiPlugin: WikiNode not registered on editor (initialConfig.nodes)",
    );

  const onSelectArticle = (articleKey: string) => {
    editor.dispatchCommand(INSERT_WIKI_COMMAND, articleKey);
    setOpen(false);
  };

  useUpdateArticleLinks();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<string>(
        INSERT_WIKI_COMMAND,
        (articleKey) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const textContent = selection.getTextContent();
            const wikiNode = $createWikiNode({
              articleLinkKey: wikiService.makeArticleLinkKey(),
              articleKey,
              textContent,
            });
            selection.insertNodes([wikiNode]);
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection))
            currentTextSelection.current = selection.getTextContent();

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [wikiService, editor]);

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        if (!open) setSearchValue(undefined);
        return setOpen(open);
      }}
      modal={true}
    >
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={!wikiKey}
          onClick={() => {
            if (currentTextSelection.current)
              setSearchValue(currentTextSelection.current);
          }}
        >
          <ScrollTextIcon />
          Wiki
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" side="bottom">
        <Command
          filter={(articleKey, search) =>
            articlesByKey?.[articleKey]?.title
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase())
              ? 1
              : 0
          }
        >
          <CommandInput
            placeholder="Search articles..."
            value={searchValue}
            onValueChange={(search) => setSearchValue(search)}
          />
          <CommandList>
            <ScrollArea className="h-[150px]">
              <CommandGroup>
                {articles?.map((article) => (
                  <CommandItem
                    key={article.key}
                    value={article.key}
                    onSelect={(value) => onSelectArticle(value)}
                  >
                    {article.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
