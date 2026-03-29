from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.evaluation import Evaluation


class EvaluationRepository:
    def get_by_submission_id(self, session: Session, submission_id: int) -> Evaluation | None:
        return session.scalar(select(Evaluation).where(Evaluation.submission_id == submission_id))

    def upsert(self, session: Session, *, submission_id: int, payload: dict) -> Evaluation:
        evaluation = self.get_by_submission_id(session, submission_id)
        if evaluation is None:
            evaluation = Evaluation(submission_id=submission_id, **payload)
            session.add(evaluation)
            session.flush()
            return evaluation

        for key, value in payload.items():
            setattr(evaluation, key, value)
        session.flush()
        return evaluation
