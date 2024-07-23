from pydantic import BaseModel

from data_types.builder import Scene, Story
from data_types.game import StoryProgress


class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str
    key: str


class LoginUserRequest(BaseModel):
    usernameOrEmail: str
    password: str


class FullStoryBuilderRequest(BaseModel):
    story: Story
    scenes: list[Scene]
