import secrets

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


def generate_join_code() -> str:
    return secrets.token_urlsafe(6)[:8].upper()


class Classroom(TimestampMixin, Base):
    __tablename__ = "classrooms"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    join_code: Mapped[str] = mapped_column(String(16), unique=True, default=generate_join_code, nullable=False)

    teacher = relationship("User", back_populates="classrooms_created")
    enrollments = relationship("Enrollment", back_populates="classroom", cascade="all, delete-orphan")
    tests = relationship("Test", back_populates="classroom", cascade="all, delete-orphan")


class Enrollment(Base):
    __tablename__ = "enrollments"

    student_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    class_id: Mapped[int] = mapped_column(ForeignKey("classrooms.id", ondelete="CASCADE"), primary_key=True)

    student = relationship("User", back_populates="enrollments")
    classroom = relationship("Classroom", back_populates="enrollments")


class ParentLink(Base):
    __tablename__ = "parent_links"

    parent_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)

    parent = relationship("User", foreign_keys=[parent_id], back_populates="parent_links")
    student = relationship("User", foreign_keys=[student_id], back_populates="child_links")
