from pydantic import BaseModel, EmailStr
from typing import Optional, List
from schemas.project import ProjectResponse # Import ProjectResponse
import uuid # <-- THÊM DÒNG NÀY VÀO ĐÂY

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    job_title: Optional[str] = None
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None

class UserResponse(BaseModel):
    id: uuid.UUID # PostgreSQL UUID type
    email: EmailStr
    name: Optional[str] = None
    job_title: Optional[str] = None
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None
    email_verified: bool
    projects: List[ProjectResponse] = [] # List of ProjectResponse models

    class Config:
        from_attributes = True # Đổi từ orm_mode = True (Pydantic v1) sang from_attributes = True (Pydantic v2)