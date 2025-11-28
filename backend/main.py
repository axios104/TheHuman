from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import models
import schemas
import auth
from database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HUMAN API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== AUTH ENDPOINTS ====================

@app.post("/api/auth/signup", response_model=schemas.UserResponse)
async def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    # Check if user exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    print(f"✅ User created: {db_user.email}")
    
    # Create default sectors
    default_sectors = [
        {"name": "Health & Fitness", "sector_type": "HEALTH", "icon": "💪", "color": "#10b981"},
        {"name": "Finance & Money", "sector_type": "FINANCE", "icon": "💰", "color": "#f59e0b"},
        {"name": "Career & Work", "sector_type": "CAREER", "icon": "🚀", "color": "#8b5cf6"},
        {"name": "Learning & Skills", "sector_type": "LEARNING", "icon": "📚", "color": "#06b6d4"},
        {"name": "Mental Wellness", "sector_type": "MENTAL_HEALTH", "icon": "🧘", "color": "#ec4899"},
    ]
    
    for sector_data in default_sectors:
        sector = models.Sector(
            user_id=db_user.id,
            name=sector_data["name"],
            sector_type=sector_data["sector_type"],
            icon=sector_data["icon"],
            color=sector_data["color"]
        )
        db.add(sector)
    
    db.commit()
    print(f"✅ Created 5 default sectors for user {db_user.email}")
    
    return db_user


@app.post("/api/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    print(f"✅ User logged in: {user.email}")
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/users/me", response_model=schemas.UserResponse)
async def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    """Get current user info"""
    return current_user


# ==================== SECTOR ENDPOINTS ====================

@app.get("/api/sectors", response_model=List[schemas.SectorResponse])
async def get_all_sectors(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all sectors for the current user"""
    sectors = db.query(models.Sector).filter(
        models.Sector.user_id == current_user.id,
        models.Sector.is_active == True
    ).order_by(models.Sector.created_at.desc()).all()
    
    print(f"✅ Fetched {len(sectors)} sectors for user {current_user.id}")
    
    return sectors


@app.get("/api/sectors/{sector_id}", response_model=schemas.SectorResponse)
async def get_sector(
    sector_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific sector"""
    sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    return sector


@app.post("/api/sectors", response_model=schemas.SectorResponse)
async def create_sector(
    sector: schemas.SectorCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new sector"""
    db_sector = models.Sector(
        user_id=current_user.id,
        **sector.dict()
    )
    db.add(db_sector)
    db.commit()
    db.refresh(db_sector)
    
    print(f"✅ Sector created: {db_sector.name} for user {current_user.id}")
    
    return db_sector


@app.put("/api/sectors/{sector_id}", response_model=schemas.SectorResponse)
async def update_sector(
    sector_id: int,
    sector: schemas.SectorUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update a sector"""
    db_sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not db_sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    for key, value in sector.dict(exclude_unset=True).items():
        setattr(db_sector, key, value)
    
    db.commit()
    db.refresh(db_sector)
    
    return db_sector


@app.delete("/api/sectors/{sector_id}")
async def delete_sector(
    sector_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a sector"""
    db_sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not db_sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    db_sector.is_active = False
    db.commit()
    
    return {"message": "Sector deleted successfully"}


@app.get("/api/sectors/{sector_id}/messages", response_model=List[schemas.MessageResponse])
async def get_sector_messages(
    sector_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get messages for a sector"""
    sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    messages = db.query(models.Message).filter(
        models.Message.sector_id == sector_id
    ).order_by(models.Message.created_at.asc()).all()
    
    return messages


@app.post("/api/sectors/{sector_id}/messages", response_model=schemas.MessageResponse)
async def create_sector_message(
    sector_id: int,
    message: schemas.MessageCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a message in a sector"""
    sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    db_message = models.Message(
        sector_id=sector_id,
        **message.dict()
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    return db_message


# ==================== GOAL ENDPOINTS ====================

@app.get("/api/goals", response_model=List[schemas.GoalResponse])
async def get_all_goals(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all goals for the current user"""
    sectors = db.query(models.Sector).filter(
        models.Sector.user_id == current_user.id
    ).all()
    
    sector_ids = [s.id for s in sectors]
    
    if not sector_ids:
        print(f"⚠️ No sectors found for user {current_user.id}")
        return []
    
    goals = db.query(models.Goal).filter(
        models.Goal.sector_id.in_(sector_ids)
    ).order_by(models.Goal.created_at.desc()).all()
    
    print(f"✅ Fetched {len(goals)} goals for user {current_user.id}")
    
    return goals


@app.get("/api/sectors/{sector_id}/goals", response_model=List[schemas.GoalResponse])
async def get_sector_goals(
    sector_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get goals for a specific sector"""
    sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    goals = db.query(models.Goal).filter(
        models.Goal.sector_id == sector_id
    ).all()
    
    return goals


@app.post("/api/sectors/{sector_id}/goals", response_model=schemas.GoalResponse)
async def create_goal(
    sector_id: int,
    goal: schemas.GoalCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new goal"""
    sector = db.query(models.Sector).filter(
        models.Sector.id == sector_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    db_goal = models.Goal(
        sector_id=sector_id,
        **goal.dict()
    )
    db.add(db_goal)
    
    # Award points
    current_user.total_points += 5
    
    db.commit()
    db.refresh(db_goal)
    
    print(f"✅ Goal created: {db_goal.title}")
    
    return db_goal


@app.put("/api/goals/{goal_id}", response_model=schemas.GoalResponse)
async def update_goal(
    goal_id: int,
    goal: schemas.GoalUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update a goal"""
    db_goal = db.query(models.Goal).join(models.Sector).filter(
        models.Goal.id == goal_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    for key, value in goal.dict(exclude_unset=True).items():
        setattr(db_goal, key, value)
    
    db.commit()
    db.refresh(db_goal)
    
    return db_goal


@app.put("/api/goals/{goal_id}/complete", response_model=schemas.GoalResponse)
async def complete_goal(
    goal_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a goal as complete"""
    db_goal = db.query(models.Goal).join(models.Sector).filter(
        models.Goal.id == goal_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    if not db_goal.is_completed:
        db_goal.is_completed = True
        from datetime import datetime
        db_goal.completed_at = datetime.utcnow()
        
        # Award points
        current_user.total_points += 10
        
        db.commit()
        db.refresh(db_goal)
        
        print(f"✅ Goal completed: {db_goal.title}")
    
    return db_goal


@app.delete("/api/goals/{goal_id}")
async def delete_goal(
    goal_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a goal"""
    db_goal = db.query(models.Goal).join(models.Sector).filter(
        models.Goal.id == goal_id,
        models.Sector.user_id == current_user.id
    ).first()
    
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    db.delete(db_goal)
    db.commit()
    
    return {"message": "Goal deleted successfully"}


# ==================== CONVERSATION ENDPOINTS ====================

@app.get("/api/conversations", response_model=List[schemas.ConversationListResponse])
async def get_conversations(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversations for the current user"""
    conversations = db.query(models.Conversation).filter(
        models.Conversation.user_id == current_user.id
    ).order_by(models.Conversation.updated_at.desc()).all()
    
    # Add message count
    result = []
    for conv in conversations:
        message_count = db.query(func.count(models.ConversationMessage.id)).filter(
            models.ConversationMessage.conversation_id == conv.id
        ).scalar()
        
        conv_dict = schemas.ConversationListResponse(
            id=conv.id,
            title=conv.title,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            is_pinned=conv.is_pinned,
            message_count=message_count
        )
        result.append(conv_dict)
    
    return result


@app.post("/api/conversations", response_model=schemas.ConversationResponse)
async def create_conversation(
    conversation: schemas.ConversationCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new conversation"""
    # Check limit
    count = db.query(func.count(models.Conversation.id)).filter(
        models.Conversation.user_id == current_user.id
    ).scalar()
    
    if count >= 5:
        raise HTTPException(status_code=400, detail="Maximum 5 conversations allowed")
    
    db_conversation = models.Conversation(
        user_id=current_user.id,
        **conversation.dict()
    )
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    
    return db_conversation


@app.get("/api/conversations/{conversation_id}/messages", response_model=List[schemas.ConversationMessageResponse])
async def get_conversation_messages(
    conversation_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get messages for a conversation"""
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id,
        models.Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(models.ConversationMessage).filter(
        models.ConversationMessage.conversation_id == conversation_id
    ).order_by(models.ConversationMessage.created_at.asc()).all()
    
    return messages


@app.post("/api/conversations/{conversation_id}/messages", response_model=schemas.ConversationMessageResponse)
async def add_conversation_message(
    conversation_id: int,
    message: schemas.ConversationMessageCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Add a message to a conversation"""
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id,
        models.Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    db_message = models.ConversationMessage(
        conversation_id=conversation_id,
        **message.dict()
    )
    db.add(db_message)
    
    # Update conversation timestamp
    from datetime import datetime
    conversation.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_message)
    
    return db_message


@app.put("/api/conversations/{conversation_id}", response_model=schemas.ConversationResponse)
async def update_conversation(
    conversation_id: int,
    conversation: schemas.ConversationUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update a conversation"""
    db_conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id,
        models.Conversation.user_id == current_user.id
    ).first()
    
    if not db_conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    for key, value in conversation.dict(exclude_unset=True).items():
        setattr(db_conversation, key, value)
    
    db.commit()
    db.refresh(db_conversation)
    
    return db_conversation


@app.delete("/api/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a conversation"""
    db_conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id,
        models.Conversation.user_id == current_user.id
    ).first()
    
    if not db_conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    db.delete(db_conversation)
    db.commit()
    
    return {"message": "Conversation deleted successfully"}


# ==================== BADGE ENDPOINTS ====================

@app.get("/api/badges/check-progress")
async def check_badge_progress(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Check user's progress on all badges"""
    
    # Count sectors
    sector_count = db.query(func.count(models.Sector.id)).filter(
        models.Sector.user_id == current_user.id
    ).scalar()
    
    # Count completed goals
    sectors = db.query(models.Sector).filter(models.Sector.user_id == current_user.id).all()
    sector_ids = [s.id for s in sectors]
    completed_goals = db.query(func.count(models.Goal.id)).filter(
        models.Goal.sector_id.in_(sector_ids),
        models.Goal.is_completed == True
    ).scalar() if sector_ids else 0
    
    # Count conversations with 5+ messages
    conversations = db.query(models.Conversation).filter(
        models.Conversation.user_id == current_user.id
    ).all()
    
    ai_conversations = 0
    for conv in conversations:
        msg_count = db.query(func.count(models.ConversationMessage.id)).filter(
            models.ConversationMessage.conversation_id == conv.id
        ).scalar()
        if msg_count >= 5:
            ai_conversations += 1
    
    return {
        "profile_complete": True,
        "sectors_created": sector_count,
        "goals_completed": completed_goals,
        "streak_days": current_user.streak_days,
        "ai_conversations": ai_conversations,
        "zone_out_uses": 0,
        "news_articles_read": 0,
        "user_level": current_user.human_level
    }


@app.get("/")
async def root():
    return {"message": "HUMAN API is running"}

# ==================== SAVED NEWS ENDPOINTS ====================

@app.get("/api/saved-news", response_model=List[schemas.SavedNewsResponse])
async def get_saved_news(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all saved news for the current user"""
    saved_news = db.query(models.SavedNews).filter(
        models.SavedNews.user_id == current_user.id
    ).order_by(models.SavedNews.saved_at.desc()).all()
    
    print(f"✅ Fetched {len(saved_news)} saved news for user {current_user.id}")
    
    return saved_news


@app.post("/api/saved-news", response_model=schemas.SavedNewsResponse)
async def save_news(
    news: schemas.SavedNewsCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Save a news article"""
    # Check if already saved
    existing = db.query(models.SavedNews).filter(
        models.SavedNews.user_id == current_user.id,
        models.SavedNews.url == news.url
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="News already saved")
    
    db_news = models.SavedNews(
        user_id=current_user.id,
        **news.dict()
    )
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    
    print(f"✅ News saved: {db_news.title}")
    
    return db_news


@app.delete("/api/saved-news/{news_id}")
async def delete_saved_news(
    news_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a saved news article"""
    db_news = db.query(models.SavedNews).filter(
        models.SavedNews.id == news_id,
        models.SavedNews.user_id == current_user.id
    ).first()
    
    if not db_news:
        raise HTTPException(status_code=404, detail="Saved news not found")
    
    db.delete(db_news)
    db.commit()
    
    return {"message": "Saved news deleted successfully"}
