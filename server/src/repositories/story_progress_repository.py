from pymongo import ReturnDocument, UpdateOne
from repositories.mongo_repository import MongoRepository
from repositories.story_progress_repository_port import StoryProgressRepositoryPort
from domains.type_def import StoryProgress


STORY_PROGRESS_COLLECTION = "storyProgresses"


class StoryProgressRepository(MongoRepository, StoryProgressRepositoryPort):

    def get_from_user(self, user_key: str) -> list[StoryProgress]:
        records = self.db.storyProgresses.find({"userKey": user_key})

        progresses = [
            StoryProgress(**self.remove_mongo_id(record)) for record in records
        ]

        return progresses

    def save(self, story_progress: StoryProgress) -> StoryProgress:
        progress = self.db[STORY_PROGRESS_COLLECTION].find_one_and_update(
            {"key": story_progress.key},
            {"$set": story_progress.model_dump(mode="json")},
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )

        return progress

    def save_all(self, story_progresses: list[StoryProgress]) -> list[StoryProgress]:

        self.db[STORY_PROGRESS_COLLECTION].bulk_write(
            [
                UpdateOne(
                    {"key": progress.key},
                    {"$set": progress.model_dump(mode="json")},
                    upsert=True,
                )
                for progress in story_progresses
            ]
        )

        return story_progresses
