from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import ProfessionalApplication
from app.models.user import User, UserRole
from app.security.dependencies import get_current_user
from app.services.audit import log_event
from app.models.user import User, UserRole, UserDepartment
from app.security.password import hash_password


router = APIRouter(
    prefix="/admin/applications",
    tags=["Admin Applications"],
)


def require_admin(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return current_user


@router.get("/pending")
def get_pending_applications(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    applications = (
        db.query(ProfessionalApplication)
        .filter(ProfessionalApplication.status == "pending")
        .order_by(ProfessionalApplication.created_at.desc())
        .all()
    )

    return applications


@router.post("/{application_id}/approve")
def approve_application(
    application_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    application = (
        db.query(ProfessionalApplication)
        .filter(ProfessionalApplication.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    if application.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Application has already been reviewed",
        )

    existing_user = (
        db.query(User)
        .filter(User.email == application.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="A user account already exists for this email",
        )

    profession = application.profession.lower()
    department = application.department.lower()

    if profession == "doctor":
        role = UserRole.DOCTOR
        user_department = UserDepartment.MEDICAL

    elif department == "finance":
        role = UserRole.STAFF
        user_department = UserDepartment.FINANCE

    elif department == "hr":
        role = UserRole.STAFF
        user_department = UserDepartment.HR

    elif department == "operations":
        role = UserRole.STAFF
        user_department = UserDepartment.OPERATIONS

    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid professional department",
        )

    # Temporary synthetic password.
    # In production, this should be replaced by an invitation/password setup flow.
    temporary_password = "Demo@123"

    user = User(
        name=application.name,
        email=application.email,
        password_hash=hash_password(temporary_password),
        role=role,
        department=user_department,
        is_active=1,
    )

    db.add(user)

    application.status = "approved"
    application.reviewed_by = current_user.id
    application.reviewed_at = datetime.utcnow()

    db.commit()
    db.refresh(user)

    log_event(
        db=db,
        action="APPLICATION_APPROVED",
        user_id=current_user.id,
        resource="professional_application",
        resource_id=application.id,
        status="success",
    )

    log_event(
        db=db,
        action="PROFESSIONAL_ACCOUNT_CREATED",
        user_id=current_user.id,
        resource="user",
        resource_id=user.id,
        status="success",
    )

    return {
        "message": "Application approved and account created",
        "application_id": application.id,
        "user_id": user.id,
        "role": user.role.value,
        "department": user.department.value,
        "temporary_password": temporary_password,
    }

@router.post("/{application_id}/reject")
def reject_application(
    application_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    application = (
        db.query(ProfessionalApplication)
        .filter(ProfessionalApplication.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    if application.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Application has already been reviewed",
        )

    application.status = "rejected"
    application.reviewed_by = current_user.id
    application.reviewed_at = datetime.utcnow()

    db.commit()

    log_event(
        db=db,
        action="APPLICATION_REJECTED",
        user_id=current_user.id,
        resource="professional_application",
        resource_id=application.id,
        status="success",
    )

    return {
        "message": "Application rejected",
        "application_id": application.id,
        "status": application.status,
    }