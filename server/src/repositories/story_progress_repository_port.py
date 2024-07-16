from typing import Protocol

from data_types.game import StoryProgress


class StoryProgressRepositoryPort(Protocol):
    def get_from_user(self, user_id: str) -> list[StoryProgress]:
        """Get all story progresses linked to a user_id


        Args:
            user_id (str): the string representation of the user id

        Returns:
            list[StoryProgress]: the matching database documents
        """
        ...

    def save(self, story_progress: StoryProgress) -> StoryProgress:
        """Insert or update a story progress in the database using the remoteUserId and remoteStoryId to find it


        Args:
            story_progress (StoryProgress): the full story progress data to save in the database

        Returns:
            StoryProgress: the updated record
        """
        ...
