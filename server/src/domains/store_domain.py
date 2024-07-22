from typing import cast
from data_types.builder import FullStory, Scene, Story, StoryStatus
from data_types.requests import FullStoryBuilderRequest
from repositories.story_repository_port import StoryRepositoryPort
from utils.errors import InvalidStoryFormatException

# TODO: remove Request specific types


class StoreDomain:

    def __init__(self, story_repository: StoryRepositoryPort) -> None:
        self.story_repository = story_repository

    def load(self) -> list[Story]:
        data = self.story_repository.get_all(
            with_scenes=False, status=StoryStatus.PUBLISHED
        )
        return cast(list[Story], data)

    def download(self, *, key: str) -> Story:
        data = self.story_repository.get(key=key)
        return data

    def _validate_story(self, *, story: FullStory) -> None:
        if story.authorKey == None:
            raise InvalidStoryFormatException(key="author_id")

        # TODO: check that story ends properly
        # TODO: check that story has a start

    def publish(self, *, story: Story, scenes: list[Scene]) -> None:
        story = FullStory(scenes=scenes, **story.model_dump())
        self._validate_story(story=story)

        story.status = StoryStatus.PUBLISHED

        self.story_repository.save(story=story)
