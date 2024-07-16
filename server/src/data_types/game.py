from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class StoryProgress(BaseModel):
    userId: int
    id: int
    remoteId: Optional[int] = None
    remoteStoryId: str
    history: list[int]
    currentSceneId: int
    lastPlayedAt: datetime
