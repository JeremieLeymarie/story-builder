from http import HTTPStatus
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from data_types.user import CreateUserInput, LoginUserInput
from domains.user import UserDomain
from data_types.builder import Story
from domains.builder import BuilderDomain

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


@app.post("/user/login", status_code=HTTPStatus.OK)
async def post_session(data: LoginUserInput, response: Response):
    try:
        result = UserDomain().authentify(data)
        return result
    except Exception as err:
        raise HTTPException(
            status_code=err.args[0],
            detail=str(err.args[1]),
        )


@app.post("/user/register", status_code=HTTPStatus.CREATED)
async def post_user(data: CreateUserInput, response: Response):
    try:
        result = UserDomain().create(data)
        return result
    except Exception as err:
        raise HTTPException(
            status_code=err.args[0],
            detail=str(err.args[1]),
        )


@app.post("/api/builder/save/game", status_code=HTTPStatus.OK)
async def post_builder_save(story: Story, response: Response):
    try:
        BuilderDomain().save(story)
    except Exception as err:
        raise HTTPException(
            status_code=err.args[0],
            detail=str(err.args[1]),
        )
