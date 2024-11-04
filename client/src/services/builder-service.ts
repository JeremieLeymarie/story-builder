import { Scene, Story } from "@/lib/storage/domain";
import { LocalRepositoryPort } from "@/repositories/local-repository-port";
import { WithoutKey } from "@/types";
import { getLocalRepository } from "@/repositories/indexed-db-repository";

// TODO: revise error management? Maybe throw errors instead of string/boolean/null returns
export const _getBuilderService = ({
  localRepository,
}: {
  localRepository: LocalRepositoryPort;
}) => {
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
          content: "This is a placeholder content for your first scene",
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

    // TODO: update all user stories on login

    addScene: async (scene: WithoutKey<Scene>) => {
      return await localRepository.createScene(scene);
    },

    updateStory: async (story: Story) => {
      await localRepository.updateStory(story);
    },

    updateScene: async ({
      key,
      ...scene
    }: Partial<Scene> & Pick<Scene, "key">) => {
      await localRepository.updatePartialScene(key, scene);
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

    getBuilderStoryData: async (storyKey: string) => {
      const story = await localRepository.getStory(storyKey);
      const scenes = await localRepository.getScenesByStoryKey(storyKey);

      return { story, scenes };
    },

    getUserBuilderStories,

    getFullBuilderState: async () => {
      const stories = await getUserBuilderStories();
      const scenes = await localRepository.getScenesByStoryKey(
        stories?.map((story) => story.key) ?? [],
      );

      return { stories, scenes };
    },

    loadBuilderState: async (stories: Story[], scenes: Scene[]) => {
      await localRepository.unitOfWork(
        async () => {
          await localRepository.updateOrCreateStories(stories);
          await localRepository.updateOrCreateScenes(scenes);
        },
        {
          mode: "readwrite",
          entities: ["scene", "story"],
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
  };
};

export const getBuilderService = () => {
  return _getBuilderService({
    localRepository: getLocalRepository(),
  });
};
