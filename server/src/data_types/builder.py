import enum
from typing import Optional
from pydantic import BaseModel


class StoryStatus(enum.Enum):
    DRAFT = "draft"
    SAVED = "saved"
    PUBLISHED = "published"


class StoryGenre(enum.Enum):
    ADVENTURE = "adventure"
    CHILDREN = "children"
    DETECTIVE = "detective"
    DYSTOPIA = "dystopia"
    FANTASY = "fantasy"
    HISTORICAL = "historical"
    HORROR = "horror"
    HUMOR = "humor"
    MYSTERY = "mystery"
    ROMANCE = "romance"
    SCIENCE_FICTION = "science-fiction"
    THRILLER = "thriller"
    SUSPENSE = "suspense"
    WESTERN = "western"


class StoryAuthor(BaseModel):
    key: str
    username: str


class Story(BaseModel, use_enum_values=True):
    key: str
    author: Optional[StoryAuthor] = None
    title: str
    description: str
    image: str
    status: StoryStatus
    genres: list[StoryGenre]
    publicationDate: Optional[str] = None
    creationDate: str


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
