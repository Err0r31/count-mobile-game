from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from database import get_db
from models import User, Highscore
from schemas import HighscoreCreate, HighscoreResponse, HighscoreWithUser
from auth import get_current_user

router = APIRouter(prefix="/highscores", tags=["highscores"])

@router.post("", response_model=HighscoreResponse, status_code=status.HTTP_201_CREATED)
def create_highscore(
    highscore: HighscoreCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Создание нового результата (только для авторизованных пользователей)"""
    db_highscore = Highscore(
        user_id=current_user.id,
        score=highscore.score,
        date=highscore.date or datetime.utcnow()
    )
    db.add(db_highscore)
    db.commit()
    db.refresh(db_highscore)
    return db_highscore

@router.get("", response_model=List[HighscoreResponse])
def get_my_highscores(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получение результатов текущего пользователя"""
    highscores = db.query(Highscore).filter(
        Highscore.user_id == current_user.id
    ).order_by(desc(Highscore.score)).offset(skip).limit(limit).all()
    return highscores

@router.get("/leaderboard", response_model=List[HighscoreWithUser])
def get_leaderboard(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Получение таблицы лидеров (топ результатов всех пользователей)"""
    highscores = db.query(Highscore).join(User).order_by(
        desc(Highscore.score)
    ).offset(skip).limit(limit).all()
    
    result = []
    for h in highscores:
        result.append(HighscoreWithUser(
            id=h.id,
            user_id=h.user_id,
            score=h.score,
            date=h.date,
            username=h.user.username
        ))
    return result

@router.get("/{highscore_id}", response_model=HighscoreResponse)
def get_highscore(
    highscore_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получение конкретного результата"""
    highscore = db.query(Highscore).filter(
        Highscore.id == highscore_id,
        Highscore.user_id == current_user.id
    ).first()
    if not highscore:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Highscore not found"
        )
    return highscore

@router.put("/{highscore_id}", response_model=HighscoreResponse)
def update_highscore(
    highscore_id: int,
    highscore: HighscoreCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Обновление результата"""
    db_highscore = db.query(Highscore).filter(
        Highscore.id == highscore_id,
        Highscore.user_id == current_user.id
    ).first()
    if not db_highscore:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Highscore not found"
        )
    db_highscore.score = highscore.score
    if highscore.date:
        db_highscore.date = highscore.date
    db.commit()
    db.refresh(db_highscore)
    return db_highscore

@router.delete("/{highscore_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_highscore(
    highscore_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Удаление результата"""
    db_highscore = db.query(Highscore).filter(
        Highscore.id == highscore_id,
        Highscore.user_id == current_user.id
    ).first()
    if not db_highscore:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Highscore not found"
        )
    db.delete(db_highscore)
    db.commit()
    return None
