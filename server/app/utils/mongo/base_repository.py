from abc import ABC
from warnings import deprecated
from bson import ObjectId
from pymongo.collection import Collection

from datetime import datetime
from typing import Any, Generic, Literal, NotRequired, TypeVar, TypedDict, Union

from utils.mongo.db import MongoDatabaseManager


class WithId(TypedDict):
    _id: NotRequired[ObjectId]


class MongoUser(WithId):
    key: str
    email: str
    username: str
    password: str


class MongoActionTarget(TypedDict):
    sceneKey: str
    probability: float


class _ActionBase(TypedDict):
    text: str
    targets: list[MongoActionTarget]


class MongoSimpleAction(_ActionBase):
    type: Literal["simple"]


class MongoActionCondition(TypedDict):
    type: Literal["user-did-visit", "user-did-not-visit"]
    sceneKey: str


class MongoConditionalAction(_ActionBase):
    type: Literal["conditional"]
    condition: MongoActionCondition


MongoSceneAction = Union[MongoSimpleAction, MongoConditionalAction]


class MongoBuilderPosition(TypedDict):
    x: float
    y: float


class MongoBuilderParams(TypedDict):
    position: MongoBuilderPosition


class MongoScene(TypedDict):
    key: str
    storyKey: str
    title: str
    content: dict[str, Any]
    actions: list[MongoSceneAction]
    builderParams: MongoBuilderParams


class MongoStoryAuthor(TypedDict):
    key: str
    username: str


class MongoStory(WithId):
    key: str
    userKey: str
    type: str
    author: MongoStoryAuthor | None
    title: str
    description: str
    image: str
    genres: list[str]
    creationDate: datetime
    firstSceneKey: str

    originalStoryKey: str | None
    publicationDate: datetime | None

    scenes: list[MongoScene]


class MongoStoryProgress(WithId):
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
        db_manager = MongoDatabaseManager()
        self._client = db_manager.get_client()
        self.db = db_manager.get_db()
        self.story_progresses: Collection[MongoStoryProgress] = self.db.storyProgresses
        self.stories: Collection[MongoStory] = self.db.stories
        self.users: Collection[MongoUser] = self.db.users

    @deprecated("Use repository paradigm, like in MongoSynchronizationRepository")
    def remove_mongo_id(self, record: Any) -> Any:
        copy = dict(record)
        del copy["_id"]
        return copy


class TestMongoRepository(BaseMongoRepository): ...
