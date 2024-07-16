from http import HTTPStatus
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
from data_types.user import FullUser
from domains.synchronization_domain import SynchronizationDomain
from repositories.story_progress_repository import StoryProgressRepository
from data_types.game import StoryProgress
from utils.error_adapter import raise_http_error

app = FastAPI()

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

# TODO: use API wrapper


# USER ENDPOINTS


@app.post("/api/user/login", status_code=HTTPStatus.OK)
async def post_session(data: LoginUserRequest):
    try:
        result = UserDomain(user_repository=UserRepository()).authentify(
            password=data.password, username_or_email=data.usernameOrEmail
        )
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.post("/api/user/register", status_code=HTTPStatus.CREATED)
async def post_user(data: CreateUserRequest):
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


@app.post("/api/builder/save/game", status_code=HTTPStatus.OK)
async def post_builder_save(body: FullStoryBuilderRequest):
    try:
        BuilderDomain(story_repository=StoryRepository()).save(body.story, body.scenes)
    except Exception as err:
        raise raise_http_error(err)


# STORE ENDPOINTS


@app.get("/api/store/load", status_code=HTTPStatus.OK)
async def get_store_load():
    try:
        result = StoreDomain(story_repository=StoryRepository()).load()
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.get("/api/store/download/{key}", status_code=HTTPStatus.OK)
async def get_store_download(key: str):
    try:
        result = StoreDomain(story_repository=StoryRepository()).download(key=key)
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.put("/api/store/publish", status_code=HTTPStatus.OK)
async def publish_in_store(body: FullStoryBuilderRequest):
    try:
        StoreDomain(story_repository=StoryRepository()).publish(
            story=body.story, scenes=body.scenes
        )
        return {"success": True}
    except Exception as err:
        raise raise_http_error(err)


# SYNCHRONIZATION ENDPOINTS


@app.get("/api/synchronize/{user_id}", status_code=HTTPStatus.OK)
async def get_synchronization_date(user_id: str):
    try:
        SynchronizationDomain(
            story_progress_repository=StoryProgressRepository(),
            story_repository=StoryRepository(),
        ).get_synchronization_data(user_id)
    except Exception as err:
        raise raise_http_error(err)


@app.patch("/api/synchronize/progress", status_code=HTTPStatus.OK)
async def synchronize_progress(payload: StoryProgress):
    try:
        SynchronizationDomain(
            story_progress_repository=StoryProgressRepository(),
            story_repository=StoryRepository(),
        ).synchronize_progress(payload)
    except Exception as err:
        raise raise_http_error(err)
