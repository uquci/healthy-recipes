from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    BACKEND_PORT: int = 8000
    SQLITE_PATH: str = "app/data/app.db"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
