from pydantic import BaseModel


class MedicalRecordCreate(BaseModel):
    patient_id: int
    diagnosis: str | None = None
    notes: str | None = None