from datetime import datetime

import pytest
from domains.synchronization.repositories.synchronization_repository import (
    MongoSynchronizationRepository,
)
from domains.synchronization.type_defs import (
    SynchronizationBuilderParams,
    SynchronizationBuilderPosition,
    SynchronizationScene,
    SynchronizationSceneAction,
    SynchronizationStory,
    SynchronizationStoryAuthor,
)
from utils.mongo.base_repository import (
    MongoBuilderParams,
    MongoBuilderPosition,
    MongoScene,
    MongoSceneAction,
    MongoStory,
    MongoStoryAuthor,
    TestMongoRepository,
)
from utils.result import Result
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
                SynchronizationSceneAction(scene_key="scene-1", text="Action  Text")
            ],
            builder_params=SynchronizationBuilderParams(
                position=SynchronizationBuilderPosition(x=400.0, y=200.0)
            ),
            content="Content",
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
                    actions=[MongoSceneAction(sceneKey="scene-1", text="Action  Text")],
                    builderParams=MongoBuilderParams(
                        position=MongoBuilderPosition(x=400, y=200)
                    ),
                    content="Content",
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
                            MongoSceneAction(sceneKey="scene-1", text="Action  Text")
                        ],
                        builderParams=MongoBuilderParams(
                            position=MongoBuilderPosition(x=400, y=200)
                        ),
                        content="Content",
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
