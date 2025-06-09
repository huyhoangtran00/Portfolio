from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import Base, engine
from routers import auth, user
from fastapi.responses import JSONResponse
# Import models to ensure they are loaded and registered with Base.metadata
from models import user as models_user
from models import project as models_project

app = FastAPI(
    title="User Portfolio Management API",
    description="API for managing user profiles and portfolios."
)

# CORS configuration
origins = [
    "http://localhost:5173",
    # Add your deployed frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount a static directory to serve uploaded files
# Images will be accessible via /static/your-image-name.jpg
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router)
app.include_router(user.router)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the User Portfolio Management API!"}


@app.get("/api/health")
async def health_check():
    return JSONResponse(content={"status": "ok"})