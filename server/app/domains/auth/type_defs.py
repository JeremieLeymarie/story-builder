from typing import Self
from pydantic import BaseModel


class FullUser(BaseModel):
    key: str
    email: str
    username: str
    password: str


class User(BaseModel):
    key: str
    email: str
    username: str

    @classmethod
    def from_full_user(cls, full_user: FullUser) -> Self:
        return cls(
            email=full_user.email, username=full_user.username, key=full_user.key
        )


class AuthUser(BaseModel):
    key: str
    email: str
    username: str
    token: str

    @classmethod
    def from_full_user(cls, *, full_user: FullUser, token: str) -> Self:
        return cls(
            email=full_user.email,
            username=full_user.username,
            key=full_user.key,
            token=token,
        )
