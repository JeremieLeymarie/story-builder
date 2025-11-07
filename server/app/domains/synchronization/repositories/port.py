from typing import Protocol
from utils.result import Result
from domains.synchronization.type_defs import (
    SynchronizationStory,
    SynchronizationStoryProgress,
)


class SynchronizationRepositoryPort(Protocol):
    def save_stories(
        self, stories: list[SynchronizationStory], *, user_key: str
    ) -> Result: ...

    def save_story_progresses(
        self,
        story_progresses: list[SynchronizationStoryProgress],
        *,
        user_key: str,
    ) -> Result: ...

    def get_stories(self, user_key: str) -> list[SynchronizationStory]: ...

    def get_story_progresses(
        self, user_key: str
    ) -> list[SynchronizationStoryProgress]: ...

    def delete_story_progress(
        self, progress_key: str, *, user_key: str
    ) -> Result: ...
