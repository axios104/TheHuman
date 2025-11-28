from database import engine
import models

print("Creating all tables...")

# Create all tables
models.Base.metadata.create_all(bind=engine)

print("✅ Database initialized successfully!")
print("\n📋 Tables created:")
for table_name in models.Base.metadata.tables.keys():
    print(f"   ✓ {table_name}")
