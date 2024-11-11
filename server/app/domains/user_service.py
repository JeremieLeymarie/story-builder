import os
import bcrypt

from repositories.user_repository_port import UserRepositoryPort
from domains.type_def import AuthUser, FullUser
from utils.errors import BadAuthException, InvalidActionException
import jwt


class UserService:

    def __init__(self, user_repository: UserRepositoryPort) -> None:
        self.user_repository = user_repository

    def create(self, user: FullUser) -> AuthUser:
        user_exists = self.user_repository.user_exists(
            username=user.username, email=user.email
        )
        if user_exists:
            raise InvalidActionException("Email or username is taken")

        password_bytes = user.password.encode("utf-8")
        hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        hashed_password = hashed_bytes.decode("utf-8")
        created_user = self.user_repository.save(
            FullUser(
                key=user.key,
                username=user.username,
                email=user.email,
                password=hashed_password,
            )
        )

        token = self._generate_token(created_user)

        return AuthUser.from_full_user(full_user=created_user, token=token)

    def authentify(self, username_or_email: str, password: str) -> AuthUser:
        full_user = self.user_repository.get_by_username_or_email(
            username_or_email=username_or_email
        )

        if not full_user:
            raise BadAuthException("User not found")

        password_bytes = password.encode("utf-8")
        password_match = bcrypt.checkpw(
            password_bytes, full_user.password.encode("utf-8")
        )

        if not password_match:
            raise BadAuthException("Invalid password")

        token = self._generate_token(full_user)
        return AuthUser.from_full_user(full_user=full_user, token=token)

    def _generate_token(self, user: FullUser) -> str:
        return jwt.encode({"key": user.key}, os.getenv("JWT_SECRET"), algorithm="HS256")
