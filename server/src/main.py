from http import HTTPStatus
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from data_types.requests import (
    CreateUserRequest,
    LoginUserRequest,
    FullStoryBuilderRequest,
)
from domains.user_domain import UserDomain
from domains.builder_domain import BuilderDomain
from domains.store_domain import StoreDomain
from repositories.story_repository import StoryRepository
from repositories.user_repository import UserRepository
from domains.synchronization_domain import SynchronizationDomain
from data_types.user import FullUser, User
from repositories.story_progress_repository import StoryProgressRepository
from data_types.game import StoryProgress
from data_types.response import APIResponse
from data_types.synchronization import SynchronizationPayload
from data_types.builder import FullStory, Story
from utils.error_adapter import raise_http_error


def custom_generate_unique_id(route: APIRoute):
    return f"API-{route.name}"


app = FastAPI(generate_unique_id_function=custom_generate_unique_id)

origins = [
    "http://localhost:5173",
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
        result = UserDomain(user_repository=UserRepository()).authentify(
            password=data.password, username_or_email=data.usernameOrEmail
        )
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.post("/api/user/register", status_code=HTTPStatus.CREATED, response_model=User)
async def create_user(data: CreateUserRequest):
    try:
        result = UserDomain(user_repository=UserRepository()).create(
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


# BUILDER ENDPOINTS


@app.post(
    "/api/builder/save/game", status_code=HTTPStatus.OK, response_model=APIResponse
)
async def save_builder_state(body: FullStoryBuilderRequest):
    try:
        BuilderDomain(story_repository=StoryRepository()).save(body.story, body.scenes)
        return {"success": True}
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
        result = StoreDomain(story_repository=StoryRepository()).load()
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.get(
    "/api/store/download/{key}", status_code=HTTPStatus.OK, response_model=FullStory
)
async def download_from_store(key: str):
    try:
        result = StoreDomain(story_repository=StoryRepository()).download(key=key)
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.put("/api/store/publish", status_code=HTTPStatus.OK, response_model=Story)
async def publish_in_store(body: FullStoryBuilderRequest):
    try:
        story = StoreDomain(story_repository=StoryRepository()).publish(
            story=body.story, scenes=body.scenes
        )
        return story
    except Exception as err:
        raise raise_http_error(err)


# SYNCHRONIZATION ENDPOINTS


@app.get(
    "/api/synchronize/{user_key}",
    status_code=HTTPStatus.OK,
    response_model=SynchronizationPayload,
)
async def get_synchronization_data(user_key: str):
    try:
        synchronization_data = SynchronizationDomain(
            story_progress_repository=StoryProgressRepository(),
            story_repository=StoryRepository(),
        ).get_synchronization_data(user_key)
        return synchronization_data
    except Exception as err:
        raise raise_http_error(err)


@app.patch(
    "/api/synchronize/progress", status_code=HTTPStatus.OK, response_model=APIResponse
)
async def synchronize_progress(payload: StoryProgress):
    try:
        SynchronizationDomain(
            story_progress_repository=StoryProgressRepository(),
            story_repository=StoryRepository(),
        ).synchronize_progress(payload)
        return {"success": True}
    except Exception as err:
        raise raise_http_error(err)
