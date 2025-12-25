from fastapi import FastAPI
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base

from app.models.recipe import Recipe  # noqa: F401
from app.api.recipes import router as recipes_router

app = FastAPI(title="Healthy Recipes API")

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(recipes_router)

@app.get("/health")
def health():
    return {"status": "ok", "sqlite_path": settings.SQLITE_PATH}
