from fastapi import APIRouter, Depends

from app.models.user import User
from app.security.permissions import Permission, require_permission

router = APIRouter(
    prefix="/hr",
    tags=["HR"],
)


@router.get("/dashboard")
def hr_dashboard(
    current_user: User = Depends(
        require_permission(Permission.VIEW_STAFF)
    ),
):
    return {
        "workspace": "hr",
        "message": "HR workspace",
        "user": current_user.name,
        "department": current_user.department.value,
    }


@router.get("/staff")
def staff_records(
    current_user: User = Depends(
        require_permission(Permission.VIEW_STAFF)
    ),
):
    return {
        "workspace": "hr",
        "records": [],
        "message": "Synthetic staff data",
    }