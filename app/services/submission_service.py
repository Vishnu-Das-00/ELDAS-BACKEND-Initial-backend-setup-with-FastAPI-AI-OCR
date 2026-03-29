from fastapi import BackgroundTasks, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.classroom import Classroom, Enrollment, ParentLink
from app.repositories.submission_repository import SubmissionRepository
from app.repositories.test_repository import TestRepository
from app.schemas.submission import SubmissionResponse
from app.services.evaluation_service import EvaluationService
from app.services.storage_service import StorageService
from app.utils.enums import UserRole


class SubmissionService:
    def __init__(self) -> None:
        self.submission_repository = SubmissionRepository()
        self.test_repository = TestRepository()
        self.storage_service = StorageService()
        self.evaluation_service = EvaluationService()

    async def create_submission(
        self,
        session: Session,
        background_tasks: BackgroundTasks,
        current_user,
        *,
        test_id: int,
        answer_text: str | None,
        image_file: UploadFile | None,
    ) -> SubmissionResponse:
        if current_user.role != UserRole.STUDENT:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can submit answers.")

        test = self.test_repository.get_by_id(session, test_id)
        if test is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test not found.")

        enrollment = session.get(Enrollment, {"student_id": current_user.id, "class_id": test.class_id})
        if enrollment is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Student is not enrolled in this class.")
        if not answer_text and image_file is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Answer text or image is required.")

        image_url = None
        image_bytes = None
        if image_file is not None:
            image_bytes = await image_file.read()
            stored_file = self.storage_service.save_submission_image(filename=image_file.filename, content=image_bytes)
            image_url = stored_file.url

        submission = self.submission_repository.create(
            session,
            student_id=current_user.id,
            test_id=test_id,
            answer_text=answer_text,
            image_url=image_url,
        )
        session.commit()
        session.refresh(submission)
        background_tasks.add_task(self.evaluation_service.process_submission, submission.id, image_bytes)
        return SubmissionResponse.model_validate(submission)

    def list_submissions_for_student(self, session: Session, current_user, student_id: int) -> list[SubmissionResponse]:
        if current_user.role == UserRole.STUDENT and current_user.id != student_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        if current_user.role == UserRole.PARENT:
            link = session.get(ParentLink, {"parent_id": current_user.id, "student_id": student_id})
            if link is None:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        if current_user.role == UserRole.TEACHER:
            teacher_has_access = session.scalar(
                select(Classroom.id)
                .join(Enrollment, Enrollment.class_id == Classroom.id)
                .where(Classroom.teacher_id == current_user.id, Enrollment.student_id == student_id)
            )
            if teacher_has_access is None:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

        submissions = self.submission_repository.list_for_student(session, student_id)
        return [SubmissionResponse.model_validate(item) for item in submissions]
