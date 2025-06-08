from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from schemas.auth import UserCreate, UserLogin, ForgotPasswordRequest, ResetPasswordRequest, Token
from schemas.user import UserResponse
from services.auth import get_password_hash, verify_password, create_access_token, create_refresh_token
from services.email import send_email
from database import get_db
from sqlalchemy.orm import Session
from config import settings
from datetime import timedelta
from jose import JWTError, jwt
from crud import user as crud_user
import uuid
from urllib.parse import unquote

router = APIRouter(prefix="/api/user", tags=["Auth"])

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = crud_user.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    db_user = crud_user.create_user(db, user, hashed_password)

    # verification_token = create_access_token({"sub": str(db_user.id)}, timedelta(hours=24))
    # verification_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
    # email_sent = await send_email(
    #     to_email=db_user.email,
    #     subject="Verify Your Email for User Portfolio App",
    #     html_content=f"""
    #     <h1>Welcome to User Portfolio App!</h1>
    #     <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
    #     <p><a href="{verification_link}">Verify Email Now</a></p>
    #     <p>This link will expire in 24 hours.</p>
    #     <p>If you did not sign up for this service, please ignore this email.</p>
    #     """
    # )
    # if not email_sent:
    #     print("Warning: Could not send verification email.") # Hoặc xử lý lỗi mạnh mẽ hơn

    return db_user

@router.post("/login")
async def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token
    }

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_email(db, request.email)
    if not user:
        return {"message": "If an account with that email exists, a password reset link has been sent."}

    print(user.id)
    reset_token = create_access_token({"sub": str(user.id)}, timedelta(hours=1))
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    await send_email(
        to_email=user.email,
        subject="Password Reset Request for User Portfolio App",
        html_content=f"Click <a href={reset_link}>here</a> to reset your password. This link will expire in 1 hour."
    )
    return {"message": "If an account with that email exists, a password reset link has been sent."}

@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:

        payload = jwt.decode(request.token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id_str: str = payload.get("sub")
        print(user_id_str)  # Debugging line to check the user_id_str value
        if user_id_str is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token payload.")
        user_id = uuid.UUID(user_id_str) # ValueError có thể xảy ra ở đây nếu user_id_str không phải UUID hợp lệ
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password reset link has expired.")
    except JWTError: # Bắt các lỗi JWT khác như chữ ký không hợp lệ
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid password reset link.")
    except ValueError: # Bắt lỗi nếu user_id_str không phải UUID hợp lệ
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID in token.")


    user = crud_user.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    hashed_new_password = get_password_hash(request.new_password)
    user.hashed_password = hashed_new_password
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Password has been reset successfully."}

# @router.post("/refresh-token", response_model=Token)
# async def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
#     try:
#         # Hàm này sẽ giải mã refresh token và kiểm tra tính hợp lệ/hết hạn
#         # Nó nên đảm bảo token là refresh token (nếu bạn có thêm claim 'type' khi tạo token)
#         # và chưa bị thu hồi (nếu bạn có blacklist/whitelist refresh token)
#         user_id = decode_token_for_refresh(request.refresh_token)

#         # Lấy thông tin user để tạo access token mới
#         user = crud_user.get_user_by_id(db, user_id)
#         if not user:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

#         # Tạo access token mới
#         access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#         new_access_token = create_access_token(
#             data={"sub": str(user.id)}, expires_delta=access_token_expires
#         )

#         # (Tùy chọn) Tạo refresh token mới (Rotation).
#         # Nếu bạn không muốn rotate refresh token, bạn có thể bỏ qua dòng này
#         # và trả về refresh token cũ nếu nó vẫn còn hiệu lực hoặc không cần rotate.
#         # Tuy nhiên, rotation là một phương pháp bảo mật tốt.
#         new_refresh_token = create_refresh_token(
#             data={"sub": str(user.id)}, # Đảm bảo refresh token cũng có 'sub'
#             expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
#         )

#         return {
#             "access_token": new_access_token,
#             "token_type": "bearer",
#             "refresh_token": new_refresh_token # Trả về refresh token mới (nếu có rotate)
#         }
#     except HTTPException as e:
#         raise e # Đẩy các HTTPException đã định nghĩa sẵn
#     except Exception: # Bắt các lỗi khác không xác định
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")
