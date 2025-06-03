from http import HTTPStatus
from fastapi import HTTPException
import logging

from utils.errors import BadAuthError, InvalidActionError, UnauthorizedError


def get_http_error(error: Exception) -> HTTPException:
    logging.error(error)

    match error:
        case InvalidActionError():
            return HTTPException(HTTPStatus.FORBIDDEN, str(error))
        case BadAuthError():
            return HTTPException(HTTPStatus.UNAUTHORIZED, str(error))
        case UnauthorizedError():
            return HTTPException(HTTPStatus.UNAUTHORIZED)
        case _:
            return HTTPException(
                HTTPStatus.INTERNAL_SERVER_ERROR, "Something went wrong."
            )
