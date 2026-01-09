class UserKeyNotMatchError(Exception):
    def __init__(self, *, user_key: str, authed_user_key: str):
        super().__init__(
            f"Cannot save object: user_key ({user_key}) does not match the authenticated user's ({authed_user_key}) "
        )


class BuilderStoryAuthorNotMatchError(Exception):
    def __init__(self, author_key: str, authed_user_key: str):
        super().__init__(
            f"Cannot save builder story: author key ({author_key}) does not match the authenticated user's ({authed_user_key})"
        )
