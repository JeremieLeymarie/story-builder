from datetime import datetime
from typing import Any, Literal, Union
from pydantic import BaseModel

from utils.type_defs import StoryGenre, StoryType
from endpoints.common import BaseAPIModel


class SyncActionTarget(BaseAPIModel):
    scene_key: str
    probability: float


class _ActionBase(BaseModel):
    text: str
    targets: list[SyncActionTarget]


class SyncSimpleAction(_ActionBase):
    type: Literal["simple"]


class SyncActionCondition(BaseModel):
    type: Literal["user-did-visit", "user-did-not-visit"]
    scene_key: str


class SyncConditionalAction(_ActionBase):
    type: Literal["conditional"]
    condition: SyncActionCondition


SynchronizationSceneAction = Union[SyncSimpleAction, SyncConditionalAction]


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
