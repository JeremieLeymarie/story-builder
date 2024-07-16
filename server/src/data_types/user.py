from typing import Self
from pydantic import BaseModel


class FullUser(BaseModel):
    email: str
    username: str
    key: str
    password: str


class User(BaseModel):
    email: str
    username: str
    key: str

    @classmethod
    def from_full_user(cls, full_user: FullUser) -> Self:
        return cls(
            email=full_user.email, username=full_user.username, key=full_user.key
        )
