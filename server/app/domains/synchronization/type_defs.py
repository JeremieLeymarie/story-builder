from datetime import datetime
from typing import Any
from pydantic import BaseModel

from utils.type_defs import StoryGenre, StoryType


class SynchronizationSceneAction(BaseModel):
    text: str
    scene_key: str | None = None


class SynchronizationBuilderPosition(BaseModel):
    x: float
    y: float


class SynchronizationBuilderParams(BaseModel):
    position: SynchronizationBuilderPosition


class SynchronizationScene(BaseModel):
    key: str
    story_key: str
    title: str
    content: dict[str, Any]
    actions: list[SynchronizationSceneAction]
    builder_params: SynchronizationBuilderParams


class SynchronizationStoryAuthor(BaseModel):
    key: str
    username: str


class SynchronizationStory(BaseModel):
    key: str
    user_key: str
    type: StoryType
    author: SynchronizationStoryAuthor | None
    title: str
    description: str
    image: str
    genres: list[StoryGenre]
    creation_date: datetime
    first_scene_key: str

    original_story_key: str | None
    publication_date: datetime | None

    scenes: list[SynchronizationScene]


class SynchronizationStoryProgress(BaseModel):
    key: str
    user_key: str
    history: list[str]
    current_scene_key: str
    last_played_at: datetime
    finished: bool | None = None
    story_key: str
    last_sync_at: datetime | None = None
