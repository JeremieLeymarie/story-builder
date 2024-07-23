# TODO: Should this be a domain by itself?


from repositories.story_progress_repository_port import StoryProgressRepositoryPort
from repositories.story_repository_port import StoryRepositoryPort
from data_types.synchronization import SynchronizationPayload
from data_types.game import StoryProgress


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
            playerGames=player_games, builderGames=builder_games
        )

    def synchronize_progress(self, story_progress: StoryProgress) -> StoryProgress:
        return self.story_progress_repo.save(story_progress=story_progress)
