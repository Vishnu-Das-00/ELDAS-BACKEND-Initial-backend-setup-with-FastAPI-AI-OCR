from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.progress import Progress


class ProgressRepository:
    def get(self, session: Session, *, student_id: int, subject: str) -> Progress | None:
        return session.get(Progress, {"student_id": student_id, "subject": subject})

    def list_for_student(self, session: Session, student_id: int) -> list[Progress]:
        query = select(Progress).where(Progress.student_id == student_id).order_by(Progress.subject.asc())
        return list(session.scalars(query).all())

    def upsert(self, session: Session, *, student_id: int, subject: str, skill_scores: dict) -> Progress:
        progress = self.get(session, student_id=student_id, subject=subject)
        if progress is None:
            progress = Progress(student_id=student_id, subject=subject, skill_scores=skill_scores)
            session.add(progress)
            session.flush()
            return progress

        progress.skill_scores = skill_scores
        session.flush()
        return progress
