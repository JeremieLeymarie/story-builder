import { Scene, Story } from "@/lib/storage/domain";
import { LocalRepositoryPort } from "@/repositories/local-repository-port";
import { BuilderNode } from "@/builder/types";
import { Edge } from "@xyflow/react";
import {
  ImportServicePort,
  StoryFromImport,
} from "@/services/common/import-service";
import { WithoutKey } from "@/types";
import { makeSimpleSceneContent } from "@/lib/scene-content";
import { BuilderServicePort } from "./ports/builder-service-port";
import { LayoutServicePort } from "./ports/layout-service-port";
import { BuilderStoryRepositoryPort } from "./ports/builder-story-repository-port";

export const _getBuilderService = ({
  localRepository,
  layoutService,
  importService,
  builderStoryRepository,
}: {
  layoutService: LayoutServicePort;
  importService: ImportServicePort;
  localRepository: LocalRepositoryPort;
  builderStoryRepository: BuilderStoryRepositoryPort;
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
      position: Scene["builderParams"]["position"],
    ) => {
      await localRepository.updatePartialScene(sceneKey, {
        builderParams: { position },
      });
    },

    addSceneConnection: async ({
      sourceScene,
      destinationSceneKey,
      actionIndex,
    }: {
      sourceScene: Scene;
      destinationSceneKey: string;
      actionIndex: number;
    }) => {
      const actions = sourceScene.actions.map((action, i) => {
        if (i === actionIndex) {
          return { ...action, sceneKey: destinationSceneKey };
        }
        return action;
      });

      await localRepository.updatePartialScene(sourceScene.key, {
        actions,
      });
    },

    removeSceneConnection: async ({
      sourceScene,
      actionIndex,
    }: {
      sourceScene: Scene;
      actionIndex: number;
    }) => {
      const actions = sourceScene.actions.map((action, i) => {
        if (i === actionIndex) {
          return { ...action, sceneKey: undefined };
        }
        return action;
      });

      await localRepository.updatePartialScene(sourceScene.key, {
        actions,
      });
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
          content: makeSimpleSceneContent(
            "This is a placeholder content for your first scene",
          ),
          title: "Your first scene",
          actions: [
            {
              text: "An action that leads to a scene",
            },
            {
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

    updateScene: async ({
      key,
      ...scene
    }: Partial<Scene> & Pick<Scene, "key">) => {
      await localRepository.updatePartialScene(key, scene);
    },

    getAutoLayout: async ({
      nodes,
      edges,
      storyKey,
    }: {
      nodes: BuilderNode[];
      edges: Edge[];
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
      const isSceneKeyValid =
        !!(await localRepository.getScene(newFirstSceneKey));

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

    deleteScenes: async (sceneKeys: string[]) => {
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
    importStory: async (storyFromImport: StoryFromImport) => {
      const storyKey = await localRepository.unitOfWork(
        async () => {
          const storyResult = await importService.createStory({
            story: storyFromImport,
            type: "builder",
          });

          await importService.createScenes({
            story: storyFromImport,
            newStoryKey: storyResult.data.key,
          });

          return storyResult.data.key;
        },
        { entities: ["scene", "story", "user"], mode: "readwrite" },
      );

      return { error: null, data: { storyKey } };
    },

    updateStory: async (key, payload) => {
      await builderStoryRepository.update(key, payload);
    },
  };
};
