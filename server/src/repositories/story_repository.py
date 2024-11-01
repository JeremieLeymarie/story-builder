from pymongo import ReturnDocument, UpdateOne
from repositories.story_repository_port import StoryRepositoryPort
from repositories.mongo_repository import MongoRecord, MongoRepository
from domains.type_def import FullStory, Story, StoryType

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

    def save_all(self, stories: list[FullStory]) -> list[FullStory]:

        self.db[STORY_COLLECTION].bulk_write(
            [
                UpdateOne(
                    {"key": story.key},
                    {"$set": story.model_dump(mode="json")},
                    upsert=True,
                )
                for story in stories
            ]
        )

        return stories

    def get_all(
        self, *, with_scenes: bool = True, type: StoryType | None = None
    ) -> list[Story] | list[FullStory]:
        filter = {}

        if type is not None:
            filter["type"] = type.value

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
        records = self.db.stories.find({"author.key": author_key})

        return [FullStory(**self.remove_mongo_id(record)) for record in list(records)]
