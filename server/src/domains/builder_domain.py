from pymongo import ReturnDocument
from data_types.builder import Scene, Story, StoryStatus, FullStory
from repositories.story_repository_port import StoryRepositoryPort
from utils.db import Database


class BuilderDomain:

    def __init__(self, story_repository: StoryRepositoryPort) -> None:
        self.story_repository = story_repository

    def save(self, story: Story, scenes: list[Scene]) -> FullStory:

        payload = {
            **story.model_dump(),
            **{"scenes": [scene.model_dump() for scene in scenes]},
            "status": str(StoryStatus.SAVED),
        }

        story = self.story_repository.save(FullStory(**payload))

        return story
