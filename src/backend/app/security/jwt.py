from datetime import datetime, timedelta, timezone
from jose import jwt
import os

# In production, this should be loaded from an environment variable
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "medidesk-secure-complex-key-2026-vbit-hackathon-final")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
