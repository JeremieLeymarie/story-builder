"use no memo";
import { FileDropInput } from "@/design-system/components/file-input";
import {
  FormField,
  FormItem,
  FormControl,
  Input,
  FormLabel,
  FormDescription,
  Button,
  Form,
  FormMessage,
  DialogClose,
} from "@/design-system/primitives";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { INSERT_IMAGE_COMMAND } from "./command";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const imageSchema = z.object({
  src: z.string(), // TODO: use base64url?
  altText: z.string().optional(),
});

type ImageSchema = z.infer<typeof imageSchema>;

export const InsertImageForm = () => {
  const [editor] = useLexicalComposerContext();
  const form = useForm({
    resolver: zodResolver(imageSchema),
  });

  const onSubmit = (data: ImageSchema) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src: data.src ?? "",
      altText: data.altText ?? "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
        <FormField
          control={form.control}
          name="src"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2">
                <FormControl>
                  <FileDropInput
                    onUploadFile={(dataURL) => {
                      field.onChange(dataURL);
                    }}
                    readAs="dataURL"
                    accept="image"
                  />
                </FormControl>
                <p className="w-full text-center">--- OR ---</p>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="Paste a URL from the web"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="altText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternative Text</FormLabel>
              <FormDescription>
                A brief text description of your image for accessibility
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="A very neat photo of a wonderful world"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button onPointerUp={form.handleSubmit(onSubmit)}>Confirm</Button>
        </DialogClose>
      </form>
    </Form>
  );
};
