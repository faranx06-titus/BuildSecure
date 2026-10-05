from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine, Base
from app.models import User, Appointment, MedicalRecord, AuditLog
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.appointments import router as appointments_router
from app.routers.medical_records import router as medical_records_router
from app.routers.admin import router as admin_router
# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediDesk API",
    description="Security-focused clinic management API",
    version="0.1.0",
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(appointments_router)
app.include_router(medical_records_router)
app.include_router(admin_router)
@app.get("/")
def root():
    return {
        "message": "MediDesk API is running",
        "status": "ok",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }


@app.get("/health/db")
def database_health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception as error:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(error),
        }