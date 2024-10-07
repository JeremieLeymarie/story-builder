import { Scene, Story, StoryProgress, User } from "@/lib/storage/domain";

export const BASIC_SCENE: Scene = {
  key: "vroum",
  actions: [{ text: "action A" }, { text: "action B" }],
  builderParams: { position: { x: 0, y: 0 } },
  content: "pas content",
  storyKey: "zut",
  title: "flûte",
};

export const BASIC_STORY: Story = {
  key: "zioup",
  title: "Tidididoudoum tidididoudoum",
  description: "Sacré histoire...",
  image: "http://ton-image.fr",
  status: "draft",
  firstSceneKey: "zut",
  genres: ["adventure", "children"],
  creationDate: new Date(),
};

export const BASIC_USER: User = {
  key: "pipou",
  email: "bob@mail.com",
  username: "bob_bidou",
};

export const BASIC_STORY_PROGRESS: StoryProgress = {
  key: "kiche",
  storyKey: "ding",
  userKey: "pipou",
  history: ["vroum"],
  currentSceneKey: "vroum",
  lastPlayedAt: new Date(),
};
