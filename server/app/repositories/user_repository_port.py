from typing import Protocol

from domains.type_def import FullUser


class UserRepositoryPort(Protocol):
    def user_exists(self, *, username: str, email: str) -> bool:
        """Search in the database for an existing user with the specified email or username

        Args:
            username (str): the username
            email (str): the email

        Returns:
            bool: whether or not a user exists with given username or email
        """
        ...

    def save(self, user: FullUser) -> FullUser:
        """Insert or update a user in the database


        Args:
            user (FullUser): the full user data to save in the database

        Returns:
            FullUser: the inserted or updated record
        """
        ...

    def get_by_username_or_email(self, *, username_or_email: str) -> FullUser | None:
        """Retrieve user who have a matching username or email

        Args:
            username_or_email (str): the username or the email of the user

        Returns:
            FullUser | None: the user found or None
        """

    def get(self, key: str) -> FullUser | None:
        """Retrieve use by key

        Args:
            key (str): the key of the use

        Returns:
            FullUser | None: the user found or none
        """
