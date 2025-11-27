from database import engine, Base
from models import User, Sector, Message, Goal, Statistic, Badge, UserBadge, Attachment
import models

def init_database():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")

if __name__ == "__main__":
    init_database()
