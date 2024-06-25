from data_types.builder import Story
from utils.db import Database


class BuilderDomain:

    def __init__(self) -> None:
        self.db = Database().get_db()

    def save(self, story: Story) -> None:
        pass
