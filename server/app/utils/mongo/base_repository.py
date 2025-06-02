from abc import ABC
from warnings import deprecated
from pymongo.collection import Collection

from datetime import datetime
from typing import Any, Generic, Optional, TypeVar, TypedDict

from utils.mongo.db import SBMongoDatabase
from utils.type_defs import StoryGenre, StoryType


class MongoUser(TypedDict):
    key: str
    email: str
    username: str
    password: str


class MongoSceneAction(TypedDict):
    text: str
    sceneKey: str | None


class MongoBuilderPosition(TypedDict):
    x: float
    y: float


class MongoBuilderParams(TypedDict):
    position: MongoBuilderPosition


class MongoScene(TypedDict):
    key: str
    storyKey: str
    title: str
    content: str
    actions: list[MongoSceneAction]
    builderParams: MongoBuilderParams


class MongoStoryAuthor(TypedDict):
    key: str
    username: str


class MongoStory(TypedDict):
    key: str
    userKey: str
    type: StoryType
    author: Optional[MongoStoryAuthor]
    title: str
    description: str
    image: str
    genres: list[StoryGenre]
    creationDate: datetime
    firstSceneKey: str

    originalStoryKey: Optional[str]
    publicationDate: Optional[datetime]

    scenes: list[MongoScene]


class MongoStoryProgress(TypedDict):
    key: str
    userKey: str
    history: list[str]
    currentSceneKey: str
    lastPlayedAt: datetime
    finished: bool | None
    storyKey: str
    lastSyncAt: datetime | None


T = TypeVar("T")


class MongoRecord(Generic[T], TypedDict):
    _id: str


class BaseMongoRepository(ABC):
    def __init__(self) -> None:
        db = SBMongoDatabase()
        self._client = db.get_client()
        self.db = db.get_db()
        self.story_progresses: Collection[MongoStoryProgress] = self.db.storyProgresses
        self.stories: Collection[MongoStory] = self.db.stories
        self.users: Collection[MongoUser] = self.db.users

    @deprecated("Use repository paradigm, like in MongoSynchronizationRepository")
    def remove_mongo_id(self, record: Any) -> Any:
        copy = dict(record)
        del copy["_id"]
        return copy
