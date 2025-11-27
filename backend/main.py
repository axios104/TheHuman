from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import timedelta, datetime, date
from typing import List
import models
import schemas
import auth
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HUMAN API", version="2.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to update streak
def update_user_streak(user: models.User, db: Session):
    """Update user's login streak"""
    today = date.today()
    
    if user.updated_at:
        last_login = user.updated_at.date()
        days_diff = (today - last_login).days
        
        if days_diff == 0:
            pass
        elif days_diff == 1:
            user.streak_days += 1
        else:
            user.streak_days = 1
    else:
        user.streak_days = 1
    
    user.updated_at = datetime.now()
    db.commit()

@app.get("/")
async def root():
    return {"message": "HUMAN API - Your Evolution Starts Here", "version": "2.0.0"}

# ===== AUTHENTICATION ENDPOINTS =====

@app.post("/api/auth/signup", response_model=schemas.TokenResponse)
async def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user account"""
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        streak_days=1
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create 5 default sectors for new user
    default_sectors = [
        {
            "name": "Health & Wellness",
            "sector_type": models.SectorType.HEALTH,
            "description": "Track your physical health, nutrition, and wellness journey",
            "color": "#10b981",
            "icon": "💪"
        },
        {
            "name": "Financial Growth",
            "sector_type": models.SectorType.FINANCE,
            "description": "Manage your finances, savings, and investments",
            "color": "#f59e0b",
            "icon": "💰"
        },
        {
            "name": "Career Development",
            "sector_type": models.SectorType.CAREER,
            "description": "Advance your professional skills and career goals",
            "color": "#8b5cf6",
            "icon": "🚀"
        },
        {
            "name": "Learning & Growth",
            "sector_type": models.SectorType.LEARNING,
            "description": "Expand your knowledge and learn new skills",
            "color": "#06b6d4",
            "icon": "📚"
        },
        {
            "name": "Mental Wellness",
            "sector_type": models.SectorType.MENTAL_HEALTH,
            "description": "Focus on mental health, mindfulness, and self-care",
            "color": "#ec4899",
            "icon": "🧘"
        }
    ]
    
    for sector_data in default_sectors:
        new_sector = models.Sector(
            user_id=new_user.id,
            **sector_data
        )
        db.add(new_sector)
    
    db.commit()
    
    access_token = auth.create_access_token(data={"sub": new_user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@app.post("/api/auth/login", response_model=schemas.TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login with email and password"""
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    update_user_streak(user, db)
    
    access_token = auth.create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/api/users/me", response_model=schemas.UserResponse)
async def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    """Get current user information"""
    return current_user

# ===== SECTOR ENDPOINTS =====

@app.post("/api/sectors", response_model=schemas.SectorResponse)
async def create_sector(
    sector: schemas.SectorCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new sector for the user"""
    new_sector = models.Sector(
        user_id=current_user.id,
        **sector.dict()
    )
    db.add(new_sector)
    db.commit()
    db.refresh(new_sector)
    return new_sector

@app.post("/api/sectors", response_model=schemas.SectorResponse)
async def create_sector(
    sector: schemas.SectorCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new sector for the user"""
    # Convert string enum to database enum
    sector_type_value = models.SectorType[sector.sector_type]
    
    new_sector = models.Sector(
        user_id=current_user.id,
        name=sector.name,
        sector_type=sector_type_value,
        description=sector.description,
        color=sector.color,
        icon=sector.icon
    )
    db.add(new_sector)
    db.commit()
    db.refresh(new_sector)
    return new_sector


@app.get("/api/sectors/{sector_id}", response_model=schemas.SectorDetailResponse)
async def get_sector_detail(
    sector_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed sector information"""
    sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    return sector

# ===== ANALYTICS ENDPOINTS =====

@app.get("/api/sectors/{sector_id}/analytics")
async def get_sector_analytics(
    sector_id: int,
    timeframe: str = "week",
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get analytics data for a sector"""
    sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    # Calculate date range
    now = datetime.now()
    if timeframe == "week":
        start_date = now - timedelta(days=7)
    elif timeframe == "month":
        start_date = now - timedelta(days=30)
    elif timeframe == "year":
        start_date = now - timedelta(days=365)
    else:
        start_date = datetime(2000, 1, 1)
    
    # Get message count
    message_count = db.query(func.count(models.Message.id)).filter(
        models.Message.sector_id == sector_id,
        models.Message.created_at >= start_date
    ).scalar()
    
    # Get goal stats
    total_goals = db.query(func.count(models.Goal.id)).filter(
        models.Goal.sector_id == sector_id
    ).scalar()
    
    completed_goals = db.query(func.count(models.Goal.id)).filter(
        models.Goal.sector_id == sector_id,
        models.Goal.is_completed == True
    ).scalar()
    
    # Get activity by day
    activity_data = db.query(
        func.date(models.Message.created_at).label('date'),
        func.count(models.Message.id).label('count')
    ).filter(
        models.Message.sector_id == sector_id,
        models.Message.created_at >= start_date
    ).group_by(func.date(models.Message.created_at)).all()
    
    # Get statistics data
    stats = db.query(models.Statistic).filter(
        models.Statistic.sector_id == sector_id,
        models.Statistic.recorded_at >= start_date
    ).order_by(models.Statistic.recorded_at).all()
    
    # Calculate progress
    progress = 0
    if total_goals > 0:
        progress = int((completed_goals / total_goals) * 100)
    
    return {
        "sector": sector,
        "message_count": message_count or 0,
        "total_goals": total_goals or 0,
        "completed_goals": completed_goals or 0,
        "progress": progress,
        "activity_data": [{"date": str(a.date), "count": a.count} for a in activity_data],
        "statistics": stats,
        "timeframe": timeframe
    }

@app.post("/api/sectors/{sector_id}/activity")
async def track_activity(
    sector_id: int,
    activity: dict,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Track user activity in a sector"""
    sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    stat = models.Statistic(
        sector_id=sector_id,
        metric_name=activity.get("metric_name", "activity"),
        value=activity.get("value", 1),
        unit=activity.get("unit"),
        extra_data=activity.get("extra_data")
    )
    db.add(stat)
    db.commit()
    
    return {"success": True, "message": "Activity tracked"}

# ===== MESSAGE/CHAT ENDPOINTS =====

@app.post("/api/sectors/{sector_id}/messages", response_model=schemas.MessageResponse)
async def send_message(
    sector_id: int,
    message: schemas.MessageCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message in a sector and get AI response"""
    sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    user_message = models.Message(
        sector_id=sector_id,
        content=message.content,
        is_user=True
    )
    db.add(user_message)
    db.commit()
    
    ai_response_text = f"I understand you said '{message.content}'. Let me help you with that in the context of {sector.sector_type.value}."
    
    ai_message = models.Message(
        sector_id=sector_id,
        content=ai_response_text,
        is_user=False,
        ai_model="gpt-4"
    )
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)
    
    return ai_message

@app.get("/api/sectors/{sector_id}/messages", response_model=List[schemas.MessageResponse])
async def get_sector_messages(
    sector_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
    limit: int = 50
):
    """Get chat history for a sector"""
    sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    messages = db.query(models.Message).filter(
        models.Message.sector_id == sector_id
    ).order_by(models.Message.created_at.desc()).limit(limit).all()
    
    return list(reversed(messages))

# ===== GOAL ENDPOINTS =====

@app.post("/api/sectors/{sector_id}/goals", response_model=schemas.GoalResponse)
async def create_goal(
    sector_id: int,
    goal: schemas.GoalCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new goal in a sector"""
    sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    new_goal = models.Goal(sector_id=sector_id, **goal.dict())
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@app.get("/api/sectors/{sector_id}/goals", response_model=List[schemas.GoalResponse])
async def get_sector_goals(
    sector_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all goals for a sector"""
    goals = db.query(models.Goal).filter(
        models.Goal.sector_id == sector_id
    ).all()
    return goals

@app.put("/api/goals/{goal_id}/complete")
async def complete_goal(
    goal_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a goal as completed"""
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    sector = db.query(models.Sector).filter(
        models.Sector.id == goal.sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not sector:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    goal.is_completed = True
    goal.completed_at = datetime.now()
    
    current_user.total_points += 10
    
    db.commit()
    
    return {"success": True, "points_earned": 10}

# ===== STATISTICS ENDPOINTS =====

@app.post("/api/sectors/{sector_id}/statistics", response_model=schemas.StatisticResponse)
async def add_statistic(
    sector_id: int,
    stat: schemas.StatisticCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Add a data point to sector statistics"""
    new_stat = models.Statistic(sector_id=sector_id, **stat.dict())
    db.add(new_stat)
    db.commit()
    db.refresh(new_stat)
    return new_stat

@app.get("/api/sectors/{sector_id}/statistics", response_model=List[schemas.StatisticResponse])
async def get_sector_statistics(
    sector_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
    metric_name: str = None
):
    """Get statistics for a sector"""
    query = db.query(models.Statistic).filter(models.Statistic.sector_id == sector_id)
    
    if metric_name:
        query = query.filter(models.Statistic.metric_name == metric_name)
    
    stats = query.order_by(models.Statistic.recorded_at.desc()).all()
    return stats

# ===== BADGE ENDPOINTS =====

@app.get("/api/badges", response_model=List[schemas.BadgeResponse])
async def get_all_badges(db: Session = Depends(get_db)):
    """Get all available badges"""
    badges = db.query(models.Badge).all()
    return badges

@app.get("/api/users/me/badges", response_model=List[schemas.UserBadgeResponse])
async def get_user_badges(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get badges earned by current user"""
    user_badges = db.query(models.UserBadge).filter(
        models.UserBadge.user_id == current_user.id
    ).all()
    return user_badges
