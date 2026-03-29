from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.utils.enums import NotificationChannel


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    channel: NotificationChannel
    title: str
    message: str
    payload: dict
    read_at: datetime | None
    created_at: datetime
