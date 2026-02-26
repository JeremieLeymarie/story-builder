import { Form } from "@/design-system/primitives";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const attributeSchema = z.object({
  key: z.nanoid(),
  name: z.string(),
  description: z.string(),
  isEditableByPlayer: z.boolean(),
  visibility: z.union([z.literal("visible"), z.literal("invisible")]),
  initialValue: z.int(),
});

const characterFormSchema = z.object({
  key: z.nanoid(),
  storyKey: z.nanoid(),
  attributes: z.record(z.nanoid(), attributeSchema),
});

const useEditCharacterForm = () => {
  const form = useForm({
    resolver: zodResolver(characterFormSchema),
    defaultValues: {},
  });

  const handleSubmit = form.handleSubmit((payload) => {
    // TODO:
  });

  return { form, handleSubmit };
};

export const EditCharacterForm = () => {
  const { form, handleSubmit } = useEditCharacterForm();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}></form>
    </Form>
  );
};
