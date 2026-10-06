from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database import Base


class ProfessionalApplication(Base):
    __tablename__ = "professional_applications"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)

    profession = Column(String(50), nullable=False)
    department = Column(String(50), nullable=False)

    specialization = Column(String(100), nullable=True)
    experience_years = Column(Integer, nullable=True)

    reason = Column(Text, nullable=True)

    status = Column(
        String(30),
        default="pending",
        nullable=False,
    )

    reviewed_by = Column(Integer, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )