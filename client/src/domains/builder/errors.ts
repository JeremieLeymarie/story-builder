import { Story } from "@/lib/storage/domain";

export class InvalidStoryTypeError extends Error {
  constructor(type: Story["type"]) {
    super(`Invalid story type: expected type {builder}, got ${type}`);
  }
}

export class CannotDeleteFirstSceneError extends Error {
  constructor(storyKey: string) {
    super(`Cannot delete first scene : impacted story ${storyKey}`);
  }
}
