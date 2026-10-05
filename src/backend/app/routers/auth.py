from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.auth import RegisterRequest, LoginRequest
from app.security.password import hash_password, verify_password
from app.security.jwt import create_access_token
from app.services.audit import log_event
from fastapi import Request
from app.security.rate_limit import check_login_rate_limit

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

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

    if data.role not in ["patient", "doctor"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid role",
        )

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=UserRole(data.role),
        is_active=1,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    log_event(
        db=db,
        action="register",
        user_id=user.id,
        resource="user",
        resource_id=user.id,
        ip_address=None,  # You can get the IP address from the request if needed
        status="success"
    )

    return {
        "message": "Registration successful",
        "user_id": user.id,
        "role": user.role.value,
    }

client_ip = request.client.host if request.client else "unknown"

if not check_login_rate_limit(client_ip):
    log_event(
        db=db,
        action="LOGIN_RATE_LIMIT",
        resource="authentication",
        status="blocked",
        ip_address=client_ip,
    )

    raise HTTPException(
        status_code=429,
        detail="Too many login attempts. Try again later.",
    )

@router.post("/login")
 
def login(data: LoginRequest, request: Request, db: Session = Depends(get_db)):

    # Check rate limit
    if not check_login_rate_limit(data.email):
        raise HTTPException(
            status_code=429,
            detail="Too many login attempts. Please try again later.",
        )

    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not user or not verify_password(
        data.password,
        user.password_hash,
    ):
        log_event(
            db=db,
            action="login",
            user_id=user.id if user else None,
            resource="user",
            resource_id=user.id if user else None,
            ip_address=None,  # You can get the IP address from the request if needed
            status="failure"
        )
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
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