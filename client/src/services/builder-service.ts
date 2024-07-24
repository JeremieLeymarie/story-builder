import { Scene, Story } from "@/lib/storage/domain";
import { getRepository } from "@/repositories/repository";
import { RepositoryPort } from "@/repositories/repository-port";
import { WithoutKey } from "@/types";

const _getBuilderService = (repository: RepositoryPort) => {
  return {
    updateSceneBuilderPosition: async (
      sceneKey: string,
      position: Scene["builderParams"]["position"],
    ) => {
      repository.updateScene(sceneKey, { builderParams: { position } });
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

      repository.updateScene(sourceScene.key, { actions });
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

      repository.updateScene(sourceScene.key, { actions });
    },

    createStoryWithFirstScene: async (
      storyData: Omit<
        WithoutKey<Story>,
        "status" | "creationDate" | "user" | "firstSceneKey"
      >,
    ) => {
      const user = await repository.getUser();

      return await repository.createStoryWithFirstScene(
        {
          ...storyData,
          status: "draft",
          creationDate: new Date(),
          ...(user && { author: { username: user.username, key: user.key } }),
        },
        {
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
      );
    },
  };
};

export const getBuilderService = () => {
  return _getBuilderService(getRepository());
};
