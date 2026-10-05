from app.database import SessionLocal
from app.models.user import User, UserRole
from app.security.password import hash_password


db = SessionLocal()

admin = User(
    name="Security Admin",
    email="admin@medidesk.local",
    password_hash=hash_password("Admin@12345"),
    role=UserRole.ADMIN,
    is_active=1,
)

db.add(admin)
db.commit()

print("Admin created")

db.close()