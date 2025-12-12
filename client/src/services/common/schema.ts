import { gameThemeSchema } from "@/domains/builder/story-theme";
import { actionSchema } from "@/lib/action-schema";
import { lexicalContentSchema } from "@/lib/lexical-content";
import {
  STORY_GENRES,
  STORY_TYPE,
  WIKI_ARTICLE_LINKS_ENTITY_TYPES,
} from "@/lib/storage/domain";
import z from "zod";

const authorSchema = z
  .object({
    username: z.string(),
    key: z.string(),
  })
  .optional();

export const importDataSchema = z.object({
  story: z.object(
    {
      key: z.nanoid({ message: "Story key is required" }),
      title: z.string({ message: "Title is required" }),
      description: z.string({ message: "Description is required" }),
      firstSceneKey: z.nanoid({ message: "First scene key is required" }),
      creationDate: z
        .string({ message: "creationDate is required" })
        .transform((val) => new Date(val)),
      publicationDate: z
        .string({ message: "publicationDate is required" })
        .transform((val) => new Date(val))
        .optional(),
      genres: z.array(z.enum(STORY_GENRES)),
      author: authorSchema,
      image: z.url({ message: "Image has to be a valid URL" }),
      type: z.enum(STORY_TYPE, {
        message: "Type has to be a valid StoryType",
      }),
      wikiKey: z.nanoid().optional(),
    },
    { message: "Story is required" },
  ),
  scenes: z.array(
    z.object({
      key: z.nanoid({ message: "Key is required" }),
      storyKey: z.nanoid({ message: "StoryKey is required" }),
      title: z.string({ message: "Title is required" }),
      content: lexicalContentSchema,
      actions: z.array(actionSchema),
      builderParams: z.object({
        position: z.object({
          x: z.number({ message: "X is required" }),
          y: z.number({ message: "Y is required" }),
        }),
      }),
    }),
    { message: "Scenes are required" },
  ),
  wiki: z
    .object({
      wiki: z.object({
        key: z.nanoid(),
        author: authorSchema,
        type: z.union([z.literal("imported"), z.literal("created")]),
        name: z.string(),
        description: z.string(),
        image: z.url({ message: "Image has to be a valid URL" }),
        createdAt: z.string().transform((val) => new Date(val)),
      }),
      categories: z.array(
        z.object({
          wikiKey: z.nanoid(),
          key: z.nanoid(),
          name: z.string(),
          color: z.string(),
        }),
      ),
      articles: z.array(
        z.object({
          key: z.nanoid(),
          wikiKey: z.nanoid(),
          title: z.string(),
          content: lexicalContentSchema,
          image: z.url(),
          createdAt: z.string().transform((val) => new Date(val)),
          updatedAt: z.string().transform((val) => new Date(val)),
          categoryKey: z.nanoid().optional(),
        }),
      ),
      articleLinks: z.array(
        z.object({
          key: z.nanoid(),
          articleKey: z.nanoid(),
          entityType: z.enum(WIKI_ARTICLE_LINKS_ENTITY_TYPES),
          entityKey: z.nanoid(),
        }),
      ),
    })
    .nullable()
    .optional(),
  theme: gameThemeSchema.optional(),
});

export type ImportData = z.infer<typeof importDataSchema>;
export type WikiFromImport = NonNullable<ImportData["wiki"]>;
export type ThemeFromImport = NonNullable<ImportData["theme"]>;
