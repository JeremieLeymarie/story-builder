from utils.connect import get_db
from utils.format_id import format_id
from crypt import crypt
import datetime
from hmac import compare_digest as compare_hash
from data_types.user import CreateUserInput, LoginUserInput , User,UserWithId


class UserDomain:

    def __init__(self) -> None:
        self.db = get_db()

    def create(self , user : CreateUserInput) -> UserWithId:
        user_count = self.db['users'].count_documents(
            {"$or": [{"username": user.username}, {"email": user.email}]})
        if user_count > 0:
            raise Exception(403,"email taken or username is taken")

        user.password = crypt(user.password)
        date = datetime.datetime.now().isoformat()
        user_document: dict = dict(user)
        user_document['createdAt'] = date
        user_document['lastUpdatedAt'] = date
        result = self.db["users"].insert_one(dict(user_document))
        user_document['_id'] = str(result.inserted_id)
        del user_document['password']
        if not result.inserted_id:
            raise Exception(500,"user creation failed")

        return user_document

    
    def authentify(self, input: LoginUserInput) -> User:
        user = self.db["users"].find_one(
            {'$or': [{'username': input.usernameOrEmail}, {'email': input.usernameOrEmail}]})

        if not user:
            raise Exception(401,"user not found")

        password_match = compare_hash(
            crypt(input.password, user["password"]), user["password"])
        if not password_match:
            raise Exception(401,"invalid password")
        user = format_id(user)
        return user