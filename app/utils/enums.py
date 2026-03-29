from enum import StrEnum


class UserRole(StrEnum):
    STUDENT = "student"
    TEACHER = "teacher"
    PARENT = "parent"


class SubmissionStatus(StrEnum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class NotificationChannel(StrEnum):
    IN_APP = "in_app"
    EMAIL = "email"