from datetime import datetime
from http import HTTPStatus
from unittest.mock import ANY

from utils.mongo.base_repository import (
    MongoBuilderParams,
    MongoBuilderPosition,
    MongoScene,
    MongoSceneAction,
    MongoStory,
    MongoStoryAuthor,
)


URL = "/api/save/builder"


def test_forbidden(api_test_infra_no_token) -> None:
    response = api_test_infra_no_token.client.put(URL)

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json() == {"detail": "Invalid token"}


def test_no_rights_wrong_user_key(api_test_infra_authenticated) -> None:
    client, auth_user, repo = api_test_infra_authenticated

    response = client.put(
        URL,
        json={
            "stories": [
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
                    "type": "builder",
                    "userKey": "not-me",
                }
            ],
            "scenes": [],
        },
    )

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json() == {"detail": "Unauthorized"}


def test_no_rights_is_not_author(api_test_infra_authenticated) -> None:
    client, auth_user, repo = api_test_infra_authenticated

    response = client.put(
        URL,
        json={
            "stories": [
                {
                    "title": "A Builder Story not created by me",
                    "description": "description",
                    "author": {"key": "not-me", "username": "peter-peter"},
                    "creationDate": datetime(2025, 6, 2).isoformat(),
                    "firstSceneKey": "first-scene-key",
                    "genres": ["adventure", "romance"],
                    "image": "http://image.com",
                    "key": "key",
                    "originalStoryKey": None,
                    "publicationDate": datetime(2025, 6, 2).isoformat(),
                    "type": "builder",
                    "userKey": "me",
                }
            ],
            "scenes": [],
        },
    )

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json() == {"detail": "Unauthorized"}


def test_empty_body(api_test_infra_authenticated) -> None:
    client, auth_user, repo = api_test_infra_authenticated

    response = client.put(
        URL,
        json={},
    )

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


def test_save_builder_state(api_test_infra_authenticated) -> None:
    client, repo, auth_user = api_test_infra_authenticated

    response = client.put(
        URL,
        json={
            "stories": [
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
                    "type": "builder",
                    "userKey": "me",
                }
            ],
            "scenes": [
                {
                    "actions": [{"sceneKey": "scene-1", "text": "Action Text"}],
                    "builderParams": {"position": {"x": 400.0, "y": 200.0}},
                    "content": "Content",
                    "key": "scene-1",
                    "storyKey": "key",
                    "title": "Scene title",
                },
                {
                    "actions": [{"sceneKey": "scene-1", "text": "Action Text"}],
                    "builderParams": {"position": {"x": 400.0, "y": 200.0}},
                    "content": "Not in the story",
                    "key": "scene-2",
                    "storyKey": "wrong-key",
                    "title": "Not in the story",
                },
            ],
        },
    )

    stories_in_db = repo.stories.find({}).to_list()

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {"success": True, "message": None}
    assert len(stories_in_db) == 1
    assert stories_in_db == [
        MongoStory(
            _id=ANY,
            title="A Builder Story created by me",
            description="description",
            author=MongoStoryAuthor(key="me", username="bob_bidou"),
            creationDate=datetime(2025, 6, 2),
            firstSceneKey="first-scene-key",
            genres=["adventure", "romance"],
            image="http://image.com",
            key="key",
            originalStoryKey=None,
            publicationDate=datetime(2025, 6, 2),
            type="builder",
            userKey="me",
            scenes=[
                MongoScene(
                    actions=[MongoSceneAction(sceneKey="scene-1", text="Action Text")],
                    builderParams=MongoBuilderParams(
                        position=MongoBuilderPosition(x=400.0, y=200.0)
                    ),
                    content="Content",
                    key="scene-1",
                    storyKey="key",
                    title="Scene title",
                ),
            ],
        )
    ]
