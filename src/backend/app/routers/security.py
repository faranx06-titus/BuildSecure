
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.audit_log import AuditLog
from app.security.permissions import (
    Permission,
    require_permission,
)


router = APIRouter(
    prefix="/security",
    tags=["Security Workspace"],
)


@router.get("/dashboard")
def security_dashboard(
    current_user: User = Depends(
        require_permission(Permission.VIEW_SECURITY_EVENTS)
    ),
    db: Session = Depends(get_db),
):
    total_events = db.query(AuditLog).count()

    blocked_events = (
        db.query(AuditLog)
        .filter(AuditLog.status == "blocked")
        .count()
    )

    successful_events = (
        db.query(AuditLog)
        .filter(AuditLog.status == "success")
        .count()
    )

    return {
        "workspace": "security",
        "security_status": "active",
        "total_events": total_events,
        "blocked_events": blocked_events,
        "successful_events": successful_events,
    }


@router.get("/events")
def security_events(
    current_user: User = Depends(
        require_permission(Permission.VIEW_SECURITY_EVENTS)
    ),
    db: Session = Depends(get_db),
):
    events = (
        db.query(AuditLog)
        .order_by(AuditLog.timestamp.desc())
        .limit(100)
        .all()
    )

    return [
        {
            "id": event.id,
            "user_id": event.user_id,
            "action": event.action,
            "resource": event.resource,
            "resource_id": event.resource_id,
            "ip_address": event.ip_address,
            "timestamp": event.timestamp,
            "status": event.status,
        }
        for event in events
    ]


@router.get("/blocked")
def blocked_events(
    current_user: User = Depends(
        require_permission(Permission.VIEW_SECURITY_EVENTS)
    ),
    db: Session = Depends(get_db),
):
    events = (
        db.query(AuditLog)
        .filter(AuditLog.status == "blocked")
        .order_by(AuditLog.timestamp.desc())
        .limit(100)
        .all()
    )

    return [
        {
            "id": event.id,
            "user_id": event.user_id,
            "action": event.action,
            "resource": event.resource,
            "resource_id": event.resource_id,
            "ip_address": event.ip_address,
            "timestamp": event.timestamp,
            "status": event.status,
        }
        for event in events
    ]
