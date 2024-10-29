from http import HTTPStatus
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from domains.type_def import FullStory, FullUser, Story, StoryProgress, User
from domains.user_service import UserService
from domains.store_service import StoreService
from domains.synchronization_service import SynchronizationService
from repositories.story_repository import StoryRepository
from repositories.user_repository import UserRepository
from repositories.story_progress_repository import StoryProgressRepository
from request_types import (
    APIResponse,
    CreateUserRequest,
    FullStoriesRequest,
    FullStoryBuilderRequest,
    LoginUserRequest,
    SynchronizationPayload,
)
from utils.error_adapter import raise_http_error


def custom_generate_unique_id(route: APIRoute):
    return f"API-{route.name}"


app = FastAPI(generate_unique_id_function=custom_generate_unique_id)

origins = [
    "http://localhost:5173",
    "http://0.0.0.0:4173",  # For docker in preview mode
    "http://localhost:4173",  # For docker in preview mode
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
        result = UserService(user_repository=UserRepository()).authentify(
            password=data.password, username_or_email=data.usernameOrEmail
        )
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.post("/api/user/register", status_code=HTTPStatus.CREATED, response_model=User)
async def create_user(data: CreateUserRequest):
    try:
        result = UserService(user_repository=UserRepository()).create(
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


# STORE ENDPOINTS


@app.get(
    "/api/store/load",
    status_code=HTTPStatus.OK,
    response_model=list[Story],
    responses={},
)
async def get_store_items():
    try:
        result = StoreService(story_repository=StoryRepository()).load()
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.get(
    "/api/store/download/{key}", status_code=HTTPStatus.OK, response_model=FullStory
)
async def download_from_store(key: str):
    try:
        result = StoreService(story_repository=StoryRepository()).download(key=key)
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.put("/api/store/publish", status_code=HTTPStatus.OK, response_model=FullStory)
async def publish_in_store(body: FullStoryBuilderRequest):
    try:
        story = StoreService(story_repository=StoryRepository()).publish(
            story=body.story, scenes=body.scenes
        )
        return story
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
