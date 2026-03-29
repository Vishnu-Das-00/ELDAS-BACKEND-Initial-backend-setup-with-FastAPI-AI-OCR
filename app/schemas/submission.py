from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.evaluation import EvaluationResponse
from app.utils.enums import SubmissionStatus


class SubmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    test_id: int
    answer_text: str | None
    extracted_text: str | None
    image_url: str | None
    status: SubmissionStatus
    created_at: datetime
    evaluation: EvaluationResponse | None = None
