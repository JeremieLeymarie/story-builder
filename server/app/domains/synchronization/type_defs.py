from datetime import datetime
from typing import Any, Literal
from pydantic import BaseModel

from utils.type_defs import StoryGenre, StoryType
from endpoints.common import BaseAPIModel


class SyncActionTarget(BaseAPIModel):
    scene_key: str
    probability: float


class _ActionBase(BaseModel):
    key: str
    text: str
    targets: list[SyncActionTarget]


class SyncSimpleAction(_ActionBase):
    type: Literal["simple"]


class SyncActionSceneVisitCondition(BaseModel):
    type: Literal["user-did-visit", "user-did-not-visit"]
    scene_key: str


class SyncActionCharacterAttributeCondition(BaseModel):
    type : Literal["character-attribute"]
    attribute_key: str
    comparator : Literal["lower-than", "greater-than"]
    value: int

type SyncCondition = SyncActionSceneVisitCondition | SyncActionCharacterAttributeCondition

class SyncConditionalAction(_ActionBase):
    type: Literal["conditional"]
    condition: SyncCondition


type SynchronizationSceneAction = SyncSimpleAction |  SyncConditionalAction


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
    updated_at: datetime | None = None
    first_scene_key: str

    original_story_key: str | None
    publication_date: datetime | None

    scenes: list[SynchronizationScene]


class SynchronizationStoryProgress(BaseModel):
    key: str
    user_key: str
    history: list[str]
    current_scene_key: str
    created_at: datetime
    last_played_at: datetime
    total_play_time_ms: int = 0
    finished: bool | None = None
    story_key: str
    last_sync_at: datetime | None = None
