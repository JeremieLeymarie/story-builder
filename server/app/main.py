from http import HTTPStatus
from typing import Annotated
from fastapi import Depends, FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

from domains.auth.auth_service import AuthService
from domains.auth.repositories.user_repository import UserRepository
from domains.auth.type_defs import AuthUser, FullUser
from endpoints.synchronization.save_builder import BuilderStateSynchronization
from endpoints.synchronization.load import SynchronizationLoadHandler
from endpoints.synchronization.save_library import LibraryStateSynchronization
from endpoints.synchronization.save_progress import ProgressSynchronizationHandler
from endpoints.synchronization.type_defs import (
    FullStoriesRequest,
    StoryProgress,
    SynchronizationLoadResponse,
)
from request_types import (
    CreateUserRequest,
    GenericAPIResponse,
    LoginUserRequest,
)
from utils.errors import BadAuthException
from utils.error_adapter import get_http_error


def custom_generate_unique_id(route: APIRoute):
    return f"API-{route.name}"


async def check_auth(authorization: Annotated[str, Header()]):
    if not authorization:
        raise get_http_error(BadAuthException("No authorization token"))
    try:
        token = authorization.split(" ")[1]
    except Exception:
        raise get_http_error(BadAuthException("Invalid authorization bearer format"))

    try:
        AuthService(user_repository=UserRepository()).check_auth(token)  # noqa: F821
    except BadAuthException as err:
        raise get_http_error(err)


app = FastAPI(
    generate_unique_id_function=custom_generate_unique_id,
)


origins = [
    "http://0.0.0.0:5173",
    "http://localhost:5173",
    "http://0.0.0.0:4173",  # For docker in preview mode
    "http://localhost:4173",
    "https://story-builder-topaz.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# USER ENDPOINTS


@app.post("/api/user/login", status_code=HTTPStatus.OK, response_model=AuthUser)
async def user_login(
    data: LoginUserRequest,
):
    try:
        result = AuthService(user_repository=UserRepository()).login(
            password=data.password, username_or_email=data.usernameOrEmail
        )
        return result
    except Exception as err:
        raise get_http_error(err)


@app.post("/api/user/register", status_code=HTTPStatus.CREATED, response_model=AuthUser)
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
        raise get_http_error(err)


# SYNCHRONIZATION ENDPOINTS


@app.get(
    "/api/load",
    status_code=HTTPStatus.OK,
    response_model=SynchronizationLoadResponse,
    dependencies=[Depends(check_auth)],
)
async def get_synchronization_data():
    return SynchronizationLoadHandler().handle()


@app.put(
    "/api/save/progresses",
    status_code=HTTPStatus.OK,
    response_model=GenericAPIResponse,
    dependencies=[Depends(check_auth)],
)
async def synchronize_progress(payload: list[StoryProgress]):
    return ProgressSynchronizationHandler().handle(payload)


@app.put(
    "/api/save/library",
    status_code=HTTPStatus.OK,
    response_model=GenericAPIResponse,
    dependencies=[Depends(check_auth)],
)
async def save_library_state(body: FullStoriesRequest):
    return LibraryStateSynchronization().handle(body)


@app.put(
    "/api/save/builder",
    status_code=HTTPStatus.OK,
    response_model=GenericAPIResponse,
    dependencies=[Depends(check_auth)],
)
async def save_builder_state(body: FullStoriesRequest):
    return BuilderStateSynchronization().handle(body)
