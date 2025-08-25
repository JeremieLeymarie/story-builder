import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
  Textarea,
} from "@/design-system/primitives";
import { WithoutKey } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { Wiki } from "@/lib/storage/domain";
import z from "zod";

export type OnSubmitWikiFormProps = Omit<
  WithoutKey<Wiki>,
  "author" | "type" | "createdAt"
> & { firstSceneKey?: string };

type WikiFormProps = {
  onSubmit: (props: OnSubmitWikiFormProps) => void;
  trigger?: JSX.Element;
  defaultValues?: WikiSchema;
  title: string;
  description: string;
};

const schema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.url({ message: "Image has to be a valid URL" }),
});

export type WikiSchema = z.output<typeof schema>;

export const WikiFormDialog = (
  props: Omit<WikiFormProps, "trigger"> & { trigger: JSX.Element },
) => {
  const [open, setOpen] = useState(false);

  return <ControlledWikiFormDialog {...props} open={open} setOpen={setOpen} />;
};

export const ControlledWikiFormDialog = ({
  onSubmit,
  trigger,
  defaultValues,
  setOpen,
  open,
  title,
  description,
}: WikiFormProps & { open: boolean; setOpen: (open: boolean) => void }) => {
  const form = useForm<WikiSchema>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      image: "",
    },
  });

  const handleOpen = (open: boolean) => {
    setOpen(open);
    if (!open) form.reset();
  };

  const submit = (data: WikiSchema) => {
    onSubmit?.(data);
    handleOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      {!!trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader className="p-1">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Penthetir Wiki" {...field} />
                  </FormControl>
                  <FormDescription>
                    The displayed name of your wiki
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="All of the lore of the great world of Penthetir."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short description of your wiki
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input placeholder="http://your-image-url.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    The cover image for your wiki
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
