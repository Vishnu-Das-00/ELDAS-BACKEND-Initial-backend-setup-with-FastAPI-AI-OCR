from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.models.base import Base, TimestampMixin


class Test(TimestampMixin, Base):
    __tablename__ = "tests"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    class_id: Mapped[int] = mapped_column(ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False, index=True)
    subject: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    chapter: Mapped[str] = mapped_column(String(255), nullable=False)

    classroom = relationship("Classroom", back_populates="tests")
    questions = relationship("Question", back_populates="test", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="test", cascade="all, delete-orphan")


class Question(TimestampMixin, Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id", ondelete="CASCADE"), nullable=False, index=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    subject: Mapped[str] = mapped_column(String(120), nullable=False)
    chapter: Mapped[str] = mapped_column(String(255), nullable=False)
    concepts: Mapped[list[str]] = mapped_column(JSON, default=list)
    steps: Mapped[list[str]] = mapped_column(JSON, default=list)
    calculation_types: Mapped[list[str]] = mapped_column(JSON, default=list)

    test = relationship("Test", back_populates="questions")
