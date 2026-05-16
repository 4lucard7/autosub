from dotenv import load_dotenv
from jose import jwt
from datetime import datetime, timedelta
import os


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    
    #copy the data to a new variable
    to_encode = data.copy()

    #set the expiration time
    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    #add the expiration time to the data
    to_encode.update({
        "exp" : expire
    })

    #encode the data
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    #return the encoded token
    return encoded_jwt
