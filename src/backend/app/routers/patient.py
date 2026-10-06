from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.appointment import Appointment
from app.models.medical_record import MedicalRecord
from app.security.dependencies import get_current_user


router = APIRouter(
    prefix="/patient",
    tags=["Patient Workspace"],
)


@router.get("/dashboard")
def patient_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    appointments_count = (
        db.query(Appointment)
        .filter(Appointment.patient_id == current_user.id)
        .count()
    )

    records_count = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.patient_id == current_user.id)
        .count()
    )

    return {
        "workspace": "patient",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
        },
        "statistics": {
            "appointments": appointments_count,
            "medical_records": records_count,
        },
    }


@router.get("/profile")
def patient_profile(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role.value,
    }


@router.get("/appointments")
def patient_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    appointments = (
        db.query(Appointment)
        .filter(Appointment.patient_id == current_user.id)
        .order_by(Appointment.appointment_time.desc())
        .all()
    )

    return [
        {
            "id": appointment.id,
            "doctor_id": appointment.doctor_id,
            "appointment_time": appointment.appointment_time,
            "status": appointment.status,
            "reason": appointment.reason,
        }
        for appointment in appointments
    ]


@router.get("/records")
def patient_records(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.patient_id == current_user.id)
        .all()
    )

    return [
        {
            "id": record.id,
            "doctor_id": record.doctor_id,
            "diagnosis": record.diagnosis,
            "notes": record.notes,
        }
        for record in records
    ]