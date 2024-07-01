from http import HTTPStatus
from utils.format_id import format_id
from utils.db import Database

class StoreDomain:

    def __init__(self) -> None:
        self.db = Database().get_db()

    def load(self):
        try:
            data = list(self.db.stories.find())
            print(data)
            data = [format_id(x) for x in data]
            return data
        except Exception as err:
            raise Exception(HTTPStatus.INTERNAL_SERVER_ERROR, err)
