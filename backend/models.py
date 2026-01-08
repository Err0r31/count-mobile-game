from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Связь с результатами
    highscores = relationship("Highscore", back_populates="user", cascade="all, delete-orphan")

class Highscore(Base):
    __tablename__ = "highscores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Связь с пользователем
    user = relationship("User", back_populates="highscores")
