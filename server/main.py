from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.user import User
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

@app.post('/user/login')
async def post_session(data: LoginUserInput):
    try:
        result = User().authentify(data)
    except Exception as err:
        result = err
    finally:
        return result


@app.post('/user/register')
async def post_user(data: CreateUserInput):
    try:
        result = User().create(data)
    except Exception as err:
        print(err)
        result = err
    finally:
        return result

@app.post('/api/builder/save/game')
async def post_builder_save(data : str):
    try:
        result = "result"
    except Exception as err:
        result = err
    finally:
        return result