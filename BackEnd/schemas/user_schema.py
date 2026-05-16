from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

def user_serializer(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user.get("email")
    }

def users_serializer(users) -> list:
    return [user_serializer(user) for user in users]