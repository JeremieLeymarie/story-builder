class SynchronizationUserKeyNotMatchError(Exception):
    def __init__(self, *, user_key: str, authed_user_key: str):
        super().__init__(
            f"Can't save object: user_key ({user_key}) does not match the authenticated user's ({authed_user_key}) "
        )
