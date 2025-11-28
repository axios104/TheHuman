from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums
class SectorTypeEnum(str, Enum):
    HEALTH = "HEALTH"
    FINANCE = "FINANCE"
    CAREER = "CAREER"
    RELATIONSHIPS = "RELATIONSHIPS"
    LEARNING = "LEARNING"
    CREATIVITY = "CREATIVITY"
    FITNESS = "FITNESS"
    MENTAL_HEALTH = "MENTAL_HEALTH"

class BadgeTypeEnum(str, Enum):
    BRONZE = "bronze"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"
    DIAMOND = "diamond"

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

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

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Sector Schemas
class SectorCreate(BaseModel):
    name: str
    sector_type: SectorTypeEnum
    description: Optional[str] = None
    color: str = "#0df2f2"
    icon: str = "📊"

class SectorResponse(BaseModel):
    id: int
    name: str
    sector_type: str
    description: Optional[str]
    color: str
    icon: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Message Schemas
class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    sector_id: int
    content: str
    is_user: bool
    ai_model: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Goal Schemas
class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    target_value: Optional[float] = None
    unit: Optional[str] = None
    deadline: Optional[datetime] = None

class GoalResponse(BaseModel):
    id: int
    sector_id: int
    title: str
    description: Optional[str]
    target_value: Optional[float]
    current_value: float
    unit: Optional[str]
    deadline: Optional[datetime]
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Statistic Schemas
class StatisticCreate(BaseModel):
    metric_name: str
    value: float
    unit: Optional[str] = None
    extra_data: Optional[dict] = None

class StatisticResponse(BaseModel):
    id: int
    sector_id: int
    metric_name: str
    value: float
    unit: Optional[str]
    recorded_at: datetime
    extra_data: Optional[dict]

    class Config:
        from_attributes = True

# Badge Schemas
class BadgeResponse(BaseModel):
    id: int
    name: str
    description: str
    badge_type: str
    icon: str
    points_value: int

    class Config:
        from_attributes = True

class UserBadgeResponse(BaseModel):
    id: int
    badge: BadgeResponse
    earned_at: datetime

    class Config:
        from_attributes = True

# Sector Detail (with nested data)
class SectorDetailResponse(BaseModel):
    id: int
    name: str
    sector_type: str
    description: Optional[str]
    color: str
    icon: str
    is_active: bool
    created_at: datetime
    messages: List[MessageResponse] = []
    goals: List[GoalResponse] = []

    class Config:
        from_attributes = True

# Add these to your existing schemas.py

class ConversationMessageCreate(BaseModel):
    content: str
    role: str  # 'user' or 'assistant'
    model_used: Optional[str] = None

class ConversationMessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    model_used: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    title: str = "New Conversation"

class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    is_pinned: Optional[bool] = None

class ConversationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: datetime
    updated_at: datetime
    is_pinned: bool
    message_count: Optional[int] = 0

    class Config:
        from_attributes = True

class ConversationDetailResponse(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: datetime
    updated_at: datetime
    is_pinned: bool
    conversation_messages: List[ConversationMessageResponse] = []

    class Config:
        from_attributes = True

