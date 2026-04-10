import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useArticleActions } from "./hooks/use-article-actions";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/design-system/primitives";
import { Separator } from "@/design-system/primitives/separator";
import { CornerDownLeft, FileText, Image, FolderTree } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useWikiStore } from "./hooks/use-wiki-store";
import { ArticleSchema, articleSchema } from "./schemas";
import { CategoryPicker } from "./category-picker";
import { RichText } from "@/design-system/components/editor/components/rich-text-editor";
import { EditorContextProvider } from "@/design-system/components/editor/hooks/use-editor-context";
import { useEffect } from "react";

type UpdateProps =
  | {
      defaultValues: ArticleSchema;
      articleKey: string;
      mode: "update";
    }
  | {
      defaultValues?: Partial<ArticleSchema>;
      articleKey?: undefined;
      mode: "create";
    };

export const ArticleEditor = ({
  defaultValues,
  articleKey,
  mode,
}: UpdateProps) => {
  const form = useForm<ArticleSchema>({
    resolver: zodResolver(articleSchema),
    defaultValues: defaultValues as Partial<ArticleSchema>,
  });
  const { createArticle, updateArticle } = useArticleActions();
  const {
    wiki: { key: wikiKey },
    sections,
  } = useWikiStore((state) => state.wikiData);
  const categories = sections
    .map((section) => section.category)
    .filter((cat) => !!cat);

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, mode, form]);

  const handleSubmit = async (data: ArticleSchema) => {
    if (mode === "update") await updateArticle(articleKey, data);
    else await createArticle(data);
  };

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-background p-6">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-start">
          {mode === "update" ? (
            <Link to="/wikis/$wikiKey/$articleKey" params={{ wikiKey, articleKey }}>
              <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                <CornerDownLeft size={16} /> Back to article
              </Button>
            </Link>
      ) : (
        <Link to="/wikis/$wikiKey" params={{ wikiKey }}>
          <Button variant="ghost" className="w-max items-center">
            <CornerDownLeft size={16} /> Back to home
          </Button>
        </Link>
          )}
          </div>
          <Card className="shadow-lg">
            <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {mode === "update" ? "Edit Article" : "Create New Article"}
            </CardTitle>
            <CardDescription>
              {mode === "update"
                ? "Update your article information and content"
                : "Fill in the details to create a new wiki article"}
            </CardDescription>
          </CardHeader>
      <CardContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-base">
                  <FileText size={18} />
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-base"
                    placeholder="My article title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
              />
          <Separator />
          <FormField
            control={form.control}
            name="categoryKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-base">
                      <FolderTree size={18} />
                      Category
                </FormLabel>
                <FormControl>
                  <CategoryPicker
                    categories={categories}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-base">
                  <Image size={18} />
                    Preview image
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-base"
                    placeholder="http://your-image-url.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Content</FormLabel>
                <FormControl>
                  <EditorContextProvider
                    entityType="wiki-article"
                    entityKey={articleKey}
                  >
                    <RichText
                      editable
                      onSerializedChange={field.onChange}
                      initialState={defaultValues?.content}
                      textDisplayMode="scroll"
                    />
                  </EditorContextProvider>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
              />
            <div className="flex justify-center pt-4">
                <Button size="lg" className="min-w-32" type="submit">
                  {mode === "update" ? "Update Article" : "Create Article"}
              </Button>
            </div>
        </form>
            </Form>
          </CardContent>
        </Card>
        </div>
    </div>
  );
};
