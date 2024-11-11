from contextvars import ContextVar

from domains.type_def import User

current_user: ContextVar[User] = ContextVar("current_user")
