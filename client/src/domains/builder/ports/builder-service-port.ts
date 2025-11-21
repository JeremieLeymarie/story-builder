import { BuilderNode } from "@/builder/types";
import {
  BuilderPosition,
  BuilderStory,
  Scene,
  Story,
} from "@/lib/storage/domain";
import { StoryFromImport } from "@/services/common/schema";
import { WithoutKey } from "@/types";
import { Edge } from "@xyflow/react";

export type BuilderServicePort = {
  updateSceneBuilderPosition: (
    sceneKey: string,
    position: Scene["builderParams"]["position"],
  ) => Promise<void>;
  addSceneConnection: (props: {
    sourceSceneKey: string;
    destinationSceneKey: string;
    actionIndex: number;
  }) => Promise<void>;
  removeSceneConnection: (props: {
    sourceScene: Scene;
    actionIndex: number;
  }) => Promise<void>;
  createStoryWithFirstScene: (
    storyData: Omit<
      WithoutKey<Story>,
      "type" | "creationDate" | "user" | "firstSceneKey"
    >,
  ) => Promise<{ story: Story; scene: Scene } | null>;
  addScene: (scene: WithoutKey<Scene>) => Promise<Scene>;
  updateScene: (
    props: Partial<Scene> & Pick<Scene, "key">,
  ) => Promise<Scene | null>;
  getAutoLayout: (props: {
    nodes: BuilderNode[];
    edges: Edge[];
    storyKey: string;
  }) => Promise<{ before: Scene[]; after: Scene[] }>;
  bulkUpdateScenes: ({ scenes }: { scenes: Scene[] }) => Promise<void>;
  changeFirstScene: (
    storyKey: string,
    newFirstSceneKey: string,
  ) => Promise<boolean>;
  getBuilderStoryData: (
    storyKey: string,
  ) => Promise<{ story: Story | null; scenes: Scene[] }>;
  getUserBuilderStories: () => Promise<BuilderStory[]>;
  getAllBuilderData: () => Promise<{
    stories: BuilderStory[];
    scenes: Scene[];
  }>;
  loadBuilderState: (stories: Story[], scenes: Scene[]) => Promise<void>;
  deleteScenes: (params: {
    storyKey: string;
    sceneKeys: string[];
  }) => Promise<void>;
  deleteStory: (storyKey: string) => Promise<void>;
  importStory: (storyFromImport: StoryFromImport) => Promise<string>;
  updateStory: (
    storyKey: string,
    payload: Partial<BuilderStory>,
  ) => Promise<BuilderStory>;
  /**
   * Creates scenes from a payload of scenes (from any story), reproducing links from within the payload
   * @returns created scenes
   */
  duplicateScenes: (params: {
    originalScenes: Omit<Scene, "storyKey">[];
    newPositions: { [sceneKey: string]: BuilderPosition };
    storyKey: string;
  }) => Promise<Scene[]>;
};
