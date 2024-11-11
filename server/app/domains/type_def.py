from datetime import datetime
import enum
from typing import Optional, Self
from pydantic import BaseModel, Field


class FullUser(BaseModel):
    key: str
    email: str
    username: str
    password: str


class User(BaseModel):
    key: str
    email: str
    username: str

    @classmethod
    def from_full_user(cls, full_user: FullUser) -> Self:
        return cls(
            email=full_user.email, username=full_user.username, key=full_user.key
        )


class AuthUser(BaseModel):
    key: str
    email: str
    username: str
    token: str

    @classmethod
    def from_full_user(cls, *, full_user: FullUser, token: str) -> Self:
        return cls(
            email=full_user.email,
            username=full_user.username,
            key=full_user.key,
            token=token,
        )


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


class StoryType(enum.Enum):
    BUILDER = "builder"
    PUBLISHED = "published"
    IMPORTED = "imported"


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


# TODO: Figure out a way to use pydantic's discriminated unions (on type)
class Story(BaseModel, use_enum_values=True):
    key: str = Field(description="The unique key of the story")
    type: StoryType = Field(description="The type of the story")
    author: Optional[StoryAuthor] = Field(description="The author of the story")
    title: str = Field(description="The title of the story")
    description: str = Field(description="The description of the story")
    image: str = Field(description="The URL used for the story thumbnail")
    genres: list[StoryGenre] = Field(description="The genres of story")
    creationDate: str = Field(description="The date at which the story was created")
    firstSceneKey: str = Field(description="The first scene of the story")

    originalStoryKey: Optional[str] = Field(
        description="The key of the first", default=None
    )
    publicationDate: Optional[datetime] = Field(
        description="The date at which the story", default=None
    )


class FullStory(Story):
    scenes: list[Scene]


class StoryProgress(BaseModel):
    key: str
    userKey: str
    history: list[str]
    currentSceneKey: str
    lastPlayedAt: datetime
    finished: Optional[bool] = None
    storyKey: str
    lastSyncAt: Optional[str] = None
