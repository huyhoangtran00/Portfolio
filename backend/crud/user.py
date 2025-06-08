from sqlalchemy.orm import Session
from models.user import User
from schemas.auth import UserCreate
from schemas.user import UserProfileUpdate
import uuid
from typing import Optional # <-- THÊM DÒNG NÀY VÀO ĐÂY

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: uuid.UUID):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate, hashed_password: str):
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        name=None,
        job_title=None,
        bio=None,
        profile_image_url=None,
        email_verified=False,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_profile(db: Session, user_id: uuid.UUID, profile_update: UserProfileUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        update_data = profile_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    return db_user

# THAY ĐỔI DÒNG NÀY:
def update_user_profile_image(db: Session, user_id: uuid.UUID, image_url: Optional[str]): # <-- SỬA TẠI ĐÂY
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db_user.profile_image_url = image_url
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    return db_user