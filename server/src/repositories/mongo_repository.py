from typing import TypedDict, cast
from repositories.repository import Repository
from utils.db import Database
from typing import TypeVar, Generic

T = TypeVar("T")


class MongoRecord(Generic[T], TypedDict):
    _id: str


class MongoRepository(Repository):

    def __init__(self) -> None:
        self.db = Database().get_db()

    # TODO: This would be cleaner if we used pydantic models to do this
    def remove_mongo_id(self, record: MongoRecord[T]) -> T:
        copy = dict(record)
        del copy["_id"]
        return cast(T, copy)
