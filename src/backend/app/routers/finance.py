from fastapi import APIRouter, Depends

from app.models.user import User
from app.security.permissions import Permission, require_permission

router = APIRouter(
    prefix="/finance",
    tags=["Finance"],
)


@router.get("/dashboard")
def finance_dashboard(
    current_user: User = Depends(
        require_permission(Permission.VIEW_BILLING)
    ),
):
    return {
        "workspace": "finance",
        "message": "Finance workspace",
        "user": current_user.name,
        "department": current_user.department.value,
    }


@router.get("/billing")
def billing_records(
    current_user: User = Depends(
        require_permission(Permission.VIEW_BILLING)
    ),
):
    return {
        "workspace": "finance",
        "records": [],
        "message": "Synthetic billing data",
    }