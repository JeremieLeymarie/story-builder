from typing import Optional
from pydantic import BaseModel

from data_types.builder import FullStory
from data_types.game import StoryProgress


class SynchronizationPayload(BaseModel):
    playerGames: list[FullStory]
    builderGames: Optional[list[FullStory]]
    storyProgresses: list[StoryProgress]
