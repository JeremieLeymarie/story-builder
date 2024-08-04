from typing import Protocol

from data_types.builder import FullStory, Story, StoryStatus


class StoryRepositoryPort(Protocol):
    def save(self, story: FullStory) -> FullStory:
        """Insert or update a story in the database using the key to find it


        Args:
            story (Story): the full story data to save in the database

        Returns:
            Story: the updated record
        """
        ...

    def save_all(self, stories: list[FullStory]) -> list[FullStory]:
        """Insert or update stories in the database

        Args:
            story (list[FullStory]): the full stories to save

        Returns:
            list[FullStory]: The updated (or inserted) records
        """

    def get_all(
        self,
        *,
        with_scenes: bool = True,
        status: StoryStatus | None = None,
    ) -> list[Story] | list[FullStory]:
        """Retrieve all stories from database


        Args:
            with_scenes (bool, optional): whether or not to retrieve the scenes. Defaults to True.
            status (StoryStatus, optional): filter by status type

        Returns:
            list[FullStory] | list[Story]: a list of stories, with or without the scenes
        """
        ...

    def get(self, *, key: str) -> FullStory:
        """Get one story by key

        Args:
            key (str): the key of the story to retrieve

        Returns:
            FullStory: the story corresponding to the key
        """

    def get_by_keys(self, *, keys: list[str]) -> list[FullStory]:
        """Get stories by keys

        Args:
            keys (list[str]): keys of the stories to retrieve

        Returns:
            list[FullStory]: the stories matching the keys
        """

    def get_by_author_key(self, *, author_key: str) -> list[FullStory]:
        """Get stories by author key

        Args:
            author_key (str): key of the user

        Returns:
            list[FullStory]: the stories written the specified author
        """
