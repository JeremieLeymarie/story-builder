from typing import Any, Mapping
from bson import ObjectId
from pymongo import ReturnDocument
from data_types.builder import FullStory, Story, StoryStatus
from repositories.story_repository_port import StoryRepositoryPort
from repositories.mongo_repository import MongoRecord, MongoRepository


# TODO: convert this to key paradigm
class StoryRepository(MongoRepository, StoryRepositoryPort):

    def save(self, story: FullStory) -> FullStory:
        filter: Mapping[str, Any] = (
            {"_id": ObjectId(story.remoteId)}
            if story.remoteId
            else {"authorId": story.authorId, "id": story.id}
        )

        payload = story.model_dump(mode="json")

        record: MongoRecord[dict] = self.db.stories.find_one_and_update(
            filter,
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

    def get(self, *, id: str) -> FullStory:
        return FullStory(
            **self.remove_mongo_id(self.db.stories.find_one({"_id": ObjectId(id)}))
        )
