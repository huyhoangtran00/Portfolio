from sqlalchemy import Column, Integer, String, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    profile_image_url = Column(String, nullable=True)
    email_verified = Column(Boolean, default=False)

    # Quan hệ 1-n (One-to-Many) với bảng Project
    # 'back_populates' chỉ định tên thuộc tính trên mô hình Project sẽ tham chiếu ngược về User này.
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")