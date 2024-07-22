import { Action, Scene, Story } from "../storage/dexie/dexie-db";
import { components } from "./schema";

// TODO: refacto this to have something easier to use

/* API TO CLIENT DOMAIN */

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

export const adapter = {
  fromAPI: {
    stories: fromAPIStoriesAdapter,
    story: fromAPIStoryAdapter,
    scenes: fromAPIScenesAdapter,
    scene: fromAPISceneAdapter,
    actions: fromAPIActionsAdapter,
    action: fromAPIActionAdapter,
  },
  fromClient: {
    story: fromClientStoryAdapter,
  },
};
