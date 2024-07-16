# TODO: Should this be a domain by itself?


from repositories.story_progress_repository_port import StoryProgressRepositoryPort
from repositories.story_repository_port import StoryRepositoryPort
from data_types.synchronization import SynchronizationPayload


class SynchronizationDomain:
    def __init__(
        self,
        story_progress_repository: StoryProgressRepositoryPort,
        story_repository: StoryRepositoryPort,
    ):
        self.story_progress_repo = story_progress_repository
        self.story_repo = story_repository

    def get_synchronization_data(self, user_id: str) -> SynchronizationPayload:
        progresses = self.story_progress_repo.get_from_user(user_id=user_id)
        story_remote_ids = [str(progress.remoteStoryId) for progress in progresses]

        player_games = self.story_repo.get_by_keys(ids=story_remote_ids)
        builder_games = self.story_repo.get_by_author_key(author_id=user_id)

        return SynchronizationPayload(
            playerGames=player_games, builderGames=builder_games
        )
