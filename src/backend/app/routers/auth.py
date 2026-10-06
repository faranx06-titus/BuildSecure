
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.auth import RegisterRequest, LoginRequest
from app.security.password import hash_password, verify_password
from app.security.jwt import create_access_token
from app.services.audit import log_event
from app.security.rate_limit import check_login_rate_limit


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    data: RegisterRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "unknown"

    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    # Public registration is ONLY for patients.
    # Doctors and staff must use professional onboarding.
    if data.role != "patient":
        log_event(
            db=db,
            action="REGISTRATION_PRIVILEGE_BLOCKED",
            resource="user",
            ip_address=client_ip,
            status="blocked",
        )

        raise HTTPException(
            status_code=403,
            detail="Only patient registration is allowed. Professionals must apply through Join Hospital.",
        )

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=UserRole.PATIENT,
        department=None,
        is_active=1,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    log_event(
        db=db,
        action="REGISTER_SUCCESS",
        user_id=user.id,
        resource="user",
        resource_id=user.id,
        ip_address=client_ip,
        status="success",
    )

    return {
        "message": "Registration successful",
        "user_id": user.id,
        "role": user.role.value,
    }

@router.post("/login")
def login(
    data: LoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "unknown"

    # Rate limit login attempts
    if not check_login_rate_limit(client_ip):
        log_event(
            db=db,
            action="LOGIN_RATE_LIMIT",
            resource="authentication",
            ip_address=client_ip,
            status="blocked",
        )

        raise HTTPException(
            status_code=429,
            detail="Too many login attempts. Try again later.",
        )

    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    # Invalid credentials
    if not user or not verify_password(
        data.password,
        user.password_hash if user else "",
    ):
        log_event(
            db=db,
            action="LOGIN_FAILED",
            user_id=user.id if user else None,
            resource="authentication",
            resource_id=user.id if user else None,
            ip_address=client_ip,
            status="blocked",
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    # Successful login
    log_event(
        db=db,
        action="LOGIN_SUCCESS",
        user_id=user.id,
        resource="authentication",
        resource_id=user.id,
        ip_address=client_ip,
        status="success",
    )

    access_token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role.value,
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "role": user.role.value,
    }

