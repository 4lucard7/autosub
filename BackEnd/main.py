from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from api.auth import router as auth_router
from api.jobs import router as jobs_router
from api.videos import router as videos_router

app = FastAPI(title="AutoSub API")

# Mount storage for video/subtitle access
STORAGE_PATH = os.path.join(os.path.dirname(__file__), "..", "storage")
os.makedirs(STORAGE_PATH, exist_ok=True)
app.mount("/storage", StaticFiles(directory=STORAGE_PATH), name="storage")

# Setup CORS to allow your frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware to ensure CORS headers are sent for StaticFiles
@app.middleware("http")
async def add_cors_to_static(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

# Include all the modular routers
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(videos_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to AutoSub API",
        "docs": "/docs"
    }