import { Scene, Story, User } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";

export const BASE_SCENE: WithoutKey<Scene> = {
  actions: [{ text: "action A" }, { text: "action B" }],
  builderParams: { position: { x: 0, y: 0 } },
  content: "pas content",
  storyKey: "zut",
  title: "flûte",
};

export const BASE_STORY: WithoutKey<Story> = {
  title: "Tidididoudoum tidididoudoum",
  description: "Sacré histoire...",
  image: "http://ton-image.fr",
  status: "draft",
  firstSceneKey: "zut",
  genres: ["adventure", "children"],
  creationDate: new Date(),
};

export const BASE_USER: WithoutKey<User> = {
  email: "bob@mail.com",
  username: "bob_bidou",
};
