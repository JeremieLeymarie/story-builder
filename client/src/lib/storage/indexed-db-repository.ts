import { Story, Action, Scene, StoryProgress } from "./dexie-db";
import { IndexedDBRepositoryPort } from "./port";

// TODO: actually implement
export class IndexedDBRepository implements IndexedDBRepositoryPort {
  createStory = (story: Omit<Story, "id">) => {};
  updateStory: (story: Story) => Story;
  deleteStory: (id: number) => Story;
  getStory: (id: number) => Story;
  getStories: () => Story[];
  createScene: (scene: {
    title: string;
    storyId: number;
    content: string;
    actions: Action[];
  }) => Scene;
  updateScene: (scene: Scene) => Scene;
  deleteScene: (id: number) => void;
  getScene: (id: number) => Scene;
  getScenes: () => Scene[];
  createStoryProgress: (progress: {
    storyId: number;
    history: number[];
    currentSceneId: number;
    character?: Record<string, unknown> | undefined;
    inventory?: Record<string, unknown> | undefined;
  }) => StoryProgress;
  updateStoryProgress: (progress: StoryProgress) => StoryProgress;
  deleteStoryProgress: (id: number) => void;
  getStoryProgress: (id: number) => StoryProgress;
  getStoryProgresses: () => StoryProgress[];
}
