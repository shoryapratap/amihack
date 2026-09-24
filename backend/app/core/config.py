import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "Surplus-to-Shelter API"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    DEBUG: bool = True
    APP_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:5173"

    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/surplus_to_shelter?schema=public"
    SQLITE_DB_PATH: str = "surplus_to_shelter.db"

    JWT_SECRET_KEY: str = "surplus-to-shelter-secure-jwt-secret-key-2026-hackathon"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    GEMINI_API_KEY: Optional[str] = ""
    OPENAI_API_KEY: Optional[str] = ""

    TWILIO_ACCOUNT_SID: Optional[str] = ""
    TWILIO_AUTH_TOKEN: Optional[str] = ""
    TWILIO_PHONE_NUMBER: str = "+14155238886"
    TWILIO_WHATSAPP_NUMBER: str = "+14155238886"
    TWILIO_CONTENT_SID: Optional[str] = "HXb5b62575e6e4ff6129ad7c8efe1f983e"
    DEFAULT_RESTAURANT_NUMBER: str = "+919829407512"

    WHATSAPP_RATE_LIMIT_PER_MINUTE: int = 10

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
