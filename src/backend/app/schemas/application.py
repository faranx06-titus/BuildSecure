from pydantic import BaseModel, EmailStr


class ProfessionalApplicationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None

    profession: str
    department: str

    specialization: str | None = None
    experience_years: int | None = None

    reason: str | None = None