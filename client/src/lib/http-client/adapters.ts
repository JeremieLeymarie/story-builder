import { Action, Scene, Story, StoryProgress } from "../storage/domain";
import { components } from "./schema";

/* API TO CLIENT DOMAIN */

const fromAPIActionsAdapter = (
  actions: components["schemas"]["Action"][],
): Action[] => actions.map(fromAPIActionAdapter);

const fromAPISceneAdapter = (
  scene: components["schemas"]["Scene-Output"],
): Scene => {
  return {
    ...scene,
    actions: fromAPIActionsAdapter(scene.actions),
  };
};

const fromAPIScenesAdapter = (
  scenes: components["schemas"]["Scene-Output"][],
): Scene[] => scenes.map(fromAPISceneAdapter);

const fromAPIStoryAdapter = (story: components["schemas"]["Story"]): Story => {
  return {
    ...story,
    author: story.author ?? undefined,
    publicationDate: story.publicationDate
      ? new Date(story.publicationDate)
      : undefined,
    creationDate: new Date(story.creationDate),
  };
};

const fromAPIStoriesAdapter = (
  stories: components["schemas"]["Story"][],
): Story[] => {
  return stories.map(fromAPIStoryAdapter);
};

const fromAPIActionAdapter = (
  action: components["schemas"]["Action"],
): Action => {
  return {
    ...action,
    sceneKey: action.sceneKey ?? undefined,
  };
};

const fromAPIFullStoryAdapter = (
  fullStory: components["schemas"]["FullStory"],
): { story: Story; scenes: Scene[] } => {
  const { scenes, ...story } = fullStory;
  return {
    story: fromAPIStoryAdapter(story),
    scenes: fromAPIScenesAdapter(scenes),
  };
};

const fromAPIFullStoriesAdapter = (
  fullStories: components["schemas"]["FullStory"][],
): { stories: Story[]; scenes: Scene[] } => {
  return fullStories.reduce(
    (acc, story) => {
      const parsed = fromAPIFullStoryAdapter(story);

      return {
        scenes: [...acc.scenes, ...parsed.scenes],
        stories: [...acc.stories, parsed.story],
      };
    },
    { scenes: [], stories: [] } as { stories: Story[]; scenes: Scene[] },
  );
};

const fromAPIStoryProgressAdapter = (
  storyProgress: components["schemas"]["StoryProgress"],
): StoryProgress => {
  return {
    ...storyProgress,
    lastPlayedAt: new Date(storyProgress.lastPlayedAt),
  };
};

const fromAPIStoryProgressesAdapter = (
  storyProgresses: components["schemas"]["StoryProgress"][],
): StoryProgress[] => {
  return storyProgresses.map(fromAPIStoryProgressAdapter);
};

/* CLIENT DOMAIN TO API*/

const fromClientStoryAdapter = (
  story: Story,
): components["schemas"]["Story"] => {
  return {
    ...story,
    author: story.author ?? null,
    publicationDate: story.publicationDate
      ? story.publicationDate.toISOString()
      : null,
    creationDate: story.creationDate.toISOString(),
  };
};

const fromClientFullStoryAdapter = (
  story: Story,
  scenes: Scene[],
): components["schemas"]["FullStory"] => {
  return {
    ...fromClientStoryAdapter(story),
    scenes,
  };
};

const fromClientStoryProgressAdapter = (
  storyProgress: StoryProgress,
  userKey: string,
): components["schemas"]["StoryProgress"] => {
  return {
    ...storyProgress,
    userKey,
    lastPlayedAt: storyProgress.lastPlayedAt.toISOString(),
  };
};

export const adapter = {
  fromAPI: {
    fullStories: fromAPIFullStoriesAdapter,
    fullStory: fromAPIFullStoryAdapter,
    stories: fromAPIStoriesAdapter,
    story: fromAPIStoryAdapter,
    scenes: fromAPIScenesAdapter,
    scene: fromAPISceneAdapter,
    actions: fromAPIActionsAdapter,
    action: fromAPIActionAdapter,
    storyProgresses: fromAPIStoryProgressesAdapter,
    storyProgress: fromAPIStoryProgressAdapter,
  },
  fromClient: {
    fullStory: fromClientFullStoryAdapter,
    story: fromClientStoryAdapter,
    storyProgress: fromClientStoryProgressAdapter,
  },
};
