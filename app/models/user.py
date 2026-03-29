from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from app.utils.enums import UserRole


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role"), nullable=False, index=True)

    classrooms_created = relationship("Classroom", back_populates="teacher")
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    parent_links = relationship(
        "ParentLink",
        foreign_keys="ParentLink.parent_id",
        back_populates="parent",
        cascade="all, delete-orphan",
    )
    child_links = relationship(
        "ParentLink",
        foreign_keys="ParentLink.student_id",
        back_populates="student",
        cascade="all, delete-orphan",
    )
    submissions = relationship("Submission", back_populates="student", cascade="all, delete-orphan")
    progress_records = relationship("Progress", back_populates="student", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
