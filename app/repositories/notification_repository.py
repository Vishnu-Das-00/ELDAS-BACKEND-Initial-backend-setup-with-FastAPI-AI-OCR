from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationRepository:
    def create_many(self, session: Session, notifications: list[Notification]) -> list[Notification]:
        session.add_all(notifications)
        session.flush()
        return notifications

    def list_for_user(self, session: Session, user_id: int) -> list[Notification]:
        query = select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc())
        return list(session.scalars(query).all())

    def mark_as_read(self, session: Session, notification_id: int, user_id: int) -> Notification | None:
        notification = session.scalar(
            select(Notification).where(
                Notification.id == notification_id,
                Notification.user_id == user_id,
            )
        )
        if notification is None:
            return None
        notification.read_at = datetime.now(UTC)
        session.flush()
        return notification
