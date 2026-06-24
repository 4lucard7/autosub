import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.auth import router as auth_router
from api.jobs import router as jobs_router
from api.subtitles import router as subtitles_router
from api.videos import router as videos_router

app = FastAPI(title="AutoSub API")

# Setup CORS to allow your frontend to connect
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ABS_PATH = os.path.abspath(os.path.dirname(__file__))
STORAGE_BASE = os.path.abspath(os.path.join(ABS_PATH, "..", "storage"))
os.makedirs(os.path.join(STORAGE_BASE, "uploads"), exist_ok=True)
os.makedirs(os.path.join(STORAGE_BASE, "outputs"), exist_ok=True)
app.mount(
    "/storage/uploads",
    StaticFiles(directory=os.path.join(STORAGE_BASE, "uploads")),
    name="uploads"
)
app.mount(
    "/storage/outputs",
    StaticFiles(directory=os.path.join(STORAGE_BASE, "outputs")),
    name="outputs"
)

# Include all the modular routers
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(subtitles_router)
app.include_router(videos_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to AutoSub API",
        "docs": "/docs"
    }
