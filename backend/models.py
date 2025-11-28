from sqlalchemy import Boolean, Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

# Enums
class SectorType(enum.Enum):
    HEALTH = "HEALTH"
    FINANCE = "FINANCE"
    CAREER = "CAREER"
    RELATIONSHIPS = "RELATIONSHIPS"
    LEARNING = "LEARNING"
    CREATIVITY = "CREATIVITY"
    FITNESS = "FITNESS"
    MENTAL_HEALTH = "MENTAL_HEALTH"

class BadgeType(enum.Enum):
    BRONZE = "bronze"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"
    DIAMOND = "diamond"

# User Model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    human_level = Column(Integer, default=1)
    total_points = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sectors = relationship("Sector", back_populates="user", cascade="all, delete-orphan")
    badges = relationship("UserBadge", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")

# Sector Model
class Sector(Base):
    __tablename__ = "sectors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    sector_type = Column(SQLEnum(SectorType))
    description = Column(Text, nullable=True)
    color = Column(String, default="#0df2f2")
    icon = Column(String, default="📊")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="sectors")
    messages = relationship("Message", back_populates="sector", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="sector", cascade="all, delete-orphan")
    statistics = relationship("Statistic", back_populates="sector", cascade="all, delete-orphan")

# Message Model (for sector chats)
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sector_id = Column(Integer, ForeignKey("sectors.id"))
    content = Column(Text)
    is_user = Column(Boolean)
    ai_model = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    sector = relationship("Sector", back_populates="messages")

# Goal Model
class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    sector_id = Column(Integer, ForeignKey("sectors.id"))
    title = Column(String)
    description = Column(Text, nullable=True)
    target_value = Column(Float, nullable=True)
    current_value = Column(Float, default=0)
    unit = Column(String, nullable=True)
    deadline = Column(DateTime, nullable=True)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    sector = relationship("Sector", back_populates="goals")

# Statistic Model
class Statistic(Base):
    __tablename__ = "statistics"

    id = Column(Integer, primary_key=True, index=True)
    sector_id = Column(Integer, ForeignKey("sectors.id"))
    metric_name = Column(String)
    value = Column(Float)
    unit = Column(String, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    extra_data = Column(JSON, nullable=True)

    # Relationships
    sector = relationship("Sector", back_populates="statistics")

# Badge Model
class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    badge_type = Column(SQLEnum(BadgeType))
    icon = Column(String)
    points_value = Column(Integer, default=0)

    # Relationships
    user_badges = relationship("UserBadge", back_populates="badge", cascade="all, delete-orphan")

# UserBadge Model
class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    badge_id = Column(Integer, ForeignKey("badges.id"))
    earned_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="badges")
    badge = relationship("Badge", back_populates="user_badges")

# Conversation Model (for AI Advisor)
class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, default="New Conversation")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_pinned = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    conversation_messages = relationship("ConversationMessage", back_populates="conversation", cascade="all, delete-orphan")

# ConversationMessage Model
class ConversationMessage(Base):
    __tablename__ = "conversation_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    role = Column(String)  # 'user' or 'assistant'
    content = Column(Text)
    model_used = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="conversation_messages")
