import { Action, BuilderPosition, Scene, Story } from "@/lib/storage/domain";
import { LocalRepositoryPort } from "@/repositories/local-repository-port";
import { BuilderNode, BuilderEdge } from "@/builder/types";
import { ImportExportServicePort } from "@/services/common/import-export-service";
import { WithoutKey } from "@/types";
import { makeSimpleLexicalContent } from "@/lib/lexical-content";
import {
  BuilderConnection,
  BuilderServicePort,
} from "./ports/builder-service-port";
import { BuilderStoryRepositoryPort } from "./ports/builder-story-repository-port";
import { LayoutServicePort } from "./ports/layout-service-port";
import { EntityNotExistError } from "../errors";
import { nanoid } from "nanoid";
import {
  ActionTargetNotFound,
  CannotDeleteFirstSceneError,
  DuplicationMissingPositionError,
} from "./errors";
import { JsonStoryData } from "@/services/common/schema";
import { produce } from "immer";
import { N } from "@/lib/number";
import { randomInArray } from "@/lib/random";
import { capitalize } from "@/lib/string";
import { BuilderSceneRepositoryPort } from "./builder-scene-repository";

export const _getBuilderService = ({
  localRepository,
  layoutService,
  importExportService,
  storyRepository,
  sceneRepository,
}: {
  layoutService: LayoutServicePort;
  importExportService: ImportExportServicePort;
  localRepository: LocalRepositoryPort; // Legacy: should be removed and replaced by domain-specific repositories
  storyRepository: BuilderStoryRepositoryPort;
  sceneRepository: BuilderSceneRepositoryPort;
}): BuilderServicePort => {
  const touchStory = async (storyKey: string, date = new Date()) => {
    await storyRepository.update(storyKey, { updatedAt: date });
  };

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
    ]
      .filter((story) => story.type === "builder")
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
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

  const removeSceneConnections = async (
    connectionsToRemove: BuilderConnection[],
  ) => {
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
    const updateOperations = Object.entries(targetsToRemoveBySceneByAction).map(
      ([sourceSceneKey, targetsToRemoveByAction]) => {
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
      },
    );

      // Update all scenes concurrently
      await Promise.all(updateOperations);
      await Promise.all(sourceSceneKeys.map((sceneKey) => touchStory(sourceScenesByKey[sceneKey]!.storyKey)));

    return updatedScenesByKey;
  };

  return {
    updateSceneBuilderPosition: async (
      sceneKey: string,
      position: BuilderPosition,
    ) => {
      const scene = await sceneRepository.get(sceneKey);
      if (!scene) throw new EntityNotExistError("scene", sceneKey);

      await localRepository.updatePartialScene(sceneKey, {
        builderParams: { position },
      });
      await touchStory(scene.storyKey);
    },

    addSceneConnection: async ({
      sourceSceneKey,
      actionKey,
      destinationSceneKey,
    }) => {
      const sourceScene = await sceneRepository.get(sourceSceneKey);
      if (!sourceScene) throw new EntityNotExistError("scene", sourceSceneKey);

      let addedConnection = false;
      const actions = sourceScene.actions.map((action) => {
        if (action.key === actionKey) {
          const targetAlreadyExists = action.targets.find(
            (t) => t.sceneKey === destinationSceneKey,
          );
          if (targetAlreadyExists) return action;

          addedConnection = true;
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
      return {
        updatedScene: { ...sourceScene, actions },
        addedConnection,
      };
    },

    getScenesByKey: async (sourceSceneKeys: string[]) => {
      return await sceneRepository.getScenesByKey(sourceSceneKeys);
    },

    removeSceneConnections,

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
      await touchStory(sourceScene.storyKey);

      return { ...sourceScene, actions };
    },

    checkActionTargetsValidity: (action) => {
      // An action with no targets is always valid
      if (action.targets.length === 0) return true;

      const totalPercentages = action.targets.reduce(
        (acc, target) => acc + target.probability,
        0,
      );

      return N.areFloatsEqual(totalPercentages, 100);
    },

    createStoryWithFirstScene: async (
      storyData: Omit<
        WithoutKey<Story>,
        "type" | "creationDate" | "updatedAt" | "user" | "firstSceneKey"
      >,
    ) => {
      const user = await localRepository.getUser();
      const now = new Date();

      const result = await localRepository.createStoryWithFirstScene({
        story: {
          ...storyData,
          type: "builder",
          creationDate: now,
          updatedAt: now,
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
      const createdScene = await localRepository.createScene(scene);
      await touchStory(scene.storyKey);
      return createdScene;
    },

    updateScene: async ({ key, ...scene }) => {
      const currentScene = await sceneRepository.get(key);
      if (!currentScene) throw new EntityNotExistError("scene", key);

      await localRepository.updatePartialScene(key, scene);
      await touchStory(currentScene.storyKey);
      return await sceneRepository.get(key);
    },

    saveSideEffects: async ({ sceneKey, sideEffects }) => {
      const scene = await sceneRepository.get(sceneKey);
      if (!scene) throw new EntityNotExistError("scene", sceneKey);

      const newScene = { ...scene, sideEffects };
      await sceneRepository.update(scene.key, newScene);
      await touchStory(scene.storyKey);

      return newScene;
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
      const storyKeys = [...new Set(scenes.map((scene) => scene.storyKey))];
      await Promise.all(storyKeys.map((storyKey) => touchStory(storyKey)));
    },

    changeFirstScene: async (storyKey: string, newFirstSceneKey: string) => {
      const isSceneKeyValid = !!(await sceneRepository.get(newFirstSceneKey));

      if (isSceneKeyValid) {
        await localRepository.updateFirstScene(storyKey, newFirstSceneKey);
        await touchStory(storyKey);
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

      // Update scenes with action targets leading to one of the deleted scenes
      const allScenes = await localRepository.getScenesByStoryKey(storyKey);
      const connectionsToDelete = allScenes.reduce<BuilderConnection[]>(
        (acc, scene) => {
          const isImpacted = scene.actions.some((a) =>
            a.targets.some((t) => sceneKeys.includes(t.sceneKey)),
          );
          if (isImpacted) {
            scene.actions.forEach((a) => ({
              ...a,
              targets: a.targets.filter((t) => {
                const shouldBeKept = !sceneKeys.includes(t.sceneKey);
                if (!shouldBeKept)
                  acc.push({
                    actionKey: a.key,
                    sourceSceneKey: scene.key,
                    targetSceneKey: t.sceneKey,
                  });
                return shouldBeKept;
              }),
            }));
          }

          return acc;
        },
        [],
      );

      const updatedScenes = await removeSceneConnections(connectionsToDelete);
      await localRepository.deleteScenes(sceneKeys);
      await touchStory(storyKey);

      return {
        deletedConnections: connectionsToDelete,
        updatedScenes,
        deletedSceneKeys: sceneKeys,
      };
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
    importStory: async (importData: JsonStoryData) => {
      const storyKey = await localRepository.unitOfWork(
        async () => {
          const storyResult = await importExportService.createStory({
            story: importData,
            type: "builder",
          });

          let oldCharacterAttrToNew: Record<string, string> = {};
          if (importData.characterConfig)
            oldCharacterAttrToNew =
              await importExportService.createCharacterConfig({
                newStoryKey: storyResult.data.key,
                characterConfig: importData.characterConfig,
              });

          const oldScenesToNew = await importExportService.createScenes({
            story: importData,
            newStoryKey: storyResult.data.key,
            oldCharacterAttrToNew,
          });

          if (importData.theme)
            await importExportService.createTheme({
              newStoryKey: storyResult.data.key,
              theme: importData.theme,
            });

          if (importData.wiki)
            await importExportService.createWiki({
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
      return storyRepository.update(key, { ...payload, updatedAt: new Date() });
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
      await touchStory(storyKey);
      return payload;
    },
    makeEmptyActionPayload: () => {
      return { key: nanoid(), type: "simple", targets: [], text: "" };
    },
    makeEmptySideEffectPayload: ({ characterConfig }) => {
      if (Object.keys(characterConfig.attributes).length < 1)
        throw new Error(
          "Cannot create side effect payload when character configuration has no attributes.",
        );
      const attribute = randomInArray(
        Object.values(characterConfig.attributes),
      );
      return {
        key: nanoid(),
        name: `Level-up ${capitalize(attribute.name)}`,
        isVisible: true,
        trigger: "scene-load",
        effect: {
          type: "character-attribute",
          increment: 1,
          attributeKey: attribute.key,
        },
      };
    },
  };
};
