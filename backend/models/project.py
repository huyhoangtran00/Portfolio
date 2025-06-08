from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    demo_url = Column(String, nullable=True)
    repository_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False) # Khóa ngoại đến bảng users

    # Quan hệ n-1 (Many-to-One) với bảng User
    # 'back_populates' chỉ định tên thuộc tính trên mô hình User sẽ tham chiếu ngược về Project này.
    owner = relationship("User", back_populates="projects")