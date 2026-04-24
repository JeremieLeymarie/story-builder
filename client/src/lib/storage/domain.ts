import { LexicalContent } from "../lexical-content";

/* USER */

export type User = {
  key: string;
  username: string;
  email: string;
  token?: string;
};

/* STORY & SCENES */

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

export const STORY_TYPE = ["builder", "published", "imported"] as const;

export type CharacterNumericAttribute = {
  key: string;
  type: "numeric";
  name: string;
  description?: string;
  visibility: "visible" | "invisible";
  initialValue: number;
};

// Extend this union as we add more attribute types
// (remember to also update `ProgressCharacterAttribute` union)
export type CharacterAttribute = CharacterNumericAttribute;

export type CharacterConfiguration = {
  key: string;
  storyKey: string;
  attributes: Record<string, CharacterAttribute>;
};

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

type ActionBase = {
  key: string;
  text: string;
  targets: { sceneKey: string; probability: number }[];
};

type SimpleAction = ActionBase & {
  type: "simple";
};

type SceneVisitCondition = {
  type: "user-did-visit" | "user-did-not-visit";
  sceneKey: string;
};

export type CharacterAttributeCondition = {
  type: "character-attribute";
  attributeKey: string;
  comparator: "lower-than" | "greater-than"; // Add more flavors?
  value: number;
};

type ActionCondition = SceneVisitCondition | CharacterAttributeCondition;

export const isSceneVisitCondition = (
  condition: ActionCondition,
): condition is SceneVisitCondition =>
  condition.type === "user-did-not-visit" ||
  condition.type === "user-did-visit";

export type ConditionalAction = ActionBase & {
  type: "conditional";
  condition: ActionCondition;
};

export type Action = SimpleAction | ConditionalAction;

export type BuilderPosition = { x: number; y: number };

type CharacterAttributeSideEffect = {
  type: "character-attribute";
  increment: number;
  attributeKey: string;
  title?: string;
  description?: string;
};

export type SideEffect = {
  key: string;
  name: string;
  trigger: "scene-load"; // Determine when the effect runs. For now, only scene loads is implement, but we could extend it ("timer", ...)
  isVisible: boolean; // Whether the side effect is visible in-game
  effect: CharacterAttributeSideEffect;
};

export type Scene = {
  key: string;
  storyKey: string;
  title: string;
  content: LexicalContent;
  actions: Action[];
  builderParams: { position: BuilderPosition };
  sideEffects?: SideEffect[];
};

export const TITLE_SIZES = ["small", "medium", "large", "huge"] as const;
export const ACTION_BUTTON_SIZES = [
  "small",
  "medium",
  "large",
  "huge",
] as const;

export type StoryThemeConfig = {
  title: {
    hidden: boolean;
    size: (typeof TITLE_SIZES)[number];
    color: string;
  };
  action: {
    backgroundColor: string;
    textColor: string;
    size: (typeof ACTION_BUTTON_SIZES)[number];
  };
  scene: {
    background: { color: string; image?: string | null };
    text: { color: string };
  };
};

export type StoryTheme = {
  key: string;
  storyKey: string;
  theme: StoryThemeConfig;
};

/* STORY PROGRESS */

type ProgressCharacterNumericAttribute = CharacterNumericAttribute & {
  value: number;
};

// Extend this union as we add more types
type ProgressCharacterAttribute = ProgressCharacterNumericAttribute;

export type ProgressCharacter = {
  attributes: Record<string, ProgressCharacterAttribute>;
};

export type StoryProgress = {
  key: string;
  storyKey: string;
  userKey: string | undefined;
  history: string[];
  currentSceneKey: string;
  character?: ProgressCharacter;
  inventory?: Record<string, unknown>;
  name?: string;
  createdAt: Date;
  lastPlayedAt: Date;
  totalPlayTimeMs: number;
  finished?: boolean;
};

/* WIKI */

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

export const WIKI_ARTICLE_LINKS_ENTITY_TYPES = [
  "scene",
] as const satisfies Entity[]; // maybe wiki articles in the future?

type WikiArticleEntityType = (typeof WIKI_ARTICLE_LINKS_ENTITY_TYPES)[number];

export type WikiArticleLink = {
  key: string; // This is not a primary key, multiple WikiArticleLinks can have the same articleLinkKey
  articleKey: string;
  entityType: WikiArticleEntityType;
  entityKey: string;
};

export type Entity =
  | "story"
  | "scene"
  | "story-theme"
  | "character-configuration"
  | "user"
  | "story-progress"
  | "wiki"
  | "wiki-article"
  | "wiki-category"
  | "wiki-article-link";
