from http import HTTPStatus
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from domains.user import UserDomain
from data_types.requests import (
    CreateUserInput,
    LoginUserInput,
    SynchronizeBuilderRequestBody,
)
from domains.builder import BuilderDomain
from domains.store import StoreDomain
from server.src.utils.error_adapter import raise_http_error

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
async def post_session(data: LoginUserInput, response: Response):
    try:
        result = UserDomain().authentify(data)
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.post("/api/user/register", status_code=HTTPStatus.CREATED)
async def post_user(data: CreateUserInput, response: Response):
    try:
        result = UserDomain().create(data)
        return result
    except Exception as err:
        raise raise_http_error(err)


# BUILDER ENDPOINTS


@app.post("/api/builder/save/game", status_code=HTTPStatus.OK)
async def post_builder_save(body: SynchronizeBuilderRequestBody, response: Response):
    try:
        BuilderDomain().save(body.story, body.scenes)
    except Exception as err:
        raise raise_http_error(err)


# STORE ENDPOINTS


@app.get("/api/store/load", status_code=HTTPStatus.OK)
async def get_store_load():
    try:
        result = StoreDomain().load()
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.get("/api/store/download/{mongoId}", status_code=HTTPStatus.OK)
async def get_store_download(mongoId: str):
    try:
        result = StoreDomain().download(mongoId)
        return result
    except Exception as err:
        raise raise_http_error(err)


@app.get("/api/store/publish/{mongoId}", status_code=HTTPStatus.OK)
async def publish_in_store(mongoId):
    try:
        result = StoreDomain().download(mongoId)
        return result
    except Exception as err:
        raise raise_http_error(err)
