from datetime import datetime
from http import HTTPStatus

from utils.mongo.base_repository import (
    MongoBuilderParams,
    MongoBuilderPosition,
    MongoScene,
    MongoSceneAction,
    MongoStory,
    MongoStoryAuthor,
    MongoStoryProgress,
)
from utils.type_defs import StoryGenre, StoryType

URL = "/api/load"


def test_forbidden(api_test_infra_no_token) -> None:
    response = api_test_infra_no_token.client.get(URL)

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json() == {"detail": "Invalid token"}


def test_load(api_test_infra_authenticated) -> None:
    client, repo, auth_user = api_test_infra_authenticated
    repo.stories.insert_many(
        [
            MongoStory(
                title="A Builder Story created by me",
                description="description",
                author=MongoStoryAuthor(key="me", username="bob_bidou"),
                creationDate=datetime(2025, 6, 2),
                firstSceneKey="first-scene-key",
                genres=[StoryGenre.ADVENTURE, StoryGenre.ROMANCE],
                image="http://image.com",
                key="key",
                publicationDate=datetime(2025, 6, 2),
                originalStoryKey=None,
                scenes=[
                    MongoScene(
                        actions=[
                            MongoSceneAction(sceneKey="scene-1", text="Action  Text")
                        ],
                        builderParams=MongoBuilderParams(
                            position=MongoBuilderPosition(x=400.0, y=200.0)
                        ),
                        content="Content",
                        key="scene-1",
                        storyKey="key",
                        title="Scene title",
                    )
                ],
                type=StoryType.BUILDER,
                userKey="me",
            ),
            MongoStory(
                title="A library Story I didn't create",
                author=MongoStoryAuthor(key="not-me", username="peter-peter"),
                creationDate=datetime(2024, 5, 1),
                description="some another description",
                firstSceneKey="another-first-scene-key",
                genres=[],
                image="http://another-image.com",
                key="another-key",
                originalStoryKey="another-og-story-key",
                publicationDate=datetime(2024, 1, 5),
                scenes=[],
                type=StoryType.IMPORTED,
                userKey="me",
            ),
            MongoStory(
                title="Someone else's library story",
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
                type=StoryType.IMPORTED,
                userKey="not-me",
            ),
        ]
    )

    repo.story_progresses.insert_many(
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

    response = client.get(URL)

    assert response.status_code == 200
    assert response.json() == {
        "playerGames": [
            {
                "title": "A library Story I didn't create",
                "author": {"key": "not-me", "username": "peter-peter"},
                "creationDate": datetime(2024, 5, 1).isoformat(),
                "description": "some another description",
                "firstSceneKey": "another-first-scene-key",
                "genres": [],
                "image": "http://another-image.com",
                "key": "another-key",
                "originalStoryKey": "another-og-story-key",
                "publicationDate": datetime(2024, 1, 5).isoformat(),
                "scenes": [],
                "type": "imported",
                "userKey": "me",
            }
        ],
        "builderStories": [
            {
                "title": "A Builder Story created by me",
                "description": "description",
                "author": {"key": "me", "username": "bob_bidou"},
                "creationDate": datetime(2025, 6, 2).isoformat(),
                "firstSceneKey": "first-scene-key",
                "genres": ["adventure", "romance"],
                "image": "http://image.com",
                "key": "key",
                "originalStoryKey": None,
                "publicationDate": datetime(2025, 6, 2).isoformat(),
                "scenes": [
                    {
                        "actions": [{"sceneKey": "scene-1", "text": "Action  Text"}],
                        "builderParams": {"position": {"x": 400.0, "y": 200.0}},
                        "content": "Content",
                        "key": "scene-1",
                        "storyKey": "key",
                        "title": "Scene title",
                    }
                ],
                "type": "builder",
                "userKey": "me",
            }
        ],
        "storyProgresses": [
            {
                "key": "key",
                "currentSceneKey": "another-current-scene-key",
                "finished": True,
                "history": ["scene-1"],
                "lastPlayedAt": datetime(1999, 11, 26).isoformat(),
                "lastSyncAt": datetime(1999, 12, 8).isoformat(),
                "storyKey": "story-key",
                "userKey": "me",
            }
        ],
    }
