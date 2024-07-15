from pydantic import BaseModel

from data_types.builder import Scene, Story


class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginUserRequest(BaseModel):
    usernameOrEmail: str
    password: str


class FullStoryBuilderRequest(BaseModel):
    story: Story
    scenes: list[Scene]
