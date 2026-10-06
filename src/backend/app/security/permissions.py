from enum import Enum

from fastapi import Depends, HTTPException

from app.models.user import User, UserRole, UserDepartment
from app.security.dependencies import get_current_user


class Permission(str, Enum):
    VIEW_APPOINTMENTS = "view_appointments"
    MANAGE_APPOINTMENTS = "manage_appointments"

    VIEW_PATIENT_RECORDS = "view_patient_records"
    CREATE_MEDICAL_RECORD = "create_medical_record"

    VIEW_BILLING = "view_billing"
    MANAGE_INVOICES = "manage_invoices"

    VIEW_STAFF = "view_staff"
    MANAGE_STAFF = "manage_staff"

    MANAGE_SCHEDULE = "manage_schedule"

    VIEW_SECURITY_EVENTS = "view_security_events"
    VIEW_AUDIT_LOGS = "view_audit_logs"


ROLE_PERMISSIONS = {
    UserRole.PATIENT: {
        Permission.VIEW_APPOINTMENTS,
    },

    UserRole.DOCTOR: {
        Permission.VIEW_APPOINTMENTS,
        Permission.MANAGE_APPOINTMENTS,
        Permission.VIEW_PATIENT_RECORDS,
        Permission.CREATE_MEDICAL_RECORD,
    },

    UserRole.ADMIN: {
        Permission.VIEW_APPOINTMENTS,
        Permission.MANAGE_APPOINTMENTS,
        Permission.VIEW_PATIENT_RECORDS,
        Permission.CREATE_MEDICAL_RECORD,
        Permission.VIEW_BILLING,
        Permission.MANAGE_INVOICES,
        Permission.VIEW_STAFF,
        Permission.MANAGE_STAFF,
        Permission.MANAGE_SCHEDULE,
        Permission.VIEW_SECURITY_EVENTS,
        Permission.VIEW_AUDIT_LOGS,
    },
}


DEPARTMENT_PERMISSIONS = {
    UserDepartment.FINANCE: {
        Permission.VIEW_BILLING,
        Permission.MANAGE_INVOICES,
    },

    UserDepartment.HR: {
        Permission.VIEW_STAFF,
        Permission.MANAGE_STAFF,
    },

    UserDepartment.OPERATIONS: {
        Permission.VIEW_APPOINTMENTS,
        Permission.MANAGE_APPOINTMENTS,
        Permission.MANAGE_SCHEDULE,
    },

    UserDepartment.SECURITY: {
        Permission.VIEW_SECURITY_EVENTS,
        Permission.VIEW_AUDIT_LOGS,
    },

    UserDepartment.MEDICAL: {
        Permission.VIEW_APPOINTMENTS,
        Permission.MANAGE_APPOINTMENTS,
        Permission.VIEW_PATIENT_RECORDS,
        Permission.CREATE_MEDICAL_RECORD,
    },
}


def has_permission(
    user: User,
    permission: Permission,
) -> bool:

    role_permissions = ROLE_PERMISSIONS.get(
        user.role,
        set(),
    )

    if permission in role_permissions:
        return True

    if user.department:
        department_permissions = DEPARTMENT_PERMISSIONS.get(
            user.department,
            set(),
        )

        if permission in department_permissions:
            return True

    return False


def require_permission(permission: Permission):

    def permission_checker(
        current_user: User = Depends(get_current_user),
    ):
        if not has_permission(current_user, permission):
            raise HTTPException(
                status_code=403,
                detail="Permission denied",
            )

        return current_user

    return permission_checker