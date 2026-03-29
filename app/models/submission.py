from sqlalchemy import Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from app.utils.enums import SubmissionStatus


class Submission(TimestampMixin, Base):
    __tablename__ = "submissions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id", ondelete="CASCADE"), nullable=False, index=True)
    answer_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    extracted_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[SubmissionStatus] = mapped_column(
        Enum(SubmissionStatus, name="submission_status"),
        default=SubmissionStatus.PENDING,
        nullable=False,
        index=True,
    )

    student = relationship("User", back_populates="submissions")
    test = relationship("Test", back_populates="submissions")
    evaluation = relationship("Evaluation", back_populates="submission", uselist=False, cascade="all, delete-orphan")
