# from typing import Any, Dict, TypeVar, TypedDict


# class WithId(TypedDict):
#     _id : Any # TODO: type this

# T = TypeVar("T", WithId)


# def format_id[T](arg: T) -> dict:
def format_id(arg: dict) -> dict:
    arg["mongoId"] = str(arg["_id"])
    del arg["_id"]
    return arg
