from typing import Iterable
from domains.synchronization.repositories.adapters import (
    make_mongo_story,
    make_mongo_story_progress,
    make_synchronization_story,
    make_synchronization_story_progress,
)
from domains.synchronization.repositories.port import (
    SynchronizationRepositoryPort,
)
from domains.synchronization.type_defs import (
    SynchronizationStory,
    SynchronizationStoryProgress,
)
from utils.mongo.base_repository import (
    BaseMongoRepository,
    MongoStory,
    MongoStoryProgress,
)

from utils.result import Result


class MongoSynchronizationRepository(
    SynchronizationRepositoryPort, BaseMongoRepository
):
    STORY_PROGRESS_COLLECTION = "storyProgresses"

    def __init__(self) -> None:
        super().__init__()

    def save_stories(
        self, stories: Iterable[SynchronizationStory], *, user_key: str
    ) -> Result:
        mongo_stories = [make_mongo_story(story, user_key) for story in stories]

        with self._client.start_session() as session:
            session.start_transaction()
            try:
                self._save_stories_transaction(mongo_stories, user_key=user_key)
                session.commit_transaction()
            except Exception:
                session.abort_transaction()
                return Result(success=False)

        return Result(success=True)

    def save_story_progresses(
        self, story_progresses: Iterable[SynchronizationStoryProgress], *, user_key: str
    ) -> Result:
        mongo_story_progresses = [
            make_mongo_story_progress(story) for story in story_progresses
        ]

        with self._client.start_session() as session:
            session.start_transaction()
            try:
                self._save_story_progresses_transaction(
                    mongo_story_progresses, user_key=user_key
                )
                session.commit_transaction()
            except Exception:
                session.abort_transaction()
                return Result(success=False)

        return Result(success=True)

    def get_stories(self, user_key: str) -> Iterable[SynchronizationStory]:
        mongo_stories = self.stories.find({"userKey": user_key})

        return [make_synchronization_story(story) for story in mongo_stories]

    def get_story_progresses(
        self, user_key: str
    ) -> Iterable[SynchronizationStoryProgress]:
        mongo_story_progresses = self.story_progresses.find({"userKey": user_key})

        return [
            make_synchronization_story_progress(sp) for sp in mongo_story_progresses
        ]

    def _save_stories_transaction(
        self, stories: Iterable[MongoStory], /, *, user_key: str
    ) -> None:
        # Fetch all existing stories linked to this user
        stories_to_delete = self.stories.find({"userKey": user_key}, {"_id": 1})
        # Insert all stories to save
        result = self.stories.insert_many(stories)

        if set(result.inserted_ids) != set(stories):
            raise ValueError("Could not insert all stories")

        # Delete old saves
        self.stories.delete_many(
            {"_id": {"$in": [story.get("_id") for story in stories_to_delete]}}
        )

    def _save_story_progresses_transaction(
        self, story_progresses: Iterable[MongoStoryProgress], /, *, user_key: str
    ) -> None:
        # Fetch all existing story_progresses linked to this user
        story_progresses_to_delete = self.story_progresses.find(
            {"userKey": user_key}, {"_id": 1}
        )
        # Insert all story_progresses to save
        result = self.story_progresses.insert_many(story_progresses)

        if set(result.inserted_ids) != set(story_progresses):
            raise ValueError("Could not insert all story_progresses")

        # Delete old saves
        self.story_progresses.delete_many(
            {
                "_id": {
                    "$in": [
                        story_progress.get("_id")
                        for story_progress in story_progresses_to_delete
                    ]
                }
            }
        )
