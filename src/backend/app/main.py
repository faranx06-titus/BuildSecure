from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine, Base
from app.models import (
    User,
    Appointment,
    MedicalRecord,
    AuditLog,
    ProfessionalApplication,
)

from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.appointments import router as appointments_router
from app.routers.medical_records import router as medical_records_router
from app.routers.admin import router as admin_router
from app.routers.applications import router as applications_router
from app.routers.applications_admin import router as applications_admin_router
from app.routers.staff import router as staff_router
from app.routers.finance import router as finance_router
from app.routers.hr import router as hr_router
from app.routers.operations import router as operations_router
from app.routers.security import router as security_router
from app.routers.patient import router as patient_router
from app.routers.doctor import router as doctor_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediDesk API",
    description="Security-focused clinic management API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(appointments_router)
app.include_router(medical_records_router)
app.include_router(admin_router)
app.include_router(applications_router)
app.include_router(applications_admin_router)
app.include_router(staff_router)
app.include_router(finance_router)
app.include_router(hr_router)
app.include_router(operations_router)
app.include_router(security_router)
app.include_router(patient_router)
app.include_router(doctor_router)

@app.get("/")
def root():
    return {
        "message": "MediDesk API is running",
        "status": "ok",
        "endpoints": ["/auth", "/doctor", "/patient", "/health"]
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "MediDesk backend is awake and responsive"
    }

@app.get("/health/db")
def database_health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as error:
        return {"status": "unhealthy", "database": "disconnected", "error": str(error)}
