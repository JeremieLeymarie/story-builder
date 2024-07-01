from data_types.builder import Story
from utils.db import Database
from bson import ObjectId


class BuilderDomain:

    def __init__(self) -> None:
        self.db = Database().get_db()

    def save(self, story: Story) -> None:
        self.db.stories.update_one(
            {"_id": ObjectId(story.mongoId)},
            {"$set": story.model_dump()},
            upsert=True,
        )
