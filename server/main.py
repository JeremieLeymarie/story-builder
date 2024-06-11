from fastapi import FastAPI

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/user/login')
async def post_login(data: str):
    try:
        result = "result"
    except Exception as err:
        result = err
    finally:
        return result



@app.post('/user/register')
async def post_register(data : str):
    try:
        result = "result"
    except Exception as err:
        result = err
    finally:
        return result