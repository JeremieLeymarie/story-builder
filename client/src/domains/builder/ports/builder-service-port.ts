import { BuilderNode, BuilderEdge } from "@/builder/types";
import {
  Action,
  BuilderPosition,
  BuilderStory,
  Scene,
  Story,
} from "@/lib/storage/domain";
import { ImportData } from "@/services/common/schema";
import { WithoutKey } from "@/types";

export type BuilderServicePort = {
  updateSceneBuilderPosition: (
    sceneKey: string,
    position: Scene["builderParams"]["position"],
  ) => Promise<void>;
  addSceneConnection: (props: {
    sourceSceneKey: string;
    actionKey: string;
    destinationSceneKey: string;
  }) => Promise<Scene>;
  /**
   * * Delete connections to specified targets (can be multiple) on a specified action
   * @param connections An array containing information about the connections to delete : source scene key, action key and target scene key
   * @returns A record with the updated scenes by key
   */
  removeSceneConnections: (
    connections: {
      sourceSceneKey: string;
      actionKey: string;
      targetSceneKey: string;
    }[],
  ) => Promise<Record<string, Scene>>;
  updateTargetProbability: (props: {
    sourceSceneKey: string;
    actionKey: string;
    targetSceneKey: string;
    probability: number;
  }) => Promise<Scene>;
  checkActionTargetsValidity: (action: Action) => boolean;
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
    edges: BuilderEdge[];
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
  importStory: (storyFromImport: ImportData) => Promise<string>;
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
  makeEmptyActionPayload: () => Action;
};
