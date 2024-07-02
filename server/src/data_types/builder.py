import enum
from typing import Optional
from pydantic import BaseModel


class StoryStatus(enum.Enum):
    DRAFT = "draft"
    SAVED = "saved"
    PUBLISHED = "published"


class Story(BaseModel):
    id: int
    mongoId: Optional[str] = None
    authorId: int
    title: str
    description: str
    image: str
    status: StoryStatus

    class Config:
        use_enum_values = True


class Action(BaseModel):
    text: str
    sceneId: Optional[int] = None


class BuilderPosition(BaseModel):
    x: float
    y: float


class BuilderParams(BaseModel):
    position: BuilderPosition


class Scene(BaseModel):
    id: int
    mongoId: Optional[str] = None
    storyId: int
    title: str
    content: str
    actions: list[Action]
    builderParams: BuilderParams
