import { makeSimpleSceneContent } from "@/lib/scene-content";

export const MOCK_IMPORTED_STORY = {
  key: "bloup",
  title: "The Great Journey To The Green River",
  description: "A wonderful epic tale through the world of Penthetir. ",
  image:
    "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
  type: "builder" as const,
  genres: ["adventure" as const, "fantasy" as const],
  creationDate: new Date(),
  firstSceneKey: "skibidi",
  author: {
    username: "author",
    key: "author-key",
  },
};

export const MOCK_IMPORTED_SCENE = {
  key: "skibidi",
  storyKey: "bloup",
  title: "Your first scene",
  content: makeSimpleSceneContent(
    "This is a placeholder content for your first scene",
  ),
  actions: [
    {
      text: "An action that leads to a scene",
      sceneKey: "dest-scene",
    },
    {
      text: "An action that leads to another scene",
    },
  ],
  builderParams: {
    position: {
      x: 0,
      y: 0,
    },
  },
};
