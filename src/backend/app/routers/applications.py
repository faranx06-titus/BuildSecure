from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import ProfessionalApplication
from app.schemas.application import ProfessionalApplicationCreate
from app.services.audit import log_event
from fastapi import HTTPException
from app.models.user import User, UserRole
from app.security.dependencies import get_current_user
from app.services.audit import log_event

router = APIRouter(
    prefix="/applications",
    tags=["Professional Applications"],
)


@router.post("/professional")
def submit_application(
    data: ProfessionalApplicationCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "unknown"

    allowed_professions = [
        "doctor",
        "finance",
        "hr",
        "operations",
    ]

    allowed_departments = [
        "medical",
        "finance",
        "hr",
        "operations",
    ]

    if data.profession.lower() not in allowed_professions:
        raise HTTPException(
            status_code=400,
            detail="Invalid profession",
        )

    if data.department.lower() not in allowed_departments:
        raise HTTPException(
            status_code=400,
            detail="Invalid department",
        )

    existing_application = (
        db.query(ProfessionalApplication)
        .filter(
            ProfessionalApplication.email == data.email,
            ProfessionalApplication.status == "pending",
        )
        .first()
    )

    if existing_application:
        raise HTTPException(
            status_code=400,
            detail="A pending application already exists for this email",
        )

    application = ProfessionalApplication(
        name=data.name,
        email=data.email,
        phone=data.phone,
        profession=data.profession.lower(),
        department=data.department.lower(),
        specialization=data.specialization,
        experience_years=data.experience_years,
        reason=data.reason,
        status="pending",
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    log_event(
        db=db,
        action="APPLICATION_SUBMITTED",
        resource="professional_application",
        resource_id=application.id,
        ip_address=client_ip,
        status="success",
    )

    return {
        "message": "Professional application submitted",
        "application_id": application.id,
        "status": application.status,
    }
@router.patch("/{appointment_id}/status")
def update_appointment_status(
    appointment_id: int,
    status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id)
        .first()
    )

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found",
        )

    allowed_statuses = {
        "scheduled",
        "completed",
        "cancelled",
    }

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid appointment status",
        )

    # Patient can only cancel their own appointment.
    if current_user.role == UserRole.PATIENT:
        if appointment.patient_id != current_user.id:
            log_event(
                db=db,
                action="APPOINTMENT_ACCESS_BLOCKED",
                user_id=current_user.id,
                resource="appointment",
                resource_id=appointment.id,
                status="blocked",
            )

            raise HTTPException(
                status_code=403,
                detail="You cannot access this appointment",
            )

        if status != "cancelled":
            raise HTTPException(
                status_code=403,
                detail="Patients can only cancel appointments",
            )

    # Doctor can only modify their own appointments.
    elif current_user.role == UserRole.DOCTOR:
        if appointment.doctor_id != current_user.id:
            log_event(
                db=db,
                action="APPOINTMENT_ACCESS_BLOCKED",
                user_id=current_user.id,
                resource="appointment",
                resource_id=appointment.id,
                status="blocked",
            )

            raise HTTPException(
                status_code=403,
                detail="You cannot access this appointment",
            )

    # Admin can manage everything.
    elif current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    appointment.status = status
    db.commit()
    db.refresh(appointment)

    log_event(
        db=db,
        action="APPOINTMENT_STATUS_UPDATED",
        user_id=current_user.id,
        resource="appointment",
        resource_id=appointment.id,
        status="success",
    )

    return {
        "message": "Appointment status updated",
        "appointment_id": appointment.id,
        "status": appointment.status,
    }