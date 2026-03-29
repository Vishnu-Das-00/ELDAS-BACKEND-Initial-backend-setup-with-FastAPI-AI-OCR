from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.db import get_db_session
from app.schemas.classroom import ClassroomCreateRequest, ClassroomDetailResponse, ClassroomJoinRequest, ClassroomResponse
from app.services.classroom_service import ClassroomService

router = APIRouter()
classroom_service = ClassroomService()


@router.post("/create", response_model=ClassroomResponse, status_code=201)
def create_classroom(
    payload: ClassroomCreateRequest,
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(get_current_user),
) -> ClassroomResponse:
    return classroom_service.create_classroom(db, current_user, payload)


@router.post("/join", response_model=ClassroomResponse)
def join_classroom(
    payload: ClassroomJoinRequest,
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(get_current_user),
) -> ClassroomResponse:
    return classroom_service.join_classroom(db, current_user, payload)


@router.get("/me", response_model=list[ClassroomDetailResponse])
def list_my_classrooms(
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(get_current_user),
) -> list[ClassroomDetailResponse]:
    return classroom_service.list_accessible_classrooms(db, current_user)
