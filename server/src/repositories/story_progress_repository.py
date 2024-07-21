from bson import ObjectId
from pymongo import ReturnDocument
from repositories.mongo_repository import MongoRepository
from repositories.story_progress_repository_port import StoryProgressRepositoryPort
from data_types.game import StoryProgress


class StoryProgressRepository(MongoRepository, StoryProgressRepositoryPort):

    def get_from_user(self, user_key: str) -> list[StoryProgress]:
        records = self.db.storyProgresses.find({"userKey": user_key})

        progresses = [
            StoryProgress(**self.remove_mongo_id(record)) for record in records
        ]

        return progresses

    def save(self, story_progress: StoryProgress) -> StoryProgress:
        progress = self.db.storyProgresses.find_one_and_update(
            {"key": story_progress.key},
            {"$set": story_progress.model_dump(mode="json")},
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )

        return progress
