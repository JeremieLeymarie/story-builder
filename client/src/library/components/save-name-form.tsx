import { CheckIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
} from "@/design-system/primitives";
import type { ControllerRenderProps } from "react-hook-form";

const saveNameSchema = z.object({
  name: z.string(),
});

type SaveNameSchema = z.output<typeof saveNameSchema>;

type SaveNameFormProps = {
  onSubmit: (name?: string) => void;
  onCancel: () => void;
  defaultName?: string;
  variant?: "default" | "compact" | "inline";
  disabled?: boolean;
};

const NameInput = ({
  field,
  className,
  ...props
}: {
  field: ControllerRenderProps<SaveNameSchema, "name">;
  className?: string;
} & Omit<React.ComponentProps<typeof Input>, "name">) => (
  <FormItem>
    <FormControl>
      <Input
        placeholder="Save name"
        {...field}
        className={className}
        {...props}
      />
    </FormControl>
  </FormItem>
);

export const SaveNameForm = ({
  onSubmit,
  onCancel,
  defaultName = "",
  variant = "default",
  disabled = false,
}: SaveNameFormProps) => {
  const form = useForm<SaveNameSchema>({
    resolver: zodResolver(saveNameSchema),
    defaultValues: { name: defaultName },
  });

  const handleSubmit = (data: SaveNameSchema) => {
    onSubmit(data.name.trim() || undefined);
  };

  const escapeHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onCancel();
  };

  if (variant === "inline") {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          onClick={(e) => e.stopPropagation()}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <NameInput
                field={field}
                autoFocus
                className="h-7 w-40 text-sm"
                onBlur={form.handleSubmit(handleSubmit)}
                onKeyDown={escapeHandler}
              />
            )}
          />
        </form>
      </Form>
    );
  }

  if (variant === "compact") {
    return (
      <Form {...form}>
        <form
          className="flex items-center gap-1 px-2 py-1.5"
          onSubmit={form.handleSubmit(handleSubmit)}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <NameInput
                field={field}
                autoFocus
                className="h-7 text-sm"
                onKeyDown={escapeHandler}
              />
            )}
          />
          <button
            type="submit"
            className="hover:bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-sm"
          >
            <CheckIcon size={14} />
          </button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="h-7 w-7 shrink-0 p-0"
            onClick={onCancel}
          >
            <XIcon size={14} />
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form
        className="flex items-center gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <NameInput field={field} autoFocus className="h-9 w-40" />
          )}
        />
        <Button type="submit" disabled={disabled}>
          Create
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </Form>
  );
};
