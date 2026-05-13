from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import List, Optional
from bson import ObjectId

class User(BaseModel):
    user_id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    email: str
    password: str
    agreed_to_terms: bool = Field(
        default=False, 
        description="I agree to the Terms of Service and Privacy Policy"
    )
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))