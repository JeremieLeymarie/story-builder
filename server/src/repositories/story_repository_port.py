from typing import Literal, Protocol, overload

from data_types.builder import FullStory, Story, StoryStatus


class StoryRepositoryPort(Protocol):
    def save(self, story: FullStory) -> FullStory:
        """Insert or update a story in the database using the authorId and storyId to find it


        Args:
            story (FullStory): the full story data to save in the database

        Returns:
            FullStory: the updated record
        """
        ...

    def get_all(
        self, *, with_scenes: bool = True, status: StoryStatus | None = None
    ) -> list[Story] | list[FullStory]:
        """Retrieve all stories from database


        Args:
            with_scenes (bool, optional): whether or not to retrieve the scenes. Defaults to True.
            status (StoryStatus, optional): filter by status type

        Returns:
            list[FullStory] | list[Story]: a list of stories, with or without the scenes
        """
        ...

    def get(self, *, id: str) -> FullStory:
        """Get one story by id

        Args:
            id (str): the id of the story to retrieve

        Returns:
            FullStory: the story corresponding to the id
        """
