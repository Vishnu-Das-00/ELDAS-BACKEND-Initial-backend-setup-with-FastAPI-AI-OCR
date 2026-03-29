from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.classroom import ParentLink
from app.models.user import User


class UserRepository:
    def get_by_id(self, session: Session, user_id: int) -> User | None:
        return session.get(User, user_id)

    def get_by_email(self, session: Session, email: str) -> User | None:
        return session.scalar(select(User).where(User.email == email))

    def create(self, session: Session, *, name: str, email: str, password_hash: str, role) -> User:
        user = User(name=name, email=email, password_hash=password_hash, role=role)
        session.add(user)
        session.flush()
        return user

    def get_parent_ids_for_student(self, session: Session, student_id: int) -> list[int]:
        return list(session.scalars(select(ParentLink.parent_id).where(ParentLink.student_id == student_id)).all())
