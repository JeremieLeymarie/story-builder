import { LexicalContent } from "@/lib/lexical-content";
import { Scene, Story, StoryProgress, User } from "@/lib/storage/domain";

export const BASIC_SCENE_CONTENT: LexicalContent = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Simple scene content",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
        textFormat: 0,
        textStyle: "",
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};

export const BASIC_SCENE: Scene = {
  key: "vroum",
  actions: [{ text: "action A" }, { text: "action B" }],
  builderParams: { position: { x: 0, y: 0 } },
  content: BASIC_SCENE_CONTENT,
  storyKey: "zut",
  title: "flûte",
};

export const BASIC_STORY: Story = {
  key: "zioup",
  title: "Tidididoudoum tidididoudoum",
  description: "Sacré histoire...",
  image: "http://ton-image.fr",
  type: "builder",
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
