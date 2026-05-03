from datetime import datetime
from typing import Annotated, Literal, Self, Union, assert_never
from pydantic import Field, JsonValue

from domains.synchronization.type_defs import (
    SyncActionCharacterAttributeCondition,
    SyncActionSceneVisitCondition,
    SyncActionTarget,
    SyncCondition,
    SyncConditionalAction,
    SyncSimpleAction,
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


class ActionTarget(BaseAPIModel):
    scene_key: str
    probability: float


class _ActionBase(BaseAPIModel):
    key: str
    text: str
    targets: list[ActionTarget]


class SimpleAction(_ActionBase):
    type: Literal["simple"]


class SceneVisitCondition(BaseAPIModel):
    type: Literal["user-did-visit", "user-did-not-visit"]
    scene_key: str

class CharacterAttributeCondition(BaseAPIModel):
    type : Literal["character-attribute"]
    attribute_key: str
    comparator : Literal["lower-than", "greater-than"]
    value: int

type Condition = SceneVisitCondition | CharacterAttributeCondition

class ConditionalAction(_ActionBase):
    type: Literal["conditional"]
    condition: Condition


Action = Annotated[Union[SimpleAction, ConditionalAction], Field(discriminator="type")]


class BuilderPosition(BaseAPIModel):
    x: float
    y: float


class BuilderParams(BaseAPIModel):
    position: BuilderPosition


class Scene(BaseAPIModel):
    key: str
    story_key: str
    title: str
    content: dict[str, JsonValue]
    actions: list[Action]
    builder_params: BuilderParams

    @classmethod
    def _make_condition_from_domain(cls, domain_cond: SyncCondition) -> Condition:
        if isinstance(domain_cond,SyncActionSceneVisitCondition ):
            return SceneVisitCondition(type=domain_cond.type,scene_key=domain_cond.scene_key)
        elif isinstance(domain_cond, SyncActionCharacterAttributeCondition):
            return CharacterAttributeCondition(type=domain_cond.type, attribute_key=domain_cond.attribute_key, comparator=domain_cond.comparator, value=domain_cond.value )
        else:
            assert_never()

    @classmethod
    def _make_action_from_domain(
        cls, domain_action: SynchronizationSceneAction
    ) -> Action:
        if isinstance(domain_action, SyncSimpleAction):
            return SimpleAction(
                key=domain_action.key,
                text=domain_action.text,
                targets=[
                    ActionTarget(
                        scene_key=target.scene_key, probability=target.probability
                    )
                    for target in domain_action.targets
                ],
                type="simple",
            )
        if isinstance(domain_action, SyncConditionalAction):
            return ConditionalAction(
                key=domain_action.key,
                text=domain_action.text,
                targets=[
                    ActionTarget(
                        scene_key=target.scene_key, probability=target.probability
                    )
                    for target in domain_action.targets
                ],
                type="conditional",
                condition=cls._make_condition_from_domain(domain_action.condition),
            )
        assert_never()

    @classmethod
    def from_domain(cls, domain: SynchronizationScene) -> Self:
        return cls(
            key=domain.key,
            story_key=domain.story_key,
            title=domain.title,
            content=domain.content,
            actions=[cls._make_action_from_domain(action) for action in domain.actions],
            builder_params=BuilderParams(
                position=BuilderPosition(
                    x=domain.builder_params.position.x,
                    y=domain.builder_params.position.y,
                )
            ),
        )

    def _condition_to_domain(self, condition: Condition) -> SyncCondition:
        if isinstance(condition, SceneVisitCondition):
            return SyncActionSceneVisitCondition(type=condition.type, scene_key=condition.scene_key)
        elif isinstance(condition, CharacterAttributeCondition):
            return SyncActionCharacterAttributeCondition(type=condition.type, attribute_key=condition.attribute_key, comparator=condition.comparator, value=condition.value)
        else:
            assert_never()

    def _action_to_domain(self, action: Action) -> SynchronizationSceneAction:
        if isinstance(action, SimpleAction):
            return SyncSimpleAction(
                key=action.key,
                text=action.text,
                targets=[
                    SyncActionTarget(
                        scene_key=target.scene_key, probability=target.probability
                    )
                    for target in action.targets
                ],
                type="simple",
            )
        if isinstance(action, ConditionalAction):
            return SyncConditionalAction(
                key=action.key,
                text=action.text,
                targets=[
                    SyncActionTarget(
                        scene_key=target.scene_key, probability=target.probability
                    )
                    for target in action.targets
                ],
                type="conditional",
                condition=self._condition_to_domain(action.condition),
            )
        assert_never()

    def to_domain(self) -> SynchronizationScene:
        return SynchronizationScene(
            key=self.key,
            story_key=self.story_key,
            title=self.title,
            content=self.content,
            actions=[self._action_to_domain(action) for action in self.actions],
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


class Story(BaseAPIModel):
    key: str = Field(description="The unique key of the story")
    user_key: str = Field(description="The key of the user the story belongs to")
    type: StoryType = Field(description="The type of the story")
    author: StoryAuthor | None = Field(description="The author of the story")
    title: str = Field(description="The title of the story")
    description: str = Field(description="The description of the story")
    image: str = Field(description="The URL used for the story thumbnail")
    genres: list[StoryGenre] = Field(description="The genres of story")
    creation_date: datetime = Field(
        description="The date at which the story was created"
    )
    updated_at: datetime | None = Field(
        description="The date at which the story was last updated",
        default=None,
    )
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
            updated_at=domain.updated_at,
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
            updated_at=story.updated_at,
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
            updated_at=self.updated_at or self.creation_date,
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
    created_at: datetime
    last_played_at: datetime
    total_play_time_ms: int = 0
    finished: bool | None = None
    story_key: str
    last_sync_at: datetime | None = None

    @classmethod
    def from_domain(cls, domain: SynchronizationStoryProgress) -> Self:
        return cls(
            key=domain.key,
            user_key=domain.user_key,
            history=domain.history,
            current_scene_key=domain.current_scene_key,
            created_at=domain.created_at,
            last_played_at=domain.last_played_at,
            total_play_time_ms=domain.total_play_time_ms,
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
            created_at=self.created_at,
            last_played_at=self.last_played_at,
            total_play_time_ms=self.total_play_time_ms,
            finished=self.finished,
            story_key=self.story_key,
            last_sync_at=self.last_sync_at,
        )


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
        story_progresses: list[SynchronizationStoryProgress],
    ) -> Self:
        return cls(
            player_games=[FullStory.from_domain(story) for story in player_games],
            builder_stories=[FullStory.from_domain(story) for story in builder_stories],
            story_progresses=[StoryProgress.from_domain(sp) for sp in story_progresses],
        )
