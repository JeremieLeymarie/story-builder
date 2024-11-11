from http import HTTPStatus
from typing import Annotated
from fastapi import Depends, FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from domains.type_def import FullUser, StoryProgress, User
from domains.auth_service import AuthService
from domains.synchronization_service import SynchronizationService
from repositories.story_repository import StoryRepository
from repositories.user_repository import UserRepository
from repositories.story_progress_repository import StoryProgressRepository
from request_types import (
    APIResponse,
    CreateUserRequest,
    FullStoriesRequest,
    LoginUserRequest,
    SynchronizationPayload,
)
from utils.errors import BadAuthException
from utils.error_adapter import raise_http_error


def custom_generate_unique_id(route: APIRoute):
    return f"API-{route.name}"


async def check_auth(authorization: Annotated[str, Header()]):
    if not authorization:
        raise_http_error(BadAuthException("No authorization token"))
    try:
        token = authorization.split(" ")[1]
    except Exception:
        raise_http_error(BadAuthException("Invalid authorization bearer format"))

    try:
        AuthService(user_repository=UserRepository()).check_auth(token)
    except BadAuthException as err:
        raise_http_error(err)


app = FastAPI(
    generate_unique_id_function=custom_generate_unique_id,
    dependencies=[Depends(check_auth)],
)


origins = [
    "http://0.0.0.0:5173",
    "http://localhost:5173",
    "http://0.0.0.0:4173",  # For docker in preview mode
    "http://localhost:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# USER ENDPOINTS


@app.post("/api/user/login", status_code=HTTPStatus.OK, response_model=User)
async def user_login(data: LoginUserRequest):
    try:
        result = AuthService(user_repository=UserRepository()).login(
            password=data.password, username_or_email=data.usernameOrEmail
        )
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.post("/api/user/register", status_code=HTTPStatus.CREATED, response_model=User)
async def create_user(data: CreateUserRequest):
    try:
        result = AuthService(user_repository=UserRepository()).create(
            FullUser(
                email=data.email,
                username=data.username,
                password=data.password,
                key=data.key,
            )
        )
        return result
    except Exception as err:
        raise raise_http_error(err)


# SYNCHRONIZATION ENDPOINTS


@app.get(
    "/api/load/{user_key}",
    status_code=HTTPStatus.OK,
    response_model=SynchronizationPayload,
)
async def get_synchronization_data(user_key: str):
    try:
        synchronization_data = SynchronizationService(
            story_progress_repository=StoryProgressRepository(),
            story_repository=StoryRepository(),
        ).get_synchronization_data(user_key)
        return synchronization_data
    except Exception as err:
        raise raise_http_error(err)


@app.put("/api/save/progresses", status_code=HTTPStatus.OK, response_model=APIResponse)
async def synchronize_progresses(payload: list[StoryProgress]):
    try:
        SynchronizationService(
            story_progress_repository=StoryProgressRepository(),
            story_repository=StoryRepository(),
        ).save_progresses(payload)
        return {"success": True}
    except Exception as err:
        raise raise_http_error(err)


@app.put("/api/save/builder", status_code=HTTPStatus.OK, response_model=APIResponse)
async def save_builder_state(body: FullStoriesRequest):
    try:
        SynchronizationService(
            story_repository=StoryRepository(),
            story_progress_repository=StoryProgressRepository(),
        ).save_builder_stories(body.stories, body.scenes)
        return {"success": True}
    except Exception as err:
        raise raise_http_error(err)
