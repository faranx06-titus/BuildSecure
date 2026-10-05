from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.appointment import Appointment
from app.models.user import User, UserRole
from app.security.dependencies import get_current_user
from app.schemas.appointment import AppointmentCreate
from app.services.audit import log_event
router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"],
)


@router.post("/")
def create_appointment(
    data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(
            status_code=403,
            detail="Only patients can book appointments",
        )

    doctor = (
        db.query(User)
        .filter(
            User.id == data.doctor_id,
            User.role == UserRole.DOCTOR,
        )
        .first()
    )

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found",
        )

    appointment = Appointment(
        patient_id=current_user.id,
        doctor_id=data.doctor_id,
        appointment_time=data.appointment_time,
        reason=data.reason,
        status="scheduled",
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    log_event(
        db=db,
        action="create_appointment",
        user_id=current_user.id,
        resource="appointment",
        resource_id=appointment.id,
        ip_address=None,  # You can get the IP address from the request if needed
        status="success"
    )

    return {
        "message": "Appointment booked",
        "appointment_id": appointment.id,
    }


@router.get("/my")
def get_my_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == UserRole.PATIENT:
        appointments = (
            db.query(Appointment)
            .filter(Appointment.patient_id == current_user.id)
            .all()
        )

    elif current_user.role == UserRole.DOCTOR:
        appointments = (
            db.query(Appointment)
            .filter(Appointment.doctor_id == current_user.id)
            .all()
        )

    else:
        appointments = db.query(Appointment).all()

    return appointments
@router.get("/{appointment_id}")
def get_appointment(
    appointment_id: int,
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

    # Object-level authorization
    if current_user.role == UserRole.PATIENT:
        if appointment.patient_id != current_user.id:
            log_event(
                db=db,
                action="unauthorized_access",
                user_id=current_user.id,
                resource="appointment",
                resource_id=appointment.id,
                ip_address=None,  # You can get the IP address from the request if needed
                status="failure"
            )
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to access this appointment",
            )

    elif current_user.role == UserRole.DOCTOR:
        if appointment.doctor_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to access this appointment",
            )

    elif current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Insufficient permissions",
        )

    return appointment