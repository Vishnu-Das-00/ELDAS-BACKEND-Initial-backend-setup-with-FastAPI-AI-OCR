from pydantic import BaseModel


class ParentPerformanceItem(BaseModel):
    submission_id: int
    subject: str
    chapter: str
    score: float
    error_reason: str


class ParentDashboardResponse(BaseModel):
    student_id: int
    progress: list[dict]
    recent_performance: list[ParentPerformanceItem]
    warnings: list[str]
