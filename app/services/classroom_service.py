from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.classroom_repository import ClassroomRepository
from app.repositories.user_repository import UserRepository
from app.schemas.classroom import (
    ClassroomCreateRequest,
    ClassroomDetailResponse,
    ClassroomJoinRequest,
    ClassroomResponse,
)
from app.schemas.user import UserResponse
from app.utils.enums import UserRole


class ClassroomService:
    def __init__(self) -> None:
        self.classroom_repository = ClassroomRepository()
        self.user_repository = UserRepository()

    def create_classroom(self, session: Session, current_user, payload: ClassroomCreateRequest) -> ClassroomResponse:
        if current_user.role != UserRole.TEACHER:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can create classrooms.")
        classroom = self.classroom_repository.create(session, name=payload.name, teacher_id=current_user.id)
        session.commit()
        return ClassroomResponse.model_validate(classroom)

    def join_classroom(self, session: Session, current_user, payload: ClassroomJoinRequest) -> ClassroomResponse:
        if current_user.role != UserRole.STUDENT:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can join classrooms.")

        classroom = None
        if payload.classroom_id:
            classroom = self.classroom_repository.get_by_id(session, payload.classroom_id)
        elif payload.join_code:
            classroom = self.classroom_repository.get_by_join_code(session, payload.join_code)
        if classroom is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

        if self.classroom_repository.is_student_enrolled(session, student_id=current_user.id, class_id=classroom.id):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Student is already enrolled.")

        self.classroom_repository.add_enrollment(session, student_id=current_user.id, class_id=classroom.id)
        session.commit()
        return ClassroomResponse.model_validate(classroom)

    def link_parent(self, session: Session, current_user, student_id: int) -> dict[str, str]:
        if current_user.role != UserRole.PARENT:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only parents can link students.")

        student = self.user_repository.get_by_id(session, student_id)
        if student is None or student.role != UserRole.STUDENT:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found.")

        if self.classroom_repository.is_parent_linked(session, parent_id=current_user.id, student_id=student_id):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Parent already linked to student.")

        self.classroom_repository.add_parent_link(session, parent_id=current_user.id, student_id=student_id)
        session.commit()
        return {"message": "Parent linked to student successfully."}

    def list_accessible_classrooms(self, session: Session, current_user) -> list[ClassroomDetailResponse]:
        if current_user.role == UserRole.TEACHER:
            classrooms = self.classroom_repository.list_for_teacher(session, current_user.id)
        elif current_user.role == UserRole.STUDENT:
            classrooms = self.classroom_repository.list_for_student(session, current_user.id)
        else:
            classrooms = self.classroom_repository.list_for_parent(session, current_user.id)

        response = []
        for classroom in classrooms:
            classroom = self.classroom_repository.get_by_id(session, classroom.id) or classroom
            response.append(
                ClassroomDetailResponse(
                    id=classroom.id,
                    name=classroom.name,
                    teacher_id=classroom.teacher_id,
                    join_code=classroom.join_code,
                    teacher=UserResponse.model_validate(classroom.teacher),
                    student_count=len(classroom.enrollments),
                )
            )
        return response

    def list_linked_students(self, session: Session, current_user) -> list[UserResponse]:
        if current_user.role != UserRole.PARENT:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only parents can view linked students.")

        students = self.user_repository.list_students_for_parent(session, current_user.id)
        return [UserResponse.model_validate(student) for student in students]
