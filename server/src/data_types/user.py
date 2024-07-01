from pydantic import BaseModel


class CreateUserInput(BaseModel):
    username: str
    email: str
    password: str


class LoginUserInput(BaseModel):
    usernameOrEmail: str
    password: str


class User(BaseModel):
    email: str
    username: str


class UserWithId(User):
    id: str
