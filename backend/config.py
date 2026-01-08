"""
Конфигурация приложения
Использует переменные окружения из .env файла или значения по умолчанию
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Настройки приложения
    APP_NAME: str = "Count Game API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Настройки базы данных
    DATABASE_URL: str = "sqlite:///./game.db"
    
    # Настройки JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 * 24 * 60  # 30 дней
    
    # Настройки CORS
    CORS_ORIGINS: List[str] = ["*"]  # В продакшене указать конкретные домены
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Настройки сервера
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Создаем экземпляр настроек
settings = Settings()
