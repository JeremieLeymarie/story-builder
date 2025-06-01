from typing import Optional
from pydantic import BaseModel


class GenericAPIResponse(BaseModel):
    success: bool
    message: Optional[str] = None


class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str
    key: str


class LoginUserRequest(BaseModel):
    usernameOrEmail: str
    password: str
