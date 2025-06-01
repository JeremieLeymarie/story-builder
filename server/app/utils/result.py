from typing import NamedTuple


class Result[T](NamedTuple):
    success: bool
    result: T | None = None
