from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.db import get_db_session
from app.schemas.evaluation import EvaluationResponse
from app.services.evaluation_service import EvaluationService

router = APIRouter()
evaluation_service = EvaluationService()


@router.get("/{submission_id}", response_model=EvaluationResponse)
def get_evaluation(
    submission_id: int,
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(get_current_user),
) -> EvaluationResponse:
    evaluation = evaluation_service.get_evaluation_for_submission(db, current_user, submission_id)
    return EvaluationResponse.model_validate(evaluation)
