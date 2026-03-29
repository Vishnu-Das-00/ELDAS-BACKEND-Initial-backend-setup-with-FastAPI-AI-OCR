from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.test import Question, Test


class TestRepository:
    def create(self, session: Session, *, class_id: int, subject: str, chapter: str, questions: list[dict]) -> Test:
        test = Test(class_id=class_id, subject=subject, chapter=chapter)
        session.add(test)
        session.flush()
        for question_payload in questions:
            session.add(Question(test_id=test.id, **question_payload))
        session.flush()
        session.refresh(test)
        return self.get_by_id(session, test.id) or test

    def get_by_id(self, session: Session, test_id: int) -> Test | None:
        query = (
            select(Test)
            .options(joinedload(Test.questions), joinedload(Test.classroom))
            .where(Test.id == test_id)
        )
        return session.scalar(query)

    def list_by_class(self, session: Session, class_id: int) -> list[Test]:
        query = (
            select(Test)
            .options(joinedload(Test.questions))
            .where(Test.class_id == class_id)
            .order_by(Test.created_at.desc())
        )
        return list(session.scalars(query).unique().all())
