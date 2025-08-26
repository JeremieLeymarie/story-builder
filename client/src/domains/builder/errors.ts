import { Story } from "@/lib/storage/domain";

export class InvalidStoryTypeError extends Error {
  constructor(type: Story["type"]) {
    super(`Invalid story type: expected type {builder}, got ${type}`);
  }
}
