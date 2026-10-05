from fastapi import APIRouter, Depends

from app.models.user import User
from app.security.dependencies import get_current_user
from app.security.dependencies import require_role
from app.models.user import UserRole

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