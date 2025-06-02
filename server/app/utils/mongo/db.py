from pymongo import MongoClient
from pymongo.database import Database
import os
from dotenv import load_dotenv
from utils.meta import Singleton

load_dotenv()


# TODO: test this
class MongoDatabaseManager(metaclass=Singleton):
    def __init__(self, mongo_uri: str | None = None):
        mongo_uri = mongo_uri or os.getenv("MONGO_URI")
        if not mongo_uri:
            raise ValueError("Invalid Mongo URI")

        self.client: MongoClient = MongoClient(mongo_uri)

    def get_db(self) -> Database:
        db_name = os.getenv("DATABASE_NAME")
        if not db_name:
            raise ValueError("Invalid Database name ")

        return self.client[db_name]

    def get_client(self) -> MongoClient:
        return self.client
