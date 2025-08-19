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

type StoryBase = {
  key: string;
  author?: Author;
  title: string;
  description: string;
  image: string;
  firstSceneKey: string;
  genres: StoryGenre[];
  creationDate: Date;
};

export type ImportedStory = StoryBase & {
  originalStoryKey?: string;
  type: "imported";
};

export type BuilderStory = StoryBase & { type: "builder" };

export type Story = ImportedStory | BuilderStory;

export type Action = {
  text: string;
  sceneKey?: string;
};

export type Scene = {
  key: string;
  storyKey: string;
  title: string;
  content: Record<string, unknown>;
  actions: Action[];
  builderParams: { position: { x: number; y: number } };
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
};

export const ENTITIES = [
  "story",
  "scene",
  "user",
  "story-progress",
  "wiki",
] as const;
export type Entity = (typeof ENTITIES)[number];
