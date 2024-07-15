from typing import Any


# TODO: type this with generic type
def format_id(arg: Any) -> Any:
    arg["remoteId"] = str(arg["_id"])
    del arg["_id"]
    return arg
