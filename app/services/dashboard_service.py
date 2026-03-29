from collections import Counter, defaultdict

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.classroom import Classroom, Enrollment, ParentLink
from app.models.progress import Progress
from app.models.submission import Submission
from app.models.user import User
from app.schemas.parent import ParentDashboardResponse, ParentPerformanceItem
from app.schemas.teacher import TeacherDashboardResponse, TeacherStudentSummary
from app.utils.score import average, calculate_overall_score


class DashboardService:
    def get_teacher_dashboard(self, session: Session, teacher, class_id: int) -> TeacherDashboardResponse:
        classroom = session.get(Classroom, class_id)
        if classroom is None or classroom.teacher_id != teacher.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

        student_ids = list(session.scalars(select(Enrollment.student_id).where(Enrollment.class_id == class_id)).all())
        if not student_ids:
            return TeacherDashboardResponse(
                class_id=class_id,
                avg_class_scores={},
                weak_concepts=[],
                student_ranking=[],
                students_needing_attention=[],
            )

        submissions = list(
            session.scalars(
                select(Submission)
                .where(Submission.student_id.in_(student_ids))
                .order_by(Submission.created_at.desc())
            ).all()
        )
        score_buckets: dict[str, list[float]] = defaultdict(list)
        weak_concepts = Counter()
        student_scores: dict[int, list[float]] = defaultdict(list)

        for submission in submissions:
            if submission.test.class_id != class_id or submission.evaluation is None:
                continue
            evaluation = submission.evaluation
            overall_score = calculate_overall_score(
                evaluation.understanding,
                evaluation.concept,
                evaluation.method,
                evaluation.execution_json,
                evaluation.memory,
            )
            student_scores[submission.student_id].append(overall_score)
            score_buckets["understanding"].append(float(evaluation.understanding))
            score_buckets["concept"].append(float(evaluation.concept))
            score_buckets["method"].append(float(evaluation.method))
            score_buckets["memory"].append(float(evaluation.memory))
            for key, value in evaluation.execution_json.items():
                score_buckets[f"execution.{key}"].append(float(value))

            if not evaluation.concept or overall_score < 0.6:
                for question in submission.test.questions:
                    for concept in question.concepts:
                        weak_concepts[concept] += 1

        student_names = {
            user.id: user.name
            for user in session.scalars(select(User).where(User.id.in_(student_ids))).all()
        }

        ranking = sorted(
            [
                TeacherStudentSummary(
                    student_id=student_id,
                    student_name=student_names.get(student_id, f"Student {student_id}"),
                    average_score=average(scores),
                )
                for student_id, scores in student_scores.items()
            ],
            key=lambda item: item.average_score,
            reverse=True,
        )

        attention = [item for item in ranking if item.average_score < 0.6]

        return TeacherDashboardResponse(
            class_id=class_id,
            avg_class_scores={key: average(values) for key, values in score_buckets.items()},
            weak_concepts=[{"concept": concept, "count": count} for concept, count in weak_concepts.most_common(10)],
            student_ranking=ranking,
            students_needing_attention=attention,
        )

    def get_parent_dashboard(self, session: Session, parent, student_id: int) -> ParentDashboardResponse:
        link = session.get(ParentLink, {"parent_id": parent.id, "student_id": student_id})
        if link is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

        progress = session.scalars(select(Progress).where(Progress.student_id == student_id)).all()
        submissions = session.scalars(
            select(Submission).where(Submission.student_id == student_id).order_by(Submission.created_at.desc())
        ).all()

        recent_performance = []
        warnings = []
        for submission in submissions[:10]:
            evaluation = submission.evaluation
            if evaluation is None:
                continue
            score = calculate_overall_score(
                evaluation.understanding,
                evaluation.concept,
                evaluation.method,
                evaluation.execution_json,
                evaluation.memory,
            )
            recent_performance.append(
                ParentPerformanceItem(
                    submission_id=submission.id,
                    subject=submission.test.subject,
                    chapter=submission.test.chapter,
                    score=score,
                    error_reason=evaluation.error_reason,
                )
            )
            if score < 0.6:
                warnings.append(f"Low performance in {submission.test.subject} - {submission.test.chapter}.")

        return ParentDashboardResponse(
            student_id=student_id,
            progress=[
                {"subject": item.subject, "skill_scores": item.skill_scores, "updated_at": item.updated_at.isoformat()}
                for item in progress
            ],
            recent_performance=recent_performance,
            warnings=list(dict.fromkeys(warnings)),
        )
