from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Схемы для пользователей
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Схемы для токенов
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Схемы для результатов
class HighscoreBase(BaseModel):
    score: int

class HighscoreCreate(HighscoreBase):
    date: Optional[datetime] = None

class HighscoreResponse(HighscoreBase):
    id: int
    user_id: int
    date: datetime
    
    class Config:
        from_attributes = True

class HighscoreWithUser(HighscoreResponse):
    username: str
