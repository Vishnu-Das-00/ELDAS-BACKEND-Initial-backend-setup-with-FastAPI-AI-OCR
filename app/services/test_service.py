from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.classroom_repository import ClassroomRepository
from app.repositories.test_repository import TestRepository
from app.schemas.test import TestCreateRequest, TestResponse
from app.utils.enums import UserRole


class TestService:
    def __init__(self) -> None:
        self.classroom_repository = ClassroomRepository()
        self.test_repository = TestRepository()

    def create_test(self, session: Session, current_user, payload: TestCreateRequest) -> TestResponse:
        if current_user.role != UserRole.TEACHER:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can create tests.")

        classroom = self.classroom_repository.get_by_id(session, payload.class_id)
        if classroom is None or classroom.teacher_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

        test = self.test_repository.create(
            session,
            class_id=payload.class_id,
            subject=payload.subject,
            chapter=payload.chapter,
            questions=[question.model_dump() for question in payload.questions],
        )
        session.commit()
        return TestResponse.model_validate(test)

    def get_class_tests(self, session: Session, current_user, class_id: int) -> list[TestResponse]:
        classroom = self.classroom_repository.get_by_id(session, class_id)
        if classroom is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

        if current_user.role == UserRole.TEACHER and classroom.teacher_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        if current_user.role == UserRole.STUDENT and not self.classroom_repository.is_student_enrolled(
            session, student_id=current_user.id, class_id=class_id
        ):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        if current_user.role == UserRole.PARENT:
            accessible_classes = {item.id for item in self.classroom_repository.list_for_parent(session, current_user.id)}
            if class_id not in accessible_classes:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

        tests = self.test_repository.list_by_class(session, class_id)
        return [TestResponse.model_validate(test) for test in tests]
