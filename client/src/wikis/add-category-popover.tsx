import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { categorySchema } from "./schemas";
import { useCreateCategory } from "./hooks/use-create-category";
import { randomInArray } from "@/lib/random";
import { DEFAULT_COLORS } from "@/design-system/components/color-picker/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/design-system/primitives";
import { ColorPicker } from "@/design-system/components";

export const AddCategoryPopover = ({ trigger }: { trigger: ReactNode }) => {
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { color: randomInArray(DEFAULT_COLORS), name: "" },
  });
  const { createCategory } = useCreateCategory();

  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>

      <PopoverContent side="right" className="w-max">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(createCategory)}
            className="flex w-max gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-8 w-48"
                      placeholder="Geography"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ColorPicker
                      onChange={(color) => field.onChange(color)}
                      defaultValue={field.value}
                      size="sm"
                      position="right"
                      offset={20}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};
