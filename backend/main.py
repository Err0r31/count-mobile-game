from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, highscores
from config import settings

# Создание таблиц в БД
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="API для мобильной игры на счет",
    version=settings.APP_VERSION
)

# Настройка CORS для работы с мобильным приложением
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# Подключение роутеров
app.include_router(auth.router, prefix="/api")
app.include_router(highscores.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Count Game API", "version": "1.0.0"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
