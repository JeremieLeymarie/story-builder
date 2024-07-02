from pydantic import BaseModel

from data_types.builder import Scene, Story


class CreateUserInput(BaseModel):
    username: str
    email: str
    password: str


class LoginUserInput(BaseModel):
    usernameOrEmail: str
    password: str


class SynchronizeBuilderRequestBody(BaseModel):
    story: Story
    scenes: list[Scene]
