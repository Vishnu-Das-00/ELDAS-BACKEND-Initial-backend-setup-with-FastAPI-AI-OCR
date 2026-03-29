from fastapi import HTTPException, status

from app.ai.cognitive_engine import CognitiveEngine
from app.db.session import SessionLocal
from app.models.classroom import ParentLink
from app.repositories.evaluation_repository import EvaluationRepository
from app.repositories.submission_repository import SubmissionRepository
from app.services.notification_service import NotificationService
from app.services.ocr_service import OCRService
from app.services.progress_service import ProgressService
from app.utils.enums import SubmissionStatus, UserRole


class EvaluationService:
    def __init__(self) -> None:
        self.submission_repository = SubmissionRepository()
        self.evaluation_repository = EvaluationRepository()
        self.ocr_service = OCRService()
        self.cognitive_engine = CognitiveEngine()
        self.progress_service = ProgressService()
        self.notification_service = NotificationService()

    def process_submission(self, submission_id: int, image_bytes: bytes | None = None) -> None:
        with SessionLocal() as session:
            submission = self.submission_repository.get_by_id(session, submission_id)
            if submission is None:
                return

            try:
                submission.status = SubmissionStatus.PROCESSING
                session.flush()

                answer_text = (submission.answer_text or "").strip()
                if image_bytes:
                    extracted_text = self.ocr_service.extract_text_from_bytes(image_bytes)
                    submission.extracted_text = extracted_text
                    answer_text = f"{answer_text}\n{extracted_text}".strip() if answer_text else extracted_text

                analysis = self.cognitive_engine.analyze(submission.test, answer_text)
                evaluation = self.evaluation_repository.upsert(
                    session,
                    submission_id=submission.id,
                    payload={
                        "understanding": analysis.understanding,
                        "concept": analysis.concept,
                        "method": analysis.method,
                        "execution_json": analysis.execution.model_dump(),
                        "memory": analysis.memory,
                        "error_reason": analysis.error_reason,
                        "raw_response": analysis.model_dump(),
                    },
                )
                submission.status = SubmissionStatus.COMPLETED
                session.flush()
                self.progress_service.update_after_evaluation(session, submission, evaluation)
                self.notification_service.notify_after_evaluation(session, submission, evaluation)
                session.commit()
            except Exception as exc:
                session.rollback()
                self._mark_failed(submission_id, str(exc))

    def get_evaluation_for_submission(self, session, current_user, submission_id: int):
        submission = self.submission_repository.get_by_id(session, submission_id)
        if submission is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found.")
        if current_user.role == UserRole.STUDENT and submission.student_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        if current_user.role == UserRole.TEACHER and submission.test.classroom.teacher_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        if current_user.role == UserRole.PARENT:
            parent_link = session.get(ParentLink, {"parent_id": current_user.id, "student_id": submission.student_id})
            if parent_link is None:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

        if submission.evaluation is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evaluation not ready yet.")
        return submission.evaluation

    def _mark_failed(self, submission_id: int, error_message: str) -> None:
        with SessionLocal() as session:
            submission = self.submission_repository.get_by_id(session, submission_id)
            if submission is None:
                return
            submission.status = SubmissionStatus.FAILED
            self.evaluation_repository.upsert(
                session,
                submission_id=submission.id,
                payload={
                    "understanding": False,
                    "concept": False,
                    "method": False,
                    "execution_json": {
                        "algebra": False,
                        "trigonometry": False,
                        "integration": False,
                        "units": False,
                    },
                    "memory": False,
                    "error_reason": error_message,
                    "raw_response": {"error": error_message},
                },
            )
            session.commit()
