from datetime import datetime
from typing import Iterable
from domains.synchronization.repositories.port import SynchronizationRepositoryPort
from domains.synchronization.service import SynchronizationData, SynchronizationService
from domains.synchronization.type_defs import (
    SynchronizationStory,
    SynchronizationStoryAuthor,
    SynchronizationStoryProgress,
)
from utils.result import Result
from utils.type_defs import StoryGenre, StoryType


class TestSynchronizationService:

    def _get_mock_sync_repository(
        self,
        mock_stories: Iterable[SynchronizationStory] = [],
        mock_story_progresses: Iterable[SynchronizationStoryProgress] = [],
    ) -> SynchronizationRepositoryPort:
        class MockSynchronizationRepository(SynchronizationRepositoryPort):
            def get_stories(self, user_key: str) -> Iterable[SynchronizationStory]:
                return mock_stories

            def get_story_progresses(
                self, user_key: str
            ) -> Iterable[SynchronizationStoryProgress]:
                return mock_story_progresses

            def save_story_progresses(
                self,
                story_progresses: Iterable[SynchronizationStoryProgress],
                *,
                user_key: str,
            ) -> Result:
                return Result(success=True)

            def save_stories(
                self, stories: Iterable[SynchronizationStory], *, user_key: str
            ) -> Result:
                return Result(success=True)

        return MockSynchronizationRepository()

    def test_get_synchronization_data(self) -> None:
        svc = SynchronizationService(
            repository=self._get_mock_sync_repository(
                mock_stories=[
                    SynchronizationStory(
                        key="zgloub",
                        user_key="me",
                        type=StoryType.BUILDER,
                        author=SynchronizationStoryAuthor(
                            key="me", username="bob_bidou"
                        ),
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
                ],
                mock_story_progresses=[
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
        )

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
