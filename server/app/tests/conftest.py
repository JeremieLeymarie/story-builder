from typing import NamedTuple

from fastapi.testclient import TestClient
import pytest
from domains.auth.auth_service import AuthService
from domains.auth.repositories.user_repository import UserRepository
from domains.auth.type_defs import FullUser
from main import app

from utils.mongo.base_repository import TestMongoRepository


class ApiTestInfra(NamedTuple):
    client: TestClient
    repo: TestMongoRepository
    auth_user: FullUser | None


@pytest.fixture(scope="module", autouse=True)
def reset_db() -> None:
    test_repo = TestMongoRepository()
    test_repo._client.drop_database(test_repo.db)


@pytest.fixture(scope="module")
def api_test_infra_no_auth() -> ApiTestInfra:
    client = TestClient(app)
    client.headers["Authorization"] = "Bearer toktok"

    return ApiTestInfra(client=client, repo=TestMongoRepository(), auth_user=None)


@pytest.fixture(scope="module")
def api_test_infra_authenticated() -> ApiTestInfra:
    user_repo = UserRepository()
    user = user_repo.save(
        FullUser(
            key="me", email="me@mail.com", username="mememe", password="mypassword"
        )
    )
    auth_svc = AuthService(user_repo)
    client = TestClient(app)
    client.headers["Authorization"] = f"Bearer {auth_svc._generate_token(user)}"

    return ApiTestInfra(client=client, repo=TestMongoRepository(), auth_user=user)
