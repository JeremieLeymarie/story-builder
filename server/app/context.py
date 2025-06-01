from contextvars import ContextVar

from domains.auth.type_defs import User

current_user: ContextVar[User] = ContextVar("current_user")
