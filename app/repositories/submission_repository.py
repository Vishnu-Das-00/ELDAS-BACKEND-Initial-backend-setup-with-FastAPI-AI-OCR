from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.classroom import Classroom
from app.models.submission import Submission
from app.models.test import Test


class SubmissionRepository:
    def create(
        self,
        session: Session,
        *,
        student_id: int,
        test_id: int,
        answer_text: str | None,
        image_url: str | None,
    ) -> Submission:
        submission = Submission(
            student_id=student_id,
            test_id=test_id,
            answer_text=answer_text,
            image_url=image_url,
        )
        session.add(submission)
        session.flush()
        session.refresh(submission)
        return submission

    def get_by_id(self, session: Session, submission_id: int) -> Submission | None:
        query = (
            select(Submission)
            .options(
                joinedload(Submission.student),
                joinedload(Submission.test).joinedload(Test.questions),
                joinedload(Submission.test).joinedload(Test.classroom).joinedload(Classroom.teacher),
                joinedload(Submission.evaluation),
            )
            .where(Submission.id == submission_id)
        )
        return session.scalar(query)

    def list_for_student(self, session: Session, student_id: int) -> list[Submission]:
        query = (
            select(Submission)
            .options(joinedload(Submission.evaluation), joinedload(Submission.test))
            .where(Submission.student_id == student_id)
            .order_by(Submission.created_at.desc())
        )
        return list(session.scalars(query).unique().all())
