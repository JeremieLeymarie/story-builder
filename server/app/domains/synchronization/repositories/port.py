from typing import Iterable, Protocol
from utils.result import Result
from domains.synchronization.type_defs import (
    SynchronizationStory,
    SynchronizationStoryProgress,
)


class SynchronizationRepositoryPort(Protocol):
    def save_stories(
        self, stories: Iterable[SynchronizationStory], *, user_key: str
    ) -> Result: ...

    def save_story_progresses(
        self,
        story_progresses: Iterable[SynchronizationStoryProgress],
        *,
        user_key: str,
    ) -> Result: ...

    def get_stories(self, user_key: str) -> Iterable[SynchronizationStory]: ...

    def get_story_progresses(
        self, user_key: str
    ) -> Iterable[SynchronizationStoryProgress]: ...
