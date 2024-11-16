from repositories.story_progress_repository_port import StoryProgressRepositoryPort
from repositories.story_repository_port import StoryRepositoryPort
from domains.type_def import FullStory, Scene, Story, StoryProgress
from context import current_user
from request_types import SynchronizationResponse


class SynchronizationService:
    def __init__(
        self,
        story_progress_repository: StoryProgressRepositoryPort,
        story_repository: StoryRepositoryPort,
    ):
        self.story_progress_repo = story_progress_repository
        self.story_repo = story_repository

    def get_synchronization_data(self) -> SynchronizationResponse:
        user_key = current_user.get().key

        progresses = self.story_progress_repo.get_from_user(user_key=user_key)
        story_keys = [progress.key for progress in progresses]

        player_games = self.story_repo.get_by_keys(keys=story_keys)
        builder_games = self.story_repo.get_by_author_key(author_key=user_key)

        return SynchronizationResponse(
            playerGames=player_games,
            builderGames=builder_games,
            storyProgresses=progresses,
        )

    def save_progresses(
        self, story_progresses: list[StoryProgress]
    ) -> list[StoryProgress]:

        return self.story_progress_repo.save_all(story_progresses=story_progresses)

    def save_builder_stories(
        self, stories: list[Story], scenes: list[Scene]
    ) -> list[FullStory]:
        scenes_by_story_key: dict[str, list[Scene]] = {}
        for scene in scenes:
            scenes_by_story_key.setdefault(scene.storyKey, []).append(scene)

        full_stories = [
            FullStory(
                **story.model_dump(mode="json"), scenes=scenes_by_story_key[story.key]
            )
            for story in stories
        ]

        return self.story_repo.save_all(stories=full_stories) if full_stories else []
