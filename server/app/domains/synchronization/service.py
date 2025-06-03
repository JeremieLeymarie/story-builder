from dataclasses import dataclass
from typing import Protocol
from domains.synchronization.errors import (
    BuilderStoryAuthorNotMatchError,
    UserKeyNotMatchError,
)
from domains.synchronization.repositories.port import SynchronizationRepositoryPort
from domains.synchronization.type_defs import (
    SynchronizationStory,
    SynchronizationStoryProgress,
)
from utils.result import Result
from utils.type_defs import StoryType


@dataclass(kw_only=True, frozen=True)
class SynchronizationData:
    builder_stories: list[SynchronizationStory]
    games: list[SynchronizationStory]
    story_progresses: list[SynchronizationStoryProgress]


class SynchronizationServicePort(Protocol):
    def get_synchronization_data(self, user_key: str) -> SynchronizationData: ...

    def save_progresses(
        self, story_progresses: list[SynchronizationStoryProgress], *, user_key: str
    ) -> Result: ...

    def save_stories(
        self, stories: list[SynchronizationStory], *, user_key: str
    ) -> Result: ...


class SynchronizationService:
    def __init__(
        self,
        repository: SynchronizationRepositoryPort,
    ):
        self.repository = repository

    def get_synchronization_data(self, user_key: str) -> SynchronizationData:
        progresses = self.repository.get_story_progresses(user_key)
        all_stories = self.repository.get_stories(user_key)

        builder_stories = [
            story for story in all_stories if story.type == StoryType.BUILDER.value
        ]
        player_games = [
            story for story in all_stories if story.type == StoryType.IMPORTED.value
        ]
        return SynchronizationData(
            story_progresses=list(progresses),
            builder_stories=builder_stories,
            games=player_games,
        )

    def save_progresses(
        self, story_progresses: list[SynchronizationStoryProgress], *, user_key: str
    ) -> Result:
        if not story_progresses:
            return Result(success=True)

        for sp in story_progresses:
            if sp.user_key != user_key:
                raise UserKeyNotMatchError(user_key=user_key, authed_user_key=user_key)

        return self.repository.save_story_progresses(
            story_progresses, user_key=user_key
        )

    def save_stories(
        self, stories: list[SynchronizationStory], *, user_key: str
    ) -> Result:
        if not stories:
            return Result(success=True)

        for story in stories:
            if story.user_key != user_key:
                raise UserKeyNotMatchError(user_key=user_key, authed_user_key=user_key)

            if (
                story.type == StoryType.BUILDER
                and story.author is not None
                and story.author.key != user_key
            ):
                raise BuilderStoryAuthorNotMatchError(
                    author_key=story.author.key, authed_user_key=user_key
                )

        return self.repository.save_stories(stories=stories, user_key=user_key)
