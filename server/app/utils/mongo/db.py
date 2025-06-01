from pymongo import MongoClient
from pymongo.database import Database
import os
from dotenv import load_dotenv
from utils.meta import Singleton

load_dotenv()


class SBMongoDatabase(metaclass=Singleton):
    def __init__(self):
        MONGO_URI = os.getenv("MONGO_URI")
        if not MONGO_URI:
            raise ValueError("Invalid Mongo URI")

        self.client = MongoClient(MONGO_URI)

    def get_db(self) -> Database:
        db_name = os.getenv("DATABASE_NAME")
        if not db_name:
            raise ValueError("Invalid Database name ")

        return self.client[db_name]

    def get_client(self) -> MongoClient:
        return self.client
