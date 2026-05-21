import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.auth import router as auth_router
from api.jobs import router as jobs_router
from api.videos import router as videos_router
from api.subtitles import router as subtitles_router

app = FastAPI(title="AutoSub API")

# Setup CORS to allow your frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ABS_PATH = os.path.abspath(os.path.dirname(__file__))
STORAGE_BASE = os.path.abspath(os.path.join(ABS_PATH, "..", "storage"))
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
app.include_router(videos_router)
app.include_router(subtitles_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to AutoSub API",
        "docs": "/docs"
    }