from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class StoryProgress(BaseModel):
    key: str
    userKey: str
    history: list[str]
    currentSceneKey: str
    lastPlayedAt: datetime
    finished: Optional[bool] = None
    storyKey: str
    lastSyncAt: Optional[str] = None
