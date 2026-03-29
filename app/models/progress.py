from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.models.base import Base, TimestampMixin


class Progress(TimestampMixin, Base):
    __tablename__ = "progress"

    student_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    subject: Mapped[str] = mapped_column(String(120), primary_key=True)
    skill_scores: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)

    student = relationship("User", back_populates="progress_records")
