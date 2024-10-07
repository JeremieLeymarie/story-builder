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
};

export const STORY_STATUS = ["draft", "published", "imported"] as const;
export type StoryStatus = (typeof STORY_STATUS)[number];

type StoryBase = {
  key: string;
  author?: {
    key: string;
    username: string;
  };
  title: string;
  description: string;
  image: string;
  firstSceneKey: string;
  genres: StoryGenre[];
  creationDate: Date;
};

type ImportedStory = StoryBase & {
  originalStoryKey?: string;
  status: "imported";
};

type PublishedStory = StoryBase & {
  status: "published";
  publicationDate: Date;
};
type DraftStory = StoryBase & { status: "draft" };

export type Story = ImportedStory | PublishedStory | DraftStory;

export type Action = {
  text: string;
  sceneKey?: string;
};

export type Scene = {
  key: string;
  storyKey: string;
  title: string;
  content: string;
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

export const ENTITIES = ["story", "scene", "user", "story-progress"] as const;
export type Entity = (typeof ENTITIES)[number];
