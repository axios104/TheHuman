from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ==================== USER SCHEMAS ====================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    human_level: int
    total_points: int
    streak_days: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== SECTOR SCHEMAS ====================

class SectorCreate(BaseModel):
    name: str
    sector_type: str
    description: Optional[str] = None
    color: str = "#0df2f2"
    icon: str = "📊"

class SectorUpdate(BaseModel):
    name: Optional[str] = None
    sector_type: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None

class SectorResponse(BaseModel):
    id: int
    user_id: int
    name: str
    sector_type: str
    description: Optional[str] = None
    color: str
    icon: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== MESSAGE SCHEMAS ====================

class MessageCreate(BaseModel):
    content: str
    is_user: bool = True

class MessageResponse(BaseModel):
    id: int
    sector_id: int
    content: str
    is_user: bool
    ai_model: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== GOAL SCHEMAS ====================

class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = 0
    unit: Optional[str] = None
    deadline: Optional[str] = None

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    unit: Optional[str] = None
    deadline: Optional[str] = None
    is_completed: Optional[bool] = None

class GoalResponse(BaseModel):
    id: int
    sector_id: int
    title: str
    description: Optional[str] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    unit: Optional[str] = None
    deadline: Optional[str] = None
    is_completed: bool
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== CONVERSATION SCHEMAS ====================

class ConversationCreate(BaseModel):
    title: str

class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    is_pinned: Optional[bool] = None

class ConversationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    is_pinned: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ConversationListResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    is_pinned: bool
    message_count: int

    class Config:
        from_attributes = True


# ==================== CONVERSATION MESSAGE SCHEMAS ====================

class ConversationMessageCreate(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str
    model_used: Optional[str] = None

class ConversationMessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    model_used: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== STATISTIC SCHEMAS ====================

class StatisticCreate(BaseModel):
    metric_name: str
    metric_value: float
    notes: Optional[str] = None

class StatisticResponse(BaseModel):
    id: int
    sector_id: int
    metric_name: str
    metric_value: float
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== BADGE SCHEMAS ====================

class BadgeResponse(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    requirement: str
    points: int

    class Config:
        from_attributes = True

class UserBadgeResponse(BaseModel):
    id: int
    user_id: int
    badge_id: int
    earned_at: datetime
    badge: BadgeResponse

    class Config:
        from_attributes = True


class SavedNewsCreate(BaseModel):
    title: str
    description: Optional[str] = None
    url: str
    image: Optional[str] = None
    source: Optional[str] = None
    published_at: Optional[str] = None
    category: Optional[str] = None

class SavedNewsResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    url: str
    image: Optional[str] = None
    source: Optional[str] = None
    published_at: Optional[str] = None
    category: Optional[str] = None
    saved_at: datetime

    class Config:
        from_attributes = True
