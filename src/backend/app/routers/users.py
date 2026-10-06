from fastapi import APIRouter, Depends

from app.models.user import User
from app.security.dependencies import get_current_user
from app.security.dependencies import require_role
from app.models.user import UserRole
from app.models.user import User, UserRole
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.security.dependencies import get_current_user, require_role

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role.value,
        "department": (
            current_user.department.value
            if current_user.department
            else None   
        )
    }
@router.get("/doctor-area")
def doctor_area(
    current_user: User = Depends(
        require_role(UserRole.DOCTOR)
    ),
):
    return {
        "message": "Doctor area accessed",
        "doctor_id": current_user.id,
        "name": current_user.name,
    }
@router.get("/doctors")
def get_doctors(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doctors = (
        db.query(User)
        .filter(
            User.role == UserRole.DOCTOR,
            User.is_active == 1,
        )
        .all()
    )

    return [
        {
            "id": doctor.id,
            "name": doctor.name,
            "email": doctor.email,
            "department": (
                doctor.department.value
                if doctor.department
                else None
            ),
        }
        for doctor in doctors
    ]