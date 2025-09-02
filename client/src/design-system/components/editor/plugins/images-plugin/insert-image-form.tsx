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
} from "@/design-system/primitives";
import { zodResolver } from "@hookform/resolvers/zod";
import { LexicalEditor } from "lexical";
import { useForm } from "react-hook-form";
import z from "zod";
import { INSERT_IMAGE_COMMAND } from "./command";
import { XIcon } from "lucide-react";

const ImagePreview = ({
  src,
  onRemove,
}: {
  src: string;
  onRemove: () => void;
}) => {
  return (
    <div className="group relative m-auto w-10/12">
      <XIcon
        className="bg-primary absolute -top-2 -right-2 z-[100] rounded-full p-1"
        size={22.75}
        onClick={onRemove}
      />
      <img src={src} className="rounded shadow" />
    </div>
  );
};

const imageSchema = z.object({
  src: z.string(), // TODO: use base64url?
  altText: z.string().optional(),
});

type ImageSchema = z.infer<typeof imageSchema>;

export const InsertImageDialog = ({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}) => {
  const form = useForm({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      altText: undefined,
      src: undefined,
    },
  });

  const onSubmit = (data: ImageSchema) => {
    console.log(data);
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src: data.src,
      altText: data.altText ?? "",
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (invalid) => {
          console.error({ invalid });
        })}
        className="mt-2 space-y-4"
      >
        <FormField
          control={form.control}
          name="src"
          render={({ field }) => (
            <FormItem>
              {field.value ? (
                <ImagePreview
                  src={field.value}
                  onRemove={() => field.onChange(undefined)}
                />
              ) : (
                <div className="space-y-2">
                  <FormControl>
                    <FileDropInput
                      onUploadFile={(dataURL) => {
                        field.onChange(dataURL);
                      }}
                      readAs="dataURL"
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
                </div>
              )}
              <FormMessage />
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
        <Button type="submit">Confirm</Button>
      </form>
    </Form>
  );
};
