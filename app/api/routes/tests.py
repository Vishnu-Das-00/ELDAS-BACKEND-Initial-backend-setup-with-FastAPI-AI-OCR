from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.db import get_db_session
from app.schemas.test import TestCreateRequest, TestResponse
from app.services.test_service import TestService

router = APIRouter()
test_service = TestService()


@router.post("/create", response_model=TestResponse, status_code=201)
def create_test(
    payload: TestCreateRequest,
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(get_current_user),
) -> TestResponse:
    return test_service.create_test(db, current_user, payload)


@router.get("/{class_id}", response_model=list[TestResponse])
def get_class_tests(
    class_id: int,
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(get_current_user),
) -> list[TestResponse]:
    return test_service.get_class_tests(db, current_user, class_id)
