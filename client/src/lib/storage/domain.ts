import { SceneContent } from "../scene-content";

export const STORY_GENRES = [
  "adventure",
  "children",
  "detective",
  "dystopia",
  "fantasy",
  "historical",
  "horror",
  "humor",
  "mystery",
  "romance",
  "science-fiction",
  "thriller",
  "suspense",
  "western",
] as const;
export type StoryGenre = (typeof STORY_GENRES)[number];

export type User = {
  key: string;
  username: string;
  email: string;
  token?: string;
};

export const STORY_TYPE = ["builder", "published", "imported"] as const;
export type StoryType = (typeof STORY_TYPE)[number];

type Author = {
  key: string;
  username: string;
};

export type StoryBase = {
  key: string;
  author?: Author;
  title: string;
  description: string;
  image: string;
  firstSceneKey: string; // FIXME: the first scene can be deleted (#273)
  genres: StoryGenre[];
  creationDate: Date;
  wikiKey?: string;
};

export type LibraryStory = StoryBase & {
  originalStoryKey?: string;
  type: "imported";
};

export type BuilderStory = StoryBase & { type: "builder" };

export type Story = LibraryStory | BuilderStory;

export type Action = {
  text: string;
  sceneKey?: string;
};

export type BuilderPosition = { x: number; y: number };

export type Scene = {
  key: string;
  storyKey: string;
  title: string;
  content: SceneContent;
  actions: Action[];
  builderParams: { position: BuilderPosition };
};

export type StoryProgress = {
  key: string;
  storyKey: string;
  userKey: string | undefined;
  history: string[];
  currentSceneKey: string;
  character?: Record<string, unknown>;
  inventory?: Record<string, unknown>;
  lastPlayedAt: Date;
  finished?: boolean;
};

export type Wiki = {
  key: string;
  author?: Author;
  type: "imported" | "created";
  name: string;
  description?: string;
  image: string;
  createdAt: Date;
};

export type WikiArticle = {
  key: string;
  wikiKey: string;
  title: string;
  content: Record<string, unknown>;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  categoryKey?: string;
};

export type WikiCategory = {
  wikiKey: string;
  key: string;
  name: string;
  color: string;
};

export const ENTITIES = [
  "story",
  "scene",
  "user",
  "story-progress",
  "wiki",
  "wiki-article",
  "wiki-category",
] as const;
export type Entity = (typeof ENTITIES)[number];
