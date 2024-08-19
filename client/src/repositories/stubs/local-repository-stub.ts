import { Story, Scene, StoryProgress, User } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";
import { LocalRepositoryPort } from "../local-repository-port";
import { nanoid } from "nanoid";
import Dexie from "dexie";

type Storage = {
  stories: Story[];
  scenes: Scene[];
  user: User | null;
  storyProgresses: StoryProgress[];
};
const emptyStorage: Storage = {
  stories: [],
  scenes: [],
  storyProgresses: [],
  user: null,
};

export const getLocalRepositoryStub = (): LocalRepositoryPort => {
  const storage = { ...emptyStorage };

  return {
    createStory: function (
      story: Story | WithoutKey<Story>,
    ): Promise<Story | null> {
      const s = { ...story, key: "key" in story ? story.key : nanoid() };

      if (storage.stories.find((story) => story.key === s.key)) {
        throw new Dexie.DexieError("ConstraintError");
      }

      storage.stories = [...storage.stories, s];

      return new Promise((res) => res(s));
    },

    createStoryWithFirstScene: function ({
      story,
      firstScene,
    }: {
      story: WithoutKey<Omit<Story, "firstSceneKey">>;
      firstScene: WithoutKey<Omit<Scene, "storyKey">>;
    }): Promise<{ story: Story; scene: Scene } | null> {
      const storyPayload = { ...story, key: nanoid() };
      const createdScene = {
        ...firstScene,
        key: nanoid(),
        storyKey: storyPayload.key,
      };

      const createdStory = { ...storyPayload, firstSceneKey: createdScene.key };

      storage.stories = [...storage.stories, createdStory];
      storage.scenes = [...storage.scenes, createdScene];

      return new Promise((res) =>
        res({ story: createdStory, scene: createdScene }),
      );
    },

    updateOrCreateStories: function (
      stories: Story[],
    ): Promise<string[] | null> {
      const keys: string[] = [];

      stories.forEach((story) => {
        const idx = storage.stories.findIndex((s) => s.key === story.key);
        if (idx > -1) {
          storage.stories[idx] = story;
          keys.push(story.key);
        } else {
          const key = story.key ?? nanoid();
          storage.stories.push({ ...story, key });
          keys.push(key);
        }
      });

      return new Promise((res) => res(keys));
    },

    updateStory: function (story: Story): Promise<Story> {
      const idx = storage.stories.findIndex((s) => s.key === story.key);
      if (idx === -1) throw new Error("Didn't not find story");

      storage.stories[idx] = story;

      return new Promise((res) => res(story));
    },

    getStory: function (key: string): Promise<Story | null> {
      return new Promise((res) =>
        res(storage.stories.find((s) => s.key === key) ?? null),
      );
    },

    getStories: function (): Promise<Story[] | null> {
      return new Promise((res) => res(storage.stories));
    },

    getStoriesByKeys: function (keys: string[]): Promise<Story[]> {
      return new Promise((res) =>
        res(storage.stories.filter((s) => keys.includes(s.key))),
      );
    },

    getStoriesByAuthor: function (userKey?: string): Promise<Story[] | null> {
      return new Promise((res) =>
        res(storage.stories.filter((s) => s.author?.key === userKey)),
      );
    },

    getGames: function (): Promise<Story[]> {
      const keys = storage.storyProgresses.map((p) => p.storyKey);
      return new Promise((res) =>
        res(storage.stories.filter((s) => keys.includes(s.key))),
      );
    },

    getMostRecentStoryProgress: function (): Promise<StoryProgress | null> {
      const progress =
        storage.storyProgresses.sort(
          (a, b) => b.lastPlayedAt.getTime() - a.lastPlayedAt.getTime(),
        )?.[0] ?? null;

      return new Promise((res) => res(progress));
    },

    getFinishedGameKeys: function (): Promise<string[]> {
      const keys = storage.storyProgresses
        .filter((p) => p.finished)
        .map(({ storyKey }) => storyKey);

      return new Promise((res) => res(keys));
    },

    updateFirstScene: function (
      storyKey: string,
      sceneKey: string,
    ): Promise<void> {
      const idx = storage.stories.findIndex((s) => s.key === storyKey);
      if (idx > -1) {
        storage.stories[idx] = {
          ...storage.stories[idx]!,
          firstSceneKey: sceneKey,
        };
      }

      return new Promise((res) => res());
    },

    addAuthorToStories: function (author: {
      key: string;
      username: string;
    }): Promise<void> {
      storage.stories = storage.stories.map((s) =>
        s.author === undefined ? { ...s, author } : s,
      );

      return new Promise((res) => res());
    },

    updateOrCreateScenes: function (scenes: Scene[]): Promise<string[]> {
      const keys: string[] = [];

      scenes.forEach((scene) => {
        const idx = storage.scenes.findIndex((s) => s.key === scene.key);
        if (idx > -1) {
          storage.scenes[idx] = scene;
          keys.push(scene.key);
        } else {
          const key = scene.key ?? nanoid();
          storage.scenes.push({ ...scene, key });
          keys.push(key);
        }
      });

      return new Promise((res) => res(keys));
    },

    createScene: function (scene: WithoutKey<Scene>): Promise<Scene> {
      const s = { ...scene, key: nanoid() };

      storage.scenes.push(s);

      return new Promise((res) => res(s));
    },

    createScenes: function (
      scenes: (WithoutKey<Scene> | Scene)[],
    ): Promise<string[]> {
      const s = scenes.map((s) => ({
        ...s,
        key: "key" in s ? s.key : nanoid(),
      }));

      const sceneExists = s.some((scene) =>
        storage.scenes.map(({ key }) => key).includes(scene.key),
      );

      if (sceneExists) {
        throw new Dexie.DexieError("ConstraintError");
      }

      storage.scenes = [...storage.scenes, ...s];

      return new Promise((res) => res(s.map(({ key }) => key)));
    },

    updatePartialScene: function (
      key: string,
      scene: Partial<Scene>,
    ): Promise<boolean> {
      const sceneIdx = storage.scenes.findIndex((scene) => scene.key === key);

      if (sceneIdx === -1) return new Promise((res) => res(false));
      storage.scenes[sceneIdx] = { ...storage.scenes[sceneIdx]!, ...scene };
      return new Promise((res) => res(true));
    },

    getScene: function (key: string): Promise<Scene | null> {
      return new Promise((res) =>
        res(storage.scenes.find((scene) => scene.key === key) ?? null),
      );
    },

    getScenes: function (storyKeys: string | string[]): Promise<Scene[]> {
      return new Promise((res) =>
        res(
          storage.scenes.filter((s) =>
            Array.isArray(storyKeys)
              ? storyKeys.includes(s.storyKey)
              : s.storyKey === storyKeys,
          ),
        ),
      );
    },

    createStoryProgress: function (
      progress: WithoutKey<StoryProgress>,
    ): Promise<StoryProgress> {
      const s = { ...progress, key: nanoid() };
      storage.storyProgresses = [...storage.storyProgresses, s];
      return new Promise((res) => res(s));
    },

    updateOrCreateStoryProgresses: function (
      progresses: StoryProgress[],
    ): Promise<string[]> {
      const keys: string[] = [];

      progresses.forEach((progress) => {
        const idx = storage.storyProgresses.findIndex(
          (s) => s.key === progress.key,
        );
        if (idx > -1) {
          storage.storyProgresses[idx] = progress;
          keys.push(progress.key);
        } else {
          const key = progress.key ?? nanoid();
          storage.storyProgresses.push({ ...progress, key });
          keys.push(key);
        }
      });

      return new Promise((res) => res(keys));
    },

    updateStoryProgress: function (
      progress: StoryProgress,
    ): Promise<StoryProgress | null> {
      const idx = storage.storyProgresses.findIndex(
        (p) => p.key === progress.key,
      );

      if (idx > -1) {
        storage.storyProgresses[idx] = progress;
        return new Promise((res) => res(progress));
      }

      return new Promise((res) => res(null));
    },

    getStoryProgress: function (
      storyKey: string,
    ): Promise<StoryProgress | null> {
      return new Promise((res) =>
        res(
          storage.storyProgresses.find((p) => p.storyKey === storyKey) ?? null,
        ),
      );
    },

    getStoryProgresses: function (): Promise<StoryProgress[]> {
      return new Promise((res) => res(storage.storyProgresses));
    },

    getUser: function (): Promise<User | null> {
      return new Promise((res) => res(storage.user));
    },

    getUserCount: function (): Promise<number> {
      return new Promise((res) => res(storage.user ? 1 : 0));
    },

    createUser: function (user: WithoutKey<User>): Promise<User> {
      const u = { ...user, key: nanoid() };
      storage.user = u;
      return new Promise((res) => res(u));
    },

    updateUser: function (user: User): Promise<User> {
      storage.user = user;
      return new Promise((res) => res(user));
    },

    deleteUser: function (key: string): Promise<boolean> {
      if (storage.user?.key === key) return new Promise((res) => res(false));

      storage.user = null;
      return new Promise((res) => res(true));
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unitOfWork: function <TWork extends (...args: any[]) => any>(
      work: TWork,
    ): ReturnType<TWork> {
      return work();
    },
  };
};
