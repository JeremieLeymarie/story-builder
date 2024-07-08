from http import HTTPStatus
from bson import ObjectId
from server.src.data_types.builder import StoryStatus
from utils.format_id import format_id
from utils.db import Database


class StoreDomain:

    def __init__(self) -> None:
        self.db = Database().get_db()

    def load(self):
        data = list(
            self.db.stories.find({"status": str(StoryStatus.PUBLISHED)}, {"scenes": 0})
        )
        data = [format_id(x) for x in data]
        return data

    def download(self, mongoId: str):
        data = self.db.stories.find_one({"_id": ObjectId(mongoId)})
        data = format_id(data)
        return data

    def publish(self, mongoId: str):
        self.db.stories.update_one(
            {"_id": ObjectId(mongoId)}, {"$set": {"status": str(StoryStatus.PUBLISHED)}}
        )
