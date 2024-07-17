import enum
from typing import Optional
from pydantic import BaseModel


class StoryStatus(enum.Enum):
    DRAFT = "draft"
    SAVED = "saved"
    PUBLISHED = "published"


class Story(BaseModel, use_enum_values=True):
    key: str
    authorKey: Optional[str] = None
    title: str
    description: str
    image: str
    status: StoryStatus


class Action(BaseModel):
    text: str
    sceneKey: Optional[str] = None


class BuilderPosition(BaseModel):
    x: float
    y: float


class BuilderParams(BaseModel):
    position: BuilderPosition


class Scene(BaseModel):
    key: str
    storyKey: str
    title: str
    content: str
    actions: list[Action]
    builderParams: BuilderParams


class FullStory(Story):
    scenes: list[Scene]
