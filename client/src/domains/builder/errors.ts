import { Story } from "@/lib/storage/domain";

export class BuilderError extends Error {}

export class InvalidStoryTypeError extends BuilderError {
  constructor(type: Story["type"]) {
    super(`Invalid story type: expected type {builder}, got ${type}`);
  }
}

export class CannotDeleteFirstSceneError extends BuilderError {
  constructor(storyKey: string) {
    super(`Cannot delete first scene : impacted story ${storyKey}`);
  }
}

export class DuplicationMissingPositionError extends BuilderError {
  constructor(missingSceneKey: string) {
    super(
      `Cannot duplicate scenes: missing new positions info for scene ${missingSceneKey}`,
    );
  }
}

export class ActionTargetNotFound extends BuilderError {
  constructor(props: {
    sourceSceneKey: string;
    actionKey: string;
    targetSceneKey: string;
  }) {
    super(
      `Action target not found for connection coming from scene ${props.sourceSceneKey}, action ${props.actionKey} and leading to ${props.targetSceneKey}`,
    );
  }
}
