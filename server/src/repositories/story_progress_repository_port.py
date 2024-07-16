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
