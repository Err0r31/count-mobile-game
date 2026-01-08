# Backend API для Count Mobile Game

FastAPI бэкенд с SQLite базой данных для мобильной игры на счет.

## Установка

1. Создайте виртуальное окружение:
```bash
python -m venv venv
```

2. Активируйте виртуальное окружение:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

## Конфигурация

1. Скопируйте файл `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Отредактируйте `.env` и укажите свои настройки:
   - **SECRET_KEY** - обязательно измените на случайную строку для продакшена!
   - **CORS_ORIGINS** - укажите домены вашего фронтенда
   - Остальные настройки можно оставить по умолчанию

3. Для генерации SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Запуск

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Или используйте настройки из конфигурации:
```bash
uvicorn main:app --reload --host ${HOST} --port ${PORT}
```

API будет доступен по адресу: http://localhost:8000

Документация API: http://localhost:8000/docs

## Структура API

### Аутентификация
- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/login` - Авторизация (получение токена)
- `GET /api/auth/me` - Информация о текущем пользователе

### Результаты игры
- `POST /api/highscores` - Создание нового результата
- `GET /api/highscores` - Получение результатов текущего пользователя
- `GET /api/highscores/leaderboard` - Таблица лидеров
- `GET /api/highscores/{id}` - Получение конкретного результата
- `PUT /api/highscores/{id}` - Обновление результата
- `DELETE /api/highscores/{id}` - Удаление результата

## База данных

SQLite база данных создается автоматически в файле `game.db` при первом запуске.
