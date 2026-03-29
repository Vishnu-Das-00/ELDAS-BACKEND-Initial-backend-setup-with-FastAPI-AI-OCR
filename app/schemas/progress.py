from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ProgressResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    student_id: int
    subject: str
    skill_scores: dict
    updated_at: datetime
