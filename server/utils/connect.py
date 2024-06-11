from pymongo import MongoClient
import os


def get_db():
    MONGO_URI = os.getenv('MONGO_URI')
    if MONGO_URI == None:
        return None

    client = MongoClient(MONGO_URI)
    return client['database']