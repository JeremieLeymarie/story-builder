from http import HTTPStatus
from fastapi import HTTPException
import logging

from utils.errors import BadAuthException, InvalidActionException, UnauthorizedException


def raise_http_error(error: Exception) -> HTTPException:
    logging.error(error)

    match error:
        case InvalidActionException():
            return HTTPException(HTTPStatus.FORBIDDEN, str(error))
        case BadAuthException():
            return HTTPException(HTTPStatus.UNAUTHORIZED, str(error))
        case UnauthorizedException():
            return HTTPException(HTTPStatus.UNAUTHORIZED)
        case _:
            return HTTPException(
                HTTPStatus.INTERNAL_SERVER_ERROR, "Something went wrong."
            )
