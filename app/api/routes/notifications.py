from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.db import get_db_session
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import NotificationResponse

router = APIRouter()
notification_repository = NotificationRepository()


@router.get("/me", response_model=list[NotificationResponse])
def list_notifications(
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(get_current_user),
) -> list[NotificationResponse]:
    notifications = notification_repository.list_for_user(db, current_user.id)
    return [NotificationResponse.model_validate(item) for item in notifications]


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: int,
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(get_current_user),
) -> NotificationResponse:
    notification = notification_repository.mark_as_read(db, notification_id, current_user.id)
    if notification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found.")
    db.commit()
    return NotificationResponse.model_validate(notification)
