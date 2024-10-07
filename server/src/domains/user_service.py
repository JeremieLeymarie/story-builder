from crypt import crypt

from hmac import compare_digest as compare_hash

from repositories.user_repository_port import UserRepositoryPort
from domains.type_def import FullUser, User
from utils.errors import BadAuthException, InvalidActionException


class UserService:

    def __init__(self, user_repository: UserRepositoryPort) -> None:
        self.user_repository = user_repository

    def create(self, user: FullUser) -> User:
        user_exists = self.user_repository.user_exists(
            username=user.username, email=user.email
        )
        if user_exists:
            raise InvalidActionException("Email or username is taken")

        created_user = self.user_repository.save(
            FullUser(
                key=user.key,
                username=user.username,
                email=user.email,
                password=crypt(user.password),
            )
        )

        return User.from_full_user(created_user)

    def authentify(self, username_or_email: str, password: str) -> User:
        full_user = self.user_repository.get_by_username_or_email(
            username_or_email=username_or_email
        )

        if not full_user:
            raise BadAuthException("User not found")

        password_match = compare_hash(
            crypt(password, full_user.password), full_user.password
        )

        if not password_match:
            raise BadAuthException("Invalid password")

        return User.from_full_user(full_user)
