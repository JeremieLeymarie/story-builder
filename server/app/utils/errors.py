class BadAuthError(Exception):
    pass


class InvalidActionError(Exception):
    pass


class InvalidStoryFormatError(Exception):
    def __init__(self, key: str | None = None):

        if key is not None:
            super().__init__(f"Invalid story format at key: {key}")
            return

        super().__init__()


class UnauthorizedError(Exception):
    resource: str | None = None
