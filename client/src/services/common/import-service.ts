import { BuilderStory, LibraryStory, Story, Wiki } from "@/lib/storage/domain";
import { getLocalRepository, LocalRepositoryPort } from "@/repositories";
import { WithoutKey } from "@/types";
import z from "zod";
import { produce } from "immer";
import {
  StoryFromImport,
  storyFromImportSchema,
  WikiFromImport,
} from "./schema";
import {
  getDexieWikiRepository,
  WikiRepositoryPort,
} from "@/domains/wiki/wiki-repository";
import { nanoid } from "nanoid";

export const ANONYMOUS_AUTHOR = {
  key: "ANONYMOUS_AUTHOR_KEY",
  username: "Anonymous Author",
};

export const TEMPORARY_NULL_KEY = "TEMPORARY_NULL_KEY";

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
  }) => Promise<Record<string, string>>;
  createWiki: (props: {
    wikiData: WikiFromImport;
    type: Wiki["type"];
    oldScenesToNew: Record<string, string>;
    newStoryKey: string;
  }) => Promise<void>;
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

      const newActions = actions?.map((action) =>
        produce(action, (draft) => {
          if (draft.sceneKey)
            draft.sceneKey = oldScenesToNewScenes[draft.sceneKey];
          if (draft.type === "conditional") {
            const newTargetSceneKey =
              oldScenesToNewScenes[draft.condition.sceneKey];
            if (!newTargetSceneKey)
              throw new Error(
                "sceneKey not found in old scene to new scenes mapping",
              ); // Should we throw here or should gracefully fallback on a simple action?
            draft.condition.sceneKey = newTargetSceneKey;
          }
        }),
      );

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
  wikiRepository,
}: {
  localRepository: LocalRepositoryPort;
  wikiRepository: WikiRepositoryPort;
}): ImportServicePort => {
  const _createWikiCategories = async (
    categories: WikiFromImport["categories"],
    newWikiKey: string,
  ) => {
    const { oldToNew, bulkPayload } = categories.reduce(
      (acc, curr) => {
        const k = nanoid();

        return produce(acc, (draft) => {
          draft.bulkPayload.push({
            key: k,
            color: curr.color,
            name: curr.name,
            wikiKey: newWikiKey,
          });
          draft.oldToNew[curr.key] = k;
        });
      },
      {
        oldToNew: {},
        bulkPayload: [],
      } as {
        oldToNew: Record<string, string>;
        bulkPayload: Parameters<typeof wikiRepository.bulkAddCategories>[0];
      },
    );

    await wikiRepository.bulkAddCategories(bulkPayload);
    return oldToNew;
  };

  const _createWikiArticles = async ({
    articles,
    oldCategoriesToNew,
    newWikiKey,
  }: {
    articles: WikiFromImport["articles"];
    oldCategoriesToNew: Record<string, string>;
    newWikiKey: string;
  }) => {
    const { oldToNew, bulkPayload } = articles.reduce(
      (acc, curr) => {
        const k = nanoid();
        const date = new Date();
        const newCatKey = curr.categoryKey
          ? oldCategoriesToNew[curr.categoryKey]
          : undefined;
        if (curr.categoryKey && !newCatKey)
          throw new Error(
            `Wiki Article's old category key [${curr.categoryKey}] should be found in the old-key/new-key mapping`,
          );

        return produce(acc, (draft) => {
          draft.bulkPayload.push({
            key: k,
            wikiKey: newWikiKey,
            categoryKey: newCatKey,
            createdAt: date,
            updatedAt: date,
            content: curr.content,
            image: curr.image,
            title: curr.title,
          });
          draft.oldToNew[curr.key] = k;
        });
      },
      {
        oldToNew: {},
        bulkPayload: [],
      } as {
        oldToNew: Record<string, string>;
        bulkPayload: Parameters<typeof wikiRepository.bulkAddArticles>[0];
      },
    );

    await wikiRepository.bulkAddArticles(bulkPayload);
    return oldToNew;
  };

  const _createWikiArticleLinks = async ({
    articleLinks,
    oldScenesToNew,
    oldArticlesToNew,
  }: {
    articleLinks: WikiFromImport["articleLinks"];
    oldScenesToNew: Record<string, string>;
    oldArticlesToNew: Record<string, string>;
  }) => {
    const bulkPayload = articleLinks.map((curr) => {
      const k = nanoid();

      const newArticleKey = curr.articleKey
        ? oldArticlesToNew[curr.articleKey]
        : undefined;
      if (!newArticleKey)
        throw new Error(
          `Wiki Article Link's old article key [${curr.articleKey}] should be found in the old-key/new-key mapping`,
        );

      if (curr.entityType !== "scene") {
        throw new Error(
          `Unsupported entity type for wiki article link ${curr.entityType}`,
        );
      }
      const newEntityKey = curr.entityKey
        ? oldScenesToNew[curr.entityKey]
        : undefined;
      if (!newEntityKey)
        throw new Error(
          `Wiki Article Link's old entity key [${curr.entityKey}] should be found in the old-key/new-key mapping`,
        );

      return {
        key: k,
        articleKey: newArticleKey,
        entityKey: newEntityKey,
        entityType: curr.entityType,
      };
    });

    await wikiRepository.bulkAddArticleLinks(bulkPayload);
  };

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
          wikiKey: TEMPORARY_NULL_KEY,
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

      return oldScenesToNewScenes;
    },

    createWiki: async ({ wikiData, type, oldScenesToNew, newStoryKey }) => {
      const wikiKey = await wikiRepository.create({
        createdAt: new Date(),
        image: wikiData.wiki.image,
        name: wikiData.wiki.name,
        type,
        author: wikiData.wiki.author,
        description: wikiData.wiki.description,
      });

      const oldCategoriesToOld = await _createWikiCategories(
        wikiData.categories,
        wikiKey,
      );

      const oldArticlesToNew = await _createWikiArticles({
        articles: wikiData.articles,
        newWikiKey: wikiKey,
        oldCategoriesToNew: oldCategoriesToOld,
      });

      await _createWikiArticleLinks({
        articleLinks: wikiData.articleLinks,
        oldArticlesToNew: oldArticlesToNew,
        oldScenesToNew,
      });

      localRepository.updateStory({ key: newStoryKey, wikiKey });
    },
  };
};

export const getImportService = () =>
  _getImportService({
    localRepository: getLocalRepository(),
    wikiRepository: getDexieWikiRepository(),
  });
