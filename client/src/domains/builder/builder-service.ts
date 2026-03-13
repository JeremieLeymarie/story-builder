import { Action, BuilderPosition, Scene, Story } from "@/lib/storage/domain";
import { LocalRepositoryPort } from "@/repositories/local-repository-port";
import { BuilderNode, BuilderEdge } from "@/builder/types";
import { ImportServicePort } from "@/services/common/import-service";
import { WithoutKey } from "@/types";
import { makeSimpleLexicalContent } from "@/lib/lexical-content";
import { BuilderServicePort } from "./ports/builder-service-port";
import { BuilderStoryRepositoryPort } from "./ports/builder-story-repository-port";
import { LayoutServicePort } from "./ports/layout-service-port";
import { EntityNotExistError } from "../errors";
import { nanoid } from "nanoid";
import { BuilderSceneRepositoryPort } from "./ports/builder-scene-repository-port";
import {
  ActionTargetNotFound,
  CannotDeleteFirstSceneError,
  DuplicationMissingPositionError,
} from "./errors";
import { ImportData } from "@/services/common/schema";
import { produce } from "immer";
import { N } from "@/lib/number";

export const _getBuilderService = ({
  localRepository,
  layoutService,
  importService,
  storyRepository,
  sceneRepository,
}: {
  layoutService: LayoutServicePort;
  importService: ImportServicePort;
  localRepository: LocalRepositoryPort; // Legacy: should be removed and replaced by domain-specific repositories
  storyRepository: BuilderStoryRepositoryPort;
  sceneRepository: BuilderSceneRepositoryPort;
}): BuilderServicePort => {
  const getUserBuilderStories = async () => {
    const user = await localRepository.getUser();

    const storiesWithAuthor = user?.key
      ? await localRepository.getStoriesByAuthor(user?.key)
      : [];

    const storiesWithoutAuthor =
      await localRepository.getStoriesByAuthor(undefined);

    return [
      ...(storiesWithAuthor ?? []),
      ...(storiesWithoutAuthor ?? []),
    ].filter((story) => story.type === "builder");
  };

  const getBuilderStoryData = async (storyKey: string) => {
    const story = await localRepository.getStory(storyKey);
    const scenes = await localRepository.getScenesByStoryKey(storyKey);

    return { story, scenes };
  };

  const getAllBuilderData = async () => {
    const stories = await getUserBuilderStories();
    const scenes = await localRepository.getScenesByStoryKey(
      stories?.map((story) => story.key) ?? [],
    );

    return { stories, scenes };
  };

  return {
    updateSceneBuilderPosition: async (
      sceneKey: string,
      position: BuilderPosition,
    ) => {
      await localRepository.updatePartialScene(sceneKey, {
        builderParams: { position },
      });
    },

    addSceneConnection: async ({
      sourceSceneKey,
      actionKey,
      destinationSceneKey,
    }) => {
      const sourceScene = await sceneRepository.get(sourceSceneKey);
      if (!sourceScene) throw new EntityNotExistError("scene", sourceSceneKey);

      const actions = sourceScene.actions.map((action) => {
        if (action.key === actionKey) {
          const targetAlreadyExists = action.targets.find(
            (t) => t.sceneKey === destinationSceneKey,
          );
          if (targetAlreadyExists) return action;

          return {
            ...action,
            targets: [
              ...action.targets,
              {
                sceneKey: destinationSceneKey,
                probability: action.targets.length > 0 ? 0 : 100,
              },
            ],
          } satisfies Action;
        }
        return action;
      });

      await localRepository.updatePartialScene(sourceScene.key, { actions });
      return { ...sourceScene, actions };
    },
    getScenesByKey: async (sourceSceneKeys: string[]) => {
      return await sceneRepository.getScenesByKey(sourceSceneKeys);
    },
    removeSceneConnections: async (connectionsToRemove) => {
      const sourceSceneKeys = [
        ...new Set(connectionsToRemove.map((c) => c.sourceSceneKey)),
      ];
      // 1. Retrieve fresh data for all scenes
      const sourceScenesByKey =
        await sceneRepository.getScenesByKey(sourceSceneKeys);

      const missingScenes = sourceSceneKeys.filter(
        (key) => !Object.keys(sourceScenesByKey).includes(key),
      );
      if (!sourceSceneKeys)
        throw new AggregateError(
          missingScenes.map((k) => new EntityNotExistError("scene", k)),
        );

      // 2. Aggregate targets by action by scene to be able to easily produce update statements
      // This is important because if don't handle updates in bulk by scene the first updates would be overridden by subsequent ones
      // (because actions are a part of a scene and Dexie doesn't allow to update only part of a nested object)
      const targetsToRemoveBySceneByAction = connectionsToRemove.reduce<
        Record<string, Record<string, string[]>>
      >((acc, c) => {
        const targetsToRemoveByAction = acc[c.sourceSceneKey] ?? {};
        const targetsToRemove = targetsToRemoveByAction[c.actionKey] ?? [];
        return {
          ...acc,
          [c.sourceSceneKey]: {
            ...targetsToRemoveByAction,
            [c.actionKey]: [...targetsToRemove, c.targetSceneKey],
          },
        };
      }, {});

      const updatedScenesByKey: Record<string, Scene> = {};

      // 3. Compute update statements (via repository)
      const updateOperations = Object.entries(
        targetsToRemoveBySceneByAction,
      ).map(([sourceSceneKey, targetsToRemoveByAction]) => {
        const sourceScene = sourceScenesByKey[sourceSceneKey]!;

        const actions = sourceScene.actions.map((action) => {
          if (action.key in targetsToRemoveByAction) {
            const targetsToRemove = targetsToRemoveByAction[action.key]!;
            // Filter out all targets to remove
            const targets = action.targets.filter(
              (t) => !targetsToRemove.includes(t.sceneKey),
            );

            // If only one target remains, set its probability to 100%
            if (targets.length === 1) {
              targets[0]!.probability = 100;
            }
            return {
              ...action,
              targets: targets,
            };
          }
          return action;
        });

        updatedScenesByKey[sourceScene.key] = { ...sourceScene, actions };
        return localRepository.updatePartialScene(sourceScene.key, { actions });
      });

      // Update all scenes concurrently
      await Promise.all(updateOperations);

      return updatedScenesByKey;
    },

    updateTargetProbability: async ({
      actionKey,
      probability,
      sourceSceneKey,
      targetSceneKey,
    }) => {
      const sourceScene = await sceneRepository.get(sourceSceneKey);
      if (!sourceScene) throw new EntityNotExistError("scene", sourceSceneKey);

      let found = false;
      const actions = sourceScene.actions.map((action) => {
        if (action.key === actionKey) {
          return {
            ...action,
            targets: action.targets.map((t) =>
              produce(t, (draft) => {
                if (draft.sceneKey === targetSceneKey) {
                  found = true;
                  draft.probability = probability;
                }
              }),
            ),
          } satisfies Action;
        }
        return action;
      });

      if (!found) {
        throw new ActionTargetNotFound({
          sourceSceneKey,
          actionKey,
          targetSceneKey,
        });
      }
      await localRepository.updatePartialScene(sourceScene.key, { actions });

      return { ...sourceScene, actions };
    },

    checkActionTargetsValidity: (targets) => {
      // An action with no targets is always valid
      if (targets.length === 0) return true;

      const totalPercentages = targets.reduce(
        (acc, target) => acc + target.probability,
        0,
      );

      return N.areFloatsEqual(totalPercentages, 100);
    },

    createStoryWithFirstScene: async (
      storyData: Omit<
        WithoutKey<Story>,
        "type" | "creationDate" | "user" | "firstSceneKey"
      >,
    ) => {
      const user = await localRepository.getUser();

      const result = await localRepository.createStoryWithFirstScene({
        story: {
          ...storyData,
          type: "builder",
          creationDate: new Date(),
          ...(user && { author: { username: user.username, key: user.key } }),
        },
        firstScene: {
          builderParams: { position: { x: 0, y: 0 } },
          content: makeSimpleLexicalContent(
            "This is a placeholder content for your first scene",
          ),
          title: "Your first scene",
          actions: [
            {
              key: nanoid(),
              type: "simple",
              targets: [],
              text: "An action that leads to a scene",
            },
            {
              key: nanoid(),
              type: "simple",
              targets: [],
              text: "An action that leads to another scene",
            },
          ],
        },
      });

      return result;
    },

    addScene: async (scene: WithoutKey<Scene>) => {
      return await localRepository.createScene(scene);
    },

    updateScene: async ({ key, ...scene }) => {
      await localRepository.updatePartialScene(key, scene);
      return await sceneRepository.get(key);
    },

    getAutoLayout: async ({
      nodes,
      edges,
      storyKey,
    }: {
      nodes: BuilderNode[];
      edges: BuilderEdge[];
      storyKey: string;
    }) => {
      const reorganizedNodes = await layoutService.computeAutoLayout({
        nodes,
        edges,
      });

      const { scenes: scenesBefore } = await getBuilderStoryData(storyKey);
      const reorganizedScenes = scenesBefore.map((scene) => {
        const computedNode = reorganizedNodes.find(
          (node) => node.id === scene.key,
        );

        if (computedNode) {
          return {
            ...scene,
            builderParams: { position: { ...computedNode.position } },
          };
        }
        return scene;
      });

      return {
        before: scenesBefore,
        after: reorganizedScenes,
      };
    },

    bulkUpdateScenes: async ({ scenes }: { scenes: Scene[] }) => {
      await localRepository.updateOrCreateScenes(scenes);
    },

    changeFirstScene: async (storyKey: string, newFirstSceneKey: string) => {
      const isSceneKeyValid = !!(await sceneRepository.get(newFirstSceneKey));

      if (isSceneKeyValid) {
        await localRepository.updateFirstScene(storyKey, newFirstSceneKey);
        return true;
      }

      return false;
    },

    getBuilderStoryData,
    getUserBuilderStories,
    getAllBuilderData,

    loadBuilderState: async (stories: Story[], scenes: Scene[]) => {
      const newScenesKeys = scenes.map((s) => s.key);
      const newStoriesKeys = stories.map((s) => s.key);
      await localRepository.unitOfWork(
        async () => {
          const currentState = await getAllBuilderData();
          // Delete scenes that don't exist anymore
          await localRepository.deleteScenes(
            currentState.scenes
              .filter((s) => !newScenesKeys.includes(s.key))
              .map((s) => s.key),
          );
          // Delete stories that don't exist anymore
          await localRepository.deleteStories(
            currentState.stories
              .filter((s) => !newStoriesKeys.includes(s.key))
              .map((s) => s.key),
          );
          await localRepository.updateOrCreateStories(stories);
          await localRepository.updateOrCreateScenes(scenes);
        },
        {
          mode: "readwrite",
          entities: ["scene", "story", "user"],
        },
      );
    },

    deleteScenes: async ({ storyKey, sceneKeys }) => {
      // We should delete related article link keys
      // We should check that scene is not used in action
      const story = await storyRepository.get(storyKey);
      if (!story) throw new EntityNotExistError("story", storyKey);

      if (sceneKeys.includes(story.firstSceneKey))
        throw new CannotDeleteFirstSceneError(story.firstSceneKey);

      await localRepository.deleteScenes(sceneKeys);
    },

    deleteStory: async (storyKey: string) => {
      const scenesKeys = (
        await localRepository.getScenesByStoryKey(storyKey)
      ).map(({ key }) => key);

      await localRepository.unitOfWork(
        async () => {
          await localRepository.deleteScenes(scenesKeys);
          await localRepository.deleteStory(storyKey);
        },
        {
          mode: "readwrite",
          entities: ["scene", "story"],
        },
      );
    },
    importStory: async (importData: ImportData) => {
      const storyKey = await localRepository.unitOfWork(
        async () => {
          const storyResult = await importService.createStory({
            story: importData,
            type: "builder",
          });

          let oldCharacterAttrToNew: Record<string, string> = {};
          if (importData.characterConfig)
            oldCharacterAttrToNew = await importService.createCharacterConfig({
              newStoryKey: storyResult.data.key,
              characterConfig: importData.characterConfig,
            });

          const oldScenesToNew = await importService.createScenes({
            story: importData,
            newStoryKey: storyResult.data.key,
            oldCharacterAttrToNew,
          });

          if (importData.theme)
            await importService.createTheme({
              newStoryKey: storyResult.data.key,
              theme: importData.theme,
            });

          if (importData.wiki)
            await importService.createWiki({
              oldScenesToNew,
              type: "created",
              wikiData: importData.wiki,
              newStoryKey: storyResult.data.key,
            });

          return storyResult.data.key;
        },
        {
          entities: [
            "scene",
            "story",
            "story-theme",
            "character-configuration",
            "user",
            "wiki",
            "wiki-article",
            "wiki-article-link",
            "wiki-article-link",
          ],
          mode: "readwrite",
        },
      );

      return storyKey;
    },

    updateStory: async (key, payload) => {
      return storyRepository.update(key, payload);
    },

    duplicateScenes: async ({ originalScenes, newPositions, storyKey }) => {
      const story = await storyRepository.get(storyKey);
      if (!story) throw new EntityNotExistError("story", storyKey);

      const originalSceneKeys = originalScenes.map(({ key }) => key);

      // Create new keys imperatively to compute bulk payload in a single loop
      const oldKeyToNewKey = originalSceneKeys.reduce(
        (acc, key) => ({ ...acc, [key]: nanoid() }),
        {} as Record<string, string>,
      );

      const payload = originalScenes.map((scene) => {
        const position = newPositions[scene.key];
        if (!position) {
          throw new DuplicationMissingPositionError(scene.key);
        }
        return {
          key: oldKeyToNewKey[scene.key]!,
          storyKey,
          title: scene.title,
          content: scene.content,
          builderParams: {
            position: {
              x: newPositions[scene.key]!.x,
              y: newPositions[scene.key]!.y,
            },
          },
          actions: scene.actions.map((action) => {
            return {
              ...action,
              targets: action.targets.flatMap((target) =>
                originalSceneKeys.includes(target.sceneKey) // Do not copy links that target a scene that is not within the batch of duplicated scenes
                  ? [
                      {
                        ...target,
                        sceneKey: oldKeyToNewKey[target.sceneKey]!,
                      },
                    ]
                  : [],
              ),
            };
          }),
        };
      });

      await sceneRepository.bulkAdd(payload);
      return payload;
    },
    makeEmptyActionPayload: () => {
      return { key: nanoid(), type: "simple", targets: [], text: "" };
    },
  };
};
