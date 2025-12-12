import { useQuery } from "@tanstack/react-query";
import { getWikiService } from "@/domains/wiki/wiki-service";
import {
  Button,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/design-system/primitives";
import {
  ChevronsUpDown,
  EditIcon,
  ExternalLinkIcon,
  ScrollTextIcon,
  Trash2Icon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { WikiSectionArticle } from "@/domains/wiki/types";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { useEditorContext } from "@/design-system/components/editor/hooks/use-editor-context";
import { WikiNode } from "../lexical-wiki-node";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode } from "lexical";
import { useBuilderContext } from "../hooks/use-builder-context";

const editLinkSchema = z.object({ text: z.string(), articleKey: z.string() });
type EditLinkPayload = z.infer<typeof editLinkSchema>;

const useEditWikiNodeActions = ({ node }: { node: WikiNode }) => {
  const [editor] = useLexicalComposerContext();

  const editWikiNode = (value: EditLinkPayload) => {
    editor.update(() => {
      node.setArticleKey(value.articleKey);
      node.setTextContent(value.text);
    });
  };

  // Remove wiki and create a text node instead
  const deleteWikiNode = () => {
    editor.update(() => {
      const nodeBefore = node.getPreviousSibling();
      const textContent = node.textContent;
      node.remove();
      nodeBefore?.insertAfter($createTextNode(textContent));
    });
  };

  return { editWikiNode, deleteWikiNode };
};

const EditWikiNodeForm = ({
  node,
  articleKey,
}: {
  node: WikiNode;
  articleKey?: string;
}) => {
  const form = useForm<EditLinkPayload>({
    resolver: zodResolver(editLinkSchema),
    defaultValues: { text: node.textContent, articleKey: articleKey },
  });
  const [isArticleSelectorOpen, setIsArticleSelectorOpen] = useState(false);
  const { editWikiNode } = useEditWikiNodeActions({ node });
  const { story } = useBuilderContext();

  // TODO: this should be extracted to a hook (so that we can remove the duplication in wiki-lexical-plugin.tsx)
  const { data: articles } = useQuery({
    queryKey: ["wiki-articles", story.wikiKey],
    queryFn: async () => getWikiService().getWikiData(story.wikiKey!),
    select: (data) => data?.sections.flatMap((section) => section.articles),
    enabled: !!story.wikiKey,
  });
  const articlesByKey = articles?.reduce(
    (acc, article) => ({ ...acc, [article.key]: article }),
    {} as Record<string, WikiSectionArticle>,
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(editWikiNode)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text content</FormLabel>
              <FormDescription>
                What is shown in the the text of the scene
              </FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="articleKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linked article</FormLabel>
              <FormDescription>The article linked to the text</FormDescription>
              <FormControl>
                <Popover
                  open={isArticleSelectorOpen}
                  onOpenChange={setIsArticleSelectorOpen}
                  modal={true}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isArticleSelectorOpen}
                      className="w-[250px] justify-between"
                    >
                      {articlesByKey?.[field.value]?.title}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full p-0"
                    align="start"
                    side="bottom"
                  >
                    <Command
                      filter={(articleKey, search) =>
                        articlesByKey?.[articleKey]?.title
                          .toLocaleLowerCase()
                          .includes(search.toLocaleLowerCase())
                          ? 1
                          : 0
                      }
                    >
                      <CommandInput placeholder="Search articles..." />
                      <CommandList>
                        <ScrollArea className="h-[150px]">
                          <CommandGroup>
                            {articles?.map((article) => (
                              <CommandItem
                                key={article.key}
                                value={article.key}
                                onSelect={field.onChange}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose className="flex w-full justify-end gap-2" asChild>
          <div>
            <Button variant="secondary">Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </DialogClose>
      </form>
    </Form>
  );
};

const ArticleInfo = ({
  node,
  articleKey,
}: {
  node: WikiNode;
  articleKey?: string;
}) => {
  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleKey],
    queryFn: async () => getWikiService().getArticle(articleKey!),
    enabled: !!articleKey,
  });
  const { deleteWikiNode } = useEditWikiNodeActions({ node });

  return (
    <PopoverContent>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">
          {!article && !isLoading ? "Error" : "Details"}
        </span>
        <div className="flex">
          {isLoading || !article || !articleKey ? null : (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="xs" variant="ghost" disabled={!article}>
                  <EditIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Edit Article Link</DialogTitle>
                <div className="mt-2">
                  <EditWikiNodeForm node={node} articleKey={articleKey} />
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Button size="xs" variant="ghost" onClick={deleteWikiNode}>
            <Trash2Icon className="text-destructive" />
          </Button>
        </div>
      </div>
      <div className="mt-1">
        {isLoading ? (
          <SimpleLoader />
        ) : (
          <>
            {!article || !articleKey ? (
              <p className="text-muted-foreground">
                Article not found. Are you sure it still exists?
              </p>
            ) : (
              <div>
                Referenced article:&nbsp;
                <Link
                  to="/wikis/$wikiKey/$articleKey"
                  params={{ wikiKey: article.wikiKey, articleKey: articleKey }}
                  target="_blank"
                  className="inline-flex items-center gap-1 font-semibold text-emerald-600 select-none hover:underline"
                >
                  {article?.title} <ExternalLinkIcon size={14} />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </PopoverContent>
  );
};

export const EditorWikiNodeComponent = ({ node }: { node: WikiNode }) => {
  const { entityKey } = useEditorContext();

  const { data: articleKey } = useQuery({
    queryKey: ["get-article-link", node.articleLinkKey],
    queryFn: async () =>
      getWikiService().getArticleLink(node.articleLinkKey!, entityKey!),
    enabled: !!entityKey && !!node.articleLinkKey,
    select: (data) => data?.articleKey,
  });

  return (
    <Popover>
      <PopoverTrigger>
        <span className="inline-flex translate-y-0.5 items-center gap-1 rounded-xl bg-green-600/60 px-2">
          <ScrollTextIcon size={18} className="opacity-75" />
          {node.textContent}
        </span>
      </PopoverTrigger>
      <ArticleInfo articleKey={articleKey} node={node} />
    </Popover>
  );
};
