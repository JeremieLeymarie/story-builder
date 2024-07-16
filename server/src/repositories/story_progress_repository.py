from bson import ObjectId
from repositories.repository import Repository
from repositories.story_progress_repository_port import StoryProgressRepositoryPort
from data_types.game import StoryProgress


class StoryProgressRepository(Repository, StoryProgressRepositoryPort):

    def get_from_user(self, user_id: str) -> list[StoryProgress]:
        records = self.db.storyProgresses.find({"userId": ObjectId(user_id)})

        progresses = [StoryProgress(**self.format_id(record)) for record in records]

        return progresses
