from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def log_event(
    db: Session,
    action: str,
    user_id: int | None = None,
    resource: str | None = None,
    resource_id: int | None = None,
    ip_address: str | None = None,
    status: str = "success",
):
    event = AuditLog(
        user_id=user_id,
        action=action,
        resource=resource,
        resource_id=resource_id,
        ip_address=ip_address,
        status=status,
    )

    db.add(event)
    db.commit()