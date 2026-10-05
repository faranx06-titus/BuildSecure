from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.medical_record import MedicalRecord
from app.models.appointment import Appointment
from app.models.user import User, UserRole
from app.schemas.medical_record import MedicalRecordCreate
from app.security.dependencies import get_current_user


router = APIRouter(
    prefix="/medical-records",
    tags=["Medical Records"],
)


@router.post("/")
def create_medical_record(
    data: MedicalRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Only doctors can create medical records
    if current_user.role != UserRole.DOCTOR:
        raise HTTPException(
            status_code=403,
            detail="Only doctors can create medical records",
        )

    # Doctor must have a relationship with the patient
    relationship = (
        db.query(Appointment)
        .filter(
            Appointment.patient_id == data.patient_id,
            Appointment.doctor_id == current_user.id,
        )
        .first()
    )

    if not relationship:
        raise HTTPException(
            status_code=403,
            detail="Doctor is not authorized for this patient",
        )

    record = MedicalRecord(
        patient_id=data.patient_id,
        doctor_id=current_user.id,
        diagnosis=data.diagnosis,
        notes=data.notes,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "message": "Medical record created",
        "record_id": record.id,
    }


@router.get("/patient/{patient_id}")
def get_patient_records(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Patient can access their own records
    if current_user.role == UserRole.PATIENT:
        if current_user.id != patient_id:
            raise HTTPException(
                status_code=403,
                detail="You can only access your own records",
            )

    # Doctor needs a patient relationship
    elif current_user.role == UserRole.DOCTOR:
        relationship = (
            db.query(Appointment)
            .filter(
                Appointment.patient_id == patient_id,
                Appointment.doctor_id == current_user.id,
            )
            .first()
        )

        if not relationship:
            raise HTTPException(
                status_code=403,
                detail="Doctor is not authorized for this patient",
            )

    elif current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Insufficient permissions",
        )

    records = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.patient_id == patient_id)
        .all()
    )

    return records