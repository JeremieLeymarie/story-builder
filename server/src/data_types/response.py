from typing import Optional
from pydantic import BaseModel


class APIResponse(BaseModel):
    success: bool
    message: Optional[str] = None
