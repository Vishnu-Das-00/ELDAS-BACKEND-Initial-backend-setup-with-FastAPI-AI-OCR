from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.classroom import Classroom, Enrollment, ParentLink
from app.models.evaluation import Evaluation
from app.models.progress import Progress
from app.models.submission import Submission
from app.repositories.progress_repository import ProgressRepository
from app.schemas.progress import ProgressResponse
from app.utils.enums import UserRole
from app.utils.score import bool_to_score


class ProgressService:
    def __init__(self) -> None:
        self.progress_repository = ProgressRepository()

    def update_after_evaluation(self, session: Session, submission: Submission, evaluation: Evaluation) -> Progress:
        subject = submission.test.subject
        progress = self.progress_repository.get(session, student_id=submission.student_id, subject=subject)

        current_attempts = 0
        averages = {
            "understanding": 0.0,
            "concept": 0.0,
            "method": 0.0,
            "memory": 0.0,
            "execution": {
                "algebra": 0.0,
                "trigonometry": 0.0,
                "integration": 0.0,
                "units": 0.0,
            },
        }
        if progress:
            current_attempts = int(progress.skill_scores.get("attempts", 0))
            averages = progress.skill_scores.get("averages", averages)

        new_attempts = current_attempts + 1
        latest_scores = {
            "understanding": bool_to_score(evaluation.understanding),
            "concept": bool_to_score(evaluation.concept),
            "method": bool_to_score(evaluation.method),
            "memory": bool_to_score(evaluation.memory),
            "execution": {key: bool_to_score(value) for key, value in evaluation.execution_json.items()},
        }

        updated_averages = {
            "understanding": round(
                ((averages["understanding"] * current_attempts) + latest_scores["understanding"]) / new_attempts,
                4,
            ),
            "concept": round(((averages["concept"] * current_attempts) + latest_scores["concept"]) / new_attempts, 4),
            "method": round(((averages["method"] * current_attempts) + latest_scores["method"]) / new_attempts, 4),
            "memory": round(((averages["memory"] * current_attempts) + latest_scores["memory"]) / new_attempts, 4),
            "execution": {},
        }

        for key, value in latest_scores["execution"].items():
            previous = averages.get("execution", {}).get(key, 0.0)
            updated_averages["execution"][key] = round(((previous * current_attempts) + value) / new_attempts, 4)

        skill_scores = {
            "attempts": new_attempts,
            "averages": updated_averages,
        }
        return self.progress_repository.upsert(
            session,
            student_id=submission.student_id,
            subject=subject,
            skill_scores=skill_scores,
        )

    def get_student_progress(self, session: Session, current_user, student_id: int) -> list[ProgressResponse]:
        if current_user.role == UserRole.STUDENT and current_user.id != student_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        if current_user.role == UserRole.PARENT:
            linked = session.get(ParentLink, {"parent_id": current_user.id, "student_id": student_id})
            if linked is None:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        if current_user.role == UserRole.TEACHER:
            teacher_has_access = session.scalar(
                select(Classroom.id)
                .join(Enrollment, Enrollment.class_id == Classroom.id)
                .where(Classroom.teacher_id == current_user.id, Enrollment.student_id == student_id)
            )
            if teacher_has_access is None:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

        progress_records = self.progress_repository.list_for_student(session, student_id)
        return [ProgressResponse.model_validate(record) for record in progress_records]
