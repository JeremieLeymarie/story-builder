from datetime import datetime
from http import HTTPStatus
from unittest.mock import ANY

from utils.mongo.base_repository import MongoStoryProgress


URL = "/api/save/progresses"


def test_unauthorized(api_test_infra_no_token) -> None:
    response = api_test_infra_no_token.client.put(URL)

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json() == {"detail": "Invalid token"}


def test_wrong_user_key(api_test_infra_authenticated) -> None:
    client, _repo, _auth_user = api_test_infra_authenticated

    response = client.put(
        URL,
        json=[
            {
                "key": "key",
                "currentSceneKey": "another-current-scene-key",
                "createdAt": datetime(1999, 11, 1).isoformat(),
                "finished": True,
                "history": ["scene-1"],
                "lastPlayedAt": datetime(1999, 11, 26).isoformat(),
                "totalPlayTimeMs": 0,
                "lastSyncAt": datetime(1999, 12, 8).isoformat(),
                "storyKey": "story-key",
                "userKey": "me",
            },
            {
                "key": "another-key",
                "currentSceneKey": "something-current-scene-key",
                "createdAt": datetime(1999, 11, 2).isoformat(),
                "finished": True,
                "history": ["some-scene-1", "some-scene-2"],
                "lastPlayedAt": datetime(1999, 11, 26).isoformat(),
                "totalPlayTimeMs": 0,
                "lastSyncAt": datetime(1999, 12, 8).isoformat(),
                "storyKey": "some-story-key",
                "userKey": "not-me",
            },
        ],
    )

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json() == {"detail": "Unauthorized"}


def test_save_progresses(api_test_infra_authenticated) -> None:
    client, repo, _auth_user = api_test_infra_authenticated

    response = client.put(
        URL,
        json=[
            {
                "key": "key",
                "currentSceneKey": "another-current-scene-key",
                "createdAt": datetime(1999, 11, 1).isoformat(),
                "finished": True,
                "history": ["scene-1"],
                "lastPlayedAt": datetime(1999, 11, 26).isoformat(),
                "totalPlayTimeMs": 0,
                "lastSyncAt": datetime(1999, 12, 8).isoformat(),
                "storyKey": "story-key",
                "userKey": "me",
                "totalPlayTimeMs" : 1_000,
            },
            {
                "key": "another-key",
                "currentSceneKey": "something-current-scene-key",
                "createdAt": datetime(1999, 11, 2).isoformat(),
                "finished": True,
                "history": ["some-scene-1", "some-scene-2"],
                "lastPlayedAt": datetime(1999, 11, 26).isoformat(),
                "totalPlayTimeMs": 0,
                "lastSyncAt": datetime(1999, 12, 8).isoformat(),
                "storyKey": "some-story-key",
                "userKey": "me",
            },
        ],
    )

    sp_in_db = repo.story_progresses.find({}).to_list()

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {"success": True, "message": None}
    assert sp_in_db == [
        MongoStoryProgress(
            _id=ANY,
            key="key",
            currentSceneKey="another-current-scene-key",
            createdAt=datetime(1999, 11, 1),
            finished=True,
            history=["scene-1"],
            lastPlayedAt=datetime(1999, 11, 26),
            totalPlayTimeMs=0,
            lastSyncAt=datetime(1999, 12, 8),
            storyKey="story-key",
            userKey="me",
            totalPlayTimeMs=1_000
        ),
        MongoStoryProgress(
            _id=ANY,
            key="another-key",
            currentSceneKey="something-current-scene-key",
            createdAt=datetime(1999, 11, 2),
            finished=True,
            history=["some-scene-1", "some-scene-2"],
            lastPlayedAt=datetime(1999, 11, 26),
            totalPlayTimeMs=0,
            lastSyncAt=datetime(1999, 12, 8),
            storyKey="some-story-key",
            userKey="me",
            totalPlayTimeMs=0
        ),
    ]
