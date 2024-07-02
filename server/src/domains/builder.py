from data_types.builder import Scene, Story
from utils.db import Database


class BuilderDomain:

    def __init__(self) -> None:
        self.db = Database().get_db()

    def save(self, story: Story, scenes: list[Scene]) -> None:

        payload = {
            **story.model_dump(),
            **{"scenes": [scene.model_dump() for scene in scenes]},
        }

        # TODO: Add saved status

        self.db.stories.update_one(
            {"authorId": story.authorId, "id": story.id},
            {"$set": payload},
            upsert=True,
        )
