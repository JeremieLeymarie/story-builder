from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class StoryProgress(BaseModel):
    key: str
    history: list[str]
    currentSceneKey: str
    lastPlayedAt: datetime
    finished: Optional[bool] = None
