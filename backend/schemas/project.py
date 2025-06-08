from pydantic import BaseModel
from typing import Optional
import uuid # Không cần thiết cho Pydantic, nhưng để nhắc nhở id sẽ là UUID

class ProjectCreateUpdate(BaseModel):
    name: str
    demo_url: Optional[str] = None
    repository_url: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: uuid.UUID # Project ID sẽ là UUID từ DB
    name: str
    demo_url: Optional[str] = None
    repository_url: Optional[str] = None
    description: Optional[str] = None
    owner_id: uuid.UUID # Thêm owner_id để biết dự án thuộc về ai

    class Config:
        from_attributes = True # Đổi từ orm_mode = True (Pydantic v1) sang from_attributes = True (Pydantic v2)