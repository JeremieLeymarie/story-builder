import enum
from pydantic import BaseModel


class StoryStatus(enum.Enum):
    DRAFT = "draft"
    SAVED = "saved"
    PUBLISHED = "published"


class Story(BaseModel):
    id: int
    authorId: int
    title: str
    description: str
    image: str
    status: StoryStatus
