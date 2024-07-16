from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class StoryProgress(BaseModel):
    userId: int
    remoteId: Optional[str] = None
    remoteStoryId: str
    remoteUserId: str
    history: list[int]
    currentSceneId: int
    lastPlayedAt: datetime
