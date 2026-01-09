from datetime import datetime
from http import HTTPStatus
from unittest.mock import ANY

from utils.lexical_content import make_simple_lexical_content
from utils.mongo.base_repository import (
    MongoActionTarget,
    MongoBuilderParams,
    MongoBuilderPosition,
    MongoScene,
    MongoStory,
    MongoStoryAuthor,
    MongoSimpleAction,
)


URL = "/api/save/stories"


def test_unauthorized(api_test_infra_no_auth) -> None:
    response = api_test_infra_no_auth.client.put(URL)

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json() == {"detail": "Invalid token"}


def test_no_rights_wrong_user_key(api_test_infra_authenticated) -> None:
    client, *_ = api_test_infra_authenticated

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
                },
                {
                    "title": "A Story in my library",
                    "description": "description",
                    "author": {"key": "not-me", "username": "peter-peter"},
                    "creationDate": datetime(2025, 6, 2).isoformat(),
                    "firstSceneKey": "first-scene-key",
                    "genres": ["adventure", "romance"],
                    "image": "http://image.com",
                    "key": "key",
                    "originalStoryKey": "zgghorub",
                    "publicationDate": datetime(2025, 6, 2).isoformat(),
                    "type": "imported",
                    "userKey": "me",
                },
            ],
            "scenes": [],
        },
    )

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json() == {"detail": "Unauthorized"}


def test_no_rights_is_not_author(api_test_infra_authenticated) -> None:
    client, *_ = api_test_infra_authenticated

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
                },
                {
                    "title": "A Story in my library",
                    "description": "description",
                    "author": {"key": "not-me", "username": "peter-peter"},
                    "creationDate": datetime(2025, 6, 2).isoformat(),
                    "firstSceneKey": "first-scene-key",
                    "genres": ["adventure", "romance"],
                    "image": "http://image.com",
                    "key": "key",
                    "originalStoryKey": "zgghorub",
                    "publicationDate": datetime(2025, 6, 2).isoformat(),
                    "type": "imported",
                    "userKey": "me",
                },
            ],
            "scenes": [],
        },
    )

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json() == {"detail": "Unauthorized"}


def test_empty_body(api_test_infra_authenticated) -> None:
    client, repo, auth_user = api_test_infra_authenticated

    response = client.put(
        URL,
        json={},
    )

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


def test_save_builder_state(api_test_infra_authenticated) -> None:
    client, repo, _ = api_test_infra_authenticated

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
                    "key": "builder-key",
                    "originalStoryKey": None,
                    "publicationDate": datetime(2025, 6, 2).isoformat(),
                    "type": "builder",
                    "userKey": "me",
                },
                {
                    "title": "A Story in my library",
                    "description": "description",
                    "author": {"key": "not-me", "username": "peter-peter"},
                    "creationDate": datetime(2025, 6, 2).isoformat(),
                    "firstSceneKey": "first-scene-key",
                    "genres": ["adventure", "romance"],
                    "image": "http://image.com",
                    "key": "imported-key",
                    "originalStoryKey": "zgghorub",
                    "publicationDate": datetime(2025, 6, 2).isoformat(),
                    "type": "imported",
                    "userKey": "me",
                },
            ],
            "scenes": [
                {
                    "actions": [
                        {
                            "targets": [{"sceneKey": "scene-1", "probability": 100}],
                            "text": "Action Text",
                            "type": "simple",
                        }
                    ],
                    "builderParams": {"position": {"x": 400.0, "y": 200.0}},
                    "content": make_simple_lexical_content("Content"),
                    "key": "scene-1",
                    "storyKey": "builder-key",
                    "title": "Scene title",
                },
                {
                    "actions": [
                        {
                            "targets": [{"sceneKey": "scene-1", "probability": 100}],
                            "text": "Action Text",
                            "type": "simple",
                        }
                    ],
                    "builderParams": {"position": {"x": 400.0, "y": 200.0}},
                    "content": make_simple_lexical_content("Content"),
                    "key": "scene-1",
                    "storyKey": "imported-key",
                    "title": "Scene title",
                },
                {
                    "actions": [
                        {
                            "targets": [{"sceneKey": "scene-1", "probability": 100}],
                            "text": "Action Text",
                            "type": "simple",
                        }
                    ],
                    "builderParams": {"position": {"x": 400.0, "y": 200.0}},
                    "content": make_simple_lexical_content("Not in the story"),
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
    assert len(stories_in_db) == 2
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
            key="builder-key",
            originalStoryKey=None,
            publicationDate=datetime(2025, 6, 2),
            type="builder",
            userKey="me",
            scenes=[
                MongoScene(
                    actions=[
                        MongoSimpleAction(
                            type="simple",
                            targets=[
                                MongoActionTarget(sceneKey="scene-1", probability=100)
                            ],
                            text="Action Text",
                        )
                    ],
                    builderParams=MongoBuilderParams(
                        position=MongoBuilderPosition(x=400.0, y=200.0)
                    ),
                    content=make_simple_lexical_content("Content"),
                    key="scene-1",
                    storyKey="builder-key",
                    title="Scene title",
                ),
            ],
        ),
        MongoStory(
            _id=ANY,
            title="A Story in my library",
            description="description",
            author=MongoStoryAuthor(key="not-me", username="peter-peter"),
            creationDate=datetime(2025, 6, 2),
            firstSceneKey="first-scene-key",
            genres=["adventure", "romance"],
            image="http://image.com",
            key="imported-key",
            originalStoryKey="zgghorub",
            publicationDate=datetime(2025, 6, 2),
            type="imported",
            userKey="me",
            scenes=[
                MongoScene(
                    actions=[
                        MongoSimpleAction(
                            type="simple",
                            targets=[
                                MongoActionTarget(sceneKey="scene-1", probability=100)
                            ],
                            text="Action Text",
                        )
                    ],
                    builderParams=MongoBuilderParams(
                        position=MongoBuilderPosition(x=400.0, y=200.0)
                    ),
                    content=make_simple_lexical_content("Content"),
                    key="scene-1",
                    storyKey="imported-key",
                    title="Scene title",
                ),
            ],
        ),
    ]
