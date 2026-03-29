from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.classroom import Classroom, Enrollment, ParentLink
from app.models.user import User


class ClassroomRepository:
    def create(self, session: Session, *, name: str, teacher_id: int) -> Classroom:
        classroom = Classroom(name=name, teacher_id=teacher_id)
        session.add(classroom)
        session.flush()
        session.refresh(classroom)
        return classroom

    def get_by_id(self, session: Session, classroom_id: int) -> Classroom | None:
        query = (
            select(Classroom)
            .options(joinedload(Classroom.teacher), joinedload(Classroom.enrollments))
            .where(Classroom.id == classroom_id)
        )
        return session.scalar(query)

    def get_by_join_code(self, session: Session, join_code: str) -> Classroom | None:
        return session.scalar(select(Classroom).where(Classroom.join_code == join_code.upper()))

    def list_for_teacher(self, session: Session, teacher_id: int) -> list[Classroom]:
        return list(session.scalars(select(Classroom).where(Classroom.teacher_id == teacher_id)).all())

    def list_for_student(self, session: Session, student_id: int) -> list[Classroom]:
        query = (
            select(Classroom)
            .join(Enrollment, Enrollment.class_id == Classroom.id)
            .where(Enrollment.student_id == student_id)
        )
        return list(session.scalars(query).all())

    def list_for_parent(self, session: Session, parent_id: int) -> list[Classroom]:
        query = (
            select(Classroom)
            .join(Enrollment, Enrollment.class_id == Classroom.id)
            .join(ParentLink, ParentLink.student_id == Enrollment.student_id)
            .where(ParentLink.parent_id == parent_id)
        )
        return list(session.scalars(query).unique().all())

    def is_student_enrolled(self, session: Session, *, student_id: int, class_id: int) -> bool:
        return session.get(Enrollment, {"student_id": student_id, "class_id": class_id}) is not None

    def add_enrollment(self, session: Session, *, student_id: int, class_id: int) -> Enrollment:
        enrollment = Enrollment(student_id=student_id, class_id=class_id)
        session.add(enrollment)
        session.flush()
        return enrollment

    def is_parent_linked(self, session: Session, *, parent_id: int, student_id: int) -> bool:
        return session.get(ParentLink, {"parent_id": parent_id, "student_id": student_id}) is not None

    def add_parent_link(self, session: Session, *, parent_id: int, student_id: int) -> ParentLink:
        link = ParentLink(parent_id=parent_id, student_id=student_id)
        session.add(link)
        session.flush()
        return link

    def list_students(self, session: Session, class_id: int) -> list[User]:
        query = (
            select(User)
            .join(Enrollment, Enrollment.student_id == User.id)
            .where(Enrollment.class_id == class_id)
        )
        return list(session.scalars(query).all())
