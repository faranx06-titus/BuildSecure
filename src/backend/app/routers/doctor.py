from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.models.appointment import Appointment
from app.models.medical_record import MedicalRecord
from app.security.dependencies import get_current_user


router = APIRouter(
    prefix="/doctor",
    tags=["Doctor Workspace"],
)


def require_doctor(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.DOCTOR:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=403,
            detail="Doctor access required",
        )

    return current_user


@router.get("/dashboard")
def doctor_dashboard(
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    appointments_count = (
        db.query(Appointment)
        .filter(Appointment.doctor_id == current_user.id)
        .count()
    )

    patients_count = (
        db.query(Appointment.patient_id)
        .filter(Appointment.doctor_id == current_user.id)
        .distinct()
        .count()
    )

    records_count = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.doctor_id == current_user.id)
        .count()
    )

    return {
        "workspace": "medical",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
        },
        "statistics": {
            "appointments": appointments_count,
            "patients": patients_count,
            "medical_records": records_count,
        },
    }


@router.get("/appointments")
def doctor_appointments(
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    appointments = (
        db.query(Appointment)
        .filter(Appointment.doctor_id == current_user.id)
        .order_by(Appointment.appointment_time.desc())
        .all()
    )

    return [
        {
            "id": appointment.id,
            "patient_id": appointment.patient_id,
            "appointment_time": appointment.appointment_time,
            "status": appointment.status,
            "reason": appointment.reason,
        }
        for appointment in appointments
    ]


@router.get("/patients")
def doctor_patients(
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    patient_ids = (
        db.query(Appointment.patient_id)
        .filter(Appointment.doctor_id == current_user.id)
        .distinct()
        .all()
    )

    ids = [row[0] for row in patient_ids]

    if not ids:
        return []

    patients = (
        db.query(User)
        .filter(
            User.id.in_(ids),
            User.role == UserRole.PATIENT,
        )
        .all()
    )

    return [
        {
            "id": patient.id,
            "name": patient.name,
            "email": patient.email,
        }
        for patient in patients
    ]


@router.get("/records")
def doctor_records(
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    records = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.doctor_id == current_user.id)
        .all()
    )

    return [
        {
            "id": record.id,
            "patient_id": record.patient_id,
            "diagnosis": record.diagnosis,
            "notes": record.notes,
        }
        for record in records
    ]