import { Scene, Story } from "@/lib/storage/domain";
import { LocalRepositoryPort } from "@/repositories/local-repository-port";
import { RemoteRepositoryPort } from "@/repositories/remote-repository-port";
import { WithoutKey } from "@/types";
import { getLocalRepository } from "@/repositories/indexed-db-repository";
import { getRemoteAPIRepository } from "@/repositories/remote-api-repository";
import { fullStorySchema } from "./schemas";
import Dexie from "dexie";

// TODO: revise error management? Maybe throw errors instead of string/boolean/null returns
export const _getBuilderService = ({
  localRepository,
  remoteRepository,
}: {
  localRepository: LocalRepositoryPort;
  remoteRepository: RemoteRepositoryPort;
}) => {
  const getUserBuilderStories = async () => {
    const user = await localRepository.getUser();

    const storiesWithAuthor = user?.key
      ? await localRepository.getStoriesByAuthor(user?.key)
      : [];

    const storiesWithoutAuthor =
      await localRepository.getStoriesByAuthor(undefined);

    return [...(storiesWithAuthor ?? []), ...(storiesWithoutAuthor ?? [])];
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

      return result;
    },

    publishStory: async (scenes: Scene[], story: Story) => {
      // TODO: this is weird, the frontend handles the publication date and the API the status change. Only one should be responsible for updating the data
      const response = await remoteRepository.publishStory(scenes, {
        ...story,
        publicationDate: new Date(),
      });

      if (response.data) {
        await localRepository.updateStory(response.data.story);
      }

      return !!response.data;
    },

    editStory: async (story: Story) => {
      const user = await localRepository.getUser();
      await localRepository.updateStory({
        ...story,
        ...(user && { author: { key: user.key, username: user.username } }),
      });
    },

    // TODO: this should not keep the author in the data??
    importFromJSON: async (fileContent: string) => {
      // TODO: refacto this try/catch mess
      try {
        const contentJson = JSON.parse(fileContent);

        const resZod = fullStorySchema.safeParse(contentJson);

        if (!resZod.success)
          return { error: resZod.error.issues[0]?.message || "Invalid format" };

        try {
          await localRepository.unitOfWork(
            async () => {
              await localRepository.createStory(resZod.data.story);
              await localRepository.createScenes(resZod.data.scenes);
            },
            { mode: "readwrite", entities: ["story", "scene"] },
          );
        } catch (error) {
          if (
            error instanceof Dexie.DexieError &&
            error.name === "ConstraintError"
          ) {
            return { error: "Story or scene already exists" };
          }
          return { error: "Something went wrong." };
        }
      } catch (_) {
        return { error: "Invalid JSON format" };
      }
      return { error: null };
    },

    addScene: async (scene: WithoutKey<Scene>) => {
      return await localRepository.createScene(scene);
    },

    updateStory: async (story: Story) => {
      const user = await localRepository.getUser();
      await localRepository.updateStory({
        ...story,
        ...(user && { author: { key: user.key, username: user.username } }),
      });
    },

    updateScene: async (scene: Partial<Scene> & Pick<Scene, "key">) => {
      await localRepository.updatePartialScene(scene.key, scene);
    },

    changeFirstScene: async (storyKey: string, newFirstSceneKey: string) => {
      const isSceneKeyValid = await localRepository.getScene(newFirstSceneKey);

      if (isSceneKeyValid)
        return await localRepository.updateFirstScene(
          storyKey,
          newFirstSceneKey,
        );

      return false;
    },

    getBuilderStoryData: async (storyKey: string) => {
      const story = await localRepository.getStory(storyKey);
      const scenes = await localRepository.getScenes(storyKey);

      return { story, scenes };
    },

    getUserBuilderStories,

    getFullBuilderState: async () => {
      const stories = await getUserBuilderStories();
      const scenes = await localRepository.getScenes(
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
  };
};

export const getBuilderService = () => {
  return _getBuilderService({
    localRepository: getLocalRepository(),
    remoteRepository: getRemoteAPIRepository(),
  });
};
