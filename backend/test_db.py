from database import engine, SessionLocal
from sqlalchemy import text

def test_connection():
    try:
        # Test connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✓ Database connection successful!")
            
        # Test session
        db = SessionLocal()
        print("✓ Database session created successfully!")
        db.close()
        
        # List tables
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema='public'
            """))
            tables = [row[0] for row in result]
            print(f"✓ Tables created: {', '.join(tables)}")
            
    except Exception as e:
        print(f"✗ Database connection failed: {e}")

if __name__ == "__main__":
    test_connection()
