from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import traceback
import logging
from models.User import User
from schemas import UserCreate, UserLogin
from utils.hashing import get_hashed_password, verify_password
from workers.DB import db
from utils.token import create_access_token

router = APIRouter()

@router.post("/auth/register")
async def register(user_data: UserCreate):
    # check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    # hash password
    hashed_password = get_hashed_password(user_data.password)
    new_user = User(
        email=user_data.email,
        password=hashed_password
    )
    
    # save user in database
    await db.users.insert_one(new_user.dict(by_alias=True))

    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "message": "User registered successfully"
        })

@router.post("/auth/login")
async def login(user_data: UserLogin):
    # verify email
    existing_user = await db.users.find_one({"email": user_data.email})
    if not existing_user:
        raise HTTPException(
            status_code=400,
            detail="User not found"
        )

    # verify password
    if not verify_password(user_data.password, existing_user["password"]):
        raise HTTPException(
            status_code=400,
            detail="Invalid password"
        )

    # generate JWT token
    access_token = create_access_token({
        "email": user_data.email
    })

    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "access_token": access_token,
            "token_type": "bearer"
        })

@router.post("/auth/logout")
async def logout():
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "message": "Logout successful"
        })


