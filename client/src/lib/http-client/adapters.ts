import { Story } from "../storage/dexie/dexie-db";
import { components } from "./schema";

/* API TO CLIENT DOMAIN */

export const fromAPIstoryAdapter = (
  story: components["schemas"]["Story"],
): Story => {
  return {
    ...story,
    author: story.author ?? undefined,
    publicationDate: story.publicationDate
      ? new Date(story.publicationDate)
      : undefined,
    creationDate: new Date(story.creationDate),
  };
};

export const fromAPIstoriesAdapter = (
  stories: components["schemas"]["Story"][],
): Story[] => {
  return stories.map(fromAPIstoryAdapter);
};

/* CLIENT DOMAIN TO API*/

export const fromClientStoryAdapter = (
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
