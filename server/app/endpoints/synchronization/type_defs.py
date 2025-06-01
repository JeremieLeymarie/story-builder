from datetime import datetime
from typing import Self
from pydantic import Field

from domains.synchronization.type_defs import (
    SynchronizationBuilderParams,
    SynchronizationBuilderPosition,
    SynchronizationScene,
    SynchronizationSceneAction,
    SynchronizationStory,
    SynchronizationStoryAuthor,
    SynchronizationStoryProgress,
)
from endpoints.common import BaseAPIModel
from utils.type_defs import StoryGenre, StoryType


class Action(BaseAPIModel):
    text: str
    scene_key: str | None = None


class BuilderPosition(BaseAPIModel):
    x: float
    y: float


class BuilderParams(BaseAPIModel):
    position: BuilderPosition


class Scene(BaseAPIModel):
    key: str
    story_key: str
    title: str
    content: str
    actions: list[Action]
    builder_params: BuilderParams

    @classmethod
    def from_domain(cls, domain: SynchronizationScene) -> Self:
        return cls(
            key=domain.key,
            story_key=domain.story_key,
            title=domain.title,
            content=domain.content,
            actions=[
                Action(text=action.text, scene_key=action.scene_key)
                for action in domain.actions
            ],
            builder_params=BuilderParams(
                position=BuilderPosition(
                    x=domain.builder_params.position.x,
                    y=domain.builder_params.position.y,
                )
            ),
        )

    def to_domain(self) -> SynchronizationScene:
        return SynchronizationScene(
            key=self.key,
            story_key=self.story_key,
            title=self.title,
            content=self.content,
            actions=[
                SynchronizationSceneAction(text=action.text, scene_key=action.scene_key)
                for action in self.actions
            ],
            builder_params=SynchronizationBuilderParams(
                position=SynchronizationBuilderPosition(
                    x=self.builder_params.position.x,
                    y=self.builder_params.position.y,
                )
            ),
        )


class StoryAuthor(BaseAPIModel):
    key: str
    username: str


class Story(BaseAPIModel, use_enum_values=True):
    key: str = Field(description="The unique key of the story")
    user_key: str = Field(description="The key of the user the story belongs to")
    type: StoryType = Field(description="The type of the story")
    author: StoryAuthor | None = Field(description="The author of the story")
    title: str = Field(description="The title of the story")
    description: str = Field(description="The description of the story")
    image: str = Field(description="The URL used for the story thumbnail")
    genres: list[StoryGenre] = Field(description="The genres of story")
    creation_date: str = Field(description="The date at which the story was created")
    first_scene_key: str = Field(description="The first scene of the story")

    original_story_key: str | None = Field(
        description="The key of the original story", default=None
    )
    publication_date: datetime | None = Field(
        description="The date at which the story", default=None
    )


class FullStory(Story):
    scenes: list[Scene]

    @classmethod
    def from_domain(cls, domain: SynchronizationStory) -> Self:
        return cls(
            key=domain.key,
            user_key=domain.user_key,
            type=domain.type,
            author=(
                StoryAuthor(key=domain.author.key, username=domain.author.username)
                if domain.author
                else None
            ),
            title=domain.title,
            description=domain.description,
            image=domain.image,
            genres=domain.genres,
            creation_date=domain.creation_date,
            first_scene_key=domain.first_scene_key,
            original_story_key=domain.original_story_key,
            publication_date=domain.publication_date,
            scenes=[Scene.from_domain(scene) for scene in domain.scenes],
        )

    @classmethod
    def from_story_and_scenes(cls, *, story: Story, scenes: list[Scene]) -> Self:
        return cls(
            key=story.key,
            user_key=story.user_key,
            type=story.type,
            author=story.author,
            title=story.title,
            description=story.description,
            image=story.image,
            genres=story.genres,
            creation_date=story.creation_date,
            first_scene_key=story.first_scene_key,
            original_story_key=story.original_story_key,
            publication_date=story.publication_date,
            scenes=scenes,
        )

    def to_domain(self) -> SynchronizationStory:
        return SynchronizationStory(
            key=self.key,
            user_key=self.user_key,
            type=self.type,
            author=(
                SynchronizationStoryAuthor(
                    key=self.author.key, username=self.author.username
                )
                if self.author
                else None
            ),
            title=self.title,
            description=self.description,
            image=self.image,
            genres=self.genres,
            creation_date=self.creation_date,
            first_scene_key=self.first_scene_key,
            original_story_key=self.original_story_key,
            publication_date=self.publication_date,
            scenes=[Scene.to_domain(scene) for scene in self.scenes],
        )


class StoryProgress(BaseAPIModel):
    key: str
    user_key: str
    history: list[str]
    current_scene_key: str
    last_played_at: datetime
    finished: bool | None = None
    story_key: str
    last_sync_at: str | None = None

    @classmethod
    def from_domain(cls, domain: SynchronizationStoryProgress) -> Self:
        return cls(
            key=domain.key,
            user_key=domain.user_key,
            history=domain.history,
            current_scene_key=domain.current_scene_key,
            last_played_at=domain.last_played_at,
            finished=domain.finished,
            story_key=domain.story_key,
            last_sync_at=domain.last_sync_at,
        )

    def to_domain(self) -> SynchronizationStoryProgress:
        return SynchronizationStoryProgress(
            key=self.key,
            user_key=self.user_key,
            history=self.history,
            current_scene_key=self.current_scene_key,
            last_played_at=self.last_played_at,
            finished=self.finished,
            story_key=self.story_key,
            last_sync_at=self.last_sync_at,
        )


class FullStoryBuilderRequest(BaseAPIModel):
    story: Story
    scenes: list[Scene]


class FullStoriesRequest(BaseAPIModel):
    stories: list[Story]
    scenes: list[Scene]


class SynchronizationLoadResponse(BaseAPIModel):
    player_games: list[FullStory]
    builder_stories: list[FullStory]
    story_progresses: list[StoryProgress]

    @classmethod
    def from_domain(
        cls,
        *,
        player_games: list[SynchronizationStory],
        builder_stories: list[SynchronizationStory],
        story_progresses: list[SynchronizationStoryProgress]
    ) -> Self:
        return cls(
            player_games=[FullStory.from_domain(story) for story in player_games],
            builder_stories=[FullStory.from_domain(story) for story in builder_stories],
            story_progresses=[StoryProgress.from_domain(sp) for sp in story_progresses],
        )
