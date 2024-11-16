from typing import Optional
from pydantic import BaseModel

from domains.type_def import FullStory, Scene, Story, StoryProgress


class GenericAPIResponse(BaseModel):
    success: bool
    message: Optional[str] = None


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


class FullStoriesRequest(BaseModel):
    stories: list[Story]
    scenes: list[Scene]


class SynchronizationResponse(BaseModel):
    playerGames: list[FullStory]
    builderGames: Optional[list[FullStory]]
    storyProgresses: list[StoryProgress]
