from sqlalchemy import Boolean, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.models.base import Base, TimestampMixin


class Evaluation(TimestampMixin, Base):
    __tablename__ = "evaluations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    submission_id: Mapped[int] = mapped_column(
        ForeignKey("submissions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    understanding: Mapped[bool] = mapped_column(Boolean, nullable=False)
    concept: Mapped[bool] = mapped_column(Boolean, nullable=False)
    method: Mapped[bool] = mapped_column(Boolean, nullable=False)
    execution_json: Mapped[dict[str, bool]] = mapped_column(JSON, default=dict)
    memory: Mapped[bool] = mapped_column(Boolean, nullable=False)
    error_reason: Mapped[str] = mapped_column(Text, default="", nullable=False)
    raw_response: Mapped[dict] = mapped_column(JSON, default=dict)

    submission = relationship("Submission", back_populates="evaluation")
