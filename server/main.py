from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from domains.user import UserDomain
from data_types.user import CreateUserInput, LoginUserInput

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

@app.post('/user/login',status_code=200)
async def post_session(data: LoginUserInput):
    try:
        result = UserDomain().authentify(data)
        return result
    except Exception as err:
        raise HTTPException(
            status_code=err.args[0],
            detail=str(err.args[1]),
        )


@app.post('/user/register',status_code=201)
async def post_user(data: CreateUserInput):
    try:
        result = UserDomain().create(data)
        return result
    except Exception as err:
        raise HTTPException(
            status_code=err.args[0],
            detail=str(err.args[1]),
        )


@app.post('/api/builder/save/game',status_code=200)
async def post_builder_save(data : str):
    try:
        result = "result"
        return result
    except Exception as err:
        raise HTTPException(
            status_code=err.args[0],
            detail=str(err.args[1]),
        )
