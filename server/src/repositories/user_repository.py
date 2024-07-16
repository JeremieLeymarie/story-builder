from pymongo import ReturnDocument
from repositories.user_repository_port import UserRepositoryPort
from data_types.user import FullUser
from repositories.mongo_repository import MongoRecord, MongoRepository

USER_COLLECTION = "users"


# TODO: extend from MongoRepository
class UserRepository(MongoRepository, UserRepositoryPort):

    def user_exists(self, *, username: str, email: str) -> bool:
        return (
            self.db[USER_COLLECTION].count_documents(
                {"$or": [{"username": username}, {"email": email}]}
            )
            > 0
        )

    def save(self, user: FullUser) -> FullUser:
        payload = user.model_dump(mode="json")

        record: MongoRecord[dict] = self.db[USER_COLLECTION].find_one_and_update(
            {"key": user.key},
            {"$set": payload},
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )

        return FullUser(**self.remove_mongo_id(record))

    def get_by_username_or_email(self, *, username_or_email: str) -> FullUser | None:
        record = self.db[USER_COLLECTION].find_one(
            {
                "$or": [
                    {"username": username_or_email},
                    {"email": username_or_email},
                ]
            }
        )

        return FullUser(**self.remove_mongo_id(record)) if record else None
