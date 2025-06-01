from dataclasses import dataclass
from typing import Protocol
from domains.synchronization.repositories.port import SynchronizationRepositoryPort
from domains.synchronization.type_defs import (
    SynchronizationStory,
    SynchronizationStoryProgress,
)
from context import current_user
from utils.result import Result
from utils.type_defs import StoryType


@dataclass(kw_only=True, frozen=True)
class SynchronizationData:
    builder_stories: list[SynchronizationStory]
    games: list[SynchronizationStory]
    story_progresses: list[SynchronizationStoryProgress]


class SynchronizationServicePort(Protocol):
    def get_synchronization_data(self) -> SynchronizationData: ...

    def save_progresses(
        self, story_progresses: list[SynchronizationStoryProgress]
    ) -> Result: ...

    def save_stories(self, stories: list[SynchronizationStory]) -> Result: ...


class SynchronizationService:
    def __init__(
        self,
        repository: SynchronizationRepositoryPort,
    ):
        self.repository = repository

    def get_synchronization_data(self) -> SynchronizationData:
        user_key = current_user.get().key

        progresses = self.repository.get_story_progresses(user_key)

        all_stories = self.repository.get_stories(user_key)
        builder_stories = [
            story for story in all_stories if story.type is StoryType.BUILDER
        ]
        player_games = [
            story for story in all_stories if story.type is StoryType.IMPORTED
        ]
        return SynchronizationData(
            story_progresses=list(progresses),
            builder_stories=builder_stories,
            games=player_games,
        )

    def save_progresses(
        self, story_progresses: list[SynchronizationStoryProgress]
    ) -> Result:
        if not story_progresses:
            return Result(success=True)

        return self.repository.save_story_progresses(
            story_progresses, user_key=current_user.get().key
        )

    def save_stories(self, stories: list[SynchronizationStory]) -> Result:
        if not stories:
            return Result(success=True)

        return self.repository.save_stories(
            stories=stories, user_key=current_user.get().key
        )
