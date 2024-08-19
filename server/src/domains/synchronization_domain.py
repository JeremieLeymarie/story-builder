# TODO: Should this be a domain by itself?


from repositories.story_progress_repository_port import StoryProgressRepositoryPort
from repositories.story_repository_port import StoryRepositoryPort
from data_types.synchronization import SynchronizationPayload
from data_types.game import StoryProgress
from data_types.builder import FullStory, Scene, Story


class SynchronizationDomain:
    def __init__(
        self,
        story_progress_repository: StoryProgressRepositoryPort,
        story_repository: StoryRepositoryPort,
    ):
        self.story_progress_repo = story_progress_repository
        self.story_repo = story_repository

    def get_synchronization_data(self, user_key: str) -> SynchronizationPayload:
        progresses = self.story_progress_repo.get_from_user(user_key=user_key)
        story_keys = [progress.key for progress in progresses]

        player_games = self.story_repo.get_by_keys(keys=story_keys)
        builder_games = self.story_repo.get_by_author_key(author_key=user_key)

        return SynchronizationPayload(
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
        return self.story_repo.save_all(stories=full_stories)
