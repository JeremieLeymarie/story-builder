import { EditStoryFormType } from "@/builder/hooks/use-edit-story-form";
import { useGetAllWikis } from "@/builder/hooks/use-get-all-wikis";
import { StoryGenreCombobox } from "@/design-system/components/story-genre-combobox";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/design-system/primitives";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { CircleHelpIcon, ExternalLinkIcon } from "lucide-react";
import { BaseSyntheticEvent } from "react";
import { WikiSelector } from "../../wiki-selector";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { Link } from "@tanstack/react-router";

export const EditStoryForm = ({
  onSubmit,
  form,
  isSubmitting = false,
}: {
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  isSubmitting?: boolean;
  form: EditStoryFormType;
}) => {
  const { story } = useBuilderContext();
  const { wikis, isLoading: isWikisLoading } = useGetAllWikis();
  const assignedWiki = wikis?.userWikis.find(
    (wiki) => wiki.key === story.wikiKey,
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="The Great Journey To The Green River"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <StoryGenreCombobox
                  onChange={field.onChange}
                  values={field.value}
                />
              </FormControl>
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
                  placeholder="A wonderful epic tale through the world of Penthetir. "
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
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input placeholder="http://your-image-url.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wikiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Linked wiki{" "}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CircleHelpIcon
                      size="16px"
                      className="hover:text-primary"
                    />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] text-xs font-normal">
                    You can link a story to a wiki and reference wiki articles
                    in scenes
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              {assignedWiki ? (
                <div className="flex items-center gap-2">
                  {assignedWiki.name}
                  <Link
                    to="/wikis/$wikiKey"
                    params={{ wikiKey: assignedWiki.key }}
                    target="_blank"
                  >
                    <ExternalLinkIcon size={16} />
                  </Link>
                </div>
              ) : (
                <FormControl>
                  <WikiSelector
                    disabled={!wikis || isWikisLoading}
                    wikis={wikis?.userWikis ?? []}
                    selectedWikiKey={field.value}
                    onChange={(wikiKey) => field.onChange(wikiKey)}
                  />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          Save
        </Button>
      </form>
    </Form>
  );
};
