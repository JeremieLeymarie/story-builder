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

export const ArticleEditor = ({
  defaultValues,
}: {
  defaultValues?: ArticleSchema;
}) => {
  const form = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: defaultValues ?? {},
  });
  const { createArticle } = useArticleActions();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(createArticle)}
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
                  initialState={undefined}
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
