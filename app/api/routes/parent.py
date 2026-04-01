from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import require_roles
from app.api.dependencies.db import get_db_session
from app.schemas.classroom import ParentLinkRequest
from app.schemas.parent import ParentDashboardResponse
from app.schemas.user import UserResponse
from app.services.classroom_service import ClassroomService
from app.services.dashboard_service import DashboardService
from app.utils.enums import UserRole

router = APIRouter()
classroom_service = ClassroomService()
dashboard_service = DashboardService()


@router.post("/link")
def link_child(
    payload: ParentLinkRequest,
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(require_roles(UserRole.PARENT)),
) -> dict[str, str]:
    return classroom_service.link_parent(db, current_user, payload.student_id)


@router.get("/links", response_model=list[UserResponse])
def list_linked_students(
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(require_roles(UserRole.PARENT)),
) -> list[UserResponse]:
    return classroom_service.list_linked_students(db, current_user)


@router.get("/student/{student_id}", response_model=ParentDashboardResponse)
def get_child_dashboard(
    student_id: int,
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(require_roles(UserRole.PARENT)),
) -> ParentDashboardResponse:
    return dashboard_service.get_parent_dashboard(db, current_user, student_id)
