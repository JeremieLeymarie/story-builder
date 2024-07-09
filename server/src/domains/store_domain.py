from typing import cast
from data_types.builder import FullStory, Story, StoryStatus
from data_types.requests import FullStoryBuilderRequest
from repositories.story_repository_port import StoryRepositoryPort
from utils.errors import InvalidStoryFormatException


class StoreDomain:

    def __init__(self, story_repository: StoryRepositoryPort) -> None:
        self.story_repository = story_repository

    def load(self) -> list[Story]:
        data = self.story_repository.get_all(
            with_scenes=False, status=StoryStatus.PUBLISHED
        )
        return cast(list[Story], data)

    def download(self, remoteId: str) -> Story:
        data = self.story_repository.get(id=remoteId)
        return data

    def _validate_story(self, story: FullStory) -> None:
        if story.authorId == None:
            raise InvalidStoryFormatException(key="author_id")

        # TODO: check that story ends properly
        # TODO: check that story has a start

    def publish(self, payload: FullStoryBuilderRequest) -> None:
        story = FullStory(scenes=payload.scenes, **payload.story.model_dump())
        self._validate_story(story)

        story.status = StoryStatus.PUBLISHED

        self.story_repository.save(story=story)
