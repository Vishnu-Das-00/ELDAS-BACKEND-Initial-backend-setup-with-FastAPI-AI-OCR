from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ExecutionBreakdown(BaseModel):
    algebra: bool = False
    trigonometry: bool = False
    integration: bool = False
    units: bool = False


class CognitiveAnalysisResult(BaseModel):
    understanding: bool
    concept: bool
    method: bool
    execution: ExecutionBreakdown
    memory: bool
    error_reason: str = Field(default="")


class EvaluationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    submission_id: int
    understanding: bool
    concept: bool
    method: bool
    execution_json: dict[str, bool]
    memory: bool
    error_reason: str
    created_at: datetime
