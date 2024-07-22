from typing import Optional
from pydantic import BaseModel

from data_types.builder import FullStory


class SynchronizationPayload(BaseModel):
    playerGames: list[FullStory]
    builderGames: Optional[list[FullStory]]
