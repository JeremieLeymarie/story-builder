from pymongo import MongoClient
import os
from dotenv import load_dotenv
from utils.meta import Singleton

load_dotenv()


class Database(metaclass=Singleton):
    def __init__(self):
        MONGO_URI = os.getenv("MONGO_URI")
        if MONGO_URI == None:
            raise Exception("Invalid MONGO URI")

        self.client = MongoClient(MONGO_URI)

    def get_db(self):
        return self.client["database"]
