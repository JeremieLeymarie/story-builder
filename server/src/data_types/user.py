from pydantic import BaseModel


class User(BaseModel):
    email: str
    username: str


class UserWithId(User):
    remoteId: str
