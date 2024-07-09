from typing import Any, Mapping
from bson import ObjectId
from pymongo import ReturnDocument
from data_types.builder import FullStory, Story, StoryStatus
from repositories.story_repository_port import StoryRepositoryPort
from utils.format_id import format_id
from utils.db import Database


class StoryRepository(StoryRepositoryPort):
    def __init__(self) -> None:
        self.db = Database().get_db()

    def save(self, story: FullStory) -> FullStory:
        filter: Mapping[str, Any] = (
            {"_id": ObjectId(story.remoteId)}
            if story.remoteId
            else {"authorId": story.authorId, "id": story.id}
        )

        story = self.db.stories.update_one(
            filter,
            {"$set": {story}},
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )

        return FullStory(**format_id(story))

    # TODO: make overloads work

    # @overload
    # def get_all(
    #     self, *, with_scenes: Literal[True] = True, status: StoryStatus | None = None
    # ) -> list[FullStory]: ...

    # @overload
    # def get_all(
    #     self, *, with_scenes: Literal[False], status: StoryStatus | None
    # ) -> list[Story]: ...

    def get_all(
        self, *, with_scenes: bool = True, status: StoryStatus | None = None
    ) -> list[Story] | list[FullStory]:
        filter = {}

        if status is not None:
            filter["status"] = str(status)

        return [
            FullStory(**format_id(story))
            for story in list(
                self.db.stories.find(filter, {"scenes": 1 if with_scenes else 0})
            )
        ]

    def get(self, *, id: str) -> FullStory:
        return FullStory(**format_id(self.db.stories.find_one({"_id": ObjectId(id)})))
