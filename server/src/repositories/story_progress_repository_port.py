from typing import Protocol

from data_types.game import StoryProgress


class StoryProgressRepositoryPort(Protocol):
    def get_from_user(self, user_key: str) -> list[StoryProgress]:
        """Get all story progresses linked to a user


        Args:
            user_key (str): the string representation of the user key

        Returns:
            list[StoryProgress]: the matching database documents
        """
        ...

    def save(self, story_progress: StoryProgress) -> StoryProgress:
        """Insert or update a story progress in the database using the key to find it


        Args:
            story_progress (StoryProgress): the full story progress data to save in the database

        Returns:
            StoryProgress: the updated record
        """
        ...

    def save_all(self, story_progresses: list[StoryProgress]) -> list[StoryProgress]:
        """Insert or update story progresses in the database


        Args:
            story_progresses (list[StoryProgress]): the story progresses data to save in the database

        Returns:
            StoryProgress: the updated or inserted records
        """
        ...
