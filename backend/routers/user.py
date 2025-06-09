from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from schemas.user import UserProfileUpdate, UserResponse
from schemas.project import ProjectCreateUpdate, ProjectResponse
from services.auth import get_current_user
from database import get_db
from sqlalchemy.orm import Session
from crud import user as crud_user
from crud import project as crud_project
from models.user import User
import uuid
from typing import List, Optional
import os
import shutil
from config import settings

router = APIRouter(prefix="/api/user", tags=["User"])

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_user = crud_user.update_user_profile(db, current_user.id, profile_update)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found after update")
    return updated_user

@router.post("/profile/image/upload", status_code=status.HTTP_200_OK)
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only image files are allowed.")

    file_extension = file.filename.split(".")[-1] if "." in file.filename else "png"
    filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join("static", filename)

    os.makedirs("static", exist_ok=True)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to save file: {e}")
    finally:
        file.file.close()

    image_url = f"{settings.STATIC_FILES_BASE_URL}/{filename}"

    # Delete old profile image if it exists
    if current_user.profile_image_url:
        old_filename = current_user.profile_image_url.split('/')[-1]
        old_file_path = os.path.join("static", old_filename)
        if os.path.exists(old_file_path):
            try:
                os.remove(old_file_path)
                print(f"Deleted old profile image: {old_file_path}")
            except OSError as e:
                print(f"Error deleting old profile image {old_file_path}: {e}")

    updated_user = crud_user.update_user_profile_image(db, current_user.id, image_url)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found after image upload.")

    return {"message": "Profile image uploaded successfully.", "image_url": image_url}

@router.delete("/profile/image", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile_image(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.profile_image_url:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No profile image to delete.")

    filename = current_user.profile_image_url.split('/')[-1]
    file_path = os.path.join("static", filename)

    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"Deleted profile image: {file_path}")
        except OSError as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to delete file: {e}")
    else:
        print(f"File not found on disk: {file_path}. Proceeding to clear DB URL.")

    updated_user = crud_user.update_user_profile_image(db, current_user.id, None)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found after image deletion.")

    return

@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def add_project(
    project: ProjectCreateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    added_project = crud_project.create_project(db, project, current_user.id)
    if not added_project:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to add project")
    return added_project

@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def edit_project(
    project_id: uuid.UUID,
    project_update: ProjectCreateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_project = crud_project.update_project(db, project_id, project_update, current_user.id)
    if not updated_project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or not owned by user")
    return updated_project

@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = crud_project.delete_project(db, project_id, current_user.id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or not owned by user")
    return

@router.get("/projects/me", response_model=List[ProjectResponse])
async def get_my_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve all projects owned by the currently authenticated user.
    """
    projects = crud_project.get_user_projects(db, current_user.id)
    print(projects)
    if not projects:
        # It's generally fine to return an empty list if no projects exist,
        # rather than a 404, as the request was successful.
        return []
    return projects



@router.get("/profile", response_model=UserResponse)
async def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.get("/portfolio/{user_id}", response_model=UserResponse)
async def get_public_portfolio(user_id: uuid.UUID, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User portfolio not found")

    # In a real app, you might create a dedicated schema for public portfolio
    # to explicitly exclude sensitive fields like email and email_verified
    return UserResponse.model_validate(user)

@router.post("/contact/{user_id}", status_code=status.HTTP_200_OK)
async def contact_user(user_id: uuid.UUID, sender_email: str, subject: str, message: str, db: Session = Depends(get_db)):
    target_user = crud_user.get_user_by_id(db, user_id)
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User to contact not found")

    if not target_user.email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Target user has no contact email set.")

    print(f"Simulating email to: {target_user.email}")
    print(f"From: {sender_email}")
    print(f"Subject: {subject}")
    print(f"Message: {message}")

    # You would typically use your email service here:
    # await send_email(
    #     to_email=target_user.email,
    #     subject=f"Portfolio Contact from {sender_email}: {subject}",
    #     html_content=f"Sender Email: {sender_email}<br><br>Message:<br>{message}"
    # )

    return {"message": "Contact email simulated successfully. In production, this would send an actual email."}