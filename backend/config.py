import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-super-secret-jwt-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    EMAIL_SERVICE_API_KEY: str = os.getenv("EMAIL_SERVICE_API_KEY", "")
    SENDER_EMAIL: str = os.getenv("SENDER_EMAIL", "noreply@example.com")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000") # For magic link redirects
    # New: Base URL for static files (e.g., uploaded images)
    STATIC_FILES_BASE_URL: str = os.getenv("STATIC_FILES_BASE_URL", "http://localhost:8000/static")

settings = Settings()