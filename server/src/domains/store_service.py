from datetime import datetime
from typing import cast
from repositories.story_repository_port import StoryRepositoryPort
from domains.type_def import FullStory, Scene, Story, StoryType
from utils.errors import InvalidStoryFormatException


class StoreService:

    def __init__(self, story_repository: StoryRepositoryPort) -> None:
        self.story_repository = story_repository

    def load(self) -> list[Story]:
        data = self.story_repository.get_all(
            with_scenes=False, type=StoryType.PUBLISHED
        )
        return cast(list[Story], data)

    def download(self, *, key: str) -> FullStory:
        data = self.story_repository.get(key=key)
        return data

    def _validate_story(self, *, story: FullStory) -> None:
        if story.author == None:
            raise InvalidStoryFormatException(key="author_id")

        # TODO: check that story ends properly
        # TODO: check that story has a start

    def publish(self, *, story: Story, scenes: list[Scene]) -> Story:
        story = FullStory(scenes=scenes, **story.model_dump())
        self._validate_story(story=story)

        story.type = StoryType.PUBLISHED
        story.publicationDate = datetime.now()

        story = self.story_repository.save(story=story)
        return story
