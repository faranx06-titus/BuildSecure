from fastapi import APIRouter, Depends

from app.models.user import User
from app.security.permissions import Permission, require_permission

router = APIRouter(
    prefix="/operations",
    tags=["Operations"],
)


@router.get("/dashboard")
def operations_dashboard(
    current_user: User = Depends(
        require_permission(Permission.VIEW_APPOINTMENTS)
    ),
):
    return {
        "workspace": "operations",
        "message": "Operations workspace",
        "user": current_user.name,
        "department": current_user.department.value,
    }


@router.get("/schedule")
def operations_schedule(
    current_user: User = Depends(
        require_permission(Permission.MANAGE_SCHEDULE)
    ),
):
    return {
        "workspace": "operations",
        "schedule": [],
        "message": "Synthetic operational schedule",
    }