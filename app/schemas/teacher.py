from pydantic import BaseModel


class TeacherStudentSummary(BaseModel):
    student_id: int
    student_name: str
    average_score: float


class WeakConceptSummary(BaseModel):
    concept: str
    count: int


class TeacherDashboardResponse(BaseModel):
    class_id: int
    avg_class_scores: dict[str, float]
    weak_concepts: list[WeakConceptSummary]
    student_ranking: list[TeacherStudentSummary]
    students_needing_attention: list[TeacherStudentSummary]
