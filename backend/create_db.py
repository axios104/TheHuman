from database import engine
import models

# Drop all tables and recreate
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

print("✅ Database created successfully!")
