from http import HTTPStatus
from bson import ObjectId
from utils.format_id import format_id
from utils.db import Database

class StoreDomain:

    def __init__(self) -> None:
        self.db = Database().get_db()

    def load(self):
        try:
            data = list(self.db.stories.find({},{"scenes": 0}))
            # data = list(self.db.stories.find({"status":"published"},{"scenes": 0}))
            data = [format_id(x) for x in data]
            return data
        except Exception as err:
            raise Exception(HTTPStatus.INTERNAL_SERVER_ERROR, err)

    def download(self, mongoId : str):
        try:
            mongoId = ObjectId(mongoId)
            data = self.db.stories.find_one({ "_id" : mongoId})
            data = format_id(data)
            return data
        except Exception as err:
            raise Exception(HTTPStatus.INTERNAL_SERVER_ERROR, err)