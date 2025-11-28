import {
  BuilderStory,
  LibraryStory,
  Story,
  STORY_GENRES,
  STORY_TYPE,
} from "@/lib/storage/domain";
import { getLocalRepository, LocalRepositoryPort } from "@/repositories";
import { WithoutKey } from "@/types";
import { lexicalContentSchema } from "@/lib/lexical-content";
import z from "zod";
import { actionSchema } from "@/lib/action-schema";

export const ANONYMOUS_AUTHOR = {
  key: "ANONYMOUS_AUTHOR_KEY",
  username: "Anonymous Author",
};

export const TEMPORARY_NULL_KEY = "TEMPORARY_NULL_KEY";

export const storyFromImportSchema = z.object({
  story: z.object(
    {
      key: z.nanoid({ message: "storyKey is required" }),
      title: z.string({ message: "Title is required" }),
      description: z.string({ message: "Description is required" }),
      firstSceneKey: z.nanoid({ message: "FirstSceneKey is required" }),
      creationDate: z
        .string({ message: "creationDate is required" })
        .transform((val) => new Date(val)),
      publicationDate: z
        .string({ message: "publicationDate is required" })
        .transform((val) => new Date(val))
        .optional(),
      genres: z.array(z.enum(STORY_GENRES)),
      author: z
        .object({
          username: z.string(),
          key: z.string(),
        })
        .optional(),
      image: z.url({ message: "Image has to be a valid URL" }),
      type: z.enum(STORY_TYPE, {
        message: "Type has to be a valid StoryType",
      }),
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
});
export type StoryFromImport = z.infer<typeof storyFromImportSchema>;

export type ImportServiceError =
  | "Invalid JSON format"
  | `Invalid format: ${string}`;

// TODO: we should do something like this at a higher level, and make it available everywhere
type ImportStoryResult<TData = never> =
  | {
      error: ImportServiceError;
      isOk: false;
    }
  | {
      data: TData;
      isOk: true;
    };

const makeErr = (error: ImportServiceError): ImportStoryResult => ({
  error,
  isOk: false,
});
const makeOk = <T>(data: T): ImportStoryResult<T> => ({ data, isOk: true });

export type ImportServicePort = {
  parseJSON: (jsonData: string) => ImportStoryResult<StoryFromImport>;
  createStory: (props: {
    story: StoryFromImport;
    type: Story["type"];
  }) => Promise<{ data: Story }>;
  createScenes: (props: {
    story: StoryFromImport;
    newStoryKey: string;
  }) => Promise<ImportStoryResult<null>>;
};

export const _makeBulkSceneUpdatePayload = ({
  storyFromImport,
  oldScenesToNewScenes,
}: {
  storyFromImport: StoryFromImport;
  oldScenesToNewScenes: Record<string, string>;
}) => {
  const scenesByKey = storyFromImport.scenes.reduce(
    (acc, scene) => ({
      ...acc,
      [scene.key]: scene,
    }),
    {} as Record<string, StoryFromImport["scenes"][number]>,
  );

  return storyFromImport.scenes
    .map((scene) => {
      if (!scenesByKey[scene.key]) return null;

      const actions = scenesByKey[scene.key]!.actions;

      if (!actions.length) return null; // No need to update if the scene doesn't have any actions

      const newActions = actions?.map((action) => ({
        ...action,
        targets: action.targets.map((target) => ({
          probability: target.probability,
          sceneKey: oldScenesToNewScenes[target.sceneKey]!,
        })),
      }));

      const newSceneKey = oldScenesToNewScenes[scene.key];

      if (!newSceneKey) {
        return null;
      }

      return { key: newSceneKey, actions: newActions };
    })
    .filter((scene) => !!scene);
};

export const _getImportService = ({
  localRepository,
}: {
  localRepository: LocalRepositoryPort;
}): ImportServicePort => {
  return {
    parseJSON: (jsonData) => {
      let parsed: unknown;

      try {
        parsed = JSON.parse(jsonData);
      } catch (_) {
        return makeErr("Invalid JSON format");
      }
      const zodParsed = storyFromImportSchema.safeParse(parsed);
      if (!zodParsed.success)
        return makeErr(`Invalid format: ${z.prettifyError(zodParsed.error)}`);

      return makeOk(zodParsed.data);
    },

    createStory: async ({ story: storyFromImport, type }) => {
      const { key: importedStoryKey, ...importedStory } = storyFromImport.story;

      const storyPayload: WithoutKey<LibraryStory> | WithoutKey<BuilderStory> =
        {
          ...importedStory,
          type,
          originalStoryKey: importedStoryKey,
          firstSceneKey: TEMPORARY_NULL_KEY,
        };

      if (type === "builder") {
        const user = await localRepository.getUser();
        storyPayload.author = user
          ? { username: user.username, key: user.key }
          : undefined;
      } else if (!storyPayload.author) {
        storyPayload.author = ANONYMOUS_AUTHOR;
      }

      const story = await localRepository.createStory(storyPayload);

      return { data: story };
    },

    createScenes: async ({ story: storyFromImport, newStoryKey }) => {
      const oldScenesToNewScenes: Record<string, string> = {};

      // Create scenes without actions
      for (const scene of storyFromImport.scenes) {
        const { key: oldSceneKey, ...sceneData } = scene;
        const { key } = await localRepository.createScene({
          ...sceneData,
          storyKey: newStoryKey,
          actions: [],
        });
        oldScenesToNewScenes[oldSceneKey] = key;
      }

      // Update scenes
      await localRepository.updateScenes(
        _makeBulkSceneUpdatePayload({
          storyFromImport,
          oldScenesToNewScenes,
        }),
      );

      // Update the story's firstSceneKey
      const newFirstSceneKey =
        oldScenesToNewScenes[storyFromImport.story.firstSceneKey];
      if (!newFirstSceneKey)
        throw new Error(
          "Story's old first scene key should be found in the old-key/new-key mapping",
        );

      await localRepository.updateFirstScene(newStoryKey, newFirstSceneKey);

      return makeOk(null);
    },
  };
};

export const getImportService = () =>
  _getImportService({ localRepository: getLocalRepository() });
