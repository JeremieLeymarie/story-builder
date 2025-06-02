from datetime import datetime

import pytest
from domains.synchronization.errors import SynchronizationUserKeyNotMatchError
from domains.synchronization.repositories.port import SynchronizationRepositoryPort
from domains.synchronization.service import SynchronizationData, SynchronizationService
from domains.synchronization.type_defs import (
    SynchronizationStory,
    SynchronizationStoryAuthor,
    SynchronizationStoryProgress,
)
from utils.result import Result
from utils.type_defs import StoryGenre, StoryType


class BaseMockSynchronizationRepository(SynchronizationRepositoryPort):
    def get_stories(self, user_key: str) -> list[SynchronizationStory]:
        raise NotImplementedError

    def get_story_progresses(self, user_key: str) -> list[SynchronizationStoryProgress]:
        raise NotImplementedError

    def save_story_progresses(
        self,
        story_progresses: list[SynchronizationStoryProgress],
        *,
        user_key: str,
    ) -> Result:
        raise NotImplementedError

    def save_stories(
        self, stories: list[SynchronizationStory], *, user_key: str
    ) -> Result:
        raise NotImplementedError


def test_get_synchronization_data() -> None:
    class MockSyncRepository(BaseMockSynchronizationRepository):
        def get_stories(self, user_key):
            return [
                SynchronizationStory(
                    key="zgloub",
                    user_key="me",
                    type=StoryType.BUILDER,
                    author=SynchronizationStoryAuthor(key="me", username="bob_bidou"),
                    title="A Story Created By Me",
                    description="What a wonderful story",
                    image="http://image.com",
                    genres=[StoryGenre.ADVENTURE, StoryGenre.HUMOR],
                    creation_date=datetime(1999, 11, 26),
                    first_scene_key="zargub",
                    original_story_key="pschitt",
                    publication_date=datetime(1999, 12, 8),
                    scenes=[],
                ),
                SynchronizationStory(
                    key="shplouf",
                    user_key="me",
                    type=StoryType.IMPORTED,
                    author=SynchronizationStoryAuthor(
                        key="gerg", username="peter_peter"
                    ),
                    title="A Story Created By Peter Peter",
                    description="Wow, what a story",
                    image="http://photo.com",
                    genres=[],
                    creation_date=datetime(1999, 11, 26),
                    first_scene_key="zargub",
                    original_story_key=None,
                    publication_date=None,
                    scenes=[],
                ),
            ]

        def get_story_progresses(self, user_key):
            return [
                SynchronizationStoryProgress(
                    key="plouf",
                    user_key="me",
                    history=["scene-1", "scene-2"],
                    current_scene_key="scene-2",
                    last_played_at=datetime(2025, 6, 2),
                    finished=True,
                    story_key="shplouf",
                    last_sync_at=datetime(2025, 6, 2),
                )
            ]

    svc = SynchronizationService(repository=MockSyncRepository())

    sync_data = svc.get_synchronization_data("me")

    assert sync_data == SynchronizationData(
        builder_stories=[
            SynchronizationStory(
                key="zgloub",
                user_key="me",
                type=StoryType.BUILDER,
                author=SynchronizationStoryAuthor(key="me", username="bob_bidou"),
                title="A Story Created By Me",
                description="What a wonderful story",
                image="http://image.com",
                genres=[StoryGenre.ADVENTURE, StoryGenre.HUMOR],
                creation_date=datetime(1999, 11, 26),
                first_scene_key="zargub",
                original_story_key="pschitt",
                publication_date=datetime(1999, 12, 8),
                scenes=[],
            )
        ],
        games=[
            SynchronizationStory(
                key="shplouf",
                user_key="me",
                type=StoryType.IMPORTED,
                author=SynchronizationStoryAuthor(key="gerg", username="peter_peter"),
                title="A Story Created By Peter Peter",
                description="Wow, what a story",
                image="http://photo.com",
                genres=[],
                creation_date=datetime(1999, 11, 26),
                first_scene_key="zargub",
                original_story_key=None,
                publication_date=None,
                scenes=[],
            )
        ],
        story_progresses=[
            SynchronizationStoryProgress(
                key="plouf",
                user_key="me",
                history=["scene-1", "scene-2"],
                current_scene_key="scene-2",
                last_played_at=datetime(2025, 6, 2),
                finished=True,
                story_key="shplouf",
                last_sync_at=datetime(2025, 6, 2),
            )
        ],
    )


FAKE_STORY_PROGRESS = SynchronizationStoryProgress(
    key="key",
    current_scene_key="current-scene-key",
    finished=True,
    history=["scene-1", "scene-2"],
    last_played_at=datetime(1999, 11, 26),
    last_sync_at=datetime(1999, 12, 8),
    story_key="story-key",
    user_key="me",
)


def test_save_progresses_no_progresses() -> None:
    called_count = 0

    class MockSyncRepository(BaseMockSynchronizationRepository):
        def save_story_progresses(self, story_progresses, *, user_key):
            nonlocal called_count
            called_count += 1

    svc = SynchronizationService(repository=MockSyncRepository())
    result = svc.save_progresses([], user_key="me")

    assert result == Result(success=True)
    assert called_count == 0


def test_save_progresses_repository_fail() -> None:
    class MockSyncRepository(BaseMockSynchronizationRepository):
        def save_story_progresses(self, story_progresses, *, user_key):
            return Result(success=False)

    svc = SynchronizationService(repository=MockSyncRepository())
    result = svc.save_progresses(
        [FAKE_STORY_PROGRESS],
        user_key="me",
    )

    assert result == Result(success=False)


def test_save_progresses_wrong_user_key() -> None:
    class MockSyncRepository(BaseMockSynchronizationRepository):
        def save_story_progresses(self, story_progresses, *, user_key):
            raise ValueError("This should not be called")

    svc = SynchronizationService(repository=MockSyncRepository())
    sp = FAKE_STORY_PROGRESS.model_copy()
    sp.user_key = "not-me"

    with pytest.raises(SynchronizationUserKeyNotMatchError):
        svc.save_progresses(
            [sp],
            user_key="me",
        )


def test_save_progresses() -> None:
    class MockSyncRepository(BaseMockSynchronizationRepository):
        def save_story_progresses(self, story_progresses, *, user_key):
            return Result(success=True)

    svc = SynchronizationService(repository=MockSyncRepository())
    result = svc.save_progresses(
        [FAKE_STORY_PROGRESS],
        user_key="me",
    )

    assert result == Result(success=True)


FAKE_STORY = SynchronizationStory(
    author=SynchronizationStoryAuthor(key="author-key", username="username"),
    creation_date=datetime(2025, 6, 2),
    description="description",
    first_scene_key="first-scene-key",
    genres=[StoryGenre.ADVENTURE, StoryGenre.ROMANCE],
    image="http://image.com",
    key="key",
    original_story_key="og-story-key",
    publication_date=datetime(2025, 6, 2),
    scenes=[],
    title="Title",
    type=StoryType.BUILDER,
    user_key="me",
)


def test_save_stories_no_stories() -> None:
    called_count = 0

    class MockSyncRepository(BaseMockSynchronizationRepository):
        def save_stories(self, stories, *, user_key):
            nonlocal called_count
            called_count += 1

    svc = SynchronizationService(repository=MockSyncRepository())
    result = svc.save_stories([], user_key="me")

    assert result == Result(success=True)
    assert called_count == 0


def test_save_stories_repository_fail() -> None:
    class MockSyncRepository(BaseMockSynchronizationRepository):
        def save_stories(self, stories, *, user_key):
            return Result(success=False)

    svc = SynchronizationService(repository=MockSyncRepository())
    result = svc.save_stories(
        [FAKE_STORY],
        user_key="me",
    )

    assert result == Result(success=False)


def test_save_stories_wrong_user_key() -> None:
    class MockSyncRepository(BaseMockSynchronizationRepository):
        def save_stories(self, stories, *, user_key):
            raise ValueError("This should not be called")

    svc = SynchronizationService(repository=MockSyncRepository())
    sp = FAKE_STORY.model_copy()
    sp.user_key = "not-me"

    with pytest.raises(SynchronizationUserKeyNotMatchError):
        svc.save_stories(
            [sp],
            user_key="me",
        )


def test_save_stories() -> None:
    class MockSyncRepository(BaseMockSynchronizationRepository):
        def save_stories(self, stories, *, user_key):
            return Result(success=True)

    svc = SynchronizationService(repository=MockSyncRepository())
    result = svc.save_stories(
        [FAKE_STORY],
        user_key="me",
    )

    assert result == Result(success=True)
