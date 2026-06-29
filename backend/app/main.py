from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import applications, dashboard, health, notes

app = FastAPI(
    title="Job Search Command Center API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.app.cors_origins_list,
    allow_origin_regex=settings.app.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(applications.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(notes.nested_router, prefix="/api")
app.include_router(notes.flat_router, prefix="/api")
