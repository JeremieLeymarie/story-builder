class BadAuthException(Exception):
    pass


class InvalidActionException(Exception):
    pass


class InvalidStoryFormatException(Exception):
    def __init__(self, key: str | None = None):

        if key is not None:
            super().__init__(f"Invalid story format at key: {key}")
            return

        super().__init__()


class UnauthorizedException(Exception):
    resource: str | None = None
