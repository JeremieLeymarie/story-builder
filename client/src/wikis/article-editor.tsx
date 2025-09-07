import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArticleSchema, articleSchema } from "./schema";
import { useArticleActions } from "./hooks/use-article-actions";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@/design-system/primitives";
import { Editor } from "@/design-system/components/editor/blocks/editor";
import { SerializedEditorState } from "lexical";

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

  const handleSubmit = async (data: ArticleSchema) => {
    if (mode === "update") await updateArticle(articleKey, data);
    else await createArticle(data);
  };

  return (
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
          name="image"
          render={({ field }) => (
            <FormItem>
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
              <FormControl>
                <Editor
                  editable
                  onSerializedChange={field.onChange}
                  initialState={
                    defaultValues?.content as unknown as SerializedEditorState
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};
