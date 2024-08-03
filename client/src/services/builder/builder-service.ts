import { Scene, Story } from "@/lib/storage/domain";
import { LocalRepositoryPort } from "@/repositories/local-repository-port";
import { RemoteRepositoryPort } from "@/repositories/remote-repository-port";
import { WithoutKey } from "@/types";
import { makePerformSync } from "../common/sync";
import { getLocalRepository } from "@/repositories/indexed-db-repository";
import { getRemoteAPIRepository } from "@/repositories/remote-api-repository";
import { fullStorySchema } from "./schemas";
import Dexie from "dexie";

// Maybe atomic repository actions could be isolated in helpers

const _getBuilderService = ({
  localRepository,
  remoteRepository,
}: {
  localRepository: LocalRepositoryPort;
  remoteRepository: RemoteRepositoryPort;
}) => {
  const performSync = makePerformSync(localRepository);

  return {
    updateSceneBuilderPosition: async (
      sceneKey: string,
      position: Scene["builderParams"]["position"],
    ) => {
      localRepository.updateScene(sceneKey, { builderParams: { position } });

      performSync(["story"], () =>
        remoteRepository.updatePartialScene(sceneKey, {
          builderParams: { position },
        }),
      );
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

      await localRepository.updateScene(sourceScene.key, {
        actions,
      });

      performSync(["story"], () =>
        remoteRepository.updatePartialScene(sourceScene.key, { actions }),
      );
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

      await localRepository.updateScene(sourceScene.key, { actions });

      performSync(["story"], () =>
        remoteRepository.updatePartialScene(sourceScene.key, { actions }),
      );
    },

    createStoryWithFirstScene: async (
      storyData: Omit<
        WithoutKey<Story>,
        "status" | "creationDate" | "user" | "firstSceneKey"
      >,
    ) => {
      const user = await localRepository.getUser();

      const result = await localRepository.createStoryWithFirstScene({
        story: {
          ...storyData,
          status: "draft",
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

      if (result)
        performSync(["story"], () => {
          remoteRepository.updateOrCreateScene(result.scene);
          remoteRepository.updateOrCreateStory(result.story);
        });
    },

    publishStory: async (scenes: Scene[], story: Story) => {
      const response = await remoteRepository.publishStory(scenes, {
        ...story,
        publicationDate: new Date(),
      });

      if (response.data) {
        await localRepository.updateStory(response.data);
      }

      return !!response.data;
    },

    editStory: async (story: Story) => {
      const user = await localRepository.getUser();

      const result = await localRepository.updateStory({
        ...story,
        ...(user && { author: { key: user.key, username: user.username } }),
      });

      if (result) {
        performSync(["story"], () =>
          remoteRepository.updateOrCreateStory(story),
        );
      }
    },

    importFromJSON: async (fileContent: string) => {
      // TODO: refacto this try/catch mess
      try {
        const contentJson = JSON.parse(fileContent);

        const resZod = fullStorySchema.safeParse(contentJson);

        if (!resZod.success)
          return { error: resZod.error.issues[0]?.message || "Invalid format" };

        try {
          const story = await localRepository.createStory(resZod.data.story);
          const scenes = await localRepository.createScenes(resZod.data.scenes);

          if (story && scenes)
            performSync(["story"], () => {
              remoteRepository.updateOrCreateFullStory(
                resZod.data.story,
                resZod.data.scenes,
              );
            });
        } catch (error) {
          if (
            error instanceof Dexie.DexieError &&
            error.name === "ConstraintError"
          ) {
            return { error: "Story already exists" };
          }
          return { error: "Something went wrong." };
        }
      } catch (_) {
        return { error: "Invalid JSON format" };
      }
      return { error: null };
    },

    addScene: async (scene: WithoutKey<Scene>) => {
      const result = await localRepository.createScene(scene);

      if (result)
        performSync(["story"], () =>
          remoteRepository.updateOrCreateScene(result),
        );
    },

    updateStory: async (story: Story) => {
      const user = await localRepository.getUser();
      const result = await localRepository.updateStory({
        ...story,
        ...(user && { author: { key: user.key, username: user.username } }),
      });

      if (result) {
        performSync(["story"], () => {
          remoteRepository.updateOrCreateStory(result);
        });
      }
    },

    updateScene: async (scene: Scene) => {
      const result = await localRepository.updateScene(scene.key, scene);

      if (result)
        performSync(["story"], () => {
          remoteRepository.updateOrCreateScene(scene);
        });
    },

    changeFirstScene: async (storyKey: string, newFirstSceneKey: string) => {
      const result = await localRepository.updateFirstScene(
        storyKey,
        newFirstSceneKey,
      );

      const story = await localRepository.getStory(storyKey);

      if (result && story) {
        performSync(["story"], () => {
          remoteRepository.updateOrCreateStory(story);
        });
      }
    },
  };
};

export const getBuilderService = () => {
  return _getBuilderService({
    localRepository: getLocalRepository(),
    remoteRepository: getRemoteAPIRepository(),
  });
};
