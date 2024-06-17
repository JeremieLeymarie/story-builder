from utils.connect import get_db
from crypt import crypt
import datetime
from hmac import compare_digest as compare_hash
from data_types.user import CreateUserInput, LoginUserInput , User


class User:

    def __init__(self) -> None:
        self.db = get_db()

    def create(self , user : CreateUserInput) -> bool:
        is_username_or_email_taken = self.db['users'].find(
            {"$or": [{"username": user.username}, {"email": user.email}]})
        if len(list(is_username_or_email_taken)) > 0:
            raise {"error":"emai taken or username is taken"}

        user.password = crypt(user.password)
        date = datetime.datetime.now().isoformat()
        userDocument: dict = dict(user)
        userDocument['createdAt'] = date
        userDocument['lastUpdatedAt'] = date
        result = self.db["users"].insert_one(dict(userDocument))

        if not result.inserted_id:
            raise {"error":"insert failed"}

        return True

    
    def authentify(self, input: LoginUserInput) -> User:
        user = self.db["users"].find_one(
            {'$or': [{'username': input.usernameOrEmail}, {'email': input.usernameOrEmail}]})

        if not user:
            raise {"error":"user not found"}

        password_match = compare_hash(
            crypt(input.password, user["password"]), user["password"])
        if not password_match:
            raise {"error":"invalid password"}

        return user