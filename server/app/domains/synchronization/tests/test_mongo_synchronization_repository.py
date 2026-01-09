from datetime import datetime

import pytest
from domains.synchronization.repositories.synchronization_repository import (
    MongoSynchronizationRepository,
)
from domains.synchronization.type_defs import (
    SyncActionTarget,
    SynchronizationBuilderParams,
    SynchronizationBuilderPosition,
    SynchronizationScene,
    SyncSimpleAction,
    SynchronizationStory,
    SynchronizationStoryAuthor,
    SynchronizationStoryProgress,
)
from utils.mongo.base_repository import (
    MongoActionTarget,
    MongoBuilderParams,
    MongoBuilderPosition,
    MongoScene,
    MongoSimpleAction,
    MongoStory,
    MongoStoryAuthor,
    MongoStoryProgress,
    TestMongoRepository,
)
from utils.result import Result
from utils.lexical_content import make_simple_lexical_content
from utils.type_defs import StoryGenre, StoryType
from unittest.mock import ANY


FAKE_STORY_A = SynchronizationStory(
    author=SynchronizationStoryAuthor(key="author-key", username="username"),
    creation_date=datetime(2025, 6, 2),
    description="description",
    first_scene_key="first-scene-key",
    genres=[StoryGenre.ADVENTURE, StoryGenre.ROMANCE],
    image="http://image.com",
    key="key",
    original_story_key="og-story-key",
    publication_date=datetime(2025, 6, 2),
    scenes=[
        SynchronizationScene(
            actions=[
                SyncSimpleAction(
                    type="simple",
                    targets=[SyncActionTarget(scene_key="scene-1", probability=100)],
                    text="Action  Text",
                )
            ],
            builder_params=SynchronizationBuilderParams(
                position=SynchronizationBuilderPosition(x=400.0, y=200.0)
            ),
            content=make_simple_lexical_content("Content"),
            key="scene-1",
            story_key="key",
            title="Scene title",
        )
    ],
    title="Title",
    type=StoryType.BUILDER,
    user_key="me",
)
FAKE_STORY_B = SynchronizationStory(
    author=SynchronizationStoryAuthor(key="me", username="bob_bidou"),
    creation_date=datetime(2024, 5, 1),
    description="another description",
    first_scene_key="another-first-scene-key",
    genres=[],
    image="http://another-image.com",
    key="another-key",
    original_story_key="another-og-story-key",
    publication_date=datetime(2024, 1, 5),
    scenes=[],
    title="Another Title",
    type=StoryType.IMPORTED,
    user_key="me",
)

FAKE_STORY_PROGRESS_A = SynchronizationStoryProgress(
    key="key",
    current_scene_key="current-scene-key",
    finished=True,
    history=["scene-1", "scene-2"],
    last_played_at=datetime(1999, 11, 26),
    last_sync_at=datetime(1999, 12, 8),
    story_key="story-key",
    user_key="me",
)

FAKE_STORY_PROGRESS_B = SynchronizationStoryProgress(
    key="another-key",
    current_scene_key="another-current-scene-key",
    finished=True,
    history=["another-scene-1", "another-scene-2"],
    last_played_at=datetime(1999, 11, 26),
    last_sync_at=datetime(1999, 12, 8),
    story_key="another-story-key",
    user_key="me",
)

test_repo = TestMongoRepository()


@pytest.fixture(autouse=True)
def clear_db() -> None:
    test_repo._client.drop_database(test_repo.db)


def _assert_fake_stories_match(stories: list[MongoStory]) -> None:
    assert len(stories) == 2
    assert stories == [
        MongoStory(
            _id=ANY,
            author=MongoStoryAuthor(key="author-key", username="username"),
            creationDate=datetime(2025, 6, 2),
            description="description",
            firstSceneKey="first-scene-key",
            genres=[StoryGenre.ADVENTURE, StoryGenre.ROMANCE],
            image="http://image.com",
            key="key",
            originalStoryKey="og-story-key",
            publicationDate=datetime(2025, 6, 2),
            scenes=[
                MongoScene(
                    actions=[
                        MongoSimpleAction(
                            type="simple",
                            targets=[
                                MongoActionTarget(sceneKey="scene-1", probability=100)
                            ],
                            text="Action  Text",
                        )
                    ],
                    builderParams=MongoBuilderParams(
                        position=MongoBuilderPosition(x=400, y=200)
                    ),
                    content=make_simple_lexical_content("Content"),
                    key="scene-1",
                    storyKey="key",
                    title="Scene title",
                )
            ],
            title="Title",
            type=StoryType.BUILDER,
            userKey="me",
        ),
        MongoStory(
            _id=ANY,
            author=MongoStoryAuthor(key="me", username="bob_bidou"),
            creationDate=datetime(2024, 5, 1),
            description="another description",
            firstSceneKey="another-first-scene-key",
            genres=[],
            image="http://another-image.com",
            key="another-key",
            originalStoryKey="another-og-story-key",
            publicationDate=datetime(2024, 1, 5),
            scenes=[],
            title="Another Title",
            type=StoryType.IMPORTED,
            userKey="me",
        ),
    ]


def _assert_fake_story_progresses_match(sp: list[MongoStoryProgress]) -> None:
    assert len(sp) == 2
    assert sp == [
        MongoStoryProgress(
            _id=ANY,
            key="key",
            currentSceneKey="current-scene-key",
            finished=True,
            history=["scene-1", "scene-2"],
            lastPlayedAt=datetime(1999, 11, 26),
            lastSyncAt=datetime(1999, 12, 8),
            storyKey="story-key",
            userKey="me",
        ),
        MongoStoryProgress(
            _id=ANY,
            key="another-key",
            currentSceneKey="another-current-scene-key",
            finished=True,
            history=["another-scene-1", "another-scene-2"],
            lastPlayedAt=datetime(1999, 11, 26),
            lastSyncAt=datetime(1999, 12, 8),
            storyKey="another-story-key",
            userKey="me",
        ),
    ]


def test_save_stories_no_existing_stories() -> None:
    repository = MongoSynchronizationRepository()
    result = repository.save_stories(
        [FAKE_STORY_A, FAKE_STORY_B],
        user_key="me",
    )

    stories = test_repo.stories.find({}).to_list()

    assert result == Result(success=True)
    _assert_fake_stories_match(stories)


def test_save_stories_with_existing_stories() -> None:
    test_repo.stories.insert_many(
        [
            MongoStory(
                author=MongoStoryAuthor(key="author-key", username="username"),
                creationDate=datetime(2025, 6, 2),
                description="something-else",
                firstSceneKey="first-scene-key",
                genres=[StoryGenre.ADVENTURE, StoryGenre.ROMANCE],
                image="http://image.com",
                key="key",
                originalStoryKey="that-changed",
                publicationDate=datetime(2025, 6, 2),
                scenes=[
                    MongoScene(
                        actions=[
                            MongoSimpleAction(
                                type="simple",
                                targets=[
                                    MongoActionTarget(
                                        sceneKey="scene-1", probability=100
                                    )
                                ],
                                text="Action  Text",
                            )
                        ],
                        builderParams=MongoBuilderParams(
                            position=MongoBuilderPosition(x=400, y=200)
                        ),
                        content=make_simple_lexical_content("Content"),
                        key="scene-1",
                        storyKey="key",
                        title="Scene title",
                    )
                ],
                title="Title",
                type=StoryType.BUILDER,
                userKey="me",
            ),
            MongoStory(
                author=MongoStoryAuthor(key="me", username="bob_bidou"),
                creationDate=datetime(2024, 5, 1),
                description="some another description",
                firstSceneKey="another-first-scene-key",
                genres=[],
                image="http://another-image.com",
                key="another-key",
                originalStoryKey="another-og-story-key",
                publicationDate=datetime(2024, 1, 5),
                scenes=[],
                title="Another Title",
                type=StoryType.IMPORTED,
                userKey="me",
            ),
        ]
    )

    repository = MongoSynchronizationRepository()
    result = repository.save_stories(
        [FAKE_STORY_A, FAKE_STORY_B],
        user_key="me",
    )

    stories = test_repo.stories.find({}).to_list()

    assert result == Result(success=True)
    _assert_fake_stories_match(stories)


def test_save_stories_some_existing_stories() -> None:
    test_repo.stories.insert_one(
        MongoStory(
            author=MongoStoryAuthor(key="me", username="bob_bidou"),
            creationDate=datetime(2024, 5, 1),
            description="some other description",
            firstSceneKey="some-other-first-scene-key",
            genres=[],
            image="http://another-image.com",
            key="another-key",
            originalStoryKey="another-og-story-key",
            publicationDate=datetime(2024, 1, 5),
            scenes=[],
            title="Another Title",
            type=StoryType.IMPORTED,
            userKey="me",
        )
    )

    repository = MongoSynchronizationRepository()
    result = repository.save_stories(
        [FAKE_STORY_A, FAKE_STORY_B],
        user_key="me",
    )

    stories = test_repo.stories.find({}).to_list()

    assert result == Result(success=True)
    _assert_fake_stories_match(stories)


def test_save_story_progresses_no_existing_stories() -> None:
    repository = MongoSynchronizationRepository()
    result = repository.save_story_progresses(
        [FAKE_STORY_PROGRESS_A, FAKE_STORY_PROGRESS_B],
        user_key="me",
    )

    story_progresses = test_repo.story_progresses.find({}).to_list()

    assert result == Result(success=True)
    _assert_fake_story_progresses_match(story_progresses)


def test_save_story_progresses_with_existing_story_progresses() -> None:
    test_repo.story_progresses.insert_many(
        [
            MongoStoryProgress(
                key="key",
                currentSceneKey="another-current-scene-key",
                finished=True,
                history=["scene-1"],
                lastPlayedAt=datetime(1999, 11, 26),
                lastSyncAt=datetime(1999, 12, 8),
                storyKey="story-key",
                userKey="me",
            ),
            MongoStoryProgress(
                key="another-key",
                currentSceneKey="something-current-scene-key",
                finished=True,
                history=["some-scene-1", "some-scene-2"],
                lastPlayedAt=datetime(1999, 11, 26),
                lastSyncAt=datetime(1999, 12, 8),
                storyKey="some-story-key",
                userKey="me",
            ),
        ]
    )

    repository = MongoSynchronizationRepository()
    result = repository.save_story_progresses(
        [FAKE_STORY_PROGRESS_A, FAKE_STORY_PROGRESS_B],
        user_key="me",
    )

    story_progresses = test_repo.story_progresses.find({}).to_list()

    assert result == Result(success=True)
    _assert_fake_story_progresses_match(story_progresses)


def test_save_story_progresses_some_existing_story_progresses() -> None:
    test_repo.story_progresses.insert_one(
        MongoStoryProgress(
            key="key",
            currentSceneKey="some-current-scene-key",
            finished=True,
            history=["some-scene-1", "some-scene-2"],
            lastPlayedAt=datetime(1999, 11, 26),
            lastSyncAt=datetime(1999, 12, 8),
            storyKey="story-key",
            userKey="me",
        ),
    )

    repository = MongoSynchronizationRepository()
    result = repository.save_story_progresses(
        [FAKE_STORY_PROGRESS_A, FAKE_STORY_PROGRESS_B],
        user_key="me",
    )

    story_progresses = test_repo.story_progresses.find({}).to_list()

    assert result == Result(success=True)
    _assert_fake_story_progresses_match(story_progresses)


def test_get_stories_no_stories() -> None:
    repository = MongoSynchronizationRepository()

    assert repository.get_stories("me") == []


def test_get_stories_no_stories_linked() -> None:
    test_repo.stories.insert_one(
        MongoStory(
            author=MongoStoryAuthor(key="me", username="bob_bidou"),
            creationDate=datetime(2024, 5, 1),
            description="some another description",
            firstSceneKey="another-first-scene-key",
            genres=[],
            image="http://another-image.com",
            key="another-key",
            originalStoryKey="another-og-story-key",
            publicationDate=datetime(2024, 1, 5),
            scenes=[],
            title="Another Title",
            type=StoryType.IMPORTED,
            userKey="not-me",
        )
    )
    repository = MongoSynchronizationRepository()

    assert repository.get_stories("me") == []


def test_get_stories() -> None:
    test_repo.stories.insert_many(
        [
            MongoStory(
                author=MongoStoryAuthor(key="author-key", username="username"),
                creationDate=datetime(2025, 6, 2),
                description="something-else",
                firstSceneKey="first-scene-key",
                genres=[StoryGenre.ADVENTURE, StoryGenre.ROMANCE],
                image="http://image.com",
                key="key",
                originalStoryKey="that-changed",
                publicationDate=datetime(2025, 6, 2),
                scenes=[
                    MongoScene(
                        actions=[
                            MongoSimpleAction(
                                type="simple",
                                targets=[
                                    MongoActionTarget(
                                        sceneKey="scene-1", probability=100
                                    )
                                ],
                                text="Action  Text",
                            )
                        ],
                        builderParams=MongoBuilderParams(
                            position=MongoBuilderPosition(x=400, y=200)
                        ),
                        content=make_simple_lexical_content("Content"),
                        key="scene-1",
                        storyKey="key",
                        title="Scene title",
                    )
                ],
                title="Title",
                type=StoryType.BUILDER,
                userKey="me",
            ),
            MongoStory(
                author=MongoStoryAuthor(key="me", username="bob_bidou"),
                creationDate=datetime(2024, 5, 1),
                description="some another description",
                firstSceneKey="another-first-scene-key",
                genres=[],
                image="http://another-image.com",
                key="another-key",
                originalStoryKey="another-og-story-key",
                publicationDate=datetime(2024, 1, 5),
                scenes=[],
                title="Another Title",
                type=StoryType.IMPORTED,
                userKey="not-me",
            ),
        ],
    )
    repository = MongoSynchronizationRepository()

    assert repository.get_stories("me") == [
        SynchronizationStory(
            author=SynchronizationStoryAuthor(key="author-key", username="username"),
            creation_date=datetime(2025, 6, 2),
            description="something-else",
            first_scene_key="first-scene-key",
            genres=[StoryGenre.ADVENTURE, StoryGenre.ROMANCE],
            image="http://image.com",
            key="key",
            original_story_key="that-changed",
            publication_date=datetime(2025, 6, 2),
            scenes=[
                SynchronizationScene(
                    actions=[
                        SyncSimpleAction(
                            type="simple",
                            targets=[
                                SyncActionTarget(scene_key="scene-1", probability=100)
                            ],
                            text="Action  Text",
                        )
                    ],
                    builder_params=SynchronizationBuilderParams(
                        position=SynchronizationBuilderPosition(x=400, y=200)
                    ),
                    content=make_simple_lexical_content("Content"),
                    key="scene-1",
                    story_key="key",
                    title="Scene title",
                )
            ],
            title="Title",
            type=StoryType.BUILDER,
            user_key="me",
        )
    ]


def test_get_sp_no_sp() -> None:
    repository = MongoSynchronizationRepository()

    assert repository.get_story_progresses("me") == []


def test_get_sp_no_sp_linked() -> None:
    test_repo.story_progresses.insert_one(
        MongoStoryProgress(
            key="key",
            currentSceneKey="another-current-scene-key",
            finished=True,
            history=["scene-1"],
            lastPlayedAt=datetime(1999, 11, 26),
            lastSyncAt=datetime(1999, 12, 8),
            storyKey="story-key",
            userKey="me",
        ),
    )
    repository = MongoSynchronizationRepository()

    assert repository.get_stories("me") == []


def test_get_sp() -> None:
    test_repo.story_progresses.insert_many(
        [
            MongoStoryProgress(
                key="key",
                currentSceneKey="another-current-scene-key",
                finished=True,
                history=["scene-1"],
                lastPlayedAt=datetime(1999, 11, 26),
                lastSyncAt=datetime(1999, 12, 8),
                storyKey="story-key",
                userKey="me",
            ),
            MongoStoryProgress(
                key="another-key",
                currentSceneKey="something-current-scene-key",
                finished=True,
                history=["some-scene-1", "some-scene-2"],
                lastPlayedAt=datetime(1999, 11, 26),
                lastSyncAt=datetime(1999, 12, 8),
                storyKey="some-story-key",
                userKey="not-me",
            ),
        ]
    )

    repository = MongoSynchronizationRepository()

    assert repository.get_story_progresses("me") == [
        SynchronizationStoryProgress(
            key="key",
            current_scene_key="another-current-scene-key",
            finished=True,
            history=["scene-1"],
            last_played_at=datetime(1999, 11, 26),
            last_sync_at=datetime(1999, 12, 8),
            story_key="story-key",
            user_key="me",
        )
    ]
