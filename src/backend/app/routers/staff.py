from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.security.permissions import Permission, require_permission

router = APIRouter(
    prefix="/staff",
    tags=["Staff Workspaces"],
)


@router.get("/profile")
def staff_profile(
    current_user: User = Depends(
        require_permission(Permission.VIEW_STAFF)
    ),
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
        ),
    }


@router.get("/directory")
def staff_directory(
    current_user: User = Depends(
        require_permission(Permission.VIEW_STAFF)
    ),
    db: Session = Depends(get_db),
):
    staff = (
        db.query(User)
        .filter(User.role == "STAFF")
        .all()
    )

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "department": (
                user.department.value
                if user.department
                else None
            ),
        }
        for user in staff
    ]