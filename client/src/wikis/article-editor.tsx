import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useArticleActions } from "./hooks/use-article-actions";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/design-system/primitives";
import { CornerDownLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useWikiStore } from "./hooks/use-wiki-store";
import { ArticleSchema, articleSchema } from "./schemas";
import { RichText } from "@/design-system/components/editor/components/rich-text-editor";
import { CategoryPicker } from "./category-picker";

type UpdateProps =
  | {
      defaultValues: ArticleSchema;
      articleKey: string;
      mode: "update";
    }
  | { defaultValues?: undefined; articleKey?: undefined; mode: "create" };

export const ArticleEditor = ({
  defaultValues,
  articleKey,
  mode,
}: UpdateProps) => {
  const form = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: defaultValues ?? {},
  });
  const { createArticle, updateArticle } = useArticleActions();
  const {
    wiki: { key: wikiKey },
    sections,
  } = useWikiStore((state) => state.wikiData);
  const categories = sections
    .map((section) => section.category)
    .filter((cat) => !!cat);

  const handleSubmit = async (data: ArticleSchema) => {
    if (mode === "update") await updateArticle(articleKey, data);
    else await createArticle(data);
  };

  return (
    <div className="flex flex-col gap-3">
      {mode === "update" ? (
        <Link to="/wikis/$wikiKey/$articleKey" params={{ wikiKey, articleKey }}>
          <Button variant="outline" size="sm" className="w-max items-center">
            <CornerDownLeft size={20} /> Back to article
          </Button>
        </Link>
      ) : (
        <Link to="/wikis/$wikiKey" params={{ wikiKey }}>
          <Button variant="outline" size="sm" className="w-max items-center">
            <CornerDownLeft size={20} /> Back to home
          </Button>
        </Link>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    className="w-6/12"
                    placeholder="My article title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
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

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preview image</FormLabel>
                <FormControl>
                  <Input
                    className="w-6/12"
                    placeholder="http://your-image-url.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichText
                    editable
                    onSerializedChange={field.onChange}
                    initialState={defaultValues?.content as SceneContent}
                    textDisplayMode="scroll"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  );
};
