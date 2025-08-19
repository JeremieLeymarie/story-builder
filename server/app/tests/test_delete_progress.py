from http import HTTPStatus
from datetime import datetime

from utils.mongo.base_repository import MongoStoryProgress


URL = "/api/progress"


def test_delete_progress_unauthorized(api_test_infra_no_auth) -> None:
    response = api_test_infra_no_auth.client.delete(f"{URL}/some-key")

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json() == {"detail": "Invalid token"}


def test_delete_progress_success(api_test_infra_authenticated) -> None:
    client, repo, auth_user = api_test_infra_authenticated
    
    # Create a progress to delete
    progress_key = "test-progress-key"
    test_progress = MongoStoryProgress(
        key=progress_key,
        currentSceneKey="current-scene-key",
        finished=False,
        history=["scene-1", "scene-2"],
        lastPlayedAt=datetime(2023, 1, 1),
        lastSyncAt=datetime(2023, 1, 1),
        storyKey="story-key",
        userKey=auth_user.key,
    )
    
    # Insert the progress into the database
    repo.story_progresses.insert_one(test_progress)
    
    # Verify it exists
    assert repo.story_progresses.find_one({"key": progress_key}) is not None
    
    # Delete the progress
    response = client.delete(f"{URL}/{progress_key}")
    
    assert response.status_code == HTTPStatus.OK
    assert response.json()["success"] is True
    
    # Verify it's been deleted
    assert repo.story_progresses.find_one({"key": progress_key}) is None


def test_delete_progress_not_found(api_test_infra_authenticated) -> None:
    client, repo, auth_user = api_test_infra_authenticated
    
    # Try to delete a non-existent progress
    response = client.delete(f"{URL}/non-existent-key")
    
    assert response.status_code == HTTPStatus.OK
    assert response.json()["success"] is False


def test_delete_progress_wrong_user(api_test_infra_authenticated) -> None:
    client, repo, auth_user = api_test_infra_authenticated
    
    # Create a progress owned by a different user
    progress_key = "other-user-progress-key"
    test_progress = MongoStoryProgress(
        key=progress_key,
        currentSceneKey="current-scene-key",
        finished=False,
        history=["scene-1", "scene-2"],
        lastPlayedAt=datetime(2023, 1, 1),
        lastSyncAt=datetime(2023, 1, 1),
        storyKey="story-key",
        userKey="other-user-key",  # Different user
    )
    
    # Insert the progress into the database
    repo.story_progresses.insert_one(test_progress)
    
    # Verify it exists
    assert repo.story_progresses.find_one({"key": progress_key}) is not None
    
    # Try to delete it as the authenticated user
    response = client.delete(f"{URL}/{progress_key}")
    
    assert response.status_code == HTTPStatus.OK
    assert response.json()["success"] is False  # Should fail because user doesn't own it
    
    # Verify it still exists (wasn't deleted)
    assert repo.story_progresses.find_one({"key": progress_key}) is not None