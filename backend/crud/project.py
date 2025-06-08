from sqlalchemy.orm import Session
from models.project import Project
from schemas.project import ProjectCreateUpdate
import uuid

def create_project(db: Session, project: ProjectCreateUpdate, owner_id: uuid.UUID):
    db_project = Project(**project.model_dump(), owner_id=owner_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_project_by_id(db: Session, project_id: uuid.UUID):
    return db.query(Project).filter(Project.id == project_id).first()

def get_user_projects(db: Session, owner_id: uuid.UUID):
    return db.query(Project).filter(Project.owner_id == owner_id).all()

def update_project(db: Session, project_id: uuid.UUID, project_update: ProjectCreateUpdate, owner_id: uuid.UUID):
    db_project = db.query(Project).filter(Project.id == project_id, Project.owner_id == owner_id).first()
    if db_project:
        update_data = project_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_project, key, value)
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: uuid.UUID, owner_id: uuid.UUID):
    db_project = db.query(Project).filter(Project.id == project_id, Project.owner_id == owner_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
        return True
    return False