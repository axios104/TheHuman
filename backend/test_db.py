from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import SQLALCHEMY_DATABASE_URL
import models

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

print("\n" + "="*50)
print("DATABASE CHECK")
print("="*50)

# Check users
users = db.query(models.User).all()
print(f"\n👥 USERS ({len(users)}):")
for user in users:
    print(f"  - ID: {user.id}, Email: {user.email}, Name: {user.full_name}")

# Check sectors
sectors = db.query(models.Sector).all()
print(f"\n📊 SECTORS ({len(sectors)}):")
for sector in sectors:
    print(f"  - ID: {sector.id}, Name: {sector.name}, User ID: {sector.user_id}, Active: {sector.is_active}")

# Check goals
goals = db.query(models.Goal).all()
print(f"\n🎯 GOALS ({len(goals)}):")
for goal in goals:
    print(f"  - ID: {goal.id}, Title: {goal.title}, Sector ID: {goal.sector_id}, Completed: {goal.is_completed}")

print("\n" + "="*50 + "\n")

db.close()
