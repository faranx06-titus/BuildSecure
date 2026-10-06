from sqlalchemy import Column, Integer, String, Enum
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"
    ADMIN = "admin"
    STAFF = "staff"


class UserDepartment(str, enum.Enum):
    MEDICAL = "medical"
    FINANCE = "finance"
    HR = "hr"
    OPERATIONS = "operations"
    SECURITY = "security"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash = Column(String(255), nullable=False)

    role = Column(
        Enum(UserRole),
        nullable=False,
    )

    department = Column(
        Enum(UserDepartment),
        nullable=True,
    )

    is_active = Column(
        Integer,
        default=1,
    )