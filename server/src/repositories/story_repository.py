from pymongo import ReturnDocument
from data_types.builder import FullStory, Story, StoryStatus
from repositories.story_repository_port import StoryRepositoryPort
from repositories.mongo_repository import MongoRecord, MongoRepository

STORY_COLLECTION = "stories"


# TODO: convert this to key paradigm
class StoryRepository(MongoRepository, StoryRepositoryPort):

    def save(self, story: FullStory) -> FullStory:
        payload = story.model_dump(mode="json")

        record: MongoRecord[dict] = self.db[STORY_COLLECTION].find_one_and_update(
            {"key": story.key},
            {"$set": payload},
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )

        return FullStory(**self.remove_mongo_id(record))

    def get_all(
        self, *, with_scenes: bool = True, status: StoryStatus | None = None
    ) -> list[Story] | list[FullStory]:
        filter = {}

        if status is not None:
            filter["status"] = status.value

        documents: list[MongoRecord[dict]] = self.db.stories.find(
            filter, {"scenes": 1 if with_scenes else 0}
        )

        return [
            (
                FullStory(**self.remove_mongo_id(story))
                if with_scenes
                else Story(**self.remove_mongo_id(story))
            )
            for story in list(documents)
        ]

    def get(self, *, key: str) -> FullStory:
        return FullStory(**self.remove_mongo_id(self.db.stories.find_one({"key": key})))

    def get_by_keys(self, *, keys: list[str]) -> list[FullStory]:
        records = self.db.stories.find({"key": {"$in": keys}})

        return [FullStory(**self.remove_mongo_id(record)) for record in list(records)]

    def get_by_author_key(self, *, author_key: str) -> list[FullStory]:
        records = self.db.stories.find({"key": author_key})

        return [FullStory(**self.remove_mongo_id(record)) for record in list(records)]
